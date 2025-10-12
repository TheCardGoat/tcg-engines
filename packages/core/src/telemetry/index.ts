/**
 * Telemetry Module
 *
 * Event-based telemetry system for TCG Core.
 *
 * @example
 * ```typescript
 * import { TelemetryManager, type TelemetryEvent } from '@tcg/core/telemetry';
 *
 * const telemetry = new TelemetryManager({
 *   enabled: true,
 *   hooks: {
 *     onPlayerAction: (event) => {
 *       analytics.track('game.move', event);
 *     }
 *   }
 * });
 *
 * // EventEmitter style
 * telemetry.on('stateChange', (event) => {
 *   database.savePatches(event.patches);
 * });
 * ```
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
export type {
  TelemetryHook,
  TelemetryHooks,
  TelemetryOptions,
} from "./types";
