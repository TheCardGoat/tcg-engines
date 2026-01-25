/**
 * Target Types for Lorcana Abilities
 *
 * Defines how abilities select their targets. Uses a hybrid approach:
 * - Common targeting patterns as string literal enums for simplicity
 * - Complex targeting with query-based filters for advanced cases
 *
 * @example Simple targeting
 * ```typescript
 * const target: CharacterTarget = "CHOSEN_CHARACTER";
 * ```
 *
 * @example Complex targeting with filters
 * ```typescript
 * const target: CharacterTarget = {
 *   selector: "chosen",
 *   owner: "opponent",
 *   filter: [{ type: "damaged" }, { type: "strength-comparison", comparison: "less-or-equal", value: 3 }]
 * };
 * ```
 */

import type { TargetDSL } from "@tcg/core-types";

// ============================================================================
// Player Targeting
// ============================================================================

/**
 * Player target - who is affected by the ability
 *
 * @example "draw 2 cards" targets CONTROLLER
 * @example "each opponent loses 1 lore" targets EACH_OPPONENT
 */

export type PlayerTarget =
  | "CONTROLLER" // The player who controls this card
  | "OPPONENT" // A single opponent (2-player default)
  | "OPPONENTS" // All opponents (alias for EACH_OPPONENT in 2-player)
  | "EACH_PLAYER" // All players including controller
  | "EACH_OPPONENT" // All opponents
  | "CHOSEN_PLAYER" // A player chosen by the controller
  | "CARD_OWNER" // The owner of the target card (context-dependent)
  | "CURRENT_TURN" // The player whose turn it is
  // Additional targets for parser support
  | "NEXT_CHARACTER" // The next character played (for cost reduction)
  | "SEVEN_DWARFS_CHARACTERS" // Seven Dwarfs characters (for lore gain)
  | "THAT_PLAYER" // Reference to a previously mentioned player
  | "CHALLENGER_OWNER" // Owner of the challenging character
  | "THEIR_CHOSEN_CHARACTER" // Their chosen character (for each player effects)
  | "PAWPSICLE_ITEM"; // Specific item reference

// ============================================================================
// Card References (Context-Aware)
// ============================================================================

/**
 * Context-aware card references for abilities
 *
 * These allow effects to reference cards based on the current game context
 * rather than requiring explicit targeting.
 *
 * @example Reference the card that triggered an ability
 * ```typescript
 * { ref: "trigger-source" }
 * ```
 *
 * @example Reference the attacker in a challenge
 * ```typescript
 * { ref: "attacker" }
 * ```
 */
export type CardReference =
  // Self-referential
  | { ref: "self" } // This card (the one with the ability)

  // Trigger context (for triggered abilities)
  | { ref: "trigger-source" } // Card that triggered the ability

  // Challenge context
  | { ref: "attacker" } // Character doing the challenge
  | { ref: "defender" } // Character being challenged

  // Effect chain context
  | { ref: "previous-target" } // Target selected earlier in effect chain

  // Player context
  | { ref: "controller" } // Controller of this card
  | { ref: "opponent" }; // Opponent of controller (1v1)

/**
 * Check if a value is a CardReference
 */
export function isCardReference(value: unknown): value is CardReference {
  return (
    typeof value === "object" &&
    value !== null &&
    "ref" in value &&
    typeof (value as CardReference).ref === "string"
  );
}

// ============================================================================
// Lorcana Context
// ============================================================================

export interface LorcanaContext {
  self?: boolean;
}

// ============================================================================
// Character Targeting - Common Patterns (Enums)
// ============================================================================

/**
 * Common character targeting patterns as string literals
 *
 * These cover ~80% of targeting cases in Lorcana card texts
 */
export type CharacterTargetEnum =
  // Self-referential
  | "SELF" // This character
  | "THIS_CHARACTER" // Alias for SELF

  // Chosen (requires player choice)
  | "CHOSEN_CHARACTER" // Any character
  | "CHOSEN_OPPOSING_CHARACTER" // Opponent's character
  | "CHOSEN_CHARACTER_OF_YOURS" // Your character
  | "ANOTHER_CHOSEN_CHARACTER" // Any character except self
  | "ANOTHER_CHOSEN_CHARACTER_OF_YOURS" // Your character except self
  | "CHOSEN_DAMAGED_CHARACTER" // Any damaged character
  | "CHOSEN_DAMAGED_OPPOSING_CHARACTER" // Opponent's damaged character
  | "CHOSEN_EXERTED_CHARACTER" // Any exerted character
  | "CHOSEN_OTHER_CHARACTER" // Another character (not self)
  | "CHOSEN_CHALLENGED_CHARACTER" // Character being challenged

  // Your chosen characters
  | "YOUR_CHOSEN_CHARACTER" // Your chosen character
  | "YOUR_CHOSEN_DAMAGED_CHARACTER" // Your chosen damaged character
  | "YOUR_CHOSEN_VILLAIN" // Your chosen Villain character
  | "YOUR_CHOSEN_ITEM" // Your chosen item

  // All/Each (affects multiple)
  | "ALL_CHARACTERS" // Every character in play
  | "ALL_OPPOSING_CHARACTERS" // All of opponent's characters
  | "YOUR_CHARACTERS" // All of your characters
  | "YOUR_OTHER_CHARACTERS" // All of your characters except self
  | "YOUR_OTHER_CHARACTER" // Another of your characters (singular)
  | "YOUR_OTHER_2_CHARACTERS" // 2 other characters of yours
  | "EACH_CHARACTER" // Same as ALL_CHARACTERS
  | "EACH_OPPOSING_CHARACTER" // Same as ALL_OPPOSING_CHARACTERS

  // Up to N characters
  | "UP_TO_2_CHOSEN_CHARACTERS" // Up to 2 chosen characters

  // Classification-based targets
  | "YOUR_OTHER_SEVEN_DWARFS_CHARACTERS" // Your Seven Dwarfs except self
  | "YOUR_PRINCE_PRINCESS_KING_QUEEN_CHARACTERS" // Your royalty characters
  | "YOUR_EXERTED_CHARACTERS" // Your exerted characters
  | "YOUR_EVASIVE_CHARACTERS" // Your Evasive characters
  | "YOUR_RECKLESS_CHARACTERS" // Your Reckless characters
  | "CHOSEN_DRAGON_CHARACTER" // Chosen Dragon character

  // Played card reference
  | "PLAYED_CARD" // The card that was just played
  | "THEIR_CHOSEN_CHARACTER" // Their chosen character (for each player effects)
  | "CHOSEN_OPPOSING_CHARACTER_3_STRENGTH_OR_LESS" // Opposing character with 3 or less strength

  // Challenge context
  | "challenging-character" // The character doing the challenge
  | "challenged-character"; // The character being challenged

// ============================================================================
// Character Targeting - Query-Based (Complex)
// ============================================================================

/**
 * Zone where targets can be found
 */
export type TargetZone = "play" | "hand" | "discard" | "deck" | "inkwell";

/**
 * Who controls the target
 */
export type TargetController = "you" | "opponent" | "any" | "CURRENT_TURN";

/**
 * Comparison operators for numeric filters
 */
export type ComparisonOperator =
  | "equal"
  | "not-equal"
  | "less"
  | "greater"
  | "less-or-equal"
  | "greater-or-equal"
  // Alternative naming conventions (for parser compatibility)
  | "greater-than"
  | "less-than"
  // Additional aliases for natural language
  | "or-more" // Alias for greater-or-equal
  | "or-less"; // Alias for less-or-equal

// ============================================================================
// Shared Filter Types (used across Character, Location, Item targeting)
// ============================================================================

/**
 * Base filters shared across all card types
 * Uses a unified DSL so contributors only learn one pattern
 */

// State filters
export interface DamagedFilter {
  type: "damaged";
}

export interface UndamagedFilter {
  type: "undamaged";
}

export interface ExertedFilter {
  type: "exerted";
}

export interface ReadyFilter {
  type: "ready";
}

// Property filters
export interface HasKeywordFilter {
  type: "has-keyword";
  keyword: string;
}

export interface HasClassificationFilter {
  type: "has-classification";
  classification: string;
}

export interface HasNameFilter {
  type: "has-name";
  name: string;
}

// Numeric comparison filters
export interface CostComparisonFilter {
  type: "cost-comparison";
  comparison: ComparisonOperator;
  value: number;
}

export interface StrengthComparisonFilter {
  type: "strength-comparison";
  comparison: ComparisonOperator;
  value: number;
}

export interface WillpowerComparisonFilter {
  type: "willpower-comparison";
  comparison: ComparisonOperator;
  value: number;
}

export interface LoreComparisonFilter {
  type: "lore-comparison";
  comparison: ComparisonOperator;
  value: number;
}

export interface MoveCostComparisonFilter {
  type: "move-cost-comparison";
  comparison: ComparisonOperator;
  value: number;
}

// ============================================================================
// Source/Reference Filters
// ============================================================================

/**
 * Filter by relationship to source card
 *
 * @example Filter to exclude self
 * ```typescript
 * { type: "source", ref: "other" }
 * ```
 *
 * @example Filter to match the card that triggered this ability
 * ```typescript
 * { type: "source", ref: "trigger-source" }
 * ```
 */
export interface SourceFilter {
  type: "source";
  ref: "self" | "other" | "trigger-source";
}

/**
 * Filter by challenge role
 *
 * @example Filter to match the attacker in a challenge
 * ```typescript
 * { type: "challenge-role", role: "attacker" }
 * ```
 */
export interface ChallengeRoleFilter {
  type: "challenge-role";
  role: "attacker" | "defender";
}

// ============================================================================
// Zone and Owner Filters
// ============================================================================

/**
 * Filter by zone
 *
 * @example Filter to cards in play
 * ```typescript
 * { type: "zone", zone: "play" }
 * ```
 */
export interface ZoneFilter {
  type: "zone";
  zone: TargetZone | TargetZone[];
}

/**
 * Filter by owner/controller
 *
 * @example Filter to opponent's cards
 * ```typescript
 * { type: "owner", owner: "opponent" }
 * ```
 */
export interface OwnerFilter {
  type: "owner";
  owner: "you" | "opponent" | "any";
}

// ============================================================================
// Generic Attribute Filter
// ============================================================================

/**
 * Generic attribute comparison - extensible for future attributes
 * This provides flexibility beyond the specific comparison filters
 */
export type AttributeFilter =
  | AttributeNumericFilter
  | AttributeStringFilter
  | AttributeBooleanFilter;

export interface AttributeNumericFilter {
  type: "attribute";
  attribute: "cost" | "strength" | "willpower" | "lore";
  comparison: ComparisonOperator;
  value: number;
  /** Ignore stat bonuses when comparing */
  ignoreBonuses?: boolean;
}

export interface AttributeStringFilter {
  type: "attribute";
  attribute: "name" | "title";
  comparison: "equals" | "contains";
  value: string;
}

export interface AttributeBooleanFilter {
  type: "attribute";
  attribute: "inkwell";
  value: boolean;
}

/**
 * All filters that can be applied to any card type
 * Specific card types may only support a subset
 */
export type CardFilter =
  // State
  | DamagedFilter
  | UndamagedFilter
  | ExertedFilter
  | ReadyFilter
  // Property
  | HasKeywordFilter
  | HasClassificationFilter
  | HasNameFilter
  // Numeric
  | CostComparisonFilter
  | StrengthComparisonFilter
  | WillpowerComparisonFilter
  | LoreComparisonFilter
  | MoveCostComparisonFilter
  // Source/Reference
  | SourceFilter
  | ChallengeRoleFilter
  // Zone/Owner
  | ZoneFilter
  | OwnerFilter
  // Generic Attribute
  | AttributeFilter;

/**
 * Filters applicable to characters
 * (all except move-cost which is location-specific)
 */
export type CharacterFilter =
  // State
  | DamagedFilter
  | UndamagedFilter
  | ExertedFilter
  | ReadyFilter
  // Property
  | HasKeywordFilter
  | HasClassificationFilter
  | HasNameFilter
  // Numeric comparisons
  | CostComparisonFilter
  | StrengthComparisonFilter
  | WillpowerComparisonFilter
  | LoreComparisonFilter
  // Source/Reference
  | SourceFilter
  | ChallengeRoleFilter
  // Zone/Owner
  | ZoneFilter
  | OwnerFilter
  // Generic Attribute
  | AttributeFilter;

// ============================================================================
// Character Targeting - Strict Query Variants
// ============================================================================

/**
 * Base properties shared by all character query variants
 * Extended from generic TargetDSL
 */
export type CharacterQueryBase = TargetDSL<CharacterFilter[], LorcanaContext>;

/**
 * Target exactly N characters
 *
 * @example Target exactly 2 characters
 * ```typescript
 * {
 *   selector: "chosen",
 *   count: { exactly: 2 },
 *   owner: "opponent"
 * }
 * ```
 */
export interface ExactCountCharacterQuery extends CharacterQueryBase {
  count: number | { exactly: number };
}

/**
 * Target up to N characters (player chooses 0 to maxCount)
 *
 * @example Target up to 2 damaged opposing characters
 * ```typescript
 * {
 *   selector: "chosen",
 *   owner: "opponent",
 *   filter: [{ type: "damaged" }],
 *   count: { upTo: 2 }
 * }
 * ```
 */
export interface UpToCountCharacterQuery extends CharacterQueryBase {
  count: { upTo: number };
}

/**
 * Target all matching characters
 *
 * @example Target all opposing characters
 * ```typescript
 * {
 *   selector: "all",
 *   owner: "opponent"
 * }
 * ```
 */
export interface AllMatchingCharacterQuery extends CharacterQueryBase {
  count: "all";
}

/**
 * Complex character targeting with query-based filters
 *
 * Uses discriminated union to ensure type safety:
 * - `count: number` for exact targeting
 * - `count: "up-to"` requires `maxCount`
 * - `count: "all"` for all matching
 */
export type CharacterTargetQuery =
  | ExactCountCharacterQuery
  | UpToCountCharacterQuery
  | AllMatchingCharacterQuery;

/**
 * Union type for all character targeting options
 */
export type CharacterTarget =
  | CharacterTargetEnum
  | CharacterTargetQuery
  | CardReference;

// ============================================================================
// Location Targeting
// ============================================================================

/**
 * Common location targeting patterns
 */
export type LocationTargetEnum =
  | "CHOSEN_LOCATION"
  | "CHOSEN_OPPOSING_LOCATION"
  | "YOUR_LOCATIONS"
  | "ALL_OPPOSING_LOCATIONS"
  | "THIS_LOCATION" // For abilities on locations
  | "CHARACTERS_HERE"; // Characters at this location (for location abilities)

// ============================================================================
// Location Targeting - Strict Query Variants
// ============================================================================

/**
 * Filters applicable to locations
 * Uses shared filter types for consistency
 */
export type LocationFilter =
  | HasNameFilter
  | WillpowerComparisonFilter
  | MoveCostComparisonFilter
  // Source/Reference
  | SourceFilter
  // Zone/Owner
  | ZoneFilter
  | OwnerFilter;

/**
 * Base properties shared by all location query variants
 */
export type LocationQueryBase = TargetDSL<LocationFilter[], LorcanaContext>;

/** Target exactly N locations */
export interface ExactCountLocationQuery extends LocationQueryBase {
  count: number | { exactly: number };
}

/** Target up to N locations */
export interface UpToCountLocationQuery extends LocationQueryBase {
  count: { upTo: number };
}

/** Target all matching locations */
export interface AllMatchingLocationQuery extends LocationQueryBase {
  count: "all";
}

/**
 * Complex location targeting with filters
 */
export type LocationTargetQuery =
  | ExactCountLocationQuery
  | UpToCountLocationQuery
  | AllMatchingLocationQuery;

export type LocationTarget =
  | LocationTargetEnum
  | LocationTargetQuery
  | CardReference;

// ============================================================================
// Item Targeting
// ============================================================================

/**
 * Common item targeting patterns
 */
export type ItemTargetEnum =
  | "CHOSEN_ITEM"
  | "CHOSEN_OPPOSING_ITEM"
  | "YOUR_ITEMS"
  | "YOUR_ITEM" // Singular - one of your items
  | "ALL_ITEMS"
  | "ALL_OPPOSING_ITEMS"
  | "THIS_ITEM"; // For abilities on items

// ============================================================================
// Item Targeting - Strict Query Variants
// ============================================================================

/**
 * Filters applicable to items
 * Uses shared filter types for consistency
 */
export type ItemFilter =
  | HasNameFilter
  | CostComparisonFilter
  | ExertedFilter
  | ReadyFilter
  // Source/Reference
  | SourceFilter
  // Zone/Owner
  | ZoneFilter
  | OwnerFilter;

/**
 * Base properties shared by all item query variants
 */
export type ItemQueryBase = TargetDSL<ItemFilter[], LorcanaContext>;

/** Target exactly N items */
export interface ExactCountItemQuery extends ItemQueryBase {
  count: number | { exactly: number };
}

/** Target up to N items */
export interface UpToCountItemQuery extends ItemQueryBase {
  count: { upTo: number };
}

/** Target all matching items */
export interface AllMatchingItemQuery extends ItemQueryBase {
  count: "all";
}

/**
 * Complex item targeting with filters
 */
export type ItemTargetQuery =
  | ExactCountItemQuery
  | UpToCountItemQuery
  | AllMatchingItemQuery;

export type ItemTarget = ItemTargetEnum | ItemTargetQuery | CardReference;

// ============================================================================
// Card Targeting (any card type)
// ============================================================================

/**
 * Common card targeting patterns (any type)
 */
export type CardTargetEnum =
  | "CHOSEN_CARD"
  | "CHOSEN_CARD_FROM_HAND"
  | "CHOSEN_CARD_FROM_DISCARD"
  | "TOP_CARD_OF_DECK"
  | "revealed"
  // Additional card targets for parser support
  | "CHARACTER_FROM_DISCARD" // Character card from discard pile
  | "SUPPORT_CHARACTER_FROM_DISCARD" // Support character from discard
  | "CHOSEN_CHARACTER_OR_ITEM_COST_3_OR_LESS"; // Character or item with cost 3 or less

export type CardTarget =
  | CardTargetEnum
  | CharacterTarget
  | LocationTarget
  | ItemTarget;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a character target is a query (vs enum)
 */
export function isCharacterTargetQuery(
  target: CharacterTarget,
): target is CharacterTargetQuery {
  return typeof target === "object"; // && (target as any).selector !== undefined;
}

/**
 * Check if a location target is a query (vs enum)
 */
export function isLocationTargetQuery(
  target: LocationTarget,
): target is LocationTargetQuery {
  return typeof target === "object"; // && (target as any).selector !== undefined;
}

/**
 * Check if an item target is a query (vs enum)
 */
export function isItemTargetQuery(
  target: ItemTarget,
): target is ItemTargetQuery {
  return typeof target === "object"; // && (target as any).selector !== undefined;
}
