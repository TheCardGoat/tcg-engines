/**
 * Ability Types (Section 7)
 *
 * Comprehensive types for Lorcana's ability system including:
 * - Triggered abilities
 * - Activated abilities
 * - Static abilities
 * - Replacement effects
 * - Ability modifiers
 */

import type { Trigger } from "../cards";
import type { CardId, PlayerId } from "../types/game-state";
import type { Keyword } from "../types/keywords";

// =============================================================================
// Trigger Conditions (Rule 7.4)
// =============================================================================

/**
 * Card filter for targeting abilities
 */
export interface CardFilter {
  cardType?: "character" | "action" | "item" | "location";
  inkType?: string;
  classification?: string;
  hasKeyword?: string;
  controller?: "you" | "opponent" | "any";
  zone?: "play" | "hand" | "discard" | "deck";
  custom?: string; // For complex filters that need code
}

/**
 * Conditions that can trigger abilities
 */
export type TriggerCondition =
  | { type: "whenPlayed" }
  | { type: "whenBanished" }
  | { type: "whenQuests" }
  | { type: "whenChallenges" }
  | { type: "whenChallenged" }
  | { type: "whenExerted" }
  | { type: "whenDamaged" }
  | { type: "atStartOfTurn" }
  | { type: "atEndOfTurn" }
  | { type: "wheneverYouPlay"; cardFilter?: CardFilter }
  | { type: "wheneverOpponentPlays"; cardFilter?: CardFilter }
  | { type: "wheneverCharacterBanished"; cardFilter?: CardFilter }
  | { type: "custom"; checkId: string }; // References custom check function

// =============================================================================
// Ability Costs (Rule 7.5)
// =============================================================================

/**
 * Costs that must be paid to use an activated ability
 */
export interface AbilityCost {
  /** Exert this card (⬇ symbol) */
  exert?: boolean;
  /** Pay ink from inkwell */
  ink?: number;
  /** Discard cards from hand */
  discardCards?: number;
  /** Banish this card */
  banishThis?: boolean;
  /** Put damage counters on this card */
  putDamageOnThis?: number;
  /** Custom cost check (references function by ID) */
  customCostId?: string;
}

// =============================================================================
// Effects (Rule 7.3)
// =============================================================================

/**
 * Types of effects abilities can produce
 */
export type EffectType =
  | "dealDamage"
  | "putDamage" // Different from deal - ignores Resist
  | "removeDamage"
  | "drawCards"
  | "discardCards"
  | "gainLore"
  | "loseLore"
  | "returnToHand"
  | "banish"
  | "exert"
  | "ready"
  | "modifyStats"
  | "grantKeyword"
  | "removeKeyword"
  | "moveToZone"
  | "lookAtCards"
  | "revealCards"
  | "shuffle"
  | "custom";

/**
 * Target definition for effects
 */
export interface TargetDefinition {
  type: "character" | "item" | "location" | "card" | "player";
  filter?: CardFilter;
  count?: number | "any" | "all";
  controller?: "you" | "opponent" | "any";
}

/**
 * Effect definition
 */
export interface EffectDefinition {
  type: EffectType;
  params: Record<string, unknown>;
  isOptional?: boolean; // "may" keyword
  targets?: TargetDefinition;
}

// =============================================================================
// Duration (Rule 7.6)
// =============================================================================

/**
 * How long an effect lasts
 */
export type Duration =
  | { type: "untilEndOfTurn" }
  | { type: "untilStartOfNextTurn" }
  | { type: "untilCondition"; conditionId: string }
  | { type: "whileInPlay" }
  | { type: "permanent" };

// =============================================================================
// Static Effects (Rule 7.6)
// =============================================================================

/**
 * Types of static effects
 */
export type StaticEffectType =
  | "modifyStrength"
  | "modifyWillpower"
  | "modifyLore"
  | "modifyCost"
  | "grantKeyword"
  | "preventAction"
  | "requireAction"
  | "custom";

/**
 * Static effect definition
 */
export interface StaticEffectDefinition {
  type: StaticEffectType;
  params: Record<string, unknown>;
  affectedCards?: CardFilter;
}

// =============================================================================
// Ability Definitions
// =============================================================================

/**
 * Triggered ability (Rule 7.4)
 * Automatically triggers when a condition is met
 */
export interface TriggeredAbilityDefinition {
  type: "triggered";
  id: string;
  name?: string;
  text: string;
  trigger: TriggerCondition | Trigger;
  effect: EffectDefinition;
  isFloating?: boolean; // Triggers even after leaving play
  isOptional?: boolean; // "may" keyword
}

/**
 * Activated ability (Rule 7.5)
 * Player pays a cost to activate
 */
export interface ActivatedAbilityDefinition {
  type: "activated";
  id: string;
  name?: string;
  text: string;
  cost: AbilityCost;
  effect: EffectDefinition;
}

/**
 * Static ability (Rule 7.6)
 * Continuous effect while in play
 */
export interface StaticAbilityDefinition {
  type: "static";
  id: string;
  name?: string;
  text: string;
  condition?: CardFilter;
  effect: StaticEffectDefinition;
  duration?: Duration;
  worksOutsidePlay?: boolean;
}

/**
 * Union of all ability types
 */
export type ExtendedAbilityDefinition =
  | TriggeredAbilityDefinition
  | ActivatedAbilityDefinition
  | StaticAbilityDefinition;

// =============================================================================
// Replacement Effects (Rule 7.7)
// =============================================================================

/**
 * Event types that can be replaced
 */
export type GameEventType =
  | "draw"
  | "damage"
  | "banish"
  | "returnToHand"
  | "returnToDeck"
  | "gainLore"
  | "exert";

/**
 * Replacement effect definition
 */
export interface ReplacementEffect {
  type: "replacement";
  id: string;
  text: string;
  replaceEvent: GameEventType;
  withEffect: EffectDefinition | "nothing";
  condition?: CardFilter;
}

// =============================================================================
// Ability Modifiers (Rule 7.8)
// =============================================================================

/**
 * Modifier types
 */
export type ModifierType = "gain" | "lose" | "cant" | "must";

/**
 * Ability modifier (gain/lose/can't/must)
 */
export interface AbilityModifier {
  id: string;
  type: ModifierType;
  sourceCardId: CardId;
  targetCardId: CardId;
  ability?: ExtendedAbilityDefinition | Keyword;
  action?: string; // For can't/must (e.g., "quest", "challenge")
  duration: Duration;
}

// =============================================================================
// Runtime Types
// =============================================================================

/**
 * Instance of a triggered ability waiting to resolve
 */
export interface TriggeredAbilityInstance {
  instanceId: string;
  sourceCardId: CardId;
  controllerId: PlayerId;
  ability: TriggeredAbilityDefinition;
  isOptional: boolean;
  targets?: CardId[];
}

/**
 * Game event that can trigger abilities
 */
export interface GameEvent {
  type: string;
  sourceCardId?: CardId;
  targetCardId?: CardId;
  playerId?: PlayerId;
  params?: Record<string, unknown>;
}

/**
 * Active continuous effect
 */
export interface ActiveContinuousEffect {
  id: string;
  sourceCardId: CardId;
  effect: StaticEffectDefinition;
  duration: Duration;
  affectedCardIds: CardId[];
}

/**
 * Ability usage parameters
 */
export interface AbilityParams {
  targets?: CardId[];
  choices?: Record<string, unknown>;
}
