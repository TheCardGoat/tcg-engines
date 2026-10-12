import { useMatchIntroReady } from "../../../simulator/useMatchIntroReady";
import { AlphaClashPostGameSummary } from "../AlphaClashPostGameSummary";
import { parseAlphaClashResult } from "../post-game-result";
import { matchReturnUrl } from "../../../routes/match-return-url";
import { SimulatorLiveChatProvider } from "../../../simulator/providers/live-chat-context";
import { useGameStateCorrection } from "../../../simulator/correction/useGameStateCorrection";
import { logLinesFromEngineLogs, mergeLiveLogLines, type LiveLogLine } from "./live-log";
import { CorrectionBanner, GameStateCorrection } from "../components/GameStateCorrection";
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
  deferAlphaClashOptionalCosts,
  labelAlphaClashInteractions,
} from "../components/AlphaClashInteractions";

const LOG_LIMIT = 200;

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
  const acceptedVersion = useRef(bootstrap?.game.stateVersion ?? 0);
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
  const [logLines, setLogLines] = useState<readonly LiveLogLine[]>(() =>
    logLinesFromEngineLogs(bootstrap?.history.engineLogs ?? [], 0).lines.reverse(),
  );
  const [dropEligibility, setDropEligibility] = useState<DropEligibility | null>(
    bootstrap?.dropEligibility ?? null,
  );
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionReady, setConnectionReady] = useState(false);
  const [transientBusy, setTransientBusy] = useState(false);
  const [openingResetKey, setOpeningResetKey] = useState(0);
  const correction = useGameStateCorrection({
    gameSlug: "alpha-clash",
    gameId,
    viewerId: bootstrap?.viewer.role === "player" ? bootstrap.viewer.actorId : undefined,
    stateVersion,
    connected: connectionReady,
    onError: setConnectionError,
  });
  const logIdCounter = useRef(logLines.reduce((max, line) => Math.max(max, line.id), 0));
  const interactionRef = useRef(interactionView);
  const appendEngineLogs = useCallback((entries: unknown) => {
    const list = Array.isArray(entries) ? entries : [];
    if (list.length === 0) return;
    const { lines, nextId } = logLinesFromEngineLogs(list, logIdCounter.current);
    logIdCounter.current = nextId;
    if (lines.length === 0) return;
    setLogLines((current) => mergeLiveLogLines(current, lines, LOG_LIMIT));
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
      if (
        typeof payload.stateVersion === "number" &&
        payload.stateVersion < acceptedVersion.current
      )
        return;
      const nextState = parseProjectedState(payload.state);
      if (nextState) {
        setState(nextState);
        if (typeof payload.stateVersion === "number") {
          acceptedVersion.current = payload.stateVersion;
          setStateVersion(payload.stateVersion);
        }
      }
      if (payload.interactionView === null) {
        interactionRef.current = null;
        setInteractionView(null);
      }
      const view = parseInteractionView(payload.interactionView);
      if (view) {
        // Opening actions can submit from a child layout effect. Publish the
        // accepted view before rendering so validation uses the same version.
        interactionRef.current = view;
        setInteractionView(view);
      }
      appendEngineLogs(payload.engineLogs);
      if (typeof payload.undoable === "boolean") setCanUndo(payload.undoable);
      if (typeof payload.undoTurnAvailable === "boolean") setCanUndoTurn(payload.undoTurnAvailable);
      if (payload.pendingProposal?.actionType === "undo") setUndoProposal(payload.pendingProposal);
    };
    const unsubscribers = [
      handle.onAuthenticated(() => setConnectionReady(true)),
      handle.onDisconnected(() => {
        setConnectionReady(false);
        setOpeningResetKey((key) => key + 1);
      }),
      handle.on("game_joined", (payload) => {
        accept(payload);
        if (payload.gameId === gameId && payload.dropEligibility) {
          setDropEligibility(payload.dropEligibility);
        }
      }),
      handle.on("drop_eligibility", (payload) => {
        if (payload.gameId === gameId) setDropEligibility(payload.dropEligibility);
      }),
      handle.on("state_sync", (payload) => {
        accept(payload);
        if (payload.gameId === gameId) setOpeningResetKey((key) => key + 1);
      }),
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
        setOpeningResetKey((key) => key + 1);
        setConnectionError(payload.reason ?? "The server rejected that action.");
        handle.emit("request_game_state_sync", { gameId });
      }),
      handle.on("submit_interaction:response", (payload) => {
        if (payload.status !== "err") return;
        setOpeningResetKey((key) => key + 1);
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
      if (
        !gameId ||
        !view ||
        !connectionReady ||
        correction.enabled ||
        state?.phaseName === "complete" ||
        bootstrap?.game.status === "completed"
      )
        return false;
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
    [gameId, connectionReady, correction.enabled, state?.phaseName, bootstrap?.game.status],
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

  useMatchIntroReady(Boolean(route.error || connectionError));

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

  const ended = state.phaseName === "complete" || bootstrap.game.status === "completed";
  const labelFor = (instanceId: string): string => {
    const card = state.cards.find((entry) => entry.instanceId === instanceId);
    if (!card) return instanceId;
    return card.name ?? (card.faceDown ? "Set card" : instanceId);
  };

  const view = labelAlphaClashInteractions(interactionView, labelFor);
  const viewerId = bootstrap.viewer.actorId;
  const interactionDisabled = ended || !connectionReady || correction.enabled;
  return (
    <InteractionWorkspace
      key={`${gameId}:${viewerId}`}
      view={view}
      viewerId={viewerId}
      onSubmit={submit}
      disabled={interactionDisabled || state.phaseName === "setup"}
      deferInitialSubmission={deferAlphaClashOptionalCosts}
    >
      <LiveActionAttention
        gameId={gameId}
        view={interactionView}
        viewerId={bootstrap?.viewer.role === "player" ? bootstrap.viewer.actorId : null}
        stateVersion={stateVersion}
        canAct={
          bootstrap?.viewer.role === "player" && connectionReady && !ended && !correction.enabled
        }
        onShowAction={() => {
          const target = document.querySelector<HTMLElement>("[data-action-attention-target]");
          target?.scrollIntoView({ block: "nearest", behavior: "smooth" });
          target?.focus({ preventScroll: true });
        }}
      />
      {!ended && dropEligibility ? (
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
      <CorrectionBanner session={correction} viewerId={viewerId} disabled={!connectionReady} />
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
          <AlphaClashInteractionBoard
            matchId={gameId}
            onTransientBusyChange={setTransientBusy}
            onSubmit={submit}
            openingResetKey={openingResetKey}
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
                    disabled={interactionDisabled || !canUndo || Boolean(undoProposal)}
                    onClick={() => sendUndo("proposal_send")}
                  >
                    Undo
                  </Button>
                  <Button
                    size="xs"
                    disabled={interactionDisabled || !canUndoTurn || Boolean(undoProposal)}
                    onClick={() => sendUndo("proposal_send", "turn_start")}
                  >
                    Undo turn
                  </Button>
                </Group>
                <GameStateCorrection
                  board={state}
                  viewerSeat={viewerSeat}
                  session={correction}
                  disabled={ended || !connectionReady || Boolean(undoProposal)}
                />
                {state.phaseName !== "setup" && (
                  <AlphaClashInteractionPanel
                    view={view}
                    viewerId={viewerId}
                    disabled={interactionDisabled}
                    onSubmit={submit}
                  />
                )}
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
      {ended && (
        <AlphaClashPostGameSummary
          key={gameId}
          gameId={gameId}
          result={state.result}
          board={state}
          viewer={viewerSeat}
          busy={transientBusy}
          remote
          names={{
            "player-one": participantNames.p1 ?? "Player 1",
            "player-two": participantNames.p2 ?? "Player 2",
          }}
          meta={
            bootstrap.match.gameIds?.includes(gameId) ? (
              <span>Game {bootstrap.match.gameIds.indexOf(gameId) + 1}</span>
            ) : undefined
          }
          actions={
            <>
              <a href={matchReturnUrl("alpha-clash", window.location.search)}>Back to lobby</a>
              {route.session?.phase === "finished" &&
              route.session.match.currentGameId &&
              route.session.match.currentGameId !== gameId ? (
                <a
                  data-primary
                  href={`/alpha-clash/simulator/matches/${encodeURIComponent(bootstrap.match.matchId)}/games/${encodeURIComponent(route.session.match.currentGameId)}?returnTo=${encodeURIComponent(matchReturnUrl("alpha-clash", window.location.search))}`}
                >
                  Continue to next game
                </a>
              ) : bootstrap.match.status === "completed" ||
                bootstrap.match.status === "abandoned" ? null : (
                <button disabled>Finalizing match</button>
              )}
            </>
          }
        />
      )}
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

  const result = parseAlphaClashResult(raw.phase);

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

  let responseWindow: LiveBoardState["responseWindow"] = null;
  if (raw.responseWindow !== null && raw.responseWindow !== undefined) {
    const window = raw.responseWindow;
    if (!isRecord(window) || !isSeat(window.openFor)) return null;
    const passedSeats = window.passedPlayers ?? [];
    if (!Array.isArray(passedSeats) || !passedSeats.every(isSeat)) return null;
    responseWindow = { openFor: window.openFor, passedSeats };
  }

  return {
    cards,
    damageEvents: Array.isArray(raw.damageEvents)
      ? raw.damageEvents.flatMap((entry) => {
          if (
            !isRecord(entry) ||
            !Number.isSafeInteger(entry.sequence) ||
            typeof entry.sequence !== "number" ||
            typeof entry.targetId !== "string" ||
            typeof entry.amount !== "number" ||
            !Number.isSafeInteger(entry.amount) ||
            entry.amount <= 0
          )
            return [];
          return [{ sequence: entry.sequence, targetId: entry.targetId, amount: entry.amount }];
        })
      : undefined,
    counterMoves: Array.isArray(raw.counterMoves)
      ? raw.counterMoves.flatMap((entry) => {
          if (
            !isRecord(entry) ||
            typeof entry.sequence !== "number" ||
            !Number.isSafeInteger(entry.sequence) ||
            typeof entry.kind !== "string" ||
            typeof entry.amount !== "number" ||
            !Number.isSafeInteger(entry.amount) ||
            entry.amount <= 0 ||
            typeof entry.fromId !== "string" ||
            typeof entry.toId !== "string"
          )
            return [];
          return [
            {
              sequence: entry.sequence,
              kind: entry.kind,
              amount: entry.amount,
              fromId: entry.fromId,
              toId: entry.toId,
            },
          ];
        })
      : [],
    players,
    activePlayer: raw.activePlayer,
    decisionSeat:
      raw.decisionSeat === "player-one" || raw.decisionSeat === "player-two"
        ? raw.decisionSeat
        : undefined,
    turnNumber: raw.turnNumber,
    phaseName: raw.phase.name,
    ...(result ? { result } : {}),
    phaseStep: typeof raw.phase.step === "string" ? raw.phase.step : undefined,
    responseWindow,
    openingHandsReady:
      isRecord(raw.mulligan) && typeof raw.mulligan.resolved === "boolean"
        ? raw.mulligan.resolved
        : undefined,
    openingState:
      isRecord(raw.mulligan) && isRecord(raw.mulligan.declarations)
        ? {
            declarations: {
              ...(typeof raw.mulligan.declarations["player-one"] === "boolean"
                ? { "player-one": raw.mulligan.declarations["player-one"] }
                : {}),
              ...(typeof raw.mulligan.declarations["player-two"] === "boolean"
                ? { "player-two": raw.mulligan.declarations["player-two"] }
                : {}),
            },
            selectedCardIds:
              Array.isArray(raw.mulligan.selectedCardIds) &&
              raw.mulligan.selectedCardIds.every((id) => typeof id === "string")
                ? raw.mulligan.selectedCardIds
                : null,
          }
        : undefined,
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
    attack: typeof raw.attack === "number" ? raw.attack : undefined,
    defense: typeof raw.defense === "number" ? raw.defense : undefined,
    clashDamage: raw.clashDamage,
    phaseDamage: raw.phaseDamage,
    counters: isRecord(raw.counters)
      ? Object.fromEntries(
          Object.entries(raw.counters).filter(
            (entry): entry is [string, number] => typeof entry[1] === "number" && entry[1] > 0,
          ),
        )
      : undefined,
  };
}

/** Extracts concise player-facing lines from the engine log stream. */
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
      <AlphaClashLiveMatchPageContent
        key={`${bootstrap.game.gameId}:${bootstrap.viewer.actorId}`}
      />
    </SimulatorLiveChatProvider>
  );
}
