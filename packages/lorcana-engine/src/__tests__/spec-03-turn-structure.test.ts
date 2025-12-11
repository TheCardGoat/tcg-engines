/**
 * Spec 3: Turn Structure & Flow Test Suite
 *
 * Tests for turn phases, win conditions, and flow management.
 */

import { describe, expect, it } from "bun:test";
import {
  addLore,
  advanceBeginningStep,
  advancePhase,
  checkLoreVictory,
  createConcession,
  createDeckOutLoss,
  createGameEndState,
  createTurnTrackers,
  endTurn,
  getCurrentPhase,
  getCurrentStep,
  getLore,
  getLoser,
  getWinner,
  hasInkedThisTurn,
  isActivePlayer,
  isGameOver,
  isInBeginningPhase,
  isInMainPhase,
  selectStartingPlayer,
  setHasInked,
  shouldSkipDraw,
} from "../flow/turn-manager";
import {
  BEGINNING_STEPS,
  getNextBeginningStep,
  getNextPhase,
  isBeginningStep,
  isPhase,
  LORE_TO_WIN,
  PHASES,
  STARTING_HAND_SIZE,
} from "../flow/turn-types";
import type { PlayerId } from "../types/game-state";

function createTestPlayer(id: string): PlayerId {
  return id as PlayerId;
}

const player1 = createTestPlayer("player1");
const player2 = createTestPlayer("player2");
const players: [PlayerId, PlayerId] = [player1, player2];

describe("Spec 3: Turn Structure & Flow", () => {
  describe("Constants", () => {
    it("has correct lore win threshold (Rule 3.2.1.1)", () => {
      expect(LORE_TO_WIN).toBe(20);
    });

    it("has correct starting hand size (Rule 3.1.5)", () => {
      expect(STARTING_HAND_SIZE).toBe(7);
    });

    it("has three phases (Rule 4.1)", () => {
      expect(PHASES).toEqual(["beginning", "main", "end"]);
    });

    it("has three beginning steps (Rule 4.2)", () => {
      expect(BEGINNING_STEPS).toEqual(["ready", "set", "draw"]);
    });
  });

  describe("Phase Validation", () => {
    it("validates correct phases", () => {
      expect(isPhase("beginning")).toBe(true);
      expect(isPhase("main")).toBe(true);
      expect(isPhase("end")).toBe(true);
    });

    it("rejects invalid phases", () => {
      expect(isPhase("combat")).toBe(false);
      expect(isPhase("upkeep")).toBe(false);
      expect(isPhase("")).toBe(false);
    });

    it("validates correct beginning steps", () => {
      expect(isBeginningStep("ready")).toBe(true);
      expect(isBeginningStep("set")).toBe(true);
      expect(isBeginningStep("draw")).toBe(true);
    });

    it("rejects invalid beginning steps", () => {
      expect(isBeginningStep("untap")).toBe(false);
      expect(isBeginningStep("")).toBe(false);
    });
  });

  describe("Phase Navigation", () => {
    it("advances from beginning to main phase", () => {
      expect(getNextPhase("beginning")).toBe("main");
    });

    it("advances from main to end phase", () => {
      expect(getNextPhase("main")).toBe("end");
    });

    it("returns null after end phase", () => {
      expect(getNextPhase("end")).toBe(null);
    });

    it("advances through beginning steps correctly", () => {
      expect(getNextBeginningStep("ready")).toBe("set");
      expect(getNextBeginningStep("set")).toBe("draw");
      expect(getNextBeginningStep("draw")).toBe(null);
    });
  });

  describe("Turn Trackers", () => {
    it("creates initial turn trackers correctly", () => {
      const trackers = createTurnTrackers(player1);

      expect(trackers.turnNumber).toBe(1);
      expect(trackers.activePlayerId).toBe(player1);
      expect(trackers.hasInked).toBe(false);
      expect(trackers.isFirstTurn).toBe(true);
      expect(trackers.startingPlayerId).toBe(player1);
      expect(trackers.currentPhase).toBe("beginning");
      expect(trackers.currentStep).toBe("ready");
    });

    it("identifies active player correctly", () => {
      const trackers = createTurnTrackers(player1);

      expect(isActivePlayer(trackers, player1)).toBe(true);
      expect(isActivePlayer(trackers, player2)).toBe(false);
    });

    it("tracks ink status", () => {
      let trackers = createTurnTrackers(player1);
      expect(hasInkedThisTurn(trackers)).toBe(false);

      trackers = setHasInked(trackers);
      expect(hasInkedThisTurn(trackers)).toBe(true);
    });
  });

  describe("Beginning Phase (Rule 4.2)", () => {
    it("starts in ready step", () => {
      const trackers = createTurnTrackers(player1);

      expect(isInBeginningPhase(trackers)).toBe(true);
      expect(getCurrentStep(trackers)).toBe("ready");
    });

    it("advances through all beginning steps", () => {
      let trackers = createTurnTrackers(player1);

      expect(getCurrentStep(trackers)).toBe("ready");

      trackers = advanceBeginningStep(trackers);
      expect(getCurrentStep(trackers)).toBe("set");

      trackers = advanceBeginningStep(trackers);
      expect(getCurrentStep(trackers)).toBe("draw");

      trackers = advanceBeginningStep(trackers);
      expect(getCurrentPhase(trackers)).toBe("main");
      expect(getCurrentStep(trackers)).toBe(undefined);
    });
  });

  describe("Main Phase (Rule 4.3)", () => {
    it("enters main phase after beginning", () => {
      let trackers = createTurnTrackers(player1);

      // Advance through beginning phase
      trackers = advanceBeginningStep(trackers); // ready -> set
      trackers = advanceBeginningStep(trackers); // set -> draw
      trackers = advanceBeginningStep(trackers); // draw -> main

      expect(isInMainPhase(trackers)).toBe(true);
      expect(getCurrentPhase(trackers)).toBe("main");
    });

    it("tracks ink usage per turn", () => {
      let trackers = createTurnTrackers(player1);
      trackers = setHasInked(trackers);

      expect(hasInkedThisTurn(trackers)).toBe(true);
    });
  });

  describe("End Turn", () => {
    it("switches to next player", () => {
      let trackers = createTurnTrackers(player1);
      trackers = endTurn(trackers, players);

      expect(trackers.activePlayerId).toBe(player2);
    });

    it("increments turn number", () => {
      let trackers = createTurnTrackers(player1);
      trackers = endTurn(trackers, players);

      expect(trackers.turnNumber).toBe(2);
    });

    it("resets ink status", () => {
      let trackers = createTurnTrackers(player1);
      trackers = setHasInked(trackers);
      trackers = endTurn(trackers, players);

      expect(hasInkedThisTurn(trackers)).toBe(false);
    });

    it("resets to beginning phase", () => {
      let trackers = createTurnTrackers(player1);
      trackers = advancePhase(trackers); // to main
      trackers = endTurn(trackers, players);

      expect(getCurrentPhase(trackers)).toBe("beginning");
      expect(getCurrentStep(trackers)).toBe("ready");
    });

    it("clears first turn flag", () => {
      let trackers = createTurnTrackers(player1);
      expect(trackers.isFirstTurn).toBe(true);

      trackers = endTurn(trackers, players);
      expect(trackers.isFirstTurn).toBe(false);
    });
  });

  describe("First Turn Draw Skip (Rule 4.2.3.2)", () => {
    it("starting player skips draw on turn 1", () => {
      const trackers = createTurnTrackers(player1);

      expect(shouldSkipDraw(trackers)).toBe(true);
    });

    it("second player does not skip draw on turn 1", () => {
      let trackers = createTurnTrackers(player1);
      trackers = endTurn(trackers, players);

      expect(shouldSkipDraw(trackers)).toBe(false);
    });

    it("starting player does not skip draw on turn 2+", () => {
      let trackers = createTurnTrackers(player1);
      trackers = endTurn(trackers, players); // player2's turn
      trackers = endTurn(trackers, players); // back to player1

      expect(shouldSkipDraw(trackers)).toBe(false);
    });
  });

  describe("Win Conditions (Rule 3.2)", () => {
    it("player wins at exactly 20 lore (Rule 3.2.1.1)", () => {
      const loreScores = { [player1]: 20, [player2]: 15 };
      const result = checkLoreVictory(loreScores);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("LORE_VICTORY");
      expect(result?.playerId).toBe(player1);
    });

    it("player wins at more than 20 lore", () => {
      const loreScores = { [player1]: 25, [player2]: 10 };
      const result = checkLoreVictory(loreScores);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("LORE_VICTORY");
    });

    it("no winner when both under 20", () => {
      const loreScores = { [player1]: 19, [player2]: 15 };
      const result = checkLoreVictory(loreScores);

      expect(result).toBeNull();
    });
  });

  describe("Loss Conditions (Rule 3.2.1.2)", () => {
    it("creates deck out loss", () => {
      const result = createDeckOutLoss(player1);

      expect(result.type).toBe("DECK_OUT");
      expect(result.playerId).toBe(player1);
    });

    it("creates concession", () => {
      const result = createConcession(player1);

      expect(result.type).toBe("CONCEDE");
      expect(result.playerId).toBe(player1);
    });
  });

  describe("Game End State", () => {
    it("creates correct end state for lore victory", () => {
      const reason = {
        type: "LORE_VICTORY" as const,
        playerId: player1,
        lore: 20,
      };
      const endState = createGameEndState(reason, players);

      expect(endState.isOver).toBe(true);
      expect(endState.winner).toBe(player1);
      expect(endState.loser).toBe(player2);
      expect(endState.reason).toEqual(reason);
    });

    it("creates correct end state for deck out", () => {
      const reason = createDeckOutLoss(player1);
      const endState = createGameEndState(reason, players);

      expect(endState.isOver).toBe(true);
      expect(endState.winner).toBe(player2);
      expect(endState.loser).toBe(player1);
    });

    it("creates correct end state for concession", () => {
      const reason = createConcession(player2);
      const endState = createGameEndState(reason, players);

      expect(endState.isOver).toBe(true);
      expect(endState.winner).toBe(player1);
      expect(endState.loser).toBe(player2);
    });

    it("isGameOver returns correct values", () => {
      expect(isGameOver(undefined)).toBe(false);
      expect(isGameOver({ isOver: false })).toBe(false);
      expect(
        isGameOver({ isOver: true, winner: player1, loser: player2 }),
      ).toBe(true);
    });

    it("getWinner and getLoser work correctly", () => {
      const endState = { isOver: true, winner: player1, loser: player2 };

      expect(getWinner(endState)).toBe(player1);
      expect(getLoser(endState)).toBe(player2);
      expect(getWinner(undefined)).toBe(undefined);
    });
  });

  describe("Lore Management", () => {
    it("adds lore correctly", () => {
      let loreScores = { [player1]: 0, [player2]: 0 };
      loreScores = addLore(loreScores, player1, 5);

      expect(getLore(loreScores, player1)).toBe(5);
      expect(getLore(loreScores, player2)).toBe(0);
    });

    it("accumulates lore", () => {
      let loreScores = { [player1]: 10, [player2]: 5 };
      loreScores = addLore(loreScores, player1, 3);

      expect(getLore(loreScores, player1)).toBe(13);
    });

    it("returns 0 for missing player", () => {
      const loreScores = {};
      expect(getLore(loreScores, player1)).toBe(0);
    });
  });

  describe("Starting Player Selection (Rule 3.1.2)", () => {
    it("selects player1 when random < 0.5", () => {
      const selected = selectStartingPlayer(players, 0.3);
      expect(selected).toBe(player1);
    });

    it("selects player2 when random >= 0.5", () => {
      const selected = selectStartingPlayer(players, 0.7);
      expect(selected).toBe(player2);
    });

    it("handles edge case at 0.5", () => {
      const selected = selectStartingPlayer(players, 0.5);
      expect(selected).toBe(player2);
    });
  });
});
