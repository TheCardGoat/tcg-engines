/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { bruniFireSalamander } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
