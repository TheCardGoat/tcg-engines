/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { tangle } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Tangle", () => {
  it("Each opponent loses 1 lore.", () => {
    const testStore = new TestStore({
      inkwell: tangle.cost,
      hand: [tangle],
    });

    testStore.store.tableStore.getTable("player_two").lore = 5;

    const cardUnderTest = testStore.getByZoneAndId("hand", tangle.id);

    cardUnderTest.playFromHand();

    expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
  });
});
