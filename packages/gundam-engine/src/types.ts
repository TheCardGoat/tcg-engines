/**
 * Gundam Card Game Type Definitions
 *
 * Defines all game-specific types that extend the @tcg/core framework.
 * These types provide strong typing for game state, moves, and game entities.
 */

import type { CardId, PlayerId, Zone } from "@tcg/core";
import type { EffectStackState, KeywordEffect, TemporaryModifier } from "./types/effects";

/**
 * Gundam Game State
 *
 * Extends core game state with Gundam-specific properties.
 * Uses @tcg/core's Zone type for all zone management.
 */
export interface GundamGameState {
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

    /** Limbo - temporary holding zone for COMMAND cards during effect resolution */
    limbo: Record<PlayerId, Zone>;
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

    /**
     * Effect Stack
     *
     * Manages the stack of pending effects waiting to resolve.
     * Effects resolve in LIFO (Last-In, First-Out) order per
     * Official Rules Section 11-3: Effect Resolution.
     *
     * The stack tracks:
     * - Effect instances currently waiting to resolve
     * - Current action being resolved for each effect
     * - Targets selected for each effect
     * - Resolution state (pending/resolving/resolved/fizzled)
     */
    effectStack: EffectStackState;

    /**
     * Temporary Modifiers
     *
     * Tracks temporary stat changes and keyword grants on cards.
     * These modifiers expire at specific timing points:
     * - end_of_turn: Removed during end phase cleanup
     * - end_of_combat: Removed after combat resolution
     * - permanent: Never expires (though card removal clears them)
     * - while_condition: Expires when the specified condition becomes false
     *
     * Each card can have multiple modifiers active simultaneously.
     * Keyed by CardId mapping to an array of modifiers for that card.
     * Each modifier has a unique id for tracking and individual removal.
     */
    temporaryModifiers: Record<CardId, TemporaryModifier[]>;

    /**
     * Damage Tracking
     *
     * Tracks damage counters on cards.
     * Damage is tracked for units, bases, and shields.
     * When damage >= HP, the card is destroyed.
     *
     * Keyed by CardId mapping to current damage amount.
     */
    cardDamage: Record<CardId, number>;

    /**
     * Revealed Cards Tracking
     *
     * Tracks cards that have been revealed to all players via effects.
     * Used by SEARCH effects with reveal=true.
     *
     * Array of card IDs that are currently revealed.
     * Cleared after each effect resolution.
     */
    revealedCards: CardId[];

    /** Win/loss tracking */
    winner?: PlayerId;
    loser?: PlayerId;
    gameEndReason?: string;
  };
}

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
export interface GundamMoves {
  playCard: {
    playerId: PlayerId;
    cardId: CardId;
  };

  /** Attack with a unit */
  attack: {
    playerId: PlayerId;
    attackerId: CardId;
    targetId?: CardId; // Undefined = direct attack to player
  };

  /** Pass/end current phase */
  pass: {
    playerId: PlayerId;
  };

  /** Concede the game */
  concede: {
    playerId: PlayerId;
  };

  /** Play COMMAND card from hand */
  playCommand: {
    playerId: PlayerId;
    cardId: CardId;
  };

  /** Resolve next effect from stack */
  resolveEffectStack: {
    playerId: PlayerId;
    targets?: CardId[]; // Optional targets for the effect
  };

  /** Execute effect actions (internal, called by resolveEffectStack) */
  executeEffect: {
    playerId: PlayerId;
    effectInstanceId: string;
    targets?: CardId[];
  };

  /** Handle turn start (internal, detects start of turn triggers) */
  handleTurnStart: {
    playerId: PlayerId;
  };

  /** Handle turn end (internal, detects end of turn triggers) */
  handleTurnEnd: {
    playerId: PlayerId;
  };
}

/**
 * Card Metadata Types
 *
 * Dynamic runtime state for cards in play.
 * Replaces generic `any` metadata with explicit types.
 */
export interface GundamCardMeta {
  /**
   * 5-4. Active and Rested
   * 5-4-1. Cards in the battle area, resource area, and base section can be in one of the two following indicative orientations.
   * 5-4-1-1. Active: the card is placed vertically.
   * 5-4-1-2. Rested: the card is placed horizontally
   */
  isRested: boolean;

  /**
   * 5-5. Damage
   * 5-5-1. When damage is dealt to a Unit, Base, or Shield, the dealt damage is shown with counters
   * 5-5-1-1. Show the current amount of damage a card has received by placing a number of counters equal to that damage on top of it.
   * 5-5-2. A card that receives damage equal to or greater than its HP is destroyed as a result of rules management.
   * 5-5-3. Units, Bases, Shields, and players can receive damage as a result of battle.  Attacking Units and Units being attacked deal damage equal to their AP to each other during the damage step. This damage is called battle damage.
   * 5-5-4. Units, Bases, Shields, and players can receive damage from effects on cards. This damage is called effect damage.
   * 5-5-5. Damage is not dealt when the amount of damage dealt would be zero.
   * 5-5-6. When damage received by a Base or Shield exceeds its HP, the excess damage is not dealt to another Shield.
   */
  damage: number;

  playedThisTurn: boolean;
}
