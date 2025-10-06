/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { maidMarianLadyOfTheLists } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Maid Marian - Lady of the Lists", () => {
  it.skip("IF THE LADY WANTS IT", () => {
    const testStore = new TestStore({
      inkwell: maidMarianLadyOfTheLists.cost,
      play: [maidMarianLadyOfTheLists],
    });

    const cardUnderTest = testStore.getCard(maidMarianLadyOfTheLists);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
