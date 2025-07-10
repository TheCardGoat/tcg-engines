/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { ursulaMadSeaWitch } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Ursula - Mad Sea Witch", () => {
  it.skip("**Challenger +2** _(While challenging, this character gets +2 {S}.)_", () => {
    const testStore = new TestStore({
      inkwell: ursulaMadSeaWitch.cost,
      play: [ursulaMadSeaWitch],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      ursulaMadSeaWitch.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
