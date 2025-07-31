import { describe, expect, it } from "bun:test";
import { friendsOnTheOtherSide } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions/064-friends-on-the-other-side";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Friends On The Other Side", () => {
  it("Draw 2 cards", () => {
    const testStore = new TestStore({
      deck: 3,
      hand: [friendsOnTheOtherSide],
      inkwell: friendsOnTheOtherSide.cost,
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      friendsOnTheOtherSide.id,
    );

    cardUnderTest.playFromHand();

    console.log(testStore.getZonesCardCount());

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 2, deck: 1, discard: 1, play: 0 }),
    );
  });
});
