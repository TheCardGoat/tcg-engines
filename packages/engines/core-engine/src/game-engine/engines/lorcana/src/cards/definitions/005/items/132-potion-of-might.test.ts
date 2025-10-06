/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { potionOfMight } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";

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
