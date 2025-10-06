/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { treasureGuardianProtectorOfTheCave } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Treasure Guardian - Protector of the Cave", () => {
  it.skip("**WHO DISTURBS MY SLUMBER?** This character can't challenge or quest unless it is at a location.", () => {
    const testStore = new TestStore({
      inkwell: treasureGuardianProtectorOfTheCave.cost,
      play: [treasureGuardianProtectorOfTheCave],
    });

    const cardUnderTest = testStore.getCard(treasureGuardianProtectorOfTheCave);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
