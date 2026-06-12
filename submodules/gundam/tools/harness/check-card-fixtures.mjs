#!/usr/bin/env node
// tools/harness/check-card-fixtures.mjs
//
// Behavioral sensor for card implementations. Every card definition file
// (packages/cards/src/cards/**/*.ts, excluding tests + index.ts) must have:
//
//   1. A sibling *.test.ts file.
//   2. At least one `it(` / `test(` block in that test file.
//
// Rationale: cards are data, but their behavior is defined by their `effects`
// array. The test is the executable specification — without it, we have no
// way to know the card actually does what its `effect` text says. This is the
// "approved fixtures" pattern from Böckeler's behavior-harness essay,
// adapted to cards: every card ships with at least one fixture that pins down
// its behavior.
//
// Exit code:
//   0 — every card has a meaningful test sibling
//   1 — at least one card is missing a test (or its test is empty)

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const CARDS_DIR = join(ROOT, "packages", "cards", "src", "cards");
const ALLOWLIST_PATH = join(ROOT, "tools", "harness", "card-fixture-allowlist.txt");

let allowlist;
try {
  const raw = await readFile(ALLOWLIST_PATH, "utf8");
  allowlist = new Set(
    raw
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#")),
  );
} catch {
  allowlist = new Set();
}

const missing = [];
const empty = [];
let inspected = 0;

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

try {
  await stat(CARDS_DIR);
} catch {
  console.error(`❌ card fixtures: cards directory missing at ${CARDS_DIR}`);
  process.exit(1);
}

for await (const abs of walk(CARDS_DIR)) {
  const rel = relative(ROOT, abs);
  if (!rel.endsWith(".ts")) continue;
  if (rel.endsWith(".test.ts")) continue;
  if (rel.endsWith(`${sep}index.ts`)) continue;
  // Skip set-level aggregator files that just re-export.
  // Heuristic: files directly under a set directory (no card-type subdir).
  const segments = rel.split(sep);
  // packages/cards/src/cards/<set>/<type>/<file>.ts has 7 segments incl. .ts
  if (segments.length < 7) continue;

  // Skip cards with no behavioral surface (empty effects + empty keywordEffects).
  // These are pure stat/system cards (EX Base, EX Resource, vanilla units).
  // A behavioral test would assert nothing useful.
  const cardSrc = await readFile(abs, "utf8");
  // Detect non-empty arrays: an open `[` followed by an object literal OR a
  // string literal. The latter form covers `keywordEffects: ['Blocker']`,
  // which earlier versions of this script missed.
  const hasEffects = /effects\s*:\s*\[\s*(?:\{|['"`])/.test(cardSrc);
  const hasKeywords = /keywordEffects\s*:\s*\[\s*(?:\{|['"`])/.test(cardSrc);
  if (!hasEffects && !hasKeywords) continue;
  if (allowlist.has(rel)) continue;

  inspected++;
  const testPath = abs.replace(/\.ts$/, ".test.ts");
  const testRel = rel.replace(/\.ts$/, ".test.ts");
  try {
    const content = await readFile(testPath, "utf8");
    // Look for any test declaration.
    if (!/\b(it|test)\s*\(\s*['"`]/.test(content)) {
      empty.push(testRel);
    }
  } catch {
    missing.push(rel);
  }
}

if (missing.length === 0 && empty.length === 0) {
  console.log(`✅ card fixtures: ok (${inspected} cards, every one has a non-empty test sibling)`);
  process.exit(0);
}

console.error(`❌ card fixtures: ${missing.length + empty.length} card(s) need fixtures`);
console.error(`   See docs/design-docs/card-fixtures.md for the required pattern.\n`);
if (missing.length) {
  console.error("Cards missing a sibling .test.ts:");
  for (const m of missing.slice(0, 30)) console.error(`  - ${m}`);
  if (missing.length > 30) console.error(`  … and ${missing.length - 30} more`);
  console.error("");
}
if (empty.length) {
  console.error("Cards whose .test.ts has no it()/test() block:");
  for (const m of empty.slice(0, 30)) console.error(`  - ${m}`);
  if (empty.length > 30) console.error(`  … and ${empty.length - 30} more`);
  console.error("");
}
console.error(
  "Fix: read .claude/skills/implement-card.md, then add a test exercising every entry in the card's effects[] array.",
);
process.exit(1);
