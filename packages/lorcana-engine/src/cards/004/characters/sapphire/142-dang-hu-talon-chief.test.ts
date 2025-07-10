/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dangHuTalonChief } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
