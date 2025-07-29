import { describe, expect, it } from "bun:test";
import { fireTheCannons } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fire The Cannons!", () => {
  it("Deal 2 damage to chosen character", () => {
    const testStore = new TestStore({
      inkwell: fireTheCannons.cost,
      hand: [fireTheCannons],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", fireTheCannons.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
    target.updateCardMeta({ damage: 0 });
    expect(target.meta).toEqual(expect.objectContaining({ damage: 0 }));

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.meta).toEqual(expect.objectContaining({ damage: 2 }));
  });
});
