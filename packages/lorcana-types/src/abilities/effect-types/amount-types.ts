/**
 * Shared Types for Effects
 *
 * Defines primitive types used across multiple effect modules:
 * - Amount types (fixed or variable)
 * - Effect duration types
 */

import type { CardTarget, CharacterTarget } from "../target-types";

// ============================================================================
// Amount Types
// ============================================================================

/**
 * Amount can be a fixed number, variable based on game state, or a string reference
 */
export type Amount = number | VariableAmount | AmountString;

/**
 * String-based amount references
 */
export type AmountString =
  | "all" // All damage, all cards, etc.
  | "DISCARDED_COUNT" // Number of cards discarded
  | "DISCARDED_CARD_LORE" // Lore value of discarded card
  | "RETURNED_CARD_COST" // Cost of returned card
  | "DAMAGE_DEALT" // Amount of damage dealt
  | "OPPONENTS_DAMAGED_CHARACTER_COUNT" // Number of opponent's damaged characters
  | "X"; // Variable amount (determined at resolution)

/**
 * Counter types for for-each amounts
 */
export type ForEachCounterType =
  | "characters"
  | "damaged-characters"
  | "items"
  | "locations"
  | "cards-in-hand"
  | "cards-in-discard"
  | "damage-on-self"
  | "damage-on-target"
  | "cards-under-self";

/**
 * Variable amount calculated from game state
 */
export type VariableAmount =
  | { type: "damage-on-target" }
  | { type: "damage-on-self" }
  | {
      type: "cards-in-hand";
      controller: "you" | "opponent" | "opponents";
      modifier?: number;
    }
  | { type: "characters-in-play"; controller: "you" | "opponent" | "opponents" }
  | { type: "items-in-play"; controller: "you" | "opponent" }
  | { type: "cards-in-discard"; controller: "you" | "opponent" }
  | { type: "lore"; controller: "you" | "opponent" }
  | { type: "strength-of"; target: CharacterTarget }
  | { type: "willpower-of"; target: CharacterTarget }
  | { type: "lore-value-of"; target: CharacterTarget }
  | { type: "cost-of"; target: CardTarget }
  | { type: "cards-under-self" }
  | {
      type: "classification-character-count";
      classification: string;
      controller: "you" | "opponent";
    }
  | { type: "locations-in-play"; controller: "you" | "opponent" }
  // For-each based amounts
  | {
      type: "for-each";
      counter: ForEachCounterType | { type: string; controller?: string };
      count?: number | VariableAmount;
      modifier?: number;
    };

/**
 * Check if amount is variable (vs fixed number)
 */
export function isVariableAmount(amount: Amount): amount is VariableAmount {
  return typeof amount === "object";
}

// ============================================================================
// Effect Duration Types
// ============================================================================

/**
 * How long an effect lasts
 */
export type EffectDuration =
  | "this-turn"
  | "until-start-of-next-turn"
  | "until-end-of-turn"
  | "permanent"
  | "while-condition"
  | "next-play-this-turn" // Used with static abilities
  | "next-turn" // Until the start/end of their next turn
  | "their-next-turn"; // Until the opponent's next turn
