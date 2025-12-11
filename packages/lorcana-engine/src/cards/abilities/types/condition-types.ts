/**
 * Condition Types for Lorcana Abilities
 *
 * Defines conditions that must be met for abilities to activate or apply.
 * Used in:
 * - Triggered abilities: "Whenever this character quests, IF you have..."
 * - Static abilities: "WHILE you have a character named..."
 * - Conditional effects: "If an opponent has more lore than you..."
 * - Optional effects: "you MAY draw a card"
 *
 * @example "If you have a character named Elsa in play"
 * @example "While this character has no damage"
 * @example "If you used Shift to play this character"
 */

import type { CardType } from "../../../types/card-types";
import type { ComparisonOperator, TargetZone } from "./target-types";

// ============================================================================
// Character/Card Existence Conditions - Strict Variants
// ============================================================================

/**
 * Check if a character with a specific name exists
 *
 * @example "If you have a character named Elsa in play"
 */
export interface HasNamedCharacterCondition {
  type: "has-named-character";
  /** Character must have this name - REQUIRED */
  name: string;
  /** Who controls the character - REQUIRED */
  controller: "you" | "opponent" | "any";
}

/**
 * Check if a character with a specific classification exists
 *
 * @example "If you have a Floodborn character in play"
 */
export interface HasCharacterWithClassificationCondition {
  type: "has-character-with-classification";
  /** Classification - REQUIRED */
  classification: string;
  /** Who controls the character - REQUIRED */
  controller: "you" | "opponent" | "any";
}

/**
 * Check if a character with a specific keyword exists
 *
 * @example "If you have a character with Bodyguard in play"
 */
export interface HasCharacterWithKeywordCondition {
  type: "has-character-with-keyword";
  /** Keyword - REQUIRED */
  keyword: string;
  /** Who controls the character - REQUIRED */
  controller: "you" | "opponent" | "any";
}

/**
 * Check if a specific count of characters exists
 *
 * @example "If you have 3 or more characters in play"
 */
export interface HasCharacterCountCondition {
  type: "has-character-count";
  /** Who controls the characters - REQUIRED */
  controller: "you" | "opponent" | "any";
  /** Comparison operator - REQUIRED */
  comparison: ComparisonOperator;
  /** Count to compare against - REQUIRED */
  count: number;
  /** Optional classification filter */
  classification?: string;
  /** Optional keyword filter */
  keyword?: string;
}

/**
 * Combined type for all character existence conditions
 */
export type HasCharacterCondition =
  | HasNamedCharacterCondition
  | HasCharacterWithClassificationCondition
  | HasCharacterWithKeywordCondition
  | HasCharacterCountCondition;

/**
 * Check if an item with a specific name exists
 */
export interface HasNamedItemCondition {
  type: "has-named-item";
  name: string;
  controller: "you" | "opponent" | "any";
}

/**
 * Check if a specific count of items exists
 */
export interface HasItemCountCondition {
  type: "has-item-count";
  controller: "you" | "opponent" | "any";
  comparison: ComparisonOperator;
  count: number;
}

/**
 * Combined type for item existence conditions
 */
export type HasItemCondition = HasNamedItemCondition | HasItemCountCondition;

/**
 * Check if a location with a specific name exists
 */
export interface HasNamedLocationCondition {
  type: "has-named-location";
  name: string;
  controller: "you" | "opponent" | "any";
}

export interface HasCharacterHereCondition {
  type: "has-character-here";
}

export interface RevealedMatchesNamedCondition {
  type: "revealed-matches-named";
}

/**
 * Check if a specific count of locations exists
 */
export interface HasLocationCountCondition {
  type: "has-location-count";
  controller: "you" | "opponent" | "any";
  comparison: ComparisonOperator;
  count: number;
}

/**
 * Combined type for location existence conditions
 */
export type HasLocationCondition =
  | HasNamedLocationCondition
  | HasLocationCountCondition;

/**
 * Check if this character is at a location
 */
export interface AtLocationCondition {
  type: "at-location";
  /** Specific location name (optional) */
  locationName?: string;
}

// ============================================================================
// State Conditions - Strict Variants
// ============================================================================

/**
 * Check if this character has any damage (simple check)
 */
export interface HasAnyDamageCondition {
  type: "has-any-damage";
}

/**
 * Check if this character has a specific amount of damage
 */
export interface DamageComparisonCondition {
  type: "damage-comparison";
  /** Comparison operator - REQUIRED */
  comparison: ComparisonOperator;
  /** Value to compare against - REQUIRED */
  value: number;
}

/**
 * Combined type for damage conditions
 */
export type HasDamageCondition =
  | HasAnyDamageCondition
  | DamageComparisonCondition;

/**
 * Check if this character has no damage
 */
export interface NoDamageCondition {
  type: "no-damage";
}

/**
 * Check if this character is exerted
 */
export interface IsExertedCondition {
  type: "is-exerted";
}

/**
 * Check if this character is ready
 */
export interface IsReadyCondition {
  type: "is-ready";
}

/**
 * Check if this card has a card under it (Boost mechanic)
 */
export interface HasCardUnderCondition {
  type: "has-card-under";
}

// ============================================================================
// Count/Comparison Conditions - Strict Variants
// ============================================================================

/**
 * Base countable resources
 */
export type CountableResource =
  | "characters"
  | "items"
  | "locations"
  | "cards-in-hand"
  | "cards-in-inkwell"
  | "cards-in-discard"
  | "damage-on-self"
  | "damaged-characters"
  | "exerted-characters";

/**
 * Count-based condition for generic resources
 *
 * @example "If you have 3 or more characters in play"
 * @example "If you have no cards in your hand"
 */
export interface ResourceCountCondition {
  type: "resource-count";
  /** What to count - REQUIRED */
  what: CountableResource;
  /** Whose resources to count - REQUIRED */
  controller: "you" | "opponent" | "any";
  /** Comparison operator - REQUIRED */
  comparison: ComparisonOperator;
  /** Value to compare against - REQUIRED */
  value: number;
}

/**
 * Count characters with a specific keyword
 *
 * @example "If you have 2 or more characters with Rush"
 */
export interface KeywordCharacterCountCondition {
  type: "keyword-character-count";
  /** Which keyword - REQUIRED */
  keyword: string;
  /** Whose characters - REQUIRED */
  controller: "you" | "opponent" | "any";
  /** Comparison operator - REQUIRED */
  comparison: ComparisonOperator;
  /** Value to compare against - REQUIRED */
  value: number;
}

/**
 * Count characters with a specific classification
 *
 * @example "If you have 2 or more Floodborn characters"
 */
export interface ClassificationCharacterCountCondition {
  type: "classification-character-count";
  /** Which classification - REQUIRED */
  classification: string;
  /** Whose characters - REQUIRED */
  controller: "you" | "opponent" | "any";
  /** Comparison operator - REQUIRED */
  comparison: ComparisonOperator;
  /** Value to compare against - REQUIRED */
  value: number;
}

/**
 * Combined type for all count conditions
 */
export type CountCondition =
  | ResourceCountCondition
  | KeywordCharacterCountCondition
  | ClassificationCharacterCountCondition;

/**
 * Compare two values
 *
 * @example "If an opponent has more cards in their hand than you"
 * @example "If you have more lore than each opponent"
 */
export interface ComparisonCondition {
  type: "comparison";
  /** Left side of comparison */
  left: ComparisonValue;
  /** Comparison operator */
  comparison: ComparisonOperator;
  /** Right side of comparison */
  right: ComparisonValue;
}

export type ComparisonValue =
  | { type: "lore"; controller: "you" | "opponent" }
  | { type: "cards-in-hand"; controller: "you" | "opponent" }
  | { type: "cards-in-inkwell"; controller: "you" | "opponent" }
  | { type: "character-count"; controller: "you" | "opponent" }
  | { type: "damage-on-self" }
  | { type: "strength-of-self" }
  | { type: "constant"; value: number };

// ============================================================================
// Game State Conditions
// ============================================================================

/**
 * Check if Shift was used to play this character
 */
export interface UsedShiftCondition {
  type: "used-shift";
}

// ============================================================================
// This-Turn Conditions - Strict Variants
// ============================================================================

/**
 * Events that can be checked "this turn"
 */
export type ThisTurnEvent =
  | "played-song"
  | "played-character"
  | "played-action"
  | "played-floodborn"
  | "challenged"
  | "quested"
  | "banished-character"
  | "damaged-character"
  | "was-damaged"
  | "inked";

/**
 * Check if something happened this turn (simple boolean check)
 *
 * @example "If you played a song this turn"
 */
export interface ThisTurnHappenedCondition {
  type: "this-turn-happened";
  /** What event to check - REQUIRED */
  event: ThisTurnEvent;
  /** Who did it - REQUIRED */
  who: "you" | "opponent";
}

/**
 * Check if something happened a specific number of times this turn
 *
 * @example "If you played 2 or more characters this turn"
 */
export interface ThisTurnCountCondition {
  type: "this-turn-count";
  /** What event to check - REQUIRED */
  event: ThisTurnEvent;
  /** Who did it - REQUIRED */
  who: "you" | "opponent";
  /** Comparison operator - REQUIRED */
  comparison: ComparisonOperator;
  /** Count to compare against - REQUIRED */
  count: number;
}

/**
 * Combined type for this-turn conditions
 */
export type ThisTurnCondition =
  | ThisTurnHappenedCondition
  | ThisTurnCountCondition;

/**
 * Check whose turn it is
 */
export interface TurnCondition {
  type: "turn";
  whose: "your" | "opponent";
}

/**
 * Check if this is the first occurrence of something this turn
 */
export interface FirstThisTurnCondition {
  type: "first-this-turn";
  event: "challenge" | "quest" | "action" | "character-play";
}

// ============================================================================
// Zone Conditions
// ============================================================================

/**
 * Check for cards in a specific zone
 */
export interface ZoneCondition {
  type: "zone";
  zone: TargetZone;
  controller: "you" | "opponent";
  /** Card type filter */
  cardType?: CardType | "song";
  /** Has cards / is empty */
  hasCards?: boolean;
  /** Card name filter */
  cardName?: string;
}

// ============================================================================
// Combat Context Conditions
// ============================================================================

/**
 * Check if the character is currently in a challenge
 *
 * Used for conditional keywords like "Resist +2 while challenging"
 */
export interface InChallengeCondition {
  type: "in-challenge";
}

// ============================================================================
// Player Choice Conditions
// ============================================================================

/**
 * Player may choose to do something ("you may")
 */
export interface PlayerChoiceCondition {
  type: "player-choice";
  /** Who makes the choice (defaults to controller) */
  chooser?: "controller" | "opponent";
}

// ============================================================================
// Logical Operators
// ============================================================================

/**
 * AND condition - all sub-conditions must be true
 */
export interface AndCondition {
  type: "and";
  conditions: Condition[];
}

/**
 * OR condition - at least one sub-condition must be true
 */
export interface OrCondition {
  type: "or";
  conditions: Condition[];
}

/**
 * NOT condition - sub-condition must be false
 */
export interface NotCondition {
  type: "not";
  condition: Condition;
}

// ============================================================================
// Combined Condition Type
// ============================================================================

/**
 * All possible conditions
 *
 * Uses strict discriminated unions - each condition type has exactly
 * the fields it needs with no ambiguous optional fields.
 */
export type Condition =
  // Character Existence (strict variants)
  | HasNamedCharacterCondition
  | HasCharacterWithClassificationCondition
  | HasCharacterWithKeywordCondition
  | HasCharacterCountCondition
  // Item Existence (strict variants)
  | HasNamedItemCondition
  | HasItemCountCondition
  // Location Existence (strict variants)
  | HasNamedLocationCondition
  | HasLocationCountCondition
  // Location State
  | AtLocationCondition
  // Damage State (strict variants)
  | HasAnyDamageCondition
  | DamageComparisonCondition
  | NoDamageCondition
  // Card State
  | IsExertedCondition
  | IsReadyCondition
  | HasCardUnderCondition
  // Count Conditions (strict variants)
  | ResourceCountCondition
  | KeywordCharacterCountCondition
  | ClassificationCharacterCountCondition
  // Comparison
  | ComparisonCondition
  // Game state
  | UsedShiftCondition
  // This-Turn Conditions (strict variants)
  | ThisTurnHappenedCondition
  | ThisTurnCountCondition
  // Turn
  | TurnCondition
  | FirstThisTurnCondition
  // Zone
  | ZoneCondition
  | HasCharacterHereCondition
  | RevealedMatchesNamedCondition
  // Combat Context
  | InChallengeCondition
  // Choice
  | PlayerChoiceCondition
  // Logical
  | AndCondition
  | OrCondition
  | NotCondition;

// ============================================================================
// Condition Builders (convenience)
// ============================================================================

/**
 * Create a "has character named X" condition
 */
export function hasCharacterNamed(
  name: string,
  controller: "you" | "opponent" | "any" = "you",
): HasNamedCharacterCondition {
  return { type: "has-named-character", name, controller };
}

/**
 * Create a "has character with classification" condition
 */
export function hasCharacterWithClassification(
  classification: string,
  controller: "you" | "opponent" | "any" = "you",
): HasCharacterWithClassificationCondition {
  return {
    type: "has-character-with-classification",
    classification,
    controller,
  };
}

/**
 * Create a "has character with keyword" condition
 */
export function hasCharacterWithKeyword(
  keyword: string,
  controller: "you" | "opponent" | "any" = "you",
): HasCharacterWithKeywordCondition {
  return { type: "has-character-with-keyword", keyword, controller };
}

/**
 * Create a "has X or more characters" condition
 */
export function hasCharacterCount(
  count: number,
  controller: "you" | "opponent" | "any" = "you",
  comparison: ComparisonOperator = "greater-or-equal",
): HasCharacterCountCondition {
  return {
    type: "has-character-count",
    controller,
    comparison,
    count,
  };
}

/**
 * Create a count-based resource condition
 */
export function resourceCount(
  what: CountableResource,
  value: number,
  controller: "you" | "opponent" | "any" = "you",
  comparison: ComparisonOperator = "greater-or-equal",
): ResourceCountCondition {
  return {
    type: "resource-count",
    what,
    controller,
    comparison,
    value,
  };
}

/**
 * Create a "while this character has no damage" condition
 */
export function whileNoDamage(): NoDamageCondition {
  return { type: "no-damage" };
}

/**
 * Create a "while this character has damage" condition
 */
export function whileHasDamage(): HasAnyDamageCondition {
  return { type: "has-any-damage" };
}

/**
 * Create a "if you used Shift" condition
 */
export function ifUsedShift(): UsedShiftCondition {
  return { type: "used-shift" };
}

/**
 * Create a "this turn happened" condition
 */
export function thisTurnHappened(
  event: ThisTurnEvent,
  who: "you" | "opponent" = "you",
): ThisTurnHappenedCondition {
  return { type: "this-turn-happened", event, who };
}

/**
 * Create an "in challenge" condition
 *
 * Used for conditional keywords like "Resist +2 while challenging"
 */
export function inChallenge(): InChallengeCondition {
  return { type: "in-challenge" };
}

/**
 * Create a "you may" condition
 */
export function youMay(): PlayerChoiceCondition {
  return { type: "player-choice" };
}

/**
 * Create an "and" condition
 */
export function and(...conditions: Condition[]): AndCondition {
  return { type: "and", conditions };
}

/**
 * Create an "or" condition
 */
export function or(...conditions: Condition[]): OrCondition {
  return { type: "or", conditions };
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if condition is a logical operator
 */
export function isLogicalCondition(
  condition: Condition,
): condition is AndCondition | OrCondition | NotCondition {
  return (
    condition.type === "and" ||
    condition.type === "or" ||
    condition.type === "not"
  );
}

/**
 * Check if condition is a player choice ("you may")
 */
export function isPlayerChoice(
  condition: Condition,
): condition is PlayerChoiceCondition {
  return condition.type === "player-choice";
}

/**
 * Check if condition requires a count comparison
 */
export function isCountCondition(
  condition: Condition,
): condition is CountCondition {
  return (
    condition.type === "resource-count" ||
    condition.type === "keyword-character-count" ||
    condition.type === "classification-character-count"
  );
}
