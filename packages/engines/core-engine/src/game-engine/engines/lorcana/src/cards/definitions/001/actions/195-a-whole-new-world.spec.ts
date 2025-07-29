import { describe, expect, it } from "bun:test";
import {
  magicBroomBucketBrigade,
  moanaOfMotunui,
  teKaTheBurningOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { aWholeNewWorld } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("A Whole New World", () => {
  it("Each player discards their hand and draws 7 cards.", () => {
    const testStore = new TestStore(
      {
        inkwell: aWholeNewWorld.cost,
        hand: [dingleHopper, aWholeNewWorld],
        deck: 7,
      },
      {
        hand: [magicBroomBucketBrigade, teKaTheBurningOne, moanaOfMotunui],
        deck: 7,
      },
    );

    testStore.store.playCardFromHand(
      testStore.getByZoneAndId("hand", aWholeNewWorld.id).instanceId,
    );

    expect(testStore.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ hand: 7, discard: 2, deck: 0 }),
    );
    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ hand: 7, discard: 3, deck: 0 }),
    );
  });

  it("Should also trigger on empty hand", () => {
    const testStore = new TestStore(
      {
        inkwell: aWholeNewWorld.cost,
        hand: [aWholeNewWorld],
        deck: 7,
      },
      {
        hand: [],
        deck: 7,
      },
    );

    testStore.store.playCardFromHand(
      testStore.getByZoneAndId("hand", aWholeNewWorld.id).instanceId,
    );

    expect(testStore.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ hand: 7, discard: 1, deck: 0 }),
    );
    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ hand: 7, discard: 0, deck: 0 }),
    );
  });
});
