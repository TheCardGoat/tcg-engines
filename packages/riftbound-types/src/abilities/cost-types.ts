/**
 * Riftbound Cost Type Definitions
 *
 * Types for defining costs that must be paid to play cards or activate abilities.
 * Riftbound uses two resource types: Energy (numeric) and Power (domain-based).
 */

import type { Target } from "../targeting";

// ============================================================================
// Domain Types
// ============================================================================

/**
 * The six domains in Riftbound, plus rainbow (universal)
 */
export type Domain =
  | "fury" // Red - aggressive, damage
  | "calm" // Green - growth, healing
  | "mind" // Blue - control, draw
  | "body" // Orange - strength, defense
  | "chaos" // Purple - unpredictable, discard
  | "order" // Yellow - structure, tokens
  | "rainbow"; // Universal - can pay any domain

// ============================================================================
// Cost Structure
// ============================================================================

/**
 * Complete cost structure for cards and abilities
 *
 * @example Energy only: { energy: 3 }
 * @example Energy + Power: { energy: 2, power: ["fury", "mind"] }
 * @example Exhaust: { exhaust: true }
 * @example Complex: { energy: 1, exhaust: true, discard: 1 }
 */
export interface Cost {
  /** Energy cost (numeric) */
  readonly energy?: number;

  /** Power cost (domain-based) - array allows multiple domains */
  readonly power?: Domain[];

  /** Requires exhausting the source */
  readonly exhaust?: boolean;

  /** Requires killing a target */
  readonly kill?: Target | "self";

  /** Requires discarding cards */
  readonly discard?: number;

  /** Requires recycling cards from trash */
  readonly recycle?: number | RecycleCost;

  /** Requires spending a buff */
  readonly spend?: "buff" | SpendCost;

  /** Requires returning something to hand */
  readonly returnToHand?: Target;
}

/**
 * Recycle cost with optional target specification
 */
export interface RecycleCost {
  readonly amount: number;
  readonly from?: "trash" | "board";
  readonly target?: Target;
}

/**
 * Spend cost for buffs or other resources
 */
export interface SpendCost {
  readonly type: "buff" | "rune";
  readonly amount?: number;
  readonly target?: Target;
}

// ============================================================================
// Additional Cost Types
// ============================================================================

/**
 * Additional cost that can be optionally paid
 *
 * @example Accelerate: { cost: { energy: 1, power: ["fury"] }, effect: "enter-ready" }
 */
export interface AdditionalCost {
  readonly cost: Cost;
  readonly optional?: boolean;
  readonly effect?: string;
}

/**
 * Cost modifier - reduces or increases costs
 */
export interface CostModifier {
  readonly type: "reduce" | "increase";
  readonly energy?: number;
  readonly power?: number;
  readonly minimum?: Cost;
  readonly condition?: string;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if cost has energy component
 */
export function hasEnergyCost(cost: Cost): boolean {
  return cost.energy !== undefined && cost.energy > 0;
}

/**
 * Check if cost has power component
 */
export function hasPowerCost(cost: Cost): boolean {
  return cost.power !== undefined && cost.power.length > 0;
}

/**
 * Check if cost requires exhausting
 */
export function requiresExhaust(cost: Cost): boolean {
  return cost.exhaust === true;
}

/**
 * Check if cost is empty (no cost)
 */
export function isFreeCost(cost: Cost): boolean {
  return (
    !(hasEnergyCost(cost) || hasPowerCost(cost) || requiresExhaust(cost)) &&
    cost.kill === undefined &&
    cost.discard === undefined &&
    cost.recycle === undefined &&
    cost.spend === undefined &&
    cost.returnToHand === undefined
  );
}

/**
 * Get total power cost count
 */
export function getPowerCostCount(cost: Cost): number {
  return cost.power?.length ?? 0;
}
