/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/001/actions/actions.ts";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
