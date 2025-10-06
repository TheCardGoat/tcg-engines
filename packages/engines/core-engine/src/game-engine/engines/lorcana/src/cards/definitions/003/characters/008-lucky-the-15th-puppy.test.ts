/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { luckyThe_15thPuppy } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lucky - The 15th Puppy", () => {
  it.skip("**GOOD AS NEW** {E} – Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.**PUPPY LOVE** Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.", () => {
    const testStore = new TestStore({
      inkwell: luckyThe_15thPuppy.cost,
      play: [luckyThe_15thPuppy],
    });

    const cardUnderTest = testStore.getCard(luckyThe_15thPuppy);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
