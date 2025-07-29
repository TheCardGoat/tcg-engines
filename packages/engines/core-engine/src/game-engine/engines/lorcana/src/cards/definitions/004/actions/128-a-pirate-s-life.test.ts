/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/004/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("A Pirate's Life", () => {
  it("**Sing Together** 6 _(Any number of your of your teammates' characters with total cost 6 or more may {E} to sing this song for free.)_Each opponent loses 2 lore. You gain 2 lore.", () => {
    const testStore = new TestStore({
      inkwell: aPiratesLife.cost,
      hand: [aPiratesLife],
    });

    testStore.store.tableStore.getTable("player_two").lore = 5;

    const cardUnderTest = testStore.getByZoneAndId("hand", aPiratesLife.id);

    cardUnderTest.playFromHand();

    // Verify opponent loses 2 lore
    expect(testStore.store.tableStore.getTable("player_two").lore).toBe(3);
    // Verify player gains 2 lore (starting lore is 0, so should be 2)
    expect(testStore.store.tableStore.getTable("player_one").lore).toBe(2);
  });
});
