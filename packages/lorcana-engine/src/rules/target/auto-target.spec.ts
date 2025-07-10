/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { youHaveForgottenMe } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import {
  aladdinHeroicOutlaw,
  magicBroomBucketBrigade,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Opponent", () => {
  describe("You Have Forgotten Me", () => {
    it("if opponent only has one card in hand, discard it automatically", () => {
      const testStore = new TestStore(
        {
          inkwell: youHaveForgottenMe.cost,
          hand: [youHaveForgottenMe],
        },
        {
          hand: [aladdinHeroicOutlaw],
        },
      );
      testStore.store.configurationStore.autoTarget = true;

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        youHaveForgottenMe.id,
      );

      cardUnderTest.playFromHand();
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);

      expect(testStore.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({ hand: 0, discard: 1 }),
      );
      expect(testStore.store.priorityPlayer).toEqual("player_one");
    });

    it("if opponent only has two cards in hand, discard them both", () => {
      const testStore = new TestStore(
        {
          inkwell: youHaveForgottenMe.cost,
          hand: [youHaveForgottenMe],
        },
        {
          hand: [magicBroomBucketBrigade, aladdinHeroicOutlaw],
        },
      );
      testStore.store.configurationStore.autoTarget = true;

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        youHaveForgottenMe.id,
      );

      cardUnderTest.playFromHand();
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);

      expect(testStore.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({ hand: 0, discard: 2 }),
      );
      expect(testStore.store.priorityPlayer).toEqual("player_one");
    });

    it("Does not auto-target if player has more cards than the minimum amount", () => {
      const testStore = new TestStore(
        {
          inkwell: youHaveForgottenMe.cost,
          hand: [youHaveForgottenMe],
        },
        {
          hand: [
            magicBroomBucketBrigade,
            aladdinHeroicOutlaw,
            youHaveForgottenMe,
          ],
        },
      );
      testStore.store.configurationStore.autoTarget = true;

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        youHaveForgottenMe.id,
      );

      cardUnderTest.playFromHand();
      expect(testStore.store.stackLayerStore.layers).toHaveLength(1);

      expect(testStore.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({ hand: 3, discard: 0 }),
      );
      expect(testStore.store.priorityPlayer).toEqual("player_two");
    });
  });
});
