/**
 * Telemetry Module
 *
 * Event-based telemetry system for TCG Core.
 */

export type {
  EngineErrorEvent,
  FlowTransitionEvent,
  PerformanceEvent,
  PlayerActionEvent,
  RuleEvaluationEvent,
  StateChangeEvent,
  TelemetryEvent,
} from "./events";
export { TelemetryManager } from "./telemetry-manager";
export type { TelemetryHook, TelemetryHooks, TelemetryOptions } from "./types";
