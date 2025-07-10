/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { kingOfHeartsMonarchOfWonderland } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("King of Hearts - Monarch of Wonderland", () => {
  it.skip("**PLEASING THE QUEEN** {E} – Chosen exerted character can’t ready at the start of their next turn.", () => {
    const testStore = new TestStore({
      inkwell: kingOfHeartsMonarchOfWonderland.cost,
      play: [kingOfHeartsMonarchOfWonderland],
    });

    const cardUnderTest = testStore.getCard(kingOfHeartsMonarchOfWonderland);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
