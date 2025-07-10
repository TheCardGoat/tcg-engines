/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { arthurNoviceSparrow } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Arthur - Novice Sparrow", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: arthurNoviceSparrow.cost,
      play: [arthurNoviceSparrow],
    });

    const cardUnderTest = testStore.getCard(arthurNoviceSparrow);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
