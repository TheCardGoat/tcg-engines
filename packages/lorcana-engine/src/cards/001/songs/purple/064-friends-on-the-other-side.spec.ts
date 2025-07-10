/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Friends On The Other Side", () => {
  it("Draw 2 cards", () => {
    const testStore = new TestStore({
      deck: 2,
      hand: [friendsOnTheOtherSide],
      inkwell: friendsOnTheOtherSide.cost,
    });

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
