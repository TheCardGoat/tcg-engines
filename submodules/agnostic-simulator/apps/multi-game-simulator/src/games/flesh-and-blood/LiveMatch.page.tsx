import { z } from "zod";
import { FabActionNotice } from "./FabActionNotice";
import { createLiveMatchSession, type LiveMatchSessionState } from "@tcg/game-page-contract";
import { useFabCardPresentation } from "./useFabCardPresentation";
import { FabMatchClock } from "./FabMatchClock";
import { readFabClock, fabRemainingMs } from "@tcg/flesh-and-blood-server-adapter/clock";
import { useFabPresentationRegistry } from "./FabPresentationCatalog";
import {
  resolveHostedInteraction,
  type HostedSubmissionOutcome,
} from "../../simulator/hosted-interaction";
import { FabPreparationPage } from "./FabPreparation.page";
import {
  SimulatorSidebarTip,
  SimulatorSidebarTips,
} from "../../simulator/participant-actions/SimulatorSidebarTips";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Group, Modal, Text } from "@mantine/core";
import {
  AnimationPlanV2Schema,
  buildInteractionSubmissionForActionId,
  validateInteractionSubmission,
  EngineInteractionView,
  type EngineInteractionView as EngineInteractionViewType,
  type InteractionSubmission,
} from "@tcg/protocol";
import {
  parseFabGameAnalyticsV2,
  type FabGameAnalyticsV2,
} from "@tcg/flesh-and-blood-server-adapter";
import {
  resolveInteractionText,
  SimulatorRouteStatus,
  type CardInteractionAction,
} from "@tcg/simulator-ui";

import { acquireRootGatewayHandle } from "../../lib/gateway/root-socket";
import { matchHistoryUrl } from "../../runtime/gameRuntimeApi";
import { useSimulatorRoute } from "../../simulator/providers";
import { matchReturnUrl } from "../../routes/match-return-url";
import { FabSpectatorNotice } from "./FabSpectatorNotice";
import {
  FabPriorityAutomationParticipantMenuItems,
  FabPriorityAutomationSettingsPanel,
  FleshAndBloodTabletop,
} from "./FleshAndBloodTabletop";
import type { FabAnimationTransition } from "./FleshAndBloodTabletop";
import {
  SimulatorOpponentParticipantActions,
  SimulatorParticipantConnectionStatus,
  SimulatorSelfParticipantActions,
} from "../../simulator/participant-actions";
import type { FabPresentationState } from "./state";
import {
  coerceFabPresentationState,
  isFabViewerResourcesShape,
  type FabViewerPresentationResources,
} from "./projection";
import {
  appendFabEngineLogRecords,
  useFabEventLog,
  useFabMatchHistory,
  type FabLiveEngineLogRecord,
} from "./use-fab-event-log";
import { FabPostGameSummary } from "./FabPostGameSummary";
import { downloadHostedReplay, saveHostedReplayOnDevice } from "../../runtime/replayActions";
import {
  createFabPostGameSummary,
  fabMatchSummaryFromAnalytics,
  fabPostGameBackendDataFromAnalytics,
} from "./FabPostGameSummary.model";
import {
  logFabLiveCommandResponse,
  logFabLiveCommandSent,
  logFabLiveCommandTimeout,
  logFabLiveStateSyncRequested,
  type FabLiveCommandRequest,
} from "./live-command-observability";

/** Gateway viewer resources plus the optional per-instance art overrides the platform may attach. */
type FabLiveViewerResources = FabViewerPresentationResources & {
  readonly matchArt?: Record<string, string>;
};

function parseFabViewerResources(raw: unknown): FabLiveViewerResources | undefined {
  if (!isFabViewerResourcesShape(raw)) return undefined;
  if (!("matchArt" in raw) || raw.matchArt === undefined) return raw;
  if (!isStringRecord(raw.matchArt)) return undefined;
  return { ...raw, matchArt: raw.matchArt };
}

function isStringRecord(raw: unknown): raw is Record<string, string> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return false;
  return Object.values(raw).every((value) => typeof value === "string");
}

function cardInstancesFromCardsMaps(raw: unknown): Record<string, string> | undefined {
  if (!raw || typeof raw !== "object" || !("cardInstances" in raw)) return undefined;
  const cardInstances = raw.cardInstances;
  if (!cardInstances || typeof cardInstances !== "object" || Array.isArray(cardInstances)) {
    return undefined;
  }
  return Object.values(cardInstances).every((value) => typeof value === "string")
    ? (cardInstances as Record<string, string>)
    : undefined;
}

function parseInteractionView(raw: unknown): EngineInteractionViewType | null {
  const parsed = EngineInteractionView.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

function parseFabGameAnalyticsEnvelope(raw: unknown): FabGameAnalyticsV2 | null {
  const candidate =
    raw && typeof raw === "object" && "game" in raw
      ? (raw as { readonly game: unknown }).game
      : raw;
  try {
    return parseFabGameAnalyticsV2(candidate);
  } catch {
    return null;
  }
}

export function fabCardActionsFromInteractionView(
  view: EngineInteractionViewType | null,
): readonly CardInteractionAction[] {
  if (!view) return [];
  return view.actions.flatMap((action) =>
    action.source?.kind === "card" && action.intent !== "custom"
      ? [
          {
            id: action.id,
            sourceEntityIds: [action.source.instanceId],
            label: resolveInteractionText(action.text),
            ...(!action.enabled
              ? {
                  disabledReason: action.disabledText
                    ? resolveInteractionText(action.disabledText)
                    : "Unavailable right now.",
                }
              : {}),
          },
        ]
      : [],
  );
}

export function fabConcedeActionIdFromInteractionView(
  view: EngineInteractionViewType | null,
  permitted: boolean,
): string | null {
  if (!view || !permitted) return null;
  return view.actions.find((action) => action.intent === "concede" && action.enabled)?.id ?? null;
}

/** Server-authoritative FAB surface; the browser never reduces or pushes match state. */
interface FabLiveSnapshot {
  gameId: string;
  resources?: unknown;
  presentation?: unknown;
  state?: unknown;
  stateVersion?: number;
  cardsMaps?: unknown;
  interactionView?: unknown;
  animationPlan?: unknown;
  correlationId?: string;
  engineLogs?: unknown;
}

type FabRecoveryStage = "checking" | "reconnecting" | "syncing" | "needs-help";
const TERMINAL_STATE_SYNC_ERROR_CODES = new Set([
  "game_not_found",
  "not_a_player",
  "spectator_scope_invalid",
]);

function recoveryStage(
  connection: LiveMatchSessionState | null,
  attempts: number,
  terminal: boolean,
): FabRecoveryStage {
  if (terminal || connection?.authStatus === "failed" || attempts >= 3) return "needs-help";
  if (!connection?.authenticated) return "reconnecting";
  if (!connection?.joined) return "syncing";
  return "checking";
}

function recoveryMessage(stage: FabRecoveryStage): string {
  switch (stage) {
    case "checking":
      return "Checking whether your last action was applied. Please do not submit it again.";
    case "reconnecting":
      return "Connection lost. Reconnecting to the match… Your actions are paused until the server confirms the board.";
    case "syncing":
      return "Synchronizing the match… Your board will show the authoritative state when this finishes.";
    case "needs-help":
      return "We could not confirm the match state yet. Please do not submit the action again; your actions remain paused so it is not submitted twice.";
  }
}

function supportReference(command: FabLiveCommandRequest | null): string {
  const value = command?.correlationId
    .replaceAll(/[^a-z0-9]/gi, "")
    .slice(-10)
    .toUpperCase();
  return `FAB-${value || "RECOVERY"}`;
}

function buildRecoverySupportDetails(input: {
  readonly command: FabLiveCommandRequest | null;
  readonly stateVersion: number;
  readonly stage: FabRecoveryStage;
}): string {
  return [
    "TCG Online Flesh and Blood live-match recovery",
    `Support reference: ${supportReference(input.command)}`,
    `UTC: ${new Date().toISOString()}`,
    `Last known state version: ${input.stateVersion}`,
    `Recovery stage: ${input.stage}`,
    "No card, deck, account, match, or credential data is included in this report.",
  ].join("\n");
}

function FabLiveRecoveryNotice({
  stage,
  command,
  detail,
  onRetry,
  onCopySupportDetails,
}: {
  readonly stage: FabRecoveryStage;
  readonly command: FabLiveCommandRequest | null;
  readonly detail: string | null;
  readonly onRetry: () => void;
  readonly onCopySupportDetails: () => void;
}) {
  const needsHelp = stage === "needs-help";
  return (
    <section
      className="fab-live-recovery-notice"
      data-testid="fab-live-recovery-notice"
      role="status"
      aria-live="polite"
    >
      <div>
        <strong>{needsHelp ? "Match needs attention" : "Synchronizing your match"}</strong>
        <p>{recoveryMessage(stage)}</p>
        {detail ? (
          <p className="fab-live-recovery-notice__detail">Latest update: {detail}</p>
        ) : null}
        {needsHelp ? (
          <p className="fab-live-recovery-notice__help">
            You can retry now, or use Support in your player menu and include reference{" "}
            {supportReference(command)}.
          </p>
        ) : null}
      </div>
      {needsHelp ? (
        <div className="fab-live-recovery-notice__actions">
          <button type="button" onClick={onRetry}>
            Retry now
          </button>
          <button type="button" onClick={onCopySupportDetails}>
            Copy support details
          </button>
          <button type="button" onClick={() => window.location.reload()}>
            Reload match
          </button>
        </div>
      ) : null}
    </section>
  );
}

export function LiveMatchPage() {
  const route = useSimulatorRoute();
  const session = route.session;
  const viewer = session?.viewer ?? route.matchPageData?.viewer;
  const viewerKey = viewer?.role === "player" ? `player:${viewer.actorId}` : "spectator";
  if (route.error) return <SimulatorRouteStatus title="Match unavailable" message={route.error} />;
  if (session) {
    switch (session.phase) {
      case "preparation":
        return <FabPreparationPage session={session} />;
      case "starting":
        return (
          <SimulatorRouteStatus
            title="Starting match"
            message="Waiting for preparation to finish. The game will appear automatically."
          />
        );
      case "cancelled":
        return <SimulatorRouteStatus title="Match cancelled" message={session.reason} />;
      case "playing":
      case "finished":
        return <LiveGamePage key={`${session.game.gameId}:${session.phase}:${viewerKey}`} />;
      default: {
        const exhaustive: never = session;
        throw new Error(`Unsupported session: ${String(exhaustive)}`);
      }
    }
  }
  return <LiveGamePage key={viewerKey} />;
}

const fabReversedActionSchema = z.object({
  kind: z.literal("rules-action-reversed"),
  action: z.enum(["play-card", "activate"]),
  reason: z.object({ message: z.string().trim().min(1) }),
});

function LiveGamePage() {
  const presentationRegistry = useFabPresentationRegistry();
  const latestPresentationState = useRef<unknown>(undefined);
  const route = useSimulatorRoute();
  const { matchId = "" } = useParams<{ matchId: string }>();
  const bootstrap = route.matchPageData;
  const gameId = bootstrap?.game.gameId;
  const actorId = bootstrap?.viewer.role === "player" ? bootstrap.viewer.actorId : null;
  const spectating = bootstrap?.viewer.role === "spectator";
  // The tabletop needs a bottom seat, not an authenticated actor. Spectator
  // state/resources have already been redacted by the server for BOTH seats.
  // Never use this presentation perspective to resolve or submit interactions.
  const viewerId = actorId ?? bootstrap?.match.participants[0]?.id ?? null;
  const viewerResourcesRef = useRef<FabLiveViewerResources | undefined>(
    parseFabViewerResources(bootstrap?.game.resources),
  );
  const acceptSnapshotRef = useRef<
    ((payload: FabLiveSnapshot, mode: FabAnimationTransition["mode"]) => void) | null
  >(null);
  const [state, setState] = useState<FabPresentationState | null>(() => {
    const resources = parseFabViewerResources(bootstrap?.game.resources);
    return coerceFabPresentationState(
      bootstrap?.game.view,
      viewerId,
      resources,
      presentationRegistry.getBundle()
        ? presentationRegistry.getSnapshot().bindings.printingIdByInstanceId
        : resources?.matchArt,
      presentationRegistry.getSnapshot().resolver,
    );
  });
  const gameEnded = Boolean(state?.result);
  const [clock, setClock] = useState(() => readFabClock(bootstrap?.game.view));
  const bootstrapRef = useRef(bootstrap);
  bootstrapRef.current = bootstrap;
  const [connection, setConnection] = useState<LiveMatchSessionState | null>(null);
  const [presence, setPresence] = useState(bootstrap?.presence.players ?? []);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (gameEnded) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(interval);
  }, [gameEnded]);
  const [stateVersion, setStateVersion] = useState(bootstrap?.game.stateVersion ?? 0);
  const presentationDefinitions = useMemo(
    () => Object.values(viewerResourcesRef.current?.cardDefinitions ?? {}),
    [stateVersion],
  );
  useFabCardPresentation(presentationDefinitions, String(stateVersion));
  useEffect(
    () =>
      presentationRegistry.subscribe(() => {
        const resources = viewerResourcesRef.current;
        const snapshot = presentationRegistry.getSnapshot();
        const projected = coerceFabPresentationState(
          latestPresentationState.current ?? bootstrap?.game.view,
          viewerId,
          resources,
          presentationRegistry.getBundle()
            ? snapshot.bindings.printingIdByInstanceId
            : resources?.matchArt,
          snapshot.resolver,
        );
        if (projected) setState(projected);
      }),
    [presentationRegistry, viewerId, bootstrap?.game.view],
  );
  const [interactionView, setInteractionView] = useState<EngineInteractionViewType | null>(() =>
    actorId ? parseInteractionView(bootstrap?.game.interactionView) : null,
  );
  const [animationTransition, setAnimationTransition] = useState<FabAnimationTransition | null>(
    null,
  );
  const [confirmingConcede, setConfirmingConcede] = useState(false);
  const [postGameAnalytics, setPostGameAnalytics] = useState<FabGameAnalyticsV2 | null>(null);
  const [matchAnalytics, setMatchAnalytics] = useState<readonly FabGameAnalyticsV2[]>([]);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [replayStatus, setReplayStatus] = useState<string | null>(null);
  const interactionRef = useRef(interactionView);
  const stateVersionRef = useRef(stateVersion);
  const inFlightRef = useRef<FabLiveCommandRequest | null>(null);
  const [pending, setPending] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const [terminalRecovery, setTerminalRecovery] = useState(false);
  const [interactionError, setInteractionError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const connectionReady = Boolean(connection?.authenticated && connection.joined);
  const canAct =
    connectionReady && bootstrap?.viewer.role === "player" && bootstrap.viewer.permissions.act;

  const requestAuthoritativeSync = useCallback(() => {
    if (!gameId) return;
    logFabLiveStateSyncRequested(gameId, inFlightRef.current ?? undefined);
    const handle = acquireRootGatewayHandle("flesh-and-blood");
    handle.emit("request_game_state_sync", { gameId });
    handle.release();
  }, [gameId]);

  const beginRecovery = useCallback(() => {
    setPending(true);
    setRecovering(true);
    setRecoveryAttempts(0);
    setTerminalRecovery(false);
  }, []);

  // Viewer-safe engine log records: bootstrap history plus live gateway
  // batches. Append-only via the pure accumulator, so the identity (and the
  // projection memo below) only changes when a batch lands.
  const [engineLogRecords, setEngineLogRecords] = useState<readonly FabLiveEngineLogRecord[]>(() =>
    appendFabEngineLogRecords([], bootstrap?.history?.engineLogs?.map((entry) => entry.data) ?? []),
  );

  useEffect(() => {
    if (!gameId || !bootstrapRef.current) return;
    const handle = acquireRootGatewayHandle("flesh-and-blood");
    const accept = (payload: FabLiveSnapshot, mode: FabAnimationTransition["mode"]) => {
      if (payload.gameId !== gameId) return;
      const version = payload.stateVersion;
      if (version == null || version < stateVersionRef.current) return;
      if (payload.presentation && !presentationRegistry.install(payload.presentation)) {
        beginRecovery();
        handle.emit("request_game_state_sync", { gameId });
        return;
      }
      // Resources are a viewer-safe snapshot, not an append-only cache. A reveal
      // can introduce a definition; a conceal can remove an instance mapping.
      const incomingResources = parseFabViewerResources(payload.resources);
      if (payload.resources != null && !incomingResources) {
        beginRecovery();
        interactionRef.current = null;
        setInteractionView(null);
        setInteractionError(
          "Match card data could not be synchronized. Retrying the authoritative snapshot.",
        );
        if (mode === "enqueue") {
          handle.emit("request_game_state_sync", { gameId });
        }
        return;
      }
      let nextResources = incomingResources
        ? {
            ...incomingResources,
            matchArt: incomingResources.matchArt ?? viewerResourcesRef.current?.matchArt,
          }
        : viewerResourcesRef.current;
      const incomingInstances = cardInstancesFromCardsMaps(payload.cardsMaps);
      if (!incomingResources && incomingInstances && nextResources) {
        nextResources = {
          ...nextResources,
          cardInstances: {
            ...nextResources.cardInstances,
            ...incomingInstances,
          },
        };
      }
      const next = coerceFabPresentationState(
        payload.state,
        viewerId,
        nextResources,
        presentationRegistry.getBundle()
          ? presentationRegistry.getSnapshot().bindings.printingIdByInstanceId
          : nextResources?.matchArt,
        presentationRegistry.getSnapshot().resolver,
      );
      if (!next) {
        setRecovering(true);
        setInteractionError(
          "Match state could not be synchronized. Retrying the authoritative snapshot.",
        );
        if (mode === "enqueue") handle.emit("request_game_state_sync", { gameId });
        return;
      }
      latestPresentationState.current = payload.state;
      viewerResourcesRef.current = nextResources;
      if (nextResources)
        void presentationRegistry.ensure(Object.values(nextResources.cardDefinitions));
      setEngineLogRecords((current) => appendFabEngineLogRecords(current, payload.engineLogs));
      stateVersionRef.current = version;
      setState(next);
      setClock(readFabClock(payload.state));
      setStateVersion(version);
      const inFlight = inFlightRef.current;
      if (
        inFlight &&
        (mode === "sync" ||
          version > inFlight.expectedVersion ||
          payload.correlationId === inFlight.correlationId)
      ) {
        inFlightRef.current = null;
        setPending(false);
        setRecovering(false);
        setRecoveryAttempts(0);
        setTerminalRecovery(false);
      }
      setAnimationTransition({
        version,
        correlationId: payload.correlationId ?? `flesh-and-blood:server:${version}`,
        plan:
          mode === "enqueue"
            ? (AnimationPlanV2Schema.safeParse(payload.animationPlan).data ?? null)
            : null,
        mode,
      });
      const interaction = resolveHostedInteraction({
        terminal: Boolean(next.result),
        viewerId: actorId,
        version,
        interaction: payload.interactionView,
      });
      interactionRef.current = interaction.view;
      setInteractionView(interaction.view);
      switch (interaction.kind) {
        case "terminal":
          inFlightRef.current = null;
          setPending(false);
          setRecovering(false);
          setRecoveryAttempts(0);
          setTerminalRecovery(false);
          setConfirmingConcede(false);
          setActionError(null);
          setInteractionError(null);
          break;
        case "spectating":
        case "ready":
          if (mode === "sync") {
            setPending(false);
            setRecovering(false);
            setRecoveryAttempts(0);
            setTerminalRecovery(false);
          }
          setInteractionError(null);
          break;
        case "resync":
          beginRecovery();
          setInteractionError(
            "Match actions could not be synchronized. Retrying the authoritative snapshot.",
          );
          if (mode === "enqueue") {
            handle.emit("request_game_state_sync", { gameId });
          }
          break;
        default: {
          const exhaustive: never = interaction;
          return exhaustive;
        }
      }
    };
    acceptSnapshotRef.current = accept;
    const unsubscribers = [
      handle.on("game_joined", (payload) => {
        if (payload.gameId !== gameId) return;
        setPresence(payload.players);
        accept(payload, "sync");
      }),
      handle.on("presence_change", (payload) => {
        if (payload.gameId !== gameId) return;
        setPresence((current) => [
          ...current.filter((player) => player.id !== payload.playerId),
          {
            id: payload.playerId,
            connected: payload.status === "connected",
            disconnectedAt: payload.status !== "connected" ? payload.disconnectedAt : undefined,
          },
        ]);
      }),
      handle.on("gateway_error", (payload) => {
        setInteractionError(payload.message);
        if (TERMINAL_STATE_SYNC_ERROR_CODES.has(payload.code)) {
          setActionError(null);
          setPending(true);
          setRecovering(true);
          setRecoveryAttempts(3);
          setTerminalRecovery(true);
          interactionRef.current = null;
          setInteractionView(null);
        } else if (payload.code === "viewer_scope_expired") {
          beginRecovery();
        }
      }),
      handle.on("state_sync", (payload) => {
        logFabLiveCommandResponse("state_sync", payload, inFlightRef.current ?? undefined);
        accept(payload, "sync");
      }),
      handle.on("state_update", (payload) => accept(payload, "enqueue")),
      // The actor-composed reply carries this viewer's private log lines
      // merged in; the accumulator prefers it over the public broadcast copy.
      handle.on("move_accepted", (payload) => {
        if (payload.gameId !== gameId) return;
        logFabLiveCommandResponse("accepted", payload, inFlightRef.current ?? undefined);
        // The actor acknowledgement is itself a complete viewer-safe snapshot.
        // Consuming it avoids depending on a second room broadcast for recovery.
        accept(payload, "enqueue");
        if (payload.actorId === actorId) {
          const reversed = fabReversedActionSchema.safeParse(payload.outcome);
          if (reversed.success)
            setActionError(`${reversed.data.reason.message} Nothing was spent.`);
        }
        setEngineLogRecords((current) => appendFabEngineLogRecords(current, payload.engineLogs));
      }),
      handle.on("game_recent_history", (payload) => {
        if (payload.gameId !== gameId) return;
        setEngineLogRecords((current) => appendFabEngineLogRecords(current, payload.engineLogs));
      }),
      handle.on("move_rejected", (payload) => {
        if (payload.gameId !== gameId) return;
        if (
          inFlightRef.current &&
          payload.correlationId &&
          payload.correlationId !== inFlightRef.current.correlationId
        )
          return;
        logFabLiveCommandResponse("rejected", payload, inFlightRef.current ?? undefined);
        beginRecovery();
        interactionRef.current = null;
        setInteractionView(null);
        setActionError(payload.reason || "The action was rejected. Synchronizing the match.");
        logFabLiveStateSyncRequested(gameId, inFlightRef.current ?? undefined);
        handle.emit("request_game_state_sync", { gameId });
      }),
    ];
    const liveSession = createLiveMatchSession({
      handle,
      bootstrap: bootstrapRef.current,
      onGameEvent: () => {}, // Typed game reducers above own FAB snapshots.
      buildHeartbeatPayload: () => ({
        game: { gameId, matchId, stateVersion: stateVersionRef.current },
        activity: { idle: false, tabVisible: document.visibilityState !== "hidden" },
      }),
      heartbeatIntervalMs: 15_000,
    });
    unsubscribers.push(liveSession.subscribeState(setConnection));
    liveSession.start();
    return () => {
      acceptSnapshotRef.current = null;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      liveSession.stop();
      handle.release();
    };
  }, [gameId, matchId, viewerId, actorId, presentationRegistry, beginRecovery]);

  useEffect(() => {
    if (!bootstrap || bootstrap.game.stateVersion < stateVersionRef.current) return;
    acceptSnapshotRef.current?.(
      {
        gameId: bootstrap.game.gameId,
        state: bootstrap.game.view,
        resources: bootstrap.game.resources,
        presentation: bootstrap.game.presentation,
        stateVersion: bootstrap.game.stateVersion,
        interactionView: bootstrap.game.interactionView,
      },
      "sync",
    );
  }, [bootstrap]);

  useEffect(() => {
    if (!recovering || !gameId || terminalRecovery || recoveryAttempts >= 3) return;
    const retry = window.setInterval(() => {
      setRecoveryAttempts((attempts) => {
        if (attempts >= 3) return attempts;
        requestAuthoritativeSync();
        return attempts + 1;
      });
    }, 5_000);
    return () => window.clearInterval(retry);
  }, [recovering, gameId, terminalRecovery, recoveryAttempts, requestAuthoritativeSync]);

  useEffect(() => {
    if (!actorId || !gameId || !state?.result) return;
    let cancelled = false;
    const load = async () => {
      const gameIds = bootstrap?.match.gameIds ?? [gameId];
      const loaded = await Promise.all(
        gameIds.map(async (id) => {
          const response = await fetch(
            matchHistoryUrl("flesh-and-blood", `/games/${encodeURIComponent(id)}/post-game`),
            { credentials: "include", headers: { Accept: "application/json" } },
          );
          if (!response.ok) return null;
          const envelope = (await response.json()) as {
            readonly postGame?: { readonly analytics?: unknown } | null;
            readonly analytics?: { readonly payload?: unknown };
          };
          return (
            parseFabGameAnalyticsEnvelope(envelope.postGame?.analytics) ??
            parseFabGameAnalyticsEnvelope(envelope.analytics?.payload)
          );
        }),
      );
      if (cancelled) return;
      const analytics = loaded.filter((game): game is FabGameAnalyticsV2 => game !== null);
      setMatchAnalytics(analytics);
      setPostGameAnalytics(analytics.find((game) => game.gameId === gameId) ?? null);
    };
    void load().catch(() => {
      // The authoritative result remains visible if analytics are unavailable.
    });
    return () => {
      cancelled = true;
    };
  }, [actorId, bootstrap?.match.gameIds, gameId, state?.result]);

  useEffect(() => {
    if (!pending || !gameId || terminalRecovery) return;
    const timeout = window.setTimeout(() => {
      const command = inFlightRef.current;
      if (!command) return;
      logFabLiveCommandTimeout(command);
      // Keep the last confirmed board and interaction visible, but keep it
      // read-only until the server returns an authoritative snapshot.
      beginRecovery();
      setInteractionError(
        "The action has not been confirmed. Synchronizing the match before you can act again.",
      );
      requestAuthoritativeSync();
    }, 10_000);
    return () => window.clearTimeout(timeout);
  }, [pending, gameId, terminalRecovery, beginRecovery, requestAuthoritativeSync]);

  const submitInteraction = useCallback(
    (submission: InteractionSubmission): HostedSubmissionOutcome => {
      const view = interactionRef.current;
      if (inFlightRef.current)
        return {
          kind: "blocked",
          reason: "Wait for the current action to be confirmed, then try again.",
        };
      if (!connectionReady || !gameId || !actorId || !view)
        return {
          kind: "blocked",
          reason: "Match actions are synchronizing. Try again when the connection recovers.",
        };
      if (view.actorId !== actorId || view.stateVersion !== stateVersionRef.current)
        return { kind: "blocked", reason: "Match actions are synchronizing. Please try again." };
      const validation = validateInteractionSubmission(view, submission);
      if (!validation.ok) return { kind: "blocked", reason: "This action is no longer available." };
      const permitted =
        validation.action.intent === "concede" ? bootstrap?.viewer.permissions.concede : canAct;
      if (!permitted)
        return { kind: "blocked", reason: "You do not have permission to perform this action." };
      const correlationId = crypto.randomUUID();
      const command: FabLiveCommandRequest = {
        gameId,
        matchId,
        actorId,
        expectedVersion: submission.stateVersion,
        correlationId,
        submission,
      };
      inFlightRef.current = command;
      setPending(true);
      setRecovering(false);
      setRecoveryAttempts(0);
      setTerminalRecovery(false);
      setActionError(null);
      setInteractionError(null);
      const handle = acquireRootGatewayHandle("flesh-and-blood");
      logFabLiveCommandSent(command);
      handle.emit("submit_interaction", {
        gameId,
        expectedVersion: submission.stateVersion,
        submission,
        correlationId,
      });
      handle.release();
      return { kind: "submitted" };
    },
    [connectionReady, gameId, actorId, canAct, bootstrap?.viewer.permissions.concede],
  );
  const submitAction = useCallback(
    (actionId: string): HostedSubmissionOutcome => {
      const view = interactionRef.current;
      if (!view)
        return { kind: "blocked", reason: "Match actions are synchronizing. Please try again." };
      const submission = buildInteractionSubmissionForActionId({ view, actionId });
      return submission
        ? submitInteraction(submission)
        : { kind: "blocked", reason: "This action is no longer available." };
    },
    [submitInteraction],
  );

  const cardActions = useMemo(
    () => fabCardActionsFromInteractionView(interactionView),
    [interactionView],
  );
  const seatIds = useMemo(
    () => bootstrap?.match.participants.map((participant) => participant.id) ?? [],
    [bootstrap],
  );
  const eventLog = useFabEventLog({ records: engineLogRecords, viewerId, seatIds });
  const matchHistory = useFabMatchHistory({
    records: engineLogRecords,
    viewerId,
    seatIds,
    firstTurnPlayerId: state?.firstTurnPlayerId,
  });
  const canConcede =
    connectionReady && bootstrap?.viewer.role === "player" && bootstrap.viewer.permissions.concede;
  const concedeActionId = fabConcedeActionIdFromInteractionView(interactionView, canConcede);

  const confirmConcede = useCallback(() => {
    const currentActionId = fabConcedeActionIdFromInteractionView(
      interactionRef.current,
      canConcede,
    );
    const outcome = currentActionId
      ? submitAction(currentActionId)
      : {
          kind: "blocked" as const,
          reason: "Match actions are synchronizing. Please try again.",
        };
    if (outcome.kind === "submitted") setConfirmingConcede(false);
    else setInteractionError(outcome.reason);
  }, [canConcede, submitAction]);

  if (route.error) return <SimulatorRouteStatus title="Match unavailable" message={route.error} />;
  if (!bootstrap || !gameId || !viewerId || !state) {
    return (
      <SimulatorRouteStatus
        title="Loading Flesh and Blood match"
        message="Connecting to the match server."
      />
    );
  }

  const selfParticipant = bootstrap.match.participants.find(
    (participant) => participant.id === viewerId,
  );
  const opponentParticipant = bootstrap.match.participants.find(
    (participant) => participant.id !== viewerId,
  );
  const opponentPresence = opponentParticipant
    ? presence.find((presence) => presence.id === opponentParticipant.id)
    : undefined;
  const disconnectedAt = opponentPresence?.disconnectedAt
    ? Date.parse(opponentPresence.disconnectedAt)
    : NaN;
  const disconnectRemaining = Math.max(0, Math.ceil((30_000 - (now - disconnectedAt)) / 1000));
  const canDropDisconnected =
    opponentPresence?.connected === false &&
    Number.isFinite(disconnectedAt) &&
    disconnectRemaining === 0;
  const canDropTimedOut = Boolean(
    clock &&
    opponentParticipant &&
    clock.clockState[opponentParticipant.id] &&
    fabRemainingMs(clock, opponentParticipant.id, now) <= -clock.timeControl.config.graceMs,
  );
  const selfClockRemaining =
    clock?.clockState[viewerId] === undefined ? null : fabRemainingMs(clock, viewerId, now);
  const opponentClockRemaining =
    !clock || !opponentParticipant || clock.clockState[opponentParticipant.id] === undefined
      ? null
      : fabRemainingMs(clock, opponentParticipant.id, now);
  const selfClockExpired = selfClockRemaining !== null && selfClockRemaining <= 0;
  const opponentClockExpired = opponentClockRemaining !== null && opponentClockRemaining <= 0;
  const timeoutGraceRemaining = (remaining: number | null) =>
    remaining === null || !clock
      ? 0
      : Math.max(0, Math.ceil((clock.timeControl.config.graceMs + remaining) / 1_000));
  const claimDrop = () => {
    const handle = acquireRootGatewayHandle("flesh-and-blood");
    handle.emit("drop_player", { gameId });
    handle.release();
  };
  const participantPresentation = spectating
    ? Object.fromEntries(
        bootstrap.match.participants.map((participant) => [
          participant.id,
          {
            connection: (
              <SimulatorParticipantConnectionStatus
                displayName={participant.displayName}
                status={
                  presence.find((player) => player.id === participant.id)?.connected === true
                    ? "connected"
                    : presence.find((player) => player.id === participant.id)?.connected === false
                      ? "disconnected"
                      : "unknown"
                }
              />
            ),
            displayName: participant.displayName,
            subscriptionTier: participant.subscriptionTier,
          },
        ]),
      )
    : {
        ...(selfParticipant
          ? {
              [selfParticipant.id]: {
                clock: (
                  <FabMatchClock
                    clock={clock}
                    playerId={selfParticipant.id}
                    label="You"
                    now={now}
                  />
                ),
                displayName: selfParticipant.displayName,
                subscriptionTier: selfParticipant.subscriptionTier,
                rankedMmr:
                  bootstrap.match.matchType === "ranked" &&
                  selfParticipant.rankedPlacementComplete === true
                    ? selfParticipant.mmrAtMatch
                    : undefined,
                actions: (
                  <SimulatorSidebarTip id="support">
                    <SimulatorSelfParticipantActions
                      matchMenuItems={(close) => (
                        <FabPriorityAutomationParticipantMenuItems onComplete={close} />
                      )}
                      gameConfiguration={{
                        settings: <FabPriorityAutomationSettingsPanel />,
                        title: "Open Flesh and Blood configuration?",
                        description:
                          "Opening game configuration leaves the current match and returns to simulator setup.",
                        confirmLabel: "Open configuration",
                        onSelect: () =>
                          window.location.assign("/flesh-and-blood/simulator/play/practice"),
                      }}
                      support={{
                        source: "flesh-and-blood-live-participant-menu",
                        gameSlug: "flesh-and-blood",
                        matchId,
                        gameId,
                      }}
                    />
                  </SimulatorSidebarTip>
                ),
              },
            }
          : {}),
        ...(opponentParticipant
          ? {
              [opponentParticipant.id]: {
                clock: (
                  <FabMatchClock
                    clock={clock}
                    playerId={opponentParticipant.id}
                    label="Opponent"
                    now={now}
                  />
                ),
                displayName: opponentParticipant.displayName,
                subscriptionTier: opponentParticipant.subscriptionTier,
                rankedMmr:
                  bootstrap.match.matchType === "ranked" &&
                  opponentParticipant.rankedPlacementComplete === true
                    ? opponentParticipant.mmrAtMatch
                    : undefined,
                connection:
                  opponentPresence?.connected === undefined ? undefined : (
                    <SimulatorParticipantConnectionStatus
                      displayName={opponentParticipant.displayName}
                      status={opponentPresence.connected ? "connected" : "disconnected"}
                    />
                  ),
                actions: opponentParticipant.isBot ? undefined : (
                  <SimulatorSidebarTip id="opponent">
                    <SimulatorOpponentParticipantActions
                      participant={{
                        kind: "human",
                        gameProfileId: opponentParticipant.id,
                        userId: opponentParticipant.userId,
                        displayName: opponentParticipant.displayName,
                        connected: opponentPresence?.connected,
                      }}
                      match={{ matchId, gameId, gameSlug: "flesh-and-blood" }}
                    />
                  </SimulatorSidebarTip>
                ),
              },
            }
          : {}),
      };
  const postGameSummary =
    !spectating && state.result && postGameAnalytics
      ? (() => {
          const opponentId = state.players.find((playerId) => playerId !== viewerId) ?? viewerId;
          const backend = fabPostGameBackendDataFromAnalytics(postGameAnalytics, state, viewerId);
          return createFabPostGameSummary({
            presentation: state,
            viewerId,
            participantLabel: (playerId) =>
              bootstrap.match.participants.find((participant) => participant.id === playerId)
                ?.displayName ?? playerId,
            participantSubscriptionTier: (playerId) =>
              bootstrap.match.participants.find((participant) => participant.id === playerId)
                ?.subscriptionTier,
            sessionFormatLabel: "Hosted match",
            backend: {
              ...backend,
              match: fabMatchSummaryFromAnalytics(matchAnalytics, viewerId, opponentId),
            },
          });
        })()
      : null;
  const result = state.result;
  const spectatorResultLabel =
    result?.kind === "win"
      ? `${bootstrap.match.participants.find((participant) => participant.id === result.winnerId)?.displayName ?? "Winner"} wins`
      : "Game ended";
  const recoveryActive =
    recovering || Boolean(connection && (!connection.authenticated || !connection.joined));
  const activeRecoveryStage = recoveryStage(connection, recoveryAttempts, terminalRecovery);
  const retryRecovery = () => {
    beginRecovery();
    requestAuthoritativeSync();
  };
  const copyRecoverySupportDetails = () => {
    const details = buildRecoverySupportDetails({
      command: inFlightRef.current,
      stateVersion: stateVersionRef.current,
      stage: activeRecoveryStage,
    });
    void navigator.clipboard?.writeText(details).catch(() => {
      setInteractionError("Could not copy support details. Please use Support in the player menu.");
    });
  };

  return (
    <>
      <SimulatorSidebarTips enabled={!state.result && !confirmingConcede}>
        {(actionError || interactionError) && !recoveryActive ? (
          <FabActionNotice
            title="Action could not be completed"
            message={actionError ?? interactionError ?? ""}
            onDismiss={() => {
              setActionError(null);
              setInteractionError(null);
            }}
          />
        ) : null}
        <FleshAndBloodTabletop
          matchNotice={
            !gameEnded && recoveryActive ? (
              <FabLiveRecoveryNotice
                stage={activeRecoveryStage}
                command={inFlightRef.current}
                detail={actionError ?? interactionError}
                onRetry={retryRecovery}
                onCopySupportDetails={copyRecoverySupportDetails}
              />
            ) : !spectating && !gameEnded && selfClockExpired ? (
              <div role="status">
                <Text size="sm">
                  {timeoutGraceRemaining(selfClockRemaining) > 0
                    ? `Your time expired. Grace period: ${timeoutGraceRemaining(selfClockRemaining)}s remaining.`
                    : "Your time expired. Your opponent can claim the win."}
                </Text>
              </div>
            ) : !spectating &&
              !gameEnded &&
              opponentParticipant &&
              !opponentParticipant.isBot &&
              (opponentClockExpired || opponentPresence?.connected === false) ? (
              <div role="status">
                <Text size="sm">
                  {canDropTimedOut
                    ? "Opponent timed out."
                    : opponentClockExpired
                      ? `Opponent's time expired. Claim available in ${timeoutGraceRemaining(opponentClockRemaining)}s.`
                      : canDropDisconnected || !Number.isFinite(disconnectedAt)
                        ? "Opponent disconnected."
                        : `Opponent disconnected. Claim available in ${disconnectRemaining}s.`}
                </Text>
                <Button
                  disabled={!canAct || (!canDropDisconnected && !canDropTimedOut)}
                  onClick={claimDrop}
                >
                  Claim win
                </Button>
              </div>
            ) : undefined
          }
          pending={pending || recoveryActive}
          readOnly={!canAct || recoveryActive}
          readOnlyLabel={spectating ? "Spectating · read only" : undefined}
          activityLogLabel={spectating ? "Spectating" : undefined}
          matchActions={
            spectating ? (
              <FabSpectatorNotice displayName={selfParticipant?.displayName ?? "First player"} />
            ) : undefined
          }
          spectatorReturnHref={
            spectating ? matchReturnUrl("flesh-and-blood", window.location.search) : undefined
          }
          sessionKey={`flesh-and-blood:live:${gameId}:${viewerId}`}
          state={state}
          animationVersion={stateVersion}
          animationTransition={animationTransition}
          viewerId={viewerId}
          legalCommands={[]}
          cardActions={cardActions}
          onCardAction={
            actorId
              ? (actionId) => {
                  const outcome = submitAction(actionId);
                  if (outcome.kind === "blocked") setActionError(outcome.reason);
                }
              : undefined
          }
          interactionView={interactionView}
          onSubmitInteraction={actorId ? submitInteraction : undefined}
          participantPresentation={participantPresentation}
          eventLog={eventLog}
          matchHistory={matchHistory}
          confirmConcede={false}
          onConcede={concedeActionId ? () => setConfirmingConcede(true) : undefined}
          onOpenGameSummary={state.result && !summaryOpen ? () => setSummaryOpen(true) : undefined}
        />
      </SimulatorSidebarTips>
      {postGameSummary && summaryOpen ? (
        <FabPostGameSummary
          summary={postGameSummary}
          onWatchReplay={() =>
            window.location.assign(
              `/flesh-and-blood/simulator/replay/${encodeURIComponent(gameId)}`,
            )
          }
          onSaveReplay={() => {
            if (!gameId) return;
            setReplayStatus("Saving replay…");
            void saveHostedReplayOnDevice("flesh-and-blood", gameId).then(
              () => setReplayStatus("Saved on this device. Browser storage has no set expiry."),
              () => setReplayStatus("Could not save on this device. Download the replay instead."),
            );
          }}
          onDownloadReplay={() => {
            if (!gameId) return;
            setReplayStatus("Preparing download…");
            void downloadHostedReplay("flesh-and-blood", gameId).then(
              () => setReplayStatus("Replay downloaded."),
              () => setReplayStatus("Replay download failed."),
            );
          }}
          replayStatus={replayStatus}
          onInspectBoard={() => setSummaryOpen(false)}
          onMainMenu={() => window.location.assign("/flesh-and-blood/simulator/")}
          onPlayAgain={() => window.location.assign("/flesh-and-blood/matchmaking")}
        />
      ) : null}
      <Modal
        opened={Boolean(state.result) && !postGameSummary && summaryOpen}
        onClose={() => setSummaryOpen(false)}
        centered
        title={
          state.result?.kind === "draw"
            ? "Draw"
            : spectating
              ? spectatorResultLabel
              : state.result?.kind === "win" && state.result.winnerId === viewerId
                ? "Victory"
                : "Defeat"
        }
      >
        <Text size="sm">The game has ended.</Text>
        <Button
          variant="default"
          onClick={() =>
            window.location.assign(
              `/flesh-and-blood/simulator/replay/${encodeURIComponent(gameId)}`,
            )
          }
        >
          Watch replay
        </Button>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={() => setSummaryOpen(false)}>
            Inspect board
          </Button>
          <Button onClick={() => window.location.assign("/flesh-and-blood/simulator/")}>
            Main menu
          </Button>
        </Group>
      </Modal>
      <Modal
        opened={confirmingConcede && !gameEnded}
        onClose={() => setConfirmingConcede(false)}
        centered
        title="Concede match?"
        classNames={{ close: "fab-concede-confirm-close" }}
      >
        <Text size="sm">This ends the match as a loss and cannot be undone.</Text>
        {interactionError ? <Text role="alert">{interactionError}</Text> : null}
        <Group justify="flex-end" mt="lg" className="fab-concede-confirm-actions">
          <Button variant="default" onClick={() => setConfirmingConcede(false)}>
            Keep playing
          </Button>
          <Button color="red" data-testid="fab-live-concede-confirm" onClick={confirmConcede}>
            Concede
          </Button>
        </Group>
      </Modal>
    </>
  );
}
