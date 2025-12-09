/**
 * Unified Target DSL - Core Types
 *
 * Game-agnostic targeting primitives that TCG engines can extend.
 * This module provides the foundational DSL structure for expressing
 * card and player targeting in a declarative, composable way.
 *
 * @module targeting/target-dsl
 */

import type { CardFilter } from "../filtering/card-filter";

// ============================================================================
// Selector: HOW targets are selected
// ============================================================================

/**
 * Selector scope determines how targets are selected from valid options
 *
 * @example
 * - "self": Target the source card itself
 * - "chosen": Player actively selects from valid targets
 * - "all": All matching cards are automatically targeted
 * - "each": Semantic alias for "all" (used in effect descriptions)
 * - "any": Single target, typically random or first-match
 * - "random": Explicitly random selection
 */
export type SelectorScope =
  | "self" // This card (the source of the ability)
  | "chosen" // Player chooses from valid options
  | "all" // All matching cards
  | "each" // Each matching (semantic alias for effects)
  | "any" // Any single matching card
  | "random"; // Random selection from valid options

// ============================================================================
// Owner Scope: WHOSE cards can be selected
// ============================================================================

/**
 * Owner scope determines which players' cards are valid targets
 */
export type OwnerScope =
  | "you" // Controller of source card
  | "opponent" // Opponent(s)
  | "any"; // Any player's cards

// ============================================================================
// Target Count: HOW MANY to select
// ============================================================================

/**
 * Target count specification with various semantics
 *
 * @example
 * - `1`: Exactly 1 target (required)
 * - `{ exactly: 2 }`: Exactly 2 targets
 * - `{ upTo: 3 }`: 0 to 3 targets (player chooses how many)
 * - `{ atLeast: 1 }`: 1 or more targets
 * - `{ between: [2, 4] }`: 2 to 4 targets
 * - `"all"`: All matching targets
 */
export type TargetCount =
  | number // Exact count (required)
  | { exactly: number } // Explicit exact count
  | { upTo: number } // 0 to N (optional up to max)
  | { atLeast: number } // N or more (minimum required)
  | { between: [number, number] } // Range [min, max]
  | "all"; // All matching

// ============================================================================
// Context References: Contextual card references
// ============================================================================

/**
 * Base context for targeting - game engines extend this
 *
 * Provides references to cards based on the current game context,
 * such as the trigger source, combat participants, etc.
 */
export interface BaseContext {
  /** Reference the source card itself */
  self?: boolean;
}

// ============================================================================
// Core Target DSL Structure
// ============================================================================

/**
 * Core Target DSL - The main targeting structure
 *
 * This generic type defines how targets are selected. Game-specific
 * engines extend the filter and context type parameters.
 *
 * @typeParam TFilter - Type of filters (extends CardFilter or game-specific)
 * @typeParam TContext - Type of context references
 *
 * @example Basic character targeting
 * ```typescript
 * const target: TargetDSL = {
 *   selector: "chosen",
 *   count: 1,
 *   owner: "opponent",
 *   zones: ["play"],
 *   cardTypes: ["character"]
 * };
 * ```
 *
 * @example Targeting with filters
 * ```typescript
 * const target: TargetDSL = {
 *   selector: "all",
 *   owner: "any",
 *   zones: ["play"],
 *   filter: { type: "creature", tapped: true }
 * };
 * ```
 */
export interface TargetDSL<
  TFilter = CardFilter,
  TContext extends BaseContext = BaseContext,
> {
  /** How targets are selected (chosen, all, self, etc.) */
  selector: SelectorScope;

  /** How many targets to select */
  count?: TargetCount;

  /** Whose cards can be targeted */
  owner?: OwnerScope;

  /** Which zones to search for targets */
  zones?: string[];

  /** Card type restriction (game-specific type names) */
  cardTypes?: string[];

  /** Additional filter criteria (merged with base filter) */
  filter?: TFilter;

  /** Context references (self, trigger-source, etc.) */
  context?: TContext;

  /** Exclude the source card from valid targets */
  excludeSelf?: boolean;

  /** All selected targets must be different cards */
  requireDifferentTargets?: boolean;
}

// ============================================================================
// UI Hint Types
// ============================================================================

/**
 * UI hints for target selection interfaces
 *
 * Games can use these to generate appropriate selection UI
 */
export interface TargetingUIHint {
  /** Type of selection UI to show */
  selectionType: "single" | "multiple" | "automatic" | "none";

  /** Minimum number of selections required */
  minSelections: number;

  /** Maximum number of selections allowed */
  maxSelections: number | "unlimited";

  /** Human-readable prompt for the player */
  prompt: string;

  /** Whether selection is optional (can select 0) */
  optional: boolean;

  /** Zone(s) to highlight in the UI */
  highlightZones: string[];
}

// ============================================================================
// Player Targeting
// ============================================================================

/**
 * Player target specification (separate from card targeting)
 *
 * Used when effects target players rather than cards.
 *
 * @example
 * - "controller": The player who controls the source card
 * - "opponent": A single opponent
 * - "each-player": All players
 * - "each-opponent": All opponents
 * - "chosen-player": Player selects which player to target
 */
export type PlayerTargetDSL =
  | "controller" // Player who controls the source
  | "opponent" // Single opponent (or active opponent in 1v1)
  | "each-player" // All players including controller
  | "each-opponent" // All opponents
  | "chosen-player"; // Controller chooses which player

// ============================================================================
// Type Utilities
// ============================================================================

/**
 * Extract the minimum count from a TargetCount specification
 */
export function getMinCount(count: TargetCount | undefined): number {
  if (count === undefined) return 1;
  if (count === "all") return 0;
  if (typeof count === "number") return count;
  if ("exactly" in count) return count.exactly;
  if ("upTo" in count) return 0;
  if ("atLeast" in count) return count.atLeast;
  if ("between" in count) return count.between[0];
  return 0;
}

/**
 * Extract the maximum count from a TargetCount specification
 */
export function getMaxCount(
  count: TargetCount | undefined,
): number | "unlimited" {
  if (count === undefined) return 1;
  if (count === "all") return "unlimited";
  if (typeof count === "number") return count;
  if ("exactly" in count) return count.exactly;
  if ("upTo" in count) return count.upTo;
  if ("atLeast" in count) return "unlimited";
  if ("between" in count) return count.between[1];
  return 1;
}

/**
 * Check if a target count is optional (allows selecting 0)
 */
export function isOptionalCount(count: TargetCount | undefined): boolean {
  return getMinCount(count) === 0;
}

/**
 * Check if a selector requires player interaction
 */
export function requiresPlayerChoice(selector: SelectorScope): boolean {
  return selector === "chosen";
}

/**
 * Check if a selector targets multiple cards
 */
export function isMultipleTargetSelector(selector: SelectorScope): boolean {
  return selector === "all" || selector === "each";
}

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default target DSL for a single chosen card
 */
export const DEFAULT_SINGLE_TARGET: Partial<TargetDSL> = {
  selector: "chosen",
  count: 1,
  owner: "any",
};

/**
 * Default target DSL for self-targeting
 */
export const DEFAULT_SELF_TARGET: Partial<TargetDSL> = {
  selector: "self",
  count: 1,
  context: { self: true },
};
