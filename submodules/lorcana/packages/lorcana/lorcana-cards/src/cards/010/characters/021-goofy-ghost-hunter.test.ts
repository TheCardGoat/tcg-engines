import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyGhostHunter } from "./021-goofy-ghost-hunter";

const opposingCharacter = createMockCharacter({
  id: "goofy-ghost-hunter-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Goofy - Ghost Hunter", () => {
  describe("PERFECT TRAP - When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.", () => {
    it("reduces the chosen opposing character's strength until the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [goofyGhostHunter],
          inkwell: goofyGhostHunter.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(goofyGhostHunter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(goofyGhostHunter, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength - 1,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength - 1,
      );

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength,
      );
    });

    it("fizzles when there are no opposing characters to target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [goofyGhostHunter],
        inkwell: goofyGhostHunter.cost,
      });

      expect(testEngine.asPlayerOne().playCard(goofyGhostHunter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(goofyGhostHunter)).toBe("play");
    });
  });
});
