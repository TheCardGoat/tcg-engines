/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  dingleHopper,
  plasmaBlaster,
} from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Plasma Blaster", () => {
  it("Quick shot - Deal 1 damage to chosen character.", () => {
    const testStore = new TestStore({
      play: [plasmaBlaster, mickeyMouseTrueFriend],
      inkwell: [dingleHopper, dingleHopper],
    });

    const damagedChar = testStore.getByZoneAndId(
      "play",
      mickeyMouseTrueFriend.id,
    );
    damagedChar.updateCardMeta({ damage: 1 });
    expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 1 }));

    const cardUnderTest = testStore.getByZoneAndId("play", plasmaBlaster.id);

    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    cardUnderTest.activate();
    expect(testStore.store.stackLayerStore.layers).toHaveLength(1);

    const effect = testStore.store.stackLayerStore.layers[0];
    if (effect) {
      testStore.resolveTopOfStack({
        targets: [damagedChar],
      });
    }

    expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 2 }));
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });
});
