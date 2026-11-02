#!/usr/bin/env node
// Stop: before Claude ends its turn, typecheck the project and run the tests related to the
// changed source files. If anything fails, exit 2 so Claude keeps working on it.
// Skips quickly when no source file changed or when the same change set already passed.
// Commands live in config.json → sourceFiles / typecheck / relatedTests.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig, projectRoot, readInput, regex, run } from './lib.mjs';

const input = readInput();
if (input.stop_hook_active) process.exit(0); // already continuing because of this hook

const root = projectRoot(input);
const config = loadConfig();
const sourceFiles = regex(config.sourceFiles);
if (!sourceFiles) process.exit(0);

const git = spawnSync('git', ['status', '--porcelain', '--untracked-files=all'], {
  cwd: root,
  encoding: 'utf8',
});
if (git.status !== 0) process.exit(0); // not a git repo yet

const changed = git.stdout
  .split('\n')
  .filter((line) => line && !line.startsWith(' D') && !line.startsWith('D '))
  .map((line) => line.slice(3).split(' -> ').pop())
  .filter((file) => sourceFiles.test(file) && existsSync(join(root, file)));
if (changed.length === 0) process.exit(0);

const hash = createHash('sha256');
for (const file of changed.sort()) hash.update(file).update(readFileSync(join(root, file)));
const digest = hash.digest('hex');
const cacheDir = join(root, '.claude', '.cache');
const cacheFile = join(cacheDir, 'last-green');
if (existsSync(cacheFile) && readFileSync(cacheFile, 'utf8') === digest) process.exit(0);

const failures = [];
const typecheck = run(root, config.typecheck?.command);
if (typecheck && !typecheck.ok) failures.push(`## Tipos\n${typecheck.output}`);

const tests = run(root, config.relatedTests?.command, { files: changed });
if (tests && !tests.ok) failures.push(`## Tests\n${tests.output}`);

if (failures.length > 0) {
  process.stderr.write(
    `Antes de terminar, corrige estos fallos (archivos cambiados: ${changed.join(', ')}):\n\n` +
      failures.join('\n\n').slice(0, 6000),
  );
  process.exit(2);
}

mkdirSync(cacheDir, { recursive: true });
writeFileSync(cacheFile, digest);
process.exit(0);
