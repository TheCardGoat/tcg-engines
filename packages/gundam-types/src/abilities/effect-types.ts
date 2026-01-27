/**
 * Core Effect Types for Gundam
 *
 * This file defines the top-level effect types that compose together
 * triggers, effects, costs, and conditions.
 *
 * Gundam has four main effect types:
 * - ** Constant Effects**: Effects that are always active
 * - ** Triggered Effects**: Effects activates automatically when some conditional event occurs during the game. Triggered effects include effects that specify timing, such as 【Deploy】, 【Attack】, 【Destroyed】, and 【When Paired】
 * - ** Activated Effects**: An activated effect can be freely activated by the player. These include 【Activate･Main】 and 【Activate･Action】 effects.
 * - ** Command Effects**: A command effect activates when it is played during the timing specified on a Command card, which can be either 【Main】, or 【Action】, or both.
 * - ** Substitution Effects**: When some event would occur, a substitution effect replaces the implementation of that event with another event. If an effect reads “(do) B instead of A,” the portion B that occurs due to that capability is a substitution effect.
 */

import type { Action } from "./action-types";
import type { Condition } from "./condition-types";
import type { Trigger } from "./trigger-types";

/**
 * Simple keyword types (no parameters)
 */
export type SimpleKeywordType =
  | "Support"
  | "Blocker"
  | "First-Strike"
  | "High-Maneuver"
  | "Suppression";

/**
 * Value-based keyword types (have numeric values, not conditional)
 */
export type ValueKeywordType = "Repair" | "Breach";

/**
 * Parameterized keyword types (have numeric values, optionally conditional)
 */
export type ParameterizedKeywordType = "Challenger" | "Resist";

/**
 * All keyword types
 */
export type KeywordType =
  | SimpleKeywordType
  | ValueKeywordType
  | ParameterizedKeywordType;

/**
 * Simple keyword effect - keywords with no parameters
 *
 * @example Support, Blocker, First-Strike, High-Maneuver, Suppression
 * ```typescript
 * { type: "keyword", keyword: "Support" }
 * ```
 */
export interface SimpleKeywordEffect {
  type: "keyword";
  keyword: SimpleKeywordType;
}

/**
 * Parameterized keyword effect - keywords with numeric value and optional condition
 */
export interface ParameterizedKeywordEffect {
  type: "keyword";
  keyword: ParameterizedKeywordType;
  /** The bonus value - REQUIRED */
  value: number;
  /** Optional condition for when this bonus applies */
  condition?: Condition;
}

/**
 * Value-based keyword effect - keywords with required numeric value
 *
 * Used for Repair and Breach.
 *
 * @example Repair 5
 * ```typescript
 * { type: "keyword", keyword: "Repair", value: 5 }
 * ```
 */
export interface ValueKeywordEffect {
  type: "keyword";
  keyword: ValueKeywordType;
  /** The value - REQUIRED */
  value: number;
}

/**
 * Union type for all keyword effect variants
 *
 * Uses discriminated unions to ensure type safety:
 * - Simple keywords have no additional fields
 * - Parameterized keywords require `value`, allow `condition`
 * - Value keywords require `value`
 */
export type KeywordEffect =
  | SimpleKeywordEffect
  | ParameterizedKeywordEffect
  | ValueKeywordEffect;

/**
 * Triggered effect - fires automatically when conditions are met
 */
export interface TriggeredEffect {
  type: "triggered";
  /** The trigger that causes this effect to fire */
  trigger: Trigger;
  /** The condition for when the trigger fires */
  condition: Condition;
  /** What happens when the effect resolves */
  action: Action;
}
