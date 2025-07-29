/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  befuddle,
  doItAgain,
} from "@lorcanito/lorcana-engine/cards/001/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
