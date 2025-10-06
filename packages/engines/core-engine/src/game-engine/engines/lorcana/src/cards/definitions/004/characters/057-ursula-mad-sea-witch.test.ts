/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { ursulaMadSeaWitch } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

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
