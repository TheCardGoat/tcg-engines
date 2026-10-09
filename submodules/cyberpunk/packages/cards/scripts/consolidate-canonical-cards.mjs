#!/usr/bin/env node
// One-shot migration: canonical-card consolidation.
//
// Moves every authored card file from the legacy set-nested layout
//   src/<set>/<type>/<slug>.ts
// into the canonical per-type layout
//   src/cards/<type>/<slug>.ts
// then removes the emptied legacy set directories. File contents are untouched
// — per-type barrels and printing metadata must be updated deliberately with
// the authored cards. No generator rewrites card definitions.
//
// Refuses to run if the target layout already holds a file for a slug, so a
// genuine cross-set slug collision surfaces as a hard error. The collision
// preflight runs BEFORE any mutation — a collision must never destroy the
// skipped source file's only copy.

import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const cardsSrc = resolve(currentDir, "../src");

const SET_DIRS = [
  "promo",
  "PRM01",
  "boxtoppersretail",
  "theheistretailstarterdeck",
  "embracingpowerretailstarterdeck",
  "welcometonightcityretail",
];

const TYPE_DIRS = ["legends", "units", "gear", "programs"];

// Preflight: enumerate every move and every collision across ALL sets before
// touching the filesystem.
const moves = [];
const collisions = [];

for (const set of SET_DIRS) {
  const setDir = join(cardsSrc, set);
  if (!existsSync(setDir)) continue;

  for (const type of TYPE_DIRS) {
    const typeDir = join(setDir, type);
    if (!existsSync(typeDir)) continue;

    const targetDir = join(cardsSrc, "cards", type);
    mkdirSync(targetDir, { recursive: true });

    for (const entry of readdirSync(typeDir)) {
      if (entry === "index.ts" || !entry.endsWith(".ts")) continue;

      const target = join(targetDir, entry);
      if (existsSync(target)) {
        collisions.push(`${set}/${type}/${entry} -> cards/${type}/${entry}`);
        continue;
      }

      moves.push({ from: join(typeDir, entry), to: target });
    }
  }
}

if (collisions.length > 0) {
  console.error(
    "Slug collisions between legacy set files and the canonical layout — nothing was moved:",
  );
  for (const collision of collisions) console.error(`  ${collision}`);
  process.exit(1);
}

for (const move of moves) renameSync(move.from, move.to);

for (const set of SET_DIRS) {
  const setDir = join(cardsSrc, set);
  if (existsSync(setDir)) rmSync(setDir, { recursive: true, force: true });
}

console.log(`Moved ${moves.length} authored card files to ${join(cardsSrc, "cards")}`);
