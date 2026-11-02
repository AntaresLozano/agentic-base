#!/usr/bin/env node
// PreToolUse (Edit|Write|MultiEdit): protects files the AI must not touch on its own.
// Patterns live in config.json → protect.deny (always blocked) and protect.ask (needs approval).
import { relative } from 'node:path';
import { loadConfig, projectRoot, readInput } from './lib.mjs';

const input = readInput();
const filePath = input.tool_input?.file_path;
if (!filePath) process.exit(0);

const rel = relative(projectRoot(input), filePath);
const { protect = {} } = loadConfig();

function decide(decision, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: decision,
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

for (const decision of ['deny', 'ask']) {
  for (const { pattern, reason } of protect[decision] ?? []) {
    if (new RegExp(pattern).test(rel)) decide(decision, reason);
  }
}
process.exit(0);
