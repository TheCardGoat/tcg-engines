import { describe, expect, it } from "bun:test";
import { princeJohnFalseKing } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince John - False King", () => {
  describe("**COLLECT TAXES** Whenever this character quests, each opponent with more Lore than you loses 2 Lore.", () => {
    it("Same lore", async () => {
      const testEngine = new TestEngine(
        {
          play: [princeJohnFalseKing],
          lore: 8,
        },
        {
          lore: 10,
        },
      );

      await testEngine.questCard(princeJohnFalseKing);

      expect(testEngine.getLoreForPlayer("player_one")).toEqual(
        8 + princeJohnFalseKing.lore,
      );
      expect(testEngine.getLoreForPlayer("player_two")).toEqual(10);
    });

    it("Opponent with more lore", async () => {
      const testEngine = new TestEngine(
        {
          play: [princeJohnFalseKing],
          lore: 8,
        },
        {
          lore: 12,
        },
      );

      await testEngine.questCard(princeJohnFalseKing);

      expect(testEngine.getLoreForPlayer("player_one")).toEqual(
        8 + princeJohnFalseKing.lore,
      );
      expect(testEngine.getLoreForPlayer("player_two")).toEqual(12 - 2);
    });
  });
});
