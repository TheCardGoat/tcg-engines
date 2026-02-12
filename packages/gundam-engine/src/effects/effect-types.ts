/**
 * Gundam Effect Type Definitions
 *
 * Types for defining effects that abilities can produce in the Gundam Card Game.
 * Effects are the "what happens" part of abilities.
 *
 * Based on Gundam Card Game mechanics:
 * - Units have AP (Attack Power) and HP (Hit Points)
 * - Resources are played from resource deck
 * - Pilots can pair with Gundams
 * - Damage from battle or effects
 * - Keywords like Intercept, First Strike, etc.
 */

import type { PlayerId } from "@tcg/core";
import type { Effect as SharedEffect } from "@tcg/gundam-types/effects";

// ============================================================================
// Targeting Types
// ============================================================================

/**
 * Target specification for effects
 */
export type EffectTarget =
  | "this"
  | "this-card"
  | "this-unit"
  | "this-base"
  | "this-pilot"
  | "self"
  | "opponent"
  | "each-player"
  | "each-unit"
  | "each-opponent-unit"
  | "each-friendly-unit"
  | "chosen-unit"
  | "chosen-card"
  | { readonly selector: UnitSelector };

/**
 * Unit selector for filtering
 */
export interface UnitSelector {
  readonly controller?: "self" | "opponent";
  readonly position?: "active" | "rested";
  readonly damaged?: boolean;
  readonly hasKeyword?: string;
  readonly minLevel?: number;
  readonly maxLevel?: number;
  readonly minCost?: number;
  readonly maxCost?: number;
  readonly cardName?: string;
  readonly cardType?: "UNIT" | "PILOT" | "EVENT" | "BASE";
}

/**
 * Zone specification for card manipulation
 */
export type ZoneSpec =
  | "deck"
  | "resourceDeck"
  | "hand"
  | "battleArea"
  | "shieldSection"
  | "baseSection"
  | "resourceArea"
  | "trash"
  | "removal";

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
  readonly player?: "self" | "opponent";
  readonly from?: "hand" | "battleArea" | ZoneSpec;
  readonly then?: Effect;
}

/**
 * Search deck effect
 */
export interface SearchDeckEffect {
  readonly type: "search-deck";
  readonly filter?: UnitSelector | { readonly cardName?: string };
  readonly destination: ZoneSpec;
  readonly amount?: number;
  readonly reveal?: boolean;
  readonly shuffle?: boolean;
}

/**
 * Return to hand effect
 */
export interface ReturnToHandEffect {
  readonly type: "return-to-hand";
  readonly target: EffectTarget;
  readonly owner?: "self" | "opponent";
}

/**
 * Play from effect
 */
export interface PlayFromEffect {
  readonly type: "play-from";
  readonly target: EffectTarget;
  readonly from: ZoneSpec;
  readonly ignoreCost?: boolean;
  readonly rested?: boolean;
}

/**
 * Send to trash effect (destroy)
 */
export interface SendToTrashEffect {
  readonly type: "send-to-trash";
  readonly target: EffectTarget;
}

/**
 * Remove from game effect
 */
export interface RemoveFromGameEffect {
  readonly type: "remove-from-game";
  readonly target: EffectTarget;
}

/**
 * Look at cards effect
 */
export interface LookEffect {
  readonly type: "look";
  readonly amount: number;
  readonly from: ZoneSpec;
  readonly player?: "self" | "opponent";
  readonly then?: LookThenEffect;
}

/**
 * What to do after looking at cards
 */
export interface LookThenEffect {
  readonly draw?: number;
  readonly addtoHand?: number;
  readonly sendToTrash?: number;
  readonly reveal?: boolean;
}

/**
 * Reveal cards effect
 */
export interface RevealEffect {
  readonly type: "reveal";
  readonly target: EffectTarget;
  readonly from?: ZoneSpec;
}

/**
 * Shuffle deck effect
 */
export interface ShuffleEffect {
  readonly type: "shuffle";
  readonly player?: "self" | "opponent";
  readonly deck?: "deck" | "resourceDeck";
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
  readonly target: EffectTarget;
  readonly source?: EffectTarget;
  readonly battleDamage?: boolean;
}

/**
 * Heal effect (remove damage)
 */
export interface HealEffect {
  readonly type: "heal";
  readonly amount: number | AmountExpression | "all";
  readonly target: EffectTarget;
}

/**
 * Destroy effect
 */
export interface DestroyEffect {
  readonly type: "destroy";
  readonly target: EffectTarget;
  readonly cannotBeDestroyed?: string[]; // Cards that cannot be destroyed
}

/**
 * Rest card effect (exhaust/tap)
 */
export interface RestEffect {
  readonly type: "rest";
  readonly target: EffectTarget;
}

/**
 * Stand card effect (ready/untap)
 */
export interface StandEffect {
  readonly type: "stand";
  readonly target: EffectTarget;
}

/**
 * Battle effect (force units to battle)
 */
export interface BattleEffect {
  readonly type: "battle";
  readonly attacker: EffectTarget;
  readonly defender: EffectTarget;
}

/**
 * Prevent damage effect
 */
export interface PreventDamageEffect {
  readonly type: "prevent-damage";
  readonly target: EffectTarget;
  readonly amount?: number | "all";
  readonly duration?: "turn" | "permanent" | "next-battle";
}

/**
 * Redirect damage effect
 */
export interface RedirectDamageEffect {
  readonly type: "redirect-damage";
  readonly from: EffectTarget;
  readonly to: EffectTarget;
  readonly amount?: number;
}

// ============================================================================
// Stat Modification Effects
// ============================================================================

/**
 * Modify AP effect
 */
export interface ModifyAPEffect {
  readonly type: "modify-ap";
  readonly amount: number | AmountExpression;
  readonly target: EffectTarget;
  readonly duration?: "turn" | "permanent" | "while-condition";
  readonly minimum?: number;
}

/**
 * Modify HP effect
 */
export interface ModifyHPEffect {
  readonly type: "modify-hp";
  readonly amount: number | AmountExpression;
  readonly target: EffectTarget;
  readonly duration?: "turn" | "permanent";
  readonly minimum?: number;
}

/**
 * Set AP effect
 */
export interface SetAPEffect {
  readonly type: "set-ap";
  readonly amount: number | AmountExpression;
  readonly target: EffectTarget;
  readonly duration?: "turn" | "permanent";
}

/**
 * Set HP effect
 */
export interface SetHPEffect {
  readonly type: "set-hp";
  readonly amount: number | AmountExpression;
  readonly target: EffectTarget;
  readonly duration?: "turn" | "permanent";
}

/**
 * Swap stats effect
 */
export interface SwapStatsEffect {
  readonly type: "swap-stats";
  readonly target1: EffectTarget;
  readonly target2: EffectTarget;
  readonly duration?: "turn" | "permanent";
}

/**
 * Gain control effect
 */
export interface GainControlEffect {
  readonly type: "gain-control";
  readonly target: EffectTarget;
  readonly duration?: "turn" | "permanent" | "until-end-of-turn";
}

// ============================================================================
// Resource Effects
// ============================================================================

/**
 * Add resources effect
 */
export interface AddResourcesEffect {
  readonly type: "add-resources";
  readonly amount: number | AmountExpression;
  readonly player?: "self" | "opponent";
  readonly active?: boolean; // Add as active (untapped) resources
}

/**
 * Play resource effect
 */
export interface PlayResourceEffect {
  readonly type: "play-resource";
  readonly from?: ZoneSpec;
  readonly target?: EffectTarget;
}

/**
 * Rest for resources effect
 */
export interface RestForResourceEffect {
  readonly type: "rest-for-resource";
  readonly target: EffectTarget;
}

// ============================================================================
// Pilot and Pairing Effects
// ============================================================================

/**
 * Pair pilot effect
 */
export interface PairPilotEffect {
  readonly type: "pair-pilot";
  readonly pilot: EffectTarget;
  readonly unit: EffectTarget;
}

/**
 * Unpair pilot effect
 */
export interface UnpairPilotEffect {
  readonly type: "unpair-pilot";
  readonly target: EffectTarget;
}

/**
 * Search pilot effect
 */
export interface SearchPilotEffect {
  readonly type: "search-pilot";
  readonly pilotName?: string;
  readonly destination?: ZoneSpec;
  readonly reveal?: boolean;
}

/**
 * Attach as pilot effect
 */
export interface AttachAsPilotEffect {
  readonly type: "attach-as-pilot";
  readonly pilot: EffectTarget;
  readonly unit: EffectTarget;
}

// ============================================================================
// Shield Effects
// ============================================================================

/**
 * Add shield effect
 */
export interface AddShieldEffect {
  readonly type: "add-shield";
  readonly amount: number;
  readonly player?: "self" | "opponent";
  readonly from?: ZoneSpec;
}

/**
 * Shield break effect
 */
export interface BreakShieldEffect {
  readonly type: "break-shield";
  readonly target: EffectTarget;
  readonly amount?: number;
}

// ============================================================================
// Keyword Effects
// ============================================================================

/**
 * Grant keyword effect
 */
export interface GrantKeywordEffect {
  readonly type: "grant-keyword";
  readonly keyword:
    | "Intercept"
    | "First Strike"
    | "Counter"
    | "Pilot"
    | "Transform"
    | "Mobile"
    | "Assassin"
    | string;
  readonly target: EffectTarget;
  readonly duration?: "turn" | "permanent" | "while-condition";
}

/**
 * Lose keyword effect
 */
export interface LoseKeywordEffect {
  readonly type: "lose-keyword";
  readonly keyword: string;
  readonly target: EffectTarget;
  readonly duration?: "turn" | "permanent";
}

// ============================================================================
// Token Effects
// ============================================================================

/**
 * Token definition
 */
export interface TokenDefinition {
  readonly name: string;
  readonly cardType: "UNIT" | "PILOT" | "BASE";
  readonly level?: number;
  readonly cost?: number;
  readonly ap?: number;
  readonly hp?: number;
  readonly keywords?: string[];
}

/**
 * Create token effect
 */
export interface CreateTokenEffect {
  readonly type: "create-token";
  readonly token: TokenDefinition;
  readonly location?: "battleArea" | "baseSection" | ZoneSpec;
  readonly controller?: "self" | "opponent";
  readonly rested?: boolean;
  readonly amount?: number;
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
  readonly choose?: number; // How many to choose (default: 1)
  readonly notChosenThisTurn?: boolean;
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
  readonly player?: "self" | "opponent";
}

/**
 * For each effect - repeat for each matching target
 */
export interface ForEachEffect {
  readonly type: "for-each";
  readonly target: EffectTarget;
  readonly effect: Effect;
}

/**
 * Do X times effect
 */
export interface DoTimesEffect {
  readonly type: "do-times";
  readonly times: number | AmountExpression;
  readonly effect: Effect;
}

/**
 * Repeat while effect
 */
export interface RepeatWhileEffect {
  readonly type: "repeat-while";
  readonly condition: Condition;
  readonly effect: Effect;
  readonly maxTimes?: number;
}

/**
 * If you do effect
 */
export interface IfYouDoEffect {
  readonly type: "if-you-do";
  readonly cost: Cost;
  readonly then: Effect;
}

/**
 * Until end of turn effect
 */
export interface UntilEndOfTurnEffect {
  readonly type: "until-end-of-turn";
  readonly effect: Effect;
}

// ============================================================================
// Special Effects
// ============================================================================

/**
 * Counter effect
 */
export interface CounterEffect {
  readonly type: "counter";
  readonly target?: "current-ability" | "current-event" | EffectTarget;
}

/**
 * Copy effect
 */
export interface CopyEffect {
  readonly type: "copy";
  readonly target: EffectTarget;
  readonly onto?: EffectTarget;
}

/**
 * Change controller effect
 */
export interface ChangeControllerEffect {
  readonly type: "change-controller";
  readonly target: EffectTarget;
  readonly newController: PlayerId | "self" | "opponent";
  readonly duration?: "turn" | "permanent" | "until-end-of-turn";
}

/**
 * Flip face down/up effect
 */
export interface FlipEffect {
  readonly type: "flip";
  readonly target: EffectTarget;
  readonly faceDown?: boolean;
}

/**
 * Gain ability effect
 */
export interface GainAbilityEffect {
  readonly type: "gain-ability";
  readonly ability: AbilityDefinition;
  readonly target: EffectTarget;
  readonly duration?: "turn" | "permanent";
}

/**
 * Lose ability effect
 */
export interface LoseAbilityEffect {
  readonly type: "lose-ability";
  readonly ability: string | string[]; // Ability name or names
  readonly target: EffectTarget;
  readonly duration?: "turn" | "permanent";
}

// ============================================================================
// Amount Expressions
// ============================================================================

/**
 * Dynamic amount based on game state
 */
export type AmountExpression =
  | { readonly count: EffectTarget } // Count of matching targets
  | { readonly ap: EffectTarget } // AP of a target
  | { readonly hp: EffectTarget } // HP of a target
  | { readonly damage: EffectTarget } // Damage on a target
  | { readonly cost: EffectTarget } // Cost of a target
  | { readonly level: EffectTarget } // Level of a target
  | { readonly resources: "self" | "opponent" } // Active resources
  | { readonly cardsInHand: "self" | "opponent" } // Cards in hand
  | { readonly cardsInTrash: "self" | "opponent" } // Cards in trash
  | { readonly shields: "self" | "opponent" } // Number of shields
  | { readonly variable: string }; // Named variable from context

// ============================================================================
// Condition Types
// ============================================================================

/**
 * Condition for effects
 */
export type Condition =
  | {
      readonly playerHas?: {
        readonly resources?: number;
        readonly cardsInHand?: number;
      };
    }
  | {
      readonly targetHas?: {
        readonly keyword?: string;
        readonly damage?: number;
      };
    }
  | {
      readonly cardCount?: {
        readonly zone: ZoneSpec;
        readonly amount?: number;
      };
    }
  | { readonly lifeAtLeast?: number; readonly lifeAtMost?: number }
  | {
      readonly turn?:
        | number
        | { readonly atLeast?: number; readonly atMost?: number };
    }
  | {
      readonly controlUnit?: {
        readonly name?: string;
        readonly keywords?: string[];
      };
    }
  | { readonly conditionRef: string }; // Reference to named condition

// ============================================================================
// Cost Types
// ============================================================================

/**
 * Cost to pay
 */
export type Cost =
  | { readonly rest?: EffectTarget; readonly amount?: number }
  | { readonly discard?: number | EffectTarget }
  | { readonly payResources?: number | AmountExpression }
  | { readonly sendToTrash?: EffectTarget }
  | { readonly reveal?: EffectTarget }
  | { readonly returnToHand?: EffectTarget };

// ============================================================================
// Ability Definition
// ============================================================================

/**
 * Ability definition structure
 *
 * Uses the engine's Effect type which is a union of simple effect shapes.
 * This allows for easier creation of abilities in tests and card definitions.
 */
export interface AbilityDefinition {
  readonly name?: string;
  readonly type: "triggered" | "activated" | "static";
  readonly trigger?: string;
  readonly cost?: Cost;
  readonly effect: Effect;
  readonly description?: string;
}

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
  | SearchDeckEffect
  | ReturnToHandEffect
  | PlayFromEffect
  | SendToTrashEffect
  | RemoveFromGameEffect
  | LookEffect
  | RevealEffect
  | ShuffleEffect

  // Combat
  | DamageEffect
  | HealEffect
  | DestroyEffect
  | RestEffect
  | StandEffect
  | BattleEffect
  | PreventDamageEffect
  | RedirectDamageEffect

  // Stat modification
  | ModifyAPEffect
  | ModifyHPEffect
  | SetAPEffect
  | SetHPEffect
  | SwapStatsEffect
  | GainControlEffect

  // Resources
  | AddResourcesEffect
  | PlayResourceEffect
  | RestForResourceEffect

  // Pilot and pairing
  | PairPilotEffect
  | UnpairPilotEffect
  | SearchPilotEffect
  | AttachAsPilotEffect

  // Shields
  | AddShieldEffect
  | BreakShieldEffect

  // Keywords
  | GrantKeywordEffect
  | LoseKeywordEffect

  // Tokens
  | CreateTokenEffect

  // Control flow
  | SequenceEffect
  | ChoiceEffect
  | ConditionalEffect
  | OptionalEffect
  | ForEachEffect
  | DoTimesEffect
  | RepeatWhileEffect
  | IfYouDoEffect
  | UntilEndOfTurnEffect

  // Special
  | CounterEffect
  | CopyEffect
  | ChangeControllerEffect
  | FlipEffect
  | GainAbilityEffect
  | LoseAbilityEffect;

/**
 * Static effects (subset for static abilities)
 */
export type StaticEffect =
  | ModifyAPEffect
  | ModifyHPEffect
  | GrantKeywordEffect
  | LoseKeywordEffect
  | PreventDamageEffect;

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
  | DoTimesEffect
  | RepeatWhileEffect
  | IfYouDoEffect
  | UntilEndOfTurnEffect {
  return (
    effect.type === "sequence" ||
    effect.type === "choice" ||
    effect.type === "conditional" ||
    effect.type === "optional" ||
    effect.type === "for-each" ||
    effect.type === "do-times" ||
    effect.type === "repeat-while" ||
    effect.type === "if-you-do" ||
    effect.type === "until-end-of-turn"
  );
}

/**
 * Check if effect modifies stats
 */
export function isStatModifyingEffect(
  effect: Effect,
): effect is
  | ModifyAPEffect
  | ModifyHPEffect
  | SetAPEffect
  | SetHPEffect
  | SwapStatsEffect {
  return (
    effect.type === "modify-ap" ||
    effect.type === "modify-hp" ||
    effect.type === "set-ap" ||
    effect.type === "set-hp" ||
    effect.type === "swap-stats"
  );
}

/**
 * Check if effect is combat-related
 */
export function isCombatEffect(
  effect: Effect,
): effect is
  | DamageEffect
  | HealEffect
  | DestroyEffect
  | RestEffect
  | StandEffect
  | BattleEffect
  | PreventDamageEffect
  | RedirectDamageEffect {
  return (
    effect.type === "damage" ||
    effect.type === "heal" ||
    effect.type === "destroy" ||
    effect.type === "rest" ||
    effect.type === "stand" ||
    effect.type === "battle" ||
    effect.type === "prevent-damage" ||
    effect.type === "redirect-damage"
  );
}

/**
 * Check if amount is an expression
 */
export function isAmountExpression(
  amount: number | AmountExpression,
): amount is AmountExpression {
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
  return player ? { type: "draw", amount, player } : { type: "draw", amount };
}

/**
 * Create a damage effect
 */
export function damage(
  amount: number | AmountExpression,
  target: EffectTarget,
): DamageEffect {
  return { type: "damage", amount, target };
}

/**
 * Create a destroy effect
 */
export function destroy(target: EffectTarget): DestroyEffect {
  return { type: "destroy", target };
}

/**
 * Create a rest effect
 */
export function rest(target: EffectTarget): RestEffect {
  return { type: "rest", target };
}

/**
 * Create a stand effect
 */
export function stand(target: EffectTarget): StandEffect {
  return { type: "stand", target };
}

/**
 * Create a heal effect
 */
export function heal(
  amount: number | AmountExpression | "all",
  target: EffectTarget,
): HealEffect {
  return { type: "heal", amount, target };
}

/**
 * Create a modify AP effect
 */
export function modifyAP(
  amount: number | AmountExpression,
  target: EffectTarget,
  duration?: "turn" | "permanent" | "while-condition",
): ModifyAPEffect {
  return duration
    ? { type: "modify-ap", amount, target, duration }
    : { type: "modify-ap", amount, target };
}

/**
 * Create a modify HP effect
 */
export function modifyHP(
  amount: number | AmountExpression,
  target: EffectTarget,
  duration?: "turn" | "permanent",
): ModifyHPEffect {
  return duration
    ? { type: "modify-hp", amount, target, duration }
    : { type: "modify-hp", amount, target };
}

/**
 * Create a return to hand effect
 */
export function returnToHand(target: EffectTarget): ReturnToHandEffect {
  return { type: "return-to-hand", target };
}

/**
 * Create a send to trash effect
 */
export function sendToTrash(target: EffectTarget): SendToTrashEffect {
  return { type: "send-to-trash", target };
}

/**
 * Create a grant keyword effect
 */
export function grantKeyword(
  keyword: string,
  target: EffectTarget,
  duration?: "turn" | "permanent" | "while-condition",
): GrantKeywordEffect {
  return duration
    ? { type: "grant-keyword", keyword, target, duration }
    : { type: "grant-keyword", keyword, target };
}

/**
 * Create a search deck effect
 */
export function searchDeck(
  destination: ZoneSpec,
  filter?: UnitSelector | { readonly cardName?: string },
  options?: { amount?: number; reveal?: boolean; shuffle?: boolean },
): SearchDeckEffect {
  return {
    type: "search-deck",
    filter,
    destination,
    ...options,
  };
}

/**
 * Create a pair pilot effect
 */
export function pairPilot(
  pilot: EffectTarget,
  unit: EffectTarget,
): PairPilotEffect {
  return { type: "pair-pilot", pilot, unit };
}

/**
 * Create a add shield effect
 */
export function addShield(
  amount: number,
  player?: "self" | "opponent",
): AddShieldEffect {
  return player
    ? { type: "add-shield", amount, player }
    : { type: "add-shield", amount };
}

/**
 * Create a break shield effect
 */
export function breakShield(
  target: EffectTarget,
  amount?: number,
): BreakShieldEffect {
  return amount
    ? { type: "break-shield", target, amount }
    : { type: "break-shield", target };
}

/**
 * Create a create token effect
 */
export function createToken(
  token: TokenDefinition,
  options?: {
    location?: "battleArea" | "baseSection" | ZoneSpec;
    controller?: "self" | "opponent";
    rested?: boolean;
    amount?: number;
  },
): CreateTokenEffect {
  return {
    type: "create-token",
    token,
    ...options,
  };
}

/**
 * Create a sequence of effects
 */
export function sequence(...effects: Effect[]): SequenceEffect {
  return { type: "sequence", effects };
}

/**
 * Create a choice effect
 */
export function choice(...options: ChoiceOption[]): ChoiceEffect {
  return { type: "choice", options };
}

/**
 * Create an optional effect
 */
export function optional(
  effect: Effect,
  player?: "self" | "opponent",
): OptionalEffect {
  return player
    ? { type: "optional", effect, player }
    : { type: "optional", effect };
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
    ? { type: "conditional", condition, then, else: elseEffect }
    : { type: "conditional", condition, then };
}

/**
 * Create a for each effect
 */
export function forEach(target: EffectTarget, effect: Effect): ForEachEffect {
  return { type: "for-each", target, effect };
}

/**
 * Create a do times effect
 */
export function doTimes(
  times: number | AmountExpression,
  effect: Effect,
): DoTimesEffect {
  return { type: "do-times", times, effect };
}

/**
 * Create an add resources effect
 */
export function addResources(
  amount: number | AmountExpression,
  player?: "self" | "opponent",
  active?: boolean,
): AddResourcesEffect {
  return player
    ? { type: "add-resources", amount, player, active }
    : { type: "add-resources", amount };
}

/**
 * Create a prevent damage effect
 */
export function preventDamage(
  target: EffectTarget,
  amount?: number | "all",
  duration?: "turn" | "permanent" | "next-battle",
): PreventDamageEffect {
  return { type: "prevent-damage", target, amount, duration };
}

/**
 * Create a gain ability effect
 */
export function gainAbility(
  ability: AbilityDefinition,
  target: EffectTarget,
  duration?: "turn" | "permanent",
): GainAbilityEffect {
  return duration
    ? { type: "gain-ability", ability, target, duration }
    : { type: "gain-ability", ability, target };
}

/**
 * Create a shuffle effect
 */
export function shuffle(
  player?: "self" | "opponent",
  deck?: "deck" | "resourceDeck",
): ShuffleEffect {
  return player ? { type: "shuffle", player, deck } : { type: "shuffle" };
}

/**
 * Create a discard effect
 */
export function discard(
  amount: number | AmountExpression,
  player?: "self" | "opponent",
  from?: "hand" | "battleArea" | ZoneSpec,
): DiscardEffect {
  return from
    ? { type: "discard", amount, player, from }
    : { type: "discard", amount, player };
}

/**
 * Create a look effect
 */
export function look(
  amount: number,
  from: ZoneSpec,
  then?: LookThenEffect,
  player?: "self" | "opponent",
): LookEffect {
  return player
    ? { type: "look", amount, from, then, player }
    : { type: "look", amount, from, then };
}

/**
 * Create a play from effect
 */
export function playFrom(
  target: EffectTarget,
  from: ZoneSpec,
  options?: { ignoreCost?: boolean; rested?: boolean },
): PlayFromEffect {
  return {
    type: "play-from",
    target,
    from,
    ...options,
  };
}

/**
 * Create a battle effect
 */
export function battle(
  attacker: EffectTarget,
  defender: EffectTarget,
): BattleEffect {
  return { type: "battle", attacker, defender };
}

/**
 * Create a redirect damage effect
 */
export function redirectDamage(
  from: EffectTarget,
  to: EffectTarget,
  amount?: number,
): RedirectDamageEffect {
  return { type: "redirect-damage", from, to, amount };
}

/**
 * Create a change controller effect
 */
export function changeController(
  target: EffectTarget,
  newController: PlayerId | "self" | "opponent",
  duration?: "turn" | "permanent" | "until-end-of-turn",
): ChangeControllerEffect {
  return { type: "change-controller", target, newController, duration };
}

/**
 * Create a gain control effect
 */
export function gainControl(
  target: EffectTarget,
  duration?: "turn" | "permanent" | "until-end-of-turn",
): GainControlEffect {
  return duration
    ? { type: "gain-control", target, duration }
    : { type: "gain-control", target };
}

/**
 * Create a copy effect
 */
export function copy(target: EffectTarget, onto?: EffectTarget): CopyEffect {
  return onto ? { type: "copy", target, onto } : { type: "copy", target };
}

/**
 * Create a flip effect
 */
export function flip(target: EffectTarget, faceDown?: boolean): FlipEffect {
  return { type: "flip", target, faceDown };
}

/**
 * Create a remove from game effect
 */
export function removeFromGame(target: EffectTarget): RemoveFromGameEffect {
  return { type: "remove-from-game", target };
}

/**
 * Create a lose keyword effect
 */
export function loseKeyword(
  keyword: string,
  target: EffectTarget,
  duration?: "turn" | "permanent",
): LoseKeywordEffect {
  return duration
    ? { type: "lose-keyword", keyword, target, duration }
    : { type: "lose-keyword", keyword, target };
}

/**
 * Create a lose ability effect
 */
export function loseAbility(
  ability: string | string[],
  target: EffectTarget,
  duration?: "turn" | "permanent",
): LoseAbilityEffect {
  return duration
    ? { type: "lose-ability", ability, target, duration }
    : { type: "lose-ability", ability, target };
}

/**
 * Create a counter effect
 */
export function counter(
  target?: "current-ability" | "current-event" | EffectTarget,
): CounterEffect {
  return target ? { type: "counter", target } : { type: "counter" };
}

/**
 * Create a reveal effect
 */
export function reveal(target: EffectTarget, from?: ZoneSpec): RevealEffect {
  return from ? { type: "reveal", target, from } : { type: "reveal", target };
}

/**
 * Create a search pilot effect
 */
export function searchPilot(
  pilotName?: string,
  destination?: ZoneSpec,
  reveal?: boolean,
): SearchPilotEffect {
  return {
    type: "search-pilot",
    pilotName,
    destination,
    reveal,
  };
}

/**
 * Create an attach as pilot effect
 */
export function attachAsPilot(
  pilot: EffectTarget,
  unit: EffectTarget,
): AttachAsPilotEffect {
  return { type: "attach-as-pilot", pilot, unit };
}

/**
 * Create an unpair pilot effect
 */
export function unpairPilot(target: EffectTarget): UnpairPilotEffect {
  return { type: "unpair-pilot", target };
}

/**
 * Create a play resource effect
 */
export function playResource(
  from?: ZoneSpec,
  target?: EffectTarget,
): PlayResourceEffect {
  return from
    ? { type: "play-resource", from, target }
    : { type: "play-resource" };
}

/**
 * Create a rest for resource effect
 */
export function restForResource(target: EffectTarget): RestForResourceEffect {
  return { type: "rest-for-resource", target };
}

/**
 * Create a set AP effect
 */
export function setAP(
  amount: number | AmountExpression,
  target: EffectTarget,
  duration?: "turn" | "permanent",
): SetAPEffect {
  return duration
    ? { type: "set-ap", amount, target, duration }
    : { type: "set-ap", amount, target };
}

/**
 * Create a set HP effect
 */
export function setHP(
  amount: number | AmountExpression,
  target: EffectTarget,
  duration?: "turn" | "permanent",
): SetHPEffect {
  return duration
    ? { type: "set-hp", amount, target, duration }
    : { type: "set-hp", amount, target };
}

/**
 * Create a swap stats effect
 */
export function swapStats(
  target1: EffectTarget,
  target2: EffectTarget,
  duration?: "turn" | "permanent",
): SwapStatsEffect {
  return duration
    ? { type: "swap-stats", target1, target2, duration }
    : { type: "swap-stats", target1, target2 };
}

/**
 * Create a repeat while effect
 */
export function repeatWhile(
  condition: Condition,
  effect: Effect,
  maxTimes?: number,
): RepeatWhileEffect {
  return maxTimes
    ? { type: "repeat-while", condition, effect, maxTimes }
    : { type: "repeat-while", condition, effect };
}

/**
 * Create an if you do effect
 */
export function ifYouDo(cost: Cost, then: Effect): IfYouDoEffect {
  return { type: "if-you-do", cost, then };
}

/**
 * Create an until end of turn effect
 */
export function untilEndOfTurn(effect: Effect): UntilEndOfTurnEffect {
  return { type: "until-end-of-turn", effect };
}

/**
 * Create a choice option
 */
export function choiceOption(
  label: string,
  effect: Effect,
  condition?: Condition,
): ChoiceOption {
  return condition ? { label, effect, condition } : { label, effect };
}
