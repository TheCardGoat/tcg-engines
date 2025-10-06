/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { dangHuTalonChief } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dang Hu - Talon Chief", () => {
  it.skip("**YOU BETTER TALK FAST** Your other Villain characters gain **Support.** _(Whenever they quest, you mad add their {S} to another chosen character's {S} this turn.)_", () => {
    const testStore = new TestStore({
      inkwell: dangHuTalonChief.cost,
      play: [dangHuTalonChief],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", dangHuTalonChief.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
