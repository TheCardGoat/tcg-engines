import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import {
  EMPTY_ANIMATION_SCRIPT,
  type CommandSuccess,
  type MatchState,
} from "@tcg/cyberpunk-engine";
import type {
  AnimationPlanV2,
  ClientToServerEvents,
  DropEligibility,
  EngineInteractionView,
  InteractionSubmission,
  InteractionSubmissionValue,
  ServerToClientEvents,
  UndoScopeValue,
} from "@tcg/protocol";
import type {
  ConnectionDiagnosticEvent,
  ConnectionEndpointDiagnostic,
  PlayerPresenceDiagnostic,
  SimulatorConnectionDiagnosticInput,
  SimulatorConnectionStatus,
} from "@tcg/game-page-contract/connection-diagnostic";
import {
  canEmitLiveMatchWriteFromHandle,
  describeLiveMatchWriteGate,
  LIVE_MATCH_HEARTBEAT_INTERVAL_MS,
  LIVE_MATCH_OLDER_BOARD_FEEDBACK,
  LIVE_MATCH_SYNCING_BOARD_COPY,
  shouldShowLiveBoardSyncing,
  type NormalizedPresenceChange,
} from "@tcg/game-page-contract";
import {
  AnimationPlanV2Schema,
  buildInteractionSubmissionForActionId,
  validateInteractionSubmission,
} from "@tcg/protocol";
import {
  buildDiscordRichPresenceMatchUrl,
  clearDiscordPlayingGamePresence,
  type DiscordAuthorizationCodeExchange,
  updateDiscordPlayingGamePresence,
} from "@tcg/shared/discord-rich-presence";
import { buildGatewaySocketIoUrl, type LiveGatewayMessage } from "../engine/live/liveGateway";
import type { GatewayConnectionState, GatewayHandle } from "@tcg/gateway-client";
import { acquireRootGatewayHandle } from "../../../lib/gateway/root-socket";
import {
  liveGatewayJoinFromEvent,
  parseGatewayEvent,
  prepareLiveContext,
  reduceLiveGatewayMessage,
} from "../engine/live/liveMessages";
import {
  applyPresenceChange,
  applyPresenceDiagnostics,
  applyPresencePlayers,
  connectionUiStatus,
  markLocalConnectionStatus,
  recordLocalConnectionHeartbeat,
} from "../engine/live/playerConnectionState";
import {
  getMatchmakingReturnUrl,
  normalizeRemoteMoveLog,
  projectLiveStateForSimulator,
  projectLiveValueForSimulator,
  projectSimulatorStateForLive,
  projectSimulatorValueForLive,
  parseRemoteChatMessages,
  type RemoteChatMessage,
  type LiveMatchContext,
  liveMatchContextFromBootstrap,
} from "../engine/live/matchContext";
import { CYBERPUNK_GAME_SLUG } from "../engine/live/apiOrigin";
import { apiUrl } from "../../../runtime/gameRuntimeApi";
import {
  SimulatorLiveConnectionProvider,
  useSimulatorLiveConnection,
  useSimulatorRoute,
  type SimulatorConnectionTelemetrySink,
  type SimulatorLiveConnectionContextValue,
} from "../../../simulator/providers";
import type { LiveFeedbackSeverity } from "../engine/live/httpFeedback";
import {
  createLiveMatchViewerEngine,
  isFilteredMatchView,
  isMatchState,
  viewerProjectionToMatchState,
} from "../engine/live/liveState";
import {
  DEFAULT_SCENARIO,
  createPracticeAiConfig,
  createPracticeEngine,
  getStrategyById,
  loadPracticeMatchConfig,
  CHAT_PRESETS,
  type CyberpunkTestEngine,
  type ChatMessage,
  type ChatPresetKey,
  type EngineAction,
  type LocalCommandCommit,
  type MoveLog,
  type PlayerConnectionBySide,
  type PlayerIdentityBySide,
  type PracticeMatchConfig,
  type RawEngineEventEntry,
  type Side,
} from "../engine";
import { fetchPracticeMatchConfigFromServer } from "../engine/practice/sessionStorage";
import { P1, P2 } from "../engine/fixtures/scenarios";
import { BoardSharedPage } from "./BoardShared.page";
import {
  matchesPendingCorrelation,
  readMessageCorrelationId,
  shouldClearPendingAfterAuthoritativeState,
  shouldClearPendingAfterSubmitInteractionOk,
  type PendingOptimisticMove,
} from "./livePendingMove";
import {
  clientAuthorityPushedVersionOffset,
  describeLiveMatchServerFeedback,
  initialClientAuthorityLastPushedVersion,
  MATCH_RELOAD_FEEDBACK,
  resolveClientAuthorityStaleRejection,
  shouldAutoSyncFromServerCode,
  shouldToastClientAuthorityRejection,
} from "./clientAuthoritySync";
import classes from "./Practice.module.css";

interface ClientAuthorityStaleRejection {
  gameId: string;
  currentVersion: number;
  state?: unknown;
  nonce: number;
}

type ActiveProposalAction =
  | "cancel_match"
  | "undo"
  | "enable_free_text_chat"
  | "enable_manual_mode"
  | "disable_manual_mode";

interface ActiveProposal {
  actionType: ActiveProposalAction;
  undoScope?: UndoScopeValue;
  senderPlayerId: string;
  deadline: number;
}

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
      freeTextEnabled: boolean;
      freeTextProposalPending: boolean;
      boardCorrectionEnabled: boolean;
      boardCorrectionProposalPending: boolean;
    };

interface RemoteEngineLogRecord {
  stateVersion?: number;
  timestamp?: number;
  log?: unknown;
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
  authStatus?: "ok" | "refreshing" | "failed";
  authFailureReason?: Exclude<GatewayConnectionState["authFailureReason"], null>;
  latencyMs?: number;
  lastPongAt?: string;
  lastPingAt?: string;
  lastHeartbeatSentAt?: string;
  lastHeartbeatAckAt?: string;
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
  const simulatorRoute = useSimulatorRoute();
  const params = useParams<{ matchId: string; gameId: string }>();
  const matchId = simulatorRoute.matchId ?? params.matchId ?? "";
  const gameId = simulatorRoute.gameId ?? params.gameId ?? "";
  const location = useLocation();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [gatewayJoin, setGatewayJoin] = useState<GatewayJoinState | null>(null);
  const [playerConnections, setPlayerConnections] = useState<PlayerConnectionBySide>({});
  const [dropEligibility, setDropEligibility] = useState<DropEligibility | null>(
    simulatorRoute.matchPageData?.dropEligibility ?? null,
  );
  const [gatewayDiagnostic, setGatewayDiagnostic] = useState<LiveGatewayDiagnosticState>(() =>
    createInitialGatewayDiagnostic(),
  );
  const [gatewayHandle, setGatewayHandle] = useState<GatewayHandle | null>(null);
  const [syncRequestNonce, setSyncRequestNonce] = useState(0);
  const [clientAuthorityStaleRejection, setClientAuthorityStaleRejection] =
    useState<ClientAuthorityStaleRejection | null>(null);
  const [pendingOptimisticMove, setPendingOptimisticMove] = useState<PendingOptimisticMove | null>(
    null,
  );
  const [sessionJoined, setSessionJoined] = useState(false);
  const [sessionJoinedRole, setSessionJoinedRole] = useState<"player" | "spectator" | null>(null);
  const [knownServerVersion, setKnownServerVersion] = useState<number | null>(null);
  const [activeProposal, setActiveProposal] = useState<ActiveProposal | null>(null);
  const handleRef = useRef<GatewayHandle | null>(null);
  const liveConnectionRef = useRef<SimulatorLiveConnectionContextValue | null>(null);
  const latestContextRef = useRef<LiveMatchContext | null>(null);
  const gatewayJoinRef = useRef<GatewayJoinState | null>(null);
  const pendingOptimisticMoveRef = useRef<PendingOptimisticMove | null>(null);
  const submittedInteractionMessagesRef = useRef<Map<string, SubmitInteractionPayload>>(new Map());
  const seenLogKeysRef = useRef<Set<string>>(new Set());
  const seenAnimationIdsRef = useRef<Set<string>>(new Set());
  const previousConnectionStatusRef = useRef<SimulatorConnectionStatus | null>(null);
  const previousConnectionAuthenticatedRef = useRef(false);
  const previousConnectionLatencyRef = useRef<number | null>(null);
  const reconnectNotificationOpenRef = useRef(false);
  const startedAtMsRef = useRef(Date.now());
  const bootstrappedIdentityRef = useRef<string | null>(null);
  const readyContext = loadState.status === "ready" ? loadState.context : null;
  const readyGameId = readyContext?.game.gameId ?? null;
  const hasReadyGameState = Boolean(readyContext?.game.state);
  const liveViewerEngineBuilder = useMemo(() => {
    const state = readyContext?.game.state;
    return state ? () => createLiveMatchViewerEngine(state, matchId) : undefined;
  }, [matchId, readyContext?.game.state]);
  const contextPlayerId = useMemo(
    () => (readyContext ? resolveLocalPlayerId(readyContext) : undefined),
    [readyContext],
  );
  // sessionStorage is per-tab: a rejoin in a new tab or browser finds no local
  // practice config even for the seated owner. Recover it from the server's
  // stored quick-match setup so the rejoin remounts the client-authority board
  // instead of the server-authority fallback, whose interaction path can never
  // apply against a rebased client chain (stateID vs chain version).
  const [serverPracticeConfig, setServerPracticeConfig] = useState<PracticeMatchConfig | null>(
    null,
  );
  const [serverPracticeConfigMisses, setServerPracticeConfigMisses] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );
  const clientAuthorityConfig = useMemo(
    () =>
      readyContext?.game.authority === "client"
        ? (loadPracticeMatchConfig(matchId) ?? serverPracticeConfig)
        : null,
    [matchId, readyContext?.game.authority, serverPracticeConfig],
  );
  useEffect(() => {
    const gameId = readyContext?.game.gameId;
    if (readyContext?.game.authority !== "client" || !readyContext.game.state || !gameId) {
      return;
    }
    if (loadPracticeMatchConfig(matchId) || serverPracticeConfig) {
      return;
    }
    if (serverPracticeConfigMisses.has(gameId)) {
      return;
    }
    let cancelled = false;
    void fetchPracticeMatchConfigFromServer(gameId)
      .then((config) => {
        if (cancelled) return;
        if (config) {
          setServerPracticeConfig(config);
        } else {
          setServerPracticeConfigMisses((misses) => new Set(misses).add(gameId));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setServerPracticeConfigMisses((misses) => new Set(misses).add(gameId));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [
    matchId,
    readyContext?.game.authority,
    readyContext?.game.gameId,
    readyContext?.game.state,
    serverPracticeConfig,
    serverPracticeConfigMisses,
  ]);
  const canRunClientAuthorityPractice = Boolean(
    canRunClientAuthorityPracticeForContext(
      readyContext,
      Boolean(clientAuthorityConfig),
      contextPlayerId,
    ),
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
        authStatus: gatewayDiagnostic.authStatus,
        authFailureReason: gatewayDiagnostic.authFailureReason,
        latencyMs: gatewayDiagnostic.latencyMs,
        lastPongAt: gatewayDiagnostic.lastPongAt,
        lastPingAt: gatewayDiagnostic.lastPingAt,
        lastHeartbeatSentAt: gatewayDiagnostic.lastHeartbeatSentAt,
        lastHeartbeatAckAt: gatewayDiagnostic.lastHeartbeatAckAt,
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
    const matchPageData = simulatorRoute.matchPageData;
    // MatchSessionProvider refreshes commit a freshly parsed bootstrap object
    // on every poll (acceptSession returns the incoming session, not the
    // previous ref). Re-running the full reset on those commits would clear
    // the gateway join and unmount the board right after game_joined, and no
    // second join ever fires for the same socket. Only a real match/game
    // change may re-bootstrap the page.
    const identity = matchPageData
      ? `${matchPageData.match.matchId}:${matchPageData.game.gameId}`
      : null;
    if (!identity || bootstrappedIdentityRef.current === identity) {
      return;
    }
    bootstrappedIdentityRef.current = identity;
    setLoadState({ status: "loading" });
    setGatewayJoin(null);
    setPlayerConnections({});
    setActiveProposal(null);
    setGatewayDiagnostic(createInitialGatewayDiagnostic());
    setSyncRequestNonce(0);
    setClientAuthorityStaleRejection(null);
    setPendingOptimisticMove(null);
    submittedInteractionMessagesRef.current.clear();
    try {
      if (!matchPageData) return;
      const context = liveMatchContextFromBootstrap(matchPageData);
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
        freeTextEnabled: preparedContext.history?.freeTextEnabled === true,
        freeTextProposalPending: false,
        boardCorrectionEnabled: false,
        boardCorrectionProposalPending: false,
      });
    } catch (error) {
      setLoadState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to load match.",
      });
    }
  }, [simulatorRoute.matchPageData]);

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
      if (
        canRunClientAuthorityPractice &&
        message.code === "rejected_stale" &&
        context?.game.gameId === message.gameId
      ) {
        setClientAuthorityStaleRejection({
          gameId: message.gameId,
          currentVersion: message.currentVersion,
          state: message.state,
          nonce: Date.now(),
        });
        if (
          !shouldToastClientAuthorityRejection({
            code: message.code,
            clientAuthority: true,
          })
        ) {
          return;
        }
      }
      const needsAuthoritativeSync =
        context?.game.gameId === message.gameId &&
        !message.state &&
        (message.currentVersion > context.game.version ||
          // An equal-version illegal rejection still means our mirror
          // diverged (e.g. a stale automation fork attached a no-longer-valid
          // entity); the authoritative state is the only way to repair it.
          (message.code === "rejected_illegal" && message.currentVersion === context.game.version));
      const handled = rejectPendingOptimisticMove(message.reason, message.correlationId, {
        keepPendingUntilSync: needsAuthoritativeSync,
      });
      if (!handled) {
        showMoveRejectedNotification(message, context?.game.authority ?? "server");
      }
      if (needsAuthoritativeSync && context) {
        // Route through the session so the dedup window shared with the
        // heartbeat_ack / move_accepted / state_update paths applies here too.
        liveConnectionRef.current?.requestStateSyncIfDue(context.game.version);
      }
    },
    [canRunClientAuthorityPractice, rejectPendingOptimisticMove],
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

  const recordGatewayDiagnostic = useCallback(
    (patch: Partial<LiveGatewayDiagnosticState>, event?: Omit<ConnectionDiagnosticEvent, "at">) => {
      setGatewayDiagnostic((current) => updateGatewayDiagnostic(current, patch, event));
    },
    [],
  );

  const requestLiveStateSync = useCallback((version: number) => {
    liveConnectionRef.current?.requestStateSyncIfDue(version);
  }, []);

  // Recovery hook for the missed-setup-update affordance: re-request the
  // authoritative snapshot for the currently loaded game.
  const handleSetupStallSync = useCallback(() => {
    const context = latestContextRef.current;
    if (context) requestLiveStateSync(context.game.version);
  }, [requestLiveStateSync]);

  const handleGatewayEvent = useCallback(
    (
      type: keyof ServerToClientEvents,
      payload: Parameters<ServerToClientEvents[keyof ServerToClientEvents]>[0],
    ) => {
      const handle = handleRef.current;
      if (type === "drop_eligibility" && payload && typeof payload === "object") {
        const record = payload as { gameId?: string; dropEligibility?: DropEligibility };
        if ((!record.gameId || record.gameId === gameId) && record.dropEligibility) {
          setDropEligibility(record.dropEligibility);
        }
      }
      if (type === "game_joined" && payload && typeof payload === "object") {
        const record = payload as { dropEligibility?: DropEligibility };
        if (record.dropEligibility) setDropEligibility(record.dropEligibility);
        const rawJoin = liveGatewayJoinFromEvent(type, payload);
        if (rawJoin) {
          const joined = { ...rawJoin, nonce: Date.now() };
          gatewayJoinRef.current = joined;
          setGatewayJoin(joined);
        }
      }
      if (type === "presence_change" && payload && typeof payload === "object") {
        setPlayerConnections((current) =>
          applyPresenceChange(current, latestContextRef.current?.game.actorIds, payload),
        );
      }
      if (type === "player_drop_pending" && payload && typeof payload === "object") {
        const record = payload as Record<string, unknown>;
        const droppedPlayerId =
          typeof record.droppedPlayerId === "string" ? record.droppedPlayerId : undefined;
        const dropReason = typeof record.reason === "string" ? record.reason : "disconnect";
        const normalizedDropReason = dropReason.toLowerCase();
        const reasonKind =
          normalizedDropReason.includes("timeout") || normalizedDropReason.includes("timed out")
            ? "timeout"
            : "disconnect";
        notifications.show({
          id: `live-match:player-drop-pending:${gameId}:${droppedPlayerId}`,
          color: "yellow",
          title: reasonKind === "timeout" ? "Opponent timed out" : "Opponent disconnected",
          message:
            reasonKind === "timeout"
              ? "Your opponent is being dropped due to timeout."
              : "Your opponent is being dropped due to disconnect.",
        });
      }
      if (type === "submit_interaction:response") {
        handleSubmitInteractionResponse(payload);
      }
      if (type === "heartbeat_ack" && payload && typeof payload === "object") {
        const context = latestContextRef.current;
        if (!context) {
          return;
        }
        const record = payload as { stateVersions?: Record<string, number> };
        const serverVersion = record.stateVersions?.[gameId];
        if (typeof serverVersion !== "number") {
          return;
        }
        setKnownServerVersion((current) =>
          current === null ? serverVersion : Math.max(current, serverVersion),
        );
        const localVersion = context.game.version;
        if (serverVersion > localVersion) {
          requestLiveStateSync(localVersion);
          console.info("[live-match] heartbeat_ack server ahead; requesting state sync", {
            gameId,
            localVersion,
            serverVersion,
          });
        }
      }
      const message = parseGatewayEvent(type, payload);
      if (!message) {
        if (type === "game_joined") {
          console.warn(
            "[live-match] game_joined payload failed schema parse; seat kept from envelope",
            {
              gameId,
              socketId: handle?.getState().connectionId,
            },
          );
        }
        return;
      }
      if ("stateVersion" in message && typeof message.stateVersion === "number") {
        const stateVersion: number = message.stateVersion;
        setKnownServerVersion((current) =>
          current === null ? stateVersion : Math.max(current, stateVersion),
        );
      }
      if (message.type === "gateway_error" || message.type === "error") {
        if (message.code?.startsWith("proposal_")) {
          setActiveProposal(null);
        }
        recordGatewayDiagnostic(
          {
            lastError: message.message,
          },
          { type: message.type, message: message.message, details: message },
        );
        if (shouldAutoSyncFromServerCode(message.code) && canRunClientAuthorityPractice) {
          const context = latestContextRef.current;
          if (context) {
            setClientAuthorityStaleRejection({
              gameId: context.game.gameId,
              currentVersion: context.game.version,
              state: context.game.state,
              nonce: Date.now(),
            });
            rejectPendingOptimisticMove(MATCH_RELOAD_FEEDBACK.message, message.correlationId);
          }
        } else {
          showGatewayErrorNotification(
            message,
            latestContextRef.current?.game.authority ?? "server",
          );
          rejectPendingOptimisticMove(message.message, message.correlationId);
        }
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
          requestLiveStateSync(pending.startingVersion);
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
        if (typeof message.currentVersion === "number") {
          setKnownServerVersion((current) =>
            current === null ? message.currentVersion : Math.max(current, message.currentVersion),
          );
        }
        handleRejectedOptimisticMove(message);
      }
      if (message.type === "proposal_received" && message.gameId === gameId && handle) {
        setActiveProposal(activeProposalFromReceived(message));
      }
      if (message.type === "proposal_resolved" && message.gameId === gameId) {
        setActiveProposal((current) =>
          current?.actionType === message.actionType ? null : current,
        );
        handleProposalResolved(message);
      }
      if (message.type === "proposal_expired" && message.gameId === gameId) {
        setActiveProposal((current) =>
          current?.actionType === message.actionType ? null : current,
        );
        handleProposalExpired(message);
      }
      if (message.type === "game_joined") {
        const joined = { gameId: message.gameId, role: message.role, nonce: Date.now() };
        gatewayJoinRef.current = joined;
        setGatewayJoin(joined);
        if (typeof message.stateVersion === "number") {
          setKnownServerVersion((current) =>
            current === null ? message.stateVersion : Math.max(current, message.stateVersion),
          );
        }
        setActiveProposal(activeProposalFromJoined(message));
        setPlayerConnections((current) =>
          applyPresencePlayers(current, latestContextRef.current?.game.actorIds, message.players),
        );
        console.info("[live-match] gateway game joined", {
          gameId: message.gameId,
          matchId,
          role: message.role,
          stateVersion: message.stateVersion,
          socketId: handle?.getState().connectionId,
        });
      }
      if (message.type === "request_state_sync" && message.gameId === gameId) {
        setSyncRequestNonce((nonce) => nonce + 1);
      }
      setLoadState((previous) => {
        if (previous.status !== "ready") {
          return previous;
        }
        const chatPolicy = reduceLiveChatPolicy(
          {
            freeTextEnabled: previous.freeTextEnabled,
            freeTextProposalPending: previous.freeTextProposalPending,
          },
          message,
        );
        const boardCorrectionPolicy = reduceLiveBoardCorrectionPolicy(
          {
            boardCorrectionEnabled: previous.boardCorrectionEnabled,
            boardCorrectionProposalPending: previous.boardCorrectionProposalPending,
          },
          message,
        );
        if (message.type === "game_chat_history" && message.gameId === gameId) {
          return {
            ...previous,
            ...chatPolicy,
            ...boardCorrectionPolicy,
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
            ...chatPolicy,
            ...boardCorrectionPolicy,
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
          return isLiveChatPolicyChanged(previous, chatPolicy) ||
            isLiveBoardCorrectionPolicyChanged(previous, boardCorrectionPolicy)
            ? { ...previous, ...chatPolicy, ...boardCorrectionPolicy }
            : previous;
        }
        if (
          message.type === "state_update" &&
          typeof message.stateVersion === "number" &&
          message.stateVersion > previous.context.game.version + 1
        ) {
          requestLiveStateSync(previous.context.game.version);
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
          ...chatPolicy,
          ...boardCorrectionPolicy,
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
          socketId: handle?.getState().connectionId,
        });
        if (typeof message.correlationId === "string") {
          submittedInteractionMessagesRef.current.delete(message.correlationId);
        }
      }
    },
    [
      canRunClientAuthorityPractice,
      clearPendingOptimisticMove,
      gameId,
      handleRejectedOptimisticMove,
      handleSubmitInteractionResponse,
      location.search,
      matchId,
      recordGatewayDiagnostic,
      rejectPendingOptimisticMove,
      requestLiveStateSync,
    ],
  );

  const derivePresenceChat = useCallback(
    (change: NormalizedPresenceChange) => {
      const context = latestContextRef.current;
      if (!context) {
        return;
      }
      const localPlayerId = contextPlayerId ?? resolveLocalPlayerId(context);
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
    },
    [contextPlayerId],
  );

  const handleLiveConnectionState = useCallback(
    (s: SimulatorLiveConnectionContextValue) => {
      liveConnectionRef.current = s;
      setGatewayDiagnostic((current) => {
        const patch: Partial<LiveGatewayDiagnosticState> = {
          status: s.status,
          authenticated: s.authenticated,
          authStatus: s.authStatus,
          authFailureReason: s.authFailureReason ?? undefined,
          connectionId: s.connectionId ?? undefined,
          socketId: s.connectionId ?? undefined,
          latencyMs: s.latencyMs ?? undefined,
          lastPingAt: s.lastPingAt ?? undefined,
          lastPongAt: s.lastPongAt ?? undefined,
          lastHeartbeatSentAt: s.lastHeartbeatSentAt ?? undefined,
          lastHeartbeatAckAt: s.lastHeartbeatAckAt ?? undefined,
          authModeLabel: s.authenticated ? "Authenticated" : undefined,
          reconnectAttempts: s.reconnectAttempt,
        };
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
      setSessionJoined(s.joined);
      setSessionJoinedRole(s.joinedRole);

      const context = latestContextRef.current;
      const side = context ? localConnectionSideForContext(context, contextPlayerId) : null;
      const markLocalConnection = (status: "connected" | "reconnecting" | "disconnected") => {
        setPlayerConnections((current) => markLocalConnectionStatus(current, side, status));
      };

      const previousStatus = previousConnectionStatusRef.current;
      const previousAuthenticated = previousConnectionAuthenticatedRef.current;
      const previousLatencyMs = previousConnectionLatencyRef.current;
      // Game-domain per-side connection mirroring for board rendering. The
      // session doesn't know about "sides", so the consumer translates.
      if (context) {
        setPlayerConnections((current) =>
          applyPresenceDiagnostics(current, context.game.actorIds, s.presence),
        );
      }
      const wasReady = previousStatus === "connected" && previousAuthenticated;
      const isReady = s.status === "connected" && s.authenticated;
      if (!wasReady && isReady) {
        markLocalConnection("connected");
        // The gateway (re)connected: anything streamed while the socket was
        // down — including the setup updates that carry the first prompts —
        // never reached this client. Ask for a fresh authoritative snapshot.
        const context = latestContextRef.current;
        if (context) requestLiveStateSync(context.game.version);
      } else if (s.status === "reconnecting" && previousStatus !== "reconnecting") {
        markLocalConnection("reconnecting");
      } else if (s.status === "disconnected" && previousStatus !== "disconnected") {
        markLocalConnection("disconnected");
      }

      if (s.latencyMs !== null && s.latencyMs !== previousLatencyMs && side) {
        const parsedPingAt = s.lastPingAt ? Date.parse(s.lastPingAt) : NaN;
        const pingAt = Number.isFinite(parsedPingAt) ? parsedPingAt : Date.now();
        setPlayerConnections((current) =>
          recordLocalConnectionHeartbeat(current, side, pingAt, s.latencyMs as number),
        );
      }

      if (s.status === "reconnecting" && !reconnectNotificationOpenRef.current) {
        reconnectNotificationOpenRef.current = true;
        showServerFeedbackNotification({
          id: `live-match:gateway-connection:${gameId}`,
          severity: "warning",
          title: "Connection interrupted",
          message: s.error
            ? `${s.error}. Trying to reconnect to the match server.`
            : "Trying to reconnect to the match server.",
        });
      } else if (s.status === "connected" && previousStatus !== "connected") {
        reconnectNotificationOpenRef.current = false;
      }

      previousConnectionStatusRef.current = s.status;
      previousConnectionAuthenticatedRef.current = s.authenticated;
      previousConnectionLatencyRef.current = s.latencyMs;
    },
    [contextPlayerId, gameId, requestLiveStateSync],
  );

  // Coming back to a background tab is a classic missed-update window: gate
  // holds, timers throttle, sockets idle. Ask the server for an authoritative
  // snapshot so a frozen setup/board self-heals without a manual reload.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      const context = latestContextRef.current;
      if (!context || context.game.status === "completed") return;
      requestLiveStateSync(context.game.version);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onVisibilityChange);
    };
  }, [requestLiveStateSync]);

  useEffect(() => {
    if (!readyGameId || (!hasReadyGameState && !canRunClientAuthorityPractice)) {
      setGatewayHandle(null);
      return;
    }

    const handle: GatewayHandle = acquireRootGatewayHandle(CYBERPUNK_GAME_SLUG);
    handleRef.current = handle;
    setGatewayHandle(handle);
    liveConnectionRef.current = null;
    previousConnectionStatusRef.current = null;
    previousConnectionAuthenticatedRef.current = false;
    previousConnectionLatencyRef.current = null;
    reconnectNotificationOpenRef.current = false;

    recordGatewayDiagnostic(
      {
        status: handle.getState().status === "connected" ? "connected" : "connecting",
        endpoint: createGatewayEndpointDiagnostic(),
        lastError: undefined,
      },
      { type: "ticket_request", message: "Acquiring gateway namespace" },
    );

    return () => {
      if (handleRef.current === handle) {
        handleRef.current = null;
      }
      setGatewayHandle((current) => (current === handle ? null : current));
      liveConnectionRef.current = null;
      setSessionJoined(false);
      setSessionJoinedRole(null);
      setKnownServerVersion(null);
      handle.release();
    };
  }, [
    canRunClientAuthorityPractice,
    gameId,
    hasReadyGameState,
    readyGameId,
    recordGatewayDiagnostic,
  ]);

  const buildLiveHeartbeatPayload = useCallback(() => {
    const context = latestContextRef.current;
    return {
      game: context ? { gameId, matchId, stateVersion: context.game.version } : undefined,
      activity: {
        idle: false,
        tabVisible: document.visibilityState !== "hidden",
      },
    };
  }, [gameId, matchId]);
  const handleLiveDiagnostic = useCallback(
    (event: ConnectionDiagnosticEvent) => {
      recordGatewayDiagnostic({}, event);
    },
    [recordGatewayDiagnostic],
  );
  const handleLiveGameEvent = useCallback(
    (event: keyof ServerToClientEvents, payload: unknown) => {
      handleGatewayEvent(
        event,
        payload as Parameters<ServerToClientEvents[keyof ServerToClientEvents]>[0],
      );
    },
    [handleGatewayEvent],
  );
  const liveConnectionTelemetrySink = useCallback<SimulatorConnectionTelemetrySink>((event) => {
    window.dispatchEvent(new CustomEvent("simulator:connection-telemetry", { detail: event }));
  }, []);

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
      const bootstrap = simulatorRoute.matchPageData;
      const gate = bootstrap
        ? canEmitLiveMatchWriteFromHandle({
            handle,
            viewer: bootstrap.viewer,
            capabilities: {
              actions: bootstrap.capabilities?.actions ?? bootstrap.viewer.role === "player",
            },
            gameStatus: bootstrap.game.status,
            bootstrapGameId: bootstrap.game.gameId,
            emitGameId: gameId,
          })
        : ({ ok: false, reason: "not_connected" } as const);
      if (!handle || !gate.ok) {
        const feedback = describeLiveMatchWriteGate(gate.ok ? "not_connected" : gate.reason);
        console.warn("[live-match] interaction not sent", {
          actionId: submission.actionId,
          gameId,
          reason: gate.ok ? "not_connected" : gate.reason,
          socketId: handle?.getState().connectionId,
        });
        showServerFeedbackNotification({
          id: `live-match:interaction-not-sent:${gameId}`,
          severity: "warning",
          title: feedback.title,
          message: feedback.message,
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
    [gameId, matchId, simulatorRoute.matchPageData],
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
        // The view no longer carries this action (state advanced or the
        // adapter disabled it). Surface it — a silent false here previously
        // deadlocked scry prompts with no diagnostic trail.
        // eslint-disable-next-line no-console
        console.warn("[live-match] interaction submission unavailable", {
          actionId: input.actionId,
          side: input.side,
          stateVersion: input.interactionView.stateVersion,
          actions: input.interactionView.actions.map((action) => ({
            id: action.id,
            enabled: action.enabled,
          })),
        });
        return false;
      }
      const validation = validateInteractionSubmission(input.interactionView, submission);
      if (!validation.ok) {
        console.warn("[live-match] interaction submission rejected locally", {
          actionId: input.actionId,
          side: input.side,
          issues: validation.issues,
        });
        return false;
      }
      return submitInteractionForSide(state, input.side, submission);
    },
    [submitInteractionForSide],
  );

  const requestRemoteUndo = useCallback((undoScope: UndoScopeValue) => {
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
      undoScope,
    });
    setActiveProposal({
      actionType: "undo",
      undoScope,
      senderPlayerId: contextPlayerIdForProposal(context),
      deadline: Date.now() + 15_000,
    });
    notifications.show({
      id: `undo-proposal-sent:${context.game.gameId}`,
      color: "blue",
      title: undoScope === "turn_start" ? "Turn undo requested" : "Undo requested",
      message:
        undoScope === "turn_start"
          ? "Waiting for your opponent to approve rewinding to the beginning of the turn."
          : "Waiting for your opponent to approve the last-action undo.",
    });
    return true;
  }, []);

  const respondToActiveProposal = useCallback(
    (accepted: boolean) => {
      const proposal = activeProposal;
      const context = latestContextRef.current;
      const handle = handleRef.current;
      if (
        !proposal ||
        !context?.game.gameId ||
        !handle ||
        handle.getState().status !== "connected"
      ) {
        notifications.show({
          color: "red",
          title: "Gateway unavailable",
          message: "Reconnect before responding to the request.",
        });
        return;
      }
      handle.emit(accepted ? "proposal_accept" : "proposal_decline", {
        gameId: context.game.gameId,
        actionType: proposal.actionType,
      });
    },
    [activeProposal],
  );

  const sendRemoteChatPreset = useCallback((presetKey: ChatPresetKey) => {
    const handle = handleRef.current;
    const context = latestContextRef.current;
    if (!handle || handle.getState().status !== "connected" || !context?.game.gameId) {
      notifications.show({
        color: "red",
        title: "Gateway unavailable",
        message: "Reconnect before sending a message.",
      });
      return false;
    }
    return emitGatewayChatPreset(handle, context.game.gameId, presetKey);
  }, []);

  const sendRemoteChatText = useCallback((text: string) => {
    const handle = handleRef.current;
    const context = latestContextRef.current;
    if (!handle || handle.getState().status !== "connected" || !context?.game.gameId) {
      notifications.show({
        color: "red",
        title: "Gateway unavailable",
        message: "Reconnect before sending a message.",
      });
      return false;
    }
    return emitGatewayChatText(handle, context.game.gameId, text);
  }, []);

  const requestRemoteFreeTextChat = useCallback(() => {
    const handle = handleRef.current;
    const context = latestContextRef.current;
    if (!handle || handle.getState().status !== "connected" || !context?.game.gameId) {
      notifications.show({
        color: "red",
        title: "Gateway unavailable",
        message: "Reconnect before requesting free text.",
      });
      return false;
    }
    const sent = emitGatewayFreeTextRequest(handle, context.game.gameId);
    if (sent) {
      setLoadState((previous) =>
        previous.status === "ready" ? { ...previous, freeTextProposalPending: true } : previous,
      );
      notifications.show({
        id: `free-text-proposal-sent:${context.game.gameId}`,
        color: "blue",
        title: "Free text requested",
        message: "Waiting for your opponent to approve free text chat.",
      });
    }
    return sent;
  }, []);

  const requestRemoteBoardCorrection = useCallback(() => {
    const handle = handleRef.current;
    const context = latestContextRef.current;
    if (!handle || handle.getState().status !== "connected" || !context?.game.gameId) {
      notifications.show({
        color: "red",
        title: "Gateway unavailable",
        message: "Reconnect before requesting board correction.",
      });
      return false;
    }
    const sent = emitGatewayBoardCorrectionRequest(handle, context.game.gameId);
    if (sent) {
      setLoadState((previous) =>
        previous.status === "ready"
          ? { ...previous, boardCorrectionProposalPending: true }
          : previous,
      );
      setActiveProposal({
        actionType: "enable_manual_mode",
        senderPlayerId: contextPlayerIdForProposal(context),
        deadline: Date.now() + 15_000,
      });
      notifications.show({
        id: `board-correction-proposal-sent:${context.game.gameId}`,
        color: "blue",
        title: "Board correction requested",
        message: "Waiting for your opponent to approve board state correction.",
      });
    }
    return sent;
  }, []);

  const requestRemoteBoardCorrectionExit = useCallback(() => {
    const handle = handleRef.current;
    const context = latestContextRef.current;
    if (!handle || handle.getState().status !== "connected" || !context?.game.gameId) {
      notifications.show({
        color: "red",
        title: "Gateway unavailable",
        message: "Reconnect before exiting board correction.",
      });
      return false;
    }
    return emitGatewayBoardCorrectionExit(handle, context.game.gameId);
  }, []);

  const remoteExecuteMove = useCallback(
    (input: { moveType: string; payload: Record<string, unknown>; expectedVersion: number }) => {
      const handle = handleRef.current;
      const context = latestContextRef.current;
      if (!handle || handle.getState().status !== "connected" || !context?.game.gameId) {
        notifications.show({
          color: "red",
          title: "Gateway unavailable",
          message: "Reconnect before correcting the board.",
        });
        return false;
      }
      return emitGatewayExecuteMove(
        handle,
        context.game.gameId,
        input.expectedVersion,
        input.moveType,
        input.payload,
      );
    },
    [],
  );

  const sendPushState = useCallback((payload: PushStatePayload) => {
    const handle = handleRef.current;
    if (!handle) {
      // eslint-disable-next-line no-console
      console.warn("[live-match] gateway is not open; state not pushed", payload.moveType);
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
    const localPlayerId = contextPlayerId ?? resolveLocalPlayerId(context);
    const canSendHostedChat = Boolean(localPlayerId);
    const canRequestFreeText = false;
    const clientAuthorityJoined = sessionJoined && sessionJoinedRole === "player";
    if (
      context.game.authority === "client" &&
      clientAuthorityConfig &&
      actorIds &&
      contextPlayerId === actorIds.player
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
          freeTextEnabled={loadState.freeTextEnabled}
          freeTextProposalPending={loadState.freeTextProposalPending}
          canSendChat={canSendHostedChat}
          canRequestFreeText={canRequestFreeText}
          sendRemoteChatPreset={sendRemoteChatPreset}
          sendRemoteChatText={sendRemoteChatText}
          requestRemoteFreeTextChat={requestRemoteFreeTextChat}
          returnUrl={getMatchmakingReturnUrl(CYBERPUNK_GAME_SLUG, location.search)}
          playerConnections={playerConnectionsForBoard(context, playerConnections)}
          connectionDiagnostic={connectionDiagnostic}
          syncRequestNonce={syncRequestNonce}
          sendPushState={sendPushState}
          staleRejection={clientAuthorityStaleRejection}
        />
      );
    }

    if (!context.game.state) {
      return null;
    }
    const viewerOnly = context.game.authority === "client";
    const initialAi = resolveLiveMatchInitialAi(context, location.search);
    const humanSide = resolveLiveMatchHumanSide(context, localPlayerId ?? undefined);
    const playerIdentities = playerIdentitiesForContext(context);
    const boardPlayerConnections = playerConnectionsForBoard(context, playerConnections);
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
        remoteInteractionView={context.game.interactionView}
        remotePrompt={context.game.viewerProjection?.prompt}
        requestRemoteUndo={requestRemoteUndo}
        remoteMoveLogs={loadState.moveLogs}
        remoteEngineEvents={loadState.engineEvents}
        remoteChatMessages={loadState.chatMessages}
        remoteFreeTextEnabled={loadState.freeTextEnabled}
        remoteFreeTextProposalPending={loadState.freeTextProposalPending}
        canSendChat={canSendHostedChat}
        canRequestFreeText={canRequestFreeText}
        sendRemoteChatPreset={sendRemoteChatPreset}
        sendRemoteChatText={sendRemoteChatText}
        requestRemoteFreeTextChat={requestRemoteFreeTextChat}
        remoteBoardCorrectionEnabled={loadState.boardCorrectionEnabled}
        remoteBoardCorrectionProposalPending={loadState.boardCorrectionProposalPending}
        canRequestBoardCorrection={!viewerOnly}
        requestRemoteBoardCorrection={requestRemoteBoardCorrection}
        requestRemoteBoardCorrectionExit={requestRemoteBoardCorrectionExit}
        remoteExecuteMove={remoteExecuteMove}
        hasPendingRemoteMove={pendingOptimisticMove !== null}
        playerIdentities={playerIdentities}
        playerConnections={boardPlayerConnections}
        connectionDiagnostic={connectionDiagnostic}
        onClaimRivalDrop={claimRivalDrop}
        dropEligibility={dropEligibility}
        liveMatchSidebar={{
          matchId: context.match.matchId,
          gameId: context.game.gameId,
          localPlayerId: localPlayerId ?? undefined,
          participants: context.match.participants ?? [],
          player1Score: context.match.player1Score,
          player2Score: context.match.player2Score,
          returnUrl,
        }}
        onSetupStallSync={handleSetupStallSync}
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
    sessionJoined,
    sessionJoinedRole,
    loadState,
    location.search,
    liveViewerEngineBuilder,
    playerConnections,
    pendingOptimisticMove,
    remoteDispatch,
    remoteSubmitInteraction,
    requestRemoteUndo,
    requestRemoteFreeTextChat,
    requestRemoteBoardCorrection,
    requestRemoteBoardCorrectionExit,
    remoteExecuteMove,
    contextPlayerId,
    sendRemoteChatPreset,
    sendRemoteChatText,
    sendPushState,
    syncRequestNonce,
    clientAuthorityStaleRejection,
    handleSetupStallSync,
  ]);

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

  const fallback = (
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
  const localVersion = readyContext?.game.version ?? 0;
  const showLiveSyncing =
    Boolean(simulatorRoute.matchPageData?.viewer.role === "player") &&
    shouldShowLiveBoardSyncing({ knownServerVersion, localVersion });
  const content = board ?? fallback;
  const proposalBanner =
    loadState.status === "ready" ? (
      <LiveProposalBanner
        proposal={activeProposal}
        localPlayerId={contextPlayerId ?? resolveLocalPlayerId(loadState.context)}
        onAccept={() => respondToActiveProposal(true)}
        onDecline={() => respondToActiveProposal(false)}
      />
    ) : null;

  if (
    !gatewayHandle ||
    !readyGameId ||
    !simulatorRoute.matchPageData ||
    (!hasReadyGameState && !canRunClientAuthorityPractice)
  ) {
    return (
      <>
        {proposalBanner}
        {content}
      </>
    );
  }

  return (
    <SimulatorLiveConnectionProvider
      handle={gatewayHandle}
      bootstrap={simulatorRoute.matchPageData}
      buildHeartbeatPayload={buildLiveHeartbeatPayload}
      heartbeatIntervalMs={LIVE_MATCH_HEARTBEAT_INTERVAL_MS}
      authority={readyContext?.game.authority}
      onGameEvent={handleLiveGameEvent}
      onPresenceChange={derivePresenceChat}
      onDiagnostic={handleLiveDiagnostic}
      telemetrySink={liveConnectionTelemetrySink}
    >
      <CyberpunkLiveConnectionBridge onState={handleLiveConnectionState} />
      {proposalBanner}
      {showLiveSyncing ? (
        <p role="status" className={classes.lead}>
          {LIVE_MATCH_SYNCING_BOARD_COPY}
        </p>
      ) : null}
      {content}
    </SimulatorLiveConnectionProvider>
  );
}

function CyberpunkLiveConnectionBridge({
  onState,
}: {
  onState: (state: SimulatorLiveConnectionContextValue) => void;
}) {
  const connection = useSimulatorLiveConnection();
  useEffect(() => {
    onState(connection);
  }, [connection, onState]);
  return null;
}

interface ClientAuthorityPracticeBoardProps {
  context: LiveMatchContext;
  config: PracticeMatchConfig;
  actorIds: NonNullable<LiveMatchContext["game"]["actorIds"]>;
  moveLogs: MoveLog[];
  chatMessages: ChatMessage[];
  freeTextEnabled: boolean;
  freeTextProposalPending: boolean;
  canSendChat: boolean;
  canRequestFreeText: boolean;
  sendRemoteChatPreset: (key: ChatPresetKey) => boolean;
  sendRemoteChatText: (text: string) => boolean;
  requestRemoteFreeTextChat: () => boolean;
  returnUrl: string;
  playerConnections: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  syncRequestNonce: number;
  sendPushState: (payload: PushStatePayload) => void;
  staleRejection: ClientAuthorityStaleRejection | null;
}

function ClientAuthorityPracticeBoard({
  context,
  config,
  actorIds,
  moveLogs,
  chatMessages,
  freeTextEnabled,
  freeTextProposalPending,
  canSendChat,
  canRequestFreeText,
  sendRemoteChatPreset,
  sendRemoteChatText,
  requestRemoteFreeTextChat,
  returnUrl,
  playerConnections,
  connectionDiagnostic,
  syncRequestNonce,
  sendPushState,
  staleRejection,
}: ClientAuthorityPracticeBoardProps) {
  const engineRef = useRef<CyberpunkTestEngine | null>(null);
  const engineGameIdRef = useRef<string | null>(null);
  const lastPushedVersionRef = useRef<number>(-1);
  // Push versions must form a gapless chain against the server's stored chain
  // (version == expectedVersion + 1). After a silent rebuild, numbering matches
  // the restored snapshot; after a stale-rebase, it maps onto the server's
  // reported head. This offset maps local stateIDs onto that chain.
  const pushedVersionOffsetRef = useRef(0);
  const recoveredOnceRef = useRef(false);
  const [engineGeneration, setEngineGeneration] = useState(0);
  const handledStaleNonceRef = useRef<number | null>(null);

  if (!engineRef.current || engineGameIdRef.current !== context.game.gameId) {
    const hydratedFromServer = Boolean(context.game.state);
    engineRef.current = context.game.state
      ? createLiveMatchViewerEngine(context.game.state)
      : createPracticeEngine(config);
    engineGameIdRef.current = context.game.gameId;
    const engineStateId = engineRef.current.getState().ctx.stateID;
    // Anchor pushes to the server's stored chain version, not the snapshot's
    // internal stateID: after a rebase or recovered baseline the two diverge
    // (stateID 1 against chain head 5) and stateID-numbered pushes would be
    // stale-rejected forever.
    const serverVersion = hydratedFromServer ? context.game.version : null;
    lastPushedVersionRef.current = initialClientAuthorityLastPushedVersion({
      hydratedFromServer,
      localVersion: engineStateId,
      serverVersion,
    });
    pushedVersionOffsetRef.current = clientAuthorityPushedVersionOffset({
      hydratedFromServer,
      serverVersion,
      engineStateId,
    });
    recoveredOnceRef.current = false;
    handledStaleNonceRef.current = null;
  }

  const pushCurrentState = useCallback(
    (moveType: string, commit?: LocalCommandCommit, force = false) => {
      const engine = engineRef.current;
      if (!engine) {
        return;
      }

      const localState = engine.getState();
      const version = localState.ctx.stateID + pushedVersionOffsetRef.current;
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
        expectedVersion: version === 0 ? null : version - 1,
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
    if (lastPushedVersionRef.current >= 0) {
      return;
    }
    pushCurrentState("init");
  }, [pushCurrentState]);

  useEffect(() => {
    if (syncRequestNonce <= 0) {
      return;
    }
    const engine = engineRef.current;
    if (!engine) {
      return;
    }
    const localVersion = engine.getState().ctx.stateID;
    if (localVersion === lastPushedVersionRef.current) {
      return;
    }
    pushCurrentState("sync", undefined, true);
  }, [pushCurrentState, syncRequestNonce]);

  useEffect(() => {
    if (!staleRejection || staleRejection.gameId !== context.game.gameId) {
      return;
    }
    if (handledStaleNonceRef.current === staleRejection.nonce) {
      return;
    }
    handledStaleNonceRef.current = staleRejection.nonce;
    const engine = engineRef.current;
    if (!engine) {
      return;
    }
    const localVersion = engine.getState().ctx.stateID;
    const snapshot = context.game.state;
    const resolution = resolveClientAuthorityStaleRejection({
      localVersion,
      serverCurrentVersion: staleRejection.currentVersion,
      snapshot,
      // The context snapshot is the page-load bootstrap: after a remount it
      // can be arbitrarily stale. Acking is only safe when it is current —
      // a stale snapshot gets the same rebase treatment as no snapshot.
      snapshotVersion: snapshot == null ? undefined : context.game.version,
      recoveredOnce: recoveredOnceRef.current,
    });
    if (resolution.action === "ack") {
      lastPushedVersionRef.current = Math.max(lastPushedVersionRef.current, localVersion);
      return;
    }
    if (resolution.action === "silent_rebuild") {
      recoveredOnceRef.current = true;
      engineRef.current = createLiveMatchViewerEngine(resolution.snapshot, context.match.matchId);
      engineGameIdRef.current = context.game.gameId;
      const rebuiltStateId = engineRef.current.getState().ctx.stateID;
      // Same anchor as the mount path: the restored snapshot's stateID does
      // not necessarily equal the server chain version it was stored under.
      lastPushedVersionRef.current = initialClientAuthorityLastPushedVersion({
        hydratedFromServer: true,
        localVersion: rebuiltStateId,
        serverVersion: context.game.version,
      });
      pushedVersionOffsetRef.current = clientAuthorityPushedVersionOffset({
        hydratedFromServer: true,
        serverVersion: context.game.version,
        engineStateId: rebuiltStateId,
      });
      setEngineGeneration((generation) => generation + 1);
      return;
    }
    if (resolution.action === "rebase") {
      // Diverged chain bookkeeping: the server reports a head it has no
      // snapshot for. Renumber local stateIDs onto that head so the force
      // push lands at version = baseVersion with expectedVersion =
      // baseVersion - 1, exactly the head the server's CAS will accept.
      pushedVersionOffsetRef.current = resolution.baseVersion - localVersion;
      pushCurrentState("rebase", undefined, true);
      return;
    }
    if (resolution.action !== "ask_reload") {
      const unhandledResolution: never = resolution;
      throw new Error(
        `Unhandled client-authority stale resolution: ${JSON.stringify(unhandledResolution)}`,
      );
    }
    showReloadNotification(context.game.gameId);
  }, [
    context.game.gameId,
    context.game.state,
    context.match.matchId,
    context.game.version,
    pushCurrentState,
    staleRejection,
  ]);

  const boardPlayerConnections = useMemo(
    () => playerConnectionsForBoard(context, playerConnections),
    [context, playerConnections],
  );

  const handleLocalCommandCommitted = useCallback(
    (commit: LocalCommandCommit) => {
      pushCurrentState(commit.result.processedCommand.move, commit, true);
    },
    [pushCurrentState],
  );

  return (
    <BoardSharedPage
      key={`${context.game.gameId}:${engineGeneration}`}
      scenarioId={DEFAULT_SCENARIO}
      initialEngineBuilder={() => engineRef.current ?? createPracticeEngine(config)}
      initialAi={createPracticeAiConfig(config)}
      initialHumanSide="player"
      initialAiMode="auto"
      initialAiSpeed="balanced"
      autoResolveSingletonCardTargets={false}
      remoteMoveLogs={moveLogs}
      remoteChatMessages={chatMessages}
      remoteFreeTextEnabled={freeTextEnabled}
      remoteFreeTextProposalPending={freeTextProposalPending}
      canSendChat={canSendChat}
      canRequestFreeText={canRequestFreeText}
      sendRemoteChatPreset={sendRemoteChatPreset}
      sendRemoteChatText={sendRemoteChatText}
      requestRemoteFreeTextChat={requestRemoteFreeTextChat}
      playerIdentities={playerIdentitiesForContext(context)}
      playerConnections={boardPlayerConnections}
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

function playerConnectionsForBoard(
  context: LiveMatchContext,
  connections: PlayerConnectionBySide,
): PlayerConnectionBySide {
  if (!isBotActorId(context.game.actorIds?.opponent)) {
    return connections;
  }
  const opponentConnection = connections.opponent;
  return {
    ...connections,
    opponent: opponentConnection
      ? {
          ...opponentConnection,
          status: "connected",
          connected: true,
          disconnectedAt: undefined,
        }
      : {
          status: "connected",
          connected: true,
          disconnectedAt: undefined,
        },
  };
}

function isBotActorId(actorId: string | undefined): boolean {
  return actorId?.startsWith("bot_") === true;
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
    matchStateFromMessage(message, context) ?? undefined,
  );
}

function appendRemoteEngineEvents(
  current: RawEngineEventEntry[],
  message: LiveGatewayMessage,
  context: LiveMatchContext,
  seenAnimationIds: Set<string>,
): RawEngineEventEntry[] {
  const state = matchStateFromMessage(message, context) ?? context.game.state;
  if (!state || !("animationPlan" in message) || message.animationPlan === null) {
    return current;
  }
  const parsed = AnimationPlanV2Schema.safeParse(message.animationPlan);
  if (!parsed.success || seenAnimationIds.has(parsed.data.id)) {
    return current;
  }
  seenAnimationIds.add(parsed.data.id);
  pruneSeenLogKeys(seenAnimationIds);
  const stateVersion = "stateVersion" in message ? message.stateVersion : undefined;
  const move =
    "moveType" in message && typeof message.moveType === "string" ? message.moveType : "";
  const entry: RawEngineEventEntry = {
    id: typeof stateVersion === "number" ? stateVersion : Math.max(0, current.at(-1)?.id ?? 0) + 1,
    timestamp: Date.now(),
    side: "system",
    move: move || "authoritative",
    input: { args: {} },
    stateID: typeof stateVersion === "number" ? stateVersion : 0,
    afterState: state,
    events: [],
    moveLogs: [],
    animationScript: EMPTY_ANIMATION_SCRIPT,
    animationPlan: projectLiveValueForSimulator(
      parsed.data as AnimationPlanV2,
      state,
      context.game.actorIds,
    ),
  };
  return current.concat(entry).slice(-REMOTE_MOVE_LOG_LIMIT);
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
      projectLiveValueForSimulator(record.log, projectionState, context.game.actorIds),
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
      text: systemChatMessageText(message.systemEvent),
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

export interface LiveChatPolicyState {
  freeTextEnabled: boolean;
  freeTextProposalPending: boolean;
}

export function reduceLiveChatPolicy(
  state: LiveChatPolicyState,
  message: LiveGatewayMessage,
): LiveChatPolicyState {
  if (message.type === "game_chat_history") {
    return {
      freeTextEnabled: message.freeTextEnabled === true,
      freeTextProposalPending: state.freeTextProposalPending && message.freeTextEnabled !== true,
    };
  }

  if (message.type === "chat_message" && isFreeTextEnabledSystemChatMessage(message.message)) {
    return { freeTextEnabled: true, freeTextProposalPending: false };
  }

  if (message.type === "proposal_resolved" && message.actionType === "enable_free_text_chat") {
    return {
      freeTextEnabled: state.freeTextEnabled || message.resolution === "accepted",
      freeTextProposalPending: false,
    };
  }

  if (message.type === "proposal_expired" && message.actionType === "enable_free_text_chat") {
    return { ...state, freeTextProposalPending: false };
  }

  if (
    (message.type === "gateway_error" || message.type === "error") &&
    message.code === "free_text_chat_disabled"
  ) {
    return { ...state, freeTextProposalPending: false };
  }

  return state;
}

function isFreeTextEnabledSystemChatMessage(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }
  const message = value as { kind?: unknown; systemEvent?: unknown };
  return message.kind === "system" && message.systemEvent === "free_text_chat_enabled";
}

function isLiveChatPolicyChanged(
  previous: LiveChatPolicyState,
  next: LiveChatPolicyState,
): boolean {
  return (
    previous.freeTextEnabled !== next.freeTextEnabled ||
    previous.freeTextProposalPending !== next.freeTextProposalPending
  );
}

export interface LiveBoardCorrectionPolicyState {
  boardCorrectionEnabled: boolean;
  boardCorrectionProposalPending: boolean;
}

export function reduceLiveBoardCorrectionPolicy(
  state: LiveBoardCorrectionPolicyState,
  message: LiveGatewayMessage,
): LiveBoardCorrectionPolicyState {
  if (message.type === "game_joined") {
    const pendingAction =
      message.pendingProposal && typeof message.pendingProposal === "object"
        ? (message.pendingProposal as { actionType?: unknown }).actionType
        : undefined;
    return {
      boardCorrectionEnabled: message.manualModeEnabled === true,
      boardCorrectionProposalPending: pendingAction === "enable_manual_mode",
    };
  }

  if (message.type === "proposal_resolved") {
    if (message.actionType === "enable_manual_mode") {
      return {
        boardCorrectionEnabled: state.boardCorrectionEnabled || message.resolution === "accepted",
        boardCorrectionProposalPending: false,
      };
    }
    if (message.actionType === "disable_manual_mode") {
      return {
        boardCorrectionEnabled:
          message.resolution === "accepted" ? false : state.boardCorrectionEnabled,
        boardCorrectionProposalPending: false,
      };
    }
  }

  if (
    message.type === "proposal_expired" &&
    (message.actionType === "enable_manual_mode" || message.actionType === "disable_manual_mode")
  ) {
    return { ...state, boardCorrectionProposalPending: false };
  }

  if (message.type === "chat_message") {
    const systemEvent =
      message.message && typeof message.message === "object"
        ? (message.message as { kind?: unknown; systemEvent?: unknown }).systemEvent
        : undefined;
    if (systemEvent === "enable_manual_mode_accepted") {
      return { boardCorrectionEnabled: true, boardCorrectionProposalPending: false };
    }
    if (systemEvent === "disable_manual_mode_accepted") {
      return { boardCorrectionEnabled: false, boardCorrectionProposalPending: false };
    }
  }

  return state;
}

function isLiveBoardCorrectionPolicyChanged(
  previous: LiveBoardCorrectionPolicyState,
  next: LiveBoardCorrectionPolicyState,
): boolean {
  return (
    previous.boardCorrectionEnabled !== next.boardCorrectionEnabled ||
    previous.boardCorrectionProposalPending !== next.boardCorrectionProposalPending
  );
}

export function emitGatewayChatPreset(
  handle: Pick<GatewayHandle, "emit"> | null,
  gameId: string,
  presetKey: ChatPresetKey,
): boolean {
  if (!handle || !gameId) {
    return false;
  }
  handle.emit("send_chat_message", { gameId, presetKey });
  return true;
}

export function emitGatewayChatText(
  handle: Pick<GatewayHandle, "emit"> | null,
  gameId: string,
  text: string,
): boolean {
  const trimmed = text.trim();
  if (!handle || !gameId || trimmed.length === 0) {
    return false;
  }
  handle.emit("send_free_text_chat_message", { gameId, text: trimmed });
  return true;
}

export function emitGatewayFreeTextRequest(
  handle: Pick<GatewayHandle, "emit"> | null,
  gameId: string,
): boolean {
  void handle;
  void gameId;
  return false;
}

export function emitGatewayBoardCorrectionRequest(
  handle: Pick<GatewayHandle, "emit"> | null,
  gameId: string,
): boolean {
  if (!handle || !gameId) {
    return false;
  }
  handle.emit("proposal_send", { gameId, actionType: "enable_manual_mode" });
  return true;
}

export function emitGatewayBoardCorrectionExit(
  handle: Pick<GatewayHandle, "emit"> | null,
  gameId: string,
): boolean {
  if (!handle || !gameId) {
    return false;
  }
  handle.emit("proposal_send", { gameId, actionType: "disable_manual_mode" });
  return true;
}

export function emitGatewayExecuteMove(
  handle: Pick<GatewayHandle, "emit"> | null,
  gameId: string,
  expectedVersion: number,
  moveType: string,
  payload: Record<string, unknown>,
): boolean {
  if (!handle || !gameId) {
    return false;
  }
  handle.emit("execute_move", { gameId, expectedVersion, moveType, payload });
  return true;
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
  return {
    player: null,
    opponent: isBotActorId(actorIds?.opponent) ? getRemoteBotStrategy(search) : null,
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

export function canRunClientAuthorityPracticeForContext(
  context: LiveMatchContext | null,
  hasClientAuthorityConfig: boolean,
  playerId?: string,
): boolean {
  return Boolean(
    context?.game.authority === "client" &&
    hasClientAuthorityConfig &&
    playerId &&
    context.game.actorIds?.player === playerId,
  );
}

function resolveLocalPlayerId(context: LiveMatchContext): string | undefined {
  return context.game.actorIds?.player;
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

function matchStateFromMessage(
  message: LiveGatewayMessage,
  context: LiveMatchContext,
): MatchState | null {
  if (!("state" in message) || !message.state || typeof message.state !== "object") {
    return null;
  }
  const state = isMatchState(message.state)
    ? message.state
    : isFilteredMatchView(message.state)
      ? viewerProjectionToMatchState(message.state, context.match.matchId)
      : null;
  return state ? projectLiveStateForSimulator(state, context.game.actorIds) : null;
}

function parseRemoteEngineLogRecord(value: unknown): RemoteEngineLogRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const record = value as RemoteEngineLogRecord;
  return record.log && typeof record.log === "object" ? record : null;
}

function correlationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type GatewayErrorMessage = Extract<LiveGatewayMessage, { type: "gateway_error" | "error" }>;
type MoveRejectedMessage = Extract<LiveGatewayMessage, { type: "move_rejected" }>;

function showReloadNotification(gameId: string): void {
  showServerFeedbackNotification({
    id: `live-match:reload:${gameId}`,
    severity: "warning",
    title: MATCH_RELOAD_FEEDBACK.title,
    message: MATCH_RELOAD_FEEDBACK.message,
  });
}

function showGatewayErrorNotification(
  message: GatewayErrorMessage,
  authority: "server" | "client" = "server",
): void {
  const feedback = describeLiveMatchServerFeedback({ ...message, authority });
  showServerFeedbackNotification({
    id: message.correlationId ? `gateway-error:${message.correlationId}` : undefined,
    severity: feedback.severity,
    title: feedback.title,
    message: feedback.message,
  });
}

function showMoveRejectedNotification(
  message: MoveRejectedMessage,
  authority: "server" | "client" = "server",
): void {
  if (message.code === "rejected_stale" && authority === "server") {
    showServerFeedbackNotification({
      id: message.correlationId
        ? `move-rejected:${message.correlationId}`
        : `move-rejected:${message.gameId}:${message.reason}`,
      severity: "warning",
      title: LIVE_MATCH_OLDER_BOARD_FEEDBACK.title,
      message: LIVE_MATCH_OLDER_BOARD_FEEDBACK.message,
    });
    return;
  }
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

function activeProposalFromReceived(
  message: Extract<LiveGatewayMessage, { type: "proposal_received" }>,
): ActiveProposal | null {
  const actionType = parseActiveProposalAction(message.actionType);
  if (!actionType) {
    return null;
  }
  return {
    actionType,
    ...(actionType === "undo"
      ? { undoScope: message.undoScope === "turn_start" ? "turn_start" : "last_move" }
      : {}),
    senderPlayerId: message.senderPlayerId,
    deadline: message.deadline,
  };
}

function activeProposalFromJoined(
  message: Extract<LiveGatewayMessage, { type: "game_joined" }>,
): ActiveProposal | null {
  const proposal = message.pendingProposal;
  if (!proposal || typeof proposal !== "object") {
    return null;
  }
  const candidate = proposal as {
    actionType?: unknown;
    senderPlayerId?: unknown;
    deadline?: unknown;
    undoScope?: unknown;
  };
  const actionType =
    typeof candidate.actionType === "string"
      ? parseActiveProposalAction(candidate.actionType)
      : null;
  if (
    !actionType ||
    typeof candidate.senderPlayerId !== "string" ||
    typeof candidate.deadline !== "number"
  ) {
    return null;
  }
  return {
    actionType,
    ...(actionType === "undo"
      ? { undoScope: candidate.undoScope === "turn_start" ? "turn_start" : "last_move" }
      : {}),
    senderPlayerId: candidate.senderPlayerId,
    deadline: candidate.deadline,
  };
}

function parseActiveProposalAction(actionType: string): ActiveProposalAction | null {
  switch (actionType) {
    case "cancel_match":
    case "undo":
    case "enable_free_text_chat":
    case "enable_manual_mode":
    case "disable_manual_mode":
      return actionType;
    default:
      return null;
  }
}

function contextPlayerIdForProposal(context: LiveMatchContext): string {
  return resolveLocalPlayerId(context) ?? "";
}

function proposalCopy(proposal: ActiveProposal): {
  actionLabel: string;
  requesterTitle: string;
  requesterMessage: string;
  responderTitle: string;
  responderMessage: string;
  acceptLabel: string;
  declineLabel: string;
} {
  switch (proposal.actionType) {
    case "undo":
      return proposal.undoScope === "turn_start"
        ? {
            actionLabel: "Turn undo request",
            requesterTitle: "Turn undo requested",
            requesterMessage: "Waiting for opponent response.",
            responderTitle: "Opponent requested a turn undo",
            responderMessage:
              "Approve or decline returning to the beginning of the current turn's Main Phase.",
            acceptLabel: "Accept turn undo",
            declineLabel: "Reject",
          }
        : {
            actionLabel: "Undo request",
            requesterTitle: "Undo requested",
            requesterMessage: "Waiting for opponent response.",
            responderTitle: "Opponent requested undo",
            responderMessage: "Approve or decline the last-action undo request.",
            acceptLabel: "Accept undo",
            declineLabel: "Reject",
          };
    case "enable_free_text_chat":
      return {
        actionLabel: "Free text request",
        requesterTitle: "Free text requested",
        requesterMessage: "Waiting for opponent response.",
        responderTitle: "Opponent requested free text",
        responderMessage: "Approve or decline free text chat for this match.",
        acceptLabel: "Accept",
        declineLabel: "Reject",
      };
    case "enable_manual_mode":
      return {
        actionLabel: "Manual mode request",
        requesterTitle: "Manual mode requested",
        requesterMessage: "Waiting for opponent response.",
        responderTitle: "Opponent requested manual mode",
        responderMessage: "Approve or decline board state correction mode.",
        acceptLabel: "Accept",
        declineLabel: "Reject",
      };
    case "disable_manual_mode":
      return {
        actionLabel: "Manual mode request",
        requesterTitle: "Manual mode update requested",
        requesterMessage: "Waiting for opponent response.",
        responderTitle: "Opponent requested manual mode off",
        responderMessage: "Approve or decline disabling board state correction mode.",
        acceptLabel: "Accept",
        declineLabel: "Reject",
      };
    case "cancel_match":
      return {
        actionLabel: "Cancel request",
        requesterTitle: "Match cancel requested",
        requesterMessage: "Waiting for opponent response.",
        responderTitle: "Opponent requested match cancel",
        responderMessage: "Approve or decline the match cancellation.",
        acceptLabel: "Accept",
        declineLabel: "Reject",
      };
  }
}

function LiveProposalBanner({
  proposal,
  localPlayerId,
  onAccept,
  onDecline,
}: {
  proposal: ActiveProposal | null;
  localPlayerId: string | undefined;
  onAccept: () => void;
  onDecline: () => void;
}) {
  if (!proposal) {
    return null;
  }
  const copy = proposalCopy(proposal);
  const isRequester = localPlayerId !== undefined && proposal.senderPlayerId === localPlayerId;
  const secondsRemaining = Math.max(0, Math.ceil((proposal.deadline - Date.now()) / 1000));
  return (
    <section className={classes.proposalBanner} aria-live="polite">
      <div className={classes.proposalBannerText}>
        <span className={classes.proposalBannerKicker}>{copy.actionLabel}</span>
        <strong>{isRequester ? copy.requesterTitle : copy.responderTitle}</strong>
        <span>{isRequester ? copy.requesterMessage : copy.responderMessage}</span>
      </div>
      <div className={classes.proposalBannerActions}>
        <span className={classes.proposalBannerTimer}>{secondsRemaining}s</span>
        {isRequester ? (
          <button className={classes.proposalBannerButton} type="button" disabled>
            Waiting
          </button>
        ) : (
          <>
            <button className={classes.proposalBannerButton} type="button" onClick={onDecline}>
              {copy.declineLabel}
            </button>
            <button
              className={`${classes.proposalBannerButton} ${classes.proposalBannerButtonPrimary}`}
              type="button"
              onClick={onAccept}
            >
              {copy.acceptLabel}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export function systemChatMessageText(systemEvent: string | undefined): string {
  if (systemEvent?.startsWith("Drop claimed:")) {
    return systemEvent.toLowerCase().includes("timed out")
      ? "Drop approved: opponent timed out."
      : "Drop approved: opponent disconnected.";
  }

  switch (systemEvent) {
    case "undo_proposed":
      return "Undo requested.";
    case "undo_accepted":
      return "Undo request accepted.";
    case "undo_declined":
      return "Undo request rejected.";
    case "undo_expired":
      return "Undo request expired.";
    case "free_text_chat_enabled":
      return "Free text chat enabled.";
    case "enable_free_text_chat_proposed":
      return "Free text chat requested.";
    case "enable_free_text_chat_declined":
      return "Free text chat request rejected.";
    case "enable_free_text_chat_expired":
      return "Free text chat request expired.";
    case "cancel_match_proposed":
      return "Match cancellation requested.";
    case "cancel_match_accepted":
      return "Match cancellation accepted.";
    case "cancel_match_declined":
      return "Match cancellation rejected.";
    case "cancel_match_expired":
      return "Match cancellation request expired.";
    case "enable_manual_mode_proposed":
      return "Manual mode requested.";
    case "enable_manual_mode_accepted":
      return "Manual mode enabled.";
    case "enable_manual_mode_declined":
      return "Manual mode request rejected.";
    case "enable_manual_mode_expired":
      return "Manual mode request expired.";
    case "disable_manual_mode_proposed":
      return "Manual mode disable requested.";
    case "disable_manual_mode_accepted":
      return "Manual mode disabled.";
    case "disable_manual_mode_declined":
      return "Manual mode disable request rejected.";
    case "disable_manual_mode_expired":
      return "Manual mode disable request expired.";
    default:
      return systemEvent ?? "System message";
  }
}

function handleProposalResolved(
  message: Extract<LiveGatewayMessage, { type: "proposal_resolved" }>,
): void {
  if (message.actionType === "enable_free_text_chat") {
    notifications.show({
      id: `free-text-proposal-resolved:${message.gameId}:${message.resolution}`,
      color: message.resolution === "accepted" ? "green" : "yellow",
      title: message.resolution === "accepted" ? "Free text enabled" : "Free text declined",
      message:
        message.resolution === "accepted"
          ? "Free text chat is now enabled for this match."
          : "The free text chat request was not approved.",
    });
    return;
  }

  if (message.actionType === "enable_manual_mode") {
    notifications.show({
      id: `board-correction-proposal-resolved:${message.gameId}:${message.resolution}`,
      color: message.resolution === "accepted" ? "green" : "yellow",
      title:
        message.resolution === "accepted"
          ? "Board correction enabled"
          : "Board correction declined",
      message:
        message.resolution === "accepted"
          ? "Both players can now correct the board."
          : "The board correction request was not approved.",
    });
    return;
  }

  if (message.actionType === "disable_manual_mode") {
    notifications.show({
      id: `board-correction-disabled:${message.gameId}`,
      color: "blue",
      title: "Board correction off",
      message: "Board state correction is no longer active.",
    });
    return;
  }

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
  if (message.actionType === "enable_free_text_chat") {
    notifications.show({
      id: `free-text-proposal-expired:${message.gameId}`,
      color: "yellow",
      title: "Free text request expired",
      message: "Your opponent did not respond in time.",
    });
    return;
  }

  if (message.actionType === "enable_manual_mode") {
    notifications.show({
      id: `board-correction-proposal-expired:${message.gameId}`,
      color: "yellow",
      title: "Board correction request expired",
      message: "Your opponent did not respond in time.",
    });
    return;
  }

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
