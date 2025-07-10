/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { makeThePotion } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Make the Potion", () => {
  it.skip("Choose one:· Banish chosen item.· Deal 2 damage to chosen damaged character.", () => {
    const testStore = new TestStore({
      inkwell: makeThePotion.cost,
      hand: [makeThePotion],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", makeThePotion.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
