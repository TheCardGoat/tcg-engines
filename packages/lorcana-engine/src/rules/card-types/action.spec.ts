/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Action Cards", () => {
  describe("Regression", () => {
    /*
     * The issue in hand was that the card was not being resolved, instead when the card was played it created a layer that immediately resolved.
     * This is problematic due to the fact it would require two request to the backend to resolve the card. If one of the requests fail, or take too long, the game would get stuck
     * */
    it("Should auto resolve in one cycle", () => {
      const testStore = new TestStore(
        {
          deck: 2,
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
        },
        {},
        false, // False here turns off mobx observability
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        friendsOnTheOtherSide.id,
      );

      cardUnderTest.playFromHand();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({ hand: 2, deck: 0, discard: 1 }),
      );
    });
  });
});
