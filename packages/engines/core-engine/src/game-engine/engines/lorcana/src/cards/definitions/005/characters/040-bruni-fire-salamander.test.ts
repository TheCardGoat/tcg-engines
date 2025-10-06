/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { bruniFireSalamander } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bruni - Fire Salamander", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: bruniFireSalamander.cost,
      play: [bruniFireSalamander],
    });

    const cardUnderTest = testStore.getCard(bruniFireSalamander);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**PARTING GIFT** When this character is banished, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: bruniFireSalamander.cost,
      play: [bruniFireSalamander],
    });

    const cardUnderTest = testStore.getCard(bruniFireSalamander);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
