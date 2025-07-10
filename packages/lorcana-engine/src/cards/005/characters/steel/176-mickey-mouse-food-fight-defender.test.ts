/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseFoodFightDefender } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Mickey Mouse - Food Fight Defender", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: mickeyMouseFoodFightDefender.cost,
      play: [mickeyMouseFoodFightDefender],
    });

    const cardUnderTest = testStore.getCard(mickeyMouseFoodFightDefender);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
