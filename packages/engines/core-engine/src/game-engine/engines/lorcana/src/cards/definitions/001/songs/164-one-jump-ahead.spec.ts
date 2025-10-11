/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items";
import { oneJumpAhead } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("One Jump Ahead", () => {
  it("Put the top card of your deck into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: oneJumpAhead.cost,
      hand: [oneJumpAhead],
      deck: [dingleHopper],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", oneJumpAhead.id);

    cardUnderTest.playFromHand();

    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);

    expect(testStore.getZonesCardCount().inkwell).toEqual(
      oneJumpAhead.cost + 1,
    );
    expect(
      testStore.store.tableStore.getTable("player_one").inkAvailable(),
    ).toEqual(0);
  });
});
