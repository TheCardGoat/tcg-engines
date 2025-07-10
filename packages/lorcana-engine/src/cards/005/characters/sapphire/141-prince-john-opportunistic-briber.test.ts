/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { princeJohnOpportunisticBriber } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Prince John - Opportunistic Briber", () => {
  it("**TAXES NEVER FAIL ME** Whenever you play an item, this character gets +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: pawpsicle.cost,
      hand: [pawpsicle],
      play: [princeJohnOpportunisticBriber],
    });

    const cardUnderTest = testStore.getCard(princeJohnOpportunisticBriber);
    const trigger = testStore.getCard(pawpsicle);

    trigger.playFromHand();

    expect(cardUnderTest.strength).toBe(
      princeJohnOpportunisticBriber.strength + 2,
    );
  });
});
