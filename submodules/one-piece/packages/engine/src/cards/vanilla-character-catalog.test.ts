import { readFileSync } from "node:fs";
import { getCard } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";

const inventory = readFileSync(
  new URL("../../../../docs/card-behavior-character-inventory.md", import.meta.url),
  "utf8",
);
const vanillaCharacterIds = inventory
  .split("\n")
  .map((line) => /^\|\s*([^|]+?)\s*\|[^|]*\|\s*vanilla\s*\|/.exec(line)?.[1]?.trim())
  .filter((id): id is string => Boolean(id));

function isBlankAbilityText(text: string | undefined) {
  return text === undefined || text.trim() === "" || /^(?:NULL|-)$/i.test(text.trim());
}

describe("canonical vanilla Character catalog", () => {
  test("contains the complete unique 200-card inventory", () => {
    expect(vanillaCharacterIds).toHaveLength(200);
    expect(new Set(vanillaCharacterIds).size).toBe(200);
  });

  test.each(vanillaCharacterIds)("%s has no printed or executable ability", (cardId) => {
    const card = getCard(cardId);

    expect(card.cardType).toBe("character");
    if (card.cardType !== "character") return;
    expect(isBlankAbilityText(card.effect)).toBe(true);
    expect(isBlankAbilityText(card.trigger)).toBe(true);
    expect(card.effects).toBeUndefined();
    expect(isBlankAbilityText(card.i18n.en.effect)).toBe(true);
  });
});
