#!/usr/bin/env node
// PostToolUse (Edit|Write|MultiEdit): format + lint the edited file and report what's left.
// Exit 2 sends stderr back to Claude so it fixes the problem immediately.
// Commands live in config.json → format / lint. A tool that is not installed is skipped.
import { existsSync } from 'node:fs';
import { relative } from 'node:path';
import { loadConfig, projectRoot, readInput, regex, run } from './lib.mjs';

const input = readInput();
const filePath = input.tool_input?.file_path;
const root = projectRoot(input);
if (!filePath || !existsSync(filePath)) process.exit(0);

const rel = relative(root, filePath);
const config = loadConfig();
if (rel.startsWith('..') || regex(config.skipPaths)?.test(rel)) process.exit(0);

const { format, lint } = config;

if (format && regex(format.files)?.test(rel)) run(root, format.command, { file: filePath });

if (lint && regex(lint.files)?.test(rel)) {
  const result = run(root, lint.command, { file: filePath });
  if (result && !result.ok) {
    process.stderr.write(
      `El linter encontró problemas en ${rel}. Corrígelos antes de seguir:\n` +
        `${result.output.slice(0, 4000)}\n`,
    );
    process.exit(2);
  }
}

process.exit(0);
