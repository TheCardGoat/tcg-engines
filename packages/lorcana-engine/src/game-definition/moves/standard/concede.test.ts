import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createPlayerId } from "@tcg/core";
import { LorcanaTestEngine, PLAYER_ONE, PLAYER_TWO } from "../../../testing/lorcana-test-engine";

describe("Move: Concede", () => {
  let testEngine: LorcanaTestEngine;

  beforeEach(() => {
    testEngine = new LorcanaTestEngine(
      { deck: 10, hand: 7 },
      { deck: 10, hand: 7 },
      { skipPreGame: true },
    );
  });

  afterEach(() => {
    testEngine.dispose();
  });

  // ========== Basic Behavior Tests ==========

  describe("Basic Concede Behavior", () => {
    it("should end game when player concedes", () => {
      // Player one concedes
      testEngine.changeActivePlayer(PLAYER_ONE);
      const result = testEngine.engine.executeMove("concede", {
        params: {},
        playerId: createPlayerId(PLAYER_ONE),
      });

      expect(result.success).toBe(true);

      // Game should be ended
      expect(testEngine.engine.hasGameEnded()).toBe(true);

      // Verify game end result
      const gameEndResult = testEngine.engine.getGameEndResult();
      expect(gameEndResult).toBeDefined();
      expect(gameEndResult?.reason).toBe("concede");
    });

    it("should include concede metadata with concedeBy field", () => {
      // Player two concedes
      testEngine.changeActivePlayer(PLAYER_TWO);
      const result = testEngine.engine.executeMove("concede", {
        params: {},
        playerId: createPlayerId(PLAYER_TWO),
      });

      expect(result.success).toBe(true);

      // Verify metadata includes concedeBy
      const gameEndResult = testEngine.engine.getGameEndResult();
      expect(gameEndResult).toBeDefined();
      expect(gameEndResult?.metadata?.concedeBy).toBe(PLAYER_TWO);
    });

    it("should set opponent as winner when player concedes", () => {
      // Player one concedes
      testEngine.changeActivePlayer(PLAYER_ONE);
      const result = testEngine.engine.executeMove("concede", {
        params: {},
        playerId: createPlayerId(PLAYER_ONE),
      });

      expect(result.success).toBe(true);

      // Winner should be player two (the opponent)
      const gameEndResult = testEngine.engine.getGameEndResult();
      expect(gameEndResult).toBeDefined();
      expect(gameEndResult?.winner).toBe(PLAYER_TWO);
    });

    it("should set correct winner when different player concedes", () => {
      // Player two concedes
      testEngine.changeActivePlayer(PLAYER_TWO);
      const result = testEngine.engine.executeMove("concede", {
        params: {},
        playerId: createPlayerId(PLAYER_TWO),
      });

      expect(result.success).toBe(true);

      // Winner should be player one (the opponent)
      const gameEndResult = testEngine.engine.getGameEndResult();
      expect(gameEndResult).toBeDefined();
      expect(gameEndResult?.winner).toBe(PLAYER_ONE);
    });
  });

  // ========== Game End Verification ==========

  describe("Game End State", () => {
    it("should prevent further moves after concede", () => {
      // Player one concedes
      testEngine.changeActivePlayer(PLAYER_ONE);
      const concedeResult = testEngine.engine.executeMove("concede", {
        params: {},
        playerId: createPlayerId(PLAYER_ONE),
      });

      // Verify concede succeeded
      expect(concedeResult.success).toBe(true);
      expect(testEngine.engine.hasGameEnded()).toBe(true);

      // Try to execute another move
      testEngine.changeActivePlayer(PLAYER_TWO);
      const result = testEngine.engine.executeMove("passTurn", {
        params: {},
        playerId: createPlayerId(PLAYER_TWO),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("GAME_ENDED");
        expect(result.error).toContain("already ended");
      }
    });

    it("should allow concede at any time (during any phase)", () => {
      // Concede during main phase (default)
      testEngine.changeActivePlayer(PLAYER_ONE);
      const result = testEngine.engine.executeMove("concede", {
        params: {},
        playerId: createPlayerId(PLAYER_ONE),
      });

      expect(result.success).toBe(true);
    });
  });

  // ========== Edge Cases ==========

  describe("Edge Cases", () => {
    it("should not allow concede when game already ended", () => {
      // First player concedes
      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.engine.executeMove("concede", {
        params: {},
        playerId: createPlayerId(PLAYER_ONE),
      });

      // Try to concede again
      testEngine.changeActivePlayer(PLAYER_TWO);
      const result = testEngine.engine.executeMove("concede", {
        params: {},
        playerId: createPlayerId(PLAYER_TWO),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("GAME_ENDED");
      }
    });

    it("should handle concede when player has no cards", () => {
      // Setup: Create a game where player one has no cards in any zone
      const emptyTestEngine = new LorcanaTestEngine(
        { deck: 0, hand: 0 }, // Player one has no cards
        { deck: 10, hand: 7 }, // Player two has cards
        { skipPreGame: true },
      );

      // Player one (with no cards) concedes
      emptyTestEngine.changeActivePlayer(PLAYER_ONE);
      const result = emptyTestEngine.engine.executeMove("concede", {
        params: {},
        playerId: createPlayerId(PLAYER_ONE),
      });

      expect(result.success).toBe(true);

      // Game should be ended
      expect(emptyTestEngine.engine.hasGameEnded()).toBe(true);

      // Winner should be player two (even though player one had no cards)
      const gameEndResult = emptyTestEngine.engine.getGameEndResult();
      expect(gameEndResult).toBeDefined();
      expect(gameEndResult?.winner).toBe(PLAYER_TWO);
      expect(gameEndResult?.reason).toBe("concede");

      emptyTestEngine.dispose();
    });
  });
});
