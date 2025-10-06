/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mysticalRose } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";

describe("Mystical Rose", () => {
  it.skip("**DISPEL THE ENTANGLEMENT** Banish this item − Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.", () => {
    const testStore = new TestStore({
      inkwell: mysticalRose.cost,
      play: [mysticalRose],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", mysticalRose.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
