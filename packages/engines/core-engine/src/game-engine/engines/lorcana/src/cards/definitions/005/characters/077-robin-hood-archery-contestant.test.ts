/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { robinHoodArcheryContestant } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Robin Hood - Archery Contestant", () => {
  it.skip("**TRICK SHOT** When you play this character, if an opponent has a damaged character in play, gain 1 lore.", () => {
    const testStore = new TestStore({
      inkwell: robinHoodArcheryContestant.cost,
      hand: [robinHoodArcheryContestant],
    });

    const cardUnderTest = testStore.getCard(robinHoodArcheryContestant);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
