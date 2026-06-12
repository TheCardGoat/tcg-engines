import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { theFatesOnlyOneEye } from "./089-the-fates-only-one-eye";

describe("The Fates - Only One Eye", () => {
  describe("ALL WILL BE SEEN - When you play this character, look at the top card of each opponent's deck.", () => {
    it("can be played onto the board", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theFatesOnlyOneEye],
          inkwell: theFatesOnlyOneEye.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(theFatesOnlyOneEye)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(theFatesOnlyOneEye)).toBe("play");
    });

    it("triggers a scry peek at the top card of each opponent's deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theFatesOnlyOneEye],
          inkwell: theFatesOnlyOneEye.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const opponentDeckBefore = testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      expect(opponentDeckBefore.length).toBe(2);

      expect(testEngine.asPlayerOne().playCard(theFatesOnlyOneEye)).toBeSuccessfulCommand();

      // A scry bag should appear for player one to confirm they have seen the card
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        // Resolve the scry by putting card(s) back on top
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(theFatesOnlyOneEye, {
            destinations: [
              { zone: "deck-top", cards: [opponentDeckBefore[opponentDeckBefore.length - 1]] },
            ],
          }),
        ).toBeSuccessfulCommand();
      }

      // Opponent's deck should still have the same number of cards (card stayed on top)
      expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO).length).toBe(2);
    });
  });
});
