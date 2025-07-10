/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { princeJohnFalseKing } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
