import { readdirSync, readFileSync } from "node:fs";
import { basename, relative } from "node:path";
import { describe, expect, it } from "vite-plus/test";

const sourceRoot = new URL("../", import.meta.url);

const DIRECT_BASE_ACCESS_OWNERS = new Set([
  "abilities.ts", // Explicit catalog diagnostics exported only for catalog tests.
  "cards.ts", // Registration and normalized base-object loader.
  "initialize.ts", // Match initialization from registered printed values.
  "pregame.ts", // Deck/equipment initialization and catalog validation.
  "compiler.ts",
  "event-reducer.ts",
  "rules-evaluator.ts",
  // These operations intentionally consume catalog metadata before there is a
  // live rules object, or inspect an ability definition to identify a static
  // replacement. They cannot use evaluated object properties.
  "equip-restrictions.ts",
  "weapon-area.ts", // Pregame weapon-slot catalog validation before live objects exist.
  "create-card.ts",
  "name-card.ts",
  "assets-turn.ts",
  "combat.ts",
  "mechanics.ts",
  "helpers.ts",
]);

const LEGACY_RULE_HELPER_CALL =
  /\b(?:cardPower|cardDefense|cardCost|pitchValue|hasKeyword|keywordNames|effectiveDefense)\s*\(/g;

const RAW_DEFINITION_PROPERTY =
  /\b(?:definition|def|heroDef|cardDefinition|abilityDefinition)\s*(?:\?\.|\.)\s*(?:types|traits|pitch|cost|power|defense|health|intelligence|keywords|abilities|name)\b/g;

const RAW_REGISTRY_PROPERTY =
  /\bcardDefinitions\s*\[[^\]\n]+\]\s*(?:\?\.|\.)\s*(?:types|traits|pitch|cost|power|defense|health|intelligence|keywords|abilities|name)\b/g;

describe("rules property access boundary", () => {
  it("keeps production rule consumers off raw card-definition properties", () => {
    const violations: string[] = [];
    for (const file of productionTypeScriptFiles(sourceRoot)) {
      const path = relative(new URL("..", sourceRoot).pathname, file.pathname);
      const source = readFileSync(file, "utf8");
      for (const pattern of [
        LEGACY_RULE_HELPER_CALL,
        RAW_DEFINITION_PROPERTY,
        RAW_REGISTRY_PROPERTY,
      ]) {
        pattern.lastIndex = 0;
        for (const match of source.matchAll(pattern)) {
          if (DIRECT_BASE_ACCESS_OWNERS.has(basename(file.pathname))) continue;
          const line = source.slice(0, match.index).split("\n").length;
          violations.push(`${path}:${line}: ${match[0]}`);
        }
      }
    }
    expect(violations).toEqual([]);
  });
});

function productionTypeScriptFiles(directory: URL): URL[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
    if (entry.isDirectory()) {
      if (entry.name === "testing") return [];
      return productionTypeScriptFiles(file);
    }
    if (!entry.name.endsWith(".ts") || entry.name.endsWith(".test.ts")) return [];
    if (entry.name === "test-trainers.ts") return [];
    return [file];
  });
}
