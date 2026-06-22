import type { ClientToServerEvents, PlayableGameSlug, ServerToClientEvents } from "@tcg/protocol";
import type {
  AuthMethod,
  CredentialsController,
  GatewayAcquireOptions,
  GatewayConnectionState,
  GatewayCredentials,
  GatewayHandle,
  GatewayManagerOptions,
  JoinOptions,
  ServerEventPayload,
} from "./types.js";
import { INITIAL_GATEWAY_STATE, createStateStore, type StateStore } from "./state.js";
import { createGatewaySocket, type GatewayHandshakeAuth, type GatewaySocket } from "./socket.js";

const AUTH_METHODS: readonly AuthMethod[] = [
  "ticket",
  "jwt",
  "session",
  "authenticated",
  "anonymous",
];

function isAuthMethod(value: unknown): value is AuthMethod {
  return typeof value === "string" && (AUTH_METHODS as readonly string[]).includes(value);
}

/**
 * Merge a partial patch into a credentials snapshot. `undefined` means "leave
 * unchanged"; `null` means "clear" (normalize to `undefined`). This lets
 * callers explicitly clear a previously-set field (e.g. drop a JWT/requireAuth
 * on sign-out) instead of leaving stale auth material stuck in the snapshot.
 */
function mergeCredentials(
  base: GatewayCredentials,
  patch: Partial<GatewayCredentials>,
): GatewayCredentials {
  const next: GatewayCredentials = { ...base };
  if (patch.ticket !== undefined) next.ticket = patch.ticket ?? undefined;
  if (patch.token !== undefined) next.token = patch.token ?? undefined;
  if (patch.requireAuth !== undefined) next.requireAuth = patch.requireAuth ?? undefined;
  return next;
}

/**
 * Minimal structural view of the Socket.IO `Manager` used for manager-level
 * lifecycle events (`reconnect_attempt`, `reconnect`). Avoids importing the
 * concrete Manager type and stays `any`-free.
 */
type SocketManagerLike = {
  on(event: string, listener: (...args: unknown[]) => void): unknown;
  off(event: string, listener: (...args: unknown[]) => void): unknown;
};

/**
 * String-keyed view of the socket used to register/emit through a *generic*
 * event key. socket.io-client's `on`/`off`/`emit` overloads use a
 * `FallbackToUntypedListener` conditional that does not reduce for a type
 * parameter, so a generic `on<K>(event: K, ...)` cannot be expressed against
 * the public overloads directly. This view bridges that library typing quirk
 * while the public `GatewayHandle` surface stays fully typed. The first
 * argument is the single event payload by the wire contract.
 */
type ListenerView = {
  on(event: string, listener: (...args: unknown[]) => void): unknown;
  off(event: string, listener: (...args: unknown[]) => void): unknown;
  emit(event: string, ...args: unknown[]): unknown;
};

function listenerView(socket: GatewaySocket): ListenerView {
  return socket as unknown as ListenerView;
}

interface SocketEntry {
  readonly slug: PlayableGameSlug;
  socket: GatewaySocket;
  refCount: number;
  /** Library-owned credentials snapshot. The ticket is cleared here after use. */
  snapshot: GatewayCredentials;
  /** Controller established by the first `acquire()` for this slug. */
  credentials?: CredentialsController;
  /** In-flight credential refresh promise, used to dedupe concurrent calls. */
  refreshInFlight?: Promise<GatewayCredentials> | null;
  /** One-shot guard: a single refresh attempt per auth failure. */
  refreshAttempted: boolean;
  /** Transient flag: a refresh cycle ran; cleared by the next authenticated welcome. */
  wasRefreshing: boolean;
  /** Library-owned latency ping loop handle (set only when `options.ping` is supplied). */
  pingTimer?: ReturnType<typeof setInterval> | null;
  /** Per-entry subscribers for round-trip latency samples. */
  onLatencyListeners: Set<(ms: number) => void>;
  /** Per-entry subscribers for `heartbeat_ack` payloads. */
  onHeartbeatAckListeners: Set<(payload: ServerEventPayload<"heartbeat_ack">) => void>;
  /** Guards against replaying a consumed single-use ticket. */
  ticketConsumed: boolean;
  state: StateStore;
  /** Manager-owned lifecycle listeners, detached on teardown. */
  internalCleanups: Array<() => void>;
  destroyed: boolean;
}

export interface GatewayConnectionManager {
  /** Acquire (or join) the socket for a slug. Ref-counted: same slug returns a new handle on the SAME socket. */
  acquire(slug: PlayableGameSlug, opts?: GatewayAcquireOptions): GatewayHandle;
  /** Push credentials for a slug's socket (SSR-hydrated values or refreshed tokens). Triggers nothing by itself. */
  setCredentials(slug: PlayableGameSlug, credentials: GatewayCredentials): void;
  /** Read-only state for a slug (idle if never acquired). */
  getState(slug: PlayableGameSlug): GatewayConnectionState;
  /** Subscribe to a slug's state. Returns unsubscribe. */
  subscribeState(slug: PlayableGameSlug, cb: (s: GatewayConnectionState) => void): () => void;
  /** Tear down all sockets and reset. */
  destroy(): void;
}

export function createGatewayConnectionManager(
  options: GatewayManagerOptions,
): GatewayConnectionManager {
  const gatewayOrigin = normalizeOrigin(options.gatewayOrigin);
  const onAnalytics = options.onAnalytics;
  const entries = new Map<PlayableGameSlug, SocketEntry>();
  /** Credentials pushed before the first `acquire()` (e.g. SSR-hydrated values). */
  const pendingCredentials = new Map<PlayableGameSlug, GatewayCredentials>();

  /**
   * Peek the credentials that *would* be sent on the next handshake, without
   * consuming the ticket. Used by the {@link requireAuth} connect gate.
   */
  function peekCredentials(entry: SocketEntry): GatewayCredentials {
    const fresh = entry.credentials?.get();
    return {
      ticket: entry.ticketConsumed
        ? entry.snapshot.ticket
        : (fresh?.ticket ?? entry.snapshot.ticket),
      token: fresh?.token ?? entry.snapshot.token,
      requireAuth: fresh?.requireAuth ?? entry.snapshot.requireAuth,
    };
  }

  /**
   * Resolve the handshake `auth` payload AND consume the single-use ticket.
   * Standardizes today's drift (web cleared the ticket on `connect`, simulator
   * cleared it in `auth`): this library always clears it in the `auth`
   * callback, before the handshake yields.
   */
  function resolveHandshakeAuth(entry: SocketEntry): GatewayHandshakeAuth {
    const fresh = entry.credentials?.get();
    if (fresh) {
      // Always refresh reconnect-proof material from the lazy provider. `null`
      // explicitly clears (sign-out); `undefined` leaves the snapshot as-is so
      // a provider that omits a field doesn't clobber a push-set value.
      if (fresh.token !== undefined) entry.snapshot.token = fresh.token ?? undefined;
      if (fresh.requireAuth !== undefined)
        entry.snapshot.requireAuth = fresh.requireAuth ?? undefined;
      // Only adopt a provider-supplied ticket if we have not already consumed one.
      if (!entry.ticketConsumed && fresh.ticket !== undefined) {
        entry.snapshot.ticket = fresh.ticket ?? undefined;
      }
    }

    const payload: GatewayHandshakeAuth = {
      ...(entry.snapshot.ticket ? { ticket: entry.snapshot.ticket } : {}),
      ...(entry.snapshot.token ? { token: entry.snapshot.token } : {}),
      ...(entry.snapshot.requireAuth ? { requireAuth: true } : {}),
    };

    if (entry.snapshot.ticket) {
      entry.ticketConsumed = true;
      entry.snapshot.ticket = undefined;
    }
    return payload;
  }

  function tryConnect(entry: SocketEntry): void {
    if (entry.destroyed) return;
    if (entry.socket.connected) return;

    const creds = peekCredentials(entry);
    if (creds.requireAuth && !creds.ticket && !creds.token) {
      // Mirrors the web app's connect() gate: never queue into matchmaking as
      // anonymous when the user is signed in but has no live credentials.
      entry.state.set({
        status: "disconnected",
        authenticated: false,
        authMethod: null,
        error: "Signed-in gateway credentials are required before connecting.",
      });
      onAnalytics?.("ws_auth_policy_violation", {
        namespace: `/${entry.slug}`,
        reason: "missing_credentials",
      });
      // If a credentials controller is installed, give it a single chance to
      // recover (it may produce a fresh ticket/token). Without a controller the
      // gate stays a hard block, preserving the original backstop behavior.
      if (entry.credentials && !entry.refreshAttempted) {
        void attemptCredentialRefresh(entry);
      }
      return;
    }

    entry.state.set({ status: "connecting", error: null });
    entry.socket.connect();
  }

  /**
   * Overlay a refreshed credentials snapshot onto {@link entry.snapshot} using
   * the same null/undefined semantics as {@link setCredentials}, and re-arm the
   * single-use ticket guard when the refresh supplied a fresh ticket so the
   * next handshake consumes it.
   */
  function mergeRefreshedCredentials(entry: SocketEntry, refreshed: GatewayCredentials): void {
    entry.snapshot = mergeCredentials(entry.snapshot, refreshed);
    if (typeof refreshed.ticket === "string" && refreshed.ticket.length > 0) {
      entry.ticketConsumed = false;
    }
  }

  /**
   * Emit a latency probe. Only fires when the socket is live so a probing loop
   * never queues writes against a dormant transport.
   */
  function emitPing(entry: SocketEntry): void {
    if (entry.destroyed) return;
    if (!entry.socket.connected) return;
    entry.socket.emit("ping", { t: Date.now() });
  }

  /**
   * Heart of the credential-refresh loop (Half A). Dedupes concurrent calls,
   * retries at most once, merges the refreshed snapshot, then disconnects +
   * re-dials on the SAME socket instance so the next handshake re-reads creds.
   * On rejection (or a second unauthenticated welcome handled by the caller)
   * the caller transitions to terminal; this function handles refresh-throw.
   */
  async function attemptCredentialRefresh(entry: SocketEntry): Promise<void> {
    if (entry.destroyed) return;
    if (!entry.credentials) return;
    // Dedupe: a refresh is already in flight. All callers are fire-and-forget,
    // so ride along without starting a second refresh. (`refreshAttempted`
    // already gates callers at the call sites; this guards the in-flight window.)
    if (entry.refreshInFlight) return;

    entry.refreshAttempted = true;
    entry.wasRefreshing = true;
    entry.state.set({ authStatus: "refreshing" });
    onAnalytics?.("ws_credentials_refresh_attempt", { namespace: `/${entry.slug}` });

    const attempt = (async (): Promise<GatewayCredentials> => {
      try {
        const refreshed = await entry.credentials!.refresh();
        mergeRefreshedCredentials(entry, refreshed);
        onAnalytics?.("ws_credentials_refreshed", {
          namespace: `/${entry.slug}`,
          hadTicket: Boolean(refreshed.ticket),
          hadToken: Boolean(refreshed.token),
        });
        // disconnect + re-dial on the SAME socket instance (reuse reconnect semantics)
        if (entry.socket.connected) entry.socket.disconnect();
        tryConnect(entry);
        return refreshed;
      } catch (err) {
        onAnalytics?.("ws_credentials_refresh_failed", {
          namespace: `/${entry.slug}`,
          error: err instanceof Error ? err.message : String(err),
        });
        entry.state.set({
          status: "disconnected",
          authStatus: "failed",
          error: "Credential refresh failed.",
        });
        throw err;
      }
    })();

    entry.refreshInFlight = attempt;
    try {
      await attempt;
    } catch {
      // Already handled inside `attempt` (terminal state set + analytics). The
      // fire-and-forget callers (`void attemptCredentialRefresh(...)`) must not
      // surface an unhandled rejection, so swallow the rethrow here.
    } finally {
      entry.refreshInFlight = null;
    }
  }

  function wireInternalHandlers(entry: SocketEntry): void {
    const { socket, state } = entry;
    const manager = socket.io as unknown as SocketManagerLike;

    const onConnect = (): void => {
      state.set({
        status: "connected",
        connectionId: socket.id ?? null,
        error: null,
      });
    };
    socket.on("connect", onConnect);

    const onDisconnect = (reason: unknown): void => {
      state.set({
        status: "disconnected",
        authenticated: false,
        authMethod: null,
        error: typeof reason === "string" ? reason : "disconnected",
      });
    };
    socket.on("disconnect", onDisconnect);

    const onConnectError = (err: Error): void => {
      state.set({ error: err.message || "Connection error" });
    };
    socket.on("connect_error", onConnectError);

    const onWelcome = (payload: ServerEventPayload<"welcome">): void => {
      const authenticated = Boolean(payload.authenticated);
      const method = payload.authenticationMethod;
      const authMethod: AuthMethod = isAuthMethod(method)
        ? method
        : authenticated
          ? "authenticated"
          : "anonymous";
      state.set({
        authenticated,
        authMethod,
        ...(payload.connectionId ? { connectionId: payload.connectionId } : {}),
      });

      const requireAuth = Boolean(peekCredentials(entry).requireAuth);
      if (!authenticated && requireAuth && entry.credentials && !entry.refreshAttempted) {
        // Auth failure on a requireAuth namespace with a controller installed:
        // give the controller a single chance to produce fresh credentials.
        void attemptCredentialRefresh(entry);
      } else if (!authenticated && requireAuth && entry.refreshAttempted) {
        // A refresh already ran and the gateway still rejects us — go terminal.
        state.set({
          status: "disconnected",
          authStatus: "failed",
          error: "Credential refresh did not restore authenticated access.",
        });
        onAnalytics?.("ws_auth_terminal_failure", {
          namespace: `/${entry.slug}`,
          reason: "refresh_exhausted",
        });
      } else if (authenticated) {
        // Successful auth after (possibly) a refresh — reset the one-shot.
        if (entry.wasRefreshing) {
          entry.wasRefreshing = false;
          onAnalytics?.("ws_auth_recovered", { namespace: `/${entry.slug}` });
        }
        entry.refreshAttempted = false;
        if (state.get().authStatus !== "ok") {
          state.set({ authStatus: "ok" });
        }
      }
    };
    socket.on("welcome", onWelcome);

    const onPong = (payload: ServerEventPayload<"pong">): void => {
      const t = payload.t;
      if (typeof t !== "number") return;
      const latencyMs = Date.now() - t;
      state.set({ latencyMs });
      for (const cb of entry.onLatencyListeners) cb(latencyMs);
      onAnalytics?.("ws_latency_sample", {
        namespace: `/${entry.slug}`,
        latencyMs,
      });
    };
    socket.on("pong", onPong);

    const onHeartbeatAck = (payload: ServerEventPayload<"heartbeat_ack">): void => {
      for (const cb of entry.onHeartbeatAckListeners) cb(payload);
    };
    socket.on("heartbeat_ack", onHeartbeatAck);

    const onReconnectAttempt = (attempt: unknown): void => {
      const next = typeof attempt === "number" ? attempt : entry.state.get().reconnectAttempt + 1;
      state.set({ status: "reconnecting", reconnectAttempt: next });
    };
    manager.on("reconnect_attempt", onReconnectAttempt);

    const onReconnect = (): void => {
      state.set({ reconnectAttempt: 0 });
    };
    manager.on("reconnect", onReconnect);

    entry.internalCleanups.push(
      () => socket.off("connect", onConnect),
      () => socket.off("disconnect", onDisconnect),
      () => socket.off("connect_error", onConnectError),
      () => socket.off("welcome", onWelcome),
      () => socket.off("pong", onPong),
      () => socket.off("heartbeat_ack", onHeartbeatAck),
      () => manager.off("reconnect_attempt", onReconnectAttempt),
      () => manager.off("reconnect", onReconnect),
    );
  }

  function teardownEntry(entry: SocketEntry, remove: boolean): void {
    for (const cleanup of entry.internalCleanups) cleanup();
    entry.internalCleanups = [];
    if (entry.pingTimer) {
      clearInterval(entry.pingTimer);
      entry.pingTimer = null;
    }
    entry.socket.removeAllListeners();
    entry.socket.disconnect();
    entry.destroyed = true;
    // Defensive: a re-acquired entry (after full teardown) starts clean.
    entry.refreshAttempted = false;
    entry.wasRefreshing = false;
    entry.refreshInFlight = null;
    if (remove) {
      entries.delete(entry.slug);
    }
  }

  function createHandle(entry: SocketEntry): GatewayHandle {
    /** Per-handle unsubscribe callbacks. `release()` runs only these. */
    const handleCleanups = new Set<() => void>();

    function addTypedListener<K extends keyof ServerToClientEvents>(
      event: K,
      cb: (payload: ServerEventPayload<K>) => void,
    ): () => void {
      const view = listenerView(entry.socket);
      const wrapper = (...args: unknown[]): void => {
        cb(args[0] as ServerEventPayload<K>);
      };
      view.on(event, wrapper);
      const off = () => view.off(event, wrapper);
      handleCleanups.add(off);
      return off;
    }

    function addManagerListener(event: string, handler: () => void): () => void {
      const manager = entry.socket.io as unknown as SocketManagerLike;
      manager.on(event, handler);
      const off = () => manager.off(event, handler);
      handleCleanups.add(off);
      return off;
    }

    function addConnectListener(cb: () => void): () => void {
      const handler = (): void => cb();
      entry.socket.on("connect", handler);
      const off = () => entry.socket.off("connect", handler);
      handleCleanups.add(off);
      return off;
    }

    function addDisconnectListener(cb: (reason: unknown) => void): () => void {
      const handler = (reason: unknown): void => cb(reason);
      entry.socket.on("disconnect", handler);
      const off = () => entry.socket.off("disconnect", handler);
      handleCleanups.add(off);
      return off;
    }

    /**
     * Per-handle join state. Two handles on the same namespace may join
     * different matches, so this lives on the handle (not the entry).
     */
    let joinOptions: JoinOptions | null = null;
    /** Socket id we last emitted `join_game` against; skips same-session dupes. */
    let joinedSocketId: string | null = null;
    /** Timestamp of the last emit; suppresses rapid re-emits within 2s. */
    let joinInFlightSince: number | null = null;
    /** Internal subscriptions backing the active join intent. */
    let stopJoinAuth: (() => void) | null = null;
    let stopJoinDisconnect: (() => void) | null = null;

    /**
     * Emit `join_game` for the stored intent. Dedupes by current socket id and
     * by an in-flight window (2s) so a flap or rapid reconnect never double-
     * emits. Generates a fresh `correlationId` per emit.
     */
    const performJoin = (): void => {
      if (!joinOptions) return;
      const socketId = entry.socket.id ?? null;
      if (socketId !== null && joinedSocketId === socketId) return;
      const now = Date.now();
      if (joinInFlightSince !== null && now - joinInFlightSince < 2000) return;
      const payload: Record<string, unknown> = {
        gameId: joinOptions.gameId,
        role: joinOptions.role,
        correlationId: globalThis.crypto.randomUUID(),
      };
      if (joinOptions.gameProfileId !== undefined) {
        payload.gameProfileId = joinOptions.gameProfileId;
      }
      listenerView(entry.socket).emit("join_game", payload);
      joinedSocketId = socketId;
      joinInFlightSince = now;
    };

    const handle: GatewayHandle = {
      slug: entry.slug,
      on: addTypedListener,
      onAny: (cb) => {
        const wrapper = (event: string, ...args: unknown[]): void => cb(event, args[0]);
        entry.socket.onAny(wrapper);
        const off = () => entry.socket.offAny(wrapper);
        handleCleanups.add(off);
        return off;
      },
      emit: <K extends keyof ClientToServerEvents>(
        event: K,
        payload: Parameters<ClientToServerEvents[K]>[0],
      ): void => {
        listenerView(entry.socket).emit(event, payload);
      },
      onConnected: (cb) => {
        if (entry.socket.connected) cb();
        return addConnectListener(cb);
      },
      onWelcome: (cb) => addTypedListener("welcome", (payload) => cb(payload)),
      onDisconnected: (cb) => addDisconnectListener(cb),
      onReconnect: (cb) => addManagerListener("reconnect", () => cb()),
      onAuthenticated: (cb) => {
        let fired = false;
        const isReady = (s: GatewayConnectionState): boolean =>
          s.status === "connected" && s.authenticated;
        // Immediate-fire at registration if already ready. Pre-sets `fired`
        // so the subscribe's synchronous first call (with the same state) is
        // a no-op rather than a duplicate.
        if (isReady(entry.state.get())) {
          fired = true;
          cb();
        }
        const off = entry.state.subscribe((s) => {
          if (isReady(s)) {
            if (!fired) {
              fired = true;
              cb();
            }
          } else {
            // Re-arm on transition OUT of authenticated-connected so a later
            // re-entry fires again (edge-triggered, not one-shot).
            fired = false;
          }
        });
        handleCleanups.add(off);
        return off;
      },
      onLatency: (cb) => {
        entry.onLatencyListeners.add(cb);
        const off = (): void => {
          entry.onLatencyListeners.delete(cb);
        };
        handleCleanups.add(off);
        return off;
      },
      onHeartbeatAck: (cb) => {
        entry.onHeartbeatAckListeners.add(cb);
        const off = (): void => {
          entry.onHeartbeatAckListeners.delete(cb);
        };
        handleCleanups.add(off);
        return off;
      },
      join: (options) => {
        joinOptions = options;
        // Lazy subscription: only register on the first join() so repeated
        // calls don't stack subscriptions. `onAuthenticated` already
        // immediate-fires if currently ready, and `performJoin` dedupes by
        // socket id + in-flight window, so a stacked subscription would only
        // ever no-op — but lazy-once is the clean shape.
        if (!stopJoinAuth) {
          stopJoinAuth = handle.onAuthenticated(performJoin);
          stopJoinDisconnect = handle.onDisconnected(() => {
            // A reconnect produces a new socket id, so re-arm so the next
            // authenticated signal re-emits the join.
            joinedSocketId = null;
          });
        }
      },
      leave: () => {
        if (joinOptions) {
          const payload: Record<string, unknown> = { gameId: joinOptions.gameId };
          if (joinOptions.gameProfileId !== undefined) {
            payload.gameProfileId = joinOptions.gameProfileId;
          }
          listenerView(entry.socket).emit("leave_game", payload);
        }
        joinOptions = null;
        joinedSocketId = null;
        joinInFlightSince = null;
        if (stopJoinAuth) {
          stopJoinAuth();
          stopJoinAuth = null;
        }
        if (stopJoinDisconnect) {
          stopJoinDisconnect();
          stopJoinDisconnect = null;
        }
      },
      reconnect: () => {
        if (entry.destroyed) return;
        // Reuse the existing Socket.IO instance: disconnect (if live) so the
        // next dial performs a brand-new handshake, then re-run the connect
        // gate. The handshake `auth` callback re-reads the current credentials
        // snapshot — including a ticket just reset via `setCredentials` — so a
        // freshly installed single-use ticket is consumed on this handshake.
        if (entry.socket.connected) {
          entry.socket.disconnect();
        }
        tryConnect(entry);
      },
      getState: () => entry.state.get(),
      subscribeState: (cb) => entry.state.subscribe(cb),
      release: () => {
        for (const cleanup of handleCleanups) cleanup();
        handleCleanups.clear();
        entry.refCount -= 1;
        if (entry.refCount <= 0) {
          teardownEntry(entry, true);
        }
      },
    };
    return handle;
  }

  function acquire(slug: PlayableGameSlug, opts?: GatewayAcquireOptions): GatewayHandle {
    const existing = entries.get(slug);
    if (existing) {
      // A namespace owns a single credentials lifecycle: the first acquire's
      // controller wins. A later acquire may pass the SAME controller reference
      // (or none) but a different controller object is a programming error.
      const next = opts?.credentials;
      if (next && existing.credentials && next !== existing.credentials) {
        throw new Error(
          `gateway-client: a different CredentialsController is already installed for "/${slug}". ` +
            "A namespace owns a single credentials lifecycle (first acquire wins).",
        );
      }
      if (next && !existing.credentials) {
        existing.credentials = next;
      }
      existing.refCount += 1;
      return createHandle(existing);
    }

    const pending = pendingCredentials.get(slug);
    pendingCredentials.delete(slug);

    const url = `${gatewayOrigin}/${slug}`;
    const entry: SocketEntry = {
      slug,
      // Assigned immediately below; createGatewaySocket needs the auth resolver
      // which closes over `entry`, so the field is typed then filled.
      socket: undefined as unknown as GatewaySocket,
      refCount: 1,
      snapshot: pending ?? {},
      credentials: opts?.credentials,
      refreshInFlight: null,
      refreshAttempted: false,
      wasRefreshing: false,
      pingTimer: null,
      onLatencyListeners: new Set(),
      onHeartbeatAckListeners: new Set(),
      ticketConsumed: false,
      state: createStateStore(),
      internalCleanups: [],
      destroyed: false,
    };
    entry.socket = createGatewaySocket({
      url,
      resolveHandshakeAuth: () => resolveHandshakeAuth(entry),
    });
    wireInternalHandlers(entry);
    // Library-owned latency probing: a single cadence applied to all namespaces
    // that supply ping config. The interval is cleared on teardown.
    if (options.ping) {
      const timer = setInterval(() => emitPing(entry), options.ping.intervalMs);
      entry.pingTimer = timer;
      entry.internalCleanups.push(() => {
        clearInterval(timer);
        entry.pingTimer = null;
      });
    }
    entries.set(slug, entry);

    tryConnect(entry);
    return createHandle(entry);
  }

  function setCredentials(slug: PlayableGameSlug, credentials: GatewayCredentials): void {
    const entry = entries.get(slug);
    if (entry) {
      // An explicit refresh may supply a brand-new single-use ticket.
      if (credentials.ticket !== undefined) entry.ticketConsumed = false;
      entry.snapshot = mergeCredentials(entry.snapshot, credentials);
      return;
    }
    const prev = pendingCredentials.get(slug) ?? {};
    pendingCredentials.set(slug, mergeCredentials(prev, credentials));
  }

  function getState(slug: PlayableGameSlug): GatewayConnectionState {
    return entries.get(slug)?.state.get() ?? { ...INITIAL_GATEWAY_STATE };
  }

  function subscribeState(
    slug: PlayableGameSlug,
    cb: (state: GatewayConnectionState) => void,
  ): () => void {
    const entry = entries.get(slug);
    if (entry) return entry.state.subscribe(cb);
    cb({ ...INITIAL_GATEWAY_STATE });
    return () => {};
  }

  function destroy(): void {
    for (const entry of entries.values()) teardownEntry(entry, false);
    entries.clear();
    pendingCredentials.clear();
  }

  return { acquire, setCredentials, getState, subscribeState, destroy };
}

/** Strip everything after the host/port so `${origin}/${slug}` is always valid. */
function normalizeOrigin(input: string): string {
  try {
    const url = new URL(input);
    return `${url.protocol}//${url.host}`;
  } catch {
    return input.replace(/\/$/, "");
  }
}
