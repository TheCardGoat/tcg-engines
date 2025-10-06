/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { magicBroomBucketBrigade } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dinglehopper", () => {
  it("STRAIGHTEN HAIR - healing 1 damage", () => {
    const testStore = new TestStore({
      play: [dingleHopper, magicBroomBucketBrigade],
    });

    const damagedChar = testStore.getByZoneAndId(
      "play",
      magicBroomBucketBrigade.id,
    );
    damagedChar.updateCardMeta({ damage: 1 });
    expect(
      testStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
    ).toEqual(expect.objectContaining({ damage: 1 }));

    const cardUnderTest = testStore.getByZoneAndId("play", dingleHopper.id);

    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    cardUnderTest.activate();
    expect(testStore.store.stackLayerStore.layers).toHaveLength(1);

    const effect = testStore.store.stackLayerStore.layers[0];
    if (effect) {
      testStore.resolveTopOfStack({
        targets: [damagedChar],
      });
    }

    expect(
      testStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
    ).toEqual(expect.objectContaining({ damage: 0 }));
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });

  it("STRAIGHTEN HAIR - healing 0 damage", () => {
    const testStore = new TestStore({
      play: [dingleHopper, magicBroomBucketBrigade],
    });

    const damagedChar = testStore.getByZoneAndId(
      "play",
      magicBroomBucketBrigade.id,
    );

    const cardUnderTest = testStore.getByZoneAndId("play", dingleHopper.id);

    cardUnderTest.activate();

    const effect = testStore.store.stackLayerStore.layers[0];
    if (effect) {
      testStore.resolveTopOfStack({
        targets: [damagedChar],
      });
    }

    expect(
      testStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta.damage,
    ).toBeFalsy();
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });
});
