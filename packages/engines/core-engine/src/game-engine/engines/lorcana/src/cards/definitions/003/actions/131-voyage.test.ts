import { describe, expect, it } from "bun:test";
import { voyage } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import {
  vanellopeVonSchweetzSugarRushChamp,
  vanellopeVonSchweetzSugarRushPrincess,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import { sugarRushSpeedwayFinishLine } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Voyage", () => {
  describe("Move up to 2 characters of yours to the same location for free.", () => {
    it("Moving two characters", async () => {
      const testEngine = new TestEngine({
        inkwell: voyage.cost,
        hand: [voyage],
        play: [
          sugarRushSpeedwayFinishLine,
          vanellopeVonSchweetzSugarRushPrincess,
          vanellopeVonSchweetzSugarRushChamp,
        ],
      });

      await testEngine.playCard(
        voyage,
        {
          targets: [
            vanellopeVonSchweetzSugarRushPrincess,
            vanellopeVonSchweetzSugarRushChamp,
          ],
        },
        true,
      );
      await testEngine.resolveTopOfStack({
        targets: [sugarRushSpeedwayFinishLine],
      });

      expect(
        testEngine.getCardModel(sugarRushSpeedwayFinishLine)
          .charactersAtLocation,
      ).toHaveLength(2);
    });

    it("Moving one character", async () => {
      const testEngine = new TestEngine({
        inkwell: voyage.cost,
        hand: [voyage],
        play: [
          sugarRushSpeedwayFinishLine,
          vanellopeVonSchweetzSugarRushPrincess,
          vanellopeVonSchweetzSugarRushChamp,
        ],
      });

      await testEngine.playCard(
        voyage,
        {
          targets: [vanellopeVonSchweetzSugarRushChamp],
        },
        true,
      );
      await testEngine.resolveTopOfStack({
        targets: [sugarRushSpeedwayFinishLine],
      });

      expect(
        testEngine.getCardModel(sugarRushSpeedwayFinishLine)
          .charactersAtLocation,
      ).toHaveLength(1);
    });
  });
});
