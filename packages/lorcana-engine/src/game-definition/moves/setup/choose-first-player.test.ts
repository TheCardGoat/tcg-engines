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
    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;

    // Execute the move as the designated choosing player
    testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);
    const updatedCtx = testEngine.getCtx();

    // Verify OTP is set
    expect(updatedCtx.otp).toBe(PLAYER_ONE);

    // Verify pending mulligan is set for both players
    expect(updatedCtx.pendingMulligan?.length).toBe(2);
    expect(updatedCtx.pendingMulligan?.map((p) => String(p))).toContain(
      PLAYER_ONE,
    );
    expect(updatedCtx.pendingMulligan?.map((p) => String(p))).toContain(
      PLAYER_TWO,
    );

    // Verify phase transition occurred
    expect(testEngine.getGamePhase()).toBe("mulligan");
  });

  it("Choosing player_two as first player", () => {
    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;

    // Execute the move as the designated choosing player
    testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
    testEngine.chooseWhoGoesFirst(PLAYER_TWO);
    const updatedCtx = testEngine.getCtx();

    // Verify OTP is set
    expect(updatedCtx.otp).toBe(PLAYER_TWO);

    // Verify pending mulligan is set for both players
    expect(updatedCtx.pendingMulligan?.length).toBe(2);
    expect(updatedCtx.pendingMulligan?.map((p) => String(p))).toContain(
      PLAYER_ONE,
    );
    expect(updatedCtx.pendingMulligan?.map((p) => String(p))).toContain(
      PLAYER_TWO,
    );

    // Verify phase transition occurred
    expect(testEngine.getGamePhase()).toBe("mulligan");
  });

  it("Only the designated player can choose first player", () => {
    // Rule 3.1.2: First, use a method for randomly determining WHO CHOOSES who is the starting player
    // One player is randomly designated to make the choice (like winning a coin flip)

    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;

    // Verify that a choosing player was randomly designated
    expect(choosingPlayer).toBeDefined();
    expect([PLAYER_ONE, PLAYER_TWO]).toContain(choosingPlayer);

    // The designated player should be able to choose
    if (choosingPlayer === PLAYER_ONE) {
      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.chooseWhoGoesFirst(PLAYER_TWO); // Can choose either player
      expect(testEngine.getCtx().otp).toBe(PLAYER_TWO);
    } else {
      testEngine.changeActivePlayer(PLAYER_TWO);
      testEngine.chooseWhoGoesFirst(PLAYER_ONE); // Can choose either player
      expect(testEngine.getCtx().otp).toBe(PLAYER_ONE);
    }

    expect(testEngine.getGamePhase()).toBe("mulligan");
  });

  it("Non-designated player cannot choose first player", () => {
    // Check who is the designated chooser
    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;
    const otherPlayer = choosingPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;

    // Try to have the OTHER player choose - should fail
    testEngine.changeActivePlayer(otherPlayer);
    const result = testEngine.engine.executeMove("chooseWhoGoesFirstMove", {
      playerId: createPlayerId(otherPlayer),
      params: { playerId: createPlayerId(PLAYER_ONE) },
    });

    // Should fail with detailed error information
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("NOT_CHOOSING_PLAYER");
      expect(result.error).toContain("can choose the first player");
      expect(result.error).toContain(String(choosingPlayer));
      expect(result.error).toContain(String(otherPlayer));
      expect(result.errorContext?.choosingPlayer).toBe(choosingPlayer);
      expect(result.errorContext?.executingPlayer).toBe(otherPlayer);
    }

    // Verify OTP was not set
    expect(testEngine.getCtx().otp).toBeUndefined();
    expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");
  });

  // ========== Turn Player and Priority Tests ==========

  it("should have no turn player but priority during chooseFirstPlayer phase", () => {
    // Before choosing, turn player should be undefined
    expect(testEngine.getTurnPlayer()).toBeUndefined();

    // But priority should be the choosingFirstPlayer
    const ctx = testEngine.getCtx();
    expect(testEngine.getPriorityPlayers()).toContain(ctx.choosingFirstPlayer);
  });

  it("should set turn player after OTP is chosen", () => {
    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;

    testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);

    // After choosing, turn player should be set to OTP
    expect(testEngine.getTurnPlayer()).toBe(PLAYER_ONE);

    // And priority should also be OTP (for mulligan)
    expect(testEngine.getPriorityPlayers()).toContain(PLAYER_ONE);
  });

  it("should switch priority after each player mulligans", () => {
    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;

    testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);

    // OTP has priority first
    expect(testEngine.getPriorityPlayers()).toContain(PLAYER_ONE);

    testEngine.changeActivePlayer(PLAYER_ONE);
    testEngine.alterHand([]);

    // After OTP mulligans, priority switches to other player
    expect(testEngine.getPriorityPlayers()).toContain(PLAYER_TWO);
    expect(testEngine.getPriorityPlayers()).not.toContain(PLAYER_ONE);
  });

  // ========== Invalid Move Tests ==========

  it("should reject invalid player ID", () => {
    // Get the designated chooser so we can execute as them
    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;

    // Attempt to choose an invalid player ID as the designated chooser
    const result = testEngine.engine.executeMove("chooseWhoGoesFirstMove", {
      playerId: createPlayerId(choosingPlayer || PLAYER_ONE),
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
    const updatedCtx = testEngine.getCtx();
    expect(updatedCtx.otp).toBeUndefined();
    expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");
  });

  it("should reject choosing first player twice", () => {
    // Get the designated chooser
    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;

    // Choose first player successfully as the designated chooser
    testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
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

    // Get the designated chooser for the new engine
    const ctx2 = testEngine2.getCtx();
    const choosingPlayer2 = ctx2.choosingFirstPlayer;

    // Execute the move as the designated chooser
    const result = testEngine2.engine.executeMove("chooseWhoGoesFirstMove", {
      playerId: createPlayerId(choosingPlayer2 || PLAYER_ONE),
      params: { playerId: createPlayerId(PLAYER_ONE) },
    });
    expect(result.success).toBe(true);

    // Now try to choose again - should fail because phase has changed to mulligan
    // Note: The move transitions to mulligan phase after successful execution,
    // so the wrong phase error takes precedence over OTP already being set
    const result2 = testEngine2.engine.executeMove("chooseWhoGoesFirstMove", {
      playerId: createPlayerId(choosingPlayer2 || PLAYER_ONE),
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
    // Get the designated chooser
    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;

    // Choose first player successfully - this transitions to mulligan phase
    testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);
    expect(testEngine.getGamePhase()).toBe("mulligan");

    // Try to choose first player again while in mulligan phase
    const result = testEngine.engine.executeMove("chooseWhoGoesFirstMove", {
      playerId: createPlayerId(choosingPlayer || PLAYER_ONE),
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
    const updatedCtx = testEngine.getCtx();
    expect(updatedCtx.otp).toBe(PLAYER_ONE); // Still player_one, not player_two
  });
});
