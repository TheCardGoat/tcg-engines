/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { plateArmor } from "@lorcanito/lorcana-engine/cards/005/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Plate Armor", () => {
  it.skip("**WELL CRAFTED** {E} – Chosen character gains **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_", () => {
    const testStore = new TestStore({
      inkwell: plateArmor.cost,
      play: [plateArmor],
    });

    const cardUnderTest = testStore.getCard(plateArmor);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
