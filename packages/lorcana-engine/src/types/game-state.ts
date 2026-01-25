/**
 * Game State Types
 *
 * Core game state types for Lorcana engine.
 * Implements the @tcg/core IState pattern.
 */

import type { CardId, IState, PlayerId } from "@tcg/core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";

/** Card ready/exerted state */
export type CardReadyState = "ready" | "exerted";

/**
 * Stack position for shifted cards (Rule 5.1.5-5.1.7)
 */
export interface StackPosition {
  /** Is this card underneath another card? */
  isUnder: boolean;
  /** If this is the top card, what's its ID? */
  topCardId?: CardId;
  /** If this is the top card, IDs of cards underneath */
  cardsUnderneath?: CardId[];
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
 * Lorcana Card Metadata (Dynamic State)
 *
 * Stores mutable, game-specific card properties:
 * - Ready/Exerted state
 * - Damage
 * - Drying (summoning sickness)
 * - Stack position (Shift)
 * - Location attachment
 */
export interface LorcanaCardMeta {
  /** Ready or exerted (Rule 5.1.1-5.1.2) */
  state: CardReadyState;

  /** Damage counters (Rule 5.1.3-5.1.4) */
  damage: number;

  /** Drying = summoning sickness - can't quest/challenge/use exert abilities */
  isDrying: boolean;

  /** Stack position for Shift (Rule 5.1.5-5.1.7) */
  stackPosition?: StackPosition;

  /** Location this character is at (if any) */
  atLocationId?: CardId;
}

/**
 * Lorcana External State (Game Logic State)
 *
 * Game-specific state not managed by the framework.
 */
export interface LorcanaExternalState {
  /** Lore scores for each player (win at 20+) */
  loreScores: Record<PlayerId, number>;

  /** The bag - triggered abilities waiting to resolve */
  bag: BagEntry[];

  /** Active effects (temporary modifiers) */
  effects: ActiveEffect[];

  /** Turn tracking */
  turnNumber: number;
  activePlayerId: PlayerId;
  hasInkedThisTurn: boolean;
  startingPlayerId: PlayerId;

  /** Events that happened this turn (for conditions like "If you played a song this turn") */
  turnHistory: TurnHistoryEvent[];

  /** Current phase and step */
  currentPhase: "beginning" | "main" | "end";
  currentStep?: "ready" | "set" | "draw";

  /** Game end state */
  isGameOver: boolean;
  winner?: PlayerId;
  gameEndReason?: string;

  /** Name of the card named by "Name a card" effects */
  namedCard?: string;
}

export interface TurnHistoryEvent {
  type:
    | "played-song"
    | "played-character"
    | "played-action"
    | "played-floodborn"
    | "challenged"
    | "quested"
    | "banished-character"
    | "damaged-character"
    | "was-damaged"
    | "inked";
  sourceId?: CardId;
  controllerId: PlayerId;
  count: number; // For bulk events or just 1
  params?: Record<string, any>;
}

/**
 * Complete Lorcana Game State
 *
 * Combines framework-managed state (internal) with game-specific state (external).
 */
export type LorcanaGameState = IState<
  LorcanaExternalState,
  LorcanaCardDefinition,
  LorcanaCardMeta
>;

/**
 * Default card meta state for new cards
 */
export function createDefaultCardMeta(): LorcanaCardMeta {
  return {
    state: "ready",
    damage: 0,
    isDrying: true,
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
    internal: {
      zones: {}, // Zones are initialized by the framework zone manager
      cards: {}, // Cards are initialized by the framework
      cardMetas: {}, // Card metas are initialized as cards are created
    },
    external: {
      loreScores: {
        [player1Id]: 0,
        [player2Id]: 0,
      },
      bag: [],
      effects: [],
      turnNumber: 1,
      activePlayerId: startingPlayerId,
      hasInkedThisTurn: false,
      turnHistory: [],
      startingPlayerId,
      currentPhase: "beginning",
      currentStep: "ready",
      isGameOver: false,
    },
  };
}
