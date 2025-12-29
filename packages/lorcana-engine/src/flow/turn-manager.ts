/**
 * Turn Manager
 *
 * Functions for managing turn flow in Lorcana.
 */

import type { PlayerId } from "../types/game-state";
import {
  type BeginningStep,
  type GameEndReason,
  type GameEndState,
  getNextBeginningStep,
  getNextPhase,
  LORE_TO_WIN,
  type Phase,
  type TurnTrackers,
} from "./turn-types";

/**
 * Create initial turn trackers
 */
export function createTurnTrackers(startingPlayerId: PlayerId): TurnTrackers {
  return {
    turnNumber: 1,
    activePlayerId: startingPlayerId,
    hasInked: false,
    isFirstTurn: true,
    startingPlayerId,
    currentPhase: "beginning",
    currentStep: "ready",
  };
}

/**
 * Check if it's the active player's turn
 */
export function isActivePlayer(
  trackers: TurnTrackers,
  playerId: PlayerId,
): boolean {
  return trackers.activePlayerId === playerId;
}

/**
 * Get the current phase
 */
export function getCurrentPhase(trackers: TurnTrackers): Phase {
  return trackers.currentPhase;
}

/**
 * Get the current step (only meaningful in beginning phase)
 */
export function getCurrentStep(
  trackers: TurnTrackers,
): BeginningStep | undefined {
  return trackers.currentStep;
}

/**
 * Check if we're in the main phase
 */
export function isInMainPhase(trackers: TurnTrackers): boolean {
  return trackers.currentPhase === "main";
}

/**
 * Check if we're in the beginning phase
 */
export function isInBeginningPhase(trackers: TurnTrackers): boolean {
  return trackers.currentPhase === "beginning";
}

/**
 * Check if the active player has inked this turn
 */
export function hasInkedThisTurn(trackers: TurnTrackers): boolean {
  return trackers.hasInked;
}

/**
 * Mark that the active player has inked this turn
 */
export function setHasInked(trackers: TurnTrackers): TurnTrackers {
  if (trackers.hasInked) {
    console.warn("Player has already inked this turn");
  }
  return { ...trackers, hasInked: true };
}

/**
 * Advance to the next step in the beginning phase
 * Returns null if we should move to main phase
 */
export function advanceBeginningStep(trackers: TurnTrackers): TurnTrackers {
  if (trackers.currentPhase !== "beginning" || !trackers.currentStep) {
    return trackers;
  }

  const nextStep = getNextBeginningStep(trackers.currentStep);

  if (nextStep === null) {
    // Move to main phase
    return {
      ...trackers,
      currentPhase: "main",
      currentStep: undefined,
    };
  }

  return {
    ...trackers,
    currentStep: nextStep,
  };
}

/**
 * Advance to the next phase
 */
export function advancePhase(trackers: TurnTrackers): TurnTrackers {
  const nextPhase = getNextPhase(trackers.currentPhase);

  if (nextPhase === null) {
    // End phase - would need to end turn
    return trackers;
  }

  return {
    ...trackers,
    currentPhase: nextPhase,
    currentStep: nextPhase === "beginning" ? "ready" : undefined,
  };
}

/**
 * End the current turn and start the next player's turn
 */
export function endTurn(
  trackers: TurnTrackers,
  players: [PlayerId, PlayerId],
): TurnTrackers {
  const currentIndex = players.indexOf(trackers.activePlayerId);
  const nextIndex = (currentIndex + 1) % 2;
  const nextPlayer = players[nextIndex];

  return {
    ...trackers,
    turnNumber: trackers.turnNumber + 1,
    activePlayerId: nextPlayer,
    hasInked: false,
    isFirstTurn: false,
    currentPhase: "beginning",
    currentStep: "ready",
  };
}

/**
 * Check if the starting player should skip draw on turn 1 (Rule 4.2.3.2)
 */
export function shouldSkipDraw(trackers: TurnTrackers): boolean {
  return trackers.isFirstTurn;
}

/**
 * Check win condition: 20+ lore (Rule 3.2.1.1)
 */
export function checkLoreVictory(
  loreScores: Record<PlayerId, number>,
): GameEndReason | null {
  for (const [playerId, lore] of Object.entries(loreScores)) {
    if (lore >= LORE_TO_WIN) {
      return {
        type: "LORE_VICTORY",
        playerId: playerId as PlayerId,
        lore,
      };
    }
  }
  return null;
}

/**
 * Create deck out loss reason (Rule 3.2.1.2)
 */
export function createDeckOutLoss(playerId: PlayerId): GameEndReason {
  return {
    type: "DECK_OUT",
    playerId,
  };
}

/**
 * Create concession reason
 */
export function createConcession(playerId: PlayerId): GameEndReason {
  return {
    type: "CONCEDE",
    playerId,
  };
}

/**
 * Create game end state from a reason
 */
export function createGameEndState(
  reason: GameEndReason,
  players: [PlayerId, PlayerId],
): GameEndState {
  let winner: PlayerId | undefined;
  let loser: PlayerId | undefined;

  switch (reason.type) {
    case "LORE_VICTORY":
      winner = reason.playerId;
      loser = players.find((p) => p !== winner);
      if (loser === undefined) {
        throw new Error("Could not determine loser from players array");
      }
      break;
    case "DECK_OUT":
      loser = reason.playerId;
      winner = players.find((p) => p !== loser);
      if (winner === undefined) {
        throw new Error("Could not determine winner from players array");
      }
      break;
    case "CONCEDE":
      loser = reason.playerId;
      winner = players.find((p) => p !== loser);
      if (winner === undefined) {
        throw new Error("Could not determine winner from players array");
      }
      break;
  }

  return {
    isOver: true,
    winner,
    loser,
    reason,
  };
}

/**
 * Check if game is over
 */
export function isGameOver(endState: GameEndState | undefined): boolean {
  return endState?.isOver ?? false;
}

/**
 * Get the winner of a finished game
 */
export function getWinner(
  endState: GameEndState | undefined,
): PlayerId | undefined {
  return endState?.winner;
}

/**
 * Get the loser of a finished game
 */
export function getLoser(
  endState: GameEndState | undefined,
): PlayerId | undefined {
  return endState?.loser;
}

/**
 * Add lore to a player's score
 */
export function addLore(
  loreScores: Record<PlayerId, number>,
  playerId: PlayerId,
  amount: number,
): Record<PlayerId, number> {
  const currentLore = loreScores[playerId] ?? 0;
  return {
    ...loreScores,
    [playerId]: currentLore + amount,
  };
}

/**
 * Get a player's current lore
 */
export function getLore(
  loreScores: Record<PlayerId, number>,
  playerId: PlayerId,
): number {
  return loreScores[playerId] ?? 0;
}

/**
 * Randomly select the starting player (Rule 3.1.2)
 */
export function selectStartingPlayer(
  players: [PlayerId, PlayerId],
  randomValue?: number,
): PlayerId {
  const random = randomValue ?? Math.random();
  if (random < 0 || random >= 1) {
    throw new Error("Random value must be in range [0, 1)");
  }
  return random < 0.5 ? players[0] : players[1];
}
