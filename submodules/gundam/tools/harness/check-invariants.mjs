#!/usr/bin/env node
// tools/harness/check-invariants.mjs
//
// Computational sensor for repository-level invariants documented in
// docs/design-docs/core-beliefs.md and docs/architecture.md.
//
// Why grep, not oxlint plugins:
//   - Oxlint plugin support for project-specific cross-package rules is
//     still limited; these checks are simple enough to express as path
//     + content patterns and run in <1s on the whole tree.
//   - Error messages here include remediation instructions so an agent
//     can self-correct without round-tripping with a human (the "positive
//     prompt injection" pattern from Böckeler's harness essay).
//
// Exit code:
//   0 — all invariants hold
//   1 — at least one violation; details printed to stderr
//
// Run via `pnpm check:invariants` (also wired into CI).

import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const violations = [];

/**
 * @typedef {object} Invariant
 * @property {string} id
 * @property {string} description
 * @property {string} remediation
 * @property {(absPath: string, relPath: string, content: string) => string[]} check
 *   Returns an array of human-readable violation messages (one per offending
 *   line); empty array means OK.
 * @property {(relPath: string) => boolean} matches  Files this rule applies to.
 */

/** @type {Invariant[]} */
const INVARIANTS = [
  {
    id: "cards-no-engine-runtime",
    description:
      "packages/cards/src/**/*.ts must not import from @tcg/gundam-engine. Cards are data, not code.",
    remediation:
      "Express the behavior using the effect DSL in @tcg/gundam-types instead. If the type you need isn't exported, add it to types — don't reach into the engine.",
    matches: (rel) =>
      rel.startsWith(`packages${sep}cards${sep}src${sep}`) &&
      rel.endsWith(".ts") &&
      !rel.includes(".test."),
    check: (_, rel, content) => {
      const out = [];
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (/from\s+["']@tcg\/gundam-engine/.test(lines[i])) {
          out.push(`${rel}:${i + 1}  imports from @tcg/gundam-engine`);
        }
      }
      return out;
    },
  },
  {
    id: "simulator-no-deep-engine-import",
    description:
      "migrated simulator UI must use the curated @tcg/gundam-engine surface, not deep paths like @tcg/gundam-engine/automation/...",
    // Today the engine's package.json `exports` map exposes only the root.
    // If a curated subpath export (e.g. @tcg/gundam-engine/types) is ever
    // added, allow it here explicitly rather than weakening the rule.
    remediation:
      "Import from '@tcg/gundam-engine' (the package root). If the symbol you need isn't exported there, add it to packages/engine/src/index.ts and treat that as a deliberate API change.",
    matches: (rel) =>
      rel.startsWith(`apps${sep}simulator${sep}src${sep}`) &&
      (rel.endsWith(".ts") || rel.endsWith(".tsx")) &&
      !rel.includes(".test."),
    check: (_, rel, content) => {
      const out = [];
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        // Match `@tcg/gundam-engine/<anything>` but NOT bare `@tcg/gundam-engine`.
        if (/from\s+["']@tcg\/gundam-engine\/[^"']+["']/.test(lines[i])) {
          out.push(`${rel}:${i + 1}  ${lines[i].trim()}`);
        }
      }
      return out;
    },
  },
  // NOTE: a "no-private-field-leak" computational rule was prototyped here but
  // removed. The heuristic (line-level grep for .opponent.hand etc.) had both
  // false positives (matched comments, type aliases, selector keys) and false
  // negatives (any line that happens to mention `filterMatchView` was given
  // a pass). Private-field hygiene is now checked inferentially by
  // .claude/skills/review.md (criterion 2: engine invariants). The invariant
  // itself remains documented in docs/design-docs/core-beliefs.md §8.
];

const IGNORE_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".vite",
  "paraglide",
  ".git",
  "coverage",
  "playwright-report",
  "test-results",
]);

/**
 * @param {string} dir
 * @returns {AsyncGenerator<string>}
 */
async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

let scanned = 0;
for await (const abs of walk(ROOT)) {
  const rel = relative(ROOT, abs);
  const applicable = INVARIANTS.filter((inv) => inv.matches(rel));
  if (applicable.length === 0) continue;

  scanned++;
  const content = await readFile(abs, "utf8");
  for (const inv of applicable) {
    const hits = inv.check(abs, rel, content);
    for (const hit of hits) {
      violations.push({ inv, hit });
    }
  }
}

if (violations.length === 0) {
  console.log(
    `✅ harness invariants: ok (${scanned} files scanned, ${INVARIANTS.length} invariants)`,
  );
  process.exit(0);
}

const byId = new Map();
for (const v of violations) {
  if (!byId.has(v.inv.id)) byId.set(v.inv.id, { inv: v.inv, hits: [] });
  byId.get(v.inv.id).hits.push(v.hit);
}

console.error(
  `❌ harness invariants: ${violations.length} violation(s) across ${byId.size} rule(s)\n`,
);
for (const { inv, hits } of byId.values()) {
  console.error(`──[${inv.id}]────────────────────────────────────────`);
  console.error(`  ${inv.description}`);
  console.error(`  fix: ${inv.remediation}\n`);
  for (const hit of hits) console.error(`    ${hit}`);
  console.error("");
}
process.exit(1);
