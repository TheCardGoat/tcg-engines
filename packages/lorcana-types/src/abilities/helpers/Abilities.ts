/**
 * Ability Helpers for Lorcana Abilities
 *
 * Provides a fluent API for building ability definitions.
 * These helpers make it easy to construct all ability types.
 *
 * @example
 * ```typescript
 * const ability = Abilities.Keyword("Rush");
 * const ability = Abilities.Triggered({
 *   trigger: Triggers.WhenYouPlay(),
 *   effect: Effects.Draw({ amount: 2 })
 * });
 * const ability = Abilities.Action(Effects.Draw({ amount: 2 }));
 * ```
 */

import type {
  ActionAbility,
  ActivatedAbility,
  KeywordAbility,
  ParameterizedKeywordType,
  ShiftKeywordAbility,
  SimpleKeywordType,
  StaticAbility,
  TriggeredAbility,
  ValueKeywordType,
} from "../ability-types";
import type { Effect, StaticEffect } from "../effect-types";
import type { AbilityCost, Condition } from "../index";
import type { Trigger } from "../trigger-types";

export const Abilities = {
  /**
   * Simple keyword ability (no parameters)
   *
   * @example Abilities.Keyword("Rush")
   * @example Abilities.Keyword("Ward")
   */
  Keyword: (keyword: SimpleKeywordType): KeywordAbility => ({
    keyword,
    type: "keyword",
  }),

  /**
   * Value-based keyword ability (Singer, SingTogether, Boost)
   *
   * @example Abilities.Keyword("Singer", { value: 5 })
   */
  KeywordWithValue: (keyword: ValueKeywordType, params: { value: number }): KeywordAbility => ({
    keyword,
    type: "keyword",
    value: params.value,
  }),

  /**
   * Parameterized keyword ability (Challenger, Resist)
   *
   * @example Abilities.Keyword("Challenger", { value: 3 })
   * @example Abilities.Keyword("Resist", { value: 2, condition: Conditions.WhileDamaged() })
   */
  KeywordParameterized: (
    keyword: ParameterizedKeywordType,
    params: { value: number; condition?: Condition },
  ): KeywordAbility => ({
    keyword,
    type: "keyword",
    value: params.value,
    ...(params.condition && { condition: params.condition }),
  }),

  /**
   * Shift keyword ability
   *
   * @example Abilities.Shift({ cost: { ink: 5 } })
   * @example Abilities.Shift({ cost: { ink: 3 }, shiftTarget: "Elsa" })
   */
  Shift: (params: { cost: AbilityCost; shiftTarget?: string }): ShiftKeywordAbility => ({
    cost: params.cost,
    keyword: "Shift",
    type: "keyword",
    ...(params.shiftTarget && { shiftTarget: params.shiftTarget }),
  }),

  /**
   * Triggered ability - fires when conditions are met
   *
   * @example
   * ```typescript
   * Abilities.Triggered({
   *   trigger: Triggers.WhenYouPlay(),
   *   effect: Effects.Draw({ amount: 2 })
   * })
   * ```
   */
  Triggered: (params: {
    name?: string;
    trigger: Trigger;
    effect: Effect;
    condition?: Condition;
  }): TriggeredAbility => ({
    type: "triggered",
    ...(params.name && { name: params.name }),
    trigger: params.trigger,
    effect: params.effect,
    ...(params.condition && { condition: params.condition }),
  }),

  /**
   * Activated ability - player chooses to use by paying cost
   *
   * @example
   * ```typescript
   * Abilities.Activated({
   *   cost: Costs.Ink(2),
   *   effect: Effects.Draw({ amount: 1 })
   * })
   * ```
   */
  Activated: (params: {
    name?: string;
    cost: AbilityCost;
    effect: Effect;
    condition?: Condition;
  }): ActivatedAbility => ({
    type: "activated",
    ...(params.name && { name: params.name }),
    cost: params.cost,
    effect: params.effect,
    ...(params.condition && { condition: params.condition }),
  }),

  /**
   * Static ability - always active effect
   *
   * @example
   * ```typescript
   * Abilities.Static({
   *   effect: Effects.GainKeyword({ keyword: "Ward" })
   * })
   * ```
   */
  Static: (params: {
    name?: string;
    effect: StaticEffect;
    condition?: Condition;
  }): StaticAbility => ({
    type: "static",
    ...(params.name && { name: params.name }),
    effect: params.effect,
    ...(params.condition && { condition: params.condition }),
  }),

  /**
   * Action ability - standalone effect on action cards
   *
   * @example
   * ```typescript
   * Abilities.Action(Effects.Draw({ amount: 2 }))
   * ```
   */
  Action: (effect: Effect): ActionAbility => ({
    effect,
    type: "action",
  }),
};
