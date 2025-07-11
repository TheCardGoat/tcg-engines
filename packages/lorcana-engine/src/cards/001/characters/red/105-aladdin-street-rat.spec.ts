/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { aladdinStreetRat } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Aladdin - Street Rat", () => {
  describe("**IMPROVISE** When you play this character each opponent loses 1 lore.", () => {
    it("Opponent loses lore", () => {
      const testStore = new TestStore({
        inkwell: aladdinStreetRat.cost,
        hand: [aladdinStreetRat],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        aladdinStreetRat.id,
      );

      testStore.store.tableStore.getTable("player_two").lore = 5;

      cardUnderTest.playFromHand();

      expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
    });
  });
});
