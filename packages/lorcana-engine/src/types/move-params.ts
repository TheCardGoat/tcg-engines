/**
 * Lorcana Move Parameter Types
 *
 * Type-safe move parameters using discriminated unions for better type safety.
 * Each move has explicit parameter types that leverage TypeScript's type narrowing.
 */

import type { CardId, PlayerId } from "./branded-types";

/**
 * Play Card Cost Types - Discriminated Union
 *
 * Uses discriminated unions for type-safe alternative costs.
 * TypeScript can narrow types based on the `cost` discriminator.
 */
export type PlayCardCost =
  | {
      /** Standard ink cost payment */
      cost: "standard";
    }
  | {
      /** Shift cost - play over another character */
      cost: "shift";
      /** Character to shift onto (must share name) */
      shiftTarget: CardId;
    }
  | {
      /** Sing cost - exert a character to play a song */
      cost: "sing";
      /** Character exerting to sing the song */
      singer: CardId;
    }
  | {
      /** Sing Together cost - exert multiple characters */
      cost: "singTogether";
      /** Characters exerting to sing together */
      singers: CardId[];
    }
  | {
      /** Free play (for effects that play cards) */
      cost: "free";
    };

/**
 * Lorcana Move Parameters
 *
 * Exhaustive type definition for all Lorcana moves.
 * Each move has explicit, well-typed parameters.
 */
export type LorcanaMoveParams = {
  // ===== Setup Moves =====
  /**
   * Choose who goes first
   *
   * Rule 3.1.1: First player determined randomly
   */
  chooseWhoGoesFirstMove: { playerId: PlayerId };

  /**
   * Alter hand (mulligan)
   *
   * Rule 3.1.6: Players may mulligan by putting cards on bottom of deck
   */
  alterHand: {
    playerId: PlayerId;
    /** Cards to put on bottom of deck (empty array = keep all) */
    cardsToMulligan: CardId[];
  };

  /**
   * Draw cards (utility move for testing/effects)
   */
  drawCards: {
    playerId: PlayerId;
    count: number;
  };

  // ===== Resource Moves =====
  /**
   * Put a card into the inkwell
   *
   * Rule 4.3.3: Once per turn, put an inkable card into inkwell
   */
  putACardIntoTheInkwell: {
    cardId: CardId;
  };

  // ===== Core Game Moves =====
  /**
   * Play a card from hand
   *
   * Rule 4.3.4: Pay cost and put card into play (or discard for actions)
   * Rule 6.3.3: Songs can be sung as alternative cost
   * Rule 10.18: Shift allows playing over same-named characters
   */
  playCard: {
    cardId: CardId;
  } & PlayCardCost;

  /**
   * Quest with a character
   *
   * Rule 4.3.5: Exert character to gain lore equal to its Lore value
   */
  quest: {
    cardId: CardId;
  };

  /**
   * Challenge with a character
   *
   * Rule 4.3.6: Attack another character or location
   */
  challenge: {
    /** Attacking character */
    attackerId: CardId;
    /** Defending character or location */
    defenderId: CardId;
  };

  /**
   * Sing a song (legacy - prefer playCard with "sing" cost)
   *
   * Rule 6.3.3: Exert a character to play a song for free
   */
  sing: {
    /** Character doing the singing */
    singerId: CardId;
    /** Song being sung */
    songId: CardId;
  };

  /**
   * Sing Together (legacy - prefer playCard with "singTogether" cost)
   *
   * Rule 10.10: Multiple characters exert to sing a song together
   */
  singTogether: {
    /** Characters singing together */
    singersIds: CardId[];
    /** Song being sung */
    songId: CardId;
  };

  /**
   * Move a character to a location
   *
   * Rule 6.5: Characters can move to locations
   */
  moveCharacterToLocation: {
    characterId: CardId;
    locationId: CardId;
  };

  /**
   * Activate an ability
   *
   * Rule 7: Abilities with costs can be activated
   */
  activateAbility: {
    cardId: CardId;
    /** Optional ability selection (if card has multiple) */
    abilityIndex?: number;
    /** Alternative identification by ability text */
    abilityText?: string;
    /** Alternative cost for ability (e.g., sing to activate) */
    alternativeCost?: PlayCardCost;
  };

  // ===== Effect Resolution =====
  /**
   * Resolve an effect from the bag
   *
   * Rule 8.7: Bag system for triggered effects
   */
  resolveBag: {
    bagId: string;
    /** Parameters for the effect */
    params: unknown;
  };

  /**
   * Resolve an effect
   */
  resolveEffect: {
    effectId: string;
    /** Parameters for the effect */
    params: unknown;
  };

  // ===== Manual Actions (Testing/Debug) =====
  /**
   * Manually exert a card (for testing)
   */
  manualExert: {
    cardId: CardId;
  };

  // ===== Standard Moves =====
  /**
   * Pass turn to next player
   *
   * Rule 4.1.2: Player completes their turn
   */
  passTurn: Record<string, never>;

  /**
   * Concede the game
   *
   * Rule 1.9.1.2: Player can concede at any time
   */
  concede: Record<string, never>;
};

/**
 * Card Metadata Types
 *
 * Dynamic runtime state for cards in play.
 * Replaces generic `any` metadata with explicit types.
 */
export type LorcanaCardMeta = {
  /**
   * Exerted status
   *
   * Rule 5.1.2: Cards can be exerted (turned sideways)
   */
  isExerted?: boolean;

  /**
   * Played this turn (for "drying" characters)
   *
   * Rule 4.2.2.1: Characters are "drying" the turn they're played
   */
  playedThisTurn?: boolean;

  /**
   * Damage counters
   *
   * Rule 9: Damage represented by counters on cards
   */
  damage?: number;

  /**
   * Attached to another card (for items attached to characters)
   */
  attachedTo?: CardId;

  /**
   * Effects currently applied to this card
   */
  effectsApplied?: string[];

  /**
   * At a location (for characters at locations)
   *
   * Rule 6.5: Characters can move to locations
   */
  atLocation?: CardId;

  /**
   * Custom metadata for specific card effects
   */
  [key: string]: unknown;
};

// LorcanaGameState is exported from game-state.ts - import from there
