/**
 * Targeting System Types
 *
 * Defines how targets are selected for an effect.
 * See Official Rules Section 11-4: Targeting and Selection.
 */

/**
 * Targeting Specification
 *
 * Defines how targets are selected for an effect.
 */
export interface TargetingSpec {
  readonly count: number | TargetCountRange;
  readonly validTargets: TargetFilter[];
  readonly chooser: "controller" | "opponent";
  readonly timing: "on_declaration" | "on_resolution";
}

/**
 * Target count range
 *
 * Defines minimum and maximum number of targets to select.
 */
export interface TargetCountRange {
  readonly min: number;
  readonly max: number;
}

/**
 * Target Filter
 *
 * Defines criteria for selecting valid targets.
 * Multiple filters are combined with AND logic.
 */
export interface TargetFilter {
  readonly type: "unit" | "base" | "shield" | "card";
  readonly zone?: ZoneType;
  readonly owner: "self" | "opponent" | "any";
  readonly state?: TargetStateFilter;
  readonly properties?: TargetPropertyFilter;
}

/**
 * Target state filter
 *
 * Filters targets based on their current state.
 */
export interface TargetStateFilter {
  readonly rested?: boolean;
  readonly damaged?: boolean;
  readonly hasDamageAtLeast?: number;
}

/**
 * Target property filter
 *
 * Filters targets based on their card properties.
 */
export interface TargetPropertyFilter {
  readonly cardType?: CardType;
  readonly color?: Color;
  readonly trait?: string[];
  readonly cost?: CostFilter;
  readonly level?: LevelFilter;
}

/**
 * Card type filter
 */
export type CardType = "UNIT" | "PILOT" | "COMMAND" | "BASE";

/**
 * Color filter
 */
export type Color = "Red" | "Blue" | "Green" | "Black" | "White" | "Yellow";

/**
 * Cost filter
 */
export interface CostFilter {
  readonly min?: number;
  readonly max?: number;
  readonly exactly?: number;
}

/**
 * Level filter
 */
export interface LevelFilter {
  readonly min?: number;
  readonly max?: number;
  readonly exactly?: number;
}

// ============================================================================
// IMPORTS FOR TYPE REFERENCES
// ============================================================================

import type { ZoneType } from "./zone-types";
