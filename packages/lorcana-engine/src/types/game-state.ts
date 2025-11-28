/**
 * Game State Types
 *
 * Core game state types for Lorcana engine.
 */

/** Player identifier */
export type PlayerId = string;

/** Card instance identifier */
export type CardId = string;

/** Zone identifier */
export type ZoneId = "deck" | "hand" | "play" | "inkwell" | "discard";

/**
 * Character state tracking
 */
export interface CharacterState {
  /** Card is drying (summoning sickness) - can't quest/challenge/use exert abilities */
  isDrying: boolean;
  /** Current damage on the character */
  damage: number;
}

/**
 * Active effect tracking (for "this turn" effects, etc.)
 */
export interface ActiveEffect {
  id: string;
  sourceCardId: CardId;
  type: string;
  params: Record<string, unknown>;
  expiresAt?: "endOfTurn" | "startOfNextTurn" | "custom";
}

/**
 * Bag entry for triggered abilities
 */
export interface BagEntry {
  id: string;
  abilityId: string;
  sourceCardId: CardId;
  controllerId: PlayerId;
  triggerEvent: string;
  timestamp: number;
}

/**
 * Lorcana-specific game state
 */
export interface LorcanaGameState {
  /** Lore scores for each player (win at 20+) */
  loreScores: Record<PlayerId, number>;

  /** The bag - triggered abilities waiting to resolve */
  bag: BagEntry[];

  /** Active effects (temporary modifiers) */
  effects: ActiveEffect[];

  /** Character states (damage, drying) */
  characterStates: Record<CardId, CharacterState>;

  /** Turn tracking */
  turnNumber: number;
  activePlayerId: PlayerId;
  hasInkedThisTurn: boolean;
  startingPlayerId: PlayerId;

  /** Current phase and step */
  currentPhase: "beginning" | "main" | "end";
  currentStep?: "ready" | "set" | "draw";

  /** Game end state */
  isGameOver: boolean;
  winner?: PlayerId;
  gameEndReason?: string;
}

/**
 * Default character state for new characters
 */
export function createDefaultCharacterState(): CharacterState {
  return {
    isDrying: true,
    damage: 0,
  };
}

/**
 * Create initial Lorcana game state
 */
export function createInitialLorcanaState(
  player1Id: PlayerId,
  player2Id: PlayerId,
  startingPlayerId: PlayerId,
): LorcanaGameState {
  return {
    loreScores: {
      [player1Id]: 0,
      [player2Id]: 0,
    },
    bag: [],
    effects: [],
    characterStates: {},
    turnNumber: 1,
    activePlayerId: startingPlayerId,
    hasInkedThisTurn: false,
    startingPlayerId,
    currentPhase: "beginning",
    currentStep: "ready",
    isGameOver: false,
  };
}
