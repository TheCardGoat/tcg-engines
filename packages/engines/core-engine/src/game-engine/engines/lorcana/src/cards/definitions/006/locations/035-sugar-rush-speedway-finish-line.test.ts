/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { vanellopeVonSchweetzSugarRushChamp } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import { sugarRushSpeedwayStartingLine } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations";
import { sugarRushSpeedwayFinishLine } from "~/game-engine/engines/lorcana/src/cards/definitions/006/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sugar Rush Speedway - Finish Line", () => {
  describe("BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.", () => {
    it("Moving from another location", async () => {
      const testEngine = new TestEngine({
        inkwell:
          sugarRushSpeedwayFinishLine.moveCost +
          sugarRushSpeedwayStartingLine.moveCost,
        play: [
          sugarRushSpeedwayStartingLine,
          sugarRushSpeedwayFinishLine,
          vanellopeVonSchweetzSugarRushChamp,
        ],
        deck: 10,
      });

      await testEngine.moveToLocation({
        location: sugarRushSpeedwayStartingLine as any,
        character: vanellopeVonSchweetzSugarRushChamp,
      });

      await testEngine.moveToLocation({
        location: sugarRushSpeedwayFinishLine,
        character: vanellopeVonSchweetzSugarRushChamp,
      });

      await testEngine.resolveOptionalAbility();

      expect(testEngine.getCardModel(sugarRushSpeedwayFinishLine).zone).toBe(
        "discard",
      );
      expect(testEngine.getPlayerLore()).toEqual(3);
      expect(testEngine.getZonesCardCount().hand).toEqual(3);
    });

    it("NOT Moving from another location", async () => {
      const testEngine = new TestEngine({
        inkwell: sugarRushSpeedwayFinishLine.moveCost,
        play: [sugarRushSpeedwayFinishLine, vanellopeVonSchweetzSugarRushChamp],
        deck: 5,
      });

      await testEngine.moveToLocation({
        location: sugarRushSpeedwayFinishLine,
        character: vanellopeVonSchweetzSugarRushChamp,
      });

      expect(testEngine.stackLayers).toHaveLength(0);
    });
  });
});
