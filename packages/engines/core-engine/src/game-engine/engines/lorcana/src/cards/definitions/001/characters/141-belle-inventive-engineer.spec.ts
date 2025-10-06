/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { belleInventive } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { lantern } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";

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
