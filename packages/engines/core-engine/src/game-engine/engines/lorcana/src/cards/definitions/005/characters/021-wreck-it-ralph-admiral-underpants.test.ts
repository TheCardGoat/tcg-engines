/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  vanellopeVonSchweetzSugarRushChamp,
  wreckitRalphAdmiralUnderpants,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Wreck-It Ralph - Admiral Underpants", () => {
  describe("**I’VE GOT THE COOLEST FRIEND** When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.", () => {
    it("Returning a princess", async () => {
      const testEngine = new TestEngine({
        inkwell: wreckitRalphAdmiralUnderpants.cost,
        hand: [wreckitRalphAdmiralUnderpants],
        discard: [vanellopeVonSchweetzSugarRushChamp],
        lore: 0,
      });

      await testEngine.playCard(wreckitRalphAdmiralUnderpants, {
        targets: [vanellopeVonSchweetzSugarRushChamp],
      });

      expect(testEngine.getPlayerLore()).toEqual(2);
      expect(
        testEngine.getCardModel(vanellopeVonSchweetzSugarRushChamp).zone,
      ).toBe("hand");
    });
  });
});
