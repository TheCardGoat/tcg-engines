/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { simbaLostPrince } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Simba - Lost Prince", () => {
  it.skip("**FACE THE PAST** During your turn, whenever this character banishes another character in a challenge, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: simbaLostPrince.cost,
      play: [simbaLostPrince],
    });

    const cardUnderTest = testStore.getCard(simbaLostPrince);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
