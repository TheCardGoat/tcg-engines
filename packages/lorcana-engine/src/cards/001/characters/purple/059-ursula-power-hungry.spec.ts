/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  tangle,
  youHaveForgottenMe,
} from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import {
  aladdinHeroicOutlaw,
  ursulaPowerHungry,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
