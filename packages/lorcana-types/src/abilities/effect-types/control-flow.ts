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
import type { CharacterTarget, PlayerTarget } from "../target-types";
import type { Amount, EffectDuration } from "./amount-types";

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
  type: "sequence";
  /** Array of effects to execute in order (preferred name) */
  steps?: Effect[];
  /** Alias for steps - both are supported for parser compatibility */
  effects?: Effect[];
}

/**
 * Choose one of multiple effects
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
  chooser?: PlayerTarget;
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
  condition: Condition;
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
  effect: Effect;
  /** Who decides */
  chooser?: PlayerTarget;
}

/**
 * For-each effect (repeat for each X)
 *
 * @example "Gain 1 lore for each character you have in play"
 */
export interface ForEachEffect {
  type: "for-each";
  counter: ForEachCounter;
  effect: Effect;
  /** Maximum times to repeat (optional) */
  maximum?: number;
}

/**
 * What to count for for-each effects
 */
export type ForEachCounter =
  | { type: "characters"; controller: "you" | "opponent" | "any" }
  | { type: "damaged-characters"; controller: "you" | "opponent" | "any" }
  | { type: "items"; controller: "you" | "opponent" }
  | { type: "locations"; controller: "you" | "opponent" }
  | { type: "cards-in-hand"; controller: "you" | "opponent" }
  | { type: "cards-in-discard"; controller: "you" | "opponent" }
  | { type: "damage-on-self" }
  | { type: "damage-on-target" }
  | { type: "cards-under-self" }
  | { type: "characters-that-sang"; thisTurn: boolean };

/**
 * Repeat effect X times
 */
export interface RepeatEffect {
  type: "repeat";
  times: Amount;
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
  keywords: Array<{ keyword: string; value?: number }>;
  target: CharacterTarget;
  duration?: EffectDuration;
}

/**
 * Delayed effect - effect that happens at a later time
 *
 * @example "At the end of the turn, banish them"
 */
export interface DelayedEffect {
  type: "delayed";
  timing: "end-of-turn" | "start-of-next-turn" | "end-of-next-turn";
  effect: Effect;
}

/**
 * Play for free effect
 *
 * @example "Play a character with cost 4 or less for free"
 */
export interface PlayForFreeEffect {
  type: "play-for-free";
  filter?: {
    cardType?: string;
    maxCost?: number | string;
    classification?: string;
  };
  enterExerted?: boolean;
}

/**
 * Put on deck effect
 *
 * @example "Put the rest on the bottom of your deck in any order"
 */
export interface PutOnDeckEffect {
  type: "put-on-deck";
  position: "top" | "bottom" | "choice";
  order?: "any" | "random";
  options?: Array<{ position: "top" | "bottom" } | string>;
}

/**
 * Look effect (for looking at cards)
 *
 * @example "Look at the top 3 cards of your deck"
 */
export interface LookEffect {
  type: "look";
  source: "deck" | "hand" | "discard";
  position?: "top" | "bottom";
  count: number;
}

/**
 * Put into hand effect
 *
 * @example "You may put one into your hand"
 */
export interface PutIntoHandEffect {
  type: "put-into-hand";
  count: number;
  source?: "revealed" | "deck" | "discard";
}

/**
 * Compound effect (legacy - use sequence instead)
 * @deprecated Use SequenceEffect instead
 */
export interface CompoundEffect {
  type: "compound";
  effects: Effect[];
}

/**
 * For each opponent effect
 */
export interface ForEachOpponentEffect {
  type: "for-each-opponent";
  effect: Effect;
  condition?: {
    type: string;
    [key: string]: unknown;
  };
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
  amount?: Amount | "all";
  target?: CharacterTarget;
  source?: "challenges" | "abilities" | "all" | "CHALLENGE";
}

/**
 * Gain ability effect (for triggered effects)
 */
export interface GainAbilityEffect {
  type: "gain-ability";
  ability: {
    type: string;
    [key: string]: unknown;
  };
  target: CharacterTarget;
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
}
