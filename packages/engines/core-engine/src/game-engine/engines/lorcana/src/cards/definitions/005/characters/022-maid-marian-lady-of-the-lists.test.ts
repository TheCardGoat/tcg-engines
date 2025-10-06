/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { maidMarianLadyOfTheLists } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

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
