/**
 * Telemetry Types
 *
 * Type definitions for the TCG Core telemetry system.
 * Provides hooks for external analytics and monitoring systems.
 */

import type {
  EngineErrorEvent,
  FlowTransitionEvent,
  PerformanceEvent,
  PlayerActionEvent,
  RuleEvaluationEvent,
  StateChangeEvent,
  TelemetryEvent,
} from "./events";

/**
 * Telemetry Hook
 *
 * Generic callback type for handling telemetry events.
 * All hooks receive a single event parameter and return void.
 */
export type TelemetryHook = (event: TelemetryEvent) => void;

/**
 * Telemetry Hooks
 *
 * Object defining callbacks for specific event types.
 * Each hook is optional and receives only events of its type.
 */
export interface TelemetryHooks {
  /** Called when a player executes a move */
  onPlayerAction?: (event: PlayerActionEvent) => void;
  /** Called when state changes occur */
  onStateChange?: (event: StateChangeEvent) => void;
  /** Called when rules are evaluated */
  onRuleEvaluation?: (event: RuleEvaluationEvent) => void;
  /** Called during flow transitions (phase/turn/segment) */
  onFlowTransition?: (event: FlowTransitionEvent) => void;
  /** Called when engine errors occur */
  onEngineError?: (event: EngineErrorEvent) => void;
  /** Called for performance metrics */
  onPerformance?: (event: PerformanceEvent) => void;
}

/**
 * Telemetry Options
 *
 * Configuration for TelemetryManager instances.
 */
export interface TelemetryOptions {
  /**
   * Enable/disable telemetry
   *
   * When false, no events are emitted.
   * Default: false
   */
  enabled: boolean;

  /**
   * Event hooks
   *
   * Optional callbacks for specific event types.
   * Invoked synchronously when events are emitted.
   */
  hooks?: TelemetryHooks;
}
