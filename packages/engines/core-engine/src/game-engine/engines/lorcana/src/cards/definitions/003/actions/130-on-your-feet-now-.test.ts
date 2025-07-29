import { describe, expect, it } from "bun:test";
import { onYourFeetNow } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("On Your Feet! Now!", () => {
  it.skip("Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.", () => {
    const testStore = new TestStore({
      inkwell: onYourFeetNow.cost,
      hand: [onYourFeetNow],
    });

    const cardUnderTest = testStore.getCard(onYourFeetNow);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
