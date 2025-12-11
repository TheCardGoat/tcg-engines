/**
 * Lorcana Target DSL
 *
 * Extends the core Target DSL with Lorcana-specific targeting capabilities:
 * - Game-specific filters (damaged, exerted, keywords, etc.)
 * - Context references (trigger-source, attacker, defender)
 * - Card type constraints (character, item, location, action)
 *
 * @module targeting/lorcana-target-dsl
 */

import type {
  BaseContext,
  OwnerScope,
  PlayerTargetDSL,
  SelectorScope,
  TargetCount,
  TargetDSL,
} from "@tcg/core";
import type { KeywordType } from "../types/keywords";

/** Lorcana zone IDs */
export type LorcanaZoneId = "deck" | "hand" | "play" | "discard" | "inkwell";

// ============================================================================
// Lorcana-Specific Filters
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
 * Filter for cards with a specific keyword
 */
export interface HasKeywordFilter {
  type: "has-keyword";
  keyword: KeywordType;
}

/**
 * Filter for cards with a specific classification (Hero, Villain, etc.)
 */
export interface HasClassificationFilter {
  type: "has-classification";
  classification: string;
}

/**
 * Filter for inkable/non-inkable cards
 */
export interface InkableFilter {
  type: "inkable";
  value: boolean;
}

// --- Numeric Comparison Filters ---

type ComparisonOperator = "eq" | "ne" | "gt" | "gte" | "lt" | "lte";

/**
 * Filter by strength value
 */
export interface StrengthFilter {
  type: "strength";
  comparison: ComparisonOperator;
  value: number;
  /** Ignore temporary bonuses when comparing */
  ignoreBonuses?: boolean;
}

/**
 * Filter by willpower value
 */
export interface WillpowerFilter {
  type: "willpower";
  comparison: ComparisonOperator;
  value: number;
}

/**
 * Filter by ink cost
 */
export interface CostFilter {
  type: "cost";
  comparison: ComparisonOperator;
  value: number;
}

/**
 * Filter by lore value
 */
export interface LoreValueFilter {
  type: "lore-value";
  comparison: ComparisonOperator;
  value: number;
}

// --- Location Filters ---

/**
 * Filter for characters at a location
 */
export interface AtLocationFilter {
  type: "at-location";
  /** Specific location name, or undefined for any location */
  location?: string;
}

/**
 * Filter by move cost (for locations)
 */
export interface MoveCostFilter {
  type: "move-cost";
  comparison: ComparisonOperator;
  value: number;
}

// --- Name Filters ---

/**
 * Filter by card name
 */
export type NameFilter =
  | { type: "name"; equals: string }
  | { type: "name"; contains: string };

// --- Combined Lorcana Filter Type ---

/**
 * All Lorcana-specific filters
 */
export type LorcanaFilter =
  // State filters
  | DamagedFilter
  | UndamagedFilter
  | ExertedFilter
  | ReadyFilter
  | DryFilter
  // Property filters
  | HasKeywordFilter
  | HasClassificationFilter
  | InkableFilter
  // Numeric filters
  | StrengthFilter
  | WillpowerFilter
  | CostFilter
  | LoreValueFilter
  // Location filters
  | AtLocationFilter
  | MoveCostFilter
  // Name filter
  | NameFilter
  // Composite filters
  | { type: "and"; filters: LorcanaFilter[] }
  | { type: "or"; filters: LorcanaFilter[] }
  | { type: "not"; filter: LorcanaFilter };

// ============================================================================
// Lorcana Context References
// ============================================================================

/**
 * Context references for Lorcana abilities
 *
 * These allow effects to reference cards based on the current context
 * rather than requiring explicit targeting.
 */
export interface LorcanaContext extends BaseContext {
  /** Reference the source card itself */
  self?: boolean;

  /** Reference the card that triggered this ability */
  triggerSource?: boolean;

  /** Reference the attacker in a challenge */
  attacker?: boolean;

  /** Reference the defender in a challenge */
  defender?: boolean;

  /** Reference the previously selected target in an effect chain */
  previousTarget?: boolean;

  /** Reference the singer in a song */
  singer?: boolean;

  /** Reference the song being sung */
  song?: boolean;
}

// ============================================================================
// Lorcana Card Types
// ============================================================================

/**
 * Lorcana card types for targeting
 */
export type LorcanaCardType = "character" | "item" | "location" | "action";

// ============================================================================
// Lorcana Target DSL
// ============================================================================

/**
 * Lorcana card target - extends core DSL with Lorcana-specific features
 *
 * @example Target a chosen opposing damaged character
 * ```typescript
 * const target: LorcanaCardTarget = {
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
 * const target: LorcanaCardTarget = {
 *   selector: "all",
 *   owner: "you",
 *   cardType: "character",
 *   zones: ["play"],
 *   filters: [{ type: "has-keyword", keyword: "Evasive" }]
 * };
 * ```
 */
export interface LorcanaCardTarget
  extends TargetDSL<LorcanaFilter, LorcanaContext> {
  /** Lorcana card type constraint */
  cardType?: LorcanaCardType;

  /** Override zones with Lorcana-specific zone IDs */
  zones?: LorcanaZoneId[];

  /** Lorcana-specific filters */
  filters?: LorcanaFilter[];
}

// ============================================================================
// Convenience Type Aliases
// ============================================================================

/**
 * Character target (card type constrained)
 */
export type CharacterTarget = LorcanaCardTarget & { cardType: "character" };

/**
 * Item target (card type constrained)
 */
export type ItemTarget = LorcanaCardTarget & { cardType: "item" };

/**
 * Location target (card type constrained)
 */
export type LocationTarget = LorcanaCardTarget & { cardType: "location" };

// ============================================================================
// Player Targeting (re-export with Lorcana context)
// ============================================================================

/**
 * Lorcana player target
 *
 * Uses the core PlayerTargetDSL with Lorcana terminology
 */
export type LorcanaPlayerTarget = PlayerTargetDSL;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a target is a DSL object (vs enum string)
 */
export function isDSLTarget(
  target: LorcanaTarget,
): target is LorcanaCardTarget {
  return typeof target === "object" && target !== null;
}

/**
 * Check if a filter is a state filter
 */
export function isStateFilter(
  filter: LorcanaFilter,
): filter is
  | DamagedFilter
  | UndamagedFilter
  | ExertedFilter
  | ReadyFilter
  | DryFilter {
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
export function isNumericFilter(
  filter: LorcanaFilter,
): filter is
  | StrengthFilter
  | WillpowerFilter
  | CostFilter
  | LoreValueFilter
  | MoveCostFilter {
  return (
    filter.type === "strength" ||
    filter.type === "willpower" ||
    filter.type === "cost" ||
    filter.type === "lore-value" ||
    filter.type === "move-cost"
  );
}

// ============================================================================
// Enum Shortcuts (defined here, expanded in enum-expansion.ts)
// ============================================================================

/**
 * Character target enum shortcuts
 *
 * These provide syntactic sugar for common targeting patterns.
 * Use these for simple cases, use LorcanaCardTarget for complex cases.
 */
export type CharacterTargetEnum =
  // Self-referential
  | "SELF"
  | "THIS_CHARACTER"

  // Chosen (requires player choice)
  | "CHOSEN_CHARACTER"
  | "CHOSEN_OPPOSING_CHARACTER"
  | "CHOSEN_CHARACTER_OF_YOURS"
  | "ANOTHER_CHOSEN_CHARACTER"
  | "ANOTHER_CHOSEN_CHARACTER_OF_YOURS"

  // All/Each (affects multiple)
  | "ALL_CHARACTERS"
  | "ALL_OPPOSING_CHARACTERS"
  | "YOUR_CHARACTERS"
  | "YOUR_OTHER_CHARACTERS"
  | "EACH_CHARACTER"
  | "EACH_OPPOSING_CHARACTER"

  // Damaged variants
  | "CHOSEN_DAMAGED_CHARACTER"
  | "CHOSEN_OPPOSING_DAMAGED_CHARACTER"
  | "ALL_OPPOSING_DAMAGED_CHARACTERS";

/**
 * Item target enum shortcuts
 */
export type ItemTargetEnum =
  | "CHOSEN_ITEM"
  | "CHOSEN_OPPOSING_ITEM"
  | "YOUR_ITEMS"
  | "ALL_ITEMS"
  | "ALL_OPPOSING_ITEMS"
  | "THIS_ITEM";

/**
 * Location target enum shortcuts
 */
export type LocationTargetEnum =
  | "CHOSEN_LOCATION"
  | "CHOSEN_OPPOSING_LOCATION"
  | "YOUR_LOCATIONS"
  | "ALL_OPPOSING_LOCATIONS"
  | "THIS_LOCATION";

// ============================================================================
// Union Types (enum OR DSL)
// ============================================================================

/**
 * Character target: either an enum shortcut or full DSL
 */
export type LorcanaCharacterTarget = CharacterTargetEnum | CharacterTarget;

/**
 * Item target: either an enum shortcut or full DSL
 */
export type LorcanaItemTarget = ItemTargetEnum | ItemTarget;

/**
 * Location target: either an enum shortcut or full DSL
 */
export type LorcanaLocationTarget = LocationTargetEnum | LocationTarget;

/**
 * Any card target
 */
export type LorcanaTarget =
  | LorcanaCharacterTarget
  | LorcanaItemTarget
  | LorcanaLocationTarget
  | LorcanaCardTarget;
