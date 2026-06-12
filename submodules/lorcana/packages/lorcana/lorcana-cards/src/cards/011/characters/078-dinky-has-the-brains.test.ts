import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dinkyHasTheBrains } from "./078-dinky-has-the-brains";

const opponentChar1 = createMockCharacter({
  id: "dinky-test-opp-1",
  name: "Opponent Char 1",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentChar2 = createMockCharacter({
  id: "dinky-test-opp-2",
  name: "Opponent Char 2",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Dinky - Has the Brains", () => {
  describe("GET HIM! - When you play this character, each opponent chooses one of their characters and deals 1 damage to them", () => {
    it("deals 1 damage to opponent's chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dinkyHasTheBrains],
          inkwell: dinkyHasTheBrains.cost,
          deck: 5,
        },
        {
          play: [opponentChar1, opponentChar2],
        },
      );

      expect(testEngine.asPlayerOne().playCard(dinkyHasTheBrains)).toBeSuccessfulCommand();

      const opponentChar1Id = testEngine.findCardInstanceId(opponentChar1, "play", "p2");
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentChar1Id] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentChar1)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(opponentChar2)).toBe(0);
    });

    it("opponent can choose any of their characters to take damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dinkyHasTheBrains],
          inkwell: dinkyHasTheBrains.cost,
          deck: 5,
        },
        {
          play: [opponentChar1, opponentChar2],
        },
      );

      expect(testEngine.asPlayerOne().playCard(dinkyHasTheBrains)).toBeSuccessfulCommand();

      const opponentChar2Id = testEngine.findCardInstanceId(opponentChar2, "play", "p2");
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentChar2Id] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentChar2)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(opponentChar1)).toBe(0);
    });

    it("does nothing if opponent has no characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dinkyHasTheBrains],
          inkwell: dinkyHasTheBrains.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(dinkyHasTheBrains)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(dinkyHasTheBrains)).toBe("play");
    });
  });
});
