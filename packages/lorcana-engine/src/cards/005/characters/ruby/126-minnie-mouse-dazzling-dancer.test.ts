/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { minnieMouseDazzlingDancer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Minnie Mouse - Dazzling Dancer", () => {
  it.skip("**DANCE-OFF** Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.", () => {
    const testStore = new TestStore({
      inkwell: minnieMouseDazzlingDancer.cost,
      play: [minnieMouseDazzlingDancer],
    });

    const cardUnderTest = testStore.getCard(minnieMouseDazzlingDancer);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
