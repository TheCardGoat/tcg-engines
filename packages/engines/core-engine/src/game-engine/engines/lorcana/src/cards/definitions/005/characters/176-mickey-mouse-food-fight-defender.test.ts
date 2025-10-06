/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mickeyMouseFoodFightDefender } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

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
