/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { arielWhoseitCollector } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  coconutbasket,
  lantern,
} from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Ariel - Whoseit Collector", () => {
  describe("**LOOK AT THIS STUFF** Whenever you play an item, you may ready this character.", () => {
    it("should ready when an item is played", () => {
      const testStore = new TestStore({
        inkwell: lantern.cost + coconutbasket.cost,
        hand: [coconutbasket, lantern],
        play: [arielWhoseitCollector],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        arielWhoseitCollector.id,
      );
      const target = testStore.getByZoneAndId("hand", coconutbasket.id);
      const _anotherTarget = testStore.getByZoneAndId("hand", lantern.id);

      cardUnderTest.quest();
      expect(cardUnderTest.ready).toBeFalsy();

      target.playFromHand();
      testStore.resolveTopOfStack();
      expect(cardUnderTest.ready).toBeTruthy();

      cardUnderTest.quest();
      expect(cardUnderTest.ready).toBeFalsy();

      _anotherTarget.playFromHand();
      testStore.resolveTopOfStack();
      expect(cardUnderTest.ready).toBeTruthy();
    });

    it("should NOT ready when an opponent play an item", () => {
      const testStore = new TestStore(
        {
          inkwell: lantern.cost + coconutbasket.cost,
          hand: [coconutbasket, lantern],
        },
        {
          play: [arielWhoseitCollector],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        arielWhoseitCollector.id,
        "player_two",
      );
      const target = testStore.getByZoneAndId("hand", coconutbasket.id);

      cardUnderTest.quest();
      expect(cardUnderTest.ready).toBeFalsy();

      target.playFromHand();
      expect(cardUnderTest.ready).toBeFalsy();
      expect(testStore.store.stackLayerStore.layers.length).toBe(0);
    });
  });
});
