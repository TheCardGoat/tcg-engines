/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
