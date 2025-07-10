/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { healingTouch } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Healing Touch", () => {
  it.skip("Remove up to 4 damage from chosen character. Draw a card.", () => {
    const testStore = new TestStore({
      inkwell: healingTouch.cost,
      hand: [healingTouch],
    });

    const cardUnderTest = testStore.getCard(healingTouch);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
