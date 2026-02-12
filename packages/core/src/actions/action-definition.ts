import type { TargetDefinition } from "../targeting/target-definition";
import type { PlayerId } from "../types";

/**
 * Action Timing Constraint
 * Specifies when an action can be performed in terms of game flow.
 *
 * This is a thin layer over core-engine's phase/segment/step system,
 * providing a way to validate timing without duplicating core-engine logic.
 */
export interface ActionTiming<TGameState = unknown> {
  /** Segments where this action is allowed (e.g., "setup", "gameplay") */
  segments?: string[];

  /** Phases where this action is allowed (e.g., "mainPhase", "combatPhase") */
  phases?: string[];

  /** Steps where this action is allowed (e.g., "drawStep", "playStep") */
  steps?: string[];

  /** Custom timing predicate for complex game-specific timing rules */
  custom?: (state: TGameState) => boolean;
}

/**
 * Action Metadata
 * Provides categorization and UI/logging information for actions.
 * Games can define their own category taxonomies.
 */
export interface ActionMetadata {
  /** Category for UI grouping (game-defined, e.g., "card-play", "combat", "special") */
  category?: string;

  /** Subcategory for finer-grained grouping */
  subcategory?: string;

  /** Tags for flexible categorization (e.g., ["instant-speed", "costs-resources"]) */
  tags?: string[];

  /** Priority hint for AI/automation (higher = more important) */
  priorityHint?: number;

  /** Whether this action is hidden from normal UI (for automatic/internal actions) */
  hidden?: boolean;
}

/**
 * Action Definition
 *
 * A minimal, game-agnostic definition of a player action.
 * This complements core-engine's EnumerableMove by providing:
 * - Timing validation (segments/phases/steps)
 * - Metadata for UI/logging/categorization
 * - Target specifications using @tcg/core's targeting system
 *
 * The actual execution logic, game-specific constraints, and cost validation
 * are handled by core-engine's EnumerableMove.getConstraints() and execute().
 */
export interface ActionDefinition<TGameState = unknown> {
  /** Unique identifier for this action */
  id: string;

  /** Human-readable name for UI display */
  name: string;

  /** Optional description for tooltips/help */
  description?: string;

  /** When this action can be performed */
  timing?: ActionTiming<TGameState>;

  /** Target requirements using @tcg/core's targeting system */
  targets?: TargetDefinition[];

  /** Metadata for categorization and UI */
  metadata?: ActionMetadata;
}

/**
 * Action Instance
 *
 * Represents a specific action being performed by a player.
 * This is the bridge between @tcg/core's action definitions and
 * core-engine's move execution system.
 */
export interface ActionInstance {
  /** The action being performed */
  actionId: string;

  /** Player performing the action */
  playerId: PlayerId;

  /** Selected targets (array of arrays for multi-target actions) */
  targets?: string[][];

  /** Additional action-specific parameters */
  params?: Record<string, unknown>;

  /** Timestamp when action was initiated */
  timestamp?: number;
}

/**
 * Action Validation Result
 *
 * Result of validating whether an action can be performed.
 * Focused on timing and target validation - cost validation
 * is handled by core-engine's constraint system.
 */
export interface ActionValidationResult {
  /** Whether the action is valid */
  valid: boolean;

  /** Human-readable error message if invalid */
  error?: string;

  /** Specific reason code for programmatic handling */
  reason?: "timing" | "targets" | "precondition";

  /** Invalid target indices (if reason is "targets") */
  invalidTargets?: number[];
}
