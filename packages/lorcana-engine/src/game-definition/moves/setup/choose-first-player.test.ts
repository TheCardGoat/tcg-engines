import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createPlayerId } from "@tcg/core";
import {
  LorcanaTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/lorcana-test-engine";

describe("Move: Choose First Player", () => {
  let testEngine: LorcanaTestEngine;

  beforeEach(() => {
    testEngine = new LorcanaTestEngine(
      { hand: 7, deck: 10 },
      { hand: 7, deck: 10 },
      { skipPreGame: false },
    );

    expect(testEngine.getGameSegment()).toBe("startingAGame");
    expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");
  });

  afterEach(() => {
    testEngine.dispose();
  });

  it("Choosing player_one as first player", () => {
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);
    const ctx = testEngine.getCtx();

    // Verify OTP is set
    expect(ctx.otp).toBe(PLAYER_ONE);

    // Verify pending mulligan is set for both players
    expect(ctx.pendingMulligan?.length).toBe(2);
    expect(ctx.pendingMulligan?.map((p) => String(p))).toContain(PLAYER_ONE);
    expect(ctx.pendingMulligan?.map((p) => String(p))).toContain(PLAYER_TWO);

    // Verify phase transition occurred
    expect(testEngine.getGamePhase()).toBe("mulligan");
  });

  it("Choosing player_two as first player", () => {
    testEngine.changeActivePlayer(PLAYER_ONE);
    testEngine.chooseWhoGoesFirst(PLAYER_TWO);
    const ctx = testEngine.getCtx();

    // Verify OTP is set
    expect(ctx.otp).toBe(PLAYER_TWO);

    // Verify pending mulligan is set for both players
    expect(ctx.pendingMulligan?.length).toBe(2);
    expect(ctx.pendingMulligan?.map((p) => String(p))).toContain(PLAYER_ONE);
    expect(ctx.pendingMulligan?.map((p) => String(p))).toContain(PLAYER_TWO);

    // Verify phase transition occurred
    expect(testEngine.getGamePhase()).toBe("mulligan");
  });

  it("Allows any player to choose first player (no priority check in this phase)", () => {
    // In the startingAGame/chooseFirstPlayer phase, either player can make the choice
    // This is similar to how rock-paper-scissors works in real games

    // Player_one makes the choice
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);
    const ctx = testEngine.getCtx();

    // Verify the choice was recorded
    expect(ctx.otp).toBe(PLAYER_ONE);
    expect(testEngine.getGamePhase()).toBe("mulligan");
  });

  // ========== Invalid Move Tests ==========

  it("should reject invalid player ID", () => {
    // Attempt to choose an invalid player ID
    const result = testEngine.engine.executeMove("chooseWhoGoesFirstMove", {
      playerId: createPlayerId(PLAYER_ONE),
      params: { playerId: createPlayerId("invalid_player_id") },
    });

    // Should fail with detailed error information
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("INVALID_PLAYER_ID");
      expect(result.error).toContain("Invalid player ID");
      expect(result.error).toContain("invalid_player_id");
      expect(result.errorContext?.playerId).toBe("invalid_player_id");
      expect(result.errorContext?.validPlayers).toEqual([
        PLAYER_ONE,
        PLAYER_TWO,
      ]);
    }

    // Verify OTP was not set
    const ctx = testEngine.getCtx();
    expect(ctx.otp).toBeUndefined();
    expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");
  });

  it("should reject choosing first player twice", () => {
    // Choose first player successfully
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);
    const ctxAfterFirst = testEngine.getCtx();
    expect(ctxAfterFirst.otp).toBe(PLAYER_ONE);
    expect(testEngine.getGamePhase()).toBe("mulligan");

    // Try to choose again - should fail
    // Note: We need to be in chooseFirstPlayer phase, but we already transitioned to mulligan
    // So this test verifies that once OTP is set, it can't be changed
    // We'll need to manually set phase back for this specific test scenario

    // For now, let's test by creating a new engine and trying to choose twice before phase transition
    const testEngine2 = new LorcanaTestEngine(
      { hand: 7, deck: 10 },
      { hand: 7, deck: 10 },
      { skipPreGame: false },
    );

    // Manually set OTP without going through the move (simulating the state after first choice)
    // We'll execute the move directly on the engine to check the condition
    const result = testEngine2.engine.executeMove("chooseWhoGoesFirstMove", {
      playerId: createPlayerId(PLAYER_ONE),
      params: { playerId: createPlayerId(PLAYER_ONE) },
    });
    expect(result.success).toBe(true);

    // Now try to choose again - should fail because phase has changed to mulligan
    // Note: The move transitions to mulligan phase after successful execution,
    // so the wrong phase error takes precedence over OTP already being set
    const result2 = testEngine2.engine.executeMove("chooseWhoGoesFirstMove", {
      playerId: createPlayerId(PLAYER_ONE),
      params: { playerId: createPlayerId(PLAYER_TWO) },
    });

    expect(result2.success).toBe(false);
    if (!result2.success) {
      expect(result2.errorCode).toBe("WRONG_PHASE");
      expect(result2.error).toContain(
        "Cannot choose first player during mulligan phase",
      );
      expect(result2.errorContext?.currentPhase).toBe("mulligan");
    }

    testEngine2.dispose();
  });

  it("should reject choosing first player during wrong phase", () => {
    // Choose first player successfully - this transitions to mulligan phase
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);
    expect(testEngine.getGamePhase()).toBe("mulligan");

    // Try to choose first player again while in mulligan phase
    const result = testEngine.engine.executeMove("chooseWhoGoesFirstMove", {
      playerId: createPlayerId(PLAYER_ONE),
      params: { playerId: createPlayerId(PLAYER_TWO) },
    });

    // Should fail with detailed error about wrong phase
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("WRONG_PHASE");
      expect(result.error).toContain(
        "Cannot choose first player during mulligan phase",
      );
      expect(result.error).toContain("Must be in chooseFirstPlayer phase");
      expect(result.errorContext?.currentPhase).toBe("mulligan");
      expect(result.errorContext?.requiredPhase).toBe("chooseFirstPlayer");
    }

    // Verify OTP hasn't changed
    const ctx = testEngine.getCtx();
    expect(ctx.otp).toBe(PLAYER_ONE); // Still player_one, not player_two
  });
});
