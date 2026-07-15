import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arthurDeterminedSquire } from "./168-arthur-determined-squire";

describe("Arthur - Determined Squire", () => {
  describe("NO MORE BOOKS - Skip your turn's Draw step.", () => {
    it("controller does not draw a card at the start of their turn when Arthur is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arthurDeterminedSquire],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      // Player 1 has Arthur in play, passes turn
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ deck: 5, hand: 0 });
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player 2 should draw normally on their turn
      expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ deck: 4, hand: 1 });

      // Player 2 passes turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Player 1's draw step should be skipped because Arthur is in play
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ deck: 5, hand: 0 });
    });

    it("does not affect opponent's draw step", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arthurDeterminedSquire],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      // Player 1 passes turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player 2 should still draw normally - Arthur only affects its controller
      expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ deck: 4, hand: 1 });
    });

    it("controller draws normally when Arthur is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      // Player 1 has no Arthur, passes turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player 2 passes turn back
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Player 1 should draw normally without Arthur
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ deck: 4, hand: 1 });
    });
  });
});
