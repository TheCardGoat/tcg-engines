import { describe, expect, it } from "bun:test";
import { dragonFire } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dragon Fire", () => {
  it("Banish chosen character.", () => {
    const testStore = new TestStore({
      inkwell: dragonFire.cost,
      hand: [dragonFire],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", dragonFire.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("discard");
  });
});
