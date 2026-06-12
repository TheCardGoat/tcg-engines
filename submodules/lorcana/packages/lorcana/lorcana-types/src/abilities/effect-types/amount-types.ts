/**
 * Shared Types for Effects
 *
 * Defines primitive types used across multiple effect modules:
 * - Amount types (fixed or variable)
 * - Effect duration types
 */

import type { CardFilter, CardTarget, CharacterTarget, TargetZone } from "../target-types";

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
  | "X" // Variable amount (determined at resolution)
  // Extended amount references for card text coverage
  | "DAMAGE_REMOVED" // Amount of damage removed
  | "HAND" // Number of cards in hand
  | "TARGET_COST" // Cost of target card
  | "TARGET_STRENGTH" // Strength of target character
  | "TARGET_WILLPOWER"; // Willpower of target character

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
  | "cards-in-inkwell-over-limit"
  | "damage-on-self"
  | "damage-on-target"
  | "last-effect-target-count"
  | "cards-under-self"
  | "exerted-characters";

export type TargetAttributeKey = "strength" | "lore" | "damage" | "cost";

export type SourceAttributeKey =
  | "strength"
  | "lore"
  | "damage"
  | "chars-at-location"
  | "cards-under-them"
  /** Lore value of the location this character is currently at */
  | "location-lore";

export type TriggerTargetAttributeKey =
  | "cards-under-count-before-banish"
  | "strength-before-banish";

export type TargetLocationAttributeKey = "lore";

export type CountController = "you" | "opponent" | "opponents";

export type VariableAmountOperand = number | VariableAmount;

/**
 * Variable amount calculated from game state
 */
export type VariableAmount =
  | { type: "target-attribute"; attribute: TargetAttributeKey }
  | { type: "source-attribute"; attribute: SourceAttributeKey }
  | { type: "trigger-target-attribute"; attribute: TriggerTargetAttributeKey }
  | { type: "target-location-attribute"; attribute: TargetLocationAttributeKey }
  | {
      type: "filtered-count";
      filters: readonly CardFilter[];
      excludeSelf?: boolean;
      multiplier?: number;
      owner?: "you" | "opponent" | "any";
      zones?: TargetZone[];
      cardType?: "character" | "item" | "location" | "action";
      cardTypes?: readonly ("character" | "item" | "location" | "action")[];
    }
  | {
      type: "difference";
      left: VariableAmountOperand;
      right: VariableAmountOperand;
      invert?: boolean;
    }
  | {
      type: "reducer";
      reducer: "damage";
      filters: readonly CardFilter[];
      excludeSelf?: boolean;
      owner?: "you" | "opponent" | "any";
      zones?: TargetZone[];
      cardType?: "character" | "item" | "location" | "action";
      cardTypes?: readonly ("character" | "item" | "location" | "action")[];
    }
  | {
      type: "clamp";
      value: VariableAmountOperand;
      max: VariableAmountOperand;
      min?: VariableAmountOperand;
    }
  | { type: "trigger-amount" }
  | { type: "damage-on-target" }
  | { type: "damage-on-self" }
  | { type: "last-effect-target-count" }
  | {
      type: "cards-in-hand";
      controller: CountController;
      modifier?: number;
    }
  | { type: "characters-in-play"; controller: CountController }
  | { type: "items-in-play"; controller: "you" | "opponent" | "opponents" }
  | { type: "cards-in-discard"; controller: "you" | "opponent" | "opponents" }
  | { type: "lore"; controller: "you" | "opponent" | "opponents" }
  | { type: "strength-of"; target: CharacterTarget }
  | { type: "willpower-of"; target: CharacterTarget }
  | { type: "lore-value-of"; target: CharacterTarget }
  | { type: "cost-of"; target: CardTarget }
  | { type: "cards-under-self" }
  | { type: "location-lore-from-character"; target: CharacterTarget }
  | {
      type: "classification-character-count";
      classification: string;
      controller: "you" | "opponent" | "opponents";
      excludeSelf?: boolean;
    }
  | {
      type: "name-character-count";
      name: string;
      controller: "you" | "opponent" | "opponents";
      excludeSelf?: boolean;
    }
  | { type: "locations-in-play"; controller: "you" | "opponent" | "opponents" }
  // Turn-metric based amounts (read from turn metadata counters)
  | {
      type: "turn-metric";
      metric: "banished-in-challenge-count";
      owner: "you" | "opponent";
      multiplier?: number;
    }
  // For-each based amounts
  | {
      type: "for-each";
      counter: ForEachCounterType | { type: string; controller?: string };
      count?: number | VariableAmount;
      modifier?: number;
    }
  // Additional variable amounts
  | { type: "count"; what?: string; controller?: string; of?: string }
  | { type: "VARIABLE" } // Generic variable amount
  | { type: "lore-lost" } // Amount of lore lost
  | { type: "stat"; stat?: string; target?: string }; // Stat value

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
  | "during-challenge"
  | "permanent"
  | "while-condition"
  | "next-play-this-turn" // Used with static abilities
  | "next-turn" // Until the start/end of their next turn
  | "their-next-turn" // Until the opponent's next turn
  | "while-in-play" // While the card is in play
  | { type: string }; // Allow object-based durations for flexibility
