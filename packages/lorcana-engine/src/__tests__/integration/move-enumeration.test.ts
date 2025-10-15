import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  LorcanaTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../testing/lorcana-test-engine";

describe("Move Enumeration Integration", () => {
  describe("Phase Transition Integration", () => {
    let testEngine: LorcanaTestEngine;

    beforeEach(() => {
      testEngine = new LorcanaTestEngine(
        { hand: 7, deck: 10 },
        { hand: 7, deck: 10 },
        { skipPreGame: false },
      );
    });

    afterEach(() => {
      testEngine.dispose();
    });

    it.todo(
      "should enumerate moves correctly across setup → mulligan → main phase",
      () => {
        // Phase 1: Choose First Player
        expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");

        const choosingPlayer = testEngine.getCtx().choosingFirstPlayer;
        let availableMoves = testEngine.getAvailableMoves(
          choosingPlayer || PLAYER_ONE,
        );

        // Should have chooseWhoGoesFirstMove available
        expect(availableMoves).toContain("chooseWhoGoesFirstMove");

        // Execute choice
        testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
        testEngine.chooseWhoGoesFirst(PLAYER_ONE);

        // Phase 2: Mulligan
        expect(testEngine.getGamePhase()).toBe("mulligan");

        // Both players should have alterHand available
        availableMoves = testEngine.getAvailableMoves(PLAYER_ONE);
        expect(availableMoves).toContain("alterHand");

        availableMoves = testEngine.getAvailableMoves(PLAYER_TWO);
        expect(availableMoves).toContain("alterHand");

        // Execute mulligans
        testEngine.changeActivePlayer(PLAYER_ONE);
        testEngine.alterHand([]);

        testEngine.changeActivePlayer(PLAYER_TWO);
        testEngine.alterHand([]);

        // Phase 3: Main Phase (or next phase in flow)
        // After mulligan, game should transition to next phase
        const finalPhase = testEngine.getGamePhase();
        expect(finalPhase).not.toBe("mulligan");
        expect(finalPhase).not.toBe("chooseFirstPlayer");
      },
    );

    it("should show different available moves for different players", () => {
      const choosingPlayer = testEngine.getCtx().choosingFirstPlayer;
      const otherPlayer =
        choosingPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;

      // Choosing player should see chooseWhoGoesFirstMove
      const chooserMoves = testEngine.getAvailableMoves(
        choosingPlayer || PLAYER_ONE,
      );
      expect(chooserMoves).toContain("chooseWhoGoesFirstMove");

      // Other player should see no moves
      const otherMoves = testEngine.getAvailableMoves(otherPlayer);
      expect(otherMoves).toEqual([]);
    });

    it("should enumerate moves correctly after OTP transitions", () => {
      const choosingPlayer = testEngine.getCtx().choosingFirstPlayer;

      // Before choosing - only chooser has moves
      const chooserMoves = testEngine.getAvailableMoves(
        choosingPlayer || PLAYER_ONE,
      );
      expect(chooserMoves.length).toBeGreaterThan(0);

      // Choose first player
      testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
      testEngine.chooseWhoGoesFirst(PLAYER_ONE);

      // After choosing - both players should have mulligan move
      const p1Moves = testEngine.getAvailableMoves(PLAYER_ONE);
      const p2Moves = testEngine.getAvailableMoves(PLAYER_TWO);

      expect(p1Moves).toContain("alterHand");
      expect(p2Moves).toContain("alterHand");
    });
  });

  describe("Multiple Players", () => {
    let testEngine: LorcanaTestEngine;

    beforeEach(() => {
      testEngine = new LorcanaTestEngine(
        { hand: 7, deck: 10 },
        { hand: 7, deck: 10 },
        { skipPreGame: false },
      );
    });

    afterEach(() => {
      testEngine.dispose();
    });

    it("should enumerate different moves for each player simultaneously", () => {
      const choosingPlayer = testEngine.getCtx().choosingFirstPlayer;
      const otherPlayer =
        choosingPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;

      // Get moves for both players at the same time
      const chooserMoves = testEngine.getAvailableMoves(
        choosingPlayer || PLAYER_ONE,
      );
      const otherPlayerMoves = testEngine.getAvailableMoves(otherPlayer);

      // Chooser has moves, other doesn't
      expect(chooserMoves.length).toBeGreaterThan(0);
      expect(otherPlayerMoves.length).toBe(0);

      // Results should be independent
      expect(chooserMoves).toContain("chooseWhoGoesFirstMove");
      expect(otherPlayerMoves).not.toContain("chooseWhoGoesFirstMove");
    });

    it("should handle rapid enumeration calls without errors", () => {
      const choosingPlayer = testEngine.getCtx().choosingFirstPlayer;

      // Call enumeration multiple times rapidly
      for (let i = 0; i < 10; i++) {
        const moves = testEngine.getAvailableMoves(
          choosingPlayer || PLAYER_ONE,
        );
        expect(moves).toContain("chooseWhoGoesFirstMove");
      }

      // State should remain consistent
      expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");
    });
  });

  describe("Edge Cases", () => {
    let testEngine: LorcanaTestEngine;

    beforeEach(() => {
      testEngine = new LorcanaTestEngine(
        { hand: 7, deck: 10 },
        { hand: 7, deck: 10 },
        { skipPreGame: false },
      );
    });

    afterEach(() => {
      testEngine.dispose();
    });

    it("should handle enumeration for player with no available moves", () => {
      const choosingPlayer = testEngine.getCtx().choosingFirstPlayer;
      const otherPlayer =
        choosingPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;

      // Other player has no moves during chooseFirstPlayer phase
      const moves = testEngine.getAvailableMoves(otherPlayer);

      expect(moves).toEqual([]);
      expect(Array.isArray(moves)).toBe(true);
    });

    it("should handle enumeration after move is no longer available", () => {
      const choosingPlayer = testEngine.getCtx().choosingFirstPlayer;

      // Before executing move
      let moves = testEngine.getAvailableMoves(choosingPlayer || PLAYER_ONE);
      expect(moves).toContain("chooseWhoGoesFirstMove");

      // Execute move
      testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
      testEngine.chooseWhoGoesFirst(PLAYER_ONE);

      // After executing move - should no longer be available
      moves = testEngine.getAvailableMoves(choosingPlayer || PLAYER_ONE);
      expect(moves).not.toContain("chooseWhoGoesFirstMove");
    });

    it("should return consistent results for same state", () => {
      const choosingPlayer = testEngine.getCtx().choosingFirstPlayer;

      // Call multiple times without changing state
      const moves1 = testEngine.getAvailableMoves(choosingPlayer || PLAYER_ONE);
      const moves2 = testEngine.getAvailableMoves(choosingPlayer || PLAYER_ONE);
      const moves3 = testEngine.getAvailableMoves(choosingPlayer || PLAYER_ONE);

      // All results should be identical
      expect(moves1).toEqual(moves2);
      expect(moves2).toEqual(moves3);
    });

    it("should handle invalid player ID gracefully", () => {
      // Try to get moves for a non-existent player
      const moves = testEngine.getAvailableMoves("invalid_player_id");

      // Should return empty array (no moves available)
      expect(Array.isArray(moves)).toBe(true);
      expect(moves).toEqual([]);
    });
  });

  describe("Performance", () => {
    let testEngine: LorcanaTestEngine;

    beforeEach(() => {
      testEngine = new LorcanaTestEngine(
        { hand: 7, deck: 10 },
        { hand: 7, deck: 10 },
        { skipPreGame: false },
      );
    });

    afterEach(() => {
      testEngine.dispose();
    });

    it("should enumerate moves quickly (<100ms for typical state)", () => {
      const choosingPlayer = testEngine.getCtx().choosingFirstPlayer;

      const startTime = performance.now();

      // Enumerate moves 100 times
      for (let i = 0; i < 100; i++) {
        testEngine.getAvailableMoves(choosingPlayer || PLAYER_ONE);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / 100;

      // Average time per enumeration should be well under 100ms
      expect(avgTime).toBeLessThan(100);

      // Log for visibility (not an assertion)
      console.log(`Average enumeration time: ${avgTime.toFixed(2)}ms`);
    });
  });
});
