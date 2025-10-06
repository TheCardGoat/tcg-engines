/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { halfHexwellCrown } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
