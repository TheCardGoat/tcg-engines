/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { plutoRescueDog } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

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
