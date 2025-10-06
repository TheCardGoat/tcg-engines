/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { starlightVial } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";

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
