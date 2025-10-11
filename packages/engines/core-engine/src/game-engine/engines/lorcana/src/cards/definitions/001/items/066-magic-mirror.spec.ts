/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  dingleHopper,
  magicMirror,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Magic Mirror", () => {
  it("Speak - Drawing one", () => {
    const testStore = new TestStore({
      deck: [dingleHopper],
      play: [magicMirror],
      inkwell: [dingleHopper, dingleHopper, dingleHopper, dingleHopper],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", magicMirror.id);

    expect(
      testStore.store.tableStore.getPlayerZone("player_one", "deck")?.cards,
    ).toHaveLength(1);

    cardUnderTest.activate();

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0 }),
    );
  });
});
