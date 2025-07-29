import { describe, expect, it } from "bun:test";
import { swingIntoAction } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Swing Into Action", () => {
  it.skip("Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_", () => {
    const testStore = new TestStore({
      inkwell: swingIntoAction.cost,
      hand: [swingIntoAction],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", swingIntoAction.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
