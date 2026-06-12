import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kidaGuardianOfThePath } from "./144-kida-guardian-of-the-path";

const opposingCharacter = createMockCharacter({
  id: "kida-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Kida - Guardian of the Path", () => {
  describe("Natural Defense - When you play this character, chosen opposing character gets -2 {S} this turn.", () => {
    it("triggers when played and creates a bag effect for target selection", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kidaGuardianOfThePath],
          inkwell: kidaGuardianOfThePath.cost,
          deck: 5,
        },
        {
          play: [{ card: opposingCharacter, isDrying: false }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(kidaGuardianOfThePath)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(kidaGuardianOfThePath)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("gives -2 strength to the chosen opposing character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kidaGuardianOfThePath],
          inkwell: kidaGuardianOfThePath.cost,
          deck: 5,
        },
        {
          play: [{ card: opposingCharacter, isDrying: false }],
          deck: 5,
        },
      );

      const opposingCardId = testEngine.findCardInstanceId(opposingCharacter, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().playCard(kidaGuardianOfThePath)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kidaGuardianOfThePath, { targets: [opposingCardId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(opposingCardId)).toBe(
        opposingCharacter.strength - 2,
      );
    });

    it("strength reduction expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kidaGuardianOfThePath],
          inkwell: kidaGuardianOfThePath.cost,
          deck: 5,
        },
        {
          play: [{ card: opposingCharacter, isDrying: false }],
          deck: 5,
        },
      );

      const opposingCardId = testEngine.findCardInstanceId(opposingCharacter, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().playCard(kidaGuardianOfThePath)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kidaGuardianOfThePath, { targets: [opposingCardId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(opposingCardId)).toBe(
        opposingCharacter.strength - 2,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(opposingCardId)).toBe(
        opposingCharacter.strength,
      );
    });
  });
});
