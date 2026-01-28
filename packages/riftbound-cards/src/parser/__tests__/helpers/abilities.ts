/**
 * Test helper builders for Riftbound abilities
 *
 * Provides fluent builders for creating ability objects in tests.
 * These match the types in @tcg/riftbound-types.
 */

import type {
  ActivatedAbility,
  AnyTarget,
  Condition,
  Cost,
  CostKeywordAbility,
  Effect,
  EffectKeywordAbility,
  KeywordAbility,
  ReplacementAbility,
  Restriction,
  SimpleKeyword,
  SimpleKeywordAbility,
  SpellAbility,
  StaticAbility,
  StaticEffect,
  Trigger,
  TriggeredAbility,
  ValueKeyword,
  ValueKeywordAbility,
} from "@tcg/riftbound-types";

/**
 * Ability builder helpers for tests
 */
export const Abilities = {
  /**
   * Create a simple keyword ability (no parameters)
   */
  simpleKeyword: (keyword: SimpleKeyword): SimpleKeywordAbility => ({
    type: "keyword",
    keyword,
  }),

  /**
   * Create a value keyword ability (Assault, Shield, Deflect)
   */
  valueKeyword: (
    keyword: ValueKeyword,
    value: number,
    condition?: Condition,
  ): ValueKeywordAbility =>
    condition
      ? { type: "keyword", keyword, value, condition }
      : { type: "keyword", keyword, value },

  /**
   * Create an Assault keyword ability
   */
  assault: (value = 1, condition?: Condition): ValueKeywordAbility =>
    Abilities.valueKeyword("Assault", value, condition),

  /**
   * Create a Shield keyword ability
   */
  shield: (value = 1, condition?: Condition): ValueKeywordAbility =>
    Abilities.valueKeyword("Shield", value, condition),

  /**
   * Create a Deflect keyword ability
   */
  deflect: (value = 1, condition?: Condition): ValueKeywordAbility =>
    Abilities.valueKeyword("Deflect", value, condition),

  /**
   * Create a cost keyword ability (Accelerate, Equip, Repeat)
   */
  costKeyword: (
    keyword: "Accelerate" | "Equip" | "Repeat",
    cost: Cost,
  ): CostKeywordAbility => ({
    type: "keyword",
    keyword,
    cost,
  }),

  /**
   * Create an Accelerate keyword ability
   */
  accelerate: (cost: Cost): CostKeywordAbility =>
    Abilities.costKeyword("Accelerate", cost),

  /**
   * Create an Equip keyword ability
   */
  equip: (cost: Cost): CostKeywordAbility =>
    Abilities.costKeyword("Equip", cost),

  /**
   * Create a Repeat keyword ability
   */
  repeat: (cost: Cost): CostKeywordAbility =>
    Abilities.costKeyword("Repeat", cost),

  /**
   * Create an effect keyword ability (Deathknell, Legion, Vision)
   */
  effectKeyword: (
    keyword: "Deathknell" | "Legion" | "Vision",
    effect: Effect,
    condition?: Condition,
  ): EffectKeywordAbility =>
    condition
      ? { type: "keyword", keyword, effect, condition }
      : { type: "keyword", keyword, effect },

  /**
   * Create a Deathknell keyword ability
   */
  deathknell: (effect: Effect, condition?: Condition): EffectKeywordAbility =>
    Abilities.effectKeyword("Deathknell", effect, condition),

  /**
   * Create a Legion keyword ability
   */
  legion: (effect: Effect, condition?: Condition): EffectKeywordAbility =>
    Abilities.effectKeyword("Legion", effect, condition),

  /**
   * Create a Vision keyword ability
   */
  vision: (effect: Effect): EffectKeywordAbility =>
    Abilities.effectKeyword("Vision", effect),

  /**
   * Create a Tank keyword ability
   */
  tank: (): SimpleKeywordAbility => Abilities.simpleKeyword("Tank"),

  /**
   * Create a Ganking keyword ability
   */
  ganking: (): SimpleKeywordAbility => Abilities.simpleKeyword("Ganking"),

  /**
   * Create a Hidden keyword ability
   */
  hidden: (): SimpleKeywordAbility => Abilities.simpleKeyword("Hidden"),

  /**
   * Create a Temporary keyword ability
   */
  temporary: (): SimpleKeywordAbility => Abilities.simpleKeyword("Temporary"),

  /**
   * Create a Unique keyword ability
   */
  unique: (): SimpleKeywordAbility => Abilities.simpleKeyword("Unique"),

  /**
   * Create a Weaponmaster keyword ability
   */
  weaponmaster: (): SimpleKeywordAbility =>
    Abilities.simpleKeyword("Weaponmaster"),

  /**
   * Create a Quick-Draw keyword ability
   */
  quickDraw: (): SimpleKeywordAbility => Abilities.simpleKeyword("Quick-Draw"),

  /**
   * Create a triggered ability
   */
  triggered: (opts: {
    trigger: Trigger;
    effect: Effect;
    name?: string;
    condition?: Condition;
    optional?: boolean;
  }): TriggeredAbility => ({
    type: "triggered",
    ...opts,
  }),

  /**
   * Create an activated ability
   */
  activated: (opts: {
    cost: Cost;
    effect: Effect;
    name?: string;
    timing?: "action" | "reaction";
    condition?: Condition;
    restrictions?: Restriction[];
  }): ActivatedAbility => ({
    type: "activated",
    ...opts,
  }),

  /**
   * Create a static ability
   */
  static: (opts: {
    effect: StaticEffect | Effect;
    name?: string;
    condition?: Condition;
  }): StaticAbility => ({
    type: "static",
    ...opts,
  }),

  /**
   * Create a spell ability
   */
  spell: (opts: {
    timing: "action" | "reaction";
    effect: Effect;
    additionalCost?: Cost;
    repeat?: Cost;
    condition?: Condition;
  }): SpellAbility => ({
    type: "spell",
    ...opts,
  }),

  /**
   * Create a replacement ability
   */
  replacement: (opts: {
    replaces: ReplacementAbility["replaces"];
    replacement: Effect | "prevent";
    name?: string;
    target?: AnyTarget;
    condition?: Condition;
    duration?: "turn" | "permanent" | "next";
  }): ReplacementAbility => ({
    type: "replacement",
    ...opts,
  }),
};
