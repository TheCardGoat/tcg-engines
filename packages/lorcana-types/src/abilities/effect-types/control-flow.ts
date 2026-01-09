/**
 * Control Flow Effect Types
 *
 * Effects that control the flow of ability resolution:
 * - Sequence (do A then B)
 * - Choice (choose one of A or B)
 * - Conditional (if X then A else B)
 * - Optional (you may do A)
 * - For-each (for each X, do A)
 * - Repeat (do A X times)
 */

import type { Condition } from "../condition-types";
import type { PlayerTarget } from "../target-types";
import type { Amount } from "./amount-types";

// Forward reference - will be imported from combined-types at runtime
// This avoids circular dependency during type checking
import type { Effect } from "./combined-types";

// ============================================================================
// Control Flow Effects
// ============================================================================

/**
 * Sequence of effects (executed in order)
 *
 * @example "Draw 2 cards, then choose and discard a card"
 */
export interface SequenceEffect {
  type: "sequence";
  steps: Effect[];
}

/**
 * Choose one of multiple effects
 *
 * @example "Choose one: Draw a card. Deal 2 damage to chosen character."
 */
export interface ChoiceEffect {
  type: "choice";
  options: Effect[];
  /** Who makes the choice */
  chooser?: PlayerTarget;
  /** Label/name for each option (for display) */
  optionLabels?: string[];
}

/**
 * Conditional effect (if/then/else)
 *
 * @example "If you have a character named Elsa, draw a card"
 */
export interface ConditionalEffect {
  type: "conditional";
  condition: Condition;
  then: Effect;
  else?: Effect;
}

/**
 * Optional effect ("you may")
 *
 * @example "You may draw a card"
 */
export interface OptionalEffect {
  type: "optional";
  effect: Effect;
  /** Who decides */
  chooser?: PlayerTarget;
}

/**
 * For-each effect (repeat for each X)
 *
 * @example "Gain 1 lore for each character you have in play"
 */
export interface ForEachEffect {
  type: "for-each";
  counter: ForEachCounter;
  effect: Effect;
  /** Maximum times to repeat (optional) */
  maximum?: number;
}

/**
 * What to count for for-each effects
 */
export type ForEachCounter =
  | { type: "characters"; controller: "you" | "opponent" | "any" }
  | { type: "damaged-characters"; controller: "you" | "opponent" | "any" }
  | { type: "items"; controller: "you" | "opponent" }
  | { type: "locations"; controller: "you" | "opponent" }
  | { type: "cards-in-hand"; controller: "you" | "opponent" }
  | { type: "cards-in-discard"; controller: "you" | "opponent" }
  | { type: "damage-on-self" }
  | { type: "damage-on-target" }
  | { type: "cards-under-self" }
  | { type: "characters-that-sang"; thisTurn: boolean };

/**
 * Repeat effect X times
 */
export interface RepeatEffect {
  type: "repeat";
  times: Amount;
  effect: Effect;
}
