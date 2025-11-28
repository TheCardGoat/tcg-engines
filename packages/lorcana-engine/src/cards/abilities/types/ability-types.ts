/**
 * Core Ability Types for Lorcana
 *
 * This file defines the top-level ability types that compose together
 * triggers, effects, costs, and conditions.
 *
 * Lorcana has four main ability types:
 * - **Keyword**: Simple abilities like Rush, Ward, Challenger +X
 * - **Triggered**: Abilities that fire when events occur (When/Whenever/At)
 * - **Activated**: Abilities with costs that players choose to use ({E} - ...)
 * - **Static**: Abilities that are always active (While/Your characters gain...)
 *
 * @example Keyword ability
 * ```typescript
 * { type: "keyword", keyword: "Rush" }
 * { type: "keyword", keyword: "Challenger", value: 3 }
 * ```
 *
 * @example Triggered ability
 * ```typescript
 * {
 *   type: "triggered",
 *   trigger: { event: "PLAY_SELF", timing: "when" },
 *   effect: { type: "draw", amount: 2, target: "CONTROLLER" }
 * }
 * ```
 */

import type { Condition } from "./condition-types";
import type { AbilityCost } from "./cost-types";
import type { Effect, StaticEffect } from "./effect-types";
import type { CharacterTarget } from "./target-types";
import type { Trigger } from "./trigger-types";

// ============================================================================
// Keyword Abilities
// ============================================================================

/**
 * Simple keyword types (no parameters)
 */
export type SimpleKeywordType =
  | "Rush"
  | "Ward"
  | "Evasive"
  | "Bodyguard"
  | "Support"
  | "Reckless"
  | "Vanish"
  | "Alert";

/**
 * Parameterized keyword types (have numeric values, optionally conditional)
 */
export type ParameterizedKeywordType = "Challenger" | "Resist";

/**
 * Value-based keyword types (have numeric values, not conditional)
 */
export type ValueKeywordType = "Singer" | "SingTogether" | "Boost";

/**
 * All keyword types
 */
export type KeywordType =
  | SimpleKeywordType
  | ParameterizedKeywordType
  | ValueKeywordType
  | "Shift";

// ============================================================================
// Keyword Ability Variants (Strict Discriminated Unions)
// ============================================================================

/**
 * Simple keyword ability - keywords with no parameters
 *
 * @example Rush, Ward, Evasive, Bodyguard, Support, Reckless, Vanish, Alert
 * ```typescript
 * { type: "keyword", keyword: "Rush" }
 * ```
 */
export interface SimpleKeywordAbility {
  type: "keyword";
  keyword: SimpleKeywordType;
}

/**
 * Parameterized keyword ability - keywords with numeric value and optional condition
 *
 * Used for Challenger +X and Resist +X. Supports conditions for contextual bonuses
 * like "Resist +2 while challenging" or "Challenger +3 while you have a Princess".
 *
 * @example Challenger +3
 * ```typescript
 * { type: "keyword", keyword: "Challenger", value: 3 }
 * ```
 *
 * @example Resist +2 while challenging
 * ```typescript
 * {
 *   type: "keyword",
 *   keyword: "Resist",
 *   value: 2,
 *   condition: { type: "in-challenge" }
 * }
 * ```
 */
export interface ParameterizedKeywordAbility {
  type: "keyword";
  keyword: ParameterizedKeywordType;
  /** The bonus value - REQUIRED */
  value: number;
  /**
   * Optional condition for when this bonus applies
   * e.g., "while challenging", "while you have a Princess"
   */
  condition?: Condition;
}

/**
 * Value-based keyword ability - keywords with required numeric value
 *
 * Used for Singer, SingTogether, and Boost.
 *
 * @example Singer 5
 * ```typescript
 * { type: "keyword", keyword: "Singer", value: 5 }
 * ```
 */
export interface ValueKeywordAbility {
  type: "keyword";
  keyword: ValueKeywordType;
  /** The value - REQUIRED */
  value: number;
}

/**
 * Shift keyword ability - uses generic AbilityCost for flexibility
 *
 * The cost field reuses AbilityCost, allowing for:
 * - Standard ink cost: { ink: 5 }
 * - Specific ink type (future): { ink: 5, inkType: "Amber" }
 * - Complex costs (future): { ink: 3, exert: true }
 *
 * @example Shift 5 (onto Elsa)
 * ```typescript
 * {
 *   type: "keyword",
 *   keyword: "Shift",
 *   cost: { ink: 5 },
 *   shiftTarget: "Elsa"
 * }
 * ```
 *
 * @example Shift 3 (onto any valid target)
 * ```typescript
 * { type: "keyword", keyword: "Shift", cost: { ink: 3 } }
 * ```
 */
export interface ShiftKeywordAbility {
  type: "keyword";
  keyword: "Shift";
  /** The cost to use Shift - REQUIRED, uses generic AbilityCost */
  cost: AbilityCost;
  /**
   * Target character name that this can shift onto
   * If not specified, can shift onto any character with matching name
   */
  shiftTarget?: string;
}

/**
 * Union type for all keyword ability variants
 *
 * Uses discriminated unions to ensure type safety:
 * - Simple keywords have no additional fields
 * - Parameterized keywords require `value`, allow `condition`
 * - Value keywords require `value`
 * - Shift requires `cost`, allows `shiftTarget`
 */
export type KeywordAbility =
  | SimpleKeywordAbility
  | ParameterizedKeywordAbility
  | ValueKeywordAbility
  | ShiftKeywordAbility;

/**
 * @deprecated Use KeywordType instead
 */
export type ComplexKeywordType = "Shift" | "Singer" | "SingTogether" | "Boost";

// ============================================================================
// Triggered Abilities
// ============================================================================

/**
 * Triggered ability - fires automatically when conditions are met
 *
 * @example "When you play this character, draw 2 cards"
 * @example "Whenever this character quests, gain 1 lore"
 * @example "At the start of your turn, you may draw a card"
 */
export interface TriggeredAbility {
  type: "triggered";

  /**
   * Named abilities have text in ALL CAPS before the effect
   * e.g., "DARK KNOWLEDGE Whenever this character quests..."
   */
  name?: string;

  /** When the ability triggers */
  trigger: Trigger;

  /**
   * Additional condition that must be true (besides trigger)
   * e.g., "...if you have a character named Elsa in play"
   */
  condition?: Condition;

  /** What happens when the ability resolves */
  effect: Effect;
}

// ============================================================================
// Activated Abilities
// ============================================================================

/**
 * Restriction on when an ability can be used
 *
 * Uses the same object-based DSL as Condition for consistency.
 * Many restrictions map directly to state conditions, while some
 * (like once-per-turn) track ability usage.
 *
 * @example Once per turn
 * ```typescript
 * { type: "once-per-turn" }
 * ```
 *
 * @example Only during your turn
 * ```typescript
 * { type: "during-turn", whose: "your" }
 * ```
 *
 * @example Only while this character is exerted
 * ```typescript
 * { type: "while-exerted" }
 * ```
 */
export type Restriction =
  // Usage tracking restrictions
  | { type: "once-per-turn" }
  | { type: "once-per-game" }
  | { type: "first-time-each-turn" }

  // Turn phase restrictions
  | { type: "during-turn"; whose: "your" | "opponent" }

  // State restrictions (must be in this state)
  | { type: "while-exerted" }
  | { type: "while-ready" }
  | { type: "while-at-location"; locationName?: string }
  | { type: "while-damaged" }
  | { type: "while-undamaged" }

  // Context restrictions
  | { type: "in-challenge" }
  | { type: "not-in-challenge" };

/**
 * @deprecated Use Restriction instead
 */
export type ActivatedRestriction = Restriction;

/**
 * Activated ability - player chooses to use by paying cost
 *
 * @example "{E} - Draw a card"
 * @example "{E}, 2 {I} - Deal 3 damage to chosen character"
 * @example "Banish this item - Gain 3 lore"
 */
export interface ActivatedAbility {
  type: "activated";

  /**
   * Named abilities have text in ALL CAPS before the cost
   * e.g., "MAGIC HAIR {E} − Remove up to 3 damage..."
   */
  name?: string;

  /** Cost to activate the ability */
  cost: AbilityCost;

  /**
   * Condition that must be true to activate
   * e.g., "If you have no cards in your hand..."
   */
  condition?: Condition;

  /** What happens when the ability resolves */
  effect: Effect;

  /** Restrictions on when this can be activated */
  restrictions?: Restriction[];
}

// ============================================================================
// Static Abilities
// ============================================================================

/**
 * Static ability - always active effect that modifies game state
 *
 * @example "Your characters gain Ward"
 * @example "While this character has no damage, he gets +2 strength"
 * @example "Characters can't be challenged while here"
 */
export interface StaticAbility {
  type: "static";

  /**
   * Named abilities have text in ALL CAPS
   * e.g., "HIDDEN AWAY This character can't be challenged"
   */
  name?: string;

  /**
   * Condition for the ability to apply
   * e.g., "While this character has no damage..."
   * e.g., "While you have a character named Elsa..."
   */
  condition?: Condition;

  /**
   * The continuous effect
   * Note: Uses StaticEffect which is a subset of Effect
   */
  effect: StaticEffect;

  /**
   * What this ability affects
   * Helps with optimization - engine knows what to recalculate
   */
  affects?: StaticAffects;
}

/**
 * What a static ability affects (for optimization)
 */
export type StaticAffects =
  | { type: "self" }
  | { type: "characters"; target: CharacterTarget }
  | { type: "items" }
  | { type: "locations" }
  | { type: "all" };

// ============================================================================
// Replacement Effects
// ============================================================================

/**
 * Replacement effect - modifies how something happens
 *
 * @example "If this character would be dealt damage, prevent that damage"
 * @example "If you would draw a card, draw 2 instead"
 */
export interface ReplacementAbility {
  type: "replacement";

  name?: string;

  /** What event this replaces */
  replaces:
    | "damage-to-self"
    | "damage-to-character"
    | "banish-self"
    | "draw-card"
    | "gain-lore"
    | "lose-lore";

  /** Condition for replacement to apply */
  condition?: Condition;

  /** What happens instead */
  replacement: Effect | "prevent" | "double";
}

// ============================================================================
// Combined Ability Type
// ============================================================================

/**
 * All possible ability types
 */
export type Ability =
  | KeywordAbility
  | TriggeredAbility
  | ActivatedAbility
  | StaticAbility
  | ReplacementAbility;

/**
 * Ability with original text preserved
 * Useful for display and debugging
 */
export interface AbilityWithText extends AbilityBase {
  ability: Ability;
  /** Original card text for this ability */
  text: string;
}

interface AbilityBase {
  /** Unique identifier for this ability instance */
  id?: string;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if ability is a keyword ability
 */
export function isKeywordAbility(ability: Ability): ability is KeywordAbility {
  return ability.type === "keyword";
}

/**
 * Check if ability is a triggered ability
 */
export function isTriggeredAbility(
  ability: Ability,
): ability is TriggeredAbility {
  return ability.type === "triggered";
}

/**
 * Check if ability is an activated ability
 */
export function isActivatedAbility(
  ability: Ability,
): ability is ActivatedAbility {
  return ability.type === "activated";
}

/**
 * Check if ability is a static ability
 */
export function isStaticAbility(ability: Ability): ability is StaticAbility {
  return ability.type === "static";
}

/**
 * Check if ability is a replacement ability
 */
export function isReplacementAbility(
  ability: Ability,
): ability is ReplacementAbility {
  return ability.type === "replacement";
}

/**
 * Check if keyword is a simple keyword (no parameters)
 */
export function isSimpleKeyword(
  keyword: KeywordType,
): keyword is SimpleKeywordType {
  return [
    "Rush",
    "Ward",
    "Evasive",
    "Bodyguard",
    "Support",
    "Reckless",
    "Vanish",
    "Alert",
  ].includes(keyword);
}

/**
 * Check if keyword is parameterized (Challenger, Resist - has value, may have condition)
 */
export function isParameterizedKeyword(
  keyword: KeywordType,
): keyword is ParameterizedKeywordType {
  return keyword === "Challenger" || keyword === "Resist";
}

/**
 * Check if keyword is value-based (Singer, SingTogether, Boost)
 */
export function isValueKeyword(
  keyword: KeywordType,
): keyword is ValueKeywordType {
  return (
    keyword === "Singer" || keyword === "SingTogether" || keyword === "Boost"
  );
}

/**
 * Check if keyword is Shift
 */
export function isShiftKeyword(keyword: KeywordType): keyword is "Shift" {
  return keyword === "Shift";
}

/**
 * Check if keyword is complex (Shift, Singer, etc.)
 * @deprecated Use isValueKeyword or isShiftKeyword instead
 */
export function isComplexKeyword(
  keyword: KeywordType,
): keyword is ComplexKeywordType {
  return ["Shift", "Singer", "SingTogether", "Boost"].includes(keyword);
}

// ============================================================================
// Keyword Ability Type Guards
// ============================================================================

/**
 * Check if a keyword ability is a simple keyword ability
 */
export function isSimpleKeywordAbility(
  ability: KeywordAbility,
): ability is SimpleKeywordAbility {
  return isSimpleKeyword(ability.keyword);
}

/**
 * Check if a keyword ability is a parameterized keyword ability
 */
export function isParameterizedKeywordAbility(
  ability: KeywordAbility,
): ability is ParameterizedKeywordAbility {
  return isParameterizedKeyword(ability.keyword);
}

/**
 * Check if a keyword ability is a value keyword ability
 */
export function isValueKeywordAbility(
  ability: KeywordAbility,
): ability is ValueKeywordAbility {
  return isValueKeyword(ability.keyword);
}

/**
 * Check if a keyword ability is a Shift ability
 */
export function isShiftKeywordAbility(
  ability: KeywordAbility,
): ability is ShiftKeywordAbility {
  return ability.keyword === "Shift";
}

/**
 * Check if ability has a name (named ability)
 */
export function isNamedAbility(
  ability: Ability,
): ability is Exclude<Ability, KeywordAbility> & { name: string } {
  return (
    ability.type !== "keyword" &&
    "name" in ability &&
    ability.name !== undefined
  );
}

// ============================================================================
// Builders (convenience functions)
// ============================================================================

/**
 * Create a simple keyword ability
 */
export function keyword(kw: SimpleKeywordType): SimpleKeywordAbility {
  return { type: "keyword", keyword: kw };
}

/**
 * Create a Challenger +X ability
 *
 * @example challenger(3)
 * @example challenger(2, { type: "while-damaged" }) // Challenger +2 while damaged
 */
export function challenger(
  value: number,
  condition?: Condition,
): ParameterizedKeywordAbility {
  return condition
    ? { type: "keyword", keyword: "Challenger", value, condition }
    : { type: "keyword", keyword: "Challenger", value };
}

/**
 * Create a Resist +X ability
 *
 * @example resist(2)
 * @example resist(2, { type: "in-challenge" }) // Resist +2 while challenging
 */
export function resist(
  value: number,
  condition?: Condition,
): ParameterizedKeywordAbility {
  return condition
    ? { type: "keyword", keyword: "Resist", value, condition }
    : { type: "keyword", keyword: "Resist", value };
}

/**
 * Create a Shift ability using AbilityCost
 *
 * @example shift({ ink: 5 }) - Standard Shift 5
 * @example shift({ ink: 5 }, "Elsa") - Shift 5 onto Elsa
 */
export function shift(
  cost: AbilityCost,
  shiftTarget?: string,
): ShiftKeywordAbility {
  return shiftTarget
    ? { type: "keyword", keyword: "Shift", cost, shiftTarget }
    : { type: "keyword", keyword: "Shift", cost };
}

/**
 * Create a Shift ability with ink cost (convenience)
 *
 * @example shiftInk(5) - Standard Shift 5
 * @example shiftInk(5, "Elsa") - Shift 5 onto Elsa
 */
export function shiftInk(
  inkCost: number,
  shiftTarget?: string,
): ShiftKeywordAbility {
  return shift({ ink: inkCost }, shiftTarget);
}

/**
 * Create a Singer ability
 */
export function singer(value: number): ValueKeywordAbility {
  return { type: "keyword", keyword: "Singer", value };
}

/**
 * Create a SingTogether ability
 */
export function singTogether(value: number): ValueKeywordAbility {
  return { type: "keyword", keyword: "SingTogether", value };
}

/**
 * Create a Boost ability
 */
export function boost(value: number): ValueKeywordAbility {
  return { type: "keyword", keyword: "Boost", value };
}

/**
 * Create a triggered ability
 */
export function triggered(
  trigger: Trigger,
  effect: Effect,
  options?: { name?: string; condition?: Condition },
): TriggeredAbility {
  return {
    type: "triggered",
    trigger,
    effect,
    ...options,
  };
}

/**
 * Create an activated ability
 */
export function activated(
  cost: AbilityCost,
  effect: Effect,
  options?: {
    name?: string;
    condition?: Condition;
    restrictions?: ActivatedRestriction[];
  },
): ActivatedAbility {
  return {
    type: "activated",
    cost,
    effect,
    ...options,
  };
}

/**
 * Create a static ability
 */
export function staticAbility(
  effect: StaticEffect,
  options?: { name?: string; condition?: Condition; affects?: StaticAffects },
): StaticAbility {
  return {
    type: "static",
    effect,
    ...options,
  };
}
