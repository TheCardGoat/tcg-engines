import { afterEach, beforeEach, describe, expect, it } from "bun:test";
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
      { skipPreGame: false }
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
    expect(ctx.pendingMulligan?.map(p => String(p))).toContain(PLAYER_ONE);
    expect(ctx.pendingMulligan?.map(p => String(p))).toContain(PLAYER_TWO);

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
    expect(ctx.pendingMulligan?.map(p => String(p))).toContain(PLAYER_ONE);
    expect(ctx.pendingMulligan?.map(p => String(p))).toContain(PLAYER_TWO);

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
});

