/**
 * Gundam Target DSL
 *
 * Extends the core Target DSL with Gundam-specific targeting capabilities:
 * - Game-specific filters (damaged, exerted, keywords, etc.)
 * - Context references (trigger-source, attacker, defender)
 * - Card type constraints (unit, shield, base, command)
 *
 * @module targeting/gundam-target-dsl
 */

import type { BaseContext, PlayerTargetDSL, TargetDSL } from "@tcg/core";

/** Gundam locations IDs */
export type GundamLocationsId =
  | "deckArea"
  | "resourceDeckArea"
  | "resourceArea"
  | "battleArea"
  | "shieldArea"
  | "removalArea"
  | "trashArea"
  | "handArea";

// ============================================================================
// Gundam-Specific Filters
// ============================================================================

// --- State Filters ---

/**
 * Filter for damaged cards (have damage counters)
 */
export interface DamagedFilter {
  type: "damaged";
}

/**
 * Filter for undamaged cards (no damage counters)
 */
export interface UndamagedFilter {
  type: "undamaged";
}

/**
 * Filter for exerted cards
 */
export interface ExertedFilter {
  type: "exerted";
}

/**
 * Filter for ready (non-exerted) cards
 */
export interface ReadyFilter {
  type: "ready";
}

/**
 * Filter for dry cards (freshly played, can't be used)
 */
export interface DryFilter {
  type: "dry";
}

// --- Property Filters ---

/**
 * Filter for cards with a specific classification (Hero, Villain, etc.)
 */
export interface HasClassificationFilter {
  type: "has-classification";
  classification: string;
}

// --- Numeric Comparison Filters ---

type ComparisonOperator = "eq" | "ne" | "gt" | "gte" | "lt" | "lte";

/**
 * Filter by AP value
 */
export interface ApFilter {
  type: "ap";
  comparison: ComparisonOperator;
  value: number;
  /** Ignore temporary bonuses when comparing */
  ignoreBonuses?: boolean;
}

/**
 * Filter by willpower value
 */
export interface HpFilter {
  type: "hp";
  comparison: ComparisonOperator;
  value: number;
}

/**
 * Filter by cost
 */
export interface CostFilter {
  type: "cost";
  comparison: ComparisonOperator;
  value: number;
}

// --- Name Filters ---

/**
 * Filter by card name
 */
export type NameFilter = { type: "name"; equals: string } | { type: "name"; contains: string };

// --- Combined Gundam Filter Type ---

/**
 * All Gundam-specific filters
 */
export type GundamFilter =
  // State filters
  | DamagedFilter
  | UndamagedFilter
  | ExertedFilter
  | ReadyFilter
  | DryFilter
  // Property filters
  | HasClassificationFilter
  // Numeric filters
  | ApFilter
  | HpFilter
  | CostFilter
  // Name filter
  | NameFilter
  // Composite filters
  | { type: "and"; filters: GundamFilter[] }
  | { type: "or"; filters: GundamFilter[] }
  | { type: "not"; filter: GundamFilter };

// ============================================================================
// Gundam Context References
// ============================================================================

/**
 * Context references for Gundam abilities
 *
 * These allow effects to reference cards based on the current context
 * rather than requiring explicit targeting.
 */
export interface GundamContext extends BaseContext {
  /** Reference the source card itself */
  self?: boolean;

  /** Reference the card that triggered this ability */
  triggerSource?: boolean;

  /** Reference the attacker in a challenge */
  attacker?: boolean;

  /** Reference the defender in a battle */
  defender?: boolean;

  /** Reference the previously selected target in an effect chain */
  previousTarget?: boolean;
}

// ============================================================================
// Gundam Card Types
// ============================================================================

/**
 * Gundam card types for targeting
 */
export type GundamCardType = "unit" | "shield" | "base" | "command";

// ============================================================================
// Gundam Target DSL
// ============================================================================

/**
 * Gundam card target - extends core DSL with Gundam-specific features
 *
 * @example Target a chosen opposing damaged character
 *   cardType: "unit",
 * const target: GundamCardTarget = {
 *   selector: "chosen",
 *   count: 1,
 *   owner: "opponent",
 *   cardType: "character",
 *   zones: ["play"],
 *   filters: [{ type: "damaged" }]
 * };
 * ```
 *
 * @example Target all your characters with Evasive
 * ```typescript
 * const target: GundamCardTarget = {
 *   selector: "all",
 *   owner: "you",
 *   cardType: "character",
 *   zones: ["play"],
 *   filters: [{ type: "has-keyword", keyword: "Evasive" }]
 * };
 * ```
 */
export interface GundamCardTarget extends TargetDSL<GundamFilter, GundamContext> {
  /** Gundam card type constraint */
  cardType?: GundamCardType;

  /** Override zones with Gundam-specific zone IDs */
  zones?: GundamLocationsId[];

  /** Gundam-specific filters */
  filters?: GundamFilter[];
}

// ============================================================================
// Target Query (New Standard)
// ============================================================================

/**
 * Structured target query used in the new Effect system.
 * Provides a stricter, more expressive way to define targeting requirements.
 */
export interface TargetQuery {
  controller: "SELF" | "OPPONENT" | "ANY";
  cardType?: "UNIT" | "PILOT" | "BASE" | "COMMAND";
  filters?: GundamFilter[];
  count?: { min: number; max: number };
  zone?: GundamLocationsId[];
}

// ============================================================================
// Convenience Type Aliases
// ============================================================================

/**
 * Unit target (card type constrained)
 */
export type UnitTarget = GundamCardTarget & { cardType: "unit" };

/**
 * Base target (card type constrained)
 */
export type BaseTarget = GundamCardTarget & { cardType: "base" };

// ============================================================================
// Player Targeting (re-export with Gundam context)
// ============================================================================

/**
 * Gundam player target
 *
 * Uses the core PlayerTargetDSL with Gundam terminology
 */
export type GundamPlayerTarget = PlayerTargetDSL;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a target is a DSL object (vs enum string)
 */
export function isDSLTarget(target: GundamTarget): target is GundamCardTarget {
  return typeof target === "object" && target !== null;
}

/**
 * Check if a filter is a state filter
 */
export function isStateFilter(
  filter: GundamFilter,
): filter is DamagedFilter | UndamagedFilter | ExertedFilter | ReadyFilter | DryFilter {
  return (
    filter.type === "damaged" ||
    filter.type === "undamaged" ||
    filter.type === "exerted" ||
    filter.type === "ready" ||
    filter.type === "dry"
  );
}

/**
 * Check if a filter is a numeric comparison filter
 */
export function isNumericFilter(filter: GundamFilter): filter is ApFilter | HpFilter | CostFilter {
  return filter.type === "ap" || filter.type === "hp" || filter.type === "cost";
}

// ============================================================================
// Union Types (enum OR DSL)
// ============================================================================

/**
 * Unit target: either an enum shortcut or full DSL
 */
export type GundamUnitTarget = UnitTarget;

/**
 * Base target: either an enum shortcut or full DSL
 */
export type GundamBaseTarget = BaseTarget;

/**
 * Any card target
 */
export type GundamTarget = GundamUnitTarget | GundamBaseTarget | GundamCardTarget | TargetQuery;
