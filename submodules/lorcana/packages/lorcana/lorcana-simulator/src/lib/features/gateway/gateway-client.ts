/**
 * WebSocket gateway client.
 *
 * Manages connection lifecycle, keepalive ping/pong,
 * latency tracking, and automatic reconnection.
 *
 * Framework-agnostic — reactive state is handled by the
 * Svelte wrapper (gateway-client.svelte.ts).
 */

import { logError, logOperationalEvent } from "$lib/telemetry/logs.js";

const DEBUG_MESSAGE_TYPES = new Set(["ping", "pong", "heartbeat_ack", "heartbeat"]);

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

export interface GatewayClientState {
  status: ConnectionStatus;
  authenticated: boolean;
  connectionId: string | null;
  latencyMs: number | null;
  lastPongTime: string | null;
  reconnectAttempts: number;
  error: string | null;
  /**
   * DEPLOYMENT CACHE STRATEGY: True when the server sent `server_shutting_down`
   * before closing. This lets the UI distinguish a routine deploy (show
   * "Updating server…") from a network failure (show "Connection lost").
   * Also triggers an immediate reconnect (no backoff) since the new instance
   * is already up during a blue-green deploy.
   */
  serverInitiatedClose: boolean;
  /**
   * True when the server rejected the connection with `gateway_error`
   * `code: "unauthenticated"`. Terminal — auto-reconnect is stopped so the UI
   * can prompt the user to sign in / refresh instead of looping silently.
   */
  authError: boolean;
}

export interface GatewayClientOptions {
  /** WebSocket URL, e.g. ws://localhost:3001/v1/gateway/ws */
  url: string;
  /** Optional short-lived ticket for authentication (appended as ?ticket=<id>). */
  ticket?: string;
  /** Optional longer-lived auth token for reconnection fallback (appended as ?token=<jwt>). */
  token?: string;
  /** Optional callback to resolve a token at connect time (used when token is not known upfront). */
  getToken?: () => string | undefined;
  /** Ping interval in ms. Default: 10_000 */
  pingIntervalMs?: number;
  /** Max reconnect attempts before giving up. Default: Infinity */
  maxReconnectAttempts?: number;
  /** Callback fired on every state change. */
  onStateChange?: (state: Readonly<GatewayClientState>) => void;
  /** Callback fired for game messages not handled internally (game_joined, state_update, etc.). */
  onGameMessage?: (msg: { type: string; [key: string]: unknown }) => void;
  /** Called when the WebSocket reaches OPEN (each connect / reconnect). */
  onOpen?: () => void;
}

const INITIAL_RECONNECT_DELAY_MS = 1_000;
const MAX_RECONNECT_DELAY_MS = 30_000;
/** Fast reconnect when the server announced a deploy shutdown. */
const DEPLOY_RECONNECT_DELAY_MS = 100;
const DEFAULT_PING_INTERVAL_MS = 10_000;

type GatewayMsg = { type: string; correlationId?: string; [key: string]: unknown };

type PendingAck = {
  resolve: (msg: GatewayMsg) => void;
  reject: (reason: string) => void;
  timeoutHandle: ReturnType<typeof setTimeout>;
};

export class GatewayClient {
  private ws: WebSocket | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;
  /** Tracks whether the fast deploy reconnect delay has already been used this cycle. */
  private deployFastReconnectUsed = false;
  private pendingAcks = new Map<string, PendingAck>();
  private readonly options: Required<
    Omit<GatewayClientOptions, "ticket" | "token" | "getToken" | "onGameMessage" | "onOpen">
  > &
    Pick<GatewayClientOptions, "ticket" | "token" | "getToken" | "onGameMessage" | "onOpen">;

  private _state: GatewayClientState = {
    status: "idle",
    authenticated: false,
    connectionId: null,
    latencyMs: null,
    lastPongTime: null,
    reconnectAttempts: 0,
    error: null,
    serverInitiatedClose: false,
    authError: false,
  };

  constructor(options: GatewayClientOptions) {
    this.options = {
      ticket: undefined,
      token: undefined,
      getToken: undefined,
      pingIntervalMs: DEFAULT_PING_INTERVAL_MS,
      maxReconnectAttempts: Number.POSITIVE_INFINITY,
      onStateChange: () => {},
      onGameMessage: undefined,
      onOpen: undefined,
      ...options,
    };
  }

  get state(): Readonly<GatewayClientState> {
    return this._state;
  }

  /** Send a JSON message over the WebSocket. */
  send(message: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      if (import.meta.env.DEV && !DEBUG_MESSAGE_TYPES.has((message as { type: string }).type)) {
        console.debug("[WS ⬆ SEND]", message);
      }
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Send a message and return a Promise that resolves with the correlated server response,
   * or rejects with `"disconnected"` (socket not open or closed before ack) or `"timeout"`.
   */
  sendWithAck<T extends GatewayMsg>(message: object, timeoutMs = 10_000): Promise<T> {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      return Promise.reject("disconnected");
    }
    return new Promise<T>((resolve, reject) => {
      const correlationId = crypto.randomUUID();
      const timeoutHandle = setTimeout(() => {
        this.pendingAcks.delete(correlationId);
        reject("timeout");
      }, timeoutMs);
      this.pendingAcks.set(correlationId, {
        resolve: resolve as (msg: GatewayMsg) => void,
        reject,
        timeoutHandle,
      });
      try {
        this.send({ ...message, correlationId });
      } catch (err) {
        clearTimeout(timeoutHandle);
        this.pendingAcks.delete(correlationId);
        throw err;
      }
    });
  }

  /** Open the WebSocket connection. */
  connect(): void {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)
    ) {
      console.debug("[GW] connect() skipped — socket already open/connecting", {
        readyState: this.ws.readyState,
      });
      return;
    }
    console.debug("[GW] connect()", {
      hasTicket: !!this.options.ticket,
      hasToken: !!this.options.token,
      hasGetToken: !!this.options.getToken,
      url: this.options.url,
    });
    this.intentionalClose = false;
    this.updateState({ status: "connecting", error: null });
    this.createSocket();
  }

  /** Close the connection. Does not auto-reconnect. */
  disconnect(): void {
    this.intentionalClose = true;
    this.clearTimers();
    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }
    this.updateState({ status: "disconnected", reconnectAttempts: 0 });
  }

  /** Tear down completely (call on component unmount). */
  destroy(): void {
    this.disconnect();
    this.updateState({ status: "idle" });
  }

  // ─── Private ──────────────────────────────────────────────

  private createSocket(): void {
    // Clear any pending reconnect to prevent concurrent socket creation
    this.clearTimers();

    // Drop prior handshake identity until the next welcome (avoids stale Auth UI on reconnect)
    this.updateState({
      authenticated: false,
      connectionId: null,
      latencyMs: null,
      lastPongTime: null,
    });

    // Append ticket as query parameter for authentication
    let wsUrl = this.options.url;
    const params = new URLSearchParams();

    if (this.options.ticket) {
      params.set("ticket", this.options.ticket);
    }

    const token = this.options.token ?? this.options.getToken?.();
    if (token) {
      params.set("token", token);
    }
    const qs = params.toString();
    if (qs) {
      const separator = wsUrl.includes("?") ? "&" : "?";
      wsUrl = `${wsUrl}${separator}${qs}`;
    }
    console.debug("[GW] createSocket()", {
      url: wsUrl.replace(/ticket=[^&]+/, "ticket=***").replace(/token=[^&]+/, "token=***"),
      hasTicket: !!this.options.ticket,
      hasToken: !!token,
      attempt: this._state.reconnectAttempts,
    });
    const ws = new WebSocket(wsUrl);

    ws.addEventListener("open", () => {
      console.debug("[GW] socket open");
      this.updateState({
        status: "connected",
        reconnectAttempts: 0,
        error: null,
        // Clear deploy flag once the new connection is established so
        // the UI stops showing "Updating server…" and returns to normal.
        serverInitiatedClose: false,
        authError: false,
      });
      this.deployFastReconnectUsed = false;
      this.startPingLoop();
      this.options.onOpen?.();
    });

    ws.addEventListener("message", (event) => {
      this.handleMessage(event.data as string);
    });

    ws.addEventListener("close", (event) => {
      console.debug("[GW] socket closed", {
        code: event.code,
        reason: event.reason || "(none)",
        wasClean: event.wasClean,
        intentional: this.intentionalClose,
      });
      this.ws = null;
      this.clearPingTimer();
      this.rejectAllPendingAcks("disconnected");
      if (!this.intentionalClose) {
        this.scheduleReconnect();
      }
    });

    ws.addEventListener("error", (event) => {
      console.error("[GW] socket error", event);
      logOperationalEvent(
        "gateway_socket_error",
        { auth_method: this.authMethod(), status: this._state.status },
        "error",
      );
      this.updateState({ error: "Connection error" });
    });

    this.ws = ws;
  }

  private handleMessage(raw: string): void {
    let msg: { type: string; [key: string]: unknown };
    try {
      msg = JSON.parse(raw) as { type: string };
    } catch {
      return;
    }

    if (import.meta.env.DEV && !DEBUG_MESSAGE_TYPES.has(msg.type)) {
      console.debug("[WS ⬇ RECV]", msg);
    }

    // Resolve or reject a pending ack when the server echoes a correlationId.
    // Still falls through to normal message handling so the transport layer
    // also processes the message (e.g. move_accepted updates game state).
    const correlationId = (msg as GatewayMsg).correlationId;
    if (correlationId) {
      const ack = this.pendingAcks.get(correlationId);
      if (ack) {
        clearTimeout(ack.timeoutHandle);
        this.pendingAcks.delete(correlationId);
        const isError =
          msg.type === "error" || msg.type === "gateway_error" || msg.type === "move_rejected";
        if (isError) {
          ack.reject(msg.type);
        } else {
          ack.resolve(msg as GatewayMsg);
        }
      }
    }

    switch (msg.type) {
      case "welcome": {
        console.debug("[GW] welcome received", {
          authenticated: msg.authenticated,
          connectionId: msg.connectionId,
        });
        this.updateState({
          authenticated: msg.authenticated as boolean,
          connectionId: msg.connectionId as string,
        });
        break;
      }
      case "pong": {
        const serverTime = msg.serverTime as string;
        const clientT = msg.t as number | undefined;
        const latencyMs = clientT != null ? Date.now() - clientT : null;
        this.updateState({ latencyMs, lastPongTime: serverTime });
        break;
      }
      case "gateway_error": {
        console.error("[GW] gateway_error", { code: msg.code, message: msg.message });
        logError("gateway_error", {
          code: typeof msg.code === "string" ? msg.code : "unknown",
          auth_method: this.authMethod(),
          authenticated: this._state.authenticated,
        });
        this.updateState({ error: `${msg.code}: ${msg.message}` });
        if (msg.code === "unauthenticated") {
          this.stopReconnecting();
          this.updateState({ authError: true, status: "disconnected" });
        }
        break;
      }
      // DEPLOYMENT CACHE STRATEGY: The server sends this just before shutting
      // down during a blue-green deploy. We flag it so the reconnect logic
      // can skip backoff (new instance is already running) and the UI can
      // show a softer "Updating server…" instead of "Connection lost".
      case "server_shutting_down": {
        this.updateState({ serverInitiatedClose: true });
        break;
      }
      default: {
        this.options.onGameMessage?.(msg);
        break;
      }
    }
  }

  private startPingLoop(): void {
    this.clearPingTimer();
    // Send first ping immediately to get initial latency
    this.sendPing();
    this.pingTimer = setInterval(() => this.sendPing(), this.options.pingIntervalMs);
  }

  private sendPing(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "ping", t: Date.now() }));
    }
  }

  private stopReconnecting(): void {
    this.intentionalClose = true;
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this._state.authError) {
      return;
    }
    const attempts = this._state.reconnectAttempts;
    if (attempts >= this.options.maxReconnectAttempts) {
      logOperationalEvent(
        "gateway_reconnect_failed",
        { attempts, auth_method: this.authMethod() },
        "error",
      );
      this.updateState({ status: "disconnected", error: "Max reconnect attempts reached" });
      return;
    }

    // DEPLOYMENT CACHE STRATEGY: When the server announced shutdown before
    // closing, the new instance is already running (blue-green overlap).
    // Use a fast 100ms delay on the first attempt only — subsequent retries
    // fall back to normal exponential backoff. The `serverInitiatedClose`
    // flag stays true for UI purposes (showing "Updating server…" instead
    // of "Connection lost") until the socket successfully re-opens.
    const useDeployFastDelay = this._state.serverInitiatedClose && !this.deployFastReconnectUsed;
    if (useDeployFastDelay) {
      this.deployFastReconnectUsed = true;
    }
    const delay = useDeployFastDelay
      ? DEPLOY_RECONNECT_DELAY_MS
      : Math.min(INITIAL_RECONNECT_DELAY_MS * 2 ** Math.min(attempts, 30), MAX_RECONNECT_DELAY_MS);
    console.debug("[GW] scheduleReconnect()", { attempt: attempts + 1, delayMs: delay });
    this.updateState({ status: "reconnecting", reconnectAttempts: attempts + 1 });

    this.reconnectTimer = setTimeout(() => {
      this.createSocket();
    }, delay);
  }

  private clearPingTimer(): void {
    if (this.pingTimer !== null) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private clearTimers(): void {
    this.clearPingTimer();
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private rejectAllPendingAcks(reason: string): void {
    this.pendingAcks.forEach((ack) => {
      clearTimeout(ack.timeoutHandle);
      ack.reject(reason);
    });
    this.pendingAcks.clear();
  }

  private authMethod(): "ticket" | "token" | "anonymous" {
    if (this.options.ticket) return "ticket";
    if (this.options.token ?? this.options.getToken?.()) return "token";
    return "anonymous";
  }

  private updateState(patch: Partial<GatewayClientState>): void {
    this._state = { ...this._state, ...patch };
    this.options.onStateChange(this._state);
  }
}
