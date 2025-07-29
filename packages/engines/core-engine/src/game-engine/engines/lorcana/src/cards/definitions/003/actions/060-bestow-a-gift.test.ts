import { describe, expect, it } from "bun:test";
import { bestowAGift } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bestow a Gift", () => {
  it.skip("Move 1 damage counter from chosen character to chosen opposing character.", () => {
    const testStore = new TestStore({
      inkwell: bestowAGift.cost,
      hand: [bestowAGift],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", bestowAGift.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
