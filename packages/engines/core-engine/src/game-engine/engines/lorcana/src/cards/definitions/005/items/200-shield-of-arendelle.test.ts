/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { shieldOfArendelle } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";

describe("Shield of Arendelle", () => {
  it.skip("**DEFLECT** Banish this item – Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
    const testStore = new TestStore({
      inkwell: shieldOfArendelle.cost,
      play: [shieldOfArendelle],
    });

    const cardUnderTest = testStore.getCard(shieldOfArendelle);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
