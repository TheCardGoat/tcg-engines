/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { clarabelleContentedWallflower } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Clarabelle - Contented Wallflower", () => {
  it.skip("**ONE STEP BEHIND** When you play this character, if an opponent has more cards in their hand than you, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: clarabelleContentedWallflower.cost,
      hand: [clarabelleContentedWallflower],
    });

    const cardUnderTest = testStore.getCard(clarabelleContentedWallflower);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
