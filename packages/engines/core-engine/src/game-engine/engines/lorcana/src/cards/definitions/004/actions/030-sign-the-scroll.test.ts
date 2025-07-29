import { describe, expect, it } from "bun:test";
import { signTheScroll } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sign The Scroll", () => {
  it.skip("Each opponent may chose and discard a chard. For each opponent who doesn't, you gain 2 lore.", () => {
    const testStore = new TestStore({
      inkwell: signTheScroll.cost,
      hand: [signTheScroll],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", signTheScroll.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
