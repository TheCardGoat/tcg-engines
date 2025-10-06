/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { wrechitRalphDemolitionDude } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Wrech-It Ralph - Demolition Dude", () => {
  describe("**REFRESHING BREAK** Whenever you ready this character, gain 1 lore for each 1 damage on him.", () => {
    it("Gains lore passing turn", () => {
      const testStore = new TestStore(
        {
          play: [wrechitRalphDemolitionDude],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const cardUnderTest = testStore.getCard(wrechitRalphDemolitionDude);
      cardUnderTest.updateCardMeta({ exerted: true });

      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);

      testStore.passTurn();
      testStore.passTurn();

      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);

      cardUnderTest.updateCardMeta({ exerted: true, damage: 3 });

      testStore.passTurn();
      testStore.passTurn();

      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(3);
    });
  });
});
