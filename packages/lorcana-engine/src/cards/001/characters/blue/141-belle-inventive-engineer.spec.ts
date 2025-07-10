/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { belleInventive } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { lantern } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Belle - Inventive Engineer", () => {
  it("**TINKER** Whenever this character quests, you pay 1 {I} less for the next item you play this turn.", () => {
    const testStore = new TestStore({
      inkwell: lantern.cost - 1,
      hand: [lantern],
      play: [belleInventive],
    });

    const reducedCostItem = testStore.getByZoneAndId("hand", lantern.id);

    const cardUnderTest = testStore.getByZoneAndId("play", belleInventive.id);
    cardUnderTest.quest();

    reducedCostItem.playFromHand();

    expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
    expect(reducedCostItem.zone).toEqual("play");
  });
});
