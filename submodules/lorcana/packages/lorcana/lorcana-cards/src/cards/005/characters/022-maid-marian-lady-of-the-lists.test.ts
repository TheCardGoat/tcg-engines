import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { maidMarianLadyOfTheLists } from "./022-maid-marian-lady-of-the-lists";

const opposingCharacter = createMockCharacter({
  id: "maid-marian-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 6,
  willpower: 4,
});

describe("Maid Marian - Lady of the Lists", () => {
  describe("IF IT PLEASES THE LADY - When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.", () => {
    it("reduces the chosen opposing character's strength by 5 until the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maidMarianLadyOfTheLists],
          inkwell: maidMarianLadyOfTheLists.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(maidMarianLadyOfTheLists)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maidMarianLadyOfTheLists, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength - 5,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength - 5,
      );

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength,
      );
    });

    it("fizzles when there are no opposing characters to target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [maidMarianLadyOfTheLists],
        inkwell: maidMarianLadyOfTheLists.cost,
      });

      expect(testEngine.asPlayerOne().playCard(maidMarianLadyOfTheLists)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(maidMarianLadyOfTheLists)).toBe("play");
    });
  });
});
