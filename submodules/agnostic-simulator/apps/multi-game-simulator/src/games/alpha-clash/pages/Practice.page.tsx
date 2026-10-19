import { useBackgroundBot } from "../../../simulator/bot/use-background-bot";
import { createAlphaClashBotPlanner } from "../bot-decision";
import { SIMULATOR_BOT_SPEED_MS } from "../../../simulator/SimulatorBotQuickControls";
const createBotWorker = () =>
  new Worker(new URL("../bot-decision.worker.ts", import.meta.url), { type: "module" });
import { AlphaClashPostGameSummary } from "../AlphaClashPostGameSummary";
import type { ResourceAudioState } from "../components/board-types";
import { isAlphaClashPromptFixture } from "../prompt-fixture-catalog";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { SeatPassOverlay, type SeatPass } from "../components/SeatPassOverlay";
import { type AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { type InteractionSubmission } from "@tcg/protocol";
import { RetryErrorReset } from "../components/RetryErrorReset";
import { InteractionWorkspace } from "@tcg/simulator-ui";
import type { AcSeat } from "../components/board-types";
import {
  AlphaClashInteractionPanel,
  AlphaClashInteractionBoard,
  deferAlphaClashOptionalCosts,
  labelAlphaClashInteractions,
} from "../components/AlphaClashInteractions";
import { Link, useSearchParams } from "react-router";
import { AlphaClashPracticeSetup } from "./PracticeSetup";
import {
  createAlphaClashPracticeEngine,
  alphaClashPracticeSetupFromSearch,
  type AlphaClashPracticeSetupInput,
} from "../practice-setup";
import { IconPlayerPause, IconPlayerPlay, IconPlayerTrackNext } from "@tabler/icons-react";
import classes from "./Practice.module.css";
import { practiceModeFromSearch, type PracticeMode } from "../../../simulator/practiceMode";
import type { SimulatorBotPacing } from "../../../simulator/SimulatorBotQuickControls";

const HUMAN = "human";
const BOT = "bot";

interface LogLine {
  readonly id: number;
  readonly text: string;
}

/** Local setup and engine-backed practice share the fixture board. */
export function AlphaClashPracticePage({ fixtureId }: { fixtureId?: string } = {}) {
  const [fixtureRun, setFixtureRun] = useState(0);
  if (fixtureId)
    return (
      <AlphaClashPracticeSession
        key={`${fixtureId}:${fixtureRun}`}
        fixtureId={fixtureId}
        onPlayAgain={() => setFixtureRun((run) => run + 1)}
      />
    );
  return <AlphaClashRoutedPracticePage />;
}

function AlphaClashRoutedPracticePage() {
  const [search, setSearch] = useSearchParams();
  let setup: AlphaClashPracticeSetupInput | null = null;
  let setupError: string | undefined;
  try {
    setup = alphaClashPracticeSetupFromSearch(search);
  } catch (error) {
    setupError = error instanceof Error ? error.message : String(error);
  }
  if (!setup) {
    return (
      <AlphaClashPracticeSetup
        error={setupError}
        initialMode={practiceModeFromSearch(search)}
        onStart={(input, mode) => {
          setSearch({
            playerDeck: input.playerDeckId,
            opponentDeck: input.opponentDeckId,
            strategy: input.strategyId,
            seed: input.seed,
            mode,
          });
        }}
      />
    );
  }
  return (
    <AlphaClashPracticeSession
      key={search.toString()}
      setup={setup}
      initialMode={practiceModeFromSearch(search)}
      onNewMatch={() => setSearch({ mode: practiceModeFromSearch(search) })}
      onPlayAgain={() =>
        setSearch((current) => {
          const next = new URLSearchParams(current);
          next.set("seed", crypto.randomUUID());
          return next;
        })
      }
    />
  );
}

function AlphaClashPracticeSession({
  fixtureId,
  setup,
  initialMode,
  onNewMatch,
  onPlayAgain,
}: {
  fixtureId?: string;
  setup?: AlphaClashPracticeSetupInput;
  initialMode?: PracticeMode;
  onNewMatch?: () => void;
  onPlayAgain: () => void;
}) {
  // Fixtures use the same automatic opponent as practice. Manual inspection
  // remains available through ?mode=self or the Hot seat control.
  const [mode, setMode] = useState<PracticeMode>(
    () =>
      initialMode ??
      practiceModeFromSearch(typeof window === "undefined" ? "" : window.location.search),
  );
  /** Bot pacing, mirroring SimulatorBotQuickControls: "auto" plays the bot's
   *  seat until the human's turn; "step" advances one move per Next click. */
  // Keep fixture framing stable across turns. Following the acting seat is opt-in.
  // Clean fixture recordings retain all player controls and native actions.
  const captureView =
    Boolean(fixtureId) &&
    new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get(
      "capture",
    ) === "1";
  const [fixtureViewer, setFixtureViewer] = useState(HUMAN);
  const [botPacing, setBotPacing] = useState<SimulatorBotPacing>("auto");
  const [engine, setEngine] = useState<AlphaClashServerEngine | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [transientBusy, setTransientBusy] = useState(false);
  const logCounter = useRef(0);
  const resourceAudioState = useRef<ResourceAudioState>({});

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        if (fixtureId) {
          const { createAlphaClashVisualFixture } = await import("../visual-fixtures");
          const created = createAlphaClashVisualFixture(fixtureId);
          if (!cancelled) {
            setEngine(created);
            setLog(
              created.state.moveLog
                .filter((entry) => entry.public)
                .slice(-30)
                .reverse()
                .map((entry) => ({ id: ++logCounter.current, text: entry.message })),
            );
          }
          return;
        }
        if (!setup) throw new Error("Choose practice decks first.");
        const created = await createAlphaClashPracticeEngine(setup);
        if (!cancelled) setEngine(created);
      } catch (loadError) {
        if (!cancelled) {
          setLoadError(loadError instanceof Error ? loadError.message : String(loadError));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fixtureId, setup?.playerDeckId, setup?.opponentDeckId, setup?.seed]);

  const context = useMemo(
    () => ({ gameId: "alpha-clash-local-practice", sourceAuthority: "server" as const }),
    [],
  );

  const logLinesOf = useCallback((result: { engineLogRecords?: readonly unknown[] }): string[] => {
    return practiceLogLines(result.engineLogRecords ?? []);
  }, []);

  // Native transitions generally mutate the same state object. Use the
  // adapter's published revision to drive planning and fence stale replies.
  const botIdentity = useMemo(
    () => (engine ? { engine, revision: engine.getStateID() } : null),
    [engine, version],
  );
  const botMoves = useRef(0);
  const [botThinking, setBotThinking] = useState(false);
  useEffect(() => {
    setBotThinking(false);
    if (!engine || engine.getActivePlayerId() !== BOT || engine.hasGameEnded())
      botMoves.current = 0;
  }, [engine, version, mode, botPacing, transientBusy]);
  const botFailed = useCallback((message: string) => {
    setError(message);
    setBotThinking(false);
    setBotPacing("step");
    botMoves.current = 0;
  }, []);
  const planBot = useMemo(() => createAlphaClashBotPlanner(engine?.playerIdToSeat ?? {}), [engine]);
  const driveBot = useBackgroundBot({
    identity: botIdentity,
    getIdentity: () => (engine?.getStateID() === botIdentity?.revision ? botIdentity : null),
    workerKey: engine ?? context,
    scope: `${mode}:${botPacing}:${setup?.strategyId}`,
    enabled: Boolean(
      engine &&
      !transientBusy &&
      mode === "bot" &&
      !engine.hasGameEnded() &&
      engine.getActivePlayerId() === BOT,
    ),
    auto: botPacing === "auto" && !error,
    delayMs: SIMULATOR_BOT_SPEED_MS.balanced,
    createWorker: createBotWorker,
    context: () => {
      if (!engine) throw new Error("No practice engine");
      return engine.playerIdToSeat;
    },
    input: () => {
      if (!engine) throw new Error("No practice engine");
      if (botMoves.current >= 200) throw new Error("Bot playback paused after 200 moves.");
      setBotThinking(true);
      return { state: engine.state, strategyId: setup?.strategyId ?? "default" };
    },
    decide: (input) => planBot({ ...input, state: structuredClone(input.state) }),
    onError: botFailed,
    commit: ({ command }) => {
      if (!engine) return;
      if (!command) {
        botFailed("The practice bot could not act.");
        return;
      }
      const revision = engine.getStateID();
      const { type, ...payload } = command;
      const result = engine.dispatch(type, BOT, payload, context);
      if (!result.success) {
        botFailed(result.error ?? "The practice bot could not act.");
        return;
      }
      if (engine.getStateID() === revision) {
        botFailed("The practice bot did not advance the match.");
        return;
      }
      botMoves.current += 1;
      setBotThinking(false);
      const lines = logLinesOf(result);
      if (lines.length)
        setLog((current) =>
          [...lines.map((text) => ({ id: ++logCounter.current, text })), ...current].slice(0, 60),
        );
      setError(null);
      setVersion(engine.getStateID());
    },
  });

  const applyResult = useCallback(
    (result: { success: boolean; error?: string; engineLogRecords?: readonly unknown[] }) => {
      if (!engine) return false;
      if (!result.success) {
        setError(result.error ?? "That action is not legal right now.");
        return false;
      }
      setError(null);
      const lines = logLinesOf(result);
      if (lines.length > 0) {
        setLog((current) =>
          [...lines.map((text) => ({ id: (logCounter.current += 1), text })), ...current].slice(
            0,
            60,
          ),
        );
      }
      botMoves.current = 0;
      setVersion(engine.getStateID());
      return true;
    },
    [engine, logLinesOf],
  );

  const openingSetup = fixtureId === "opening-preview" && engine?.state.phase.name === "setup";
  const controlledPlayer = mode === "self" ? (engine?.getActivePlayerId() ?? HUMAN) : HUMAN;

  const targetViewer = fixtureId && fixtureViewer !== "active" ? fixtureViewer : controlledPlayer;

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const seatSide = (id: string) =>
    (id === "player-two" || id === BOT ? "player-two" : "player-one") as
      | "player-one"
      | "player-two";
  // The board presents the seat that was active when the last motion started;
  // hot-seat hand-offs swap it only after those motions resolve.
  const [presentedActor, setPresentedActor] = useState(controlledPlayer);
  const presentedSeat = seatSide(presentedActor);
  const [seatPass, setSeatPass] = useState<SeatPass | null>(null);
  const onTransientBusyChange = useCallback((busy: boolean) => setTransientBusy(busy), []);
  const targetSeat = seatSide(targetViewer);
  const presentedSide = seatSide(presentedActor);
  const [heldPass, setHeldPass] = useState<SeatPass | null>(null);
  const holdStartedRef = useRef(0);
  const queuedActorRef = useRef(controlledPlayer);

  // A seat hand-off queues whenever the active seat's side changes.
  useEffect(() => {
    if (targetSeat === presentedSide) return;
    const pass = {
      key: Date.now(),
      from: presentedSide,
      to: targetSeat,
      turn: engine?.state.turnNumber ?? 0,
      caption: (engine?.state.phase.name ?? "").replace(/_/g, " "),
    } as SeatPass;
    queuedActorRef.current = targetViewer;
    holdStartedRef.current = Date.now();
    setHeldPass(pass);
  }, [targetViewer, targetSeat, presentedSide, engine?.state.turnNumber, engine?.state.phase.name]);

  const submit = useCallback(
    (submission: InteractionSubmission) => {
      if (!engine || presentedActor !== controlledPlayer) return false;
      const result = engine.submitInteraction(controlledPlayer, submission, context);
      return applyResult(result);
    },
    [engine, context, applyResult, controlledPlayer, presentedActor],
  );

  const pendingDecisionId = engine?.state.pendingChoices[0]?.id;

  // A native choice takes focus even when an outgoing scene motion remains busy.
  // Otherwise damage can hold the old seat indefinitely behind its own animation.
  useEffect(() => {
    if (!heldPass || (transientBusy && !pendingDecisionId)) return;
    const dwell = Math.max(0, holdStartedRef.current + 500 - Date.now());
    const start = setTimeout(() => {
      setHeldPass(null);
      setSeatPass(heldPass);
    }, dwell);
    return () => clearTimeout(start);
  }, [heldPass, transientBusy, pendingDecisionId]);

  if (loadError) {
    return (
      <main className={classes.page}>
        <Title order={2}>Alpha Clash practice</Title>
        <Text c="red">Unable to load the practice match: {loadError}</Text>
        {onNewMatch && <Button onClick={onNewMatch}>Choose decks</Button>}
      </main>
    );
  }
  if (!engine) {
    return (
      <main className={classes.page}>
        <Title order={2}>Alpha Clash practice</Title>
        <Text>Setting the table…</Text>
      </main>
    );
  }

  const board = engine.getViewerState({
    role: "player",
    actorId: presentedActor,
  });
  const nativeView = engine.getInteractionView(presentedActor);
  const ended = engine.hasGameEnded();
  /** A Next click is meaningful only while the bot seat owes the next move. */
  const canStepBot = !ended && engine.getActivePlayerId() === BOT;
  const labelFor = (instanceId: string): string => {
    const card = board.cards.find((entry) => entry.instanceId === instanceId);
    if (!card) return instanceId;
    return card.name ?? (card.faceDown ? "Set card" : instanceId);
  };

  const view = labelAlphaClashInteractions(nativeView, labelFor);

  return (
    <InteractionWorkspace
      view={view}
      viewerId={presentedActor}
      onSubmit={submit}
      // Opening controls submit through the same native boundary after their
      // animations. Do not also start a generic mulligan draft over the hand.
      disabled={
        ended ||
        presentedActor !== controlledPlayer ||
        Boolean(engine.state.phase.name === "setup" || heldPass || seatPass)
      }
      deferInitialSubmission={deferAlphaClashOptionalCosts}
    >
      <RetryErrorReset onClear={() => setError(null)} />
      <main
        className={`${classes.page} ${classes.arenaPage}`}
        data-testid="ac-practice-match"
        data-player-deck={setup?.playerDeckId}
        data-opponent-deck={setup?.opponentDeckId}
        data-bot-strategy={setup?.strategyId}
        data-version={version}
        data-practice-mode={mode}
        data-controlled-player={controlledPlayer}
      >
        {fixtureId && !captureView && !transientBusy && (
          <label className={classes.fixtureViewer}>
            Fixture view
            <select
              aria-label="Fixture view"
              value={fixtureViewer}
              onChange={(event) => setFixtureViewer(event.currentTarget.value)}
            >
              <option value={HUMAN}>Player 1</option>
              <option value={BOT}>Player 2</option>
              <option value="active">Follow active player</option>
            </select>
          </label>
        )}
        <div className={classes.tableArea}>
          <SeatPassOverlay
            pass={seatPass}
            reduced={reducedMotion || resourceAudioState.current.reducedMotion === true}
            onFlipped={() => {
              setPresentedActor(queuedActorRef.current);
            }}
            onDone={(done) => {
              // The veil keeps hit-testing while mounted; clear it once the
              // hand-off finishes or the board stays unclickable behind it.
              setSeatPass((current) => (current?.key === done.key ? null : current));
            }}
          />
          <AlphaClashInteractionBoard
            resourceAudioState={resourceAudioState.current}
            matchId={engine.state.id}
            onSubmit={submit}
            board={{
              cards: board.cards,
              counterMoves: board.counterMoves,
              damageEvents: board.damageEvents,
              players: board.players,
              activePlayer: board.activePlayer,
              decisionSeat: board.decisionSeat,
              phaseName: board.phase.name,
              phaseStep: "step" in board.phase ? board.phase.step : undefined,
              openingHandsReady: board.mulligan.resolved,
              openingState: board.mulligan,
              turnNumber: board.turnNumber,
              portalOpen: board.portalOpen,
              clash: board.clash,
              standbyCount: board.standby.length,
              responseWindow: board.responseWindow
                ? {
                    openFor: board.responseWindow.openFor as AcSeat,
                    passedSeats: (board.responseWindow.passedPlayers ?? []) as AcSeat[],
                  }
                : null,
            }}
            viewerSeat={presentedSeat}
            onTransientBusyChange={onTransientBusyChange}
            participantNames={{
              p1: mode === "self" ? "Player 1" : "You",
              p2: mode === "self" ? "Player 2" : "Opponent",
            }}
            view={view}
            disabled={ended || presentedActor !== controlledPlayer || Boolean(heldPass || seatPass)}
            utilities={
              <>
                {onNewMatch && (
                  <button type="button" onClick={onNewMatch}>
                    New match
                  </button>
                )}
                <div
                  className={classes.modeToggle}
                  data-testid="ac-practice-mode"
                  data-practice-mode={mode}
                  role="group"
                  aria-label="Practice mode"
                >
                  <button
                    type="button"
                    data-testid="ac-mode-hotseat"
                    aria-pressed={mode === "self"}
                    disabled={ended}
                    onClick={() => setMode("self")}
                  >
                    Hot seat
                  </button>
                  <button
                    type="button"
                    data-testid="ac-mode-bot"
                    aria-pressed={mode === "bot"}
                    disabled={ended}
                    onClick={() => setMode("bot")}
                  >
                    Bot
                  </button>
                </div>
                {mode === "bot" &&
                  (botPacing === "auto" ? (
                    <button
                      type="button"
                      className={classes.botPacing}
                      data-testid="ac-bot-pause"
                      aria-label="Pause automatic bot playback"
                      title="Pause bot playback and advance one move at a time"
                      disabled={ended}
                      onClick={() => setBotPacing("step")}
                    >
                      <IconPlayerPause size={15} stroke={2.3} aria-hidden="true" />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={`${classes.botPacing} ${classes.botNext}`}
                        data-testid="ac-bot-next"
                        aria-label="Run next bot move"
                        title="Run the bot's next legal move"
                        disabled={ended || !canStepBot || botThinking}
                        onClick={() => driveBot()}
                      >
                        <IconPlayerTrackNext size={14} stroke={2.2} aria-hidden="true" />
                        <span>{botThinking ? "Thinking…" : "Next"}</span>
                      </button>
                      <button
                        type="button"
                        className={classes.botPacing}
                        data-testid="ac-bot-resume"
                        aria-label="Resume automatic bot playback"
                        title="Resume automatic bot playback"
                        disabled={ended}
                        onClick={() => {
                          setError(null);
                          setBotPacing("auto");
                        }}
                      >
                        <IconPlayerPlay size={15} stroke={2.3} aria-hidden="true" />
                      </button>
                    </>
                  ))}
                {isAlphaClashPromptFixture(fixtureId) ? null : (
                  <>
                    <Link to="/alpha-clash/simulator/tests">Fixtures</Link>
                    {fixtureId && (
                      <button type="button" onClick={() => window.location.reload()}>
                        Reset
                      </button>
                    )}
                  </>
                )}
              </>
            }
            controls={
              <aside className={classes.arenaControls}>
                {openingSetup && (
                  <Text size="sm">
                    Local engine fixture. Player 1 starts. Each player declares keep or mulligan
                    before selecting cards. Hot seat follows each player's opening choice; the
                    practice bot keeps its hand.
                  </Text>
                )}
                {board.phase.name !== "setup" && (
                  <AlphaClashInteractionPanel
                    view={view}
                    viewerId={controlledPlayer}
                    onSubmit={submit}
                    disabled={ended}
                  />
                )}
                <Group gap="xs" aria-label="Local undo controls">
                  <Button
                    size="xs"
                    variant="default"
                    disabled={
                      ended ||
                      transientBusy ||
                      presentedActor !== controlledPlayer ||
                      !engine.canUndo(controlledPlayer)
                    }
                    onClick={() =>
                      applyResult(engine.dispatch("undo", controlledPlayer, {}, context))
                    }
                  >
                    Undo
                  </Button>
                  <Button
                    size="xs"
                    variant="default"
                    disabled={
                      ended ||
                      transientBusy ||
                      presentedActor !== controlledPlayer ||
                      !engine.canUndoToTurnStart(controlledPlayer)
                    }
                    onClick={() =>
                      applyResult(engine.dispatch("undoToTurnStart", controlledPlayer, {}, context))
                    }
                  >
                    Undo turn
                  </Button>
                </Group>
                <Paper withBorder p="sm" radius="md" className={classes.logPanel}>
                  <Text fw={600} size="sm" mb={4}>
                    Event log
                  </Text>
                  <Stack gap={2} data-testid="ac-event-log">
                    {log.slice(0, 14).map((line) => (
                      <Text key={line.id} size="xs" c="dimmed" data-testid="ac-event-log-line">
                        {line.text}
                      </Text>
                    ))}
                    {log.length === 0 ? (
                      <Text size="xs" c="dimmed">
                        The match has not started yet.
                      </Text>
                    ) : null}
                  </Stack>
                </Paper>
              </aside>
            }
          />
          {error ? (
            <Paper withBorder p="xs" radius="md" className={classes.errorBanner}>
              <Text size="sm" c="red">
                {error}
              </Text>
            </Paper>
          ) : null}
        </div>
      </main>
      {board.phase.name === "complete" && (
        <AlphaClashPostGameSummary
          gameId={engine.state.id}
          result={board.phase}
          board={board}
          viewer="player-one"
          hotSeat={mode === "self"}
          busy={transientBusy || Boolean(heldPass || seatPass)}
          names={{
            "player-one": mode === "self" ? "Player 1" : "You",
            "player-two": mode === "self" ? "Player 2" : "Opponent",
          }}
          actions={
            <>
              {onNewMatch ? (
                <button onClick={onNewMatch}>Back to setup</button>
              ) : (
                <Link to="/alpha-clash/simulator/tests">Fixtures</Link>
              )}
              <button data-primary onClick={onPlayAgain}>
                {fixtureId ? "Reset fixture" : "Play again"}
              </button>
            </>
          }
        />
      )}
    </InteractionWorkspace>
  );
}

export default AlphaClashPracticePage;

/**
 * Extracts concise player-facing lines from adapter EngineLogRecords: each
 * record envelopes the canonical log on `.log`, whose `public` messages carry
 * the player-readable `defaultMessage`.
 */
export function practiceLogLines(records: readonly unknown[]): string[] {
  const wrapped = records as ReadonlyArray<
    { log?: { public?: readonly { defaultMessage?: string }[] } } | null | undefined
  >;
  return wrapped
    .flatMap((record) => record?.log?.public ?? [])
    .map((message) => message.defaultMessage ?? "")
    .filter((text) => text.length > 0);
}
