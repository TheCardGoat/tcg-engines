import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";
import type { ServerToClientEvents } from "@tcg/protocol";
import {
  LIVE_MATCH_HEARTBEAT_INTERVAL_MS,
  type NormalizedPresenceChange,
} from "@tcg/game-page-contract";
import {
  buildSimulatorConnectionDiagnostic,
  type SimulatorConnectionDiagnostic,
  type ConnectionDiagnosticEvent,
  type SimulatorConnectionDiagnosticInput,
  type SimulatorConnectionStatus,
} from "@tcg/game-page-contract";
import {
  ConnectionPanel,
  DropClaimControl,
  isDropControlVisible,
  SimulatorRouteStatus,
} from "@tcg/simulator-ui";
import { buttonVariants } from "../src/components/primitives/index.ts";
import { projectConnectionPanelDiagnostic } from "../../../simulator/connection-panel-projection.ts";
import {
  buildDiscordRichPresenceMatchUrl,
  clearDiscordPlayingGamePresence,
  type DiscordAuthorizationCodeExchange,
  updateDiscordPlayingGamePresence,
} from "../discord-rich-presence.ts";

import {
  buildDiscordActivityTokenUrl,
  buildGatewaySocketIoUrl,
  parseLiveGatewayEvent,
} from "../src/engine/live/liveGateway.ts";
import type { GatewayHandle } from "@tcg/gateway-client";
import { acquireRootGatewayHandle } from "../../../lib/gateway/root-socket.ts";
import {
  SimulatorLiveConnectionProvider,
  useSimulatorLiveConnection,
  useSimulatorRoute,
  type SimulatorConnectionTelemetrySink,
  type SimulatorLiveConnectionContextValue,
} from "../../../simulator/providers";
import {
  reduceLiveGatewayMessage,
  engineLogRecordsFromBootstrapHistory,
} from "../src/engine/live/liveMessages.ts";
import {
  emitGatewayChatPreset,
  emitGatewayChatText,
  emitGatewayFreeTextRequest,
  mergeRemoteChatMessage,
  reduceLiveChatPolicy,
  remoteChatMessageForViewer,
  remoteChatMessagesForViewer,
} from "../src/engine/live/liveChat.ts";
import {
  createInitialLiveMatchView,
  getMatchmakingReturnUrl,
  parseRemoteChatMessages,
  type LiveMatchView,
} from "../src/engine/live/matchContext.ts";
import { parseGundamLiveProjection } from "../src/engine/live/liveProjection.ts";
import {
  applyLiveProjectionUpdate,
  createLiveProjectionViewerEngine,
} from "../src/engine/live/liveState.ts";
import { LiveGundamGameProvider } from "../src/engine/live/LiveGundamGameProvider.tsx";
import type {
  RemoteStallRecoveryFn,
  RemoteSubmitFn,
  RemoteUndoFn,
} from "../src/engine/live/remoteAdapter.ts";
import { LiveDropEligibilityProvider } from "../src/engine/live/liveDropEligibility.tsx";
import type { DropEligibility } from "@tcg/protocol";
import type { GundamChatMessage, ChatPresetKey } from "../src/game/chat.ts";
import type { GundamChatRemoteWiring } from "../src/game/chat-context.tsx";
import { m } from "../src/lib/i18n/messages.ts";

import { HintsProvider } from "../src/lib/use-hints-enabled.ts";
import { AutoPassWhenNoValidActionProvider } from "../src/lib/auto-pass-settings.tsx";
import {
  AttackTargetingOverlayContainer,
  AutoPassActionStepContainer,
  BattleStepRibbonContainer,
  CombatIntentOverlayContainer,
  MatchOverviewModalContainer,
  PlayerSeatContainer,
  GundamPendingChoicePrompt,
  PromptContainer,
  SetupPromptContainer,
  SubmitErrorProvider,
  GundamTargetingProvider,
} from "../src/components/containers/index.ts";
import { SubmitErrorToast } from "../src/components/ui/SubmitErrorToast.tsx";
import { CardInspectProvider } from "../src/components/ui/card/card-inspect-context.tsx";
import { DualModeProvider } from "../src/components/ui/dual-mode-context.tsx";
import { GundamInteractionDraftProvider } from "../src/game/interaction-draft.tsx";
import { GundamDragDropProvider } from "../src/components/ui/playerSeat/gundam-drag-drop-context.tsx";
import { CardInspectDialog } from "../src/components/ui/CardInspectDialogContainer.tsx";
import { GundamBoardLayout } from "../src/components/ui/GundamBoardLayout.tsx";
import { GameTable } from "../src/components/ui/GameTable.tsx";
import { GundamCardContextController } from "../src/components/GundamCardContextController.tsx";
import { asViewerId } from "../src/game/types.ts";
import { readGundamPresentation, type GundamPresentation } from "@tcg/gundam-server-adapter";
import { GundamSharedAnimationLayer } from "../src/animation/index.ts";

type LoadState =
  | { status: "idle" }
  | { status: "connecting"; view: LiveMatchView }
  | {
      status: "ready";
      view: LiveMatchView;
      runtime: MatchRuntime;
      staticResources: MatchStaticResources;
    }
  | { status: "error"; message: string };

const INVALID_LIVE_PROJECTION_MESSAGE = "The server returned an invalid live game projection.";

const exchangeDiscordActivityCode: DiscordAuthorizationCodeExchange = async ({
  clientId,
  code,
}) => {
  const response = await fetch(buildDiscordActivityTokenUrl(), {
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

/**
 * `/matches/:matchId/games/:gameId` — server-authoritative live match.
 *
 * The server bootstrap selects the viewer and supplies game-scoped realtime
 * credentials. The query string may carry only navigation hints such as
 * `returnTo`; it cannot select a player, role, or credential.
 *
 * Lifecycle:
 *   1. mount → open the gateway socket and `join_game` the supplied
 *      gameId. While waiting for the first `state_sync`, render a
 *      "connecting" status.
 *   2. first `state_sync` → build a renderer runtime from the viewer projection
 *      via {@link createLiveProjectionViewerEngine}, transition to
 *      `ready`, and mount the full simulator tree pointed at that
 *      runtime through {@link LiveGundamGameProvider}.
 *   3. every later `state_sync` / `state_update` → call
 *      {@link applyLiveProjectionUpdate} which loads the new state into
 *      the existing runtime; subscribers re-render automatically.
 *   4. `game_ended` → mark `ended` on the view; the existing
 *      MatchOverviewModalContainer surfaces the result.
 */
export function LiveMatchPage() {
  const simulatorRoute = useSimulatorRoute();
  const params = useParams<{ matchId: string; gameId?: string }>();
  const matchId = simulatorRoute.matchId ?? params.matchId ?? "";
  const [search] = useSearchParams();
  const gameId = simulatorRoute.gameId ?? params.gameId ?? search.get("gameId") ?? "";
  const playerId = simulatorRoute.matchPageData
    ? simulatorRoute.matchPageData.viewer.role === "player"
      ? simulatorRoute.matchPageData.viewer.actorId
      : simulatorRoute.matchPageData.viewer.spectatorId
    : "";
  const isRankedMatch = simulatorRoute.matchPageData?.match.matchType === "ranked";
  const searchString = useMemo(() => `?${search.toString()}`, [search]);

  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });
  const [chatState, setChatState] = useState<{
    messages: GundamChatMessage[];
    freeTextEnabled: boolean;
    freeTextProposalPending: boolean;
  }>({ messages: [], freeTextEnabled: false, freeTextProposalPending: false });
  const [gatewayHandle, setGatewayHandle] = useState<GatewayHandle | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<SimulatorConnectionStatus>("checking");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionAuthenticated, setConnectionAuthenticated] = useState(false);
  const [connectionAuthStatus, setConnectionAuthStatus] = useState<"ok" | "refreshing" | "failed">(
    "ok",
  );
  const [connectionAuthFailureReason, setConnectionAuthFailureReason] =
    useState<SimulatorLiveConnectionContextValue["authFailureReason"]>(null);
  const [connectionLatencyMs, setConnectionLatencyMs] = useState<number | null>(null);
  const [lastPingAt, setLastPingAt] = useState<string | null>(null);
  const [lastPongAt, setLastPongAt] = useState<string | null>(null);
  const [lastHeartbeatSentAt, setLastHeartbeatSentAt] = useState<string | null>(null);
  const [lastHeartbeatAckAt, setLastHeartbeatAckAt] = useState<string | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [dropEligibility, setDropEligibility] = useState<DropEligibility | null>(
    simulatorRoute.matchPageData?.dropEligibility ?? null,
  );
  const [connectionEvents, setConnectionEvents] = useState<ConnectionDiagnosticEvent[]>([]);
  const handleRef = useRef<GatewayHandle | null>(null);
  const liveConnectionRef = useRef<SimulatorLiveConnectionContextValue | null>(null);
  const runtimeRef = useRef<MatchRuntime | null>(null);
  const staticResourcesRef = useRef<MatchStaticResources | null>(null);
  const latestViewRef = useRef<LiveMatchView | null>(null);
  const previousConnectionStatusRef = useRef<SimulatorConnectionStatus | null>(null);
  const previousConnectionErrorRef = useRef<string | null>(null);
  const startedAtMsRef = useRef(Date.now());
  const discordClientId =
    import.meta.env.VITE_DISCORD_ACTIVITY_CLIENT_ID ?? import.meta.env.VITE_DISCORD_CLIENT_ID;
  const connectionDiagnostic = useMemo<SimulatorConnectionDiagnosticInput>(
    () => ({
      gameSlug: "gundam",
      route:
        typeof window === "undefined" ? "" : `${window.location.pathname}${window.location.search}`,
      matchId,
      gameId,
      playerId,
      endpoint: gatewayEndpointDiagnostic(),
      connection: {
        status: connectionStatus,
        connectionId: connectionId ?? undefined,
        socketId: connectionId ?? undefined,
        authenticated: connectionAuthenticated,
        authStatus: connectionAuthStatus,
        authFailureReason: connectionAuthFailureReason ?? undefined,
        authModeLabel: "Scoped match session",
        latencyMs: connectionLatencyMs ?? undefined,
        lastPingAt: lastPingAt ?? undefined,
        lastPongAt: lastPongAt ?? undefined,
        lastHeartbeatSentAt: lastHeartbeatSentAt ?? undefined,
        lastHeartbeatAckAt: lastHeartbeatAckAt ?? undefined,
        reconnectAttempts: reconnectAttempt,
        lastError: connectionError ?? undefined,
      },
      events: connectionEvents,
    }),
    [
      connectionError,
      connectionAuthenticated,
      connectionAuthFailureReason,
      connectionAuthStatus,
      connectionEvents,
      connectionId,
      connectionLatencyMs,
      connectionStatus,
      gameId,
      lastHeartbeatAckAt,
      lastHeartbeatSentAt,
      lastPingAt,
      lastPongAt,
      matchId,
      playerId,
      reconnectAttempt,
    ],
  );

  // Stable callback for the remote adapter — the simulator UI calls
  // this for every move. Captures the latest handle from the ref so
  // reconnects don't need to re-wire the SimulatorApp tree.
  const remoteSubmit: RemoteSubmitFn = useCallback(
    (submission, expectedVersion) => {
      const handle = handleRef.current;
      if (!handle || handle.getState().status !== "connected" || handle.wouldHoldEmit()) {
        throw new Error("Gateway is not connected.");
      }
      handle.emit("submit_interaction", {
        gameId,
        expectedVersion,
        submission,
        correlationId: correlationId(),
      });
    },
    [gameId],
  );
  const remoteStallRecovery = useCallback(
    (kind: "drop_player" | "skip_opponent_turn", _expectedVersion: number) => {
      const handle = handleRef.current;
      if (!handle || handle.getState().status !== "connected") {
        throw new Error("Gateway is not connected.");
      }
      handle.emit(kind, { gameId });
    },
    [gameId],
  );
  const remoteUndo: RemoteUndoFn = useCallback(
    (expectedVersion) => {
      const handle = handleRef.current;
      if (!handle || handle.getState().status !== "connected") {
        throw new Error("Gateway is not connected.");
      }
      handle.emit("execute_move", {
        gameId,
        expectedVersion,
        moveType: "undo",
        payload: {},
        correlationId: correlationId(),
      });
    },
    [gameId],
  );
  const getInteractionView = useCallback(() => latestViewRef.current?.interactionView, []);
  const getCanUndo = useCallback(
    () => !isRankedMatch && latestViewRef.current?.canUndo === true,
    [isRankedMatch],
  );
  const getAnimationPackets = useCallback(() => latestViewRef.current?.animationPackets ?? [], []);
  const getEngineLogRecords = useCallback(() => latestViewRef.current?.engineLogRecords ?? [], []);

  const requestLiveStateSync = useCallback((version: number) => {
    liveConnectionRef.current?.requestStateSyncIfDue(version);
  }, []);

  const handleLiveGatewayEvent = useCallback(
    (type: keyof ServerToClientEvents, payload: unknown) => {
      if (type === "drop_eligibility" && payload && typeof payload === "object") {
        const record = payload as { gameId?: string; dropEligibility?: DropEligibility };
        if (record.gameId === gameId && record.dropEligibility) {
          setDropEligibility(record.dropEligibility);
        }
      }
      if (type === "game_joined" && payload && typeof payload === "object") {
        const record = payload as { gameId?: string; dropEligibility?: DropEligibility };
        if (record.gameId === gameId && record.dropEligibility) {
          setDropEligibility(record.dropEligibility);
        }
      }
      if (type === "heartbeat_ack" && payload && typeof payload === "object") {
        const latestView = latestViewRef.current;
        const stateVersions = (payload as { stateVersions?: Record<string, number> }).stateVersions;
        const serverVersion = stateVersions?.[gameId];
        if (latestView && typeof serverVersion === "number" && serverVersion > latestView.version) {
          requestLiveStateSync(latestView.version);
        }
      }

      const message = parseLiveGatewayEvent(type, payload);
      if (!message) return;
      appendConnectionEvent(setConnectionEvents, {
        type: message.type,
        message: message.type === "gateway_error" ? message.message : undefined,
      });

      if (message.type === "move_rejected") {
        // eslint-disable-next-line no-console
        console.warn("[live-match] move rejected", message.reason ?? message.code);
      }
      if (message.type === "gateway_error") {
        setConnectionError(message.message ?? message.code ?? "Gateway error");
      }

      // Chat runs alongside the match-state reducer: history hydrates the
      // sidebar log on join, live messages append, and every message also
      // feeds the free-text policy reducer.
      if (message.type === "game_chat_history" && message.gameId === gameId) {
        setChatState((previous) => ({
          ...previous,
          ...reduceLiveChatPolicy(previous, message),
          messages: remoteChatMessagesForViewer(
            parseRemoteChatMessages(message.messages),
            playerId,
          ),
        }));
      } else if (message.type === "chat_message" && message.gameId === gameId) {
        setChatState((previous) => {
          const chatMessage = remoteChatMessageForViewer(message.message, playerId);
          const policy = reduceLiveChatPolicy(previous, message);
          if (!chatMessage) {
            return liveChatPolicyChanged(previous, policy) ? { ...previous, ...policy } : previous;
          }
          return {
            ...previous,
            ...policy,
            messages: mergeRemoteChatMessage(previous.messages, chatMessage),
          };
        });
      } else {
        setChatState((previous) => {
          const policy = reduceLiveChatPolicy(previous, message);
          return liveChatPolicyChanged(previous, policy) ? { ...previous, ...policy } : previous;
        });
      }

      const previousView = latestViewRef.current;
      if (!previousView) return;
      const effect = reduceLiveGatewayMessage(previousView, message, {
        gameId,
      });
      if (effect.type === "ignore") return;
      if (effect.type === "invalid_state") {
        setConnectionError(INVALID_LIVE_PROJECTION_MESSAGE);
        appendConnectionEvent(setConnectionEvents, {
          type: "invalid_state_payload",
          message: effect.reason,
        });
        // The connection provider rate-limits sync requests. Keeping the
        // last verified projection while asking for a fresh one avoids
        // both private-state rendering and a malformed-payload loop.
        requestLiveStateSync(0);
        return;
      }

      setConnectionError((current) =>
        current === INVALID_LIVE_PROJECTION_MESSAGE ? null : current,
      );
      latestViewRef.current = effect.view;
      // TEMP-DEBUG(gundam-hotpath): pushed-view mirror; remove after.
      (window as unknown as Record<string, unknown>).__pushedView = {
        at: new Date().toISOString(),
        type: effect.type,
        stateID: effect.view.state ? effect.view.state.stateID : null,
        ivStatus: effect.view.interactionView ? effect.view.interactionView.status : null,
        ivResolution: effect.view.interactionView
          ? Boolean(effect.view.interactionView.resolution)
          : null,
        ivActions: effect.view.interactionView
          ? (effect.view.interactionView.actions || []).map((a) => a.id)
          : null,
      };
      if (effect.type === "state" && effect.resyncInteractionView) {
        // The state advanced without a fresh interaction view — force a
        // full state_sync (version 0 omits stateVersion from the request,
        // so the server republishes state + view instead of answering
        // "up to date") to restore the published action set.
        requestLiveStateSync(0);
      }

      if (effect.type === "state" && effect.view.state) {
        if (runtimeRef.current && staticResourcesRef.current) {
          applyLiveProjectionUpdate(
            runtimeRef.current,
            staticResourcesRef.current,
            effect.view.state,
          );
        } else {
          const { runtime, staticResources } = createLiveProjectionViewerEngine(effect.view.state);
          runtimeRef.current = runtime;
          staticResourcesRef.current = staticResources;
        }
      }

      setLoadState((previous) => {
        if (previous.status === "error" || previous.status === "idle") return previous;
        const runtime = runtimeRef.current;
        const staticResources = staticResourcesRef.current;
        if (runtime && staticResources) {
          return { status: "ready", view: effect.view, runtime, staticResources };
        }
        return { ...previous, view: effect.view };
      });
    },
    [gameId, matchId, playerId, requestLiveStateSync, searchString],
  );

  const derivePresenceChat = useCallback(
    (change: NormalizedPresenceChange) => {
      if (change.playerId === playerId) {
        return;
      }
      let text: string | undefined;
      if (change.side === "spectator") {
        if (change.status === "connected") {
          text = m["sim.chat.presence.spectatorJoined"]();
        }
      } else {
        text =
          change.status === "connected"
            ? m["sim.chat.presence.opponentJoined"]()
            : m["sim.chat.presence.opponentLeft"]();
      }
      if (!text) {
        return;
      }
      setChatState((previous) => ({
        ...previous,
        messages: mergeRemoteChatMessage(previous.messages, {
          kind: "system",
          id: Date.now(),
          timestamp: Date.now(),
          text,
        }),
      }));
    },
    [playerId],
  );

  const sendRemoteChatPreset = useCallback(
    (presetKey: ChatPresetKey) => emitGatewayChatPreset(handleRef.current, gameId, presetKey),
    [gameId],
  );

  const sendRemoteChatText = useCallback(
    (text: string) => emitGatewayChatText(handleRef.current, gameId, text),
    [gameId],
  );

  // Free-text approval requests stay a stub (emit returns false) until inbox
  // handling exists — same policy as cyberpunk, so the live sidebar
  // hardcodes canRequestFreeText = false.
  const requestRemoteFreeTextChat = useCallback(
    () => emitGatewayFreeTextRequest(handleRef.current, gameId),
    [gameId],
  );

  const chatWiring = useMemo<GundamChatRemoteWiring>(
    () => ({
      remoteChatMessages: chatState.messages,
      canSendChat: true,
      remoteFreeTextEnabled: chatState.freeTextEnabled,
      remoteFreeTextProposalPending: chatState.freeTextProposalPending,
      canRequestFreeText: false,
      sendRemoteChatPreset,
      sendRemoteChatText,
      requestRemoteFreeTextChat,
    }),
    [chatState, sendRemoteChatPreset, sendRemoteChatText, requestRemoteFreeTextChat],
  );

  const handleLiveConnectionState = useCallback((s: SimulatorLiveConnectionContextValue) => {
    liveConnectionRef.current = s;
    setConnectionStatus(s.status);
    setConnectionId(s.connectionId);
    setConnectionAuthenticated(s.authenticated);
    setConnectionAuthStatus(s.authStatus);
    setConnectionAuthFailureReason(s.authFailureReason);
    setConnectionLatencyMs(s.latencyMs);
    setLastPingAt(s.lastPingAt);
    setLastPongAt(s.lastPongAt);
    setLastHeartbeatSentAt(s.lastHeartbeatSentAt);
    setLastHeartbeatAckAt(s.lastHeartbeatAckAt);
    setReconnectAttempt(s.reconnectAttempt);

    const prevStatus = previousConnectionStatusRef.current;
    if (s.status !== prevStatus) {
      if (s.status === "connected" && prevStatus !== "connected") {
        appendConnectionEvent(setConnectionEvents, {
          type: "connect",
          message: "Gateway socket connected",
          details: { socketId: s.connectionId ?? undefined },
        });
      }
      if (s.status === "reconnecting" && prevStatus !== "reconnecting") {
        appendConnectionEvent(setConnectionEvents, {
          type: "disconnect",
          message: "Gateway socket disconnected",
        });
      }
      previousConnectionStatusRef.current = s.status;
    }

    if (s.error && s.error !== previousConnectionErrorRef.current) {
      setConnectionError(s.error);
      appendConnectionEvent(setConnectionEvents, {
        type: "connect_error",
        message: s.error,
      });
    }
    previousConnectionErrorRef.current = s.error;
  }, []);

  const handleLiveDiagnostic = useCallback((event: ConnectionDiagnosticEvent) => {
    setConnectionEvents((current) => [...current, event].slice(-20));
  }, []);

  const buildLiveHeartbeatPayload = useCallback(() => {
    const view = latestViewRef.current;
    return {
      game: view ? { gameId, matchId, stateVersion: view.version } : undefined,
      activity: {
        idle: false,
        tabVisible: document.visibilityState !== "hidden",
      },
    };
  }, [gameId, matchId]);
  const liveConnectionTelemetrySink = useCallback<SimulatorConnectionTelemetrySink>((event) => {
    window.dispatchEvent(new CustomEvent("simulator:connection-telemetry", { detail: event }));
  }, []);

  useEffect(() => {
    const bootstrap = simulatorRoute.matchPageData;
    if (!matchId || !gameId || !playerId || !bootstrap) {
      setGatewayHandle(null);
      setLoadState({
        status: "error",
        message: "The server did not return an authorized match viewer.",
      });
      return;
    }

    const handle: GatewayHandle = acquireRootGatewayHandle("gundam");
    handleRef.current = handle;
    liveConnectionRef.current = null;
    previousConnectionStatusRef.current = null;
    previousConnectionErrorRef.current = null;
    setGatewayHandle(handle);
    setConnectionStatus("connecting");
    setConnectionError(null);
    setConnectionEvents([
      { at: new Date().toISOString(), type: "connect_start", message: "Opening Gundam gateway" },
    ]);
    const projectedState = parseGundamLiveProjection(bootstrap.game.view);
    const rejectedBootstrapProjection =
      bootstrap.game.view !== undefined && bootstrap.game.view !== null && projectedState === null;
    // Seed the overlay from the HTTP bootstrap; later game_joined/state_sync
    // cards maps widen it as cards are revealed.
    const bootstrapPresentation = readGundamPresentation(bootstrap.game.resources);
    // Restore the battle log from the HTTP bootstrap: a refresh must show the
    // accumulated history immediately, not only after the next gateway state
    // message happens to arrive.
    const bootstrapLogRecords = engineLogRecordsFromBootstrapHistory(bootstrap.history.engineLogs);
    const initialView: LiveMatchView = {
      ...createInitialLiveMatchView({ matchId, gameId, playerId }),
      version: bootstrap.game.stateVersion,
      state: projectedState,
      canUndo: bootstrap.game.undoable === true,
      ...(bootstrapPresentation ? { presentation: bootstrapPresentation } : {}),
      ...(bootstrap.game.interactionView
        ? { interactionView: bootstrap.game.interactionView as LiveMatchView["interactionView"] }
        : {}),
      ...(bootstrapLogRecords.length > 0 ? { engineLogRecords: bootstrapLogRecords } : {}),
    };
    latestViewRef.current = initialView;
    // Chat history is player-only in the bootstrap (spectator sessions omit
    // it); this page is always seated, so seeding here is safe.
    setChatState({
      messages: remoteChatMessagesForViewer(
        parseRemoteChatMessages(bootstrap.history.chatMessages ?? []),
        playerId,
      ),
      freeTextEnabled: bootstrap.history.freeTextEnabled === true,
      freeTextProposalPending: false,
    });
    if (rejectedBootstrapProjection) {
      setConnectionError(INVALID_LIVE_PROJECTION_MESSAGE);
      appendConnectionEvent(setConnectionEvents, {
        type: "invalid_state_payload",
        message: "Bootstrap state was not a privacy-filtered Gundam projection.",
      });
    }
    if (projectedState) {
      const { runtime, staticResources } = createLiveProjectionViewerEngine(projectedState);
      runtimeRef.current = runtime;
      staticResourcesRef.current = staticResources;
      setLoadState({ status: "ready", view: initialView, runtime, staticResources });
    } else {
      setLoadState({ status: "connecting", view: initialView });
    }

    return () => {
      if (handleRef.current === handle) handleRef.current = null;
      liveConnectionRef.current = null;
      runtimeRef.current = null;
      staticResourcesRef.current = null;
      latestViewRef.current = null;
      setGatewayHandle((current) => (current === handle ? null : current));
      handle.release();
    };
  }, [gameId, matchId, playerId, simulatorRoute.matchPageData]);

  useEffect(() => {
    startedAtMsRef.current = Date.now();
  }, [gameId, matchId, playerId]);

  useEffect(() => {
    if (loadState.status !== "ready" || !matchId || !gameId || !playerId) {
      return;
    }
    const matchUrl = buildDiscordRichPresenceMatchUrl(window.location.href);
    void updateDiscordPlayingGamePresence({
      clientId: discordClientId,
      exchangeAuthorizationCode: exchangeDiscordActivityCode,
      gameName: "Gundam Card Game",
      matchUrl,
      startedAtMs: startedAtMsRef.current,
    }).then((result) => {
      if (!result.ok && !result.skipped) {
        // eslint-disable-next-line no-console
        console.warn(
          "[discord-rich-presence] failed to update Gundam match presence",
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
  }, [discordClientId, gameId, loadState.status, matchId, playerId]);

  const content =
    loadState.status === "ready" ? (
      <LiveSimulatorShell
        runtime={loadState.runtime}
        staticResources={loadState.staticResources}
        viewerId={asViewerId(playerId)}
        presentation={loadState.view.presentation}
        remoteSubmit={remoteSubmit}
        remoteUndo={remoteUndo}
        remoteStallRecovery={remoteStallRecovery}
        dropEligibility={dropEligibility}
        getCanUndo={getCanUndo}
        getInteractionView={getInteractionView}
        getAnimationPackets={getAnimationPackets}
        getEngineLogRecords={getEngineLogRecords}
        autoPassEnabled
        ended={loadState.view.ended}
        connectionDiagnostic={connectionDiagnostic}
        chat={chatWiring}
      />
    ) : (
      <StatusShell
        title={loadState.status === "error" ? "Match unavailable" : "Loading match"}
        message={
          loadState.status === "error"
            ? loadState.message
            : "Waiting for the game server to send the initial state."
        }
        returnHref={getMatchmakingReturnUrl(searchString)}
      />
    );

  if (!gatewayHandle || !matchId || !gameId || !playerId || !simulatorRoute.matchPageData) {
    return content;
  }

  return (
    <SimulatorLiveConnectionProvider
      handle={gatewayHandle}
      bootstrap={simulatorRoute.matchPageData}
      buildHeartbeatPayload={buildLiveHeartbeatPayload}
      heartbeatIntervalMs={LIVE_MATCH_HEARTBEAT_INTERVAL_MS}
      onGameEvent={handleLiveGatewayEvent}
      onPresenceChange={derivePresenceChat}
      onDiagnostic={handleLiveDiagnostic}
      telemetrySink={liveConnectionTelemetrySink}
    >
      <GundamLiveConnectionBridge onState={handleLiveConnectionState} />
      {content}
    </SimulatorLiveConnectionProvider>
  );
}

function GundamLiveConnectionBridge({
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

function StatusShell({
  title,
  message,
  returnHref,
}: {
  readonly title: string;
  readonly message: string;
  readonly returnHref: string;
}) {
  return (
    <SimulatorRouteStatus
      title={title}
      message={message}
      action={
        <a className="underline" href={returnHref}>
          Back to matchmaking
        </a>
      }
    />
  );
}

interface LiveSimulatorShellProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ReturnType<typeof asViewerId>;
  readonly presentation?: GundamPresentation;
  readonly remoteSubmit: RemoteSubmitFn;
  readonly remoteUndo?: RemoteUndoFn;
  readonly remoteStallRecovery?: RemoteStallRecoveryFn;
  readonly dropEligibility?: DropEligibility | null;
  readonly getCanUndo?: () => boolean;
  readonly getInteractionView: () => LiveMatchView["interactionView"];
  readonly getAnimationPackets: () => LiveMatchView["animationPackets"];
  readonly getEngineLogRecords: () => LiveMatchView["engineLogRecords"];
  /** Replay uses this shell too, but must never submit an automatic move. */
  readonly autoPassEnabled?: boolean;
  readonly ended: { winnerId: string | null; reason: string | null } | null;
  readonly connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  readonly chat?: GundamChatRemoteWiring;
  readonly copyDiagnosticJson?: () => Promise<void>;
  readonly copyFeedback?: "copied" | "failed" | null;
}

export function LiveSimulatorShell({
  runtime,
  staticResources,
  viewerId,
  presentation,
  remoteSubmit,
  remoteUndo = () => undefined,
  remoteStallRecovery = () => undefined,
  dropEligibility = null,
  getCanUndo = () => false,
  getInteractionView,
  getAnimationPackets,
  getEngineLogRecords,
  autoPassEnabled = false,
  ended,
  connectionDiagnostic,
  chat,
  copyDiagnosticJson,
  copyFeedback,
}: LiveSimulatorShellProps) {
  const completeConnectionDiagnostic = useMemo<SimulatorConnectionDiagnostic | undefined>(
    () =>
      connectionDiagnostic ? buildSimulatorConnectionDiagnostic(connectionDiagnostic) : undefined,
    [connectionDiagnostic],
  );

  const matchTree = (
    <GundamBoardLayout
      chat={chat}
      connectionPanel={
        connectionDiagnostic && completeConnectionDiagnostic ? (
          <GundamConnectionPanel
            diagnostic={connectionDiagnostic}
            copyPayload={completeConnectionDiagnostic}
            viewerId={viewerId}
          />
        ) : undefined
      }
      connectionIndicator={
        connectionDiagnostic && completeConnectionDiagnostic ? (
          <GundamConnectionPanel
            diagnostic={connectionDiagnostic}
            copyPayload={completeConnectionDiagnostic}
            viewerId={viewerId}
            indicatorOnly
          />
        ) : undefined
      }
    >
      {dropEligibility &&
      isDropControlVisible(dropEligibility) &&
      (dropEligibility.reason === "disconnect_allowed" ||
        dropEligibility.reason === "disconnect_countdown" ||
        dropEligibility.reason === "disconnect_timestamp_missing") ? (
        <div className="pointer-events-none absolute inset-x-0 top-3 z-40 flex justify-center">
          <div className="pointer-events-auto">
            <DropClaimControl
              eligibility={dropEligibility}
              serverNowMs={dropEligibility.projectedAtMs}
              onClaim={() => {
                try {
                  remoteStallRecovery("drop_player", 0);
                } catch {
                  /* Connection chrome already reflects a down gateway. */
                }
              }}
              label="Drop"
              actionClassName={buttonVariants({ variant: "danger", size: "lg" })}
            />
          </div>
        </div>
      ) : null}
      <GameTable>
        <PlayerSeatContainer side="top" />
        <BattleStepRibbonContainer />
        <PlayerSeatContainer side="bottom" />

        <PromptContainer />
        <GundamPendingChoicePrompt />
        {autoPassEnabled ? <AutoPassActionStepContainer /> : null}
        <SetupPromptContainer />
        <AttackTargetingOverlayContainer />
        <CombatIntentOverlayContainer />
        <MatchOverviewModalContainer />
        <SubmitErrorToast />
      </GameTable>
    </GundamBoardLayout>
  );

  return (
    <LiveDropEligibilityProvider value={dropEligibility}>
      <LiveGundamGameProvider
        runtime={runtime}
        staticResources={staticResources}
        viewerId={viewerId}
        remoteSubmit={remoteSubmit}
        remoteUndo={remoteUndo}
        remoteStallRecovery={remoteStallRecovery}
        getCanUndo={getCanUndo}
        getInteractionView={getInteractionView}
        getAnimationPackets={getAnimationPackets}
        getEngineLogRecords={getEngineLogRecords}
        presentation={presentation}
      >
        {/*
        Must match SimulatorApp: AutoPassActionStepContainer and the sidebar
        preference control both read AutoPassWhenNoValidAction. Without this
        provider the context default stays ready=false, so live auto-pass for
        passBlock / passBattleAction / passActionStep never submits even when
        the shell mounts the container and no legal alternative exists.
      */}
        <AutoPassWhenNoValidActionProvider>
          <GundamSharedAnimationLayer runtime={runtime} live>
            <SubmitErrorProvider>
              <HintsProvider>
                <GundamInteractionDraftProvider>
                  <GundamTargetingProvider>
                    <DualModeProvider>
                      <CardInspectProvider>
                        <GundamDragDropProvider>
                          <GundamCardContextController>{matchTree}</GundamCardContextController>
                        </GundamDragDropProvider>
                        {copyDiagnosticJson ? (
                          <button
                            type="button"
                            className="fixed right-4 top-4 z-50 rounded-md border border-cyan-300/30 bg-slate-950/85 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cyan-100 shadow-lg transition-colors hover:bg-cyan-950/90"
                            onClick={copyDiagnosticJson}
                            aria-label="Copy connection diagnostic JSON"
                          >
                            {copyFeedback === "copied"
                              ? "Diagnostic copied"
                              : copyFeedback === "failed"
                                ? "Copy unavailable"
                                : "Copy diagnostic JSON"}
                          </button>
                        ) : null}
                        <CardInspectDialog />
                        {ended ? <EndedBanner ended={ended} /> : null}
                      </CardInspectProvider>
                    </DualModeProvider>
                  </GundamTargetingProvider>
                </GundamInteractionDraftProvider>
              </HintsProvider>
            </SubmitErrorProvider>
          </GundamSharedAnimationLayer>
        </AutoPassWhenNoValidActionProvider>
      </LiveGundamGameProvider>
    </LiveDropEligibilityProvider>
  );
}

function GundamConnectionPanel({
  diagnostic,
  copyPayload,
  viewerId,
  indicatorOnly = false,
}: {
  readonly diagnostic: SimulatorConnectionDiagnosticInput;
  readonly copyPayload: SimulatorConnectionDiagnostic;
  readonly viewerId: string;
  readonly indicatorOnly?: boolean;
}) {
  return (
    <ConnectionPanel
      embedded
      indicatorOnly={indicatorOnly}
      popoverAlign={indicatorOnly ? "end" : "start"}
      copyPayload={copyPayload}
      sides={[
        {
          side: "player",
          label: "You",
          playerId: viewerId,
          self: true,
          connection: {
            status: toPanelConnectionStatus(diagnostic.connection.status),
            latencyMs: diagnostic.connection.latencyMs,
            disconnectCount: diagnostic.connection.disconnectCount,
          },
        },
      ]}
      diagnostic={projectConnectionPanelDiagnostic(diagnostic)}
    />
  );
}

function toPanelConnectionStatus(
  status: SimulatorConnectionStatus,
): "connected" | "reconnecting" | "disconnected" {
  if (status === "connected") return "connected";
  if (status === "reconnecting" || status === "connecting" || status === "checking") {
    return "reconnecting";
  }
  return "disconnected";
}

function EndedBanner({
  ended,
}: {
  readonly ended: { winnerId: string | null; reason: string | null };
}) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-md bg-black/80 px-4 py-2 font-mono text-hud-sm text-hud-text">
      Match over · winner: {ended.winnerId ?? "n/a"}
      {ended.reason ? ` · ${ended.reason}` : ""}
    </div>
  );
}

/**
 * Field-by-field chat policy comparison — mirrors cyberpunk's
 * `isLiveChatPolicyChanged`. `reduceLiveChatPolicy` may return a fresh
 * object with identical values, so a reference check alone is not enough
 * to skip no-op state updates.
 */
function liveChatPolicyChanged(
  previous: { freeTextEnabled: boolean; freeTextProposalPending: boolean },
  next: { freeTextEnabled: boolean; freeTextProposalPending: boolean },
): boolean {
  return (
    previous.freeTextEnabled !== next.freeTextEnabled ||
    previous.freeTextProposalPending !== next.freeTextProposalPending
  );
}

function correlationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function gatewayEndpointDiagnostic() {
  const url = buildGatewaySocketIoUrl();
  try {
    const parsed = new URL(url);
    return {
      realtimeConfigured: true,
      origin: `${parsed.protocol}//${parsed.host}`,
      namespace: parsed.pathname,
      path: "/socket.io/",
      transport: "websocket",
    };
  } catch {
    return {
      realtimeConfigured: Boolean(url),
      origin: url || undefined,
      namespace: "/gundam",
      path: "/socket.io/",
      transport: "websocket",
    };
  }
}

function appendConnectionEvent(
  setEvents: Dispatch<SetStateAction<ConnectionDiagnosticEvent[]>>,
  event: Omit<ConnectionDiagnosticEvent, "at">,
): void {
  setEvents((current) => [...current, { at: new Date().toISOString(), ...event }].slice(-20));
}
