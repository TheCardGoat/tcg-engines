/**
 * Legacy Effect Types (Transitional)
 *
 * These types are provided for backward compatibility during the migration
 * from the old effect shape to the new Effect type.
 *
 * TODO: Remove this file once all card definitions are migrated to the new Effect shape.
 *
 * FIELD MAPPING FOR MIGRATION:
 * - `type` → `category`
 * - `description` → `text`
 * - `action` → `actions: [action]` (convert LegacyAction to EffectAction)
 * - Remove `restrictions`, `costs`, `conditions`
 * - Add `targeting` where applicable (convert TargetQuery to TargetingSpec)
 */

import type { TargetQuery } from "../targeting/gundam-target-dsl";

/**
 * Legacy Action Type
 *
 * Internal parser representation of actions before conversion to EffectAction.
 * Named with "Legacy" prefix to avoid conflicts with new EffectAction types.
 */
export type LegacyAction =
  | LegacyDrawAction
  | LegacyHealAction
  | LegacyDamageAction
  | LegacyRestAction
  | LegacyStandAction
  | LegacyDeployAction
  | LegacyAddToHandAction
  | LegacyModifyStatsAction
  | LegacyGainKeywordsAction
  | LegacyDiscardAction
  | LegacySearchAction
  | LegacyConditionalAction
  | LegacySequenceAction
  | LegacyCustomAction;

/** Re-export as Action for backward compatibility */
export type Action = LegacyAction;

export interface LegacyDrawAction {
  readonly type: "DRAW";
  readonly value: number;
}

export interface LegacyHealAction {
  readonly type: "HEAL";
  readonly amount: number;
  readonly target?: TargetQuery | TargetQuery[];
}

export interface LegacyDamageAction {
  readonly type: "DAMAGE";
  readonly value: number;
  readonly target?: TargetQuery | TargetQuery[];
}

export interface LegacyRestAction {
  readonly type: "REST";
  readonly target?: TargetQuery | TargetQuery[];
}

export interface LegacyStandAction {
  readonly type: "STAND";
  readonly target?: TargetQuery | TargetQuery[];
}

export interface LegacyDeployAction {
  readonly type: "DEPLOY";
  readonly target?: TargetQuery | TargetQuery[];
}

export interface LegacyAddToHandAction {
  readonly type: "ADD_TO_HAND";
  readonly target?: TargetQuery | TargetQuery[];
}

export interface LegacyModifyStatsAction {
  readonly type: "MODIFY_STATS";
  readonly attribute: "AP" | "HP";
  readonly value: number;
  readonly duration: "TURN" | "PERMANENT" | "END_OF_COMBAT";
  readonly target?: TargetQuery | TargetQuery[];
}

export interface LegacyGainKeywordsAction {
  readonly type: "GAIN_KEYWORDS";
  readonly keywords: string[];
  readonly duration: "TURN" | "PERMANENT";
  readonly target?: TargetQuery | TargetQuery[];
}

export interface LegacyDiscardAction {
  readonly type: "DISCARD";
  readonly value: number;
}

export interface LegacySearchAction {
  readonly type: "SEARCH";
  readonly destination: string;
  readonly count: number;
}

export interface LegacyConditionalAction {
  readonly type: "CONDITIONAL";
  readonly conditions: EffectCondition[];
  readonly trueAction: LegacyAction;
}

export interface LegacySequenceAction {
  readonly type: "SEQUENCE";
  readonly actions: LegacyAction[];
}

export interface LegacyCustomAction {
  readonly type: "CUSTOM";
  readonly text: string;
}

/**
 * Legacy Effect Condition
 */
export interface EffectCondition {
  readonly type: string;
  readonly text?: string;
}

/**
 * Legacy Effect Cost
 */
export interface EffectCost {
  readonly type: string;
  readonly amount?: number;
}

/**
 * Legacy Effect Restriction
 */
export interface EffectRestriction {
  readonly type: string;
  readonly value?: number;
}

/**
 * Legacy Base Effect
 *
 * The old effect shape that included restrictions, costs, conditions, and action.
 *
 * Migration path:
 * - `type` → `category`
 * - `description` → `text`
 * - `action` → `actions: [action]`
 * - Remove `restrictions`, `costs`, `conditions`
 * - Add `targeting` where applicable
 */
export interface BaseEffect {
  readonly id: string;
  readonly type: "ACTIVATED" | "TRIGGERED" | "CONSTANT" | "KEYWORD" | "COMMAND";
  readonly timing?: string;
  readonly description: string;
  readonly restrictions: EffectRestriction[];
  readonly costs?: EffectCost[];
  readonly conditions?: EffectCondition[];
  readonly action: LegacyAction;
}

/**
 * Legacy Activated Effect
 */
export interface LegacyActivatedEffect extends BaseEffect {
  readonly type: "ACTIVATED";
  readonly timing: "MAIN" | "ACTION";
}

/**
 * Legacy Triggered Effect
 */
export interface LegacyTriggeredEffect extends BaseEffect {
  readonly type: "TRIGGERED";
  readonly timing:
    | "DEPLOY"
    | "ATTACK"
    | "DESTROYED"
    | "BURST"
    | "WHEN_PAIRED"
    | "WHEN_LINKED"
    | "START_OF_TURN"
    | "END_OF_TURN";
}

/**
 * Legacy Constant Effect
 */
export interface LegacyConstantEffect extends BaseEffect {
  readonly type: "CONSTANT";
}
