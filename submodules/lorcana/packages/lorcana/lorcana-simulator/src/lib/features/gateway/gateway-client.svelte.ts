/**
 *
 * Provides $state-powered reactivity for connection status,
 * latency, and authentication. Manages lifecycle automatically.
 */

import { GatewayClient } from "./gateway-client";
import type { ConnectionStatus, GatewayClientState } from "./gateway-client";
import { trackEvent, truncateForAnalytics } from "$lib/analytics/analytics.js";

export type { ConnectionStatus, GatewayClientState };

type GameMessage = { type: string; [key: string]: unknown };

export class GatewayClientStore {
  status: ConnectionStatus = $state("idle");
  authenticated: boolean = $state(false);
  connectionId: string | null = $state(null);
  latencyMs: number | null = $state(null);
  lastPongTime: string | null = $state(null);
  reconnectAttempts: number = $state(0);
  error: string | null = $state(null);
  /** True when the server announced shutdown (deploy) before the socket closed. */
  serverInitiatedClose: boolean = $state(false);
  /** True when the gateway rejected the connection with a terminal auth error. */
  authError: boolean = $state(false);
  /** Epoch ms timestamp of the last status transition. */
  statusChangedAt: number = $state(Date.now());
  /** Auth method being attempted: ticket, token, or anonymous. */
  readonly authMethod: "ticket" | "token" | "anonymous";
  readonly namespace = "/lorcana";

  private client: GatewayClient;
  #previousStatus: ConnectionStatus = "idle";
  #additionalListeners = new Set<(msg: GameMessage) => void>();
  #statusListeners = new Set<(status: ConnectionStatus) => void>();
  /** Throttle latency samples to one every 30s — GA4 quotas are limited. */
  #lastLatencySampleAt = 0;
  /** Disconnect transitions observed since the last sample emit. */
  #disconnectCount = 0;
  /** Disconnect transitions observed since the last latency sample. */
  #disconnectsSinceLastLatencySample = 0;
  #disconnectSampleTimer: ReturnType<typeof setInterval> | null = null;
  static readonly DISCONNECT_SAMPLE_WINDOW_MS = 60_000;

  constructor(
    url: string,
    ticket?: string,
    onGameMessage?: (msg: GameMessage) => void,
    onOpen?: () => void,
    token?: string,
    getToken?: () => string | undefined,
  ) {
    this.authMethod = ticket ? "ticket" : (token ?? getToken?.()) ? "token" : "anonymous";
    this.client = new GatewayClient({
      url,
      ticket,
      token,
      getToken,
      onStateChange: (state) => this.sync(state),
      onGameMessage: (msg) => {
        onGameMessage?.(msg);
        for (const listener of this.#additionalListeners) {
          listener(msg);
        }
      },
      onOpen,
    });

    this.#disconnectSampleTimer = setInterval(() => {
      if (this.#disconnectCount === 0) return;
      const count = this.#disconnectCount;
      this.#disconnectCount = 0;
      trackEvent("ws_disconnect_count_sample", {
        count,
        window_seconds: GatewayClientStore.DISCONNECT_SAMPLE_WINDOW_MS / 1000,
      });
    }, GatewayClientStore.DISCONNECT_SAMPLE_WINDOW_MS);
  }

  /**
   * Register an additional game message listener. Returns an unsubscribe function.
   * Used by GatewayTransport to receive state_update/move_rejected alongside
   * the primary onGameMessage callback.
   */
  addGameMessageListener(handler: (msg: GameMessage) => void): () => void {
    this.#additionalListeners.add(handler);
    return () => {
      this.#additionalListeners.delete(handler);
    };
  }

  addStatusChangeListener(handler: (status: ConnectionStatus) => void): () => void {
    this.#statusListeners.add(handler);
    return () => {
      this.#statusListeners.delete(handler);
    };
  }

  /** Send a JSON message over the WebSocket. */
  send(message: object): void {
    this.client.send(message);
  }

  /** Send a message and return a Promise that resolves with the correlated server response. */
  sendWithAck<T extends { type: string; correlationId?: string; [key: string]: unknown }>(
    message: object,
    timeoutMs?: number,
  ): Promise<T> {
    return this.client.sendWithAck<T>(message, timeoutMs);
  }

  connect(): void {
    this.client.connect();
  }

  disconnect(): void {
    this.client.disconnect();
  }

  destroy(): void {
    if (this.#disconnectSampleTimer !== null) {
      clearInterval(this.#disconnectSampleTimer);
      this.#disconnectSampleTimer = null;
    }
    this.client.destroy();
    if (_instance === this) _instance = null;
  }

  private sync(state: Readonly<GatewayClientState>): void {
    const prevStatus = this.#previousStatus;
    const statusChanged = state.status !== prevStatus;
    this.#previousStatus = state.status;
    if (statusChanged) {
      this.statusChangedAt = Date.now();
    }

    // Track connection transitions
    if (state.status === "connected" && prevStatus !== "connected") {
      if (state.reconnectAttempts > 0) {
        trackEvent("ws_reconnect", { attempts: state.reconnectAttempts });
      } else {
        trackEvent("ws_connect");
      }
    } else if (state.status === "disconnected" && prevStatus === "connected") {
      this.#disconnectCount += 1;
      this.#disconnectsSinceLastLatencySample += 1;
      trackEvent("ws_disconnect", { reason: state.error ? "connection_error" : "closed" });
    } else if (
      state.status === "disconnected" &&
      (prevStatus === "reconnecting" || prevStatus === "connecting") &&
      state.reconnectAttempts > 0
    ) {
      // Reached terminal disconnect after reconnect attempts — funnel signal.
      const lastError = truncateForAnalytics(state.error);
      trackEvent("ws_reconnect_failed", {
        attempts: state.reconnectAttempts,
        ...(lastError ? { last_error: lastError } : {}),
      });
    }

    // Sample latency once every 30 seconds while connected.
    if (state.status === "connected" && state.latencyMs != null) {
      const now = Date.now();
      if (now - this.#lastLatencySampleAt >= 30_000) {
        const disconnectsSinceLastProbe = this.#disconnectsSinceLastLatencySample;
        this.#lastLatencySampleAt = now;
        this.#disconnectsSinceLastLatencySample = 0;
        trackEvent("ws_latency_sample", {
          latency_ms: state.latencyMs,
          namespace: this.namespace,
          authenticated: state.authenticated,
          connection_auth_state: state.authenticated ? "authenticated" : "anonymous",
          disconnects_since_last_probe: disconnectsSinceLastProbe,
        });
      }
    }

    this.status = state.status;
    this.authenticated = state.authenticated;
    this.connectionId = state.connectionId;
    this.latencyMs = state.latencyMs;
    this.lastPongTime = state.lastPongTime;
    this.reconnectAttempts = state.reconnectAttempts;
    this.error = state.error;
    this.serverInitiatedClose = state.serverInitiatedClose;
    this.authError = state.authError;

    if (statusChanged) {
      for (const listener of this.#statusListeners) {
        listener(state.status);
      }
    }
  }
}

// Module-level singleton — at most one active WS connection in the browser.
let _instance: GatewayClientStore | null = null;

/**
 * Create (or replace) the global GatewayClientStore singleton.
 * Any existing live connection is destroyed before the new one is opened.
 */
export function createGatewayStore(
  url: string,
  ticket?: string,
  onGameMessage?: (msg: GameMessage) => void,
  onOpen?: () => void,
  token?: string,
  getToken?: () => string | undefined,
): GatewayClientStore {
  if (_instance) {
    _instance.destroy();
    _instance = null;
  }
  _instance = new GatewayClientStore(url, ticket, onGameMessage, onOpen, token, getToken);
  return _instance;
}

/** Destroy the singleton and clear the reference (call from onDestroy). */
export function destroyGatewayStore(): void {
  _instance?.destroy();
  _instance = null;
}
