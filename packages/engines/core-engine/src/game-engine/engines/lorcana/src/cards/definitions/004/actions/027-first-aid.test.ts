import { describe, expect, it } from "bun:test";
import { firstAid } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("First Aid", () => {
  it.skip("Remove up to 1 damage from each of your characters.", () => {
    const testStore = new TestStore({
      inkwell: firstAid.cost,
      hand: [firstAid],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", firstAid.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
