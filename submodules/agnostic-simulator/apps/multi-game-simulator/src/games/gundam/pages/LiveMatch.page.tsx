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
import {
  createLiveMatchSession,
  stringifySimulatorConnectionDiagnostic,
  type ConnectionDiagnosticEvent,
  type SimulatorConnectionStatus,
} from "@tcg/game-page-contract";
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
import { getGatewayManager } from "../../../lib/gateway/gateway-manager.ts";
import { useSimulatorRoute } from "../../../simulator/providers";
import { reduceLiveGatewayMessage } from "../src/engine/live/liveMessages.ts";
import {
  createInitialLiveMatchView,
  getMatchmakingReturnUrl,
  type LiveMatchView,
} from "../src/engine/live/matchContext.ts";
import { applyLiveStateUpdate, createLiveMatchViewerEngine } from "../src/engine/live/liveState.ts";
import { LiveGundamGameProvider } from "../src/engine/live/LiveGundamGameProvider.tsx";
import type { RemoteSubmitFn } from "../src/engine/live/remoteAdapter.ts";

import { HintsProvider } from "../src/lib/use-hints-enabled.ts";
import { useLayoutMode } from "../src/lib/use-layout-mode.ts";
import {
  AttackTargetingOverlayContainer,
  MatchOverviewModalContainer,
  PendingEffectsContainer,
  PlayerSeatContainer,
  PromptContainer,
  SetupPromptContainer,
  SubmitErrorProvider,
  GundamTargetingProvider,
} from "../src/components/containers/index.ts";
import { SubmitErrorToast } from "../src/components/ui/SubmitErrorToast.tsx";
import { CardHoverPreview } from "../src/components/ui/card/CardHoverPreview.tsx";
import { CardInspectProvider } from "../src/components/ui/card/card-inspect-context.tsx";
import { DualModeProvider } from "../src/components/ui/dual-mode-context.tsx";
import { PendingEffectSelectionProvider } from "../src/components/ui/pending-effect-selection-context.tsx";
import { CardInspectDialog } from "../src/components/ui/CardInspectDialogContainer.tsx";
import { GundamBoardLayout } from "../src/components/ui/GundamBoardLayout.tsx";
import { GameTable } from "../src/components/ui/GameTable.tsx";
import { FloatingUndoButton } from "../src/components/ui/FloatingUndoButton.tsx";
import { PriorityActionButton } from "../src/components/ui/PriorityActionButton.tsx";
import { asViewerId } from "../src/game/types.ts";

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
 * URL contract: query string carries the gateway credentials the
 * practice route already minted via quick-match (or, if the user is
 * authenticated, we fall back to `/v1/gateway/ticket`).
 *
 *   - `playerId` (required): the seat this browser controls
 *   - `ticket` and/or `authToken` (one required): gateway credential
 *   - `returnTo` (optional): where the "back to matchmaking" link goes
 *
 * Lifecycle:
 *   1. mount → open the gateway socket and `join_game` the supplied
 *      gameId. While waiting for the first `state_sync`, render a
 *      "connecting" status.
 *   2. first `state_sync` → build a `MatchRuntime` from the snapshot
 *      via {@link createLiveMatchViewerEngine}, transition to
 *      `ready`, and mount the full simulator tree pointed at that
 *      runtime through {@link LiveGundamGameProvider}.
 *   3. every later `state_sync` / `state_update` → call
 *      {@link applyLiveStateUpdate} which loads the new state into
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
  const playerId = search.get("playerId") ?? "";
  const initialTicket = search.get("ticket");
  const initialAuthToken = search.get("authToken");
  const searchString = useMemo(() => `?${search.toString()}`, [search]);

  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });
  const [connectionStatus, setConnectionStatus] = useState<SimulatorConnectionStatus>("checking");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionEvents, setConnectionEvents] = useState<ConnectionDiagnosticEvent[]>([]);
  const [copyFeedback, setCopyFeedback] = useState<"copied" | "failed" | null>(null);
  const handleRef = useRef<GatewayHandle | null>(null);
  const runtimeRef = useRef<MatchRuntime | null>(null);
  const staticResourcesRef = useRef<MatchStaticResources | null>(null);
  const latestViewRef = useRef<LiveMatchView | null>(null);
  const startedAtMsRef = useRef(Date.now());
  const discordClientId =
    import.meta.env.VITE_DISCORD_ACTIVITY_CLIENT_ID ?? import.meta.env.VITE_DISCORD_CLIENT_ID;
  const connectionDiagnosticJson = useMemo(
    () =>
      stringifySimulatorConnectionDiagnostic({
        gameSlug: "gundam",
        route:
          typeof window === "undefined"
            ? ""
            : `${window.location.pathname}${window.location.search}`,
        matchId,
        gameId,
        playerId,
        endpoint: gatewayEndpointDiagnostic(),
        connection: {
          status: connectionStatus,
          connectionId: connectionId ?? undefined,
          socketId: connectionId ?? undefined,
          authModeLabel: initialTicket
            ? "Authenticated (ticket)"
            : initialAuthToken
              ? "Authenticated (token)"
              : "Session",
          lastError: connectionError ?? undefined,
        },
        events: connectionEvents,
      }),
    [
      connectionError,
      connectionEvents,
      connectionId,
      connectionStatus,
      gameId,
      initialAuthToken,
      initialTicket,
      matchId,
      playerId,
    ],
  );

  async function copyDiagnosticJson(): Promise<void> {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        setCopyFeedback("failed");
        return;
      }
      await navigator.clipboard.writeText(connectionDiagnosticJson);
      setCopyFeedback("copied");
    } catch {
      setCopyFeedback("failed");
    }
  }

  // Stable callback for the remote adapter — the simulator UI calls
  // this for every move. Captures the latest handle from the ref so
  // reconnects don't need to re-wire the SimulatorApp tree.
  const remoteSubmit: RemoteSubmitFn = useCallback(
    (submission, expectedVersion) => {
      const handle = handleRef.current;
      if (!handle || handle.getState().status !== "connected") {
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
  const getInteractionView = useCallback(() => latestViewRef.current?.interactionView, []);

  // Open the gateway once we have the required URL params. Re-runs
  // on matchId/gameId/playerId change (e.g. navigating to a new
  // match in the same SPA session).
  useEffect(() => {
    if (!matchId || !gameId || !playerId) {
      setLoadState({
        status: "error",
        message: "Match URL is missing gameId or playerId.",
      });
      return;
    }

    // Acquire a handle on the SHARED gundam namespace socket (the root
    // clientLoader already holds one for presence and installed the
    // credentials controller). ref-count → 2; releasing this handle on
    // unmount leaves the root socket open across navigation. The root-socket
    // owns the ticket: SSR-resolved at load and refreshed on auth failure by
    // the library-owned credentials controller, so this page no longer
    // resolves or refreshes gateway tickets itself.
    const manager = getGatewayManager();
    const handle: GatewayHandle = manager.acquire("gundam");
    handleRef.current = handle;

    setConnectionStatus("connecting");
    setConnectionError(null);
    setConnectionEvents([
      { at: new Date().toISOString(), type: "connect_start", message: "Opening Gundam gateway" },
    ]);
    setLoadState({
      status: "connecting",
      view: createInitialLiveMatchView({ matchId, gameId, playerId }),
    });

    const handleEvent = (type: string, payload: unknown) => {
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

      setLoadState((previous) => {
        if (previous.status === "error" || previous.status === "idle") {
          return previous;
        }
        const effect = reduceLiveGatewayMessage(previous.view, message, {
          matchId,
          gameId,
          search: searchString,
        });
        if (effect.type === "redirect") {
          window.location.replace(effect.href);
          return previous;
        }
        if (effect.type === "ignore") return previous;
        latestViewRef.current = effect.view;

        // First state we've seen — bring up the runtime.
        if (previous.status === "connecting") {
          if (!effect.view.state) return previous;
          const { runtime, staticResources } = createLiveMatchViewerEngine(effect.view.state);
          runtimeRef.current = runtime;
          staticResourcesRef.current = staticResources;
          return {
            status: "ready",
            view: effect.view,
            runtime,
            staticResources,
          };
        }

        // Already ready — overlay onto the existing runtime so the
        // store's onStateUpdate listener triggers a render.
        if (effect.view.state && runtimeRef.current && staticResourcesRef.current) {
          applyLiveStateUpdate(runtimeRef.current, staticResourcesRef.current, effect.view.state);
        }
        return { ...previous, view: effect.view };
      });
    };

    // Single session call: owns join lifecycle, the presence map, latency
    // probes, and connection-state mirroring. The consumer wires its game
    // reducer (onGameEvent) and mirrors session state for UI. Gundam has no
    // session-owned heartbeat — the manager-level loop still runs if
    // configured, and clean-cut says don't add behavior that wasn't there.
    const session = createLiveMatchSession({
      handle,
      gameId,
      matchId,
      resolveRole: () => "player",
      resolveGameProfileId: () => undefined,
      onGameEvent: (event, payload) => handleEvent(event, payload),
    });

    session.start();

    // Mirror session-owned state into React state for rendering. The session
    // owns status/connectionId/error; the consumer only mirrors. Connection-
    // lifecycle diagnostic events (connect / disconnect / connect_error) are
    // derived from status transitions because the session forwards session-
    // level events (game_joined, presence_change, latency, ...) via
    // onDiagnostic, which Gundam's handleEvent already records per message.
    let prevStatus: SimulatorConnectionStatus | null = null;
    let prevError: string | null = null;

    const unsubSessionState = session.subscribeState((s) => {
      setConnectionStatus(s.status);
      setConnectionId(s.connectionId);

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
        prevStatus = s.status;
      }

      // Surface the live gateway error string (and a connect_error diagnostic)
      // only when the error changes — dedupes repeated state pushes.
      if (s.error && s.error !== prevError) {
        setConnectionError(s.error);
        appendConnectionEvent(setConnectionEvents, {
          type: "connect_error",
          message: s.error,
        });
      }
      prevError = s.error;
    });

    return () => {
      session.stop();
      unsubSessionState();
      if (handleRef.current === handle) handleRef.current = null;
      runtimeRef.current = null;
      staticResourcesRef.current = null;
      latestViewRef.current = null;
      // Release only THIS handle (ref-count → 1). The root keeps the shared
      // socket open across navigation.
      handle.release();
    };
  }, [gameId, matchId, playerId, searchString]);

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

  if (loadState.status === "ready") {
    return (
      <LiveSimulatorShell
        runtime={loadState.runtime}
        staticResources={loadState.staticResources}
        viewerId={asViewerId(playerId)}
        remoteSubmit={remoteSubmit}
        getInteractionView={getInteractionView}
        ended={loadState.view.ended}
        copyDiagnosticJson={copyDiagnosticJson}
        copyFeedback={copyFeedback}
      />
    );
  }

  return (
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
    <main className="min-h-screen grid place-items-center text-hud-text">
      <div className="font-mono text-center space-y-3 px-6">
        <div className="text-hud-xs tracking-hud-label text-hud-text-faint">LIVE MATCH</div>
        <div className="text-hud-lg font-bold">{title}</div>
        <div className="text-hud-sm text-hud-text-faint max-w-md">{message}</div>
        <a className="underline" href={returnHref}>
          Back to matchmaking
        </a>
      </div>
    </main>
  );
}

interface LiveSimulatorShellProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ReturnType<typeof asViewerId>;
  readonly remoteSubmit: RemoteSubmitFn;
  readonly getInteractionView: () => LiveMatchView["interactionView"];
  readonly ended: { winnerId: string | null; reason: string | null } | null;
  readonly copyDiagnosticJson: () => Promise<void>;
  readonly copyFeedback: "copied" | "failed" | null;
}

export function LiveSimulatorShell({
  runtime,
  staticResources,
  viewerId,
  remoteSubmit,
  getInteractionView,
  ended,
  copyDiagnosticJson,
  copyFeedback,
}: LiveSimulatorShellProps) {
  const layoutMode = useLayoutMode();
  const isMobile = layoutMode === "mobile";

  const matchTree = (
    <GundamBoardLayout>
      <GameTable>
        <PlayerSeatContainer side="top" />
        {!isMobile && (
          <div className="relative h-0">
            <div className="centerline -top-px" />
          </div>
        )}
        <PlayerSeatContainer side="bottom" />

        {!isMobile && <PriorityActionButton />}
        {!isMobile && <FloatingUndoButton />}

        <PromptContainer />
        <SetupPromptContainer />
        <AttackTargetingOverlayContainer />
        <PendingEffectsContainer />
        <MatchOverviewModalContainer />
        <SubmitErrorToast />
      </GameTable>
    </GundamBoardLayout>
  );

  return (
    <LiveGundamGameProvider
      runtime={runtime}
      staticResources={staticResources}
      viewerId={viewerId}
      remoteSubmit={remoteSubmit}
      getInteractionView={getInteractionView}
    >
      <SubmitErrorProvider>
        <HintsProvider>
          <GundamTargetingProvider>
            <PendingEffectSelectionProvider>
              <DualModeProvider>
                <CardInspectProvider>
                  {matchTree}
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
                  <CardHoverPreview />
                  <CardInspectDialog />
                  {ended ? <EndedBanner ended={ended} /> : null}
                </CardInspectProvider>
              </DualModeProvider>
            </PendingEffectSelectionProvider>
          </GundamTargetingProvider>
        </HintsProvider>
      </SubmitErrorProvider>
    </LiveGundamGameProvider>
  );
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
