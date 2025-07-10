/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloMakingAWish,
  stichtNewDog,
  stitchRockStar,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Stitch Rock Star", () => {
  describe('"ADORING FANS - Whenever you play a character with cost 2 or less, you may exert them to draw a card.', () => {
    it("Drawing cards", () => {
      const testStore = new TestStore({
        deck: 2,
        inkwell: stichtNewDog.cost + liloMakingAWish.cost,
        hand: [stichtNewDog, liloMakingAWish],
        play: [stitchRockStar],
      });

      const aTarget = testStore.getByZoneAndId("hand", stichtNewDog.id);
      const anotherTarget = testStore.getByZoneAndId(
        "hand",
        liloMakingAWish.id,
      );

      aTarget.playFromHand();
      testStore.resolveTopOfStack();

      expect(aTarget.ready).toEqual(false);
      expect(testStore.getZonesCardCount().deck).toBe(1);
      expect(testStore.getZonesCardCount().hand).toBe(2);

      anotherTarget.playFromHand();
      testStore.resolveTopOfStack({ targetId: anotherTarget.instanceId });

      expect(anotherTarget.meta.exerted).toEqual(true);
      expect(testStore.getZonesCardCount().deck).toBe(0);
      expect(testStore.getZonesCardCount().hand).toBe(2);
      expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });

    it("Skipping effects", () => {
      const testStore = new TestStore({
        deck: 2,
        inkwell: stichtNewDog.cost + liloMakingAWish.cost,
        hand: [stichtNewDog, liloMakingAWish],
        play: [stitchRockStar],
      });

      const aTarget = testStore.getByZoneAndId("hand", stichtNewDog.id);
      const anotherTarget = testStore.getByZoneAndId(
        "hand",
        liloMakingAWish.id,
      );

      aTarget.playFromHand();
      testStore.resolveTopOfStack({ skip: true });

      expect(aTarget.ready).toEqual(true);
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({ deck: 2, hand: 1, play: 2 }),
      );

      anotherTarget.playFromHand();
      testStore.resolveTopOfStack({ skip: true });

      expect(anotherTarget.ready).toEqual(true);
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({ deck: 2, hand: 0, play: 3 }),
      );
      expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });
  });
});
