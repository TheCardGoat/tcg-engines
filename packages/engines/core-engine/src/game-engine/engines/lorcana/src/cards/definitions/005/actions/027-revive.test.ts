import { describe, expect, it } from "bun:test";
import { revive } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Revive", () => {
  it.skip("Play a character card with cost 5 or less from your discard for free.", () => {
    const testStore = new TestStore({
      inkwell: revive.cost,
      hand: [revive],
    });

    const cardUnderTest = testStore.getCard(revive);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
