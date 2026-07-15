import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import type { CharacterCard } from "@tcg/lorcana-types";

function cardLabel(card: CharacterCard) {
  return `${card.name} - ${card.version}`;
}

export function runVanillaCharacterTest(card: CharacterCard) {
  describe(cardLabel(card), () => {
    it("has no implemented abilities and is not marked missing", () => {
      const testEngine = new LorcanaTestEngine({
        play: [card],
      });
      const abilities = card.abilities ?? [];

      expect(abilities).toHaveLength(0);
      expect(testEngine.getCardModel(card).hasAbility).toBe(false);
    });
  });
}

export function runKeywordCharacterTest(card: CharacterCard) {
  describe(cardLabel(card), () => {
    it("maps printed keyword abilities into the runtime model", () => {
      const testEngine = new LorcanaTestEngine({
        play: [card],
      });
      const cardModel = testEngine.getCardModel(card);

      for (const ability of card.abilities ?? []) {
        if (ability.type !== "keyword") {
          continue;
        }

        switch (ability.keyword) {
          case "Bodyguard":
            expect(cardModel.hasBodyguard()).toBe(true);
            break;
          case "Challenger":
            expect(cardModel.hasChallenger).toBe(true);
            break;
          case "Evasive":
            expect(cardModel.hasEvasive).toBe(true);
            break;
          case "Reckless":
            expect(cardModel.hasReckless()).toBe(true);
            break;
          case "Resist":
            expect(cardModel.hasResist).toBe(true);
            expect(cardModel.damageReduction).toBe(ability.value);
            break;
          case "Rush":
            expect(cardModel.hasRush).toBe(true);
            break;
          case "Shift":
            expect(cardModel.hasShift()).toBe(true);
            expect(cardModel.shiftInkCost).toBe(ability.cost?.ink);
            break;
          case "Singer":
            expect(cardModel.hasSinger()).toBe(true);
            expect(cardModel.singerCost).toBe(ability.value);
            break;
          case "Support":
            expect(cardModel.hasSupport()).toBe(true);
            break;
          case "Ward":
            expect(cardModel.hasWard()).toBe(true);
            break;
          default:
            throw new Error(`Unhandled keyword test mapping for ${ability.keyword}`);
        }
      }
    });
  });
}

export function runMissingCharacterTest(card: CharacterCard) {
  describe(cardLabel(card), () => {
    it("is explicitly marked as still missing real executable coverage", () => {});
  });
}

export function runEnchantedParityCharacterTest(card: CharacterCard, baseCard: CharacterCard) {
  describe(cardLabel(card), () => {
    it("matches its base printing for gameplay-relevant data and missing flags", () => {
      expect(card.canonicalId).toBe(baseCard.canonicalId);
      expect(card.cost).toBe(baseCard.cost);
      expect(card.strength).toBe(baseCard.strength);
      expect(card.willpower).toBe(baseCard.willpower);
      expect(card.lore).toBe(baseCard.lore);
      expect(card.inkable).toBe(baseCard.inkable);
      expect(card.inkType).toEqual(baseCard.inkType);
      expect(card.classifications).toEqual(baseCard.classifications);
      expect(card.text).toEqual(baseCard.text);
      expect(card.abilities).toEqual(baseCard.abilities);
    });
  });
}
