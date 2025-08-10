import { describe, expect, it } from "bun:test";
import { foodFight } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Food Fight!", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: foodFight.cost,
      hand: [foodFight],
    });

    const cardUnderTest = testStore.getCard(foodFight);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
