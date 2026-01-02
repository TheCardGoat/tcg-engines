/**
 * Unified Target DSL - Core Types
 *
 * Game-agnostic targeting primitives that TCG engines can extend.
 * This module provides the foundational DSL structure for expressing
 * card and player targeting in a declarative, composable way.
 *
 * This file re-exports the core DSL types from @tcg/core-types and
 * provides additional utilities specific to @tcg/core.
 *
 * @module targeting/target-dsl
 */

// Import types for use within this file
import type {
  BaseContext,
  TargetDSL as BaseTargetDSL,
  SelectorScope,
  TargetCount,
} from "@tcg/core-types";
import type { CardFilter } from "../filtering/card-filter";

// Re-export core types from @tcg/core-types
export type {
  BaseContext,
  OwnerScope,
  SelectorScope,
  TargetCount,
} from "@tcg/core-types";

// ============================================================================
// Core Target DSL Structure (with CardFilter default)
// ============================================================================

/**
 * Core Target DSL - The main targeting structure
 *
 * This generic type defines how targets are selected. Game-specific
 * engines extend the filter and context type parameters.
 *
 * This version defaults TFilter to CardFilter for use within @tcg/core.
 * For packages that don't have CardFilter, import from @tcg/core-types instead.
 *
 * @typeParam TFilter - Type of filters (defaults to CardFilter)
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
> extends BaseTargetDSL<TFilter, TContext> {}

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
