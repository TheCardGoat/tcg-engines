import type { ClientToServerEvents, PlayableGameSlug, ServerToClientEvents } from "@tcg/protocol";

/**
 * Gateway client public types.
 *
 * This module deliberately depends only on `@tcg/protocol`. It never imports
 * Better Auth, never references an HTTP endpoint, and exposes no framework
 * (React/Svelte) types. Apps supply ticket + token via the credentials seam.
 */

/**
 * How the gateway authenticated the socket, echoed on the `welcome` event.
 * Matches `SocketData.authMethod` on the server plus the synthetic fallbacks
 * the web client already derived (`authenticated` / `anonymous`).
 */
export type AuthMethod = "ticket" | "jwt" | "session" | "authenticated" | "anonymous";

/**
 * Credentials snapshot supplied by the app. The library owns the lifetime of
 * the single-use {@link GatewayCredentials.ticket}; it does not fetch tickets
 * or JWTs itself but orchestrates a refresh through the installed
 * {@link CredentialsController} when the gateway rejects an authed socket.
 *
 * Clearing semantics: a field set to `null` explicitly CLEARS the stored value
 * in the manager snapshot (e.g. on sign-out); a field that is `undefined` is
 * treated as "no change". This lets apps keep the snapshot in sync across
 * sign-in / sign-out transitions instead of leaving stale auth material behind.
 */
export interface GatewayCredentials {
  /**
   * Single-use ticket from the gateway ticket endpoint. The library embeds it
   * in the first handshake `auth` object and then clears it from its internal
   * snapshot so a reconnect never replays a consumed ticket. Pass `null` to
   * explicitly clear a previously-pushed ticket.
   */
  ticket?: string | null;
  /**
   * JWT (preferred) or opaque session token used as reconnect proof. The
   * gateway verifies JWTs via JWKS; opaque tokens rely on the session cookie.
   * Pass `null` to explicitly clear a previously-pushed token (e.g. on logout).
   */
  token?: string | null;
  /**
   * When true, the gateway rejects an anonymous downgrade. Apps set this when
   * the user is signed in (mirrors `authMode: "required"` on the server). Set
   * to `false` (or `null`) to drop the requirement on sign-out.
   */
  requireAuth?: boolean | null;
}

export type GatewayConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

export interface GatewayConnectionState {
  status: GatewayConnectionStatus;
  authenticated: boolean;
  authMethod: AuthMethod | null;
  connectionId: string | null;
  latencyMs: number | null;
  reconnectAttempt: number;
  error: string | null;
  /** Observability for the library-owned credential-refresh loop. */
  authStatus: "ok" | "refreshing" | "failed";
}

/** Payload type of a single server→client event. */
export type ServerEventPayload<K extends keyof ServerToClientEvents> = Parameters<
  ServerToClientEvents[K]
>[0];

/**
 * A consumer's scoped view onto a shared per-namespace socket. Listeners
 * registered through a handle are tracked per-handle so {@link release} only
 * removes this consumer's listeners and only decrements this consumer's
 * reference on the shared socket.
 */
export interface GatewayHandle {
  readonly slug: PlayableGameSlug;
  /** Subscribe to one server→client event. Returns an unsubscribe. */
  on<K extends keyof ServerToClientEvents>(
    event: K,
    cb: (payload: ServerEventPayload<K>) => void,
  ): () => void;
  /** Catch-all subscription (e.g. a dispatcher). Returns an unsubscribe. */
  onAny(cb: (event: string, payload: unknown) => void): () => void;
  /** Emit a client→server event on the shared socket. */
  emit<K extends keyof ClientToServerEvents>(
    event: K,
    payload: Parameters<ClientToServerEvents[K]>[0],
  ): void;
  /**
   * Fires after every (re)connect. The consumer owns join/idempotency logic
   * here (e.g. emitting `join_game`). Also fires once at registration time if
   * the socket is already connected.
   */
  onConnected(cb: () => void): () => void;
  /** Fires on the gateway `welcome` event with the welcome payload. */
  onWelcome(cb: (payload: ServerEventPayload<"welcome">) => void): () => void;
  /** Fires on socket `disconnect` with the socket.io reason. */
  onDisconnected(cb: (reason: unknown) => void): () => void;
  /** Fires on manager-level successful reconnect. */
  onReconnect(cb: () => void): () => void;
  /**
   * Edge-triggered "ready to participate" signal: fires when the socket is
   * both connected AND authenticated, but only on the transition INTO that
   * state (not on every state change). Also fires once at registration time
   * if the socket is already connected+authenticated.
   */
  onAuthenticated(cb: () => void): () => void;
  /** Fires when the library-owned ping loop observes a round-trip latency. */
  onLatency(cb: (latencyMs: number) => void): () => void;
  /**
   * Fires when the gateway acknowledges a `heartbeat` with `heartbeat_ack`.
   * The payload is surfaced raw — the consumer decides whether to request a
   * state sync based on the echoed `stateVersions` (a game-domain decision).
   */
  onHeartbeatAck(cb: (payload: ServerEventPayload<"heartbeat_ack">) => void): () => void;
  /**
   * Join a game on the gateway. Stores the join intent on this handle and
   * emits `join_game` once the socket is connected+authenticated (immediately
   * if already so), then re-emits automatically on every reconnect. Deduped
   * per-socket-id and per in-flight window (2s) so duplicate fires don't
   * double-emit. Idempotent within a socket session.
   */
  join(options: JoinOptions): void;
  /**
   * Leave the current game on the gateway. Clears the join intent (so a
   * reconnect no longer re-joins) and emits `leave_game` if a join intent
   * was previously set. Stops the internal join subscription.
   */
  leave(): void;
  /**
   * Force a fresh handshake on the existing socket. Disconnects first if the
   * socket is currently live, then re-runs the connect gate and dials — so the
   * handshake `auth` callback re-reads the latest credentials (including a
   * freshly-pushed single-use ticket). The Socket.IO instance is REUSED, not
   * recreated; this is distinct from `release()` + `acquire()`, which tears the
   * socket down and builds a new one.
   */
  reconnect(): void;
  /** Current connection state snapshot. */
  getState(): GatewayConnectionState;
  /** Subscribe to state changes. Returns an unsubscribe. */
  subscribeState(cb: (state: GatewayConnectionState) => void): () => void;
  /** Release this consumer's hold. Removes only this handle's listeners and decrements the ref-count. */
  release(): void;
}

export interface PingConfig {
  /** Interval in ms between latency probes. The library owns the setInterval. */
  intervalMs: number;
}

/**
 * Options for joining a game on the gateway. Matches the wire shape of the
 * `join_game` payload (sans `type`, which is the Socket.IO event name) minus
 * the library-managed `correlationId`/`userId` echoes.
 */
export interface JoinOptions {
  gameId: string;
  role: "player" | "spectator";
  gameProfileId?: string;
}

/** Installed once per namespace via acquire(); first acquire wins. */
export interface CredentialsController {
  /**
   * Sync snapshot re-read on every (re)connect handshake. Returns the current
   * best-available credentials (ticket/token/requireAuth). The library owns the
   * lifetime of any single-use ticket returned here.
   */
  get(): GatewayCredentials;
  /**
   * Async, called by the library on auth failure (unauthenticated welcome with
   * requireAuth, or a blocked tryConnect gate). Must return a fresh credentials
   * snapshot. Should NOT throw on "no creds available" — return the best
   * available snapshot and let the library decide. The library dedupes
   * concurrent calls and retries at most once before transitioning to terminal.
   */
  refresh(): Promise<GatewayCredentials>;
}

export interface GatewayManagerOptions {
  /**
   * Resolved gateway origin, e.g. `"wss://gateway.tcg.online"`. The app owns
   * environment/origin resolution; the library never reads env directly.
   */
  gatewayOrigin: string;
  /** Optional analytics sink (e.g. the web app's `trackEvent`). The library never imports analytics. */
  onAnalytics?: (event: string, payload?: Record<string, unknown>) => void;
  /** Enables the library-owned ping loop. When omitted, no ping loop runs. */
  ping?: PingConfig;
}

export interface GatewayAcquireOptions {
  /** Credentials controller installed once per namespace; first acquire wins. */
  credentials?: CredentialsController;
}
