import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = join(import.meta.dirname, "..");
const rulesRoot = join(srcRoot, "rules");
const gameRoot = join(srcRoot, "game");
const proceduresRoot = join(srcRoot, "procedures");

function productionFiles(root: string): readonly string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    if (entry.isDirectory()) return productionFiles(path);
    return entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts") ? [path] : [];
  });
}

function isRulesTestHelper(path: string): boolean {
  const fromRules = relative(rulesRoot, path);
  return fromRules === "effect-leaf-contracts.ts";
}

describe("FAB rules-query boundary", () => {
  it("keeps procedure implementations out of the raw evaluator", () => {
    for (const path of productionFiles(proceduresRoot)) {
      const source = readFileSync(path, "utf8");
      expect(source, path).not.toContain("rules-evaluator.ts");
      expect(source, path).not.toMatch(/\bevaluateFabRules\s*\(/);
    }
  });

  it("keeps production rules modules off copy-on-write and the mutation vocabulary", () => {
    const violations: string[] = [];
    for (const path of productionFiles(rulesRoot)) {
      const source = readFileSync(path, "utf8");
      if (
        /copy-on-write\.ts/.test(source) ||
        /\b(?:mutateInPlace|mutateCommandState|mutateFabStateSavepointWithResult|prepareFabStateWithResult)\s*\(/.test(
          source,
        )
      ) {
        violations.push(relative(srcRoot, path));
      }
    }
    expect(violations).toEqual([]);
  });

  it("keeps trigger matching a query", () => {
    const source = readFileSync(join(rulesRoot, "trigger-matcher.ts"), "utf8");
    expect(source).not.toMatch(/state\.triggerLimitUsage\s*=/);
    expect(source).not.toMatch(/state\.rulesProcess\.pendingTriggers/);
  });

  it("keeps layer-resolution journal and sequence off advance.ts", () => {
    const layerResolution = join(proceduresRoot, "layer-resolution");
    for (const name of ["journal.ts", "sequence.ts"] as const) {
      const source = readFileSync(join(layerResolution, name), "utf8");
      expect(source, name).not.toMatch(/from ["']\.\/advance\.ts["']/);
    }
  });

  it("keeps production rules modules off testing/", () => {
    const violations: string[] = [];
    for (const path of productionFiles(rulesRoot)) {
      if (isRulesTestHelper(path)) continue;
      const source = readFileSync(path, "utf8");
      if (/(?:from|import)\s*["'][^"']*\/testing\//.test(source)) {
        violations.push(relative(srcRoot, path));
      }
    }
    expect(violations).toEqual([]);
  });

  it("keeps game/ independent of procedures/ and kernel/", () => {
    const violations: string[] = [];
    for (const path of productionFiles(gameRoot)) {
      const source = readFileSync(path, "utf8");
      if (/(?:from|import)\s*["'][^"']*\/(?:procedures|kernel)\//.test(source)) {
        violations.push(relative(srcRoot, path));
      }
    }
    expect(violations).toEqual([]);
  });

  it("keeps procedures/ from importing runtime.ts", () => {
    const violations: string[] = [];
    for (const path of productionFiles(proceduresRoot)) {
      const source = readFileSync(path, "utf8");
      if (/(?:from|import)\s*["'](?:\.\.\/)+runtime\.ts["']/.test(source)) {
        violations.push(relative(srcRoot, path));
      }
    }
    expect(violations).toEqual([]);
  });
});
