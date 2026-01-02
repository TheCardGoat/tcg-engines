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
export interface BanishCost {
  type: "banish";
  /** What to banish */
  target:
    | "self" // Banish this card
    | "item" // Banish one of your items
    | "character" // Banish one of your characters
    | "specific"; // Banish a specific card type/name
  /** For "specific" target - card type required */
  cardType?: CardType;
  /** For "specific" target - card name required */
  cardName?: string;
}

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
 */
export interface AbilityCost {
  /** Whether to exert this card */
  exert?: boolean;

  /** Ink to pay from inkwell */
  ink?: number;

  /** Banish this card */
  banishSelf?: boolean;

  /** Banish one of your items */
  banishItem?: boolean;

  /** Banish one of your characters */
  banishCharacter?: boolean;

  /** Number of cards to discard from hand */
  discardCards?: number;

  /** Whether discarded cards are chosen (vs random) */
  discardChosen?: boolean;

  /** Specific card type required for discard */
  discardCardType?: CardType | "song";

  /** Specific card name required for discard */
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
  return { exert: true, banishItem: true };
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
  return (
    cost.banishSelf === true ||
    cost.banishItem === true ||
    cost.banishCharacter === true
  );
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
