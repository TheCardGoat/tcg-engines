import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ratiganGreedyGenius } from "./167-ratigan-greedy-genius";

const inkableCard = createMockCharacter({
  id: "ratigan-inkable-card",
  name: "Inkable Card",
  cost: 1,
  inkable: true,
});

describe("Ratigan - Greedy Genius", () => {
  it("has Ward keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ratiganGreedyGenius],
    });

    const cardUnderTest = testEngine.getCardModel(ratiganGreedyGenius);
    expect(cardUnderTest.hasWard()).toBe(true);
  });

  describe("TIME RUNS OUT - At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.", () => {
    it("banishes Ratigan at end of turn when no card was inked this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ratiganGreedyGenius],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardZone(ratiganGreedyGenius)).toBe("play");

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // TIME RUNS OUT triggers and auto-resolves (no bag needed for mandatory triggered ability)
      expect(testEngine.asPlayerOne().getCardZone(ratiganGreedyGenius)).toBe("discard");
    });

    it("does not banish Ratigan at end of turn when a card was inked this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ratiganGreedyGenius],
        hand: [inkableCard],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardZone(ratiganGreedyGenius)).toBe("play");

      // Ink a card this turn — satisfies the condition to keep Ratigan alive
      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Ratigan should still be in play
      expect(testEngine.asPlayerOne().getCardZone(ratiganGreedyGenius)).toBe("play");
    });
  });

  it("regression: should not be banished when a card was inked via an ability (only manual ink action)", () => {
    // Bug: Ratigan was being banished even when a card was put into inkwell via an ability effect.
    // TIME RUNS OUT should only check for the manual "Ink" action, not ability-driven inks.
    // This test verifies that manual inking keeps Ratigan alive.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ratiganGreedyGenius],
      hand: [inkableCard],
      deck: 2,
    });

    // Ink a card via the manual ink action
    expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

    // Pass turn - Ratigan should NOT be banished because a card was inked this turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(ratiganGreedyGenius)).toBe("play");
  });
});
