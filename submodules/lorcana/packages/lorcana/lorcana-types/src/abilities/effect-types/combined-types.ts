/**
 * Combined Effect Types
 *
 * Aggregates all effect types into the main Effect union type,
 * and provides shared type guards.
 */

// Import all effect types
import type { Condition } from "../condition-types";
import type { CharacterTarget, PlayerTarget } from "../target-types";
import type { AmountExpr, EffectDuration } from "../../expressions";
import type {
  BanishEffect,
  DealDamageEffect,
  DiscardEffect,
  DrawEffect,
  ExertEffect,
  GainLoreEffect,
  LookAtCardsEffect,
  LoseLoreEffect,
  MillEffect,
  MoveDamageEffect,
  PutDamageEffect,
  PutInHandEffect,
  ReadyEffect,
  RemoveDamageEffect,
  SelectTargetEffect,
} from "./basic-effects";
import type {
  ChoiceEffect,
  CompoundEffect,
  ConditionalEffect,
  CreateReplacementEffect,
  CreateTriggeredAbilityEffect,
  CostEffectEffect,
  ForEachEffect,
  ForEachOpponentEffect,
  ForEachPlayerEffect,
  GainAbilityEffect,
  GrantKeywordEffect,
  GrantKeywordsEffect,
  LookEffect,
  OrEffect,
  OptionalEffect,
  PlayForFreeEffect,
  PreventDamageEffect,
  PutIntoHandEffect,
  PutOnDeckEffect,
  RedirectDamageEffect,
  RepeatEffect,
  RevealAndConditionalEffect,
  RevealAndRouteEffect,
  SequenceEffect,
} from "./control-flow";
import type {
  CostIncreaseEffect,
  CostReductionEffect,
  DamageSourceStatOverrideEffect,
  DrawUntilHandSizeEffect,
  EntersPlayEffect,
  GainKeywordEffect,
  GrantAbilityEffect,
  GrantHandInkabilityEffect,
  GrantDiscardInkabilityEffect,
  LoseKeywordEffect,
  ModifyStatEffect,
  NameACardEffect,
  PropertyModificationEffect,
  PutOnTopEffect,
  RevealUntilMatchEffect,
  RestrictionEffect,
  RevealHandEffect,
  RevealInkwellEffect,
  RevealTopCardEffect,
  SearchDeckEffect,
  SelfPlayConditionEffect,
  StatFloorEffect,
  SetStatEffect,
  WinConditionEffect,
} from "./modifier-effects";
import type {
  EnablePlayFromUnderEffect,
  GrantAbilitiesWhileHereEffect,
  MoveCostReductionEffect,
  MoveCardsFromUnderEffect,
  MoveToLocationEffect,
  PlayCardEffect,
  PutIntoInkwellEffect,
  PutOnBottomEffect,
  PutUnderEffect,
  ReturnRandomFromInkwellEffect,
  ReturnFromDiscardEffect,
  ReturnToHandEffect,
  ShuffleIntoDeckEffect,
} from "./movement-effects";
import type { ScryEffect } from "./scry-effects";

// ============================================================================
// Combined Effect Type
// ============================================================================

/**
 * All possible effects
 */
export type Effect =
  // Draw/Discard
  | DrawEffect
  | DiscardEffect
  | MillEffect
  | ScryEffect
  // Damage
  | DealDamageEffect
  | PutDamageEffect
  | RemoveDamageEffect
  | MoveDamageEffect
  // Lore
  | GainLoreEffect
  | LoseLoreEffect
  // Card State
  | ExertEffect
  | ReadyEffect
  | BanishEffect
  | SelectTargetEffect
  // Zone Movement
  | ReturnToHandEffect
  | ReturnRandomFromInkwellEffect
  | ReturnFromDiscardEffect
  | PutIntoInkwellEffect
  | PutUnderEffect
  | ShuffleIntoDeckEffect
  | PutOnBottomEffect
  | MoveCardsFromUnderEffect
  // Play Card
  | PlayCardEffect
  | EnablePlayFromUnderEffect
  // Location Movement
  | MoveToLocationEffect
  | MoveCostReductionEffect
  | GrantAbilitiesWhileHereEffect
  // Stat Modification
  | ModifyStatEffect
  | StatFloorEffect
  | SetStatEffect
  | DamageSourceStatOverrideEffect
  // Keywords
  | GainKeywordEffect
  | LoseKeywordEffect
  // Restrictions
  | RestrictionEffect
  | GrantAbilityEffect
  | CostReductionEffect
  | CostIncreaseEffect
  | NameACardEffect
  | RevealTopCardEffect
  | RevealUntilMatchEffect
  | PutOnTopEffect
  | DrawUntilHandSizeEffect
  // Control Flow
  | SequenceEffect
  | ChoiceEffect
  | OrEffect
  | ConditionalEffect
  | OptionalEffect
  | ForEachEffect
  | RepeatEffect
  // Reveal/Search
  | RevealHandEffect
  | RevealInkwellEffect
  | SearchDeckEffect
  | RevealUntilMatchEffect
  | LookAtCardsEffect
  | PutInHandEffect
  // Special State Modifications
  | EntersPlayEffect
  | WinConditionEffect
  | PropertyModificationEffect
  // Additional effects for parser support
  | CostEffectEffect
  | RevealAndConditionalEffect
  | RevealAndRouteEffect
  | GrantKeywordEffect
  | GrantKeywordsEffect
  | CreateTriggeredAbilityEffect
  | CreateReplacementEffect
  | PlayForFreeEffect
  | PutOnDeckEffect
  | LookEffect
  | PutIntoHandEffect
  | CompoundEffect
  | ChallengeReadyEffect
  | ReplacementEffect
  | ForEachOpponentEffect
  | ForEachPlayerEffect
  | PreventDamageEffect
  | GainAbilityEffect
  | GainKeywordsEffect
  | EntersPlayWithEffect
  | RedirectDamageEffect
  // Extended effects for card text coverage
  | AdditionalInkwellEffect
  | MoveEffect
  | TriggeredEffectWrapper
  | LookAtTopEffect
  | ModalEffect
  | AddToInkwellEffect
  | RevealTopEffect
  // Additional effect types for parser support
  | PutCardUnderEffect
  | PayCostEffect
  | LookAtDeckEffect
  | PreventionEffect
  | CountEffect
  | MoveToInkwellEffect
  | EntersWithDamageEffect
  | RevealEffect
  | TakeDamageEffect
  | SupportEffect
  | ProtectionEffect
  | LoreLossEffect
  | HealEffect
  // More additional effect types
  | SearchEffect
  | RevealDeckEffect
  | DrawUntilEffect
  | DiscardUntilEffect
  // Ability suppression
  | SuppressAbilityEffect;

/**
 * Static effects (always active, used in static abilities)
 * These don't "happen" - they modify the game state
 *
 * Note: Some complex static abilities use control flow (sequence, conditional)
 * to describe multi-step effects that should apply continuously.
 */
export type StaticEffect =
  | ModifyStatEffect
  | StatFloorEffect
  | DamageSourceStatOverrideEffect
  | GainKeywordEffect
  | LoseKeywordEffect
  | RestrictionEffect
  | GrantAbilityEffect
  | EntersPlayEffect
  | WinConditionEffect
  | PropertyModificationEffect
  | CostReductionEffect
  | CostIncreaseEffect
  | RevealTopCardEffect
  // Extended types for complex static abilities (generated by parser)
  | SequenceEffect
  | OrEffect
  | ConditionalEffect
  | OptionalEffect
  | PlayCardEffect
  | SearchDeckEffect
  // Additional static effects for parser support
  | ChallengeReadyEffect
  | ReplacementEffect
  | GrantKeywordEffect
  | GrantKeywordsEffect
  | GainKeywordsEffect
  | EntersPlayWithEffect
  // Extended static effects for card text coverage
  | AdditionalInkwellEffect
  | ForEachEffect
  | CompoundEffect
  | MoveCostReductionEffect
  | GrantAbilitiesWhileHereEffect
  | EntersWithDamageEffect
  | LookAtTopEffect
  | ModalEffect
  | PropertyModificationEffect
  | GrantHandInkabilityEffect
  | GrantDiscardInkabilityEffect
  // Self play conditions
  | SelfPlayConditionEffect
  // Ability suppression
  | SuppressAbilityEffect;

/**
 * Suppress ability effect - causes target cards to lose a named ability
 *
 * @example "Your Gargoyle characters lose the Stone by Day ability."
 */
export interface SuppressAbilityEffect {
  type: "suppress-ability";
  /** The name of the ability to suppress (e.g., "STONE BY DAY") */
  abilityName: string;
  /** Which cards lose the named ability */
  target: CharacterTarget;
}

/**
 * Gain multiple keywords effect (for static abilities)
 */
export interface GainKeywordsEffect {
  type: "gain-keywords";
  keywords: { keyword: string; value?: number }[];
  target: CharacterTarget;
  duration?: EffectDuration;
}

/**
 * Enters play with effect
 */
export interface EntersPlayWithEffect {
  type: "enters-play-with";
  modification?: "damage" | "exerted" | "cards-under";
  amount?: AmountExpr;
  damage?: number;
  target?: CharacterTarget;
}

/**
 * Challenge ready effect - allows challenging ready characters
 */
export interface ChallengeReadyEffect {
  type: "challenge-ready";
  target: CharacterTarget;
}

/**
 * Replacement effect - replaces one event with another
 */
export interface ReplacementEffect {
  type: "replacement";
  replaces: "damage" | "banish" | "quest" | "damage-to-character";
  with?: Effect | "prevent";
  replacement?: Effect | "prevent";
  condition?: Condition;
}

/**
 * Additional inkwell effect - allows putting additional cards into inkwell
 */
export interface AdditionalInkwellEffect {
  type: "additional-inkwell";
  amount?: AmountExpr;
  target?: PlayerTarget | CharacterTarget;
}

/**
 * Move effect - move a character to a location
 */
export interface MoveEffect {
  type: "move";
  target?: CharacterTarget;
  to?: string;
  cost?: "free" | "normal";
  free?: boolean;
}

/**
 * Triggered effect wrapper - for effects that contain triggered abilities
 * @deprecated Use TriggeredAbility instead
 */
export interface TriggeredEffectWrapper {
  type: "triggered";
  trigger?: unknown;
  effect?: Effect;
}

/**
 * Look at top effect - look at top cards of deck
 */
export interface LookAtTopEffect {
  type: "look-at-top";
  amount?: AmountExpr;
  target?: string;
}

/**
 * Modal effect - choose from multiple options
 */
export interface ModalEffect {
  type: "modal";
  options?: Effect[];
  chooser?: string;
}

/**
 * Add to inkwell effect - alias for put-into-inkwell
 */
export interface AddToInkwellEffect {
  type: "add-to-inkwell";
  source?: string;
  target?: string;
}

/**
 * Reveal top effect - reveal top card of deck
 */
export interface RevealTopEffect {
  type: "reveal-top";
  amount?: AmountExpr;
  target?: string;
}

/**
 * Put card under effect - put a card under another card
 */
export interface PutCardUnderEffect {
  type: "put-card-under";
  source?: string;
  under?: CharacterTarget | string;
  cardType?: string;
}

/**
 * Pay cost effect - pay a cost as part of an effect
 */
export interface PayCostEffect {
  type: "pay-cost";
  cost?: { ink?: number; exert?: boolean };
  effect?: Effect;
}

/**
 * Look at deck effect - look at cards in deck
 */
export interface LookAtDeckEffect {
  type: "look-at-deck";
  amount?: AmountExpr;
  target?: string;
}

/**
 * Prevention effect - prevent something from happening
 */
export interface PreventionEffect {
  type: "prevention";
  prevents?: string;
  target?: CharacterTarget;
}

/**
 * Count effect - count something
 */
export interface CountEffect {
  type: "count";
  what?: string;
  controller?: string;
  /** Optional multiplier applied to the count before storing as triggerAmount (default: 1) */
  multiplier?: number;
}

/**
 * Move to inkwell effect
 */
export interface MoveToInkwellEffect {
  type: "move-to-inkwell";
  target?: CharacterTarget | string;
}

/**
 * Enters with damage effect
 */
export interface EntersWithDamageEffect {
  type: "enters-with-damage";
  amount?: AmountExpr;
  target?: CharacterTarget;
}

/**
 * Reveal effect - reveal cards
 */
export interface RevealEffect {
  type: "reveal";
  source?: string;
  amount?: AmountExpr;
  target?: string;
}

/**
 * Take damage effect - character takes damage
 */
export interface TakeDamageEffect {
  type: "take-damage";
  amount?: AmountExpr;
  target?: CharacterTarget;
}

/**
 * Support effect - support ability
 */
export interface SupportEffect {
  type: "support";
  target?: CharacterTarget;
}

/**
 * Protection effect - protect from something
 */
export interface ProtectionEffect {
  type: "protection";
  from?: string;
  target?: CharacterTarget;
}

/**
 * Lore loss effect - lose lore
 */
export interface LoreLossEffect {
  type: "lore-loss";
  amount?: AmountExpr;
  target?: string;
}

/**
 * Heal effect - remove damage
 */
export interface HealEffect {
  type: "heal";
  amount?: AmountExpr;
  target?: CharacterTarget;
}

/**
 * Search effect - search for cards
 */
export interface SearchEffect {
  type: "search";
  cardType?: string;
  target?: string;
}

/**
 * Reveal deck effect - reveal cards from deck
 */
export interface RevealDeckEffect {
  type: "reveal-deck";
  amount?: AmountExpr;
  target?: string;
}

/**
 * Draw until effect - draw until a condition is met
 */
export interface DrawUntilEffect {
  type: "draw-until";
  condition?: string;
  target?: string;
}

/**
 * Discard until effect - discard until a condition is met
 */
export interface DiscardUntilEffect {
  type: "discard-until";
  condition?: string;
  target?: string;
}

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
  | OrEffect
  | ConditionalEffect
  | OptionalEffect
  | ForEachEffect
  | RepeatEffect {
  return (
    effect.type === "sequence" ||
    effect.type === "choice" ||
    effect.type === "or" ||
    effect.type === "conditional" ||
    effect.type === "optional" ||
    effect.type === "for-each" ||
    effect.type === "repeat"
  );
}

/**
 * Check if effect targets characters
 *
 * Handles both string character targets and query-based character targets.
 * Query objects can be identified by character-specific properties like
 * `owner` (yours/opponent) or the presence of character filters.
 */
export function targetsCharacters(effect: Effect): boolean {
  if (!("target" in effect)) {
    return false;
  }

  const { target } = effect;

  // String character targets
  if (typeof target === "string") {
    return target.includes("CHARACTER") || target === "SELF" || target === "THIS_CHARACTER";
  }

  // Query-based character targets - check for character-specific properties
  // Character queries have 'owner' property or character filters
  if (typeof target === "object" && target !== null) {
    // Check for character query indicators
    return "owner" in target || ("filter" in target && Array.isArray(target.filter));
  }

  return false;
}

/**
 * Check if effect is a scry effect
 */
export function isScryEffect(effect: Effect): effect is ScryEffect {
  return effect.type === "scry";
}
