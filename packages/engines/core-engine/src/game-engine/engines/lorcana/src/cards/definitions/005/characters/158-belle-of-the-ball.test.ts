/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { belleOfTheBall } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Belle - Of the Ball", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: belleOfTheBall.cost,
      play: [belleOfTheBall],
    });

    const cardUnderTest = testStore.getCard(belleOfTheBall);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**USHERED INTO THE PARTY** When you play this character, your other characters gain **Ward** until the start of your next turn.", () => {
    const testStore = new TestStore({
      inkwell: belleOfTheBall.cost,
      hand: [belleOfTheBall],
    });

    const cardUnderTest = testStore.getCard(belleOfTheBall);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
