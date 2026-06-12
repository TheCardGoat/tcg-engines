import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kidaProtectorOfAtlantis } from "./007-kida-protector-of-atlantis";

const allyCharacter = createMockCharacter({
  id: "kida-poa-ally",
  name: "Ally Character",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
});

const opposingCharacter = createMockCharacter({
  id: "kida-poa-opposing",
  name: "Opposing Character",
  cost: 3,
  strength: 5,
  willpower: 4,
  lore: 1,
});

describe("Kida - Protector of Atlantis", () => {
  describe("Shift 3", () => {
    it("has the Shift keyword with value 3", () => {
      const shiftAbility = kidaProtectorOfAtlantis.abilities?.find(
        (a) => a.type === "keyword" && "keyword" in a && a.keyword === "Shift",
      );
      expect(shiftAbility).toBeDefined();
      expect((shiftAbility as { cost: { ink: number } }).cost?.ink).toBe(3);
    });
  });

  describe("PERHAPS WE CAN SAVE OUR FUTURE", () => {
    it("reduces all characters' strength by 3 when Kida is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kidaProtectorOfAtlantis],
          inkwell: kidaProtectorOfAtlantis.cost,
          play: [allyCharacter],
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      const allyStrengthBefore = testEngine.asPlayerOne().getCardStrength(allyCharacter);
      const opposingStrengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);

      expect(testEngine.asPlayerOne().playCard(kidaProtectorOfAtlantis)).toBeSuccessfulCommand();

      // All characters including ally, opposing, and Kida herself get -3 strength
      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(allyStrengthBefore - 3);
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingStrengthBefore - 3,
      );
      expect(testEngine.asPlayerOne().getCardStrength(kidaProtectorOfAtlantis)).toBe(
        kidaProtectorOfAtlantis.strength - 3,
      );
    });

    it("effect expires at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kidaProtectorOfAtlantis],
          inkwell: kidaProtectorOfAtlantis.cost,
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      const opposingStrengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);

      expect(testEngine.asPlayerOne().playCard(kidaProtectorOfAtlantis)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingStrengthBefore - 3,
      );

      // Pass to opponent's turn - effect should still be active
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingStrengthBefore - 3,
      );

      // Pass back to your turn - effect expires at start of your next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingStrengthBefore,
      );
    });
  });
});
