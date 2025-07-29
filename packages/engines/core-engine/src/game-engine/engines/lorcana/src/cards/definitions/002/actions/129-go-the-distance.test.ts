import { describe, expect, it } from "bun:test";
import { goTheDistance } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Go the Distance", () => {
  it("Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.", () => {
    const testStore = new TestStore({
      inkwell: goTheDistance.cost,
      hand: [goTheDistance],
      play: [goofyKnightForADay],
      deck: 2,
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", goTheDistance.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    target.updateCardMeta({ damage: 1, exerted: true });

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.ready).toBe(true);
    expect(target.hasQuestRestriction).toEqual(true);
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 1,
        hand: 1,
      }),
    );
  });
});
