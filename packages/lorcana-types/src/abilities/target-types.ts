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
  | "PAWPSICLE_ITEM" // Specific item reference
  // Extended targets for card text coverage
  | "ALL_PLAYERS" // All players (for effects like "each player discards")
  | "SELF" // Self reference (for gain lore effects on self)
  | "BROOM_CHARACTERS" // Broom characters (for lore gain)
  | "CHALLENGING_PLAYER" // The player doing the challenge
  | "NEXT_ACTION" // The next action played (for cost reduction)
  | "NEXT_ITEM" // The next item played (for cost reduction)
  | "CARD_FROM_HAND" // A card from hand (for discard effects)
  | "CHARACTERS_COST_3_OR_LESS" // Characters with cost 3 or less
  | "CHARACTERS_COST_2_OR_LESS" // Characters with cost 2 or less
  | "OPPOSING_CHARACTERS" // Alias for ALL_OPPOSING_CHARACTERS
  | "LOCATIONS"; // All locations (for lore gain effects)

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
  | "challenged-character" // The character being challenged

  // Extended character targets for card text coverage
  | "YOUR_MUSKETEER_CHARACTERS" // Your Musketeer characters
  | "YOUR_OTHER_MUSKETEER_CHARACTERS" // Your other Musketeer characters
  | "YOUR_JETSAM_CHARACTERS" // Your Jetsam characters
  | "YOUR_FLOTSAM_CHARACTERS" // Your Flotsam characters
  | "YOUR_BROOM_CHARACTERS" // Your Broom characters
  | "YOUR_PETER_PAN_CHARACTERS" // Your Peter Pan characters
  | "YOUR_BODYGUARD_CHARACTERS" // Your Bodyguard characters
  | "OPPOSING_CHARACTERS" // Alias for ALL_OPPOSING_CHARACTERS
  | "OPPOSING_EVASIVE_CHARACTERS" // Opposing Evasive characters
  | "CHOSEN_VILLAIN_CHARACTER" // Chosen Villain character
  | "CHOSEN_TE_KA_CHARACTER" // Chosen Te Ka character
  | "CHALLENGED_CHARACTER" // The character being challenged (uppercase)
  | "CHALLENGING_CHARACTER" // The character doing the challenge (uppercase)
  | "BANISHED_CHARACTER" // The character that was banished
  // Extended character targets for additional card text coverage
  | "CHARACTERS_HERE" // Characters at this location
  | "YOUR_OTHER_STEEL_CHARACTERS" // Your other Steel characters
  | "YOUR_DEITY_CHARACTERS" // Your Deity characters
  | "UP_TO_2_YOUR_CHARACTERS" // Up to 2 of your characters
  | "THAT_LOCATION" // Reference to a previously mentioned location
  | "CHOSEN_OPPOSING_DEITY_CHARACTER" // Chosen opposing Deity character
  | "CHOSEN_CHARACTER_OR_LOCATION" // Chosen character or location
  // Additional targets for set-005 and beyond
  | "CHOSEN_CHARACTER_IN_DISCARD" // Chosen character in discard
  | "CHOSEN_CARD_IN_DISCARD" // Chosen card in discard
  | "CHOSEN_CARD_FROM_DISCARD" // Chosen card from discard (alias)
  | "ALL_CHARACTERS_WITH_NAME_IN_DISCARD" // All characters with named card in discard
  | "CHOSEN_CHARACTER_HERE" // Chosen character at this location
  | "CHARACTERS_WITH_SUPPORT_HERE" // Characters with Support at this location
  | "CHOSEN_ITEM_OR_LOCATION" // Chosen item or location
  | "CHOSEN_CHARACTER_ITEM_OR_LOCATION" // Chosen character, item, or location
  | "CHOSEN_CHARACTERS_OR_LOCATIONS" // Chosen characters or locations (plural)
  | "YOUR_VILLAIN_CHARACTERS" // Your Villain characters
  | "YOUR_ALIEN_CHARACTERS" // Your Alien characters
  | "YOUR_OTHER_FAIRY_CHARACTERS" // Your other Fairy characters
  | "YOUR_PUPPY_CHARACTERS" // Your Puppy characters
  | "YOUR_OTHER_HERO_CHARACTERS" // Your other Hero characters
  | "YOUR_ALLY_CHARACTERS" // Your Ally characters
  | "YOUR_OTHER_AMBER_CHARACTERS" // Your other Amber characters
  | "YOUR_OTHER_RUBY_CHARACTERS" // Your other Ruby characters
  | "YOUR_OTHER_SAPPHIRE_CHARACTERS" // Your other Sapphire characters
  | "YOUR_OTHER_EMERALD_CHARACTERS" // Your other Emerald characters
  | "YOUR_DETECTIVE_CHARACTERS" // Your Detective characters
  | "CHOSEN_DETECTIVE_CHARACTER" // Chosen Detective character
  | "CHOSEN_OPPOSING_DAMAGED_CHARACTER" // Chosen opposing damaged character
  | "CHOSEN_CHARACTERS" // Chosen characters (plural)
  | "OPPONENT_CHOSEN_CHARACTER" // Opponent's chosen character
  | "CHOSEN_OPPONENT" // Chosen opponent (for multiplayer)
  | "YOUR_CHARACTERS_OR_LOCATIONS" // Your characters or locations
  | "YOUR_CHARACTERS_OR_LOCATIONS_WITH_CARD_UNDER" // Your characters or locations with card under
  | "CHARACTERS_AT_LOCATION" // Characters at a location
  | "REVEALED_CARD" // The revealed card
  | "TOP_OF_DECK" // Top of deck
  // Additional targets for more card coverage
  | "CHARACTER_HERE" // Character at this location (singular)
  | "YOUR_PIRATE_CHARACTERS" // Your Pirate characters
  | "YOUR_HERO_CHARACTERS" // Your Hero characters
  | "YOUR_GARGOYLE_CHARACTERS" // Your Gargoyle characters
  | "YOUR_DEMONA_CHARACTERS" // Your Demona characters
  | "YOUR_OTHER_DETECTIVE_CHARACTERS" // Your other Detective characters
  | "YOUR_OTHER_AMETHYST_CHARACTERS" // Your other Amethyst characters
  | "YOUR_HAND" // Your hand (for card targets)
  | "TRIGGERING_CHARACTER" // The character that triggered the ability
  | "TRIGGERING_CARD" // The card that triggered the ability
  | "THAT_ITEM" // Reference to a previously mentioned item
  // More additional targets
  | "YOUR_OTHER_SAPPHIRE_CHARACTERS" // Your other Sapphire characters
  | "YOUR_OTHER_DETECTIVE_CHARACTERS" // Your other Detective characters
  | "SONG_CARD" // A song card
  | "RANDOM_CARDS_IN_INKWELL" // Random cards in inkwell
  | "YOUR_RECKLESS_CHARACTERS" // Your Reckless characters
  | "OPPOSING_DAMAGED_CHARACTERS" // Opposing damaged characters
  | "ALL_CARDS_IN_INKWELL"; // All cards in inkwell

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
  | "more-than" // Alias for greater
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
  | "CHOSEN_CHARACTER_OR_ITEM_COST_3_OR_LESS" // Character or item with cost 3 or less
  // Extended card targets for card text coverage
  | "CARD_FROM_ANY_DISCARD" // Card from any player's discard pile
  | "ACTION_FROM_DISCARD" // Action card from discard pile
  | "ITEM_FROM_DISCARD" // Item card from discard pile
  | "CHARACTER_OR_ITEM" // Character or item card
  | "BANISHED_CHARACTER"; // The character that was banished

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
