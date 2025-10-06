/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { cubbyMightyLostBoy } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Cubby - Mighty Lost Boy", () => {
  it.skip("**THE BEAR** Whenever this character moves to a location, he gets +3 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: cubbyMightyLostBoy.cost,
      play: [cubbyMightyLostBoy],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cubbyMightyLostBoy.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
