import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { type CommandSuccess, type MatchState } from "@tcg/cyberpunk-engine";
import type {
  ClientToServerEvents,
  EngineInteractionView,
  InteractionSubmission,
  InteractionSubmissionValue,
  ServerToClientEvents,
} from "@tcg/protocol";
import type {
  ConnectionDiagnosticEvent,
  ConnectionEndpointDiagnostic,
  PlayerPresenceDiagnostic,
  SimulatorConnectionDiagnosticInput,
  SimulatorConnectionStatus,
} from "@tcg/game-page-contract/connection-diagnostic";
import {
  createLiveMatchSession,
  type LiveMatchSession,
  type NormalizedPresenceChange,
} from "@tcg/game-page-contract";
import { buildInteractionSubmissionForActionId } from "@tcg/protocol";
import {
  buildDiscordRichPresenceMatchUrl,
  clearDiscordPlayingGamePresence,
  type DiscordAuthorizationCodeExchange,
  updateDiscordPlayingGamePresence,
} from "@tcg/shared/discord-rich-presence";
import { buildGatewaySocketIoUrl, type LiveGatewayMessage } from "../engine/live/liveGateway";
import type { GatewayHandle } from "@tcg/gateway-client";
import { getGatewayManager } from "../../../lib/gateway/gateway-manager";
import { getAuthSnapshot } from "../auth/auth-store";
import {
  parseGatewayEvent,
  prepareLiveContext,
  reduceLiveGatewayMessage,
} from "../engine/live/liveMessages";
import {
  applyPresenceChange,
  applyPresencePlayers,
  connectionUiStatus,
  markLocalConnectionStatus,
  recordLocalConnectionHeartbeat,
} from "../engine/live/playerConnectionState";
import {
  fetchLiveMatchContext,
  getMatchmakingReturnUrl,
  normalizeRemoteMoveLog,
  projectLiveValueForSimulator,
  projectSimulatorStateForLive,
  projectSimulatorValueForLive,
  resolveSeriesDestination,
  parseRemoteChatMessages,
  type RemoteChatMessage,
  type LiveMatchContext,
} from "../engine/live/matchContext";
import { CYBERPUNK_GAME_SLUG } from "../engine/live/apiOrigin";
import { apiUrl } from "../../../runtime/gameRuntimeApi";
import { LiveHttpError, type LiveFeedbackSeverity } from "../engine/live/httpFeedback";
import { createLiveMatchViewerEngine } from "../engine/live/liveState";
import {
  DEFAULT_SCENARIO,
  createPracticeAiConfig,
  createPracticeEngine,
  getStrategyById,
  loadPracticeMatchConfig,
  CHAT_PRESETS,
  type CyberpunkTestEngine,
  type ChatMessage,
  type EngineAction,
  type AnimationScript,
  type GameEvent,
  type LocalCommandCommit,
  type MoveLog,
  type PlayerConnectionBySide,
  type PlayerIdentityBySide,
  type PracticeMatchConfig,
  type RawEngineEventEntry,
  type Side,
} from "../engine";
import { P1, P2 } from "../engine/fixtures/scenarios";
import { BoardSharedPage } from "./BoardShared.page";
import {
  matchesPendingCorrelation,
  readMessageCorrelationId,
  shouldClearPendingAfterAuthoritativeState,
  shouldClearPendingAfterSubmitInteractionOk,
  type PendingOptimisticMove,
} from "./livePendingMove";
import classes from "./Practice.module.css";

const exchangeDiscordActivityCode: DiscordAuthorizationCodeExchange = async ({
  clientId,
  code,
}) => {
  const response = await fetch(apiUrl(CYBERPUNK_GAME_SLUG, "/discord/activity-token"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ clientId, code }),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as { accessToken?: string };
  return body.accessToken ?? null;
};

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      context: LiveMatchContext;
      moveLogs: MoveLog[];
      engineEvents: RawEngineEventEntry[];
      chatMessages: ChatMessage[];
    };

interface RemoteEngineLogRecord {
  stateVersion?: number;
  timestamp?: number;
  log?: unknown;
}

interface RemoteAnimationPacket {
  id: string;
  kind: "cyberpunk.animationScript";
  payload: {
    actorId?: string;
    moveType?: string;
    input?: unknown;
    stateID?: number;
    gameEvents?: unknown[];
    moveLogs?: unknown[];
    animationScript?: unknown;
  };
}

const REMOTE_MOVE_LOG_LIMIT = 200;

type PushStatePayload = Parameters<ClientToServerEvents["push_state"]>[0];
type SubmitInteractionPayload = Parameters<ClientToServerEvents["submit_interaction"]>[0];

interface CyberpunkCardsMaps {
  cardInstances: Record<string, string>;
  owners: Record<string, string[]>;
}

interface GatewayJoinState {
  gameId: string;
  role: "player" | "spectator";
  nonce: number;
}

interface LiveGatewayDiagnosticState {
  endpoint: ConnectionEndpointDiagnostic;
  status: SimulatorConnectionStatus;
  connectionId?: string;
  socketId?: string;
  authModeLabel?: string;
  authenticated?: boolean;
  latencyMs?: number;
  lastPongAt?: string;
  lastPingAt?: string;
  reconnectAttempts: number;
  disconnectCount: number;
  lastError?: string;
  serverInitiatedClose?: boolean;
  events: ConnectionDiagnosticEvent[];
}

interface ClientAuthorityAcceptedMoveRecord {
  gameId: string;
  stateVersion: number;
  turnNumber: number;
  actorId: string;
  moveId: string;
  input?: unknown;
  processedCommand: unknown;
  timestamp: number;
  sourceAuthority: "client";
  transitionType: "move" | "undo";
  newStateID: number;
}

interface ClientAuthorityEngineLogRecord {
  gameId: string;
  stateVersion: number;
  timestamp: number;
  sourceAuthority: "client";
  log: unknown;
}

export function LiveMatchPage() {
  const { matchId = "", gameId = "" } = useParams<{ matchId: string; gameId: string }>();
  const location = useLocation();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [gatewayJoin, setGatewayJoin] = useState<GatewayJoinState | null>(null);
  const [playerConnections, setPlayerConnections] = useState<PlayerConnectionBySide>({});
  const [gatewayDiagnostic, setGatewayDiagnostic] = useState<LiveGatewayDiagnosticState>(() =>
    createInitialGatewayDiagnostic(),
  );
  const [syncRequestNonce, setSyncRequestNonce] = useState(0);
  const [pendingOptimisticMove, setPendingOptimisticMove] = useState<PendingOptimisticMove | null>(
    null,
  );
  const handleRef = useRef<GatewayHandle | null>(null);
  const sessionRef = useRef<LiveMatchSession | null>(null);
  const latestContextRef = useRef<LiveMatchContext | null>(null);
  const gatewayJoinRef = useRef<GatewayJoinState | null>(null);
  const pendingOptimisticMoveRef = useRef<PendingOptimisticMove | null>(null);
  const submittedInteractionMessagesRef = useRef<Map<string, SubmitInteractionPayload>>(new Map());
  const seenLogKeysRef = useRef<Set<string>>(new Set());
  const seenAnimationIdsRef = useRef<Set<string>>(new Set());
  const startedAtMsRef = useRef(Date.now());
  const readyContext = loadState.status === "ready" ? loadState.context : null;
  const readyGameId = readyContext?.game.gameId ?? null;
  const hasReadyGameState = Boolean(readyContext?.game.state);
  const liveViewerEngineBuilder = useMemo(() => {
    const state = readyContext?.game.state;
    return state ? () => createLiveMatchViewerEngine(state) : undefined;
  }, [readyContext?.game.state]);
  const searchPlayerId = useMemo(
    () => new URLSearchParams(location.search).get("playerId"),
    [location.search],
  );
  const contextPlayerId = useMemo(
    () => searchPlayerId ?? (readyContext ? resolveLocalPlayerIdFromAuth(readyContext) : undefined),
    [readyContext, searchPlayerId],
  );
  const clientAuthorityConfig = useMemo(
    () => (readyContext?.game.authority === "client" ? loadPracticeMatchConfig(matchId) : null),
    [matchId, readyContext?.game.authority],
  );
  const canRunClientAuthorityPractice = Boolean(
    readyContext?.game.authority === "client" &&
    clientAuthorityConfig &&
    searchPlayerId &&
    readyContext.game.actorIds?.player === searchPlayerId,
  );
  const discordClientId =
    import.meta.env.VITE_DISCORD_ACTIVITY_CLIENT_ID ?? import.meta.env.VITE_DISCORD_CLIENT_ID;
  const connectionDiagnostic = useMemo<SimulatorConnectionDiagnosticInput>(() => {
    const localSide = readyContext
      ? localConnectionSideForContext(readyContext, contextPlayerId)
      : null;
    return {
      gameSlug: "cyberpunk",
      route: `${location.pathname}${location.search}`,
      matchId,
      gameId: readyGameId ?? gameId,
      playerId: contextPlayerId,
      playerSide: localSide ?? undefined,
      endpoint: gatewayDiagnostic.endpoint,
      connection: {
        status: gatewayDiagnostic.status,
        connectionId: gatewayDiagnostic.connectionId,
        socketId: gatewayDiagnostic.socketId,
        authModeLabel: gatewayDiagnostic.authModeLabel,
        authenticated: gatewayDiagnostic.authenticated,
        latencyMs: gatewayDiagnostic.latencyMs,
        lastPongAt: gatewayDiagnostic.lastPongAt,
        lastPingAt: gatewayDiagnostic.lastPingAt,
        reconnectAttempts: gatewayDiagnostic.reconnectAttempts,
        disconnectCount: gatewayDiagnostic.disconnectCount,
        lastError: gatewayDiagnostic.lastError,
        serverInitiatedClose: gatewayDiagnostic.serverInitiatedClose,
      },
      presence: presenceDiagnosticsForContext(playerConnections, readyContext, localSide),
      events: gatewayDiagnostic.events,
    };
  }, [
    gameId,
    gatewayDiagnostic,
    location.pathname,
    location.search,
    matchId,
    playerConnections,
    readyContext,
    readyGameId,
    contextPlayerId,
  ]);

  useEffect(() => {
    let cancelled = false;
    setLoadState({ status: "loading" });
    setGatewayJoin(null);
    setPlayerConnections({});
    setGatewayDiagnostic(createInitialGatewayDiagnostic());
    setSyncRequestNonce(0);
    setPendingOptimisticMove(null);
    submittedInteractionMessagesRef.current.clear();
    fetchLiveMatchContext(CYBERPUNK_GAME_SLUG, matchId, gameId)
      .then((context) => {
        if (cancelled) {
          return;
        }
        const destination = resolveSeriesDestination(context, location.search);
        if (destination.type !== "stay") {
          window.location.replace(destination.href);
          return;
        }
        seenLogKeysRef.current = new Set();
        seenAnimationIdsRef.current = new Set();
        const preparedContext = prepareLiveContext(context);
        setLoadState({
          status: "ready",
          context: preparedContext,
          moveLogs: appendRemoteEngineLogs(
            [],
            preparedContext.history?.engineLogs ?? [],
            preparedContext,
            seenLogKeysRef.current,
          ),
          engineEvents: [],
          chatMessages: remoteChatMessagesForContext(
            preparedContext.history?.chatMessages ?? [],
            preparedContext,
          ),
        });
      })
      .catch((error) => {
        if (!cancelled) {
          showHttpFailureNotification(error, {
            id: `live-match:load-context:${matchId}:${gameId}`,
            title: "Could not load match",
            fallbackMessage: "Unable to load match.",
          });
          setLoadState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to load match.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [gameId, location.search, matchId]);

  useEffect(() => {
    latestContextRef.current = loadState.status === "ready" ? loadState.context : null;
  }, [loadState]);

  useEffect(() => {
    gatewayJoinRef.current = gatewayJoin;
  }, [gatewayJoin]);

  useEffect(() => {
    pendingOptimisticMoveRef.current = pendingOptimisticMove;
  }, [pendingOptimisticMove]);

  const clearPendingOptimisticMove = useCallback((correlationId: string | undefined) => {
    const pending = pendingOptimisticMoveRef.current;
    if (correlationId) {
      submittedInteractionMessagesRef.current.delete(correlationId);
    }
    if (!pending || !matchesPendingCorrelation(pending, correlationId)) {
      return;
    }
    pendingOptimisticMoveRef.current = null;
    setPendingOptimisticMove(null);
  }, []);

  const rejectPendingOptimisticMove = useCallback(
    (reason: string, correlationId?: string, options: { keepPendingUntilSync?: boolean } = {}) => {
      const pending = pendingOptimisticMoveRef.current;
      if (!pending || !matchesPendingCorrelation(pending, correlationId)) {
        return false;
      }
      if (!options.keepPendingUntilSync) {
        pendingOptimisticMoveRef.current = null;
        setPendingOptimisticMove(null);
      }
      submittedInteractionMessagesRef.current.delete(pending.correlationId);
      notifications.show({
        id: `optimistic-move-rejected:${pending.correlationId}`,
        color: "red",
        title: "Move rejected",
        message: reason,
      });
      if (!options.keepPendingUntilSync) {
        setLoadState((previous) =>
          previous.status === "ready"
            ? { ...previous, context: { ...previous.context } }
            : previous,
        );
      }
      return true;
    },
    [],
  );

  const handleRejectedOptimisticMove = useCallback(
    (message: Extract<LiveGatewayMessage, { type: "move_rejected" }>) => {
      const context = latestContextRef.current;
      const needsAuthoritativeSync =
        context?.game.gameId === message.gameId &&
        message.currentVersion > context.game.version &&
        !message.state;
      const handled = rejectPendingOptimisticMove(message.reason, message.correlationId, {
        keepPendingUntilSync: needsAuthoritativeSync,
      });
      if (!handled) {
        showMoveRejectedNotification(message);
      }
      if (needsAuthoritativeSync && context) {
        // Route through the session so the dedup window shared with the
        // heartbeat_ack / move_accepted / state_update paths applies here too.
        sessionRef.current?.requestStateSyncIfDue(context.game.version);
      }
    },
    [rejectPendingOptimisticMove],
  );

  const handleSubmitInteractionResponse = useCallback(
    (payload: unknown) => {
      if (!payload || typeof payload !== "object") {
        return;
      }
      const response = payload as {
        correlationId?: unknown;
        status?: unknown;
        data?: { reason?: unknown; message?: unknown };
      };
      const status = typeof response.status === "string" ? response.status : null;
      const correlation =
        typeof response.correlationId === "string" ? response.correlationId : undefined;
      if (status === "ok") {
        if (
          shouldClearPendingAfterSubmitInteractionOk(pendingOptimisticMoveRef.current, correlation)
        ) {
          clearPendingOptimisticMove(correlation);
        }
        return;
      }
      if (status === "err") {
        const reason =
          typeof response.data?.reason === "string"
            ? response.data.reason
            : typeof response.data?.message === "string"
              ? response.data.message
              : "The server rejected the move.";
        const handled = rejectPendingOptimisticMove(reason, correlation);
        if (!handled) {
          showServerFeedbackNotification({
            id: correlation ? `submit-interaction:${correlation}` : "submit-interaction:rejected",
            severity: "warning",
            title: "Action rejected",
            message: reason,
          });
        }
      }
    },
    [clearPendingOptimisticMove, rejectPendingOptimisticMove],
  );

  useEffect(() => {
    if (!readyGameId || (!hasReadyGameState && !canRunClientAuthorityPractice)) {
      return;
    }

    const manager = getGatewayManager();
    // Acquire a handle on the SHARED cyberpunk namespace socket (the root
    // already holds one for presence). ref-count → 2; releasing this handle on
    // unmount leaves the root socket open across navigation.
    const handle: GatewayHandle = manager.acquire(CYBERPUNK_GAME_SLUG);
    handleRef.current = handle;

    const playerId = contextPlayerId;

    const recordDiagnostic = (
      patch: Partial<LiveGatewayDiagnosticState>,
      event?: Omit<ConnectionDiagnosticEvent, "at">,
    ) => {
      setGatewayDiagnostic((current) => updateGatewayDiagnostic(current, patch, event));
    };

    recordDiagnostic(
      {
        status: handle.getState().status === "connected" ? "connected" : "connecting",
        endpoint: createGatewayEndpointDiagnostic(),
        lastError: undefined,
      },
      { type: "ticket_request", message: "Acquiring gateway namespace" },
    );

    const joinRole: "player" | "spectator" =
      readyContext?.game.authority === "client" && !canRunClientAuthorityPractice && !playerId
        ? "spectator"
        : "player";

    const localSide = () => {
      const context = latestContextRef.current;
      return context ? localConnectionSideForContext(context, playerId) : null;
    };

    const markLocalConnection = (status: "connected" | "reconnecting" | "disconnected") => {
      setPlayerConnections((current) => markLocalConnectionStatus(current, localSide(), status));
    };

    // The game event reducer. The session forwards EVERY server event here;
    // the reducer owns game-state mutations, board rendering signals, and
    // game-domain diagnostics. Session-owned concerns (presence map,
    // heartbeat, join lifecycle) are NOT duplicated here.
    const handleGatewayEvent = (
      type: keyof ServerToClientEvents,
      payload: Parameters<ServerToClientEvents[keyof ServerToClientEvents]>[0],
    ) => {
      if (type === "presence_change" && payload && typeof payload === "object") {
        // The session owns the presence map and emits the normalized change
        // via onPresenceChange (→ derivePresenceChat). The consumer only
        // mirrors the raw change into its per-side playerConnections view
        // (used for board rendering).
        setPlayerConnections((current) =>
          applyPresenceChange(current, latestContextRef.current?.game.actorIds, payload),
        );
      }
      if (type === "player_drop_pending" && payload && typeof payload === "object") {
        const record = payload as Record<string, unknown>;
        const droppedPlayerId =
          typeof record.droppedPlayerId === "string" ? record.droppedPlayerId : undefined;
        const dropReason = typeof record.reason === "string" ? record.reason : "disconnect";
        notifications.show({
          id: `live-match:player-drop-pending:${gameId}:${droppedPlayerId}`,
          color: "yellow",
          title: "Opponent drop pending",
          message:
            dropReason === "timeout"
              ? "Your opponent is being dropped due to timeout."
              : "Your opponent is being dropped due to disconnect.",
        });
      }
      if (type === "submit_interaction:response") {
        handleSubmitInteractionResponse(payload);
      }
      if (type === "heartbeat_ack" && payload && typeof payload === "object") {
        // heartbeat_ack isn't a LiveGatewayMessage; handle it before
        // parseGatewayEvent returns null. The session already recorded the
        // diagnostic; the consumer owns the version-skew reaction.
        const context = latestContextRef.current;
        if (!context) {
          return;
        }
        const record = payload as { stateVersions?: Record<string, number> };
        const serverVersion = record.stateVersions?.[gameId];
        if (typeof serverVersion !== "number") {
          return;
        }
        const localVersion = context.game.version;
        if (serverVersion > localVersion) {
          session.requestStateSyncIfDue(localVersion);
          console.info("[live-match] heartbeat_ack server ahead; requesting state sync", {
            gameId,
            localVersion,
            serverVersion,
          });
        }
      }
      const message = parseGatewayEvent(type, payload);
      if (!message) {
        return;
      }
      if (message.type === "gateway_error" || message.type === "error") {
        recordDiagnostic(
          {
            lastError: message.message,
          },
          { type: message.type, message: message.message, details: message },
        );
        showGatewayErrorNotification(message);
        rejectPendingOptimisticMove(message.message, message.correlationId);
      }
      if (message.type === "move_accepted") {
        const pending = pendingOptimisticMoveRef.current;
        if (
          pending &&
          pending.optimisticApplied &&
          matchesPendingCorrelation(pending, message.correlationId) &&
          typeof message.stateVersion === "number" &&
          message.stateVersion !== pending.localOptimisticStateId
        ) {
          session.requestStateSyncIfDue(pending.startingVersion);
          console.info("[live-match] move_accepted version mismatch; requesting state sync", {
            gameId,
            expectedVersion: pending.localOptimisticStateId,
            acceptedVersion: message.stateVersion,
          });
        }
        if (shouldClearPendingAfterSubmitInteractionOk(pending, message.correlationId)) {
          clearPendingOptimisticMove(message.correlationId);
        }
      }
      if (message.type === "state_sync" && message.gameId === gameId) {
        clearPendingOptimisticMove(undefined);
      }
      if (message.type === "move_rejected") {
        handleRejectedOptimisticMove(message);
      }
      if (message.type === "proposal_received" && message.gameId === gameId) {
        handleProposalReceived(message, handle);
      }
      if (message.type === "proposal_resolved" && message.gameId === gameId) {
        handleProposalResolved(message);
      }
      if (message.type === "proposal_expired" && message.gameId === gameId) {
        handleProposalExpired(message);
      }
      if (message.type === "game_joined") {
        // The session records the diagnostic and owns the join lifecycle +
        // presence map. The consumer only keeps the gameId/role pair for the
        // board's "client-authority joined" gate and the interaction gate.
        const joined = { gameId: message.gameId, role: message.role, nonce: Date.now() };
        gatewayJoinRef.current = joined;
        setGatewayJoin(joined);
        setPlayerConnections((current) =>
          applyPresencePlayers(current, latestContextRef.current?.game.actorIds, message.players),
        );
        console.info("[live-match] gateway game joined", {
          gameId: message.gameId,
          matchId,
          role: message.role,
          stateVersion: message.stateVersion,
          socketId: handle.getState().connectionId,
        });
      }
      if (message.type === "request_state_sync" && message.gameId === gameId) {
        // The session emits `request_game_state_sync` (with dedup) for server
        // authority. The consumer only bumps the nonce so the client-authority
        // practice path pushes its local state.
        setSyncRequestNonce((nonce) => nonce + 1);
      }
      setLoadState((previous) => {
        if (previous.status !== "ready") {
          return previous;
        }
        if (message.type === "game_chat_history" && message.gameId === gameId) {
          return {
            ...previous,
            chatMessages: remoteChatMessagesForContext(
              parseRemoteChatMessages(message.messages),
              previous.context,
            ),
          };
        }
        if (message.type === "chat_message" && message.gameId === gameId) {
          const chatMessage = remoteChatMessageForContext(message.message, previous.context);
          if (!chatMessage) {
            return previous;
          }
          return {
            ...previous,
            chatMessages: mergeRemoteChatMessage(previous.chatMessages, chatMessage),
          };
        }
        const effect = reduceLiveGatewayMessage(previous.context, message, {
          gameId,
          matchId,
          search: location.search,
        });
        if (effect.type === "redirect") {
          window.location.replace(effect.href);
          return previous;
        }
        if (effect.type !== "state") {
          return previous;
        }
        if (
          message.type === "state_update" &&
          typeof message.stateVersion === "number" &&
          message.stateVersion > previous.context.game.version + 1
        ) {
          session.requestStateSyncIfDue(previous.context.game.version);
          console.info("[live-match] state_update version jump detected; requesting state sync", {
            gameId,
            previousVersion: previous.context.game.version,
            updateVersion: message.stateVersion,
          });
        }
        if (message.type === "state_update") {
          const pending = pendingOptimisticMoveRef.current;
          if (shouldClearPendingAfterAuthoritativeState(pending, message)) {
            clearPendingOptimisticMove(readMessageCorrelationId(message) ?? pending?.correlationId);
          }
        }
        const nextLogs = appendRemoteMoveLogs(
          previous.moveLogs,
          message,
          effect.context,
          seenLogKeysRef.current,
        );
        const nextEngineEvents = appendRemoteEngineEvents(
          previous.engineEvents,
          message,
          effect.context,
          seenAnimationIdsRef.current,
        );
        return {
          status: "ready",
          context: effect.context,
          moveLogs: nextLogs,
          engineEvents: nextEngineEvents,
          chatMessages: previous.chatMessages,
        };
      });
      if (message.type === "move_rejected") {
        const attemptedMessage =
          typeof message.correlationId === "string"
            ? submittedInteractionMessagesRef.current.get(message.correlationId)
            : undefined;
        // eslint-disable-next-line no-console
        console.warn("[live-match] move rejected", message.reason, {
          attemptedMessage,
          rejection: message,
          joined: gatewayJoinRef.current,
          socketId: handle.getState().connectionId,
        });
        if (typeof message.correlationId === "string") {
          submittedInteractionMessagesRef.current.delete(message.correlationId);
        }
      }
    };

    // Localized "X joined/left the match" chat derivation. The session owns
    // the presence map; this only produces a chat line per change.
    const derivePresenceChat = (change: NormalizedPresenceChange) => {
      const context = latestContextRef.current;
      if (!context) {
        return;
      }
      const localPlayerId = searchPlayerId ?? resolveLocalPlayerIdFromAuth(context);
      if (change.playerId === localPlayerId) {
        return;
      }
      const side = sideForActorId(context, change.playerId);
      const identities = playerIdentitiesForContext(context);
      let text: string | undefined;
      if (side === "player" || side === "opponent") {
        const name = identities?.[side]?.displayName ?? (side === "player" ? "Player" : "Rival");
        text =
          change.status === "connected" ? `${name} joined the match` : `${name} left the match`;
      } else if (change.status === "connected") {
        text = "A spectator joined watching the match";
      }
      if (text) {
        setLoadState((previous) => {
          if (previous.status !== "ready") {
            return previous;
          }
          const nextChat = mergeRemoteChatMessage(previous.chatMessages, {
            kind: "system",
            id: Date.now(),
            timestamp: Date.now(),
            text,
          });
          return { ...previous, chatMessages: nextChat };
        });
      }
    };

    // Single session call: owns join, presence map, heartbeat, latency, and
    // connection-state mirroring. The consumer wires its game reducer
    // (onGameEvent), its chat derivation (onPresenceChange), and its
    // diagnostic log (onDiagnostic).
    const session = createLiveMatchSession({
      handle,
      gameId,
      matchId,
      resolveRole: () => joinRole,
      resolveGameProfileId: () => playerId ?? undefined,
      buildHeartbeatPayload: () => {
        const context = latestContextRef.current;
        return {
          game: context ? { gameId, matchId, stateVersion: context.game.version } : undefined,
          activity: {
            idle: false,
            tabVisible: document.visibilityState !== "hidden",
          },
        };
      },
      heartbeatIntervalMs: 15_000,
      authority: readyContext?.game.authority,
      onGameEvent: (event, payload) =>
        handleGatewayEvent(
          event,
          payload as Parameters<ServerToClientEvents[keyof ServerToClientEvents]>[0],
        ),
      onPresenceChange: derivePresenceChat,
      onDiagnostic: (event) => {
        setGatewayDiagnostic((current) => updateGatewayDiagnostic(current, {}, event));
      },
    });

    session.start();
    sessionRef.current = session;

    // Mirror session-owned state into React state for rendering. The session
    // owns status/latency/auth/joined/presence; the consumer only mirrors.
    let prevStatus: SimulatorConnectionStatus | null = null;
    let prevAuthenticated = false;
    let prevLatencyMs: number | null = null;
    let lastNotifiedReconnect = false;

    const unsubSessionState = session.subscribeState((s) => {
      setGatewayDiagnostic((current) => {
        const patch: Partial<LiveGatewayDiagnosticState> = {
          status: s.status,
          authenticated: s.authenticated,
          connectionId: s.connectionId ?? undefined,
          socketId: s.connectionId ?? undefined,
          latencyMs: s.latencyMs ?? undefined,
          authModeLabel: s.authenticated ? "Authenticated" : undefined,
          // Mirror the gateway's reconnect attempt counter directly — restores
          // the counter that Patch 4a dropped when it stopped counting events
          // the session doesn't emit.
          reconnectAttempts: s.reconnectAttempt,
        };
        // Prefer the live error string from the gateway when present; fall
        // back to the generic terminal-state message only when disconnected
        // without a specific error. Skipping the assignment otherwise keeps
        // the last seen error visible (matches pre-session behavior).
        if (s.error) {
          patch.lastError = s.error;
        } else if (s.status === "disconnected") {
          patch.lastError =
            s.authStatus === "failed"
              ? "Gateway authentication failed."
              : "Socket.IO reconnect failed";
        }
        return { ...current, ...patch };
      });

      // Game-domain per-side connection mirroring for board rendering. The
      // session doesn't know about "sides", so the consumer translates.
      const wasReady = prevStatus === "connected" && prevAuthenticated;
      const isReady = s.status === "connected" && s.authenticated;
      if (!wasReady && isReady) {
        markLocalConnection("connected");
      } else if (s.status === "reconnecting" && prevStatus !== "reconnecting") {
        markLocalConnection("reconnecting");
        gatewayJoinRef.current = null;
        setGatewayJoin((current) => (current?.gameId === gameId ? null : current));
      } else if (s.status === "disconnected" && prevStatus !== "disconnected") {
        markLocalConnection("disconnected");
        gatewayJoinRef.current = null;
        setGatewayJoin((current) => (current?.gameId === gameId ? null : current));
      }

      // Latency sample → per-side heartbeat recording (game-domain).
      if (s.latencyMs !== null && s.latencyMs !== prevLatencyMs) {
        const context = latestContextRef.current;
        const side = context ? localConnectionSideForContext(context, playerId) : null;
        const now = Date.now();
        if (side) {
          setPlayerConnections((current) =>
            recordLocalConnectionHeartbeat(current, side, now, s.latencyMs as number),
          );
        }
      }

      // One-shot "Connection interrupted" notification per reconnect cycle.
      // The session surfaces the gateway error string, so the message echoes
      // it when available — restores the context Patch 4a regressed.
      if (s.status === "reconnecting" && !lastNotifiedReconnect) {
        lastNotifiedReconnect = true;
        showServerFeedbackNotification({
          id: `live-match:gateway-connection:${gameId}`,
          severity: "warning",
          title: "Connection interrupted",
          message: s.error
            ? `${s.error}. Trying to reconnect to the match server.`
            : "Trying to reconnect to the match server.",
        });
      } else if (s.status === "connected" && prevStatus !== "connected") {
        lastNotifiedReconnect = false;
      }

      prevStatus = s.status;
      prevAuthenticated = s.authenticated;
      prevLatencyMs = s.latencyMs;
    });

    return () => {
      session.stop();
      unsubSessionState();
      if (sessionRef.current === session) {
        sessionRef.current = null;
      }
      if (handleRef.current === handle) {
        handleRef.current = null;
      }
      gatewayJoinRef.current = null;
      setGatewayJoin((current) => (current?.gameId === gameId ? null : current));
      // Release only THIS handle (ref-count → 1). The root keeps the shared
      // socket open across navigation.
      handle.release();
    };
  }, [
    canRunClientAuthorityPractice,
    contextPlayerId,
    gameId,
    hasReadyGameState,
    handleRejectedOptimisticMove,
    handleSubmitInteractionResponse,
    clearPendingOptimisticMove,
    location.search,
    matchId,
    readyContext?.game.authority,
    readyGameId,
    searchPlayerId,
  ]);

  useEffect(() => {
    if (!readyGameId || !hasReadyGameState) {
      return;
    }
    startedAtMsRef.current = Date.now();
  }, [hasReadyGameState, matchId, readyGameId]);

  useEffect(() => {
    if (!readyGameId || !hasReadyGameState) {
      return;
    }
    const matchUrl = buildDiscordRichPresenceMatchUrl(window.location.href);
    void updateDiscordPlayingGamePresence({
      clientId: discordClientId,
      exchangeAuthorizationCode: exchangeDiscordActivityCode,
      gameName: "Cyberpunk 2077",
      matchUrl,
      startedAtMs: startedAtMsRef.current,
    }).then((result) => {
      if (!result.ok && !result.skipped) {
        // eslint-disable-next-line no-console
        console.warn(
          "[discord-rich-presence] failed to update Cyberpunk match presence",
          result.error,
        );
      }
    });
    return () => {
      void clearDiscordPlayingGamePresence({
        clientId: discordClientId,
        exchangeAuthorizationCode: exchangeDiscordActivityCode,
      });
    };
  }, [discordClientId, hasReadyGameState, matchId, readyGameId]);

  const submitInteractionForSide = useCallback(
    (
      state: MatchState,
      side: Side,
      submission: InteractionSubmission,
      optimisticResult?: CommandSuccess,
    ): boolean => {
      if (pendingOptimisticMoveRef.current) {
        return false;
      }
      const handle = handleRef.current;
      if (!handle || handle.getState().status !== "connected") {
        // eslint-disable-next-line no-console
        console.warn("[live-match] gateway is not open; interaction not sent", submission.actionId);
        showServerFeedbackNotification({
          id: `live-match:interaction-not-sent:${gameId}`,
          severity: "warning",
          title: "Action not sent",
          message: "The match server is reconnecting. Try the action again in a moment.",
        });
        return false;
      }
      const joined = gatewayJoinRef.current;
      if (joined?.gameId !== gameId || joined.role !== "player") {
        console.warn("[live-match] interaction blocked before gateway join", {
          actionId: submission.actionId,
          gameId,
          joinedGameId: joined?.gameId,
          joinedRole: joined?.role,
          socketId: handle.getState().connectionId,
          socketConnected: true,
        });
        showServerFeedbackNotification({
          id: `live-match:interaction-before-join:${gameId}`,
          severity: "warning",
          title: "Rejoining match",
          message: "The match connection is still seating you. Try the action again in a moment.",
        });
        return false;
      }
      const gameProfileId = actorIdForSide(latestContextRef.current, side);
      const requestCorrelationId = correlationId();
      const expectedVersion = latestContextRef.current?.game.version ?? state.ctx.stateID;
      const message = {
        gameId,
        expectedVersion,
        submission,
        ...(gameProfileId ? { gameProfileId } : {}),
        correlationId: requestCorrelationId,
      } satisfies SubmitInteractionPayload;
      if (optimisticResult) {
        const pending = {
          correlationId: requestCorrelationId,
          gameId,
          startingVersion: expectedVersion,
          localOptimisticStateId: optimisticResult.stateID,
          optimisticApplied: true,
          actionId: submission.actionId,
          side,
        } satisfies PendingOptimisticMove;
        pendingOptimisticMoveRef.current = pending;
        setPendingOptimisticMove(pending);
      } else {
        const pending = {
          correlationId: requestCorrelationId,
          gameId,
          startingVersion: expectedVersion,
          localOptimisticStateId: state.ctx.stateID,
          optimisticApplied: false,
          actionId: submission.actionId,
          side,
        } satisfies PendingOptimisticMove;
        pendingOptimisticMoveRef.current = pending;
        setPendingOptimisticMove(pending);
      }
      submittedInteractionMessagesRef.current.set(requestCorrelationId, message);
      console.info("[live-match] submitting interaction", {
        actionId: submission.actionId,
        gameId,
        matchId,
        expectedVersion,
        gameProfileId,
        correlationId: requestCorrelationId,
        socketId: handle.getState().connectionId,
      });
      handle.emit("submit_interaction", message);
      return true;
    },
    [gameId, matchId],
  );

  const remoteDispatch = useCallback(
    (_action: EngineAction, state: MatchState, actor: RemoteDispatchActor) => {
      return submitInteractionForSide(state, actor.side, actor.submission, actor.optimisticResult);
    },
    [submitInteractionForSide],
  );

  const remoteSubmitInteraction = useCallback(
    (input: RemoteInteractionInput, state: MatchState) => {
      const submission = buildInteractionSubmissionForActionId({
        view: input.interactionView,
        actionId: input.actionId,
        values: input.values,
      });
      if (!submission) {
        return false;
      }
      return submitInteractionForSide(state, input.side, submission);
    },
    [submitInteractionForSide],
  );

  const requestRemoteUndo = useCallback(() => {
    const handle = handleRef.current;
    const context = latestContextRef.current;
    if (!handle || handle.getState().status !== "connected" || !context?.game.gameId) {
      notifications.show({
        color: "red",
        title: "Gateway unavailable",
        message: "Reconnect before requesting an undo.",
      });
      return false;
    }
    handle.emit("proposal_send", {
      gameId: context.game.gameId,
      actionType: "undo",
    });
    notifications.show({
      id: `undo-proposal-sent:${context.game.gameId}`,
      color: "blue",
      title: "Undo requested",
      message: "Waiting for your opponent to approve the undo.",
    });
    return true;
  }, []);

  const sendPushState = useCallback((payload: PushStatePayload) => {
    const handle = handleRef.current;
    if (!handle || handle.getState().status !== "connected") {
      // eslint-disable-next-line no-console
      console.warn("[live-match] gateway is not open; state not pushed", payload.moveType);
      showServerFeedbackNotification({
        id: `live-match:state-not-pushed:${payload.gameId}`,
        severity: "warning",
        title: "State sync delayed",
        message: "The match server is reconnecting before it can receive updates.",
      });
      return;
    }
    handle.emit("push_state", payload);
  }, []);

  const claimRivalDrop = useCallback(() => {
    const handle = handleRef.current;
    const context = latestContextRef.current;
    if (!handle || handle.getState().status !== "connected" || !context?.game.gameId) {
      notifications.show({
        color: "red",
        title: "Gateway unavailable",
        message: "Reconnect before claiming the match.",
      });
      return;
    }
    handle.emit("drop_player", {
      gameId: context.game.gameId,
    });
  }, []);

  const board = useMemo(() => {
    if (loadState.status !== "ready") {
      return null;
    }
    const context = loadState.context;
    const actorIds = context.game.actorIds;
    const clientAuthorityJoined =
      gatewayJoin?.gameId === context.game.gameId && gatewayJoin.role === "player";
    if (
      context.game.authority === "client" &&
      clientAuthorityConfig &&
      actorIds &&
      searchPlayerId === actorIds.player
    ) {
      if (!clientAuthorityJoined) {
        return null;
      }
      return (
        <ClientAuthorityPracticeBoard
          key={context.game.gameId}
          context={context}
          config={clientAuthorityConfig}
          actorIds={actorIds}
          moveLogs={loadState.moveLogs}
          chatMessages={loadState.chatMessages}
          returnUrl={getMatchmakingReturnUrl(CYBERPUNK_GAME_SLUG, location.search)}
          playerConnections={playerConnections}
          connectionDiagnostic={connectionDiagnostic}
          syncRequestNonce={syncRequestNonce}
          sendPushState={sendPushState}
        />
      );
    }

    if (!context.game.state) {
      return null;
    }
    const viewerOnly = context.game.authority === "client";
    const initialAi = resolveLiveMatchInitialAi(context, location.search);
    const localPlayerId = searchPlayerId ?? resolveLocalPlayerIdFromAuth(context);
    const humanSide = resolveLiveMatchHumanSide(context, localPlayerId ?? undefined);
    const playerIdentities = playerIdentitiesForContext(context);
    const returnUrl = getMatchmakingReturnUrl(CYBERPUNK_GAME_SLUG, location.search);
    const nextGameId =
      context.match.status !== "completed" && context.match.currentGameId !== context.game.gameId
        ? context.match.currentGameId
        : undefined;
    return (
      <BoardSharedPage
        key={`${context.game.gameId}:${humanSide}`}
        scenarioId={DEFAULT_SCENARIO}
        initialEngineBuilder={liveViewerEngineBuilder}
        initialAi={viewerOnly ? { player: null, opponent: null } : initialAi}
        initialHumanSide={humanSide}
        initialAiMode="step"
        autoResolveSingletonCardTargets={false}
        remoteDispatch={remoteDispatch}
        remoteSubmitInteraction={remoteSubmitInteraction}
        requestRemoteUndo={requestRemoteUndo}
        remoteMoveLogs={loadState.moveLogs}
        remoteEngineEvents={loadState.engineEvents}
        remoteChatMessages={loadState.chatMessages}
        hasPendingRemoteMove={pendingOptimisticMove !== null}
        playerIdentities={playerIdentities}
        playerConnections={playerConnections}
        connectionDiagnostic={connectionDiagnostic}
        onClaimRivalDrop={claimRivalDrop}
        remoteReturnUrl={returnUrl}
        postGameContext={{
          gameId: context.game.gameId,
          matchId: context.match.matchId,
          gameNumber: context.game.gameNumber,
          format: context.match.format,
          matchStatus: context.match.status,
          currentGameId: context.match.currentGameId,
          nextGameId,
          player1Score: context.match.player1Score,
          player2Score: context.match.player2Score,
          actorIds: context.game.actorIds,
        }}
        lockLocalHistoryControls={viewerOnly}
      />
    );
  }, [
    clientAuthorityConfig,
    connectionDiagnostic,
    gatewayJoin,
    loadState,
    location.search,
    liveViewerEngineBuilder,
    playerConnections,
    pendingOptimisticMove,
    remoteDispatch,
    remoteSubmitInteraction,
    requestRemoteUndo,
    searchPlayerId,
    sendPushState,
    syncRequestNonce,
  ]);

  if (board) {
    return board;
  }

  const returnUrl = getMatchmakingReturnUrl(CYBERPUNK_GAME_SLUG, location.search);
  const title =
    loadState.status === "loading"
      ? "Loading match"
      : loadState.status === "error"
        ? "Match unavailable"
        : canRunClientAuthorityPractice
          ? "Connecting practice"
          : "Match not ready";
  const message =
    loadState.status === "loading"
      ? "Fetching the Cyberpunk match from the game server."
      : loadState.status === "error"
        ? loadState.message
        : canRunClientAuthorityPractice
          ? "Joining the gateway before starting the local bot engine."
          : "The game server did not return a playable Cyberpunk state for this game.";

  return (
    <main className={classes.page}>
      <div className={classes.shell}>
        <header className={classes.header}>
          <p className={classes.eyebrow}>Cyberpunk · live match</p>
          <h1 className={classes.title}>{title}</h1>
          <p className={classes.lead}>{message}</p>
          <a className={classes.backLink} href={returnUrl}>
            Return to matchmaking
          </a>
        </header>
      </div>
    </main>
  );
}

interface ClientAuthorityPracticeBoardProps {
  context: LiveMatchContext;
  config: PracticeMatchConfig;
  actorIds: NonNullable<LiveMatchContext["game"]["actorIds"]>;
  moveLogs: MoveLog[];
  chatMessages: ChatMessage[];
  returnUrl: string;
  playerConnections: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  syncRequestNonce: number;
  sendPushState: (payload: PushStatePayload) => void;
}

function ClientAuthorityPracticeBoard({
  context,
  config,
  actorIds,
  moveLogs,
  chatMessages,
  returnUrl,
  playerConnections,
  connectionDiagnostic,
  syncRequestNonce,
  sendPushState,
}: ClientAuthorityPracticeBoardProps) {
  const engineRef = useRef<CyberpunkTestEngine | null>(null);
  const engineGameIdRef = useRef<string | null>(null);
  const lastPushedVersionRef = useRef<number>(-1);

  if (!engineRef.current || engineGameIdRef.current !== context.game.gameId) {
    engineRef.current = context.game.state
      ? createLiveMatchViewerEngine(context.game.state)
      : createPracticeEngine(config);
    engineGameIdRef.current = context.game.gameId;
    lastPushedVersionRef.current = -1;
  }

  const pushCurrentState = useCallback(
    (moveType: string, commit?: LocalCommandCommit, force = false) => {
      const engine = engineRef.current;
      if (!engine) {
        return;
      }

      const localState = engine.getState();
      const version = localState.ctx.stateID;
      if (!force && !commit && version === lastPushedVersionRef.current) {
        return;
      }

      const state = projectSimulatorStateForLive(localState, actorIds);
      const cardsMaps = buildCardsMapsForLive(localState, actorIds);
      const actorId = commit ? actorIdForLocalSide(commit.side, actorIds) : actorIds.player;
      const acceptedMove = commit
        ? createClientAuthorityAcceptedMove({
            gameId: context.game.gameId,
            actorId,
            result: commit.result,
            actorIds,
          })
        : undefined;
      const engineLogs = commit
        ? createClientAuthorityEngineLogs({
            gameId: context.game.gameId,
            result: commit.result,
            actorIds,
          })
        : [];

      sendPushState({
        gameId: context.game.gameId,
        state,
        cardsMaps,
        version,
        moveType: commit?.result.processedCommand.move ?? moveType,
        actorId,
        ...(acceptedMove ? { acceptedMove } : {}),
        ...(engineLogs.length > 0 ? { engineLogs } : {}),
      });
      lastPushedVersionRef.current = version;
    },
    [actorIds, context.game.gameId, sendPushState],
  );

  useEffect(() => {
    pushCurrentState("init");
  }, [pushCurrentState]);

  useEffect(() => {
    if (syncRequestNonce <= 0) {
      return;
    }
    pushCurrentState("sync", undefined, true);
  }, [pushCurrentState, syncRequestNonce]);

  const handleLocalCommandCommitted = useCallback(
    (commit: LocalCommandCommit) => {
      pushCurrentState(commit.result.processedCommand.move, commit, true);
    },
    [pushCurrentState],
  );

  return (
    <BoardSharedPage
      scenarioId={DEFAULT_SCENARIO}
      initialEngineBuilder={() => engineRef.current ?? createPracticeEngine(config)}
      initialAi={createPracticeAiConfig(config)}
      initialHumanSide="player"
      initialAiMode="auto"
      initialAiSpeed="balanced"
      autoResolveSingletonCardTargets={false}
      remoteMoveLogs={moveLogs}
      remoteChatMessages={chatMessages}
      playerIdentities={playerIdentitiesForContext(context)}
      playerConnections={playerConnections}
      connectionDiagnostic={connectionDiagnostic}
      onClaimRivalDrop={() => {
        notifications.show({
          color: "yellow",
          title: "Server match required",
          message: "Disconnect claims are only available in server-authoritative matches.",
        });
      }}
      remoteReturnUrl={returnUrl}
      postGameContext={{
        gameId: context.game.gameId,
        matchId: context.match.matchId,
        gameNumber: context.game.gameNumber,
        format: context.match.format,
        matchStatus: context.match.status,
        currentGameId: context.match.currentGameId,
        nextGameId:
          context.match.status !== "completed" &&
          context.match.currentGameId !== context.game.gameId
            ? context.match.currentGameId
            : undefined,
        player1Score: context.match.player1Score,
        player2Score: context.match.player2Score,
        actorIds,
      }}
      onLocalCommandCommitted={handleLocalCommandCommitted}
      lockLocalResetControls
    />
  );
}

interface RemoteDispatchActor {
  side: Side;
  interactionView: EngineInteractionView;
  submission: InteractionSubmission;
  optimisticResult?: CommandSuccess;
}

interface RemoteInteractionInput {
  side: Side;
  interactionView: EngineInteractionView;
  actionId: string;
  values: Record<string, InteractionSubmissionValue>;
}

function actorIdForSide(context: LiveMatchContext | null, side: Side): string | undefined {
  return context?.game.actorIds?.[side];
}

function createInitialGatewayDiagnostic(): LiveGatewayDiagnosticState {
  return {
    endpoint: createGatewayEndpointDiagnostic(),
    status: "checking",
    reconnectAttempts: 0,
    disconnectCount: 0,
    events: [],
  };
}

function createGatewayEndpointDiagnostic(): ConnectionEndpointDiagnostic {
  const url = buildGatewaySocketIoUrl(CYBERPUNK_GAME_SLUG);
  try {
    const parsed = new URL(url);
    return {
      realtimeConfigured: true,
      origin: `${parsed.protocol}//${parsed.host}`,
      namespace: parsed.pathname === "/" ? "/cyberpunk" : parsed.pathname,
      path: "/socket.io/",
      transport: "websocket",
    };
  } catch {
    return {
      realtimeConfigured: Boolean(url),
      origin: url || undefined,
      namespace: "/cyberpunk",
      path: "/socket.io/",
      transport: "websocket",
    };
  }
}

function updateGatewayDiagnostic(
  current: LiveGatewayDiagnosticState,
  patch: Partial<LiveGatewayDiagnosticState>,
  event?: Omit<ConnectionDiagnosticEvent, "at">,
): LiveGatewayDiagnosticState {
  const nextEvents = event
    ? [...current.events, { at: new Date().toISOString(), ...event }].slice(-20)
    : current.events;
  return {
    ...current,
    ...patch,
    reconnectAttempts:
      event?.type === "reconnect_attempt"
        ? current.reconnectAttempts + 1
        : (patch.reconnectAttempts ?? current.reconnectAttempts),
    disconnectCount:
      event?.type === "disconnect"
        ? current.disconnectCount + 1
        : (patch.disconnectCount ?? current.disconnectCount),
    events: nextEvents,
  };
}

function presenceDiagnosticsForContext(
  connections: PlayerConnectionBySide,
  context: LiveMatchContext | null,
  selfSide: Side | null,
): PlayerPresenceDiagnostic[] {
  const identities = context ? playerIdentitiesForContext(context) : undefined;
  return (["player", "opponent"] as const).map((side) => {
    const connection = connections[side];
    return {
      side,
      playerId: context?.game.actorIds?.[side],
      label: identities?.[side]?.displayName ?? side,
      status: connectionUiStatus(connection),
      connected: connection?.connected,
      disconnectedAt: connection?.disconnectedAt,
      lastPingAt:
        typeof connection?.lastPingAt === "number"
          ? new Date(connection.lastPingAt).toISOString()
          : undefined,
      latencyMs: connection?.latencyMs,
      disconnectCount: connection?.disconnectCount,
      self: selfSide === side ? true : undefined,
    };
  });
}

function playerIdentitiesForContext(context: LiveMatchContext): PlayerIdentityBySide | undefined {
  const actorIds = context.game.actorIds;
  const participants = context.match.participants ?? [];
  if (!actorIds || participants.length === 0) {
    return undefined;
  }
  const byId = new Map(participants.map((participant) => [participant.id, participant]));
  return {
    player: byId.get(actorIds.player),
    opponent: byId.get(actorIds.opponent),
  };
}

function sideForActorId(context: LiveMatchContext, actorId: string): Side | null {
  if (!actorId) {
    return null;
  }
  if (context.game.actorIds?.player === actorId) {
    return "player";
  }
  if (context.game.actorIds?.opponent === actorId) {
    return "opponent";
  }
  return null;
}

function localConnectionSideForContext(
  context: LiveMatchContext,
  playerId: string | undefined,
): Side | null {
  const explicitSide = playerId ? sideForActorId(context, playerId) : null;
  if (explicitSide) {
    return explicitSide;
  }
  // Do NOT fall back to interactionView.actorId. In a live match the current
  // actor changes every turn; using it as a fallback flips the board
  // depending on whose turn it is, which is a critical UX bug.
  return null;
}

function actorIdForLocalSide(
  side: Side,
  actorIds: NonNullable<LiveMatchContext["game"]["actorIds"]>,
): string {
  return side === "player" ? actorIds.player : actorIds.opponent;
}

function buildCardsMapsForLive(
  state: MatchState,
  actorIds: NonNullable<LiveMatchContext["game"]["actorIds"]>,
): CyberpunkCardsMaps {
  const cardInstances: Record<string, string> = {};
  for (const card of Object.values(state.G.cardIndex)) {
    cardInstances[String(card.instanceId)] = card.definitionId;
  }

  const owners: Record<string, string[]> = {};
  for (const [localPlayerId, player] of Object.entries(state.G.players)) {
    const livePlayerId =
      localPlayerId === String(P1)
        ? actorIds.player
        : localPlayerId === String(P2)
          ? actorIds.opponent
          : localPlayerId;
    owners[livePlayerId] = Object.values(player.zones)
      .flat()
      .map((cardId) => String(cardId));
  }

  return { cardInstances, owners };
}

function createClientAuthorityAcceptedMove(params: {
  gameId: string;
  actorId: string;
  result: CommandSuccess;
  actorIds: NonNullable<LiveMatchContext["game"]["actorIds"]>;
}): ClientAuthorityAcceptedMoveRecord {
  const now = Date.now();
  return {
    gameId: params.gameId,
    stateVersion: params.result.stateID,
    turnNumber: turnNumberFromResult(params.result),
    actorId: params.actorId,
    moveId: params.result.processedCommand.move,
    input: projectSimulatorValueForLive(params.result.processedCommand.input, params.actorIds),
    processedCommand: projectSimulatorValueForLive(params.result.processedCommand, params.actorIds),
    timestamp: now,
    sourceAuthority: "client",
    transitionType: params.result.processedCommand.move === "undo" ? "undo" : "move",
    newStateID: params.result.stateID,
  };
}

function createClientAuthorityEngineLogs(params: {
  gameId: string;
  result: CommandSuccess;
  actorIds: NonNullable<LiveMatchContext["game"]["actorIds"]>;
}): ClientAuthorityEngineLogRecord[] {
  const now = Date.now();
  return params.result.moveLogs.map((log, index) => ({
    gameId: params.gameId,
    stateVersion: params.result.stateID,
    timestamp: now + index,
    sourceAuthority: "client" as const,
    log: projectSimulatorValueForLive(log, params.actorIds),
  }));
}

function turnNumberFromResult(result: CommandSuccess): number {
  const fromLog = result.moveLogs.find((log) => typeof log.turnNumber === "number")?.turnNumber;
  if (typeof fromLog === "number") {
    return fromLog;
  }
  return result.state.G.turnMetadata.turnNumber;
}

function appendRemoteMoveLogs(
  current: MoveLog[],
  message: LiveGatewayMessage,
  context: LiveMatchContext,
  seenLogKeys: Set<string>,
): MoveLog[] {
  if (!context.game.state || !("engineLogs" in message) || !Array.isArray(message.engineLogs)) {
    return current;
  }
  return appendRemoteEngineLogs(
    current,
    message.engineLogs,
    context,
    seenLogKeys,
    matchStateFromMessage(message) ?? undefined,
  );
}

function appendRemoteEngineEvents(
  current: RawEngineEventEntry[],
  message: LiveGatewayMessage,
  context: LiveMatchContext,
  seenAnimationIds: Set<string>,
): RawEngineEventEntry[] {
  const state = matchStateFromMessage(message) ?? context.game.state;
  if (!state || !("animations" in message) || !Array.isArray(message.animations)) {
    return current;
  }

  const additions: RawEngineEventEntry[] = [];
  for (const raw of message.animations) {
    const packet = parseRemoteAnimationPacket(raw);
    if (!packet || seenAnimationIds.has(packet.id)) {
      continue;
    }
    seenAnimationIds.add(packet.id);

    const actorSide = sideForActorId(context, packet.payload.actorId ?? "");
    const moveLogs = projectLiveValueForSimulator(packet.payload.moveLogs ?? [], state).filter(
      (log): log is MoveLog => normalizeRemoteMoveLog(log) !== null,
    );
    const events = projectLiveValueForSimulator(
      (packet.payload.gameEvents ?? []) as GameEvent[],
      state,
    );
    const animationScript = projectLiveValueForSimulator(
      packet.payload.animationScript as AnimationScript,
      state,
    );
    const fallbackSide =
      moveLogs[0]?.playerId === P2 ? "opponent" : moveLogs[0]?.playerId === P1 ? "player" : null;
    const stateVersion = "stateVersion" in message ? message.stateVersion : undefined;

    additions.push({
      id: current.length + additions.length + 1,
      timestamp: Date.now() + additions.length,
      side: actorSide ?? fallbackSide ?? "system",
      move: packet.payload.moveType ?? "unknown",
      input: projectLiveValueForSimulator(packet.payload.input ?? { args: {} }, state),
      stateID:
        packet.payload.stateID ??
        (typeof stateVersion === "number" ? stateVersion : undefined) ??
        0,
      events,
      moveLogs,
      animationScript,
    });
  }

  if (additions.length === 0) {
    return current;
  }
  pruneSeenLogKeys(seenAnimationIds);
  return current.concat(additions).slice(-REMOTE_MOVE_LOG_LIMIT);
}

function appendRemoteEngineLogs(
  current: MoveLog[],
  engineLogs: readonly unknown[],
  context: LiveMatchContext,
  seenLogKeys: Set<string>,
  nextState?: MatchState,
): MoveLog[] {
  if (!context.game.state) {
    return current;
  }
  const projectionState = nextState ?? context.game.state;
  const additions: MoveLog[] = [];
  for (const raw of engineLogs) {
    const record = parseRemoteEngineLogRecord(raw);
    if (!record?.log) {
      continue;
    }
    const key = remoteMoveLogKey(record);
    if (seenLogKeys.has(key)) {
      continue;
    }
    seenLogKeys.add(key);
    const moveLog = normalizeRemoteMoveLog(
      projectLiveValueForSimulator(record.log, projectionState),
    );
    if (moveLog) {
      additions.push(moveLog);
    }
  }
  if (additions.length === 0) {
    return current;
  }
  pruneSeenLogKeys(seenLogKeys);
  return current.concat(additions).slice(-REMOTE_MOVE_LOG_LIMIT);
}

function remoteChatMessagesForContext(
  messages: readonly RemoteChatMessage[],
  context: LiveMatchContext,
): ChatMessage[] {
  return messages
    .map((message) => remoteChatMessageToLocal(message, context))
    .filter((message): message is ChatMessage => message !== null)
    .slice(-REMOTE_MOVE_LOG_LIMIT);
}

function remoteChatMessageForContext(
  value: unknown,
  context: LiveMatchContext,
): ChatMessage | null {
  const [message] = parseRemoteChatMessages([value]);
  return message ? remoteChatMessageToLocal(message, context) : null;
}

function remoteChatMessageToLocal(
  message: RemoteChatMessage,
  context: LiveMatchContext,
): ChatMessage | null {
  const id = stableNumericId(message.id);
  const timestamp = Date.parse(message.createdAt);
  const createdAt = Number.isFinite(timestamp) ? timestamp : Date.now();
  if (message.kind === "system") {
    return {
      kind: "system",
      id,
      timestamp: createdAt,
      text: message.systemEvent ?? "System message",
    };
  }

  const senderSide = sideForRemoteChatMessage(context, message);
  if (!senderSide) {
    return null;
  }
  if (
    message.kind === "preset" &&
    message.presetKey &&
    Object.prototype.hasOwnProperty.call(CHAT_PRESETS, message.presetKey)
  ) {
    return {
      kind: "preset",
      id,
      timestamp: createdAt,
      senderSide,
      presetKey: message.presetKey,
    };
  }
  if (message.kind === "text" && message.text) {
    return {
      kind: "text",
      id,
      timestamp: createdAt,
      senderSide,
      text: message.text,
    };
  }
  return null;
}

function sideForRemoteChatMessage(
  context: LiveMatchContext,
  message: RemoteChatMessage,
): Side | null {
  const byActor = sideForActorId(context, message.senderPlayerId);
  if (byActor) {
    return byActor;
  }
  if (message.senderSeat === 1) {
    return "player";
  }
  if (message.senderSeat === 2) {
    return "opponent";
  }
  return null;
}

function mergeRemoteChatMessage(current: ChatMessage[], message: ChatMessage): ChatMessage[] {
  if (current.some((existing) => existing.id === message.id)) {
    return current;
  }
  return current.concat(message).slice(-REMOTE_MOVE_LOG_LIMIT);
}

function stableNumericId(value: string): number {
  const numeric = Number(value);
  if (Number.isSafeInteger(numeric) && numeric > 0) {
    return numeric;
  }
  let hash = 0;
  for (let index = 0; index < value.length; index++) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash || 1;
}

export function resolveLiveMatchInitialAi(
  context: LiveMatchContext,
  search: string,
): { player: null; opponent: ReturnType<typeof getRemoteBotStrategy> } {
  const actorIds = context.game.actorIds;
  const hasBotOpponent = actorIds?.opponent.startsWith("bot_") === true;
  return {
    player: null,
    opponent: hasBotOpponent ? getRemoteBotStrategy(search) : null,
  };
}

export function resolveLiveMatchHumanSide(context: LiveMatchContext, playerId?: string): Side {
  if (playerId) {
    const side = sideForActorId(context, playerId);
    if (side) return side;
  }
  // Default to "player" when we cannot determine the local side.
  // Using interactionView.actorId was wrong for live matches because it
  // flips the board depending on whose turn it is.
  return "player";
}

function resolveLocalPlayerIdFromAuth(context: LiveMatchContext): string | undefined {
  const authData = getAuthSnapshot().data;
  if (!authData) return undefined;
  const userId = (authData.user as { id?: string } | undefined)?.id;
  if (!userId) return undefined;
  const participant = context.match.participants?.find((p) => p.userId === userId);
  return participant?.id;
}

function getRemoteBotStrategy(search: string) {
  const strategyId = new URLSearchParams(search).get("botStrategyId") ?? "default";
  return getStrategyById(strategyId)?.strategy ?? getStrategyById("default")?.strategy ?? null;
}

function remoteMoveLogKey(record: RemoteEngineLogRecord): string {
  const log = normalizeRemoteMoveLog(record.log);
  if (!log) {
    return `${record.stateVersion ?? "?"}:${record.timestamp ?? "?"}:missing`;
  }
  return [
    record.stateVersion ?? "?",
    record.timestamp ?? "?",
    log.timestamp,
    log.turnNumber,
    log.playerId,
    log.type,
  ].join(":");
}

function pruneSeenLogKeys(seenLogKeys: Set<string>): void {
  while (seenLogKeys.size > REMOTE_MOVE_LOG_LIMIT) {
    const oldest = seenLogKeys.values().next().value;
    if (typeof oldest !== "string") {
      return;
    }
    seenLogKeys.delete(oldest);
  }
}

function matchStateFromMessage(message: LiveGatewayMessage): MatchState | null {
  if (!("state" in message) || !message.state || typeof message.state !== "object") {
    return null;
  }
  const state = message.state as Partial<MatchState>;
  return state.G && state.ctx ? (message.state as MatchState) : null;
}

function parseRemoteEngineLogRecord(value: unknown): RemoteEngineLogRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const record = value as RemoteEngineLogRecord;
  return record.log && typeof record.log === "object" ? record : null;
}

function parseRemoteAnimationPacket(value: unknown): RemoteAnimationPacket | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const packet = value as RemoteAnimationPacket;
  if (
    typeof packet.id !== "string" ||
    packet.kind !== "cyberpunk.animationScript" ||
    !packet.payload ||
    typeof packet.payload !== "object" ||
    !isAnimationScript(packet.payload.animationScript)
  ) {
    return null;
  }
  return packet;
}

function isAnimationScript(value: unknown): value is AnimationScript {
  if (!value || typeof value !== "object") {
    return false;
  }
  const script = value as Partial<AnimationScript>;
  return Array.isArray(script.steps) && typeof script.totalDurationMs === "number";
}

function correlationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type GatewayErrorMessage = Extract<LiveGatewayMessage, { type: "gateway_error" | "error" }>;
type MoveRejectedMessage = Extract<LiveGatewayMessage, { type: "move_rejected" }>;

function showGatewayErrorNotification(message: GatewayErrorMessage): void {
  showServerFeedbackNotification({
    id: message.correlationId ? `gateway-error:${message.correlationId}` : undefined,
    severity: "error",
    title: message.code ? `Server error: ${message.code}` : "Server error",
    message: message.message,
  });
}

function showMoveRejectedNotification(message: MoveRejectedMessage): void {
  const isLoadStateFailure = message.reason.toLowerCase().includes("could not load game state");
  showServerFeedbackNotification({
    id: message.correlationId
      ? `move-rejected:${message.correlationId}`
      : `move-rejected:${message.gameId}:${message.reason}`,
    severity: isLoadStateFailure ? "error" : "warning",
    title: isLoadStateFailure ? "Could not update match" : "Move rejected",
    message: message.reason,
  });
}

function handleProposalReceived(
  message: Extract<LiveGatewayMessage, { type: "proposal_received" }>,
  handle: GatewayHandle | null,
): void {
  if (message.actionType !== "undo") {
    return;
  }
  const accepted = window.confirm("Your opponent requested to undo the last move. Approve?");
  handle?.emit(accepted ? "proposal_accept" : "proposal_decline", {
    gameId: message.gameId,
    actionType: "undo",
  });
}

function handleProposalResolved(
  message: Extract<LiveGatewayMessage, { type: "proposal_resolved" }>,
): void {
  if (message.actionType !== "undo") {
    return;
  }
  notifications.show({
    id: `undo-proposal-resolved:${message.gameId}:${message.resolution}`,
    color: message.resolution === "accepted" ? "green" : "yellow",
    title: message.resolution === "accepted" ? "Undo approved" : "Undo declined",
    message:
      message.resolution === "accepted"
        ? "The last move was undone."
        : "The undo request was not approved.",
  });
}

function handleProposalExpired(
  message: Extract<LiveGatewayMessage, { type: "proposal_expired" }>,
): void {
  if (message.actionType !== "undo") {
    return;
  }
  notifications.show({
    id: `undo-proposal-expired:${message.gameId}`,
    color: "yellow",
    title: "Undo request expired",
    message: "Your opponent did not respond in time.",
  });
}

function showHttpFailureNotification(
  error: unknown,
  options: {
    id: string;
    title: string;
    fallbackMessage: string;
    fallbackSeverity?: LiveFeedbackSeverity;
  },
): void {
  if (error instanceof LiveHttpError) {
    showServerFeedbackNotification({
      id: options.id,
      severity: error.severity,
      title: error.code ? `${options.title}: ${error.code}` : options.title,
      message: error.message,
    });
    return;
  }
  showServerFeedbackNotification({
    id: options.id,
    severity: options.fallbackSeverity ?? "error",
    title: options.title,
    message: error instanceof Error && error.message ? error.message : options.fallbackMessage,
  });
}

function showServerFeedbackNotification(input: {
  id?: string;
  severity: LiveFeedbackSeverity;
  title: string;
  message: string;
}): void {
  notifications.show({
    id: input.id,
    color: input.severity === "warning" ? "yellow" : "red",
    title: input.title,
    message: input.message,
  });
}
