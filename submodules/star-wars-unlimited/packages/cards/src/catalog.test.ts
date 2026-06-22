import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vite-plus/test";
import { allCardDefinitions, allCards } from "./index.ts";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cardsRoot = path.join(packageRoot, "src/cards");
const copiedRuntimeTerms = ["setupCard" + "Abilities", "registrar" + "."];
const unsupportedEffectPlaceholder = "TODO_" + "UNSUPPORTED_EFFECT";
const generatedIdSuffix = /-\d{10}\.ts$/;
const generatedIdExport = /\bswuCard\d{10}\b/;

function cardDefinitionFiles(dir = cardsRoot): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return cardDefinitionFiles(full);
      if (entry.isFile() && entry.name.endsWith(".ts") && entry.name !== "index.ts") return [full];
      return [];
    })
    .sort();
}

describe("Star Wars Unlimited card catalog", () => {
  it("contains one native typed card definition for every imported card", () => {
    expect(allCards).toBe(allCardDefinitions);

    const files = cardDefinitionFiles();
    expect(allCards.length).toBeGreaterThan(0);
    expect(allCardDefinitions).toHaveLength(allCards.length);
    expect(files).toHaveLength(allCards.length);

    const ids = new Set<string>();
    for (const card of allCards) {
      ids.add(card.id);
      expect(card.cardType).toMatch(/^(base|event|leader|token|unit|upgrade)$/);
      expect(card.abilities ?? []).toBeDefined();
      expect(Object.hasOwn(card, "implementation")).toBe(false);
    }

    expect(ids.size).toBe(allCards.length);
  });

  it("does not reference copied engine card classes or unsupported placeholders", () => {
    for (const file of cardDefinitionFiles()) {
      const source = fs.readFileSync(file, "utf8");
      expect(file).not.toMatch(generatedIdSuffix);
      expect(source).not.toContain("packages/engine");
      expect(source).not.toContain(unsupportedEffectPlaceholder);
      expect(source).not.toMatch(generatedIdExport);
      for (const term of copiedRuntimeTerms) {
        expect(source).not.toContain(term);
      }
    }
  });
});
