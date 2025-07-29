import { describe, expect, it } from "bun:test";
import { tangle } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
