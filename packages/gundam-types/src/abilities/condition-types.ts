/**
 * Condition Types for Gundam Effects
 *
 * Defines conditions that must be met for effects to activate or apply.
 * Used in:
 * - Triggered effects: "Whenever this character quests, IF you have..."
 * - Constant effects: "WHILE you have a character named..."
 * - Activated effects: "If an opponent has more lore than you..."
 * - Command effects: "you MAY draw a card"
 * - Substitution effects: "If an opponent has more lore than you..."
 *
 * @example "If you have a character named Elsa in play"
 * @example "While this character has no damage"
 * @example "If you have a character named Elsa in play"
 */

/**
 * Check if this unit is paired with an pilot
 */
export interface DuringPairCondition {
  type: "DURING_PAIR";
}

/**
 * Check if this unit is linked to a pilot
 */
export interface DuringLinkCondition {
  type: "DURING_LINK";
}

/**
 * Check if this unit has a specific amount of cost
 */
export interface CostCondition {
  type: "COST";
  amount: number;
}

export type Condition =
  | DuringPairCondition
  | DuringLinkCondition
  | CostCondition;
