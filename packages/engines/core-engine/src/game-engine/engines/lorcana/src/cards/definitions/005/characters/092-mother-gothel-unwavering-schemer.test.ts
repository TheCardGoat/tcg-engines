import { describe, it } from "bun:test";
import { motherGothelUnwaveringSchemer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
