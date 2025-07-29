import { describe, expect, it } from "bun:test";
import { quickPatch } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Quick Patch", () => {
  it.skip("Remove up to 3 damage from chosen location.", () => {
    const testStore = new TestStore({
      inkwell: quickPatch.cost,
      hand: [quickPatch],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", quickPatch.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
