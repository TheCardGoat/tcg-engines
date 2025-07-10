/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { plutoRescueDog } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Pluto - Rescue Dog", () => {
  it.skip("**TO THE RESCUE** When you play this character, you may remove up to 3 damage from chosen character.", () => {
    const testStore = new TestStore({
      inkwell: plutoRescueDog.cost,
      hand: [plutoRescueDog],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", plutoRescueDog.id);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
