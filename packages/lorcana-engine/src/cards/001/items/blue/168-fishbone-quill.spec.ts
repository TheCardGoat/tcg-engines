/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  dingleHopper,
  fishboneQuill,
} from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Fishbone Quill", () => {
  it("Go Ahead And Sign", () => {
    const testStore = new TestStore({
      hand: [dingleHopper],
      play: [fishboneQuill],
    });
    const store = testStore.store;
    const tableStore = store.tableStore;

    const cardUnderTest = testStore.getByZoneAndId("play", fishboneQuill.id);

    expect(
      tableStore.getPlayerZone("player_one", "inkwell")?.cards,
    ).toHaveLength(0);
    expect(tableStore.getPlayerZone("player_one", "hand")?.cards).toHaveLength(
      1,
    );

    cardUnderTest.activate();

    const effect = store.stackLayerStore.layers[0];
    if (effect) {
      const target = testStore.getByZoneAndId("hand", dingleHopper.id);

      testStore.store.stackLayerStore.resolveTopOfStack({
        targets: [target],
      });
    }

    expect(
      tableStore.getPlayerZone("player_one", "inkwell")?.cards,
    ).toHaveLength(1);
    expect(tableStore.getPlayerZone("player_one", "hand")?.cards).toHaveLength(
      0,
    );
    expect(testStore.getCard(dingleHopper).meta.exerted).toBeFalsy();
    expect(store.stackLayerStore.layers).toHaveLength(0);
  });
});
