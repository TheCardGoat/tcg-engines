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
 *
 * @example
 * ```typescript
 * const hook: TelemetryHook = (event: TelemetryEvent) => {
 *   if (event.type === 'playerAction') {
 *     analytics.track('game.move', event);
 *   }
 * };
 * ```
 */
export type TelemetryHook = (event: TelemetryEvent) => void;

/**
 * Telemetry Hooks
 *
 * Object defining callbacks for specific event types.
 * Each hook is optional and receives only events of its type.
 *
 * Hooks vs EventEmitter:
 * - Hooks: Registered at initialization, type-safe callbacks
 * - EventEmitter: Dynamic subscription via .on(), flexible at runtime
 *
 * @example
 * ```typescript
 * const hooks: TelemetryHooks = {
 *   onPlayerAction: (event) => {
 *     console.log(`Move: ${event.moveId}`);
 *   },
 *   onEngineError: (event) => {
 *     errorReporter.capture(event.error, event.context);
 *   }
 * };
 * ```
 */
export type TelemetryHooks = {
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
};

/**
 * Telemetry Options
 *
 * Configuration for TelemetryManager instances.
 *
 * @example
 * ```typescript
 * const options: TelemetryOptions = {
 *   enabled: true,
 *   hooks: {
 *     onPlayerAction: (event) => {
 *       analytics.track('game.move', {
 *         moveId: event.moveId,
 *         playerId: event.playerId,
 *         duration: event.duration
 *       });
 *     }
 *   }
 * };
 * ```
 */
export type TelemetryOptions = {
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
};
