/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arielOnHumanLegs,
  magicBroomBucketBrigade,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  dingleHopper,
  magicGoldenFlower,
  magicMirror,
} from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Items", () => {
  describe("Paying ink costs", () => {
    it("Can pay ink costs", () => {
      const testStore = new TestStore({
        play: [magicMirror],
        deck: 2,
        inkwell: 4,
      });

      const cardUnderTest = testStore.getByZoneAndId("play", magicMirror.id);

      expect(
        testStore.store.tableStore
          .getPlayerZone("player_one", "inkwell")
          .inkAvailable(),
      ).toEqual(4);
      expect(cardUnderTest.ready).toEqual(true);

      cardUnderTest.activate();

      expect(
        testStore.store.tableStore
          .getPlayerZone("player_one", "inkwell")
          .inkAvailable(),
      ).toEqual(0);
      expect(cardUnderTest.ready).toEqual(false);
    });

    it("Not able to pay ink costs", () => {
      const testStore = new TestStore({
        play: [magicMirror],
        deck: 2,
        inkwell: 3,
      });

      const cardUnderTest = testStore.getByZoneAndId("play", magicMirror.id);

      cardUnderTest.activate();

      expect(cardUnderTest.ready).toEqual(true);
    });

    it("Can pay tap costs", () => {
      const testStore = new TestStore({
        deck: 1,
        inkwell: 4,
        play: [dingleHopper, magicBroomBucketBrigade, magicMirror],
      });

      const cardUnderTest = testStore.getByZoneAndId("play", magicMirror.id);

      expect(cardUnderTest.ready).toEqual(true);

      cardUnderTest.activate();

      expect(cardUnderTest.ready).toEqual(false);
    });

    it("If they can't pay the cost, doesn't activate the effect", () => {
      const testStore = new TestStore({
        play: [magicMirror],
        inkwell: [dingleHopper, dingleHopper, dingleHopper],
      });

      const cardUnderTest = testStore.getByZoneAndId("play", magicMirror.id);

      expect(cardUnderTest.ready).toEqual(true);
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
      expect(
        testStore.store.tableStore
          .getPlayerZone("player_one", "inkwell")
          .inkAvailable(),
      ).toEqual(3);

      cardUnderTest.activate();

      expect(cardUnderTest.ready).toEqual(true);
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
      expect(
        testStore.store.tableStore
          .getPlayerZone("player_one", "inkwell")
          .inkAvailable(),
      ).toEqual(3);
    });
  });

  describe("Paying Banish costs", () => {
    it("Banish this item", () => {
      const testStore = new TestStore({
        play: [magicGoldenFlower, arielOnHumanLegs],
      });

      const damagedChar = testStore.getByZoneAndId("play", arielOnHumanLegs.id);

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        magicGoldenFlower.id,
      );

      cardUnderTest.activate();

      const effect = testStore.store.stackLayerStore.layers[0];
      if (effect) {
        testStore.store.stackLayerStore.resolveTopOfStack({
          targets: [damagedChar],
        });
      }

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          play: 1,
        }),
      );
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });

    it("Undo banishing self", () => {
      // TODO: Implement
    });
  });
});
