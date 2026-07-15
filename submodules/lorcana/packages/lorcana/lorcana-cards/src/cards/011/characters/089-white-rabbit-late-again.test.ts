import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { whiteRabbitLateAgain } from "./089-white-rabbit-late-again";

describe("White Rabbit - Late Again", () => {
  describe("Evasive - Only characters with Evasive can challenge this character", () => {
    it("should have Evasive keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [whiteRabbitLateAgain],
      });

      const cardUnderTest = testEngine.getCardModel(whiteRabbitLateAgain);
      expect(cardUnderTest.hasEvasive).toBe(true);
    });
  });

  describe("UNDERDOG - If this is your first turn and you're not the first player, you pay 1 {I} less to play this character", () => {
    it("should reduce cost by 1 on first turn if not first player", () => {
      // Player two setup - they are not the first player
      // Player one goes first by default in LorcanaMultiplayerTestEngine
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 5,
        },
        {
          inkwell: whiteRabbitLateAgain.cost - 1, // Reduced cost due to UNDERDOG
          hand: [whiteRabbitLateAgain],
          deck: 5,
        },
      );

      // Pass turn to player two (who is not the first player, so UNDERDOG applies)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two plays White Rabbit with reduced cost
      expect(testEngine.asPlayerTwo().playCard(whiteRabbitLateAgain)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(whiteRabbitLateAgain)).toBe("play");
    });

    it("should not be playable without enough ink even with UNDERDOG", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 5,
        },
        {
          inkwell: 0, // No ink at all
          hand: [whiteRabbitLateAgain],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const result = testEngine.asPlayerTwo().playCard(whiteRabbitLateAgain);
      expect(result.success).toBe(false);
      expect(testEngine.asPlayerTwo().getCardZone(whiteRabbitLateAgain)).toBe("hand");
    });

    it("should not reduce cost if first player (even on first turn)", () => {
      // Player one is first player - UNDERDOG should not apply
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: whiteRabbitLateAgain.cost - 1, // Only reduced cost amount
        hand: [whiteRabbitLateAgain],
        deck: 5,
      });

      // First player tries to play - UNDERDOG should not apply
      const result = testEngine.asPlayerOne().playCard(whiteRabbitLateAgain);
      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(whiteRabbitLateAgain)).toBe("hand");
    });

    it("should require full cost if first player", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: whiteRabbitLateAgain.cost, // Full cost
        hand: [whiteRabbitLateAgain],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(whiteRabbitLateAgain)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(whiteRabbitLateAgain)).toBe("play");
    });
  });
});
