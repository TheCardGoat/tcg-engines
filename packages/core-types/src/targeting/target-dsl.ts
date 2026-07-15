/**
 * Unified Target DSL - Core Types
 *
 * Game-agnostic targeting primitives that TCG engines can extend.
 * This module provides the foundational DSL structure for expressing
 * card and player targeting in a declarative, composable way.
 *
 * @module targeting/target-dsl
 */

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
 * @typeParam TFilter - Type of filters (game-specific filter types)
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
export interface TargetDSL<TFilter = unknown, TContext extends BaseContext = BaseContext> {
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
// Player Target DSL
// ============================================================================

/**
 * Player targeting scope
 */
export type PlayerTargetScope =
  | "you" // The controller
  | "opponent" // Single opponent
  | "each-opponent" // All opponents (multiplayer)
  | "each-player" // All players including self
  | "chosen"; // Player chooses a player

/**
 * Player targeting DSL for effects that target players
 *
 * @example Target opponent
 * ```typescript
 * const target: PlayerTargetDSL = {
 *   selector: "opponent"
 * };
 * ```
 */
export interface PlayerTargetDSL {
  /** Which player(s) to target */
  selector: PlayerTargetScope;

  /** Count of players to target (for "chosen") */
  count?: number;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Default single target configuration
 */
export const DEFAULT_SINGLE_TARGET: Partial<TargetDSL> = {
  count: 1,
  selector: "chosen",
};

/**
 * Default self-target configuration
 */
export const DEFAULT_SELF_TARGET: Partial<TargetDSL> = {
  selector: "self",
};
