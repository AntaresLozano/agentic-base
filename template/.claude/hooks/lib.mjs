// Shared helpers for the hooks. Every stack-specific value lives in ./config.json so the hooks
// themselves never change between projects. See manual/05-adaptar-a-tu-stack.md.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return {};
  }
}

export function projectRoot(input) {
  return process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
}

export function loadConfig() {
  const file = join(here, 'config.json');
  if (!existsSync(file)) return {};
  return JSON.parse(readFileSync(file, 'utf8'));
}

export const regex = (source) => (source ? new RegExp(source) : null);

/**
 * Runs a configured command. `{file}` is replaced by one path and `{files}` expands to many.
 * Returns null when the tool is not installed (missing local binary or not on PATH), so a
 * project that does not use that tool simply skips the step.
 */
export function run(root, command, { file, files = [] } = {}) {
  if (!Array.isArray(command) || command.length === 0) return null;
  const args = command.flatMap((part) => {
    if (part === '{files}') return files;
    if (part === '{file}') return file ? [file] : [];
    return [part];
  });
  const [bin, ...rest] = args;
  const isPath = bin.includes('/');
  const resolved = isPath && !isAbsolute(bin) ? join(root, bin) : bin;
  if (isPath && !existsSync(resolved)) return null;

  const result = spawnSync(resolved, rest, { cwd: root, encoding: 'utf8' });
  if (result.error?.code === 'ENOENT') return null;
  return {
    ok: result.status === 0,
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim(),
  };
}
