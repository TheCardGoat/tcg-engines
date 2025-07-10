/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { eyeOfTheFate } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Eye of the Fates", () => {
  it("See the Future - Chosen character gets +1 {L} this turn.", () => {
    const testStore = new TestStore({
      play: [eyeOfTheFate, mickeyMouseTrueFriend],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", eyeOfTheFate.id);
    const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);
    const lore = target.lorcanitoCard.lore || 0;

    cardUnderTest.activate();

    expect(target.lore).toEqual(lore);
    testStore.resolveTopOfStack({ targetId: target.instanceId });
    expect(target.lore).toEqual((lore || 0) + 1);
  });
});
