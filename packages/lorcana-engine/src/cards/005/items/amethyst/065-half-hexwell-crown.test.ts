/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { halfHexwellCrown } from "@lorcanito/lorcana-engine/cards/005/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Half Hexwell Crown", () => {
  it.skip("**AN UNEXPECTED FIND**, {E}, 2 {I} — Draw a card.", () => {
    const testStore = new TestStore({
      inkwell: halfHexwellCrown.cost,
      play: [halfHexwellCrown],
    });

    const cardUnderTest = testStore.getCard(halfHexwellCrown);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**A PERILOUS POWER** {E}, 2 {I}, Discard a card – Exert chosen character.", () => {
    const testStore = new TestStore({
      inkwell: halfHexwellCrown.cost,
      play: [halfHexwellCrown],
    });

    const cardUnderTest = testStore.getCard(halfHexwellCrown);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
