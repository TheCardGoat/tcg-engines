import { describe, expect, it } from "bun:test";
import { breakAction } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Break", () => {
  it("Banish chosen item.", () => {
    const testStore = new TestStore({
      inkwell: breakAction.cost,
      hand: [breakAction],
      play: [dingleHopper],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", breakAction.id);
    const target = testStore.getByZoneAndId("play", dingleHopper.id);

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("discard");
  });
});
