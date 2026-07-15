import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { angelSirenSinger } from "./025-angel-siren-singer";

describe("Angel - Siren Singer", () => {
  describe("UNDERDOG - If this is your first turn and you're not the first player, you pay 1 {I} less to play this character", () => {
    it("should reduce cost by 1 for the second player on their first turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 5 },
        {
          hand: [angelSirenSinger],
          inkwell: angelSirenSinger.cost - 1, // 1 ink — enough with Underdog discount
          deck: 5,
        },
      );

      // Pass player one's first turn
      testEngine.asPlayerOne().passTurn();

      // Player two is NOT the first player, and this is their first turn → Underdog applies
      const result = testEngine.asPlayerTwo().playCard(angelSirenSinger);
      expect(result.success).toBe(true);
      expect(testEngine.asPlayerTwo().getCardZone(angelSirenSinger)).toBe("play");
    });

    it("should NOT reduce cost for the first player", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [angelSirenSinger],
          inkwell: angelSirenSinger.cost - 1, // Only 1 ink
          deck: 5,
        },
        { deck: 5 },
      );

      // Player one IS the first player → Underdog does NOT apply
      const result = testEngine.asPlayerOne().playCard(angelSirenSinger);
      expect(result.success).toBe(false);
    });

    it("should NOT reduce cost on subsequent turns (not first turn)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 5 },
        {
          hand: [angelSirenSinger],
          inkwell: angelSirenSinger.cost - 1,
          deck: 5,
        },
      );

      // Pass through first turns
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();
      testEngine.asPlayerOne().passTurn();

      // Player two's second turn → Underdog should NOT apply
      const result = testEngine.asPlayerTwo().playCard(angelSirenSinger);
      expect(result.success).toBe(false);
    });

    it("should NOT reduce cost when player two has 0 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 5 },
        {
          hand: [angelSirenSinger],
          inkwell: 0, // No ink at all — even with -1 discount, cost can't go below 0... but Angel costs 2, so 2-1=1 > 0
          deck: 5,
        },
      );

      testEngine.asPlayerOne().passTurn();

      // Even with Underdog, need at least 1 ink (2 - 1 = 1)
      const result = testEngine.asPlayerTwo().playCard(angelSirenSinger);
      expect(result.success).toBe(false);
    });
  });
});
