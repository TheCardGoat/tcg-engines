/**
 * Cost Types for Lorcana Abilities
 *
 * Defines the costs required to activate abilities in Lorcana.
 * Activated abilities use the format: "{cost} - {effect}"
 *
 * Common costs:
 * - {E} = Exert this card
 * - {d} {I} = Pay ink (where d is a number)
 * - Banish this card/item
 * - Discard cards
 *
 * @example "{E} - Draw a card" (exert cost)
 * @example "{E}, 2 {I} - Deal 3 damage" (exert + ink cost)
 * @example "Banish this item - Gain 3 lore" (banish self cost)
 */

import type { CardType } from "../cards/card-types";

// ============================================================================
// Individual Cost Components
// ============================================================================

/**
 * Exert cost - tap/exhaust this card
 */
export interface ExertCost {
  type: "exert";
  /** What to exert (defaults to self) */
  target?: "self" | "another-character" | "item";
}

/**
 * Ink cost - pay from inkwell
 */
export interface InkCost {
  type: "ink";
  amount: number;
}

/**
 * Banish cost - sacrifice a card
 */
export type BanishCost =
  | {
      type: "banish";
      /** Simple banish targets */
      target: "self" | "item" | "character";
    }
  | {
      type: "banish";
      /** Banish a specific card type/name */
      target: "specific";
      /** For "specific" target - card type or name required */
      cardType?: CardType;
      /** For "specific" target - card name required */
      cardName?: string;
    };

/**
 * Discard cost - discard cards from hand
 */
export interface DiscardCost {
  type: "discard";
  /** How many cards to discard */
  amount: number;
  /** Whether the player chooses which cards (vs random) */
  chosen?: boolean;
  /** Specific card type required */
  cardType?: CardType | "song";
  /** Specific card name required */
  cardName?: string;
}

/**
 * Deal damage to self cost
 */
export interface DamageSelfCost {
  type: "damage-self";
  amount: number;
}

/**
 * Return card to hand cost
 */
export interface ReturnToHandCost {
  type: "return-to-hand";
  /** What to return */
  target:
    | "self" // Return this card
    | "another-character" // Return another of your characters
    | "item"; // Return one of your items
}

/**
 * Put card under another card cost
 */
export interface PutUnderCost {
  type: "put-under";
  /** What goes under */
  source: "card-from-hand" | "top-of-deck";
  /** Card type requirement */
  cardType?: CardType;
}

/**
 * Exert another card cost (not self)
 */
export interface ExertOtherCost {
  type: "exert-other";
  /** What to exert */
  target: "character" | "item";
  /** How many to exert */
  amount?: number;
}

// ============================================================================
// Combined Cost
// ============================================================================

/**
 * Individual cost component
 */
export type CostComponent =
  | ExertCost
  | InkCost
  | BanishCost
  | DiscardCost
  | DamageSelfCost
  | ReturnToHandCost
  | PutUnderCost
  | ExertOtherCost;

/**
 * Complete ability cost - can have multiple components
 *
 * @example "{E}" - just exert
 * ```typescript
 * { exert: true }
 * ```
 *
 * @example "{E}, 2 {I}" - exert and pay 2 ink
 * ```typescript
 * { exert: true, ink: 2 }
 * ```
 *
 * @example "{E}, Banish this item" - exert and banish self
 * ```typescript
 * { exert: true, banishSelf: true }
 * ```
 *
 * @example "Choose and discard a card" - discard cost
 * ```typescript
 * { discardCards: 1, discardChosen: true }
 * ```
 *
 * @remarks
 * **Valid Cost Combinations:**
 * - `exert` can be combined with any other cost
 * - `ink` must be a positive number (omit if no ink cost)
 * - Banish costs (`banishSelf`, `banishItem`, `banishCharacter`) are mutually exclusive
 * - `discardChosen` requires `discardCards` to also be set
 * - `discardCardType`/`discardCardName` require `discardCards` to also be set
 * - Use `components` for complex costs not covered by simple fields
 *
 * @todo Consider refactoring to discriminated unions for better type safety in a future major version
 */
export interface AbilityCost {
  /** Whether to exert this card */
  exert?: boolean;

  /** Ink to pay from inkwell (must be positive if present) */
  ink?: number;

  /** Banish this card (mutually exclusive with banishItem/banishCharacter) */
  banishSelf?: boolean;

  /** Banish one of your items (mutually exclusive with banishSelf/banishCharacter) */
  banishItem?: boolean;

  /** Banish one of your characters (mutually exclusive with banishSelf/banishItem) */
  banishCharacter?: boolean;

  /** Banish another card (generic) */
  banishOther?: boolean;

  /** Number of cards to discard from hand */
  discardCards?: number;

  /** Alias for discardCards (singular form) */
  discardCard?: number;

  /** Whether discarded cards are chosen (requires discardCards) */
  discardChosen?: boolean;

  /** Specific card type required for discard (requires discardCards) */
  discardCardType?: CardType | "song";

  /** Specific card name required for discard (requires discardCards) */
  discardCardName?: string;

  /** Damage to deal to this character */
  damageSelf?: number;

  /** Return this card to hand */
  returnSelfToHand?: boolean;

  /** Return another character to hand */
  returnCharacterToHand?: boolean;

  /** Number of items to exert (other than self) */
  exertItems?: number;

  /** Number of characters to exert (other than self) */
  exertCharacters?: number;

  /** Exert a single character (singular form) */
  exertCharacter?: boolean;

  /** Exert another card (generic) */
  exertOther?: boolean;

  /** Target for cost (e.g., which character to exert) */
  target?: string;

  /**
   * Discard cost as an object (alternative format)
   * Used by parser for complex discard costs
   */
  discard?: {
    cardType?: CardType | "song" | "character";
    amount?: number;
  };

  /**
   * Complex cost components (for less common costs)
   * Used when the simple fields above don't suffice
   */
  components?: CostComponent[];
}

// ============================================================================
// Cost Builders (convenience)
// ============================================================================

/**
 * Create an exert-only cost
 */
export function exertCost(): AbilityCost {
  return { exert: true };
}

/**
 * Create an exert + ink cost
 */
export function exertAndInkCost(ink: number): AbilityCost {
  return { exert: true, ink };
}

/**
 * Create a banish-self cost
 */
export function banishSelfCost(): AbilityCost {
  return { banishSelf: true };
}

/**
 * Create an exert + banish item cost
 */
export function exertAndBanishItemCost(): AbilityCost {
  return { banishItem: true, exert: true };
}

/**
 * Create a discard cost
 */
export function discardCost(amount: number, chosen = true): AbilityCost {
  return { discardCards: amount, discardChosen: chosen };
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a cost requires exerting
 */
export function requiresExert(cost: AbilityCost): boolean {
  return cost.exert === true;
}

/**
 * Check if a cost requires paying ink
 */
export function requiresInk(cost: AbilityCost): boolean {
  return (cost.ink ?? 0) > 0;
}

/**
 * Check if a cost requires banishing something
 */
export function requiresBanish(cost: AbilityCost): boolean {
  return cost.banishSelf === true || cost.banishItem === true || cost.banishCharacter === true;
}

/**
 * Check if a cost requires discarding cards
 */
export function requiresDiscard(cost: AbilityCost): boolean {
  return (cost.discardCards ?? 0) > 0;
}

/**
 * Get total ink cost
 */
export function getInkCost(cost: AbilityCost): number {
  return cost.ink ?? 0;
}

/**
 * Check if cost is "free" (no cost)
 */
export function isFreeCost(cost: AbilityCost): boolean {
  return (
    !(
      cost.exert ||
      cost.ink ||
      cost.banishSelf ||
      cost.banishItem ||
      cost.banishCharacter ||
      cost.discardCards ||
      cost.damageSelf ||
      cost.returnSelfToHand ||
      cost.returnCharacterToHand ||
      cost.exertItems ||
      cost.exertCharacters
    ) &&
    (!cost.components || cost.components.length === 0)
  );
}
