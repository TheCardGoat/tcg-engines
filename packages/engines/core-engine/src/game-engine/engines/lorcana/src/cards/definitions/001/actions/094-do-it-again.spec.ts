import { describe, expect, it } from "bun:test";
import {
  befuddle,
  doItAgain,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Do It Again", () => {
  it("Return an action card from your discard to your hand.", () => {
    const testStore = new TestStore({
      inkwell: doItAgain.cost,
      hand: [doItAgain],
      discard: [befuddle],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", doItAgain.id);
    const target = testStore.getByZoneAndId("discard", befuddle.id);

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("hand");
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0, discard: 1, play: 0 }),
    );
  });
});
