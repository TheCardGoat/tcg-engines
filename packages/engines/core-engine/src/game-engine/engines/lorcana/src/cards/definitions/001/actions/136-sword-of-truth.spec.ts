/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { teKaTheBurningOne } from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { swordOfTruth } from "@lorcanito/lorcana-engine/cards/001/items/items.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
