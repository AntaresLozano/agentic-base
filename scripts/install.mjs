#!/usr/bin/env node
// Installs the agentic base into a project (by default the current directory).
//
//   node <ruta-a-agentic-base>/scripts/install.mjs [--stack expo] [--name "Mi App"] [--force] [--dry-run]
//
// Copies template/ and, on top of it, stacks/<stack>/files/. Fills the {{PLACEHOLDERS}}, appends
// the needed lines to .gitignore and merges the stack's scripts into package.json.
// Existing files that differ are never overwritten unless --force is passed.
import {
  appendFileSync,
  chmodSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const baseDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// --- Arguments -------------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

if (flag('help') || flag('h')) {
  const stacks = readdirSync(join(baseDir, 'stacks')).join(', ');
  console.log(`Uso: node scripts/install.mjs [opciones]

  --target <dir>   Proyecto donde instalar (por defecto, el directorio actual)
  --stack <name>   Perfil de stack: ${stacks} (por defecto, ninguno: solo el núcleo)
  --name <name>    Nombre del proyecto (por defecto, app.json, package.json o la carpeta)
  --force          Sobrescribe archivos existentes que difieran
  --dry-run        Muestra lo que haría sin escribir nada`);
  process.exit(0);
}

const target = resolve(option('target') ?? process.cwd());
const stack = option('stack');
const force = flag('force');
const dryRun = flag('dry-run');

if (target === baseDir || target.startsWith(`${baseDir}/`)) {
  fail('Ejecuta el instalador desde la raíz de tu proyecto, no dentro de agentic-base.');
}
if (!existsSync(target)) fail(`No existe el directorio ${target}.`);

const stackDir = stack ? join(baseDir, 'stacks', stack) : null;
if (stackDir && !existsSync(stackDir)) fail(`No existe el perfil de stack "${stack}".`);
const stackManifest = stackDir ? readJson(join(stackDir, 'stack.json')) : {};

// --- Placeholders ----------------------------------------------------------------------------

const appJson = readJson(join(target, 'app.json'))?.expo ?? {};
const packageJson = readJson(join(target, 'package.json'));
const projectName = option('name') ?? appJson.name ?? packageJson?.name ?? basename(target);
const slug = projectName
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const placeholders = {
  PROJECT_NAME: projectName,
  TODAY: new Date().toISOString().slice(0, 10),
  APP_SCHEME: appJson.scheme ?? slug,
  APP_ID: appJson.ios?.bundleIdentifier ?? appJson.android?.package,
};

const fill = (text) =>
  text.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) => placeholders[key] ?? match);

// --- Plan the copy (stack files override template files) -------------------------------------

const plan = new Map();
for (const root of [join(baseDir, 'template'), stackDir && join(stackDir, 'files')]) {
  if (!root) continue;
  for (const file of walk(root)) plan.set(relative(root, file), file);
}

const report = { created: [], updated: [], unchanged: [], skipped: [] };
const unresolved = new Set();

for (const [rel, source] of [...plan].sort(([a], [b]) => a.localeCompare(b))) {
  const dest = join(target, rel);
  const content = fill(readFileSync(source, 'utf8'));
  for (const [, key] of content.matchAll(/\{\{([A-Z_]+)\}\}/g)) unresolved.add(`${key} (${rel})`);

  if (existsSync(dest)) {
    if (readFileSync(dest, 'utf8') === content) {
      report.unchanged.push(rel);
      continue;
    }
    if (!force) {
      report.skipped.push(rel);
      continue;
    }
    report.updated.push(rel);
  } else {
    report.created.push(rel);
  }

  if (!dryRun) {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, content);
    chmodSync(dest, statSync(source).mode);
  }
}

// --- .gitignore ------------------------------------------------------------------------------

const ignoreLines = [
  '.claude/settings.local.json',
  '.claude/.cache/',
  ...(stackManifest.gitignore ?? []),
];
const gitignorePath = join(target, '.gitignore');
const currentIgnore = existsSync(gitignorePath) ? readFileSync(gitignorePath, 'utf8') : '';
const missingIgnore = ignoreLines.filter((line) => !currentIgnore.split('\n').includes(line));
if (missingIgnore.length > 0 && !dryRun) {
  const prefix = currentIgnore && !currentIgnore.endsWith('\n') ? '\n' : '';
  appendFileSync(
    gitignorePath,
    `${prefix}\n# Base agéntica (Claude Code)\n${missingIgnore.join('\n')}\n`,
  );
}

// --- package.json ----------------------------------------------------------------------------

const scriptNotes = [];
if (stackManifest.packageJson && packageJson) {
  const { scripts = {}, ...rest } = stackManifest.packageJson;
  packageJson.scripts ??= {};
  for (const [name, command] of Object.entries(scripts)) {
    const current = packageJson.scripts[name];
    if (current === command) continue;
    if (current && !force) {
      scriptNotes.push(`script "${name}" ya existe ("${current}"); el perfil propone "${command}"`);
      continue;
    }
    packageJson.scripts[name] = command;
  }
  for (const [key, value] of Object.entries(rest)) packageJson[key] ??= value;
  if (!dryRun)
    writeFileSync(join(target, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`);
} else if (stackManifest.packageJson) {
  scriptNotes.push('no hay package.json: crea el proyecto con su herramienta oficial y reinstala');
}

// --- Report ----------------------------------------------------------------------------------

const list = (title, items) => {
  if (items.length === 0) return;
  console.log(`\n${title} (${items.length})`);
  for (const item of items) console.log(`  ${item}`);
};

console.log(`${dryRun ? '[simulación] ' : ''}Base agéntica → ${target}`);
console.log(`Proyecto: ${projectName} · Stack: ${stack ?? 'ninguno (solo núcleo)'}`);
list('Creados', report.created);
list('Sobrescritos (--force)', report.updated);
list('Omitidos porque ya existen y difieren (usa --force para sobrescribir)', report.skipped);
if (missingIgnore.length > 0) list('Añadido a .gitignore', missingIgnore);
list('package.json', scriptNotes);
list('Placeholders sin resolver (rellénalos a mano)', [...unresolved]);

console.log(`
Siguientes pasos
  1. Abre CLAUDE.md, AGENTS.md y .claude/hooks/config.json y completa lo marcado con ADAPTAR.
  2. Crea las etiquetas del tablero: ./scripts/setup-github-labels.sh (requiere gh y repo remoto).
  3. Abre Claude Code en el proyecto y empieza la fase 1: /grill-me <tu idea>.${
    stack ? `\n  4. Pasos propios del stack: ${join(stackDir, 'README.md')}` : ''
  }
Manual: ${join(baseDir, 'manual', 'README.md')}`);

// --- Helpers ---------------------------------------------------------------------------------

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.name === '.DS_Store') return [];
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function readJson(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : undefined;
}

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}
