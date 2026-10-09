import { SimulatorLiveChatProvider } from "../../../simulator/providers/live-chat-context";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import type { ResolvedMatchViewer } from "@tcg/game-page-contract";
import {
  validateInteractionSubmission,
  EngineInteractionView,
  type DropEligibility,
  type EngineInteractionView as EngineInteractionViewType,
  type InteractionSubmission,
  type PendingProposal,
} from "@tcg/protocol";
import { InteractionWorkspace, DropClaimControl, SimulatorRouteStatus } from "@tcg/simulator-ui";
import { acquireRootGatewayHandle } from "../../../lib/gateway/root-socket";
import { LiveActionAttention } from "../../../simulator/attention/LiveActionAttention";
import { LiveMatchChatPanel } from "../../../simulator/chat/LiveMatchChatPanel";
import { useLiveMatchDocumentTitle } from "../../../simulator/attention/useLiveMatchDocumentTitle";
import { useSimulatorRoute } from "../../../simulator/providers";
import {
  type AcSeat,
  type LiveBoardCard,
  type LiveBoardPlayer,
  type LiveBoardState,
} from "../components/board-types";
import classes from "./Practice.module.css";
import {
  AlphaClashInteractionPanel,
  AlphaClashInteractionBoard,
  labelAlphaClashInteractions,
} from "../components/AlphaClashInteractions";

const LOG_LIMIT = 200;

interface LiveLogLine {
  readonly id: number;
  readonly text: string;
}

/**
 * Server-authoritative Alpha Clash match surface. State is consumed
 * exclusively from the adapter's viewer projection; the browser never
 * hydrates a persisted engine snapshot.
 */
function AlphaClashLiveMatchPageContent() {
  const route = useSimulatorRoute();
  const bootstrap = route.matchPageData;
  const gameId = bootstrap?.game.gameId;
  const viewerSeat = viewerToSeat(bootstrap?.viewer);
  const participantNames = useMemo(() => {
    const participants = bootstrap?.match?.participants ?? [];
    const p1 = participants.find((participant) => participant.seat === 1)?.displayName;
    const p2 = participants.find((participant) => participant.seat === 2)?.displayName;
    return { ...(p1?.trim() ? { p1: p1.trim() } : {}), ...(p2?.trim() ? { p2: p2.trim() } : {}) };
  }, [bootstrap?.match?.participants]);

  const [state, setState] = useState<LiveBoardState | null>(() =>
    parseProjectedState(bootstrap?.game.view),
  );
  const [interactionView, setInteractionView] = useState<EngineInteractionViewType | null>(() =>
    parseInteractionView(bootstrap?.game.interactionView),
  );
  const [stateVersion, setStateVersion] = useState(bootstrap?.game.stateVersion ?? 0);
  const [canUndo, setCanUndo] = useState(bootstrap?.game.undoable === true);
  const [canUndoTurn, setCanUndoTurn] = useState(bootstrap?.game.undoTurnAvailable === true);
  const [undoProposal, setUndoProposal] = useState<PendingProposal | null>(null);
  useEffect(() => {
    if (!undoProposal) return;
    const deadline = undoProposal.deadline;
    const timeout = window.setTimeout(
      () => {
        setUndoProposal((current) => (current?.deadline === deadline ? null : current));
      },
      Math.max(0, deadline - Date.now()),
    );
    return () => window.clearTimeout(timeout);
  }, [undoProposal]);
  useLiveMatchDocumentTitle({
    game: "Alpha Clash",
    turn: state && viewerSeat ? (state.activePlayer === viewerSeat ? "self" : "opponent") : null,
    priority: null,
    finished: state?.phaseName === "complete" || bootstrap?.game.status === "completed",
  });
  const [logLines, setLogLines] = useState<readonly LiveLogLine[]>(
    () => logLinesFromEngineLogs(bootstrap?.history.engineLogs ?? [], 0).lines,
  );
  const [dropEligibility, setDropEligibility] = useState<DropEligibility | null>(
    bootstrap?.dropEligibility ?? null,
  );
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionReady, setConnectionReady] = useState(false);
  const logIdCounter = useRef(0);
  const interactionRef = useRef(interactionView);
  useEffect(() => {
    interactionRef.current = interactionView;
  }, [interactionView]);
  const appendEngineLogs = useCallback((entries: unknown) => {
    const list = Array.isArray(entries) ? entries : [];
    if (list.length === 0) return;
    const { lines, nextId } = logLinesFromEngineLogs(list, logIdCounter.current);
    logIdCounter.current = nextId;
    if (lines.length === 0) return;
    setLogLines((current) => [...lines.slice().reverse(), ...current].slice(0, LOG_LIMIT));
  }, []);

  useEffect(() => {
    if (!gameId) return;
    const handle = acquireRootGatewayHandle("alpha-clash");
    const accept = (payload: {
      readonly gameId: string;
      readonly state?: unknown;
      readonly interactionView?: unknown;
      readonly stateVersion?: number;
      readonly engineLogs?: unknown;
      readonly undoable?: boolean;
      readonly undoTurnAvailable?: boolean;
      readonly pendingProposal?: PendingProposal | null;
    }) => {
      if (payload.gameId !== gameId) return;
      const nextState = parseProjectedState(payload.state);
      if (nextState) {
        setState(nextState);
        if (typeof payload.stateVersion === "number") setStateVersion(payload.stateVersion);
      }
      if (payload.interactionView === null) setInteractionView(null);
      const view = parseInteractionView(payload.interactionView);
      if (view) setInteractionView(view);
      appendEngineLogs(payload.engineLogs);
      if (typeof payload.undoable === "boolean") setCanUndo(payload.undoable);
      if (typeof payload.undoTurnAvailable === "boolean") setCanUndoTurn(payload.undoTurnAvailable);
      if (payload.pendingProposal?.actionType === "undo") setUndoProposal(payload.pendingProposal);
    };
    const unsubscribers = [
      handle.onAuthenticated(() => setConnectionReady(true)),
      handle.onDisconnected(() => setConnectionReady(false)),
      handle.on("game_joined", (payload) => {
        accept(payload);
        if (payload.gameId === gameId && payload.dropEligibility) {
          setDropEligibility(payload.dropEligibility);
        }
      }),
      handle.on("drop_eligibility", (payload) => {
        if (payload.gameId === gameId) setDropEligibility(payload.dropEligibility);
      }),
      handle.on("state_sync", accept),
      handle.on("state_update", accept),
      handle.on("move_accepted", accept),
      handle.on("proposal_received", (payload) => {
        if (payload.gameId === gameId && payload.actionType === "undo")
          setUndoProposal({ ...payload, actionType: "undo" });
      }),
      handle.on("proposal_resolved", (payload) => {
        if (payload.gameId === gameId && payload.actionType === "undo") setUndoProposal(null);
      }),
      handle.on("proposal_expired", (payload) => {
        if (payload.gameId === gameId && payload.actionType === "undo") setUndoProposal(null);
      }),
      handle.on("proposal_send:response", (response) => {
        if (response.status === "err") setConnectionError(response.data.message);
        else if ("resolution" in response.data) setUndoProposal(null);
        else if (response.data.actionType === "undo")
          setUndoProposal({ ...response.data, actionType: "undo" });
      }),
      handle.on("proposal_accept:response", (response) => {
        if (response.status === "err") setConnectionError(response.data.message);
        setUndoProposal(null);
      }),
      handle.on("proposal_decline:response", (response) => {
        if (response.status === "err") setConnectionError(response.data.message);
        setUndoProposal(null);
      }),
      handle.on("move_rejected", (payload) => {
        if (payload.gameId !== gameId) return;
        setConnectionError(payload.reason ?? "The server rejected that action.");
        handle.emit("request_game_state_sync", { gameId });
      }),
      handle.on("submit_interaction:response", (payload) => {
        if (payload.status !== "err") return;
        const reason =
          typeof payload.data?.reason === "string"
            ? payload.data.reason
            : "The server rejected that action.";
        setConnectionError(reason);
        handle.emit("request_game_state_sync", { gameId });
      }),
    ];
    handle.join({ gameId });
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      handle.leave();
      handle.release();
    };
  }, [appendEngineLogs, gameId]);

  const submit = useCallback(
    (submission: InteractionSubmission) => {
      const view = interactionRef.current;
      if (!gameId || !view || !connectionReady) return false;
      if (!validateInteractionSubmission(view, submission).ok) {
        setConnectionError("That action is no longer available — the board has moved on.");
        return false;
      }
      const handle = acquireRootGatewayHandle("alpha-clash");
      if (handle.wouldHoldEmit()) {
        handle.release();
        return false;
      }
      handle.emit("submit_interaction", {
        gameId,
        expectedVersion: submission.stateVersion,
        submission,
        correlationId: crypto.randomUUID(),
      });
      handle.release();
      setConnectionError(null);
      return true;
    },
    [gameId, connectionReady],
  );

  const sendUndo = (
    event: "proposal_send" | "proposal_accept" | "proposal_decline",
    undoScope: "last_move" | "turn_start" = "last_move",
  ) => {
    if (!gameId || !connectionReady) return;
    const handle = acquireRootGatewayHandle("alpha-clash");
    handle.emit(event, {
      gameId,
      actionType: "undo",
      ...(event === "proposal_send" ? { undoScope } : {}),
    });
    handle.release();
  };

  if (route.error) return <SimulatorRouteStatus title="Match unavailable" message={route.error} />;
  if (bootstrap?.viewer.role !== "player") {
    return (
      <SimulatorRouteStatus
        title="Spectating unavailable"
        message="Alpha Clash matches currently support seated players only."
      />
    );
  }
  if (!bootstrap || !gameId || !state || !viewerSeat || !interactionView) {
    return (
      <SimulatorRouteStatus
        title="Loading Alpha Clash match"
        message="Connecting to the match server."
      />
    );
  }

  const ended = state.phaseName === "complete";
  const labelFor = (instanceId: string): string => {
    const card = state.cards.find((entry) => entry.instanceId === instanceId);
    if (!card) return instanceId;
    return card.name ?? (card.faceDown ? "Set card" : instanceId);
  };

  const view = labelAlphaClashInteractions(interactionView, labelFor);
  const viewerId = bootstrap.viewer.actorId;
  const interactionDisabled = ended || !connectionReady;
  return (
    <InteractionWorkspace
      key={`${gameId}:${viewerId}`}
      view={view}
      viewerId={viewerId}
      onSubmit={submit}
      disabled={interactionDisabled}
    >
      <LiveActionAttention
        gameId={gameId}
        view={interactionView}
        viewerId={bootstrap?.viewer.role === "player" ? bootstrap.viewer.actorId : null}
        stateVersion={stateVersion}
        canAct={bootstrap?.viewer.role === "player" && connectionReady && !ended}
        onShowAction={() => {
          const target = document.querySelector<HTMLElement>("[data-action-attention-target]");
          target?.scrollIntoView({ block: "nearest", behavior: "smooth" });
          target?.focus({ preventScroll: true });
        }}
      />
      {dropEligibility ? (
        <div className="pointer-events-auto absolute right-4 top-4 z-20">
          <DropClaimControl
            eligibility={dropEligibility}
            serverNowMs={dropEligibility.projectedAtMs}
            onClaim={() => {
              const handle = acquireRootGatewayHandle("alpha-clash");
              handle.emit("drop_player", { gameId });
              handle.release();
            }}
          />
        </div>
      ) : null}
      {undoProposal ? (
        <div
          className="pointer-events-auto absolute left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-3 rounded-lg bg-slate-950 px-4 py-3 text-sm text-white shadow-xl"
          role="status"
        >
          <span>
            {undoProposal.senderPlayerId === bootstrap.viewer.actorId
              ? "Waiting for opponent approval."
              : undoProposal.undoScope === "turn_start"
                ? "Opponent requests Undo turn."
                : "Opponent requests Undo."}
          </span>
          {undoProposal.senderPlayerId !== bootstrap.viewer.actorId ? (
            <>
              <button type="button" onClick={() => sendUndo("proposal_accept")}>
                Approve
              </button>
              <button type="button" onClick={() => sendUndo("proposal_decline")}>
                Decline
              </button>
            </>
          ) : null}
        </div>
      ) : null}
      <main className={`${classes.page} ${classes.arenaPage}`}>
        <div className={classes.tableArea}>
          {ended ? (
            <Paper withBorder p="sm" radius="md" className={classes.resultBanner}>
              <Text fw={700}>Match complete</Text>
            </Paper>
          ) : null}
          <AlphaClashInteractionBoard
            board={state}
            viewerSeat={viewerSeat}
            participantNames={participantNames}
            view={view}
            disabled={interactionDisabled}
            controls={
              <aside className={classes.arenaControls} data-action-attention-target tabIndex={-1}>
                <Group gap="xs">
                  <Button
                    size="xs"
                    disabled={!connectionReady || !canUndo || Boolean(undoProposal)}
                    onClick={() => sendUndo("proposal_send")}
                  >
                    Undo
                  </Button>
                  <Button
                    size="xs"
                    disabled={!connectionReady || !canUndoTurn || Boolean(undoProposal)}
                    onClick={() => sendUndo("proposal_send", "turn_start")}
                  >
                    Undo turn
                  </Button>
                </Group>
                <AlphaClashInteractionPanel
                  view={view}
                  viewerId={viewerId}
                  disabled={interactionDisabled}
                  onSubmit={submit}
                />
                <LiveMatchChatPanel canSend={!ended} />
                <Paper
                  withBorder
                  p="sm"
                  radius="md"
                  className={classes.logPanel}
                  data-testid="ac-event-log"
                >
                  <Text fw={600} size="sm" mb={4}>
                    Event log
                  </Text>
                  <Stack gap={2}>
                    {logLines.slice(0, 14).map((line) => (
                      <Text key={line.id} size="xs" c="dimmed" data-testid="ac-event-log-line">
                        {line.text}
                      </Text>
                    ))}
                    {logLines.length === 0 ? (
                      <Text size="xs" c="dimmed">
                        The match has not started yet.
                      </Text>
                    ) : null}
                  </Stack>
                </Paper>
              </aside>
            }
          />
          {connectionError ? (
            <Paper withBorder p="xs" radius="md" className={classes.errorBanner}>
              <Text size="sm" c="red">
                {connectionError}
              </Text>
            </Paper>
          ) : null}
        </div>
      </main>
    </InteractionWorkspace>
  );
}

function viewerToSeat(viewer: ResolvedMatchViewer | undefined): AcSeat | null {
  if (!viewer || viewer.role !== "player") return null;
  return viewer.seat === 1 ? "player-one" : "player-two";
}

function parseInteractionView(value: unknown): EngineInteractionViewType | null {
  const parsed = EngineInteractionView.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSeat(value: unknown): value is AcSeat {
  return value === "player-one" || value === "player-two";
}

/**
 * Validates the adapter's seated viewer projection into the board's view
 * model. Anything the game server could not have produced is rejected rather
 * than rendered.
 */
export function parseProjectedState(raw: unknown): LiveBoardState | null {
  if (!isRecord(raw)) return null;
  if (!Array.isArray(raw.cards) || typeof raw.turnNumber !== "number") return null;
  if (!isSeat(raw.activePlayer) || typeof raw.portalOpen !== "boolean") return null;
  if (!isRecord(raw.phase) || typeof raw.phase.name !== "string") return null;
  if (raw.standby !== undefined && !Array.isArray(raw.standby)) return null;

  const players = parsePlayers(raw.players);
  if (!players) return null;

  const cards: LiveBoardCard[] = [];
  for (const entry of raw.cards) {
    const card = parseCard(entry);
    if (!card) return null;
    cards.push(card);
  }

  let clash: LiveBoardState["clash"] = null;
  if (raw.clash !== null && raw.clash !== undefined) {
    if (
      !isRecord(raw.clash) ||
      typeof raw.clash.attackerId !== "string" ||
      typeof raw.clash.targetId !== "string" ||
      typeof raw.clash.step !== "string"
    ) {
      return null;
    }
    clash = {
      attackerId: raw.clash.attackerId,
      targetId: raw.clash.targetId,
      step: raw.clash.step,
    };
  }

  return {
    cards,
    players,
    activePlayer: raw.activePlayer,
    turnNumber: raw.turnNumber,
    phaseName: raw.phase.name,
    portalOpen: raw.portalOpen,
    clash,
    standbyCount: Array.isArray(raw.standby) ? raw.standby.length : 0,
  };
}

function parsePlayers(raw: unknown): Record<AcSeat, LiveBoardPlayer> | null {
  if (!isRecord(raw)) return null;
  const one = parsePlayer(raw["player-one"]);
  const two = parsePlayer(raw["player-two"]);
  return one && two ? { "player-one": one, "player-two": two } : null;
}

function parsePlayer(raw: unknown): LiveBoardPlayer | null {
  if (
    !isRecord(raw) ||
    typeof raw.name !== "string" ||
    typeof raw.health !== "number" ||
    typeof raw.maxHealth !== "number" ||
    typeof raw.handSize !== "number" ||
    typeof raw.deckSize !== "number"
  ) {
    return null;
  }
  return {
    name: raw.name,
    health: raw.health,
    maxHealth: raw.maxHealth,
    handSize: raw.handSize,
    deckSize: raw.deckSize,
  };
}

function parseCard(raw: unknown): LiveBoardCard | null {
  if (
    !isRecord(raw) ||
    typeof raw.instanceId !== "string" ||
    typeof raw.zone !== "string" ||
    typeof raw.controller !== "string" ||
    typeof raw.ready !== "boolean" ||
    typeof raw.faceDown !== "boolean" ||
    typeof raw.clashDamage !== "number" ||
    typeof raw.phaseDamage !== "number" ||
    (raw.definitionId !== null && typeof raw.definitionId !== "string") ||
    (raw.name !== null && typeof raw.name !== "string")
  ) {
    return null;
  }
  return {
    instanceId: raw.instanceId,
    zone: raw.zone,
    controller: raw.controller,
    ready: raw.ready,
    faceDown: raw.faceDown,
    definitionId: raw.definitionId,
    name: raw.name,
    clashDamage: raw.clashDamage,
    phaseDamage: raw.phaseDamage,
  };
}

/** Extracts concise player-facing lines from the engine log stream. */
function logLinesFromEngineLogs(
  entries: readonly unknown[],
  startId: number,
): { lines: LiveLogLine[]; nextId: number } {
  const lines: LiveLogLine[] = [];
  let nextId = startId;
  for (const entry of entries) {
    const text = logTextFromEngineLog(entry);
    if (!text) continue;
    nextId += 1;
    lines.push({ id: nextId, text });
  }
  return { lines, nextId };
}

function logTextFromEngineLog(entry: unknown): string | null {
  if (typeof entry === "string") {
    return entry.trim().length > 0 ? entry : null;
  }
  if (!isRecord(entry)) return null;
  const payload = "data" in entry ? entry.data : entry;
  const messages = readLogMessages(payload);
  if (messages) return messages;
  if (typeof entry.tag === "string") return humanizeLogTag(entry.tag);
  return null;
}

function readLogMessages(value: unknown): string | null {
  if (!isRecord(value) || !isRecord(value.log) || !Array.isArray(value.log.messages)) return null;
  const parts = value.log.messages
    .map((message) => (isRecord(message) ? message.defaultMessage : undefined))
    .filter((text): text is string => typeof text === "string" && text.length > 0);
  return parts.length > 0 ? parts.join(" ") : null;
}

function humanizeLogTag(tag: string): string {
  const short = tag.startsWith("alpha-clash:") ? tag.slice("alpha-clash:".length) : tag;
  return short.replace(/[-_]/g, " ");
}

export function AlphaClashLiveMatchPage() {
  const { matchPageData: bootstrap } = useSimulatorRoute();
  if (!bootstrap || bootstrap.viewer.role !== "player") return <AlphaClashLiveMatchPageContent />;
  return (
    <SimulatorLiveChatProvider
      gameSlug="alpha-clash"
      gameId={bootstrap.game.gameId}
      viewerId={bootstrap.viewer.actorId}
      initialMessages={bootstrap.history.chatMessages}
      initialFreeTextEnabled={bootstrap.history.freeTextEnabled}
    >
      <AlphaClashLiveMatchPageContent />
    </SimulatorLiveChatProvider>
  );
}
