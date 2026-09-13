/**
 * Svelte adapter over the shared Socket.IO gateway client.
 *
 * Lorcanito keeps its existing reactive surface while the shared manager owns
 * the namespace, handshake credentials, reconnects, and latency probes.
 */

import {
  createGatewayConnectionManager,
  type CredentialsController,
  type GatewayConnectionManager,
  type GatewayConnectionState,
  type GatewayHandle,
} from "@tcg/gateway-client";
import { trackEvent, truncateForAnalytics } from "$lib/analytics/analytics.js";

export type ConnectionStatus = GatewayConnectionState["status"];

export interface GatewayClientState {
  status: ConnectionStatus;
  authenticated: boolean;
  connectionId: string | null;
  latencyMs: number | null;
  lastPongTime: string | null;
  reconnectAttempts: number;
  error: string | null;
  serverInitiatedClose: boolean;
  authError: boolean;
}

type GameMessage = { type: string; correlationId?: string; [key: string]: unknown };

type PendingAck = {
  resolve: (message: GameMessage) => void;
  reject: (reason: string) => void;
  timeoutHandle: ReturnType<typeof setTimeout>;
};

type UntypedGatewayHandle = {
  emit(event: string, payload: Record<string, unknown>): void;
};

export class GatewayClientStore {
  status: ConnectionStatus = $state("idle");
  authenticated: boolean = $state(false);
  connectionId: string | null = $state(null);
  latencyMs: number | null = $state(null);
  lastPongTime: string | null = $state(null);
  reconnectAttempts: number = $state(0);
  error: string | null = $state(null);
  serverInitiatedClose: boolean = $state(false);
  authError: boolean = $state(false);
  statusChangedAt: number = $state(Date.now());
  readonly authMethod: "ticket" | "token" | "anonymous";
  readonly namespace = "/lorcana";

  #previousStatus: ConnectionStatus = "idle";
  #additionalListeners = new Set<(message: GameMessage) => void>();
  #statusListeners = new Set<(status: ConnectionStatus) => void>();
  #pendingAcks = new Map<string, PendingAck>();
  #manager: GatewayConnectionManager;
  #handle: GatewayHandle | null = null;
  #handleCleanups: Array<() => void> = [];
  #lastLatencySampleAt = 0;
  #disconnectCount = 0;
  #disconnectsSinceLastLatencySample = 0;
  #disconnectSampleTimer: ReturnType<typeof setInterval> | null = null;
  readonly #credentials: CredentialsController;
  readonly #onGameMessage?: (message: GameMessage) => void;
  readonly #onOpen?: () => void;
  readonly #ticket?: string;
  readonly #token?: string;
  readonly #getToken?: () => string | undefined;

  static readonly DISCONNECT_SAMPLE_WINDOW_MS = 60_000;

  constructor(
    gatewayUrl: string,
    ticket?: string,
    onGameMessage?: (message: GameMessage) => void,
    onOpen?: () => void,
    token?: string,
    getToken?: () => string | undefined,
    credentials?: CredentialsController,
  ) {
    this.authMethod = ticket ? "ticket" : (token ?? getToken?.()) ? "token" : "anonymous";
    this.#ticket = ticket;
    this.#token = token;
    this.#getToken = getToken;
    this.#onGameMessage = onGameMessage;
    this.#onOpen = onOpen;
    this.#credentials =
      credentials ??
      ({
        get: () => this.readCredentials(),
        refresh: async () => this.readCredentials(false),
      } satisfies CredentialsController);
    this.#manager = createGatewayConnectionManager({
      gatewayOrigin: gatewayUrl,
      ping: { intervalMs: 10_000 },
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

  addGameMessageListener(handler: (message: GameMessage) => void): () => void {
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

  send(message: object): boolean {
    if (!this.#handle || this.status !== "connected" || !isRecord(message)) return false;
    const type = typeof message.type === "string" ? message.type : null;
    if (!type) return false;
    const { type: _type, ...payload } = message;
    try {
      (this.#handle as unknown as UntypedGatewayHandle).emit(type, payload);
      return true;
    } catch {
      return false;
    }
  }

  sendWithAck<T extends GameMessage>(message: object, timeoutMs = 10_000): Promise<T> {
    if (!this.#handle || this.status !== "connected") {
      return Promise.reject("disconnected");
    }
    return new Promise<T>((resolve, reject) => {
      const correlationId = crypto.randomUUID();
      const timeoutHandle = setTimeout(() => {
        this.#pendingAcks.delete(correlationId);
        reject("timeout");
      }, timeoutMs);
      this.#pendingAcks.set(correlationId, {
        resolve: resolve as (message: GameMessage) => void,
        reject,
        timeoutHandle,
      });
      if (!this.send({ ...message, correlationId })) {
        clearTimeout(timeoutHandle);
        this.#pendingAcks.delete(correlationId);
        reject("disconnected");
      }
    });
  }

  connect(): void {
    if (!this.#handle) {
      this.openHandle();
      return;
    }
    if (this.status === "disconnected" || this.status === "idle") {
      this.#handle.reconnect();
    }
  }

  disconnect(): void {
    this.releaseHandle();
    this.rejectAllPendingAcks("disconnected");
    this.sync({
      ...this.#manager.getState("lorcana"),
      status: "disconnected",
      authenticated: false,
      connectionId: null,
    });
  }

  destroy(): void {
    if (this.#disconnectSampleTimer !== null) {
      clearInterval(this.#disconnectSampleTimer);
      this.#disconnectSampleTimer = null;
    }
    this.disconnect();
    this.#manager.destroy();
    this.sync({
      ...this.#manager.getState("lorcana"),
      status: "idle",
      authenticated: false,
      connectionId: null,
    });
    if (_instance === this) _instance = null;
  }

  private readCredentials(includeTicket = true) {
    const token = this.#token ?? this.#getToken?.();
    return {
      ...(includeTicket && this.#ticket ? { ticket: this.#ticket } : {}),
      ...(token ? { token } : {}),
      requireAuth: Boolean(this.#ticket || token),
    };
  }

  private openHandle(): void {
    this.#handle = this.#manager.acquire("lorcana", { credentials: this.#credentials });
    this.#handleCleanups = [
      this.#handle.subscribeState((state) => this.sync(state)),
      this.#handle.onAny((event, payload) => this.receive(event, payload)),
      this.#handle.onConnected(() => this.#onOpen?.()),
      this.#handle.onLatency(() => {
        this.lastPongTime = new Date().toISOString();
      }),
    ];
  }

  private releaseHandle(): void {
    for (const cleanup of this.#handleCleanups) cleanup();
    this.#handleCleanups = [];
    this.#handle?.release();
    this.#handle = null;
  }

  private receive(event: string, payload: unknown): void {
    if (event === "server_shutting_down") {
      this.serverInitiatedClose = true;
    }
    const message: GameMessage = isRecord(payload)
      ? { ...payload, type: event }
      : { type: event, payload };
    const correlationId = typeof message.correlationId === "string" ? message.correlationId : null;
    if (correlationId) {
      const ack = this.#pendingAcks.get(correlationId);
      if (ack) {
        clearTimeout(ack.timeoutHandle);
        this.#pendingAcks.delete(correlationId);
        if (
          message.type === "error" ||
          message.type === "gateway_error" ||
          message.type === "move_rejected"
        ) {
          ack.reject(message.type);
        } else {
          ack.resolve(message);
        }
      }
    }
    this.#onGameMessage?.(message);
    for (const listener of this.#additionalListeners) listener(message);
  }

  private rejectAllPendingAcks(reason: string): void {
    for (const ack of this.#pendingAcks.values()) {
      clearTimeout(ack.timeoutHandle);
      ack.reject(reason);
    }
    this.#pendingAcks.clear();
  }

  private sync(state: GatewayConnectionState): void {
    const previousStatus = this.#previousStatus;
    const statusChanged = state.status !== previousStatus;
    this.#previousStatus = state.status;
    if (statusChanged) this.statusChangedAt = Date.now();

    if (state.status === "connected" && previousStatus !== "connected") {
      if (state.reconnectAttempt > 0) {
        trackEvent("ws_reconnect", { attempts: state.reconnectAttempt });
      } else {
        trackEvent("ws_connect");
      }
      this.serverInitiatedClose = false;
    } else if (state.status === "disconnected" && previousStatus === "connected") {
      this.#disconnectCount += 1;
      this.#disconnectsSinceLastLatencySample += 1;
      trackEvent("ws_disconnect", { reason: state.error ? "connection_error" : "closed" });
    } else if (
      state.status === "disconnected" &&
      (previousStatus === "reconnecting" || previousStatus === "connecting") &&
      state.reconnectAttempt > 0
    ) {
      const lastError = truncateForAnalytics(state.error);
      trackEvent("ws_reconnect_failed", {
        attempts: state.reconnectAttempt,
        ...(lastError ? { last_error: lastError } : {}),
      });
    }

    if (state.status === "connected" && state.latencyMs !== null) {
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
    this.reconnectAttempts = state.reconnectAttempt;
    this.error = state.error;
    this.authError = state.authStatus === "failed";

    if (statusChanged) {
      for (const listener of this.#statusListeners) listener(state.status);
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

let _instance: GatewayClientStore | null = null;

export function createGatewayStore(
  gatewayUrl: string,
  ticket?: string,
  onGameMessage?: (message: GameMessage) => void,
  onOpen?: () => void,
  token?: string,
  getToken?: () => string | undefined,
  credentials?: CredentialsController,
): GatewayClientStore {
  _instance?.destroy();
  _instance = new GatewayClientStore(
    gatewayUrl,
    ticket,
    onGameMessage,
    onOpen,
    token,
    getToken,
    credentials,
  );
  return _instance;
}

export function destroyGatewayStore(): void {
  _instance?.destroy();
  _instance = null;
}
