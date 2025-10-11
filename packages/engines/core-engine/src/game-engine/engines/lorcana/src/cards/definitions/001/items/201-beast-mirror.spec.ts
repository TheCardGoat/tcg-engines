/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  beastMirror,
  dingleHopper,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Beast Mirror", () => {
  describe("Show Me - If you have no cards in your hand, draw a card.", () => {
    it("Empty hand", () => {
      const testStore = new TestStore({
        deck: 1,
        inkwell: 4,
        play: [beastMirror],
      });

      const cardUnderTest = testStore.getByZoneAndId("play", beastMirror.id);

      expect(
        testStore.store.tableStore.getPlayerZone("player_one", "deck")?.cards,
      ).toHaveLength(1);

      cardUnderTest.activate();

      expect(
        testStore.store.tableStore.getPlayerZone("player_one", "deck")?.cards,
      ).toHaveLength(0);
    });

    it("Non Empty hand", () => {
      const testStore = new TestStore({
        deck: 1,
        play: [beastMirror],
        hand: [dingleHopper],
        inkwell: 3,
      });

      const cardUnderTest = testStore.getByZoneAndId("play", beastMirror.id);

      expect(
        testStore.store.tableStore.getPlayerZone("player_one", "deck")?.cards,
      ).toHaveLength(1);

      cardUnderTest.activate();

      // expect(cardUnderTest.ready).toBeFalsy();
      expect(
        testStore.store.tableStore.getPlayerZone("player_one", "deck")?.cards,
      ).toHaveLength(1);
      expect(
        testStore.store.tableStore.getPlayerZone("player_one", "hand")?.cards,
      ).toHaveLength(1);
    });
  });
});
