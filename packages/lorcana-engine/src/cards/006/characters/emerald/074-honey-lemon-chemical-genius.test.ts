/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { honeyLemonChemicalGenius } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Honey Lemon - Chemical Genius", () => {
  it.skip("**HERE'S THE BEST PART** When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.", () => {
    const testStore = new TestStore({
      inkwell: honeyLemonChemicalGenius.cost,
      hand: [honeyLemonChemicalGenius],
    });

    const cardUnderTest = testStore.getCard(honeyLemonChemicalGenius);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
