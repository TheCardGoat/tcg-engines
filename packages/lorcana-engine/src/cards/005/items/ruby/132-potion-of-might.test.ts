/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { potionOfMight } from "@lorcanito/lorcana-engine/cards/005/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Potion of Might", () => {
  it.skip("**VILE CONCOCTION** 1 {I} Banish this item – Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.", () => {
    const testStore = new TestStore({
      inkwell: potionOfMight.cost,
      play: [potionOfMight],
    });

    const cardUnderTest = testStore.getCard(potionOfMight);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
