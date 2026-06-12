import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { cardSoldiersFullDeck } from "./122-card-soldiers-full-deck";

describe("Card Soldiers - Full Deck", () => {
  it("is a vanilla character with the expected printed metadata", () => {
    const testEngine = new LorcanaTestEngine({
      play: [cardSoldiersFullDeck],
    });

    expect(cardSoldiersFullDeck).toMatchObject({
      id: "ToP",
      canonicalId: "ci_lN7",
      reprints: ["set2-105", "set9-122"],
      cardType: "character",
      name: "Card Soldiers",
      version: "Full Deck",
      set: "009",
      cardNumber: 122,
      rarity: "uncommon",
      cost: 5,
      strength: 5,
      willpower: 5,
      lore: 2,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Ally"],
    });

    expect(cardSoldiersFullDeck.missingImplementation).toBeUndefined();
    expect(cardSoldiersFullDeck.missingTests).toBeUndefined();
    expect(cardSoldiersFullDeck.abilities ?? []).toHaveLength(0);
    expect(testEngine.getCardModel(cardSoldiersFullDeck).hasAbility).toBe(false);
  });
});
