import { describe, expect, it } from "bun:test";
import { teKaTheBurningOne } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { swordOfTruth } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
