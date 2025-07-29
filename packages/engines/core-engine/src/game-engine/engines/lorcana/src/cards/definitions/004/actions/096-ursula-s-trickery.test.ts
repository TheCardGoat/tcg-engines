import { describe, expect, it } from "bun:test";
import { ursulasTrickery } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ursula's Trickery", () => {
  it.skip("Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.", () => {
    const testStore = new TestStore({
      inkwell: ursulasTrickery.cost,
      hand: [ursulasTrickery],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", ursulasTrickery.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
