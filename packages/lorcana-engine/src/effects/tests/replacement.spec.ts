/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  stichtNewDog,
  stitchRockStar,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { lantern } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Replacement effects", () => {
  describe("Cost replacement", () => {
    it("Applies to shift cost", async () => {
      const testEngine = new TestEngine({
        inkwell: 3, // Stitch shift costs 4
        play: [lantern, stichtNewDog],
        hand: [stitchRockStar],
      });

      const cardUnderTest = testEngine.getCardModel(stitchRockStar);

      expect(cardUnderTest.shiftCostAsText).toEqual(4);
      expect(
        testEngine.store.continuousEffectStore.continuousEffects,
      ).toHaveLength(0);

      await testEngine.activateCard(lantern);

      expect(
        testEngine.store.continuousEffectStore.continuousEffects,
      ).toHaveLength(1);
      expect(cardUnderTest.shiftCostAsText).toEqual(3);

      const { shifter } = await testEngine.shiftCard({
        shifted: stichtNewDog,
        shifter: stitchRockStar,
      });

      expect(shifter.zone).toEqual("play");
      expect(
        testEngine.store.continuousEffectStore.continuousEffects,
      ).toHaveLength(0);
    });
  });
});
