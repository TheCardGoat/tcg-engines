/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { breakFree } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Break Free", () => {
  it.skip("Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} will this turn. _(They can challenge the turn they’re played.)_", () => {
    const testStore = new TestStore({
      inkwell: breakFree.cost,
      hand: [breakFree],
    });

    const cardUnderTest = testStore.getCard(breakFree);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
