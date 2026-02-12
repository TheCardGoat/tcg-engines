/**
 * Gundam Card Game Effect Definition Types
 *
 * Defines the complete effect system including categories, timing, actions,
 * and targeting requirements.
 *
 * Based on Gundam Card Game Official Rules:
 * - Section 11-1: Card Effects Overview
 * - Section 11-2: Effect Categories (Keyword, Triggered, Activated, Command, Constant)
 */

// Re-export EffectAction and EffectTiming for use in card definitions
export type { EffectAction } from "./effect-actions";
export type { EffectTiming } from "./effect-timing";

import type { EffectAction } from "./effect-actions";
import type {
  ActionTiming,
  AttackTiming,
  BurstTiming,
  DeployTiming,
  DestroyedTiming,
  EffectTiming,
  EndOfTurnTiming,
  MainTiming,
  StartOfTurnTiming,
} from "./effect-timing";
import type { TargetingSpec } from "./targeting";

/**
 * Effect Categories
 *
 * Classification of effects based on how they are activated and controlled.
 * See Official Rules Section 11-2.
 *
 * - **keyword**: Passive abilities defined by game rules (Repair, Breach, Support, etc.)
 * - **triggered**: Effects that automatically activate when a specific condition occurs
 * - **activated**: Effects that a player chooses to activate, usually with a cost
 * - **command**: Effects from Command cards that resolve when played
 * - **constant**: Continuous effects that are always active while the card is in play
 */
export type EffectCategory = "keyword" | "triggered" | "activated" | "command" | "constant";

/**
 * Effect Definition
 *
 * Complete definition of a card's effect including category, timing,
 * actions, and targeting requirements.
 *
 * This is the schema-level definition that appears on card definitions.
 */
export interface Effect {
  /** Unique identifier for this effect */
  readonly id: string;

  /** Effect category classification */
  readonly category: EffectCategory;

  /** When this effect can activate or resolve */
  readonly timing: EffectTiming;

  /** Actions performed by this effect */
  readonly actions: EffectAction[];

  /** Targeting requirements (if applicable) */
  readonly targeting?: TargetingSpec;

  /** Display text shown on the card */
  readonly text: string;
}

// ============================================================================
// EFFECT NARROWING TYPES
// ============================================================================

/**
 * Activated Effect
 *
 * Narrowing type for effects with category "activated".
 * Activated effects are effects that a player chooses to activate, usually with a cost.
 */
export type ActivatedEffect = Effect & {
  readonly category: "activated";
  readonly timing: MainTiming | ActionTiming;
};

/**
 * Triggered Effect
 *
 * Narrowing type for effects with category "triggered".
 * Triggered effects automatically activate when a specific condition occurs.
 */
export type TriggeredEffect = Effect & {
  readonly category: "triggered";
  readonly timing:
    | DeployTiming
    | AttackTiming
    | DestroyedTiming
    | BurstTiming
    | StartOfTurnTiming
    | EndOfTurnTiming;
};

/**
 * Constant Effect
 *
 * Narrowing type for effects with category "constant".
 * Constant effects are continuous effects that are always active while the card is in play.
 */
export type ConstantEffect = Effect & {
  readonly category: "constant";
};
