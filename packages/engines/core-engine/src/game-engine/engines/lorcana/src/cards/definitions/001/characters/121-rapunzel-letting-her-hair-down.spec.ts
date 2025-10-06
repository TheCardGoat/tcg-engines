/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { rapunzelLettingHerHairDown } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rapunzel - Letting Down Her Hair", () => {
  describe("**TANGLE** When you play this character, each opponent loses 1 lore.", () => {
    it("Opponent loses lore", () => {
      const testStore = new TestStore({
        inkwell: rapunzelLettingHerHairDown.cost,
        hand: [rapunzelLettingHerHairDown],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        rapunzelLettingHerHairDown.id,
      );

      testStore.store.tableStore.getTable("player_two").lore = 5;

      cardUnderTest.playFromHand();

      expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
    });
  });
});
