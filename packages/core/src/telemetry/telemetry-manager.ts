/**
 * Telemetry Manager
 *
 * Event-based telemetry system for TCG Core.
 * Extends EventEmitter for flexible event subscription.
 */

import { EventEmitter } from "node:events";
import type { TelemetryEvent } from "./events";
import type { TelemetryHooks, TelemetryOptions } from "./types";

/**
 * Telemetry Manager
 *
 * Manages telemetry events and hooks for the engine.
 * Provides dual API: EventEmitter style and callback hooks.
 *
 * Features:
 * - Event emission with type safety
 * - Dynamic hook registration/unregistration
 * - Enable/disable toggle
 * - EventEmitter API for runtime subscriptions
 *
 * @example
 * ```typescript
 * // Initialize with hooks
 * const telemetry = new TelemetryManager({
 *   enabled: true,
 *   hooks: {
 *     onPlayerAction: (event) => console.log(event.moveId)
 *   }
 * });
 *
 * // EventEmitter style (runtime subscription)
 * telemetry.on('playerAction', (event) => {
 *   analytics.track('move', event);
 * });
 *
 * // Emit events
 * telemetry.emit({
 *   type: 'playerAction',
 *   moveId: 'playCard',
 *   // ...
 * });
 * ```
 */
export class TelemetryManager extends EventEmitter {
  private enabled: boolean;
  private registeredHooks: TelemetryHooks;

  /**
   * Create a new TelemetryManager
   *
   * @param options - Telemetry configuration
   */
  constructor(options: TelemetryOptions) {
    super();
    this.enabled = options.enabled;
    this.registeredHooks = options.hooks || {};

    // Register initial hooks if provided
    this.registerInitialHooks();
  }

  /**
   * Register hooks provided at initialization
   */
  private registerInitialHooks(): void {
    if (this.registeredHooks.onPlayerAction) {
      this.on("playerAction", this.registeredHooks.onPlayerAction);
    }
    if (this.registeredHooks.onStateChange) {
      this.on("stateChange", this.registeredHooks.onStateChange);
    }
    if (this.registeredHooks.onRuleEvaluation) {
      this.on("ruleEvaluation", this.registeredHooks.onRuleEvaluation);
    }
    if (this.registeredHooks.onFlowTransition) {
      this.on("flowTransition", this.registeredHooks.onFlowTransition);
    }
    if (this.registeredHooks.onEngineError) {
      this.on("engineError", this.registeredHooks.onEngineError);
    }
    if (this.registeredHooks.onPerformance) {
      this.on("onPerformance", this.registeredHooks.onPerformance);
    }
  }

  /**
   * Emit telemetry event
   *
   * Emits events via EventEmitter and invokes registered hooks.
   * Does nothing if telemetry is disabled.
   *
   * @param event - Telemetry event to emit
   * @returns True if emitted, false if disabled
   *
   * @example
   * ```typescript
   * telemetry.emit({
   *   type: 'playerAction',
   *   moveId: 'drawCard',
   *   playerId: 'player-1',
   *   params: {},
   *   result: 'success',
   *   duration: 15,
   *   timestamp: Date.now()
   * });
   * ```
   */
  emit(event: TelemetryEvent): boolean {
    if (!this.enabled) {
      return false;
    }

    // Emit via EventEmitter (for runtime subscribers)
    super.emit(event.type, event);

    return true;
  }

  /**
   * Register a single telemetry hook
   *
   * Allows external systems to subscribe to specific event types.
   * Hook is invoked synchronously when matching events are emitted.
   *
   * @param eventType - Event type to hook into
   * @param handler - Callback function
   *
   * @example
   * ```typescript
   * telemetry.registerHook('onPlayerAction', (event) => {
   *   if (event.result === 'failure') {
   *     errorTracker.log(event.error);
   *   }
   * });
   * ```
   */
  registerHook<K extends keyof TelemetryHooks>(
    eventType: K,
    handler: NonNullable<TelemetryHooks[K]>,
  ): void {
    this.registeredHooks[eventType] = handler;

    // Register with EventEmitter
    // Remove 'on' prefix for event name
    const eventName = eventType.startsWith("on")
      ? eventType.slice(2, 3).toLowerCase() + eventType.slice(3)
      : eventType;

    this.on(eventName, handler as (...args: unknown[]) => void);
  }

  /**
   * Unregister a telemetry hook
   *
   * Removes a specific handler from the event type.
   *
   * @param eventType - Event type to unhook from
   * @param handler - Specific handler to remove
   *
   * @example
   * ```typescript
   * const handler = (event) => console.log(event);
   * telemetry.registerHook('onPlayerAction', handler);
   *
   * // Later...
   * telemetry.unregisterHook('onPlayerAction', handler);
   * ```
   */
  unregisterHook<K extends keyof TelemetryHooks>(
    eventType: K,
    handler: NonNullable<TelemetryHooks[K]>,
  ): void {
    if (this.registeredHooks[eventType] === handler) {
      delete this.registeredHooks[eventType];
    }

    // Unregister from EventEmitter
    const eventName = eventType.startsWith("on")
      ? eventType.slice(2, 3).toLowerCase() + eventType.slice(3)
      : eventType;

    this.off(eventName, handler as (...args: unknown[]) => void);
  }

  /**
   * Set enabled state
   *
   * Dynamically enable or disable telemetry at runtime.
   *
   * @param enabled - True to enable, false to disable
   *
   * @example
   * ```typescript
   * // Disable telemetry in production
   * if (process.env.NODE_ENV === 'production') {
   *   telemetry.setEnabled(false);
   * }
   * ```
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if telemetry is enabled
   *
   * @returns True if enabled, false otherwise
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}
