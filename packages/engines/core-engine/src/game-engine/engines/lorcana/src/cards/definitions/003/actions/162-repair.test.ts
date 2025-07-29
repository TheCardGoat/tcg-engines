import { describe, expect, it } from "bun:test";
import { repair } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Repair", () => {
  it.skip("Remove up to 3 damage from one of your locations or characters.", () => {
    const testStore = new TestStore({
      inkwell: repair.cost,
      hand: [repair],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", repair.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
