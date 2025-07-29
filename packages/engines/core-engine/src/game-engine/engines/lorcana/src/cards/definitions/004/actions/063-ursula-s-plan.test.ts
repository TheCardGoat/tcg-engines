import { describe, expect, it } from "bun:test";
import { ursulasPlan } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ursula's Plan", () => {
  it.skip("Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.", () => {
    const testStore = new TestStore({
      inkwell: ursulasPlan.cost,
      hand: [ursulasPlan],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", ursulasPlan.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
