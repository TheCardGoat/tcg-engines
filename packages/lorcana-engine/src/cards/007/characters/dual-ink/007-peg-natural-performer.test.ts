/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arielSpectacularSinger,
  mickeyBraveLittleTailor,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { pegNaturalPerformer } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
