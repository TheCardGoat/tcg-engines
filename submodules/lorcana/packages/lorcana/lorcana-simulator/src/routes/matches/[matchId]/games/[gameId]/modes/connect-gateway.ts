import {
  GatewayClientStore,
  createGatewayStore,
} from "@/features/gateway/gateway-client.svelte.js";
import {
  createLiveMatchCredentialsController,
  refreshLiveMatchRealtimeAccess,
} from "@/features/gateway/live-match-credentials.js";
import { createLiveMatchSession, type LiveMatchBootstrapV1 } from "@tcg/game-page-contract";
import { trackEvent } from "$lib/analytics/analytics.js";

const JOIN_TIMEOUT_MS = 10_000;

export async function connectAndJoin(params: {
  bootstrap: LiveMatchBootstrapV1;
  matchType?: string;
  onMessage: (msg: Record<string, unknown>) => void;
}): Promise<{
  gateway: MatchGatewayConnection;
  joinedMsg: Record<string, unknown> | null;
  pendingMessages: Record<string, unknown>[];
  error: string | null;
}> {
  const { bootstrap, matchType, onMessage } = params;
  const { realtime } = bootstrap;
  if (!realtime) {
    throw new Error("The live-match bootstrap does not include realtime access.");
  }
  const gameId = bootstrap.game.gameId;

  let resolveJoined!: (msg: Record<string, unknown>) => void;
  let rejectJoined!: (errorMsg: string) => void;
  const joinedPromise = new Promise<Record<string, unknown>>((resolve, reject) => {
    resolveJoined = resolve;
    rejectJoined = reject;
  });

  const pendingMessages: Record<string, unknown>[] = [];
  let joined = false;

  const ERROR_TYPES = new Set(["game_error", "error", "gateway_error"]);

  const gateway = createGatewayStore(
    realtime.wsUrl,
    realtime.ticket,
    undefined,
    undefined,
    realtime.reconnectToken,
    () => realtime.reconnectToken,
    createLiveMatchCredentialsController(realtime, () =>
      refreshLiveMatchRealtimeAccess({
        matchId: bootstrap.match.matchId,
        gameId: bootstrap.game.gameId,
        expectedViewer: bootstrap.viewer,
      }),
    ),
  );

  const handle = createGatewayHandle(gateway);
  const session = createLiveMatchSession({
    handle,
    bootstrap,
    authority: bootstrap.game.authority,
    onGameEvent: (_event, payload) => {
      if (!isRecord(payload)) return;
      const msg = payload as Record<string, unknown>;
      if (msg.type === "game_joined") {
        joined = true;
        resolveJoined(msg);
        return;
      }
      if (!joined) {
        if (ERROR_TYPES.has(msg.type as string)) {
          onMessage(msg);
          const errorMsg =
            typeof msg.message === "string" ? msg.message : "Server error — could not join game";
          rejectJoined(errorMsg);
        } else {
          pendingMessages.push(msg);
        }
        return;
      }
      onMessage(msg);
    },
  });
  session.start();

  gateway.connect();

  const connected = await new Promise<boolean>((resolve) => {
    const interval = setInterval(() => {
      if (gateway.connectionId) {
        clearInterval(interval);
        resolve(true);
      }
    }, 50);
    setTimeout(() => {
      clearInterval(interval);
      resolve(!!gateway.connectionId);
    }, JOIN_TIMEOUT_MS);
  });

  if (!connected) {
    const connection = new MatchGatewayConnection(gateway, session);
    connection.destroy();
    return {
      gateway: connection,
      joinedMsg: null,
      pendingMessages,
      error: "Failed to connect to game server.",
    };
  }

  trackEvent("game_join", {
    mode:
      bootstrap.viewer.role === "spectator"
        ? "spectator"
        : matchType === "ranked"
          ? "ranked"
          : "practice",
  });

  type JoinResult = { ok: true; msg: Record<string, unknown> } | { ok: false; error: string };

  const joinResult = await Promise.race<JoinResult>([
    joinedPromise
      .then((msg) => ({ ok: true as const, msg }))
      .catch((err: unknown) => ({
        ok: false as const,
        error: typeof err === "string" ? err : "Server error — could not join game",
      })),
    new Promise<JoinResult>((resolve) =>
      setTimeout(
        () => resolve({ ok: false, error: "Timeout waiting to join game." }),
        JOIN_TIMEOUT_MS,
      ),
    ),
  ]);

  if (!joinResult.ok) {
    const connection = new MatchGatewayConnection(gateway, session);
    connection.destroy();
    return {
      gateway: connection,
      joinedMsg: null,
      pendingMessages,
      error: joinResult.error,
    };
  }

  return {
    gateway: new MatchGatewayConnection(gateway, session),
    joinedMsg: joinResult.msg,
    pendingMessages,
    error: null,
  };
}

type SharedGatewayHandle = Parameters<typeof createLiveMatchSession>[0]["handle"];
type SharedGatewayState = ReturnType<SharedGatewayHandle["getState"]>;

export class MatchGatewayConnection {
  constructor(
    private readonly transport: GatewayClientStore,
    private readonly session: ReturnType<typeof createLiveMatchSession>,
  ) {}

  get status() {
    return this.transport.status;
  }

  get connectionId() {
    return this.transport.connectionId;
  }

  get serverInitiatedClose() {
    return this.transport.serverInitiatedClose;
  }

  get authError() {
    return this.transport.authError;
  }

  send(message: object): boolean {
    return this.transport.send(message);
  }

  sendWithAck<T extends { type: string; correlationId?: string; [key: string]: unknown }>(
    message: object,
    timeoutMs?: number,
  ): Promise<T> {
    return this.transport.sendWithAck<T>(message, timeoutMs);
  }

  addGameMessageListener(handler: (msg: { type: string; [key: string]: unknown }) => void) {
    return this.transport.addGameMessageListener(handler);
  }

  addStatusChangeListener(handler: Parameters<GatewayClientStore["addStatusChangeListener"]>[0]) {
    return this.transport.addStatusChangeListener(handler);
  }

  destroy(): void {
    this.session.stop();
    this.transport.destroy();
  }
}

function createGatewayHandle(transport: GatewayClientStore): SharedGatewayHandle {
  let joinedGameId: string | null = null;
  let joinStatusCleanup: (() => void) | null = null;

  const messageListener = <T>(event: string, callback: (payload: T) => void) =>
    transport.addGameMessageListener((message) => {
      if (message.type === event) callback(message as T);
    });
  const statusListener = (callback: (state: SharedGatewayState) => void) => {
    const emit = () => callback(readGatewayState(transport));
    const cleanup = transport.addStatusChangeListener(emit);
    emit();
    return cleanup;
  };

  return {
    slug: "lorcana",
    on: (event, callback) => messageListener(String(event), callback as (payload: unknown) => void),
    onAny: (callback) =>
      transport.addGameMessageListener((message) => callback(String(message.type), message)),
    emit: (event, payload) => {
      transport.send({ type: event, ...payload });
    },
    onConnected: (callback) =>
      statusListener((state) => {
        if (state.status === "connected") callback();
      }),
    onWelcome: (callback) => messageListener("welcome", callback as (payload: unknown) => void),
    onDisconnected: (callback) =>
      statusListener((state) => {
        if (state.status === "disconnected") callback(state.error);
      }),
    onReconnect: (callback) =>
      statusListener((state) => {
        if (state.status === "connected" && state.reconnectAttempt > 0) callback();
      }),
    onAuthenticated: (callback) =>
      statusListener((state) => {
        if (state.status === "connected" && state.authenticated) callback();
      }),
    onLatency: (callback) => {
      let previous: number | null = null;
      return statusListener((state) => {
        if (state.latencyMs !== null && state.latencyMs !== previous) {
          previous = state.latencyMs;
          callback(state.latencyMs);
        }
      });
    },
    onHeartbeatAck: (callback) =>
      messageListener("heartbeat_ack", callback as (payload: unknown) => void),
    join: ({ gameId, stateVersion }) => {
      joinedGameId = gameId;
      const emitJoin = () =>
        transport.send({
          type: "join_game",
          gameId,
          ...(stateVersion !== undefined ? { stateVersion } : {}),
        });
      joinStatusCleanup?.();
      joinStatusCleanup = transport.addStatusChangeListener((status) => {
        if (status === "connected" && joinedGameId) emitJoin();
      });
      if (transport.status === "connected") emitJoin();
    },
    leave: () => {
      joinStatusCleanup?.();
      joinStatusCleanup = null;
      if (joinedGameId) transport.send({ type: "leave_game", gameId: joinedGameId });
      joinedGameId = null;
    },
    reconnect: () => {
      transport.disconnect();
      transport.connect();
    },
    getState: () => readGatewayState(transport),
    subscribeState: statusListener,
    release: () => transport.destroy(),
  } as SharedGatewayHandle;
}

function readGatewayState(transport: GatewayClientStore): SharedGatewayState {
  return {
    status: transport.status,
    authenticated: transport.authenticated,
    authMethod: transport.authMethod === "token" ? "jwt" : transport.authMethod,
    connectionId: transport.connectionId,
    latencyMs: transport.latencyMs,
    reconnectAttempt: transport.reconnectAttempts,
    error: transport.error,
    authStatus: transport.authError ? "failed" : "ok",
    authFailureReason: transport.authError ? "connect_error" : null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
