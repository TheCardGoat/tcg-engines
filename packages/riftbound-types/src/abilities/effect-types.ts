/**
 * Riftbound Effect Type Definitions
 *
 * Types for defining effects that abilities can produce.
 * Effects are the "what happens" part of abilities.
 */

import type { AnyTarget, Location, Target } from "../targeting";
import type { Condition } from "./condition-types";
import type { Cost, Domain } from "./cost-types";

// ============================================================================
// Card Manipulation Effects
// ============================================================================

/**
 * Draw cards effect
 */
export interface DrawEffect {
  readonly type: "draw";
  readonly amount: number | AmountExpression;
  readonly player?: "self" | "opponent" | "each";
}

/**
 * Discard cards effect
 */
export interface DiscardEffect {
  readonly type: "discard";
  readonly amount: number | AmountExpression;
  readonly player?: "self" | "opponent" | "each";
  readonly then?: Effect; // Effect after discarding (e.g., "discard 1, then draw 2")
}

/**
 * Recycle cards (put from trash to bottom of deck)
 */
export interface RecycleEffect {
  readonly type: "recycle";
  readonly target?: Target;
  readonly amount?: number;
  readonly from?: "trash" | "board";
}

/**
 * Return to hand effect
 */
export interface ReturnToHandEffect {
  readonly type: "return-to-hand";
  readonly target: AnyTarget;
}

/**
 * Play a card effect
 */
export interface PlayEffect {
  readonly type: "play";
  readonly target: Target;
  readonly from?: "hand" | "trash" | "deck";
  readonly ignoreCost?: boolean | "energy" | "power";
  readonly reduceCost?: Cost;
  readonly toLocation?: Location;
}

/**
 * Banish effect (remove from game)
 */
export interface BanishEffect {
  readonly type: "banish";
  readonly target: AnyTarget;
}

/**
 * Look at cards effect
 */
export interface LookEffect {
  readonly type: "look";
  readonly amount: number;
  readonly from: "deck" | "rune-deck" | "opponent-hand";
  readonly then?: LookThenEffect;
}

/**
 * What to do after looking at cards
 */
export interface LookThenEffect {
  readonly draw?: number | "chosen";
  readonly recycle?: number | "rest";
  readonly play?: boolean;
  readonly reveal?: boolean;
}

/**
 * Reveal cards effect
 */
export interface RevealEffect {
  readonly type: "reveal";
  readonly amount: number;
  readonly from: "deck" | "hand";
  readonly until?: "unit" | "gear" | "spell" | Target;
  readonly then?: Effect;
}

// ============================================================================
// Combat Effects
// ============================================================================

/**
 * Deal damage effect
 */
export interface DamageEffect {
  readonly type: "damage";
  readonly amount: number | AmountExpression;
  readonly target: AnyTarget;
  readonly split?: boolean; // Can split among multiple targets
}

/**
 * Heal effect (remove damage)
 */
export interface HealEffect {
  readonly type: "heal";
  readonly amount: number | AmountExpression | "all";
  readonly target: AnyTarget;
}

/**
 * Kill effect (destroy)
 */
export interface KillEffect {
  readonly type: "kill";
  readonly target: AnyTarget;
}

/**
 * Stun effect (doesn't deal combat damage this turn)
 */
export interface StunEffect {
  readonly type: "stun";
  readonly target: AnyTarget;
}

/**
 * Fight effect (two units deal damage to each other)
 */
export interface FightEffect {
  readonly type: "fight";
  readonly attacker: AnyTarget;
  readonly defender: AnyTarget;
}

// ============================================================================
// Stat Modification Effects
// ============================================================================

/**
 * Modify Might effect
 */
export interface ModifyMightEffect {
  readonly type: "modify-might";
  readonly amount: number | AmountExpression;
  readonly target: AnyTarget;
  readonly duration?: "turn" | "permanent" | "combat";
  readonly minimum?: number; // Minimum Might (usually 1)
}

/**
 * Buff effect (give a +1 Might buff marker)
 */
export interface BuffEffect {
  readonly type: "buff";
  readonly target: AnyTarget;
}

/**
 * Spend buff effect
 */
export interface SpendBuffEffect {
  readonly type: "spend-buff";
  readonly target?: AnyTarget;
  readonly then?: Effect;
}

/**
 * Double Might effect
 */
export interface DoubleMightEffect {
  readonly type: "double-might";
  readonly target: AnyTarget;
  readonly duration?: "turn" | "permanent" | "combat";
}

/**
 * Swap Might effect
 */
export interface SwapMightEffect {
  readonly type: "swap-might";
  readonly target1: AnyTarget;
  readonly target2: AnyTarget;
  readonly duration?: "turn" | "permanent";
}

// ============================================================================
// Movement Effects
// ============================================================================

/**
 * Move effect
 */
export interface MoveEffect {
  readonly type: "move";
  readonly target: AnyTarget;
  readonly to: Location;
  readonly from?: Location;
}

/**
 * Recall effect (move to base, not a move)
 */
export interface RecallEffect {
  readonly type: "recall";
  readonly target: AnyTarget;
  readonly exhausted?: boolean;
}

// ============================================================================
// Resource Effects
// ============================================================================

/**
 * Add resource effect
 */
export interface AddResourceEffect {
  readonly type: "add-resource";
  readonly energy?: number;
  readonly power?: Domain[];
}

/**
 * Channel runes effect
 */
export interface ChannelEffect {
  readonly type: "channel";
  readonly amount: number;
  readonly exhausted?: boolean;
}

/**
 * Ready effect (un-exhaust)
 */
export interface ReadyEffect {
  readonly type: "ready";
  readonly target: AnyTarget;
}

/**
 * Exhaust effect
 */
export interface ExhaustEffect {
  readonly type: "exhaust";
  readonly target: AnyTarget;
}

// ============================================================================
// Token Effects
// ============================================================================

/**
 * Token definition
 */
export interface TokenDefinition {
  readonly name: string;
  readonly type: "unit" | "gear";
  readonly might?: number;
  readonly keywords?: string[];
}

/**
 * Create token effect
 */
export interface CreateTokenEffect {
  readonly type: "create-token";
  readonly token: TokenDefinition;
  readonly location?: "base" | "here" | "battlefield" | Location;
  readonly ready?: boolean;
  readonly amount?: number;
}

/**
 * Common token presets
 */
export const TOKEN_PRESETS = {
  GOLD: { name: "Gold", type: "gear" } as const,
  MECH: { might: 3, name: "Mech", type: "unit" } as const,
  RECRUIT: { might: 1, name: "Recruit", type: "unit" } as const,
  SAND_SOLDIER: { might: 2, name: "Sand Soldier", type: "unit" } as const,
  SPRITE: {
    keywords: ["Temporary"],
    might: 3,
    name: "Sprite",
    type: "unit",
  } as const,
} as const;

// ============================================================================
// Keyword Effects
// ============================================================================

/**
 * Grant keyword effect
 */
export interface GrantKeywordEffect {
  readonly type: "grant-keyword";
  readonly keyword: string;
  readonly value?: number;
  readonly target: AnyTarget;
  readonly duration?: "turn" | "permanent";
}

/**
 * Grant multiple keywords effect
 */
export interface GrantKeywordsEffect {
  readonly type: "grant-keywords";
  readonly keywords: string[];
  readonly target: AnyTarget;
  readonly duration?: "turn" | "permanent";
}

// ============================================================================
// Control Flow Effects
// ============================================================================

/**
 * Sequence effect - execute effects in order
 */
export interface SequenceEffect {
  readonly type: "sequence";
  readonly effects: Effect[];
}

/**
 * Choice option
 */
export interface ChoiceOption {
  readonly label?: string;
  readonly effect: Effect;
  readonly condition?: Condition;
}

/**
 * Choice effect - player chooses one option
 */
export interface ChoiceEffect {
  readonly type: "choice";
  readonly options: ChoiceOption[];
  readonly notChosenThisTurn?: boolean; // "Choose one you've not chosen this turn"
}

/**
 * Conditional effect - apply effect if condition is met
 */
export interface ConditionalEffect {
  readonly type: "conditional";
  readonly condition: Condition;
  readonly then: Effect;
  readonly else?: Effect;
}

/**
 * Optional effect - player may choose to apply
 */
export interface OptionalEffect {
  readonly type: "optional";
  readonly effect: Effect;
}

/**
 * For each effect - repeat for each matching target
 */
export interface ForEachEffect {
  readonly type: "for-each";
  readonly target: Target;
  readonly effect: Effect;
}

/**
 * Repeat effect (for [Repeat] keyword)
 */
export interface RepeatEffect {
  readonly type: "repeat";
  readonly cost: Cost;
  readonly effect: Effect;
  readonly differentChoices?: boolean;
}

/**
 * Do X times effect
 */
export interface DoTimesEffect {
  readonly type: "do-times";
  readonly times: number;
  readonly effect: Effect;
}

// ============================================================================
// Special Effects
// ============================================================================

/**
 * Score points effect
 */
export interface ScoreEffect {
  readonly type: "score";
  readonly amount: number;
  readonly player?: "self" | "opponent";
}

/**
 * Counter spell effect
 */
export interface CounterEffect {
  readonly type: "counter";
  readonly target?: "spell" | Target;
  readonly unless?: Cost; // Counter unless they pay
}

/**
 * Take control effect
 */
export interface TakeControlEffect {
  readonly type: "take-control";
  readonly target: AnyTarget;
  readonly duration?: "turn" | "permanent" | "until-leaves";
}

/**
 * Prevent damage effect
 */
export interface PreventDamageEffect {
  readonly type: "prevent-damage";
  readonly target?: AnyTarget;
  readonly amount?: number | "all";
  readonly duration?: "turn" | "next";
}

/**
 * Attach equipment effect
 */
export interface AttachEffect {
  readonly type: "attach";
  readonly equipment: AnyTarget;
  readonly to: AnyTarget;
}

/**
 * Detach equipment effect
 */
export interface DetachEffect {
  readonly type: "detach";
  readonly equipment: AnyTarget;
}

/**
 * Gain control of spell effect
 */
export interface GainControlOfSpellEffect {
  readonly type: "gain-control-of-spell";
  readonly newChoices?: boolean;
}

/**
 * Take extra turn effect
 */
export interface ExtraTurnEffect {
  readonly type: "extra-turn";
}

/**
 * Win the game effect
 */
export interface WinGameEffect {
  readonly type: "win-game";
}

// ============================================================================
// Amount Expressions
// ============================================================================

/**
 * Dynamic amount based on game state
 */
export type AmountExpression =
  | { readonly count: Target } // Count of matching targets
  | { readonly might: AnyTarget } // Might of a target
  | { readonly damage: AnyTarget } // Damage on a target
  | { readonly cost: AnyTarget } // Cost of a target
  | { readonly score: "self" | "opponent" } // Player's score
  | { readonly cardsInHand: "self" | "opponent" } // Cards in hand
  | { readonly cardsInTrash: "self" | "opponent" } // Cards in trash
  | { readonly runeCount: "self" | "opponent" } // Runes channeled
  | { readonly variable: string }; // Named variable from context

// ============================================================================
// Union Type
// ============================================================================

/**
 * All effect types
 */
export type Effect =
  // Card manipulation
  | DrawEffect
  | DiscardEffect
  | RecycleEffect
  | ReturnToHandEffect
  | PlayEffect
  | BanishEffect
  | LookEffect
  | RevealEffect

  // Combat
  | DamageEffect
  | HealEffect
  | KillEffect
  | StunEffect
  | FightEffect

  // Stat modification
  | ModifyMightEffect
  | BuffEffect
  | SpendBuffEffect
  | DoubleMightEffect
  | SwapMightEffect

  // Movement
  | MoveEffect
  | RecallEffect

  // Resources
  | AddResourceEffect
  | ChannelEffect
  | ReadyEffect
  | ExhaustEffect

  // Tokens
  | CreateTokenEffect

  // Keywords
  | GrantKeywordEffect
  | GrantKeywordsEffect

  // Control flow
  | SequenceEffect
  | ChoiceEffect
  | ConditionalEffect
  | OptionalEffect
  | ForEachEffect
  | RepeatEffect
  | DoTimesEffect

  // Special
  | ScoreEffect
  | CounterEffect
  | TakeControlEffect
  | PreventDamageEffect
  | AttachEffect
  | DetachEffect
  | GainControlOfSpellEffect
  | ExtraTurnEffect
  | WinGameEffect;

/**
 * Static effects (subset for static abilities)
 */
export type StaticEffect = ModifyMightEffect | GrantKeywordEffect | GrantKeywordsEffect;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if effect is a control flow effect
 */
export function isControlFlowEffect(
  effect: Effect,
): effect is
  | SequenceEffect
  | ChoiceEffect
  | ConditionalEffect
  | OptionalEffect
  | ForEachEffect
  | RepeatEffect
  | DoTimesEffect {
  return (
    effect.type === "sequence" ||
    effect.type === "choice" ||
    effect.type === "conditional" ||
    effect.type === "optional" ||
    effect.type === "for-each" ||
    effect.type === "repeat" ||
    effect.type === "do-times"
  );
}

/**
 * Check if effect modifies stats
 */
export function isStatModifyingEffect(
  effect: Effect,
): effect is ModifyMightEffect | BuffEffect | DoubleMightEffect | SwapMightEffect {
  return (
    effect.type === "modify-might" ||
    effect.type === "buff" ||
    effect.type === "double-might" ||
    effect.type === "swap-might"
  );
}

/**
 * Check if effect is combat-related
 */
export function isCombatEffect(
  effect: Effect,
): effect is DamageEffect | HealEffect | KillEffect | StunEffect | FightEffect {
  return (
    effect.type === "damage" ||
    effect.type === "heal" ||
    effect.type === "kill" ||
    effect.type === "stun" ||
    effect.type === "fight"
  );
}

/**
 * Check if amount is an expression
 */
export function isAmountExpression(amount: number | AmountExpression): amount is AmountExpression {
  return typeof amount === "object";
}

// ============================================================================
// Builder Functions
// ============================================================================

/**
 * Create a draw effect
 */
export function draw(
  amount: number | AmountExpression,
  player?: "self" | "opponent" | "each",
): DrawEffect {
  return player ? { amount, player, type: "draw" } : { amount, type: "draw" };
}

/**
 * Create a damage effect
 */
export function damage(amount: number | AmountExpression, target: AnyTarget): DamageEffect {
  return { amount, target, type: "damage" };
}

/**
 * Create a kill effect
 */
export function kill(target: AnyTarget): KillEffect {
  return { target, type: "kill" };
}

/**
 * Create a buff effect
 */
export function buff(target: AnyTarget): BuffEffect {
  return { target, type: "buff" };
}

/**
 * Create a modify might effect
 */
export function modifyMight(
  amount: number | AmountExpression,
  target: AnyTarget,
  duration?: "turn" | "permanent" | "combat",
): ModifyMightEffect {
  return duration
    ? { amount, duration, target, type: "modify-might" }
    : { amount, target, type: "modify-might" };
}

/**
 * Create a move effect
 */
export function move(target: AnyTarget, to: Location): MoveEffect {
  return { target, to, type: "move" };
}

/**
 * Create a ready effect
 */
export function ready(target: AnyTarget): ReadyEffect {
  return { target, type: "ready" };
}

/**
 * Create a channel effect
 */
export function channel(amount: number, exhausted?: boolean): ChannelEffect {
  return exhausted ? { amount, exhausted, type: "channel" } : { amount, type: "channel" };
}

/**
 * Create a create token effect
 */
export function createToken(
  token: TokenDefinition,
  location?: "base" | "here" | "battlefield" | Location,
  options?: { ready?: boolean; amount?: number },
): CreateTokenEffect {
  return {
    location,
    token,
    type: "create-token",
    ...options,
  };
}

/**
 * Create a sequence of effects
 */
export function sequence(...effects: Effect[]): SequenceEffect {
  return { effects, type: "sequence" };
}

/**
 * Create a choice effect
 */
export function choice(...options: ChoiceOption[]): ChoiceEffect {
  return { options, type: "choice" };
}

/**
 * Create an optional effect
 */
export function optional(effect: Effect): OptionalEffect {
  return { effect, type: "optional" };
}

/**
 * Create a conditional effect
 */
export function conditional(
  condition: Condition,
  then: Effect,
  elseEffect?: Effect,
): ConditionalEffect {
  return elseEffect
    ? { condition, else: elseEffect, then, type: "conditional" }
    : { condition, then, type: "conditional" };
}
