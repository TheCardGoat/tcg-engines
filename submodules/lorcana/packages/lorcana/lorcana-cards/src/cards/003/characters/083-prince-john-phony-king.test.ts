import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { princeJohnPhonyKing } from "./083-prince-john-phony-king";

const dummyCharacter = createMockCharacter({
  id: "dummy-character",
  name: "Dummy Character",
  cost: 1,
});

describe("Prince John - Phony King", () => {
  describe("COLLECT TAXES - Whenever this character quests, each opponent with more lore than you loses 2 lore.", () => {
    it("makes an opponent with more lore lose 2 lore when Prince John quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnPhonyKing],
          lore: 1,
        },
        {
          lore: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(princeJohnPhonyKing)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(3);
    });

    it("does not make an opponent with equal lore lose lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnPhonyKing],
          lore: 3,
        },
        {
          lore: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(princeJohnPhonyKing)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(3);
    });

    it("does not make an opponent with less lore lose lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnPhonyKing],
          lore: 5,
        },
        {
          lore: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(princeJohnPhonyKing)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2);
    });

    it("also gains lore for Prince John himself questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnPhonyKing],
          lore: 1,
        },
        {
          lore: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(princeJohnPhonyKing)).toBeSuccessfulCommand();
      // Prince John has lore value of 2, so P1 gains 2 lore (1 + 2 = 3)
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
      // P2 had 5 lore, more than P1's 1, so loses 2 (5 - 2 = 3)
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(3);
    });
  });
});
