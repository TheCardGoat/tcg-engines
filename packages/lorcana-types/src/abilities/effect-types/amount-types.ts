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
 * Amount can be a fixed number or variable based on game state
 */
export type Amount = number | VariableAmount;

/**
 * Variable amount calculated from game state
 */
export type VariableAmount =
  | { type: "damage-on-target" }
  | { type: "damage-on-self" }
  | { type: "cards-in-hand"; controller: "you" | "opponent"; modifier?: number }
  | { type: "characters-in-play"; controller: "you" | "opponent" }
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
  | { type: "locations-in-play"; controller: "you" | "opponent" };

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
  | "next-play-this-turn"; // Used with static abilities
