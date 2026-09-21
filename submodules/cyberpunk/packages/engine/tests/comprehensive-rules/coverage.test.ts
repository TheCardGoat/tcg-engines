import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vite-plus/test";
import { EDITORIAL_RULES, PHYSICAL_RULES, UNTESTABLE_RULES, ruleKind } from "./classify.ts";

const here = dirname(fileURLToPath(import.meta.url));
const crPath = join(
  here,
  "../../../../.agents/skills/cyberpunk-tcg-rules/references/comprehensive-rules.md",
);

function crNumbers(): string[] {
  const text = readFileSync(crPath, "utf8");
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const match of text.matchAll(/^#{2,6}\s+(\d+(?:\.\d+)*)\s+—/gm)) {
    const num = match[1]!;
    if (seen.has(num)) continue;
    seen.add(num);
    ordered.push(num);
  }
  return ordered;
}

function coveredFromSuite(): Set<string> {
  const covered = new Set<string>();
  for (const file of readdirSync(here)) {
    if (!file.endsWith(".test.ts") || file === "coverage.test.ts") continue;
    const text = readFileSync(join(here, file), "utf8");
    expect(text).not.toMatch(/createMock(Unit|Legend|Program|Gear)\b/);
    for (const call of text.matchAll(/\bcover\(\s*([\s\S]*?)\)/g)) {
      for (const rule of call[1]!.matchAll(/"([\d.]+)"/g)) {
        covered.add(rule[1]!);
      }
    }
  }
  return covered;
}

describe("CR real-card coverage", () => {
  it("classifies every numbered CR entry and covers every playable entry with catalog-card tests", () => {
    const numbers = crNumbers();
    expect(numbers.length).toBeGreaterThan(600);
    const covered = coveredFromSuite();
    const missing: string[] = [];
    const unclassifiedEditorial = [...EDITORIAL_RULES].filter((n) => !numbers.includes(n));
    const unclassifiedPhysical = [...PHYSICAL_RULES].filter((n) => !numbers.includes(n));
    const unclassifiedUntestable = Object.keys(UNTESTABLE_RULES).filter(
      (n) => !numbers.includes(n),
    );
    expect(unclassifiedEditorial).toEqual([]);
    expect(unclassifiedPhysical).toEqual([]);
    expect(unclassifiedUntestable).toEqual([]);

    for (const num of numbers) {
      const kind = ruleKind(num);
      if (kind !== "playable") continue;
      if (!covered.has(num)) missing.push(num);
    }

    expect(missing, `Uncovered playable CR entries:\n${missing.join("\n")}`).toEqual([]);
  });
});
