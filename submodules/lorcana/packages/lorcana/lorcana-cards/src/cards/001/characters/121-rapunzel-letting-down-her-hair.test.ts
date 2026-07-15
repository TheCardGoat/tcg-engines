import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { rapunzelLettingDownHerHair } from "./121-rapunzel-letting-down-her-hair";

describe("Rapunzel - Letting Down Her Hair (Set 1)", () => {
  describe("TANGLE - When you play this character, each opponent loses 1 lore.", () => {
    it("causes each opponent to lose 1 lore when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rapunzelLettingDownHerHair],
          inkwell: rapunzelLettingDownHerHair.cost,
          deck: 2,
        },
        {
          lore: 5,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rapunzelLettingDownHerHair)).toBeSuccessfulCommand();

      // Opponent should have lost 1 lore
      expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(4);
    });

    it("does not affect the player's own lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rapunzelLettingDownHerHair],
          inkwell: rapunzelLettingDownHerHair.cost,
          lore: 3,
          deck: 2,
        },
        {
          lore: 5,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rapunzelLettingDownHerHair)).toBeSuccessfulCommand();

      // Player one's lore should be unchanged
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
      // Opponent loses 1
      expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(4);
    });

    it("opponent does not go below 0 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rapunzelLettingDownHerHair],
          inkwell: rapunzelLettingDownHerHair.cost,
          deck: 2,
        },
        {
          lore: 0,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rapunzelLettingDownHerHair)).toBeSuccessfulCommand();

      // Lore should not go negative
      expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(0);
    });
  });
});
