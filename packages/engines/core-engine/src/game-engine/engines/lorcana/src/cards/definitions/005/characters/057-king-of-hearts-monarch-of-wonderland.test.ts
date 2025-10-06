/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { kingOfHeartsMonarchOfWonderland } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
