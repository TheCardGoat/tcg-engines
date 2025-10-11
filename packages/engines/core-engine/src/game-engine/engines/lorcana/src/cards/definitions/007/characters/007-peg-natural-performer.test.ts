import { describe, expect, it } from "bun:test";
import {
  arielSpectacularSinger,
  mickeyBraveLittleTailor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { pegNaturalPerformer } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Peg - Born for the stage", () => {
  describe("CAPTIVE AUDIENCE {E} – If you have at least 3 other characters in play, draw a card.", () => {
    it("Draws a card if there are at least 3 other characters in play.", async () => {
      const testEngine = new TestEngine({
        inkwell: pegNaturalPerformer.cost,
        play: [
          pegNaturalPerformer,
          mrSmeeBumblingMate,
          mrSmeeBumblingMate,
          mrSmeeBumblingMate,
        ],
        hand: [],
        deck: [arielSpectacularSinger, mickeyBraveLittleTailor],
      });

      await testEngine.activateCard(pegNaturalPerformer);

      expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
    });

    it("Does not draw a card if there are less than 3 other characters in play.", async () => {
      const testEngine = new TestEngine({
        inkwell: pegNaturalPerformer.cost,
        play: [pegNaturalPerformer, mrSmeeBumblingMate, mrSmeeBumblingMate],
        hand: [],
        deck: [arielSpectacularSinger, mickeyBraveLittleTailor],
      });

      await testEngine.activateCard(pegNaturalPerformer);

      expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
    });
  });
});
