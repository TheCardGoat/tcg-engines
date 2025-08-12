import { describe, expect, it } from "bun:test";
import { rememberWhoYouAre } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Remember Who You Are", () => {
  it.skip("If chosen opponent has more cards in their hand than you, draw cards until you have the same number.", () => {
    const testStore = new TestStore({
      inkwell: rememberWhoYouAre.cost,
      hand: [rememberWhoYouAre],
    });

    const cardUnderTest = testStore.getCard(rememberWhoYouAre);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
