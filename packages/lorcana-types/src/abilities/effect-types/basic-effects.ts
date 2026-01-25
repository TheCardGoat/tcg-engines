/**
 * Basic Effect Types
 *
 * Core effect types for common game actions:
 * - Draw/Discard cards
 * - Deal/Remove damage
 * - Gain/Lose lore
 * - Exert/Ready/Banish cards
 */

import type {
  CharacterTarget,
  ItemTarget,
  LocationTarget,
  PlayerTarget,
  TargetZone,
} from "../target-types";
import type { Amount } from "./amount-types";

// ============================================================================
// Draw/Discard Effects
// ============================================================================

/**
 * Draw cards effect
 *
 * @example "Draw 2 cards"
 * @example "Each player draws a card"
 */
export interface DrawEffect {
  type: "draw";
  amount: Amount;
  target: PlayerTarget;
}

/**
 * Discard cards effect
 *
 * @example "Choose and discard a card"
 * @example "Each opponent discards a card at random"
 */
export interface DiscardEffect {
  type: "discard";
  amount: Amount;
  target?: PlayerTarget;
  /** Whether the affected player chooses which cards */
  chosen?: boolean;
  /** Who chooses (alternative to chosen) */
  chosenBy?: "you" | "opponent" | "TARGET";
  /** If not chosen, discard is random */
  random?: boolean;
  /** Discard from specific zone (default: hand) */
  from?: TargetZone;
  /** Filter for what can be discarded */
  filter?: {
    cardType?: string;
    maxCost?: number;
    classification?: string;
  };
}

// ============================================================================
// Damage Effects
// ============================================================================

/**
 * Deal damage effect
 *
 * @example "Deal 3 damage to chosen character"
 * @example "Deal 2 damage to each opposing character"
 */
export interface DealDamageEffect {
  type: "deal-damage";
  amount: Amount;
  target: CharacterTarget | LocationTarget;
}

/**
 * Put damage counters (different from "deal" - doesn't trigger "when dealt damage")
 */
export interface PutDamageEffect {
  type: "put-damage";
  amount: Amount;
  target: CharacterTarget | LocationTarget;
}

/**
 * Remove damage effect
 *
 * @example "Remove up to 3 damage from chosen character"
 */
export interface RemoveDamageEffect {
  type: "remove-damage";
  amount: Amount;
  target: CharacterTarget | LocationTarget;
  /** "up to" allows removing less than max */
  upTo?: boolean;
}

/**
 * Move damage counters effect
 *
 * @example "Move 2 damage from chosen character to another"
 */
export interface MoveDamageEffect {
  type: "move-damage";
  amount: Amount;
  from: CharacterTarget;
  to: CharacterTarget;
}

// ============================================================================
// Lore Effects
// ============================================================================

/**
 * Gain lore effect
 *
 * @example "Gain 2 lore"
 */
export interface GainLoreEffect {
  type: "gain-lore";
  amount: Amount;
  target?: PlayerTarget;
}

/**
 * Lose lore effect
 *
 * @example "Each opponent loses 1 lore"
 */
export interface LoseLoreEffect {
  type: "lose-lore";
  amount: Amount;
  target?: PlayerTarget;
}

// ============================================================================
// Card State Effects
// ============================================================================

/**
 * Exert effect
 *
 * @example "Exert chosen character"
 */
export interface ExertEffect {
  type: "exert";
  target: CharacterTarget | ItemTarget | LocationTarget;
}

/**
 * Ready effect
 *
 * @example "Ready chosen character"
 */
export interface ReadyEffect {
  type: "ready";
  target: CharacterTarget | ItemTarget | LocationTarget;
  /** Restriction after readying */
  restriction?: "cant-quest" | "cant-challenge" | "cant-quest-or-challenge";
}

/**
 * Banish effect
 *
 * @example "Banish chosen character"
 * @example "Banish all opposing items"
 */
export interface BanishEffect {
  type: "banish";
  target: CharacterTarget | ItemTarget | LocationTarget;
}

// ============================================================================
// Look At / Reveal Effects
// ============================================================================

/**
 * Look at cards effect
 *
 * @example "Look at the top 3 cards of your deck"
 */
export interface LookAtCardsEffect {
  type: "look-at-cards";
  amount: Amount;
  source: "deck" | "hand" | "discard";
  target: PlayerTarget;
}

/**
 * Put card into hand effect
 *
 * @example "Put a card into your hand"
 */
export interface PutInHandEffect {
  type: "put-in-hand";
  source: "deck" | "discard" | "revealed";
  target: PlayerTarget;
}
