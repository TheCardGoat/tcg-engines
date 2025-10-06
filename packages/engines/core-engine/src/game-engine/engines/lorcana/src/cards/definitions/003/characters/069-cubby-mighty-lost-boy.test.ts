/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { cubbyMightyLostBoy } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
