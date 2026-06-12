import { describe, expect, it } from "vite-plus/test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { RuleModifier } from "@tcg/cyberpunk-types";

/**
 * Every value of {@link RuleModifier} must have at least one engine site that
 * reads it. Otherwise a card grants a rule that the engine silently ignores —
 * the gameplay outcome diverges from the card text. (cantAttack lived in this
 * state until item 9; the test catches the regression class.)
 *
 * Strategy: grep engine sources for each rule literal. Documentation-only
 * matches (in comments) are excluded by ignoring lines that start with
 * comment markers; that lets the test fail clean if a rule is *only*
 * mentioned in passing.
 */

const ENGINE_SRC = join(__dirname, "../src");

const ALL_RULE_MODIFIERS: ReadonlySet<RuleModifier> = new Set([
  "blocker",
  "goSolo",
  "cantAttack",
  "cantBeBlocked",
  "canAttackOnPlayedTurnAgainstUnits",
  "adrenaline",
  "quick",
]);

function* walkTsFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      yield* walkTsFiles(full);
      continue;
    }
    if (!entry.endsWith(".ts") || entry.endsWith(".test.ts")) continue;
    yield full;
  }
}

function findRuleSites(rule: RuleModifier): string[] {
  const literal = `"${rule}"`;
  const matches: string[] = [];
  for (const file of walkTsFiles(ENGINE_SRC)) {
    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      if (!line.includes(literal)) continue;
      // Skip comment-only lines so a doc reference doesn't paper over a missing handler.
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
      matches.push(`${file.replace(ENGINE_SRC, "engine/src")}:${i + 1}`);
    }
  }
  return matches;
}

describe("RuleModifier coverage in engine sources", () => {
  it("every RuleModifier value has at least one non-comment engine reference", () => {
    const orphaned: Array<{ rule: RuleModifier; sites: string[] }> = [];
    for (const rule of ALL_RULE_MODIFIERS) {
      const sites = findRuleSites(rule);
      if (sites.length === 0) {
        orphaned.push({ rule, sites: [] });
      }
    }
    expect(orphaned).toEqual([]);
  });
});
