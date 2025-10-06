/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { motherGothelUnwaveringSchemer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Mother Gothel - Unwavering Schemer", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: motherGothelUnwaveringSchemer.cost,
      play: [motherGothelUnwaveringSchemer],
    });

    const cardUnderTest = testStore.getCard(motherGothelUnwaveringSchemer);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**THE WORLD IS DARK** When you play this character, each opponent chooses one of their characters and returns that card to their hand.", () => {
    const testStore = new TestStore({
      inkwell: motherGothelUnwaveringSchemer.cost,
      hand: [motherGothelUnwaveringSchemer],
    });

    const cardUnderTest = testStore.getCard(motherGothelUnwaveringSchemer);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
