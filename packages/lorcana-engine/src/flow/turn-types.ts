/**
 * Turn Structure Types (Section 4)
 *
 * Lorcana turn structure:
 * - Beginning Phase: Ready, Set, Draw steps
 * - Main Phase: Player actions
 * - End Phase: Cleanup
 */

import type { CardId, PlayerId } from "../types/game-state";

/** Turn phases (Rule 4.1) */
export const PHASES = ["beginning", "main", "end"] as const;
export type Phase = (typeof PHASES)[number];

/** Beginning phase steps (Rule 4.2) */
export const BEGINNING_STEPS = ["ready", "set", "draw"] as const;
export type BeginningStep = (typeof BEGINNING_STEPS)[number];

/**
 * Mulligan decision (Rule 3.1.6)
 */
export interface MulliganDecision {
  playerId: PlayerId;
  /** Cards to put on bottom of deck (not revealed) */
  cardsToBottom: CardId[];
}

/**
 * Mulligan state tracking
 */
export interface MulliganState {
  phase: "waiting_first_player" | "waiting_second_player" | "complete";
  firstPlayerDecision?: MulliganDecision;
  secondPlayerDecision?: MulliganDecision;
}

/**
 * Turn trackers for game state
 */
export interface TurnTrackers {
  /** Current turn number (starts at 1) */
  turnNumber: number;
  /** Currently active player */
  activePlayerId: PlayerId;
  /** Has the active player inked this turn? (once per turn limit) */
  hasInked: boolean;
  /** Is this the first turn of the game? */
  isFirstTurn: boolean;
  /** Who started the game (for first turn draw skip) */
  startingPlayerId: PlayerId;
  /** Current phase */
  currentPhase: Phase;
  /** Current step within beginning phase */
  currentStep?: BeginningStep;
}

/**
 * Game end reason types (Rule 3.2)
 */
export type GameEndReason = LoreVictory | DeckOut | Concession;

export interface LoreVictory {
  type: "LORE_VICTORY";
  playerId: PlayerId;
  lore: number;
}

export interface DeckOut {
  type: "DECK_OUT";
  playerId: PlayerId;
}

export interface Concession {
  type: "CONCEDE";
  playerId: PlayerId;
}

/**
 * Game end state
 */
export interface GameEndState {
  isOver: boolean;
  winner?: PlayerId;
  loser?: PlayerId;
  reason?: GameEndReason;
}

/**
 * Game configuration for setup
 */
export interface GameConfig {
  player1Id: PlayerId;
  player2Id: PlayerId;
  /** Optional predetermined starting player (for testing) */
  startingPlayerId?: PlayerId;
  /** Optional predetermined random seed */
  randomSeed?: number;
}

/** Lore required to win (Rule 3.2.1.1) */
export const LORE_TO_WIN = 20;

/** Starting hand size (Rule 3.1.5) */
export const STARTING_HAND_SIZE = 7;

/**
 * Check if a phase is valid
 */
export function isPhase(value: unknown): value is Phase {
  if (typeof value !== "string") return false;
  return PHASES.includes(value as Phase);
}

/**
 * Check if a beginning step is valid
 */
export function isBeginningStep(value: unknown): value is BeginningStep {
  if (typeof value !== "string") return false;
  return BEGINNING_STEPS.includes(value as BeginningStep);
}

/**
 * Get the next phase
 */
export function getNextPhase(currentPhase: Phase): Phase | null {
  const index = PHASES.indexOf(currentPhase);
  if (index === -1 || index === PHASES.length - 1) {
    return null; // End phase is last
  }
  return PHASES[index + 1];
}

/**
 * Get the next beginning step
 */
export function getNextBeginningStep(
  currentStep: BeginningStep,
): BeginningStep | null {
  const index = BEGINNING_STEPS.indexOf(currentStep);
  if (index === -1 || index === BEGINNING_STEPS.length - 1) {
    return null; // Draw step is last
  }
  return BEGINNING_STEPS[index + 1];
}
