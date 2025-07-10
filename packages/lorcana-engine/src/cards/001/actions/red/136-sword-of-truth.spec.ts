/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { teKaTheBurningOne } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { swordOfTruth } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Sword of Truth", () => {
  it("**FINAL ENCHANTMENT** Banish this item − Banish chosen Villain character.", () => {
    const testStore = new TestStore({
      play: [swordOfTruth, teKaTheBurningOne],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", swordOfTruth.id);
    const target = testStore.getByZoneAndId("play", teKaTheBurningOne.id);

    cardUnderTest.activate();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("discard");
    expect(cardUnderTest.zone).toEqual("discard");
  });
});
