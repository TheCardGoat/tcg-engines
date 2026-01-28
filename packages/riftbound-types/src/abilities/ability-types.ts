/**
 * Riftbound Ability Type Definitions
 *
 * Core ability types for Riftbound TCG.
 * Riftbound has six main ability types:
 * - **Keyword**: Simple abilities like Assault, Shield, Tank, Deflect
 * - **Triggered**: Abilities that fire when events occur (When/Whenever/At)
 * - **Activated**: Abilities with costs that players choose to use
 * - **Static**: Abilities that are always active
 * - **Spell**: Action/Reaction spell effects
 * - **Replacement**: Effects that replace other effects ("instead")
 */

import type { AnyTarget, Target } from "../targeting";
import type { Condition } from "./condition-types";
import type { Cost, Domain } from "./cost-types";
import type { Effect, StaticEffect } from "./effect-types";
import type { Trigger } from "./trigger-types";

// ============================================================================
// Keyword Types
// ============================================================================

/**
 * All Riftbound keywords
 */
export type RiftboundKeyword =
  // Combat keywords (stackable)
  | "Assault" // +X Might while attacking
  | "Shield" // +X Might while defending
  | "Tank" // Must be assigned damage first

  // Protection keywords
  | "Deflect" // Opponents pay +X power to target

  // Movement keywords
  | "Ganking" // Can move battlefield to battlefield

  // Timing keywords
  | "Action" // Can play during showdowns
  | "Reaction" // Can play during closed states
  | "Hidden" // Hide facedown, play later with Reaction

  // Entry keywords
  | "Accelerate" // Pay extra to enter ready
  | "Vision" // Look at top card when played

  // Death keywords
  | "Deathknell" // Effect when killed
  | "Temporary" // Killed at Beginning Phase

  // Conditional keywords
  | "Legion" // Bonus if played another card

  // Equipment keywords
  | "Equip" // Attach to unit
  | "Quick-Draw" // Has Reaction, auto-attach
  | "Weaponmaster" // Equip for less when played

  // Special
  | "Unique" // Only 1 in deck
  | "Repeat"; // Pay to repeat effect

/**
 * Keywords that have numeric values (stackable)
 */
export type ValueKeyword = "Assault" | "Shield" | "Deflect";

/**
 * Keywords that have costs
 */
export type CostKeyword = "Accelerate" | "Equip" | "Repeat";

/**
 * Keywords that have effects
 */
export type EffectKeyword = "Deathknell" | "Legion" | "Vision";

/**
 * Simple keywords (no parameters)
 */
export type SimpleKeyword =
  | "Tank"
  | "Ganking"
  | "Action"
  | "Reaction"
  | "Hidden"
  | "Temporary"
  | "Quick-Draw"
  | "Weaponmaster"
  | "Unique";

// ============================================================================
// Keyword Ability Variants
// ============================================================================

/**
 * Simple keyword ability - no parameters
 */
export interface SimpleKeywordAbility {
  readonly type: "keyword";
  readonly keyword: SimpleKeyword;
}

/**
 * Value keyword ability - has numeric value
 *
 * @example [Assault 2]
 * { type: "keyword", keyword: "Assault", value: 2 }
 */
export interface ValueKeywordAbility {
  readonly type: "keyword";
  readonly keyword: ValueKeyword;
  readonly value: number;
  readonly condition?: Condition;
}

/**
 * Cost keyword ability - has a cost
 *
 * @example [Accelerate] (You may pay :rb_energy_1::rb_rune_fury:...)
 * { type: "keyword", keyword: "Accelerate", cost: { energy: 1, power: ["fury"] } }
 */
export interface CostKeywordAbility {
  readonly type: "keyword";
  readonly keyword: CostKeyword;
  readonly cost: Cost;
}

/**
 * Effect keyword ability - has an effect
 *
 * @example [Deathknell] — Draw 1
 * { type: "keyword", keyword: "Deathknell", effect: { type: "draw", amount: 1 } }
 */
export interface EffectKeywordAbility {
  readonly type: "keyword";
  readonly keyword: EffectKeyword;
  readonly effect: Effect;
  readonly condition?: Condition;
}

/**
 * All keyword ability variants
 */
export type KeywordAbility =
  | SimpleKeywordAbility
  | ValueKeywordAbility
  | CostKeywordAbility
  | EffectKeywordAbility;

// ============================================================================
// Triggered Abilities
// ============================================================================

/**
 * Triggered ability - fires automatically when conditions are met
 *
 * @example "When you play this card, draw 1"
 * {
 *   type: "triggered",
 *   trigger: { event: "play-self" },
 *   effect: { type: "draw", amount: 1 }
 * }
 *
 * @example "When I conquer, you may pay :rb_energy_1: to draw 1"
 * {
 *   type: "triggered",
 *   trigger: { event: "conquer", on: "self" },
 *   optional: true,
 *   condition: { type: "pay-cost", cost: { energy: 1 } },
 *   effect: { type: "draw", amount: 1 }
 * }
 */
export interface TriggeredAbility {
  readonly type: "triggered";

  /** Named abilities (e.g., "DEATHKNELL") */
  readonly name?: string;

  /** When the ability triggers */
  readonly trigger: Trigger;

  /** Additional condition that must be true */
  readonly condition?: Condition;

  /** What happens when the ability resolves */
  readonly effect: Effect;

  /** Whether the effect is optional ("you may...") */
  readonly optional?: boolean;
}

// ============================================================================
// Activated Abilities
// ============================================================================

/**
 * Restriction on when an ability can be used
 */
export type Restriction =
  | { readonly type: "once-per-turn" }
  | { readonly type: "once-per-game" }
  | { readonly type: "first-time-each-turn" }
  | { readonly type: "during-turn"; readonly whose: "your" | "opponent" }
  | { readonly type: "while-at-battlefield" }
  | { readonly type: "use-only-if"; readonly condition: Condition };

/**
 * Activated ability - player chooses to use by paying cost
 *
 * @example ":rb_exhaust:: Draw 1"
 * {
 *   type: "activated",
 *   cost: { exhaust: true },
 *   effect: { type: "draw", amount: 1 }
 * }
 *
 * @example ":rb_exhaust:: [Reaction] — [Add] :rb_rune_fury:"
 * {
 *   type: "activated",
 *   cost: { exhaust: true },
 *   timing: "reaction",
 *   effect: { type: "add-resource", power: ["fury"] }
 * }
 */
export interface ActivatedAbility {
  readonly type: "activated";

  /** Named abilities */
  readonly name?: string;

  /** Cost to activate the ability */
  readonly cost: Cost;

  /** What happens when the ability resolves */
  readonly effect: Effect;

  /** When can it be used (action/reaction) */
  readonly timing?: "action" | "reaction";

  /** Condition that must be true to activate */
  readonly condition?: Condition;

  /** Restrictions on when this can be activated */
  readonly restrictions?: Restriction[];
}

// ============================================================================
// Static Abilities
// ============================================================================

/**
 * What a static ability affects (for optimization)
 */
export type StaticAffects =
  | { readonly type: "self" }
  | { readonly type: "units"; readonly target: Target }
  | { readonly type: "gear" }
  | { readonly type: "all-friendly" }
  | { readonly type: "all-enemy" }
  | { readonly type: "battlefield" };

/**
 * Static ability - always active effect that modifies game state
 *
 * @example "Other friendly units here have +1 Might"
 * {
 *   type: "static",
 *   effect: {
 *     type: "modify-might",
 *     amount: 1,
 *     target: { type: "unit", controller: "friendly", location: "here", excludeSelf: true }
 *   }
 * }
 *
 * @example "While I'm Mighty, I have [Deflect], [Ganking], and [Shield]"
 * {
 *   type: "static",
 *   condition: { type: "while-mighty" },
 *   effect: {
 *     type: "grant-keywords",
 *     keywords: ["Deflect", "Ganking", "Shield"],
 *     target: "self"
 *   }
 * }
 */
export interface StaticAbility {
  readonly type: "static";

  /** Named abilities */
  readonly name?: string;

  /** Condition for the ability to apply */
  readonly condition?: Condition;

  /** The continuous effect */
  readonly effect: StaticEffect | Effect;

  /** What this ability affects (for optimization) */
  readonly affects?: StaticAffects;
}

// ============================================================================
// Spell Abilities
// ============================================================================

/**
 * Spell ability - effect on Action/Reaction cards
 *
 * @example "[Action] Deal 3 to a unit at a battlefield"
 * {
 *   type: "spell",
 *   timing: "action",
 *   effect: { type: "damage", amount: 3, target: { type: "unit", location: "battlefield" } }
 * }
 *
 * @example "[Reaction] [Repeat] :rb_energy_2: Give a unit +2 Might this turn"
 * {
 *   type: "spell",
 *   timing: "reaction",
 *   repeat: { energy: 2 },
 *   effect: { type: "modify-might", amount: 2, duration: "turn", target: { type: "unit" } }
 * }
 */
export interface SpellAbility {
  readonly type: "spell";

  /** When can it be played */
  readonly timing: "action" | "reaction";

  /** What happens when the spell resolves */
  readonly effect: Effect;

  /** Additional cost beyond the card's cost */
  readonly additionalCost?: Cost;

  /** Repeat cost (for [Repeat] keyword) */
  readonly repeat?: Cost;

  /** Condition for the spell to be played */
  readonly condition?: Condition;
}

// ============================================================================
// Replacement Abilities
// ============================================================================

/**
 * Replacement ability - modifies how something happens ("instead")
 *
 * @example "The next time a friendly unit would die, kill this instead"
 * {
 *   type: "replacement",
 *   replaces: "die",
 *   target: { type: "unit", controller: "friendly" },
 *   replacement: { type: "kill", target: "self" }
 * }
 */
export interface ReplacementAbility {
  readonly type: "replacement";

  /** Named abilities */
  readonly name?: string;

  /** What event this replaces */
  readonly replaces:
    | "die"
    | "take-damage"
    | "move"
    | "draw"
    | "discard"
    | "score";

  /** What is being affected */
  readonly target?: AnyTarget;

  /** Condition for replacement to apply */
  readonly condition?: Condition;

  /** What happens instead */
  readonly replacement: Effect | "prevent";

  /** Duration of the replacement */
  readonly duration?: "turn" | "permanent" | "next";
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
  | SpellAbility
  | ReplacementAbility;

/**
 * Ability with original text preserved
 */
export interface AbilityWithText {
  /** The parsed ability */
  readonly ability: Ability;
  /** Original card text for this ability */
  readonly text: string;
  /** Unique identifier */
  readonly id?: string;
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
 * Check if ability is a spell ability
 */
export function isSpellAbility(ability: Ability): ability is SpellAbility {
  return ability.type === "spell";
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
 * Check if keyword is a simple keyword
 */
export function isSimpleKeyword(
  keyword: RiftboundKeyword,
): keyword is SimpleKeyword {
  return [
    "Tank",
    "Ganking",
    "Action",
    "Reaction",
    "Hidden",
    "Temporary",
    "Quick-Draw",
    "Weaponmaster",
    "Unique",
  ].includes(keyword);
}

/**
 * Check if keyword is a value keyword
 */
export function isValueKeyword(
  keyword: RiftboundKeyword,
): keyword is ValueKeyword {
  return keyword === "Assault" || keyword === "Shield" || keyword === "Deflect";
}

/**
 * Check if keyword is a cost keyword
 */
export function isCostKeyword(
  keyword: RiftboundKeyword,
): keyword is CostKeyword {
  return (
    keyword === "Accelerate" || keyword === "Equip" || keyword === "Repeat"
  );
}

/**
 * Check if keyword is an effect keyword
 */
export function isEffectKeyword(
  keyword: RiftboundKeyword,
): keyword is EffectKeyword {
  return (
    keyword === "Deathknell" || keyword === "Legion" || keyword === "Vision"
  );
}

// ============================================================================
// Builder Functions
// ============================================================================

/**
 * Create a simple keyword ability
 */
export function keyword(kw: SimpleKeyword): SimpleKeywordAbility {
  return { type: "keyword", keyword: kw };
}

/**
 * Create an Assault ability
 */
export function assault(
  value: number,
  condition?: Condition,
): ValueKeywordAbility {
  return condition
    ? { type: "keyword", keyword: "Assault", value, condition }
    : { type: "keyword", keyword: "Assault", value };
}

/**
 * Create a Shield ability
 */
export function shield(
  value: number,
  condition?: Condition,
): ValueKeywordAbility {
  return condition
    ? { type: "keyword", keyword: "Shield", value, condition }
    : { type: "keyword", keyword: "Shield", value };
}

/**
 * Create a Deflect ability
 */
export function deflect(
  value: number,
  condition?: Condition,
): ValueKeywordAbility {
  return condition
    ? { type: "keyword", keyword: "Deflect", value, condition }
    : { type: "keyword", keyword: "Deflect", value };
}

/**
 * Create an Accelerate ability
 */
export function accelerate(cost: Cost): CostKeywordAbility {
  return { type: "keyword", keyword: "Accelerate", cost };
}

/**
 * Create an Equip ability
 */
export function equip(cost: Cost): CostKeywordAbility {
  return { type: "keyword", keyword: "Equip", cost };
}

/**
 * Create a Deathknell ability
 */
export function deathknell(effect: Effect): EffectKeywordAbility {
  return { type: "keyword", keyword: "Deathknell", effect };
}

/**
 * Create a triggered ability
 */
export function triggered(
  trigger: Trigger,
  effect: Effect,
  options?: { name?: string; condition?: Condition; optional?: boolean },
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
  cost: Cost,
  effect: Effect,
  options?: {
    name?: string;
    timing?: "action" | "reaction";
    condition?: Condition;
    restrictions?: Restriction[];
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
  effect: StaticEffect | Effect,
  options?: { name?: string; condition?: Condition; affects?: StaticAffects },
): StaticAbility {
  return {
    type: "static",
    effect,
    ...options,
  };
}

/**
 * Create a spell ability
 */
export function spell(
  timing: "action" | "reaction",
  effect: Effect,
  options?: { additionalCost?: Cost; repeat?: Cost; condition?: Condition },
): SpellAbility {
  return {
    type: "spell",
    timing,
    effect,
    ...options,
  };
}

/**
 * Create a replacement ability
 */
export function replacement(
  replaces: ReplacementAbility["replaces"],
  replacementEffect: Effect | "prevent",
  options?: {
    name?: string;
    target?: AnyTarget;
    condition?: Condition;
    duration?: "turn" | "permanent" | "next";
  },
): ReplacementAbility {
  return {
    type: "replacement",
    replaces,
    replacement: replacementEffect,
    ...options,
  };
}
