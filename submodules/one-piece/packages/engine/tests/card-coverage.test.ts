import { describe, expect, test } from "vite-plus/test";
import * as cardExports from "@tcg/op-cards";
import type { OPCard } from "@tcg/op-types";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

function isCardDefinition(value: unknown): value is OPCard {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<OPCard>;
  return typeof candidate.id === "string" && typeof candidate.cardType === "string";
}

const exportedCards = Object.values(cardExports as Record<string, unknown>).filter(
  isCardDefinition,
);
const cardsSourceRoot = join(dirname(fileURLToPath(import.meta.url)), "../../cards/src/cards");
// Shared authoring helpers for the ST01 starter deck are not definitions.
const nonDefinitionFiles = new Set([join(cardsSourceRoot, "st01-helpers.ts")]);

function cardSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return cardSourceFiles(path);
    }
    if (
      !entry.name.endsWith(".ts") ||
      entry.name.endsWith(".i18n.ts") ||
      entry.name === "index.ts" ||
      nonDefinitionFiles.has(path)
    ) {
      return [];
    }
    return [path];
  });
}

describe("card ability coverage inventory", () => {
  test("exports every canonical card definition exactly once", async () => {
    const sourceFiles = cardSourceFiles(cardsSourceRoot);
    const cardDefinitionsByFile = await Promise.all(
      sourceFiles.map(async (sourceFile) => {
        const module = (await import(pathToFileURL(sourceFile).href)) as Record<string, unknown>;
        return Object.values(module).filter(isCardDefinition);
      }),
    );

    expect(cardDefinitionsByFile.every((definitions) => definitions.length === 1)).toBe(true);

    const sourceCardIds = cardDefinitionsByFile.flat().map((card) => card.id);
    const exportedCardIds = exportedCards.map((card) => card.id);
    expect(new Set(sourceCardIds).size).toBe(sourceCardIds.length);
    expect(new Set(exportedCardIds)).toEqual(new Set(sourceCardIds));
  });
});

// Structural guard only: the per-card command tests must still prove every clause.
// This catches an omitted timing even when a card's other ability has a passing test.
test("printed activation headings have executable effect blocks", () => {
  const timings = new Map([
    ["On Play", "onPlay"],
    ["When Attacking", "whenAttacking"],
    ["On Block", "onBlock"],
    ["On K.O.", "onKo"],
    ["Activate: Main", "activateMain"],
    ["Counter", "counter"],
    ["Main", "main"],
    ["Trigger", "trigger"],
    ["On Your Opponent's Attack", "onOpponentAttack"],
    ["At the End of Your Turn", "endOfYourTurn"],
    ["At the End of Your Opponent's Turn", "endOfOpponentTurn"],
  ]);
  const missing: string[] = [];
  const seen = new Set<string>();
  for (const card of exportedCards) {
    if (seen.has(card.canonicalId || card.id)) continue;
    seen.add(card.canonicalId || card.id);
    const declared = new Set(card.effects?.effects?.map((block) => block.trigger) ?? []);
    const text = card.effect ?? card.i18n?.en?.effect ?? "";
    for (const clause of text.split(/\n|\.\s+(?=\[)/)) {
      // Bracket references later in a sentence (e.g. a card "with [Trigger]")
      // describe filters, not activation headings.
      const normalizedClause = clause.trim().replace(/^Trigger\s+(?=\S)/, "[Trigger] ");
      const prefix = normalizedClause.match(/^(?:\[[^\]]+\][\s/]*)+/)?.[0] ?? "";
      for (const heading of prefix.matchAll(/\[([^\]]+)\]/g)) {
        const timing = timings.get(heading[1]!);
        if (timing && ![...declared].some((value) => value === timing)) {
          missing.push(`${card.id}: [${heading[1]}]`);
        }
      }
    }
    if (
      "trigger" in card &&
      typeof card.trigger === "string" &&
      card.trigger.trim() &&
      !/^(?:NULL|-)$/i.test(card.trigger.trim()) &&
      !declared.has("trigger")
    ) {
      missing.push(`${card.id}: Life Trigger`);
    }
  }
  expect([...new Set(missing)]).toEqual([]);
});
