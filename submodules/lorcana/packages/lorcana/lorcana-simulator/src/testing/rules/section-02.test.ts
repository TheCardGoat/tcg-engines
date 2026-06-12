// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/02-gameplay.md

import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";

describe("### 2. GAMEPLAY", () => {
  describe("#### 2.3. In-Game Stage", () => {
    it("2.3.3.1. A player who has 20 or more lore wins the game.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          createMockCharacter({ id: "quester-1", name: "Quester 1", cost: 1, lore: 1 }),
          createMockCharacter({ id: "quester-2", name: "Quester 2", cost: 2, lore: 2 }),
          createMockCharacter({ id: "quester-3", name: "Quester 3", cost: 3, lore: 3 }),
          createMockCharacter({ id: "quester-4", name: "Quester 4", cost: 4, lore: 4 }),
          createMockCharacter({ id: "quester-5", name: "Quester 5", cost: 5, lore: 5 }),
          createMockCharacter({ id: "quester-6", name: "Quester 6", cost: 6, lore: 5 }),
        ],
      });

      const result = testEngine.asPlayerOne().questWithAll();

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toEqual(20);
      expect(testEngine.asPlayerOne().getWinner()).toEqual(PLAYER_ONE);
    });

    it("2.3.3.2. A player who ends their turn with no cards in their deck loses the game.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 0,
        },
        {
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().passTurn();

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getWinner()).toEqual(PLAYER_TWO);
    });
  });
});
