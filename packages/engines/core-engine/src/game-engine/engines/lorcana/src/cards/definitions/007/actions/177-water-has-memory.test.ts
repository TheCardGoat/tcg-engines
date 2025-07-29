import { describe, expect, it } from "bun:test";
import {
  allIsFound,
  doubleTrouble,
  showMeMore,
  theReturnOfHercules,
  waterHasMemory,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Water Has Memory", () => {
  describe("Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.", () => {
    it("Own deck", async () => {
      const testEngine = new TestEngine({
        deck: [doubleTrouble, allIsFound, theReturnOfHercules, showMeMore],
        inkwell: waterHasMemory.cost,
        hand: [waterHasMemory],
      });

      await testEngine.playCard(
        waterHasMemory,
        {
          targetPlayer: "player_one",
        },
        true,
      );
      await testEngine.resolveTopOfStack({
        scry: {
          top: [doubleTrouble],
          bottom: [allIsFound, theReturnOfHercules, showMeMore],
        },
      });

      await testEngine.drawCard();
      expect(testEngine.getCardModel(doubleTrouble).zone).toBe("hand");
    });

    it("Opponent deck", async () => {
      const testEngine = new TestEngine(
        {
          deck: 10,
          inkwell: waterHasMemory.cost,
          hand: [waterHasMemory],
        },
        {
          deck: [doubleTrouble, allIsFound, theReturnOfHercules, showMeMore],
        },
      );

      await testEngine.playCard(
        waterHasMemory,
        {
          targetPlayer: "player_two",
        },
        true,
      );
      await testEngine.resolveTopOfStack({
        scry: {
          top: [doubleTrouble],
          bottom: [allIsFound, theReturnOfHercules, showMeMore],
        },
      });

      await testEngine.drawCard("player_two");
      expect(testEngine.getCardModel(doubleTrouble).zone).toBe("hand");
    });
  });
});
