/**
 * Riftbound Condition Type Definitions
 *
 * Types for defining conditions that must be met for abilities to trigger or resolve.
 * Conditions are used in:
 * - Triggered abilities (additional conditions beyond the trigger)
 * - Static abilities (when the effect applies)
 * - Conditional keywords (when the keyword is active)
 */

import type { Comparison, Target } from "../targeting";
import type { Cost } from "./cost-types";

// ============================================================================
// State Conditions
// ============================================================================

/**
 * While this card is Mighty (5+ Might)
 */
export interface WhileMightyCondition {
  readonly type: "while-mighty";
  readonly target?: "self" | Target;
}

/**
 * While this card is buffed
 */
export interface WhileBuffedCondition {
  readonly type: "while-buffed";
  readonly target?: "self" | Target;
}

/**
 * While this card is at a battlefield
 */
export interface WhileAtBattlefieldCondition {
  readonly type: "while-at-battlefield";
  readonly target?: "self" | Target;
}

/**
 * While this card is alone (only unit at location)
 */
export interface WhileAloneCondition {
  readonly type: "while-alone";
  readonly target?: "self" | Target;
}

/**
 * While this card is damaged
 */
export interface WhileDamagedCondition {
  readonly type: "while-damaged";
  readonly target?: "self" | Target;
}

/**
 * While this card is ready
 */
export interface WhileReadyCondition {
  readonly type: "while-ready";
  readonly target?: "self" | Target;
}

/**
 * While this card is exhausted
 */
export interface WhileExhaustedCondition {
  readonly type: "while-exhausted";
  readonly target?: "self" | Target;
}

/**
 * While this card is equipped
 */
export interface WhileEquippedCondition {
  readonly type: "while-equipped";
  readonly target?: "self" | Target;
}

// ============================================================================
// Turn Conditions
// ============================================================================

/**
 * If something happened this turn
 */
export interface ThisTurnCondition {
  readonly type: "this-turn";
  readonly event:
    | "discarded"
    | "played-card"
    | "played-unit"
    | "played-spell"
    | "attacked"
    | "conquered"
    | "scored"
    | "spent-power";
  readonly count?: Comparison;
}

/**
 * Legion condition - if you've played another card this turn
 */
export interface LegionCondition {
  readonly type: "legion";
}

/**
 * First time this turn
 */
export interface FirstTimeCondition {
  readonly type: "first-time";
  readonly event: string;
}

// ============================================================================
// Count Conditions
// ============================================================================

/**
 * Count-based condition
 */
export interface CountCondition {
  readonly type: "count";
  readonly target: Target;
  readonly comparison: Comparison;
}

/**
 * Has at least N of something
 */
export interface HasAtLeastCondition {
  readonly type: "has-at-least";
  readonly count: number;
  readonly target: Target;
}

/**
 * Has exactly N of something
 */
export interface HasExactlyCondition {
  readonly type: "has-exactly";
  readonly count: number;
  readonly target: Target;
}

// ============================================================================
// Cost Conditions
// ============================================================================

/**
 * Pay a cost as part of the condition
 */
export interface PayCostCondition {
  readonly type: "pay-cost";
  readonly cost: Cost;
}

/**
 * If the additional cost was paid
 */
export interface PaidAdditionalCostCondition {
  readonly type: "paid-additional-cost";
}

/**
 * If you spent at least X power this turn
 */
export interface SpentPowerCondition {
  readonly type: "spent-power";
  readonly amount: number;
  readonly domain?: string;
}

// ============================================================================
// Score Conditions
// ============================================================================

/**
 * Score is within X points of victory
 */
export interface ScoreWithinCondition {
  readonly type: "score-within";
  readonly points: number;
  readonly whose?: "your" | "opponent" | "any";
}

/**
 * Score comparison
 */
export interface ScoreCondition {
  readonly type: "score";
  readonly comparison: Comparison;
  readonly whose?: "your" | "opponent";
}

// ============================================================================
// Combat Conditions
// ============================================================================

/**
 * While in combat
 */
export interface InCombatCondition {
  readonly type: "in-combat";
}

/**
 * While attacking
 */
export interface AttackingCondition {
  readonly type: "attacking";
  readonly target?: "self" | Target;
}

/**
 * While defending
 */
export interface DefendingCondition {
  readonly type: "defending";
  readonly target?: "self" | Target;
}

/**
 * Attacking or defending alone
 */
export interface AloneInCombatCondition {
  readonly type: "alone-in-combat";
  readonly role?: "attacking" | "defending" | "either";
}

// ============================================================================
// Control Conditions
// ============================================================================

/**
 * If you control something
 */
export interface ControlCondition {
  readonly type: "control";
  readonly target: Target;
}

/**
 * If opponent controls something
 */
export interface OpponentControlsCondition {
  readonly type: "opponent-controls";
  readonly target: Target;
}

// ============================================================================
// Location Conditions
// ============================================================================

/**
 * If at a specific location
 */
export interface AtLocationCondition {
  readonly type: "at-location";
  readonly location:
    | "base"
    | "battlefield"
    | "controlled-battlefield"
    | "enemy-battlefield";
}

/**
 * If controlling a battlefield
 */
export interface ControlBattlefieldCondition {
  readonly type: "control-battlefield";
  readonly count?: Comparison;
}

// ============================================================================
// Logical Conditions
// ============================================================================

/**
 * Logical AND condition - all sub-conditions must be true
 */
export interface AndCondition {
  readonly type: "and";
  readonly conditions: Condition[];
}

/**
 * Logical OR condition - at least one sub-condition must be true
 */
export interface OrCondition {
  readonly type: "or";
  readonly conditions: Condition[];
}

/**
 * Logical NOT condition - inverts the sub-condition
 */
export interface NotCondition {
  readonly type: "not";
  readonly condition: Condition;
}

/**
 * If condition - conditional effect
 */
export interface IfCondition {
  readonly type: "if";
  readonly condition: Condition;
  readonly then?: unknown; // Effect to apply if true
  readonly else?: unknown; // Effect to apply if false
}

// ============================================================================
// Union Type
// ============================================================================

/**
 * All condition types
 */
export type Condition =
  // State conditions
  | WhileMightyCondition
  | WhileBuffedCondition
  | WhileAtBattlefieldCondition
  | WhileAloneCondition
  | WhileDamagedCondition
  | WhileReadyCondition
  | WhileExhaustedCondition
  | WhileEquippedCondition

  // Turn conditions
  | ThisTurnCondition
  | LegionCondition
  | FirstTimeCondition

  // Count conditions
  | CountCondition
  | HasAtLeastCondition
  | HasExactlyCondition

  // Cost conditions
  | PayCostCondition
  | PaidAdditionalCostCondition
  | SpentPowerCondition

  // Score conditions
  | ScoreWithinCondition
  | ScoreCondition

  // Combat conditions
  | InCombatCondition
  | AttackingCondition
  | DefendingCondition
  | AloneInCombatCondition

  // Control conditions
  | ControlCondition
  | OpponentControlsCondition

  // Location conditions
  | AtLocationCondition
  | ControlBattlefieldCondition

  // Logical conditions
  | AndCondition
  | OrCondition
  | NotCondition
  | IfCondition;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if condition is a state condition
 */
export function isStateCondition(
  condition: Condition,
): condition is
  | WhileMightyCondition
  | WhileBuffedCondition
  | WhileAtBattlefieldCondition
  | WhileAloneCondition
  | WhileDamagedCondition
  | WhileReadyCondition
  | WhileExhaustedCondition
  | WhileEquippedCondition {
  return condition.type.startsWith("while-");
}

/**
 * Check if condition is a logical condition
 */
export function isLogicalCondition(
  condition: Condition,
): condition is AndCondition | OrCondition | NotCondition {
  return (
    condition.type === "and" ||
    condition.type === "or" ||
    condition.type === "not"
  );
}

/**
 * Check if condition is AND
 */
export function isAndCondition(
  condition: Condition,
): condition is AndCondition {
  return condition.type === "and";
}

/**
 * Check if condition is OR
 */
export function isOrCondition(condition: Condition): condition is OrCondition {
  return condition.type === "or";
}

/**
 * Check if condition is NOT
 */
export function isNotCondition(
  condition: Condition,
): condition is NotCondition {
  return condition.type === "not";
}

/**
 * Check if condition is combat-related
 */
export function isCombatCondition(
  condition: Condition,
): condition is
  | InCombatCondition
  | AttackingCondition
  | DefendingCondition
  | AloneInCombatCondition {
  return (
    condition.type === "in-combat" ||
    condition.type === "attacking" ||
    condition.type === "defending" ||
    condition.type === "alone-in-combat"
  );
}

// ============================================================================
// Builder Functions
// ============================================================================

/**
 * Create a "while mighty" condition
 */
export function whileMighty(target?: "self" | Target): WhileMightyCondition {
  return target ? { type: "while-mighty", target } : { type: "while-mighty" };
}

/**
 * Create a "while buffed" condition
 */
export function whileBuffed(target?: "self" | Target): WhileBuffedCondition {
  return target ? { type: "while-buffed", target } : { type: "while-buffed" };
}

/**
 * Create a "while at battlefield" condition
 */
export function whileAtBattlefield(
  target?: "self" | Target,
): WhileAtBattlefieldCondition {
  return target
    ? { type: "while-at-battlefield", target }
    : { type: "while-at-battlefield" };
}

/**
 * Create a "legion" condition
 */
export function legion(): LegionCondition {
  return { type: "legion" };
}

/**
 * Create a "pay cost" condition
 */
export function payCost(cost: Cost): PayCostCondition {
  return { type: "pay-cost", cost };
}

/**
 * Create an AND condition
 */
export function and(...conditions: Condition[]): AndCondition {
  return { type: "and", conditions };
}

/**
 * Create an OR condition
 */
export function or(...conditions: Condition[]): OrCondition {
  return { type: "or", conditions };
}

/**
 * Create a NOT condition
 */
export function not(condition: Condition): NotCondition {
  return { type: "not", condition };
}
