/**
 * Gundam Game State Types
 *
 * Defines game-specific types that extend the @tcg/core framework using IState pattern.
 * This follows the same pattern as lorcana-engine's game-state.ts.
 *
 * Key concepts:
 * - GundamCardMeta: Dynamic runtime state for cards (damage, rested status)
 * - GundamExternalState: Game-specific state not managed by framework
 * - GundamGameState: Complete state using IState<TExternal, TCardDefinition, TCardMeta>
 */

import type { CardId, IState, PlayerId } from "@tcg/core";
import type { CardDefinition } from "../cards/card-types";

// ============================================================================
// PHASE TYPE
// ============================================================================

/**
 * Gundam Phase
 *
 * Turn structure phases per Official Rules Section 4.
 */
export type GundamPhase =
  | "setup"
  | "start"
  | "draw"
  | "resource"
  | "main"
  | "end"
  | "gameOver";

// ============================================================================
// CARD METADATA
// ============================================================================

/**
 * Gundam Card Metadata (Dynamic State)
 *
 * Stores mutable, game-specific card properties that change during gameplay.
 * This is stored in state.internal.cardMetas keyed by CardId.
 *
 * Rule References:
 * - Rule 5-4-1: Active and Rested orientations
 * - Rule 5-5-1: Damage counters
 */
export interface GundamCardMeta {
  /**
   * Whether the card is rested (horizontal/exhausted)
   *
   * Rule 5-4-1-1: Active (vertical) - can act
   * Rule 5-4-1-2: Rested (horizontal) - cannot act
   */
  isRested: boolean;

  /**
   * Damage counters on this card
   *
   * Rule 5-5-1: Damage shown with counters
   * Rule 5-5-2: Destroyed when damage >= HP
   */
  damage: number;

  /**
   * Whether this card was played this turn
   * Used for summoning sickness and various effect triggers
   */
  playedThisTurn: boolean;
}

// ============================================================================
// EXTERNAL STATE (Game Logic State)
// ============================================================================

/**
 * Effect Stack Entry
 *
 * Represents an effect instance on the resolution stack.
 */
export interface EffectStackEntry {
  /** Unique instance identifier */
  instanceId: string;
  /** Card that generated this effect */
  sourceCardId: CardId;
  /** Player controlling this effect */
  controllerId: PlayerId;
  /** Reference to effect definition */
  effectRef: {
    effectId: string;
  };
  /** Current action index being resolved */
  currentActionIndex: number;
  /** Selected targets for this effect */
  targets?: CardId[];
  /** Current resolution state */
  state: "pending" | "resolving" | "resolved" | "fizzled";
}

/**
 * Effect Stack State
 *
 * Manages the stack of pending effects waiting to resolve.
 * Effects resolve in FIFO order per Official Rules Section 11-3.
 */
export interface EffectStackState {
  /** Stack of effect instances */
  stack: EffectStackEntry[];
  /** Counter for generating unique instance IDs */
  nextInstanceId: number;
}

/**
 * Temporary Modifier
 *
 * Tracks temporary stat changes and keyword grants on cards.
 * These modifiers expire at specific timing points.
 */
export interface TemporaryModifier {
  /** Unique identifier */
  id: string;
  /** Card being modified */
  cardId: CardId;
  /** Type of modification */
  type: "stat" | "keyword";
  /** AP modification */
  apModifier?: number;
  /** HP modification */
  hpModifier?: number;
  /** Keywords granted */
  grantedKeywords?: string[];
  /** When this modifier expires */
  duration: "end_of_turn" | "end_of_combat" | "permanent" | "while_condition";
  /** Source card for tracking */
  sourceCardId: CardId;
  /** Condition for while_condition duration */
  condition?: string;
}

/**
 * Gundam External State (Game Logic State)
 *
 * Game-specific state that is not managed by the framework.
 * This is stored in state.external and modified directly in move reducers.
 */
export interface GundamExternalState {
  /** All players in the game */
  playerIds: PlayerId[];

  /** Turn number (starts at 1) */
  turnNumber: number;

  /** Current active player */
  activePlayerId: PlayerId;

  /** Current game phase */
  currentPhase: GundamPhase;

  /** Players who have played a resource this turn */
  hasPlayedResourceThisTurn: Record<PlayerId, boolean>;

  /** Active (untapped) resource count per player */
  activeResources: Record<PlayerId, number>;

  /** Card positions (active/rested) - deprecated, use cardMetas */
  cardPositions: Record<CardId, "active" | "rested">;

  /** Cards that have attacked this turn */
  attackedThisTurn: CardId[];

  /**
   * Effect Stack
   * Manages pending effects waiting to resolve (Section 11-3)
   */
  effectStack: EffectStackState;

  /**
   * Temporary Modifiers
   * Tracks temporary stat changes on cards
   */
  temporaryModifiers: Record<CardId, TemporaryModifier[]>;

  /** Cards that have been revealed this turn */
  revealedCards: CardId[];

  /** Game end state */
  winner?: PlayerId;
  loser?: PlayerId;
  gameEndReason?: string;
}

// ============================================================================
// COMPLETE GAME STATE
// ============================================================================

/**
 * Complete Gundam Game State
 *
 * Combines framework-managed state (internal) with game-specific state (external).
 * Uses the IState pattern from @tcg/core.
 *
 * Structure:
 * - internal.zones: Zone management (deck, hand, battle area, etc.)
 * - internal.cards: Card instances with base properties
 * - internal.cardMetas: GundamCardMeta for each card
 * - external: GundamExternalState with game logic state
 */
export type GundamGameState = IState<
  GundamExternalState,
  CardDefinition,
  GundamCardMeta
>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create default card metadata for new cards
 *
 * Cards enter play in active state with no damage.
 */
export function createDefaultCardMeta(): GundamCardMeta {
  return {
    isRested: false,
    damage: 0,
    playedThisTurn: true,
  };
}

/**
 * Create initial Gundam game state
 *
 * Initializes the external state with default values.
 * Zones and cards are initialized by the framework.
 */
export function createInitialGundamState(
  player1Id: PlayerId,
  player2Id: PlayerId,
  startingPlayerId: PlayerId,
): GundamGameState {
  return {
    internal: {
      zones: {}, // Zones initialized by framework zone manager
      cards: {}, // Cards initialized by framework
      cardMetas: {}, // Card metas initialized as cards are created
    },
    external: {
      playerIds: [player1Id, player2Id],
      turnNumber: 1,
      activePlayerId: startingPlayerId,
      currentPhase: "setup",
      hasPlayedResourceThisTurn: {
        [player1Id]: false,
        [player2Id]: false,
      },
      activeResources: {
        [player1Id]: 0,
        [player2Id]: 0,
      },
      cardPositions: {},
      attackedThisTurn: [],
      effectStack: {
        stack: [],
        nextInstanceId: 0,
      },
      temporaryModifiers: {},
      revealedCards: [],
      winner: undefined,
      loser: undefined,
      gameEndReason: undefined,
    },
  };
}
