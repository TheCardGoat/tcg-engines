/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { shenziScarsAccomplice } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Shenzi - Scar's Accomplice", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: shenziScarsAccomplice.cost,
      play: [shenziScarsAccomplice],
    });

    const cardUnderTest = testStore.getCard(shenziScarsAccomplice);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**EASY PICKINGS** While challenging a damaged character, this character gets +2 {S}.", () => {
    const testStore = new TestStore({
      inkwell: shenziScarsAccomplice.cost,
      play: [shenziScarsAccomplice],
    });

    const cardUnderTest = testStore.getCard(shenziScarsAccomplice);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
