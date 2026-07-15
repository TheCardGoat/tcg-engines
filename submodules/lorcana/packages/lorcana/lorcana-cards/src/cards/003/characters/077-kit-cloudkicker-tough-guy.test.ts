import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kitCloudkickerToughGuy } from "./077-kit-cloudkicker-tough-guy";

const weakOpponentCharacter = createMockCharacter({
  id: "kit-cloudkicker-weak-opponent",
  name: "Weak Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Kit Cloudkicker - Tough Guy", () => {
  describe("SKYSURFING - When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.", () => {
    it("returns an opposing character with 2 strength or less to hand when optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kitCloudkickerToughGuy],
          inkwell: kitCloudkickerToughGuy.cost,
        },
        {
          play: [weakOpponentCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(kitCloudkickerToughGuy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kitCloudkickerToughGuy, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [weakOpponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(weakOpponentCharacter)).toBe("hand");
    });

    it("does not return the opposing character when optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kitCloudkickerToughGuy],
          inkwell: kitCloudkickerToughGuy.cost,
        },
        {
          play: [weakOpponentCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(kitCloudkickerToughGuy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kitCloudkickerToughGuy, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(weakOpponentCharacter)).toBe("play");
    });
  });
});
