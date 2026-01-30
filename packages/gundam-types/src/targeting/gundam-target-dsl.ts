/**
 * Target Types for Gundam Effects
 *
 * Defines how effects select their targets. Uses a hybrid approach:
 * - Common targeting patterns as string literal enums for simplicity
 * - Complex targeting with query-based filters for advanced cases
 *
 * @example Simple targeting
 * ```typescript
 * const target: UnitTarget = "CHOSEN_UNIT";
 * ```
 *
 * @example Complex targeting with filters
 * ```typescript
 * const target: UnitTarget = {
 *   selector: "chosen",
 *   owner: "opponent",
 *   filter: [{ type: "damaged" }, { type: "hp-comparison", comparison: "less-or-equal", value: 3 }]
 * };
 * ```
 */

import type { TargetDSL } from "@tcg/core";

// ============================================================================
// Player Targeting
// ============================================================================

/**
 * Player target - who is affected by the ability
 *
 * @example "draw 2 cards" targets CONTROLLER
 * @example "each opponent loses 1 shield" targets EACH_OPPONENT
 */

export type PlayerTarget =
  | "CONTROLLER" // The player who controls this card
  | "OPPONENT" // A single opponent (2-player default)
  | "OPPONENTS" // All opponents (alias for EACH_OPPONENT in 2-player)
  | "EACH_PLAYER" // All players including controller
  | "EACH_OPPONENT" // All opponents
  | "CHOSEN_PLAYER" // A player chosen by the controller
  | "CARD_OWNER" // The owner of the target card (context-dependent)
  | "ALL_PLAYERS" // All players (for effects like "each player discards")
  | "SELF"; // Self reference (for gain lore effects on self)

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
  | { ref: "attacker" } // Unit attacking
  | { ref: "defender" } // Unit being attacked

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
// Gundam Context References
// ============================================================================

/**
 * Context references for Gundam abilities
 *
 * These allow effects to reference cards based on the current context
 * rather than requiring explicit targeting.
 */
export interface GundamContext {
  /** Reference the source card itself */
  self?: boolean;
}

// ============================================================================
// Unit Targeting - Query-Based (Complex)
// ============================================================================

/**
 * Zone where targets can be found
 */
export type TargetZone =
  | "battleArea"
  | "hand"
  | "trashArea"
  | "deck"
  | "shieldArea";

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
// Shared Filter Types
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

export interface RestedFilter {
  type: "rested";
}

export interface ActiveFilter {
  type: "active";
}

// Property filters
export interface HasKeywordFilter {
  type: "has-keyword";
  keyword: string;
}

export interface HasTraitsFilter {
  type: "has-traits";
  traits: string;
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

export interface ApComparisonFilter {
  type: "ap-comparison";
  comparison: ComparisonOperator;
  value: number;
}

export interface HpComparisonFilter {
  type: "hp-comparison";
  comparison: ComparisonOperator;
  value: number;
}

export interface LevelComparisonFilter {
  type: "level-comparison";
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
export type AttributeFilter = AttributeNumericFilter | AttributeStringFilter;

export interface AttributeNumericFilter {
  type: "attribute";
  attribute: "cost" | "ap" | "hp" | "level";
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

/**
 * All filters that can be applied to any card type
 * Specific card types may only support a subset
 */
export type CardFilter =
  // State
  | UndamagedFilter
  // Property
  | HasKeywordFilter
  | HasTraitsFilter
  | HasNameFilter
  // Numeric
  | CostComparisonFilter
  | ApComparisonFilter
  | HpComparisonFilter
  | LevelComparisonFilter
  // Source/Reference
  | SourceFilter
  // Zone/Owner
  | ZoneFilter
  | OwnerFilter
  // Generic Attribute
  | AttributeFilter;

/**
 * Filters applicable to units
 * (all except move-cost which is location-specific)
 */
export type UnitFilter =
  // State
  | DamagedFilter
  | UndamagedFilter
  | RestedFilter
  | ActiveFilter
  // Property
  | HasKeywordFilter
  | HasTraitsFilter
  | HasNameFilter
  // Numeric comparisons
  | CostComparisonFilter
  | ApComparisonFilter
  | HpComparisonFilter
  | LevelComparisonFilter
  // Source/Reference
  | SourceFilter
  // Zone/Owner
  | ZoneFilter
  | OwnerFilter
  // Generic Attribute
  | AttributeFilter;

// ============================================================================
// Unit Targeting - Strict Query Variants
// ============================================================================

/**
 * Base properties shared by all unit query variants
 * Extended from generic TargetDSL
 */
export type UnitQueryBase = TargetDSL<UnitFilter[], GundamContext>;

/**
 * Target exactly N unit
 *
 * @example Target exactly 2 unit
 * ```typescript
 * {
 *   selector: "chosen",
 *   count: { exactly: 2 },
 *   owner: "opponent"
 * }
 * ```
 */
export interface ExactCountUnitQuery extends UnitQueryBase {
  count: number | { exactly: number };
}

/**
 * Target up to N units (player chooses 0 to maxCount)
 *
 * @example Target up to 2 damaged opposing units
 * ```typescript
 * {
 *   selector: "chosen",
 *   owner: "opponent",
 *   filter: [{ type: "damaged" }],
 *   count: { upTo: 2 }
 * }
 * ```
 */
export interface UpToCountUnitQuery extends UnitQueryBase {
  count: { upTo: number };
}

/**
 * Target all matching units
 *
 * @example Target all opposing units
 * ```typescript
 * {
 *   selector: "all",
 *   owner: "opponent"
 * }
 * ```
 */
export interface AllMatchingUnitQuery extends UnitQueryBase {
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
export type UnitTargetQuery =
  | ExactCountUnitQuery
  | UpToCountUnitQuery
  | AllMatchingUnitQuery;

/**
 * Union type for all character targeting options
 */
export type UnitTarget = UnitTargetQuery | CardReference;

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
  // Extended card targets for card text coverage
  | "CARD_FROM_ANY_DISCARD" // Card from any player's discard pile
  | "COMMAND_FROM_DISCARD" // Command card from discard pile
  | "BASE_FROM_DISCARD"; // Base card from discard pile

export type CardTarget = CardTargetEnum | UnitTarget;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a unit target is a query (vs enum)
 */
export function isUnitTargetQuery(
  target: UnitTarget,
): target is UnitTargetQuery {
  return typeof target === "object"; // && (target as any).selector !== undefined;
}
