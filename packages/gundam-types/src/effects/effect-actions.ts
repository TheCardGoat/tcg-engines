/**
 * Gundam Card Game Effect Action Types
 *
 * Discriminated union defining all possible actions an effect can perform.
 * The `type` field enables exhaustive type checking and type narrowing.
 *
 * All actions are serializable and contain only data (no functions).
 */

import type { CardId } from "@tcg/core";
import type { KeywordEffect } from "./keywords";
import type {
  CardFilter,
  TargetFilter,
  TargetingSpec,
  ZoneType,
} from "./targeting";

/**
 * Effect Action
 *
 * Discriminated union defining all possible actions an effect can perform.
 * The `type` field enables exhaustive type checking and type narrowing.
 *
 * All actions are serializable and contain only data (no functions).
 */
export type EffectAction =
  | DrawAction
  | DamageAction
  | RestAction
  | ActivateAction
  | MoveCardAction
  | SearchAction
  | ModifyStatsAction
  | GrantKeywordAction
  | DestroyAction
  | DiscardAction;

/**
 * Draw cards action
 *
 * Draws the specified number of cards from deck to hand.
 */
export interface DrawAction {
  readonly type: "DRAW";
  readonly count: number;
  readonly player: "self" | "opponent";
}

/**
 * Deal damage action
 *
 * Deals effect damage to a target. Damage is tracked with counters.
 * See Official Rules Section 5-5.
 */
export interface DamageAction {
  readonly type: "DAMAGE";
  readonly amount: number;
  readonly target: "unit" | "base" | "shield";
  readonly targetSelector?: TargetFilter;
  readonly damageType: "effect";
}

/**
 * Rest action
 *
 * Changes a card's orientation from active to rested.
 * See Official Rules Section 5-4.
 */
export interface RestAction {
  readonly type: "REST";
  readonly target: TargetingSpec;
}

/**
 * Activate action
 *
 * Changes a card's orientation from rested to active.
 */
export interface ActivateAction {
  readonly type: "ACTIVATE";
  readonly target: TargetingSpec;
}

/**
 * Move card action
 *
 * Moves a card from one zone to another.
 */
export interface MoveCardAction {
  readonly type: "MOVE_CARD";
  readonly from: ZoneType;
  readonly to: ZoneType;
  readonly target: TargetingSpec;
  readonly owner?: "self" | "opponent";
}

/**
 * Search deck action
 *
 * Searches a zone for cards matching a filter and moves them to a destination.
 */
export interface SearchAction {
  readonly type: "SEARCH";
  readonly sourceZone?: ZoneType;
  readonly destination: ZoneType;
  readonly count: number;
  readonly filter: CardFilter;
  readonly reveal: boolean;
  readonly shuffleAfter: boolean;
}

/**
 * Modify stats action
 *
 * Temporarily or permanently modifies a unit's AP and/or HP.
 * See Official Rules Section 11-5: Stat Modifiers.
 */
export interface ModifyStatsAction {
  readonly type: "MODIFY_STATS";
  readonly target: TargetingSpec;
  readonly apModifier?: number;
  readonly hpModifier?: number;
  readonly duration: "permanent" | "this_turn" | "end_of_combat";
}

/**
 * Grant keyword action
 *
 * Grants a keyword to a target for a specified duration.
 */
export interface GrantKeywordAction {
  readonly type: "GRANT_KEYWORD";
  readonly target: TargetingSpec;
  readonly keyword: KeywordEffect;
  readonly duration: "permanent" | "this_turn" | "while_condition";
  readonly condition?: string; // Condition reference for "while_condition"
}

/**
 * Destroy action
 *
 * Destroys a card, moving it to the trash.
 * See Official Rules Section 5-5-2.
 */
export interface DestroyAction {
  readonly type: "DESTROY";
  readonly target: TargetingSpec;
  readonly cannotBeDestroyed?: KeywordEffect[]; // Keywords that prevent destruction
}

/**
 * Discard action
 *
 * Discards cards from hand to trash.
 */
export interface DiscardAction {
  readonly type: "DISCARD";
  readonly count: number;
  readonly player: "self" | "opponent";
  readonly random?: boolean;
}
