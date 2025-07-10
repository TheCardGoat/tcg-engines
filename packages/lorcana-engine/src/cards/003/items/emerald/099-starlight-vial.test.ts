/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { starlightVial } from "@lorcanito/lorcana-engine/cards/003/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Starlight Vial", () => {
  it.skip("**EFFICIENT ENERGY** {E} – You pay 2 {I} less for the next action you play this turn.**TRAP** 2 {I}, Banish this item – Draw 2 cards, then choose and discard a card.", () => {
    const testStore = new TestStore({
      inkwell: starlightVial.cost,
      play: [starlightVial],
    });

    const cardUnderTest = testStore.getCard(starlightVial);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
