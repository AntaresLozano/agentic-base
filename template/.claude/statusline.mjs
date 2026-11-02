#!/usr/bin/env node
// Status line: model · context used (tokens and %) · session cost.
// Warns past ~100k tokens, where model quality starts to drop ("dumb zone").
import { readFileSync } from 'node:fs';

const SMART_ZONE_LIMIT = 100_000;

let data = {};
try {
  data = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  // keep defaults
}

const model = data.model?.display_name ?? 'Claude';
const ctx = data.context_window ?? {};
const size = ctx.context_window_size ?? 200_000;
const pct = typeof ctx.used_percentage === 'number' ? ctx.used_percentage : 0;
const used = Math.round((pct / 100) * size);
const cost = data.cost?.total_cost_usd;

const color =
  used >= SMART_ZONE_LIMIT ? '\x1b[31m' : used >= SMART_ZONE_LIMIT * 0.7 ? '\x1b[33m' : '\x1b[32m';
const reset = '\x1b[0m';
const k = (n) => `${Math.round(n / 1000)}k`;

const parts = [
  model,
  `${color}ctx ${k(used)}/${k(size)} (${Math.round(pct)}%)${reset}`,
  used >= SMART_ZONE_LIMIT ? `${color}termina la porción y /clear${reset}` : null,
  typeof cost === 'number' ? `$${cost.toFixed(2)}` : null,
].filter(Boolean);

process.stdout.write(parts.join(' · '));
