/**
 * Gundam Card Game Type Definitions
 *
 * Defines all game-specific types that extend the @tcg/core framework.
 * These types provide strong typing for game state, moves, and game entities.
 */

import type { CardId, PlayerId, Zone } from "@tcg/core";

/**
 * Gundam Game State
 *
 * Extends core game state with Gundam-specific properties.
 * Uses @tcg/core's Zone type for all zone management.
 */
export type GundamGameState = {
  /** Player identifiers */
  players: PlayerId[];

  /** Current turn player */
  currentPlayer: PlayerId;

  /** Turn counter */
  turn: number;

  /** Current game phase */
  phase: "setup" | "start" | "draw" | "resource" | "main" | "end" | "gameOver";

  /** All game zones organized by player */
  zones: {
    /** Main deck (50 cards) - private, ordered */
    deck: Record<PlayerId, Zone>;

    /** Resource deck (10 cards) - private, ordered */
    resourceDeck: Record<PlayerId, Zone>;

    /** Player hand - private, max 10 at end phase */
    hand: Record<PlayerId, Zone>;

    /** Battle area - public, max 6 units */
    battleArea: Record<PlayerId, Zone>;

    /** Shield section - private face-down shields */
    shieldSection: Record<PlayerId, Zone>;

    /** Base section - public, max 1 base */
    baseSection: Record<PlayerId, Zone>;

    /** Resource area - public, max 15 resources */
    resourceArea: Record<PlayerId, Zone>;

    /** Trash pile - public */
    trash: Record<PlayerId, Zone>;

    /** Removal area - public, removed from game */
    removal: Record<PlayerId, Zone>;
  };

  /** Gundam-specific game state */
  gundam: {
    /** Active (untapped) resource count per player */
    activeResources: Record<PlayerId, number>;

    /** Card positions (active/rested) */
    cardPositions: Record<CardId, CardPosition>;

    /** Cards that have attacked this turn */
    attackedThisTurn: CardId[];

    /** Players who have played a resource this turn */
    hasPlayedResourceThisTurn: Record<PlayerId, boolean>;

    /** Win/loss tracking */
    winner?: PlayerId;
    loser?: PlayerId;
    gameEndReason?: string;
  };
};

/**
 * Card Position (Orientation)
 *
 * - active: Vertical/ready (can attack, use abilities)
 * - rested: Horizontal/exhausted (tapped)
 */
export type CardPosition = "active" | "rested";

/**
 * Gundam Move Types
 *
 * Defines all possible player actions in the game.
 * Each move type specifies its required parameters.
 */
export type GundamMoves = {
  /** Draw cards from deck to hand */
  draw: {
    /** Player drawing cards */
    playerId: PlayerId;
    /** Number of cards to draw */
    count: number;
  };

  /** Deploy a unit to battle area */
  deployUnit: {
    playerId: PlayerId;
    cardId: CardId;
    position?: number;
  };

  /** Deploy a base to base section */
  deployBase: {
    playerId: PlayerId;
    cardId: CardId;
  };

  /** Place a resource */
  playResource: {
    playerId: PlayerId;
    cardId: CardId;
  };

  /** Attack with a unit */
  attack: {
    playerId: PlayerId;
    attackerId: CardId;
    targetId?: CardId; // undefined = direct attack to player
  };

  /** Pass/end current phase */
  pass: {
    playerId: PlayerId;
  };

  /** Concede the game */
  concede: {
    playerId: PlayerId;
  };
};
