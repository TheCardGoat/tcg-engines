/**
 * Riftbound Target DSL Type Definitions
 *
 * Domain-specific language for targeting cards, players, and locations.
 * This is a comprehensive targeting system that supports:
 * - Controller filtering (friendly, enemy, any)
 * - Card type filtering (unit, gear, spell, etc.)
 * - Location filtering (base, battlefield, here, etc.)
 * - State filtering (mighty, buffed, damaged, etc.)
 * - Quantity specification (one, all, up to X)
 */

// ============================================================================
// Controller Types
// ============================================================================

/**
 * Who controls the target
 */
export type TargetController =
  | "friendly" // Your cards
  | "enemy" // Opponent's cards
  | "opponent" // Alias for enemy
  | "any"; // Any player's cards

// ============================================================================
// Card Types
// ============================================================================

/**
 * Types of cards that can be targeted
 */
export type CardType =
  | "unit" // Units (characters)
  | "gear" // Gear cards (equipment + other gear)
  | "equipment" // Equipment specifically
  | "spell" // Spell cards
  | "legend" // Legend cards
  | "rune" // Rune cards
  | "card" // Any card type
  | "permanent"; // Any permanent (unit, gear, legend)

// ============================================================================
// Location Types
// ============================================================================

/**
 * Where the target is located
 */
export type Location =
  | "base" // Player's base zone
  | "battlefield" // Any battlefield
  | "here" // Same location as source
  | "trash" // Discard pile
  | "hand" // Player's hand
  | "deck" // Main deck
  | "rune-deck" // Rune deck
  | "champion-zone" // Champion zone
  | "anywhere" // Any location
  | "same" // Same location as another target
  | BattlefieldLocation;

/**
 * Specific battlefield location
 */
export interface BattlefieldLocation {
  readonly battlefield: "controlled" | "enemy" | "open" | "contested" | "any";
}

/**
 * Type guard for battlefield location
 */
export function isBattlefieldLocation(location: Location): location is BattlefieldLocation {
  return typeof location === "object" && "battlefield" in location;
}

// ============================================================================
// Filter Types
// ============================================================================

/**
 * Simple state filters (string literals)
 */
export type SimpleFilter =
  | "mighty" // 5+ Might
  | "buffed" // Has a buff
  | "damaged" // Has damage
  | "stunned" // Is stunned
  | "ready" // Is ready (not exhausted)
  | "exhausted" // Is exhausted
  | "token" // Is a token
  | "equipped" // Has equipment attached
  | "attacking" // Is currently attacking
  | "defending" // Is currently defending
  | "alone" // Only unit at location
  | "facedown"; // Is face down (hidden)

/**
 * Tag filter - matches cards with specific tags
 */
export interface TagFilter {
  readonly tag: string; // E.g., "Mech", "Dragon", "Sand Soldier"
}

/**
 * Might comparison filter
 */
export interface MightFilter {
  readonly might: Comparison;
}

/**
 * Cost comparison filter
 */
export interface CostFilter {
  readonly cost: Comparison;
}

/**
 * Energy cost comparison filter
 */
export interface EnergyCostFilter {
  readonly energyCost: Comparison;
}

/**
 * Power cost comparison filter
 */
export interface PowerCostFilter {
  readonly powerCost: Comparison;
}

/**
 * Keyword filter - has specific keyword
 */
export interface KeywordFilter {
  readonly keyword: string;
}

/**
 * Name filter - matches card name
 */
export interface NameFilter {
  readonly name: string;
}

/**
 * Comparison operators for numeric filters
 */
export interface Comparison {
  readonly eq?: number; // Equal to
  readonly lt?: number; // Less than
  readonly lte?: number; // Less than or equal
  readonly gt?: number; // Greater than
  readonly gte?: number; // Greater than or equal
}

/**
 * All filter types
 */
export type Filter =
  | SimpleFilter
  | TagFilter
  | MightFilter
  | CostFilter
  | EnergyCostFilter
  | PowerCostFilter
  | KeywordFilter
  | NameFilter;

/**
 * Type guard for simple filters
 */
export function isSimpleFilter(filter: Filter): filter is SimpleFilter {
  return typeof filter === "string";
}

/**
 * Type guard for tag filters
 */
export function isTagFilter(filter: Filter): filter is TagFilter {
  return typeof filter === "object" && "tag" in filter;
}

/**
 * Type guard for might filters
 */
export function isMightFilter(filter: Filter): filter is MightFilter {
  return typeof filter === "object" && "might" in filter;
}

/**
 * Type guard for keyword filters
 */
export function isKeywordFilter(filter: Filter): filter is KeywordFilter {
  return typeof filter === "object" && "keyword" in filter;
}

// ============================================================================
// Quantity Types
// ============================================================================

/**
 * How many targets to select
 */
export type Quantity =
  | number // Exactly N
  | "all" // All matching
  | "any" // Any number (player chooses)
  | QuantityRange;

/**
 * Range-based quantity
 */
export interface QuantityRange {
  readonly upTo?: number; // Up to N
  readonly atLeast?: number; // At least N
  readonly exactly?: number; // Exactly N
}

/**
 * Type guard for quantity range
 */
export function isQuantityRange(quantity: Quantity): quantity is QuantityRange {
  return typeof quantity === "object";
}

// ============================================================================
// Target Definition
// ============================================================================

/**
 * Complete target specification
 *
 * @example "a unit at a battlefield"
 * { type: "unit", location: "battlefield" }
 *
 * @example "all enemy units here"
 * { type: "unit", controller: "enemy", location: "here", quantity: "all" }
 *
 * @example "a friendly unit with 3 Might or less"
 * { type: "unit", controller: "friendly", filter: { might: { lte: 3 } } }
 *
 * @example "your Mechs"
 * { type: "unit", controller: "friendly", filter: { tag: "Mech" }, quantity: "all" }
 */
export interface Target {
  /** Type of card to target */
  readonly type: CardType;

  /** Who controls the target */
  readonly controller?: TargetController;

  /** Where the target is located */
  readonly location?: Location;

  /** Additional filters */
  readonly filter?: Filter | Filter[];

  /** How many to target */
  readonly quantity?: Quantity;

  /** Exclude the source card from targeting */
  readonly excludeSelf?: boolean;

  /** Optional targeting (player may choose not to target) */
  readonly optional?: boolean;
}

/**
 * Player target specification
 */
export interface PlayerTarget {
  readonly type: "player";
  readonly which: "self" | "opponent" | "each" | "any" | "all";
}

/**
 * Self reference (the source card)
 */
export interface SelfTarget {
  readonly type: "self";
}

/**
 * Trigger source reference (for triggered abilities)
 */
export interface TriggerSourceTarget {
  readonly type: "trigger-source";
}

/**
 * Last target reference (for chained effects)
 */
export interface LastTargetRef {
  readonly type: "last-target";
}

/**
 * All target types
 */
export type AnyTarget =
  | Target
  | PlayerTarget
  | SelfTarget
  | TriggerSourceTarget
  | LastTargetRef
  | "self"
  | "controller"
  | "opponent";

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if target is a card target
 */
export function isCardTarget(target: AnyTarget): target is Target {
  return (
    typeof target === "object" &&
    "type" in target &&
    target.type !== "player" &&
    target.type !== "self" &&
    target.type !== "trigger-source" &&
    target.type !== "last-target"
  );
}

/**
 * Check if target is a player target
 */
export function isPlayerTarget(target: AnyTarget): target is PlayerTarget {
  return typeof target === "object" && "type" in target && target.type === "player";
}

/**
 * Check if target is self
 */
export function isSelfTarget(target: AnyTarget): target is SelfTarget | "self" {
  return (
    target === "self" || (typeof target === "object" && "type" in target && target.type === "self")
  );
}

/**
 * Check if target is trigger source
 */
export function isTriggerSourceTarget(target: AnyTarget): target is TriggerSourceTarget {
  return typeof target === "object" && "type" in target && target.type === "trigger-source";
}

// ============================================================================
// Builder Functions
// ============================================================================

/**
 * Create a unit target
 */
export function unit(options?: Partial<Omit<Target, "type">>): Target {
  return { type: "unit", ...options };
}

/**
 * Create a gear target
 */
export function gear(options?: Partial<Omit<Target, "type">>): Target {
  return { type: "gear", ...options };
}

/**
 * Create an equipment target
 */
export function equipment(options?: Partial<Omit<Target, "type">>): Target {
  return { type: "equipment", ...options };
}

/**
 * Create a friendly unit target
 */
export function friendlyUnit(options?: Partial<Omit<Target, "type" | "controller">>): Target {
  return { controller: "friendly", type: "unit", ...options };
}

/**
 * Create an enemy unit target
 */
export function enemyUnit(options?: Partial<Omit<Target, "type" | "controller">>): Target {
  return { controller: "enemy", type: "unit", ...options };
}

/**
 * Create a unit at battlefield target
 */
export function unitAtBattlefield(options?: Partial<Omit<Target, "type" | "location">>): Target {
  return { location: "battlefield", type: "unit", ...options };
}

/**
 * Create a unit here (same location) target
 */
export function unitHere(options?: Partial<Omit<Target, "type" | "location">>): Target {
  return { location: "here", type: "unit", ...options };
}
