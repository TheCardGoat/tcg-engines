import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sourBillSurlyHenchman } from "./147-sour-bill-surly-henchman";

const opposingCharacter = createMockCharacter({
  id: "sour-bill-surly-henchman-target",
  name: "Opposing Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const ownCharacter = createMockCharacter({
  id: "sour-bill-surly-henchman-own",
  name: "Own Character",
  cost: 2,
  strength: 3,
  willpower: 3,
});

describe("Sour Bill - Surly Henchman", () => {
  describe("UNPALATABLE - When you play this character, chosen opposing character gets -2 {S} this turn.", () => {
    it("triggers when Sour Bill is played and prompts for an opposing target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: sourBillSurlyHenchman.cost,
          hand: [sourBillSurlyHenchman],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(sourBillSurlyHenchman)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("reduces chosen opposing character's strength by 2 this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: sourBillSurlyHenchman.cost,
          hand: [sourBillSurlyHenchman],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);

      expect(testEngine.asPlayerOne().playCard(sourBillSurlyHenchman)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(sourBillSurlyHenchman, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore - 2);

      // Effect expires at end of this turn (start of opponent's turn)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore);
    });
  });
});
