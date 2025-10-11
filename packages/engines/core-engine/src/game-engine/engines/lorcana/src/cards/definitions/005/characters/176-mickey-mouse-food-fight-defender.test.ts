import { describe, it } from "bun:test";
import { mickeyMouseFoodFightDefender } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
