/**
 * System Types
 *
 * Types for the Bag and Game State Check systems.
 */

import type {
  GameEvent,
  TriggeredAbilityInstance,
} from "../abilities/ability-types";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";

// =============================================================================
// Bag Types (Rule 1.7, 8.7)
// =============================================================================

/**
 * An entry in the bag representing a triggered ability waiting to resolve
 */
export interface BagEntry {
  /** Unique identifier for this bag entry */
  id: string;
  /** The triggered ability instance */
  ability: TriggeredAbilityInstance;
  /** Card that has this ability */
  sourceCardId: CardId;
  /** Player who controls this ability */
  controllerId: PlayerId;
  /** The event that triggered this ability */
  triggerEvent: GameEvent;
  /** Timestamp for ordering purposes */
  timestamp: number;
  /** Snapshot of the card when trigger occurred (for floating triggers) */
  sourceCardSnapshot?: LorcanaCardDefinition;
}

/**
 * Choice to resolve a specific bag entry
 */
export interface BagResolutionChoice {
  bagEntryId: string;
}

/**
 * State of the bag
 */
export interface BagState {
  /** All entries currently in the bag */
  entries: BagEntry[];
  /** Entry currently being resolved */
  currentlyResolving: BagEntry | null;
  /** History of resolved entry IDs */
  resolutionOrder: string[];
}

// =============================================================================
// Game State Check Types (Rule 1.9)
// =============================================================================

/**
 * Win condition detection
 */
export interface WinCondition {
  playerId: PlayerId;
  reason: "lore_victory";
  lore: number;
}

/**
 * Loss condition detection
 */
export interface LossCondition {
  playerId: PlayerId;
  reason: "deck_out" | "concede";
}

/**
 * Required action that must be performed
 */
export interface RequiredAction {
  type: "banish";
  cardId: CardId;
  reason: "damage_exceeds_willpower";
}

/**
 * Result of a game state check
 */
export interface GameStateCheckResult {
  /** Win conditions detected */
  winConditions: WinCondition[];
  /** Loss conditions detected */
  lossConditions: LossCondition[];
  /** Actions that must be performed */
  requiredActions: RequiredAction[];
  /** New triggers generated during check */
  newTriggers: BagEntry[];
}

// =============================================================================
// Game End Types
// =============================================================================

/**
 * Reasons the game can end
 */
export type GameEndReason =
  | { type: "LORE_VICTORY"; playerId: PlayerId; lore: number }
  | { type: "DECK_OUT"; playerId: PlayerId }
  | { type: "CONCEDE"; playerId: PlayerId };

/**
 * Final state of the game
 */
export interface GameEndState {
  isOver: boolean;
  winner?: PlayerId;
  loser?: PlayerId;
  reason?: GameEndReason;
}

// =============================================================================
// Resolution State
// =============================================================================

/**
 * Overall resolution state tracking
 */
export interface ResolutionState {
  bag: BagState;
  pendingGameStateCheck: boolean;
  gameStateCheckQueue: GameStateCheckResult[];
}

/**
 * Create an initial empty bag state
 */
export function createEmptyBagState(): BagState {
  return {
    entries: [],
    currentlyResolving: null,
    resolutionOrder: [],
  };
}

/**
 * Create an initial resolution state
 */
export function createResolutionState(): ResolutionState {
  return {
    bag: createEmptyBagState(),
    pendingGameStateCheck: false,
    gameStateCheckQueue: [],
  };
}
