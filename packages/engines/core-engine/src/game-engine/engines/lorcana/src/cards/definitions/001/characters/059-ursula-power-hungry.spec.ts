/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { youHaveForgottenMe } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { ursulaPowerHungry } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ursula - Power Hungry", () => {
  describe("**IT'S TOO EASY!** When you play this character, each opponent loses 1 lore. You may draw a card for each 1 lore lost this way.", () => {
    it("Activates the effect", () => {
      const testStore = new TestStore({
        inkwell: ursulaPowerHungry.cost,
        deck: [youHaveForgottenMe],
        hand: [ursulaPowerHungry],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        ursulaPowerHungry.id,
      );

      testStore.store.tableStore.getTable("player_two").lore = 5;

      cardUnderTest.playFromHand();

      expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
      );
    });

    it.skip("Skips the effect", () => {
      const testStore = new TestStore({
        inkwell: ursulaPowerHungry.cost,
        deck: [youHaveForgottenMe],
        hand: [ursulaPowerHungry],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        ursulaPowerHungry.id,
      );

      testStore.store.tableStore.getTable("player_two").lore = 5;

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack();

      expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({ hand: 0, deck: 1, play: 1, discard: 0 }),
      );
    });
  });
});
