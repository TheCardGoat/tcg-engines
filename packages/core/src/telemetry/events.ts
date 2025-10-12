/**
 * Telemetry Events
 *
 * Event type definitions for the TCG Core telemetry system.
 * All events are discriminated unions for type-safe handling.
 */

import type { Patch } from "immer";
import type { PlayerId } from "../types";

/**
 * Player Action Event
 *
 * Emitted whenever a player executes a move.
 * Tracks move execution, parameters, result, and duration.
 *
 * Use cases:
 * - Player behavior analysis
 * - Move frequency tracking
 * - Performance monitoring
 * - Replay generation
 */
export type PlayerActionEvent = {
  type: "playerAction";
  /** Move identifier */
  moveId: string;
  /** Player executing the move */
  playerId: PlayerId;
  /** Move parameters */
  params: unknown;
  /** Execution result (success/failure) */
  result: "success" | "failure";
  /** Error message (if failed) */
  error?: string;
  /** Error code (if failed) */
  errorCode?: string;
  /** Execution duration in milliseconds */
  duration: number;
  /** Event timestamp */
  timestamp: number;
};

/**
 * State Change Event
 *
 * Emitted after state mutations.
 * Contains patches for incremental state sync and replay.
 *
 * Use cases:
 * - Network synchronization
 * - State replay/reconstruction
 * - Debugging state issues
 * - Audit trails
 */
export type StateChangeEvent = {
  type: "stateChange";
  /** Forward patches (state mutations) */
  patches: Patch[];
  /** Inverse patches (for undo) */
  inversePatches: Patch[];
  /** Move that caused this change */
  moveId?: string;
  /** Optional before-state snapshot */
  beforeSnapshot?: unknown;
  /** Optional after-state snapshot */
  afterSnapshot?: unknown;
  /** Event timestamp */
  timestamp: number;
};

/**
 * Rule Evaluation Event
 *
 * Emitted during condition checks and rule evaluations.
 * Tracks which rules fired, with what context, and the result.
 *
 * Use cases:
 * - Debugging rule interactions
 * - Understanding game decisions
 * - AI training data
 * - Balance analysis
 */
export type RuleEvaluationEvent = {
  type: "ruleEvaluation";
  /** Rule or condition name */
  ruleName: string;
  /** Evaluation result (pass/fail) */
  result: boolean;
  /** Evaluation context */
  context: Record<string, unknown>;
  /** Evaluation duration in milliseconds */
  duration?: number;
  /** Event timestamp */
  timestamp: number;
};

/**
 * Flow Transition Event
 *
 * Emitted during game flow transitions (phases, turns, segments).
 * Tracks progression through game structure.
 *
 * Use cases:
 * - Game pacing analysis
 * - Turn timing metrics
 * - Flow debugging
 * - UI synchronization
 */
export type FlowTransitionEvent = {
  type: "flowTransition";
  /** Type of transition */
  transitionType: "phase" | "segment" | "turn";
  /** Source state (what we're leaving) */
  from: string;
  /** Destination state (where we're going) */
  to: string;
  /** Current turn number */
  turn: number;
  /** Event timestamp */
  timestamp: number;
};

/**
 * Engine Error Event
 *
 * Emitted when errors occur during engine execution.
 * Captures full error context for debugging and monitoring.
 *
 * Use cases:
 * - Error tracking and reporting
 * - System health monitoring
 * - Bug reproduction
 * - Alert generation
 */
export type EngineErrorEvent = {
  type: "engineError";
  /** Error message */
  error: string;
  /** Stack trace */
  stack?: string;
  /** Error context (move, player, etc.) */
  context: Record<string, unknown>;
  /** Move ID (if error during move execution) */
  moveId?: string;
  /** Player ID (if error during player action) */
  playerId?: PlayerId;
  /** Event timestamp */
  timestamp: number;
};

/**
 * Performance Event
 *
 * Emitted for performance-sensitive operations.
 * Tracks execution time and resource usage.
 *
 * Use cases:
 * - Performance profiling
 * - Bottleneck identification
 * - Optimization validation
 * - Resource monitoring
 */
export type PerformanceEvent = {
  type: "performance";
  /** Operation name */
  operation: string;
  /** Execution duration in milliseconds */
  duration: number;
  /** Operation metadata */
  metadata?: Record<string, unknown>;
  /** Event timestamp */
  timestamp: number;
};

/**
 * Telemetry Event Union
 *
 * Discriminated union of all telemetry event types.
 * Use the `type` field for type narrowing.
 *
 * @example
 * ```typescript
 * function handleEvent(event: TelemetryEvent) {
 *   switch (event.type) {
 *     case 'playerAction':
 *       console.log(`Move: ${event.moveId}, Result: ${event.result}`);
 *       break;
 *     case 'flowTransition':
 *       console.log(`${event.from} -> ${event.to}`);
 *       break;
 *     // ... other cases
 *   }
 * }
 * ```
 */
export type TelemetryEvent =
  | PlayerActionEvent
  | StateChangeEvent
  | RuleEvaluationEvent
  | FlowTransitionEvent
  | EngineErrorEvent
  | PerformanceEvent;
