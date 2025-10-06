/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { elsaGlovesOff } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Elsa - Gloves Off", () => {
  it.skip("**Challenger** +3 _(While challenging, this character gets +3 {S})_", () => {
    const testStore = new TestStore({
      inkwell: elsaGlovesOff.cost,

      play: [elsaGlovesOff],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", elsaGlovesOff.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
