import type { CardFilter } from "../filtering/card-filter";
import type { TargetDefinition } from "../targeting/target-definition";
import type { CardId, PlayerId } from "../types";

/**
 * Types of moves available in a TCG
 */
export type MoveType =
  | "play-card" // Play a card from hand
  | "activate-ability" // Activate an ability on a card in play
  | "attack" // Declare an attacker
  | "block" // Declare a blocker
  | "pass-priority" // Pass without taking action
  | "draw-card" // Draw a card
  | "discard" // Discard a card
  | "mulligan" // Mulligan starting hand
  | "custom"; // Game-specific move type

/**
 * Cost that must be paid to perform a move
 * Flexible to support various resource systems (mana, energy, ink, etc.)
 */
export type MoveCost = {
  /** Generic resources (mana, energy, etc.) */
  resources?: Record<string, number>;

  /** Cards that must be tapped/exhausted */
  tap?: CardFilter;

  /** Cards that must be sacrificed */
  sacrifice?: CardFilter;

  /** Cards that must be discarded */
  discard?: CardFilter;

  /** Life/health points to pay */
  life?: number;

  /** Custom cost predicate for complex costs */
  custom?: (playerId: PlayerId, state: unknown) => boolean;
};

/**
 * Preconditions that must be met for a move to be legal
 */
export type MovePrecondition<TGameState = unknown> = {
  /** Filter for which cards this move can be performed on/with */
  sourceFilter?: CardFilter<TGameState>;

  /** Timing restrictions (e.g., "main-phase", "combat", "any-time") */
  timing?: string | string[];

  /** Custom legality check */
  isLegal?: (playerId: PlayerId, state: TGameState) => boolean;
};

/**
 * Definition of a move that can be performed in the game
 * This is the declarative template for all player actions
 */
export type MoveDefinition<TGameState = unknown> = {
  /** Unique identifier for this move type */
  id: string;

  /** Human-readable name */
  name: string;

  /** Type of move */
  type: MoveType;

  /** Cost to perform this move */
  cost?: MoveCost;

  /** Preconditions for this move to be legal */
  preconditions?: MovePrecondition<TGameState>;

  /** Target requirements for this move */
  targets?: TargetDefinition[];

  /** Description of what this move does */
  description?: string;
};

/**
 * A specific instance of a move being performed
 * Contains the concrete choices made by the player
 */
export type MoveInstance<_TGameState = unknown> = {
  /** The move definition being executed */
  moveId: string;

  /** Player performing the move */
  playerId: PlayerId;

  /** Source card (if applicable) */
  sourceCardId?: CardId;

  /** Selected targets (if applicable) */
  targets?: CardId[][];

  /** Additional move-specific data */
  data?: Record<string, unknown>;

  /** Timestamp when move was created */
  timestamp?: number;
};

/**
 * Result of move validation
 */
export type MoveValidationResult = {
  valid: boolean;
  error?: string;
  missingCosts?: string[];
  invalidTargets?: number[];
};
