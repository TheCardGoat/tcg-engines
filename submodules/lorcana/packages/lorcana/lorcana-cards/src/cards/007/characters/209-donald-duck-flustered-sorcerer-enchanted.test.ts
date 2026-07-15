import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { donaldDuckFlusteredSorcererEnchanted } from "./209-donald-duck-flustered-sorcerer-enchanted";

describe("Donald Duck - Flustered Sorcerer (Enchanted)", () => {
  describe("OBFUSCATE! - Opponents need 25 lore to win the game.", () => {
    it("opponent at 24 lore does not win while Donald is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckFlusteredSorcererEnchanted],
          deck: 5,
        },
        {
          lore: 24,
          deck: 5,
        },
      );

      // Game should still be in progress — opponent has 24 lore but needs 25 while Donald is in play
      expect(testEngine.getLore(PLAYER_TWO)).toBe(24);
      expect(testEngine.asPlayerOne().getCardZone(donaldDuckFlusteredSorcererEnchanted)).toBe(
        "play",
      );
      // The game must not have ended yet
      expect(testEngine.getAuthoritativeState().ctx.status.gameEnded).toBeFalsy();
    });

    it("opponent at 25 lore wins while Donald is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckFlusteredSorcererEnchanted],
          deck: 5,
        },
        {
          lore: 25,
          deck: 5,
        },
      );

      // At 25 lore the opponent should meet the raised win condition
      expect(testEngine.getLore(PLAYER_TWO)).toBe(25);
      expect(testEngine.getAuthoritativeState().ctx.status.gameEnded).toBe(true);
    });

    it("opponent at 20 lore wins normally without Donald in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 5,
        },
        {
          lore: 20,
          deck: 5,
        },
      );

      // Without Donald, the standard 20-lore win condition applies
      expect(testEngine.getLore(PLAYER_TWO)).toBe(20);
      expect(testEngine.getAuthoritativeState().ctx.status.gameEnded).toBe(true);
    });
  });
});
