/**
 * Control Flow Effect Types
 *
 * Effects that control the flow of ability resolution:
 * - Sequence (do A then B)
 * - Choice (choose one of A or B)
 * - Conditional (if X then A else B)
 * - Optional (you may do A)
 * - For-each (for each X, do A)
 * - Repeat (do A X times)
 */

import type { Condition } from "../condition-types";
import type {
  AmountExpr,
  CardFilter,
  CardSelectionFilter,
  EffectDuration,
} from "../../expressions";
import type { CharacterTarget, PlayerTarget } from "../target-types";
import type { Trigger } from "../trigger-types";
import type { LorcanaCardTarget, LorcanaPlayerTarget } from "../../targeting/lorcana-target-dsl";

// Forward reference - will be imported from combined-types at runtime
// This avoids circular dependency during type checking
import type { Effect } from "./combined-types";

// ============================================================================
// Control Flow Effects
// ============================================================================

/**
 * Sequence of effects (executed in order)
 *
 * @example "Draw 2 cards, then choose and discard a card"
 */
export interface SequenceEffect {
  // 6.1.5. Some effects are considered sequential effects. These effects require a player to make a decision or pay a cost in order to resolve them. These are normally written as "[A] to [B], "[A] or [B]," or "[A]. If you do, [B]." Note that both [A] and [B] can have multiple parts.
  // 6.1.5.1. If the effect is "[A] to [B]" or "[A]. If you do, [B]," [A] is required as a part of the resolving effect. [A] can include paying \(\mathbf{O}\) , and that ink is paid as the effect is resolving. If [A] can't be completely performed, the effect can't continue in sequence.
  // 6.1.5.2. If the effect is "[A] or [B]," the player is required to choose [A] or [B] as part of the resolving effect. If [A] can't be chosen, then [B] has to be chosen, and vice versa.
  type: "sequence";
  /** Array of effects to execute in order (preferred name) */
  steps?: Effect[];
  /** Alias for steps - both are supported for parser compatibility */
  effects?: Effect[];
}

/**
 * Choose one of multiple effects
 *
 * Use this for true modal "choose one" effects where the selected option is
 * simply the player's choice among legal modes. Do not use it for printed
 * "[A] or [B]" sequential effects that must force the only legal branch; use
 * `type: "or"` for those.
 *
 * @example "Choose one: Draw a card. Deal 2 damage to chosen character."
 */
export interface ChoiceEffect {
  type: "choice";
  /** Array of effect options (preferred name) */
  options?: Effect[];
  /** Alias for options - both are supported for parser compatibility */
  choices?: Effect[];
  /** Who makes the choice */
  chooser?: PlayerTarget | LorcanaPlayerTarget;
  /** Who chooses (alternative field) */
  chosenBy?: "you" | "opponent" | "TARGET";
  /** Label/name for each option (for display) */
  optionLabels?: string[];
}

/**
 * Sequential "A or B" effect.
 *
 * Use this for printed "[A] or [B]" effects covered by rule 6.1.5.2.
 *
 * Unlike modal `choice` effects, `or` re-checks branch legality while the
 * effect resolves. If only one branch is legal, that branch must be taken even
 * if the player tried to pick the other one.
 *
 * @example "Choose and discard a card or banish this character."
 */
export interface OrEffect {
  type: "or";
  /** Array of effect options */
  options?: Effect[];
  /** Alias for options - both are supported for parser compatibility */
  choices?: Effect[];
  /** Who makes the choice */
  chooser?: PlayerTarget | LorcanaPlayerTarget;
  /** Who chooses (alternative field) */
  chosenBy?: "you" | "opponent" | "TARGET";
  /** Label/name for each option (for display) */
  optionLabels?: string[];
}

/**
 * Conditional effect (if/then/else)
 *
 * @example "If you have a character named Elsa, draw a card"
 */
export interface ConditionalEffect {
  type: "conditional";
  condition?: Condition;
  /** Effect to execute if condition is true (preferred) */
  then?: Effect;
  /** Alternative field for then effect */
  effect?: Effect;
  /** Effect to execute if condition is false */
  else?: Effect;
  /** Alternative fields for if-true/if-false */
  ifTrue?: Effect;
  ifFalse?: Effect;
}

/**
 * Optional effect ("you may")
 *
 * @example "You may draw a card"
 */
export interface OptionalEffect {
  type: "optional";
  effect?: Effect;
  /** Who decides */
  chooser?: PlayerTarget | LorcanaPlayerTarget;
}

/**
 * For-each effect (repeat for each X)
 *
 * @example "Gain 1 lore for each character you have in play"
 */
export interface ForEachEffect {
  type: "for-each";
  counter?: ForEachCounter;
  effect?: Effect;
  /** Maximum times to repeat (optional) */
  maximum?: AmountExpr;
  /** Stat to modify (for static for-each effects) */
  stat?: "strength" | "willpower" | "lore";
  /** Modifier per count (for static for-each effects) */
  modifier?: AmountExpr;
  /** Target for the effect */
  target?: CharacterTarget;
}

/**
 * What to count for for-each effects
 */
export type ForEachCounter =
  | { type: "characters"; controller: "you" | "opponent" | "any" }
  | { type: "damaged-characters"; controller: "you" | "opponent" | "any" }
  | { type: "items"; controller: "you" | "opponent" }
  | { type: "items-in-play"; controller: "you" | "opponent" }
  | { type: "locations"; controller: "you" | "opponent" }
  | { type: "cards-in-hand"; controller: "you" | "opponent" }
  | { type: "cards-in-discard"; controller: "you" | "opponent" }
  | {
      type: "cards-in-inkwell-over-limit";
      controller: "you" | "opponent" | "opponents";
      limit: number;
    }
  | { type: "damage-on-self" }
  | { type: "damage-on-target" }
  | { type: "last-effect-target-count" }
  | { type: "damage-removed" }
  | { type: "lore-lost" }
  | {
      type: "target-query";
      query: LorcanaCardTarget;
    }
  | { type: "cards-under-self" }
  | { type: "exerted-characters"; controller: "you" | "opponent" | "any" }
  | { type: "characters-that-sang"; thisTurn: boolean };

/**
 * Repeat effect X times
 */
export interface RepeatEffect {
  type: "repeat";
  times: AmountExpr;
  effect: Effect;
}

// ============================================================================
// Additional Effect Types for Parser Support
// ============================================================================

/**
 * Cost-effect pattern - pay a cost to get an effect
 *
 * @example "Return chosen character to your hand to play another character"
 * @example "Banish one of your items to draw 2 cards"
 */
export interface CostEffectEffect {
  type: "cost-effect";
  cost: Effect | { ink?: number; type?: string; target?: string };
  effect: Effect;
}

/**
 * Reveal and conditional effect - reveal cards and act based on what's revealed
 *
 * @example "Reveal the top card. If it's a character, play it for free."
 */
export interface RevealAndConditionalEffect {
  type: "reveal-and-conditional";
  reveal: {
    source: "deck" | "hand" | "discard";
    count: number;
    position?: "top" | "bottom";
  };
  condition: {
    type: "card-type" | "classification" | "name" | "cost";
    cardType?: string;
    classification?: string;
    name?: string;
    maxCost?: number;
  };
  ifTrue: Effect;
  ifFalse?: Effect;
}

/**
 * Reveal-and-route effect - reveal top card and route to a destination
 * based on conditions.
 *
 * Replaces the pattern: reveal-top-card → conditional(revealed-matches-X) → put-in-hand/put-on-top/etc.
 *
 * Routes are checked in order; the first matching route wins.
 * - Non-optional routes auto-resolve (card is moved immediately).
 * - Optional routes suspend for player choice (e.g., "you may play for free").
 * - If no route matches, the card goes to the fallback destination (default: deck-top, i.e., stays).
 *
 * @example "Name a card, then reveal the top card. If it's the named card, put it into your hand."
 * @example "Reveal the top card. If it's a character named Pete, you may play it for free."
 */
export interface RevealAndRouteEffect {
  type: "reveal-and-route";
  /** Whose deck to reveal from (default: CONTROLLER) */
  target?: PlayerTarget;
  /** Routes checked in order. First matching route wins. */
  routes: RevealRoute[];
  /** Where unmatched cards go. If omitted, card stays on deck-top. */
  fallback?: RevealRouteDestination;
}

export interface RevealRoute {
  /** Condition the revealed card must satisfy */
  condition: Condition;
  /** Where to put the card if condition matches */
  destination: RevealRouteDestination;
  /** If true, player can decline (e.g., "you may play for free"). On decline, card goes to fallback. */
  optional?: boolean;
  /** Additional effects to execute after routing (e.g., gain 3 lore) */
  sideEffects?: Effect[];
}

export type RevealRouteDestination =
  | { zone: "hand" }
  | { zone: "deck-top" }
  | { zone: "deck-bottom" }
  | { zone: "inkwell"; exerted?: boolean }
  | { zone: "play"; cost?: "free" }
  | { zone: "discard" };

/**
 * Grant keyword effect (for triggered/action effects, not static)
 *
 * @example "Your characters gain Evasive this turn"
 */
export interface GrantKeywordEffect {
  type: "grant-keyword";
  keyword: string;
  value?: number;
  target: CharacterTarget;
  duration?: EffectDuration;
}

/**
 * Grant multiple keywords at once
 *
 * @example "Chosen character gains Challenger +2 and Resist +2 this turn"
 */
export interface GrantKeywordsEffect {
  type: "grant-keywords";
  keywords: { keyword: string; value?: number }[];
  target: CharacterTarget;
  duration?: EffectDuration;
}

export type CreateTriggeredAbilityLifecycle =
  | {
      kind: "floating";
      duration: EffectDuration;
    }
  | {
      kind: "delayed";
      timing: "end-of-turn" | "start-of-next-turn" | "end-of-next-turn";
    };

export type ReplacementEventKind =
  | "modify-stat"
  | "deal-damage"
  | "put-damage"
  | "challenge-damage"
  | "gain-lore"
  | "zone-change";

export type ReplacementTargetReference =
  | "source"
  | "selected-target"
  | "trigger-subject"
  | "chosen-card";

export type ReplacementAbilityKind =
  | {
      type: "prevent-damage";
      appliesTo: "self";
      during?: "any-turn" | "opponents-turn";
      firstTimeEachTurn?: "none" | "opponent-turn";
    }
  | {
      type: "redirect-damage";
      appliesTo: "your-other-characters";
      redirectTo: "self";
    }
  | {
      type: "prevent-remove-damage";
      appliesTo: "all";
    };

export type ReplacementRegistrationKind =
  | {
      type: "prevent-damage";
      eventKinds: ("deal-damage" | "challenge-damage")[];
      targetRef: ReplacementTargetReference;
      consumeOnApply?: boolean;
      applicationKey?: string;
    }
  | {
      type: "zone-destination";
      eventKinds: ["zone-change"];
      targetRef: ReplacementTargetReference;
      fromZones?: string[];
      toZone: string;
      replacementZone: string;
      replacementPosition?: "top" | "bottom";
      consumeOnApply?: boolean;
      applicationKey?: string;
    };

export interface CreateReplacementEffect {
  type: "create-replacement-effect";
  replacement: ReplacementRegistrationKind;
  duration: EffectDuration;
}

/**
 * Create a triggered ability that exists outside the bag for a duration.
 *
 * @example "Whenever one of your characters quests this turn, each opponent loses 1 lore."
 */
export interface CreateTriggeredAbilityEffect {
  type: "create-triggered-ability";
  ability: {
    id?: string;
    name?: string;
    trigger: Trigger;
    sourceZones?: ("play" | "hand" | "discard" | "inkwell")[];
    condition?: Condition;
    effect: Effect;
    autoResolve?: boolean;
  };
  lifecycle: CreateTriggeredAbilityLifecycle;
}

/**
 * Play for free effect
 *
 * @example "Play a character with cost 4 or less for free"
 */
export interface PlayForFreeEffect {
  type: "play-for-free";
  /** Legacy singular filter entrypoint. Prefer `filters`. */
  filter?: CardSelectionFilter | CardFilter | CardFilter[];
  filters?: readonly CardFilter[];
  enterExerted?: boolean;
}

/**
 * Put on deck effect
 *
 * @example "Put the rest on the bottom of your deck in any order"
 */
export interface PutOnDeckEffect {
  type: "put-on-deck";
  position?: "top" | "bottom" | "choice";
  order?: "any" | "random";
  options?: ({ position: "top" | "bottom" } | string)[];
  target?: string;
}

/**
 * Look effect (for looking at cards)
 *
 * @example "Look at the top 3 cards of your deck"
 */
export interface LookEffect {
  type: "look";
  source?: "deck" | "hand" | "discard";
  position?: "top" | "bottom";
  count?: AmountExpr;
}

/**
 * Put into hand effect
 *
 * @example "You may put one into your hand"
 */
export interface PutIntoHandEffect {
  type: "put-into-hand";
  count: AmountExpr;
  source?: "revealed" | "deck" | "discard";
}

/**
 * Compound effect (legacy - use sequence instead)
 * @deprecated Use SequenceEffect instead
 */
export interface CompoundEffect {
  type: "compound";
  effects?: Effect[];
}

/**
 * For each opponent effect
 */
export interface ForEachOpponentEffect {
  type: "for-each-opponent";
  effect: Effect;
  condition?: Condition;
}

/**
 * For each player effect
 */
export interface ForEachPlayerEffect {
  type: "for-each-player";
  effect: Effect;
}

/**
 * Prevent damage effect
 */
export interface PreventDamageEffect {
  type: "prevent-damage";
  amount?: AmountExpr;
  target?: CharacterTarget;
  source?: "challenges" | "abilities" | "all" | "CHALLENGE";
}

/**
 * Gain ability effect (for triggered effects)
 */
export interface GainAbilityEffect {
  type: "gain-ability";
  ability?: {
    type: string;
    [key: string]: unknown;
  };
  target?: CharacterTarget;
  duration?: EffectDuration;
}

/**
 * Redirect damage effect
 */
export interface RedirectDamageEffect {
  type: "redirect-damage";
  from?: CharacterTarget;
  to?: CharacterTarget;
  target?: CharacterTarget;
  /** Amount of damage to redirect */
  amount?: AmountExpr;
}
