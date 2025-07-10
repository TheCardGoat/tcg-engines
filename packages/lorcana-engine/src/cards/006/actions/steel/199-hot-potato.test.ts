/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hotPotato } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Hot Potato", () => {
  it.skip("Choose one:· Deal 2 damage to chosen character.· Banish chosen item.", () => {
    const testStore = new TestStore({
      inkwell: hotPotato.cost,
      hand: [hotPotato],
    });

    const cardUnderTest = testStore.getCard(hotPotato);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
