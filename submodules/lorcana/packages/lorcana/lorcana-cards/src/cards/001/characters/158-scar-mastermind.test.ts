import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { scarMastermind } from "./158-scar-mastermind";

const opposingCharacter = createMockCharacter({
  id: "scar-mastermind-target",
  name: "Tamatoa",
  cost: 3,
  strength: 8,
  willpower: 4,
});

const ownCharacter = createMockCharacter({
  id: "scar-mastermind-own",
  name: "Own Character",
  cost: 2,
  strength: 3,
  willpower: 3,
});

describe("Scar - Mastermind", () => {
  describe("INSIDIOUS PLOT - When you play this character, chosen opposing character gets -5 {S} this turn.", () => {
    it("triggers when Scar is played and prompts for an opposing target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: scarMastermind.cost,
          hand: [scarMastermind],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(scarMastermind)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("reduces chosen opposing character's strength by 5 this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: scarMastermind.cost,
          hand: [scarMastermind],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);

      expect(testEngine.asPlayerOne().playCard(scarMastermind)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(scarMastermind, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore - 5);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore);
    });
  });
});
