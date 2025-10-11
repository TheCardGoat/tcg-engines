import { describe, expect, it } from "bun:test";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import { princeJohnOpportunisticBriber } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince John - Opportunistic Briber", () => {
  it("**TAXES NEVER FAIL ME** Whenever you play an item, this character gets +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: pawpsicle.cost,
      hand: [pawpsicle],
      play: [princeJohnOpportunisticBriber],
    });

    const cardUnderTest = testStore.getCard(princeJohnOpportunisticBriber);
    const trigger = testStore.getCard(pawpsicle);

    expect(cardUnderTest.strength).toBe(princeJohnOpportunisticBriber.strength);

    trigger.playFromHand();
    testStore.resolveOptionalAbility();

    expect(cardUnderTest.strength).toBe(
      princeJohnOpportunisticBriber.strength + 2,
    );
  });
});
