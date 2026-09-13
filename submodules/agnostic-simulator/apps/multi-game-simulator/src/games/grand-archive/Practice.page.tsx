import { GrandArchivePreparation } from "./GrandArchivePreparation";
import {
  practicePreparationPool,
  confirmPracticePreparation,
  restartPracticePreparation,
} from "./practice-preparation";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  chooseGrandArchiveAutomatedAction,
  DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID,
  getSafeGrandArchiveAutomatedActionStrategyOption,
  GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES,
  type GrandArchiveAutomatedActionStrategyId,
} from "@tcg/grand-archive-engine/automation";
import { createGrandArchiveCatalogSmokeFixture } from "@tcg/grand-archive-engine/automation";
import {
  GrandArchiveMatchRuntime,
  projectGrandArchiveViewerState,
} from "@tcg/grand-archive-engine/simulator";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import {
  GrandArchiveServerEngine,
  grandArchiveCommandIncarnations,
  projectGrandArchiveSimulator,
} from "@tcg/grand-archive-server-adapter";
import {
  SIMULATOR_BOT_SPEED_MS,
  SimulatorBotQuickControls,
  type SimulatorBotPacing,
} from "../../simulator/SimulatorBotQuickControls";
import type { SimulatorMatchAutomation } from "@tcg/simulator-ui";
import { grandArchiveHarnessFixture } from "./fixtureProjection";
import { GrandArchivePracticeChat } from "./GrandArchivePracticeChat";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";
import {
  clearGrandArchivePracticeSession,
  persistGrandArchivePracticeSession,
  restoreGrandArchivePracticeSession,
  type StoredGrandArchivePracticeChatMessage,
  undoGrandArchivePracticeCommand,
} from "./practice-session";
import { GrandArchiveGameSummary } from "./GrandArchiveGameSummary";
import { GrandArchivePracticeSetup } from "./GrandArchivePracticeSetup";
import { defaultGrandArchivePracticeDeck, practiceSetupFromSearch } from "./practice-setup";

function createPracticeEngine() {
  const { program, initialState } = createGrandArchiveCatalogSmokeFixture(20260826);
  return new GrandArchiveServerEngine(program, new GrandArchiveMatchRuntime(program, initialState));
}

function createInitialPractice(): {
  server: GrandArchiveServerEngine;
  strategyId: GrandArchiveAutomatedActionStrategyId;
  botPacing: SimulatorBotPacing;
  chatMessages: readonly StoredGrandArchivePracticeChatMessage[];
  sessionMessage: string | null;
  requiresPreparation: boolean;
} {
  try {
    const launch = practiceSetupFromSearch(
      typeof window === "undefined" ? "" : window.location.search,
    );
    if (launch)
      return {
        ...launch,
        requiresPreparation: true,
        botPacing: "auto" as const,
        chatMessages: [] as readonly StoredGrandArchivePracticeChatMessage[],
        sessionMessage: null,
      };
  } catch (error) {
    return {
      server: createPracticeEngine(),
      strategyId: DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID,
      botPacing: "step" as const,
      chatMessages: [] as readonly StoredGrandArchivePracticeChatMessage[],
      requiresPreparation: false,
      sessionMessage: error instanceof Error ? error.message : String(error),
    };
  }

  const restored = restoreGrandArchivePracticeSession(createPracticeEngine);
  if (restored.kind === "restored") {
    return {
      server: restored.server,
      strategyId: restored.strategyId,
      botPacing: restored.botPacing,
      chatMessages: restored.chatMessages,
      requiresPreparation: false,
      sessionMessage: "Restored saved practice match.",
    } as const;
  }
  return {
    server: createPracticeEngine(),
    strategyId: DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID,
    botPacing: "auto" as const,
    chatMessages: [] as readonly StoredGrandArchivePracticeChatMessage[],
    requiresPreparation: restored.kind !== "error",
    sessionMessage: restored.kind === "error" ? restored.message : null,
  } as const;
}

export function GrandArchivePracticePage() {
  const [initialPractice, setInitialPractice] = useState(createInitialPractice);
  const [preparing, setPreparing] = useState(initialPractice.requiresPreparation);
  const [firstPlayerId, setFirstPlayerId] = useState(() => (Math.random() < 0.5 ? "p1" : "p2"));
  const pool = useMemo(
    () => (preparing ? practicePreparationPool(initialPractice.server, "p1") : null),
    [initialPractice.server, preparing],
  );
  if (pool)
    return (
      <GrandArchivePreparation
        pool={pool}
        initialSelection={pool.previous}
        playerLabel="You"
        opponentLabel="Practice opponent"
        opponentReady
        turnOrderLabel={firstPlayerId === "p1" ? "You go first" : "You go second"}
        onLeave={() => window.location.assign("/grand-archive/matchmaking")}
        onConfirm={(selection) => {
          setInitialPractice({
            ...initialPractice,
            server: confirmPracticePreparation(initialPractice.server, selection, firstPlayerId),
            requiresPreparation: false,
          });
          setPreparing(false);
        }}
      />
    );
  return (
    <GrandArchivePracticeGame
      initialPractice={initialPractice}
      onNewMatch={(server, strategyId) => {
        setFirstPlayerId(Math.random() < 0.5 ? "p1" : "p2");
        setInitialPractice({
          ...initialPractice,
          server,
          strategyId,
          chatMessages: [],
          sessionMessage: null,
          requiresPreparation: true,
        });
        setPreparing(true);
      }}
    />
  );
}
function GrandArchivePracticeGame({
  initialPractice,
  onNewMatch,
}: {
  initialPractice: ReturnType<typeof createInitialPractice>;
  onNewMatch: (
    server: GrandArchiveServerEngine,
    strategyId: GrandArchiveAutomatedActionStrategyId,
  ) => void;
}) {
  const defaultPracticeDeck = useMemo(() => {
    try {
      return { kind: "ready" as const, deck: defaultGrandArchivePracticeDeck() };
    } catch (error) {
      return {
        kind: "error" as const,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }, []);
  const [server, setServer] = useState(initialPractice.server);
  const [, refresh] = useReducer((value: number) => value + 1, 0);
  const [botPacing, setBotPacing] = useState<SimulatorBotPacing>(initialPractice.botPacing);
  const [takeoverActive, setTakeoverActive] = useState(false);
  const [strategyId, setStrategyId] = useState<GrandArchiveAutomatedActionStrategyId>(
    initialPractice.strategyId,
  );
  const [botError, setBotError] = useState<string | null>(null);
  const [sessionMessage, setSessionMessage] = useState<string | null>(
    initialPractice.sessionMessage,
  );
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [setupOpen, setSetupOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    readonly StoredGrandArchivePracticeChatMessage[]
  >(initialPractice.chatMessages);
  const nextChatMessageId = useRef(Math.max(0, ...chatMessages.map((message) => message.id)));
  const humanId = grandArchivePlayerId("p1");
  const botId = grandArchivePlayerId("p2");
  const activeActor = server.getActivePlayerId() ?? server.runtime.state.turnOrder[0]!;
  const seatedViewer = takeoverActive ? botId : humanId;
  const strategyOption = getSafeGrandArchiveAutomatedActionStrategyOption(strategyId);
  const stateVersion = server.runtime.state.stateVersion;
  const canStepBot = !server.hasGameEnded() && activeActor === botId && !takeoverActive;

  const runBotMove = useCallback(() => {
    if (server.hasGameEnded() || takeoverActive || server.getActivePlayerId() !== botId) return;
    const legal = chooseGrandArchiveAutomatedAction(
      server.program,
      server.runtime.state,
      grandArchivePlayerId(botId),
      strategyOption.strategy,
    );
    if (!legal) {
      setBotError("The selected strategy found no authoritative legal action.");
      return;
    }
    const { move, ...commandPayload } = legal.command;
    const result = server.dispatch(
      move,
      botId,
      {
        ...commandPayload,
        expectedStateVersion: legal.stateVersion,
        objectIncarnations: grandArchiveCommandIncarnations(server.runtime, legal.command),
      },
      { gameId: "grand-archive-local-standard", sourceAuthority: "client" },
    );
    if (!result.success) {
      setBotError(result.error ?? "Grand Archive bot action was rejected.");
      return;
    }
    setBotError(null);
    refresh();
  }, [botId, server, strategyOption.strategy, takeoverActive]);

  useEffect(() => {
    if (botPacing !== "auto" || !canStepBot) return;
    const timeout = window.setTimeout(runBotMove, SIMULATOR_BOT_SPEED_MS.balanced);
    return () => window.clearTimeout(timeout);
  }, [botPacing, canStepBot, runBotMove, stateVersion]);

  useEffect(() => {
    const saved = persistGrandArchivePracticeSession(server, strategyId, botPacing, chatMessages);
    // Consume a successful launch after saving it so refresh resumes this match.
    if (saved && !sessionMessage && window.location.search.includes("playerDeck=")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("playerDeck");
      url.searchParams.delete("opponentDeck");
      url.searchParams.delete("strategy");
      window.history.replaceState(window.history.state, "", url);
    }
  }, [botPacing, chatMessages, server, stateVersion, strategyId, sessionMessage]);

  // Legal-action projection is expensive. Bot pacing and other UI state do not
  // change legality; the immutable runtime root and viewer define its lifetime.
  const runtimeState = server.runtime.state;
  const projected = useMemo(
    () =>
      projectGrandArchiveSimulator(
        server.program,
        runtimeState,
        grandArchivePlayerId(seatedViewer),
      ),
    [server.program, runtimeState, seatedViewer],
  );
  const projection = {
    ...projected,
    table: {
      ...projected.table,
      seats: projected.table.seats.map((seat) => ({
        ...seat,
        role: seat.id === botId && !takeoverActive ? ("agent" as const) : ("human" as const),
      })),
    },
  };
  const fixture = grandArchiveHarnessFixture(
    "practice",
    "Standard practice match",
    `Viewing as ${seatedViewer}. Active actor: ${activeActor}. ${takeoverActive ? "Bot seat under manual control." : `Bot uses ${strategyOption.label}.`}`,
    projection,
  );

  const automationStatus = takeoverActive
    ? "Manual control"
    : botPacing === "step"
      ? "Paused · step mode"
      : activeActor === botId
        ? "Choosing a move…"
        : "Waiting for you";
  const undoLastMove = () => {
    const previous = undoGrandArchivePracticeCommand(server, humanId);
    if (!previous) return;
    if (botPacing === "auto" && previous.getActivePlayerId() === botId) {
      setBotPacing("step");
    }
    setServer(previous);
    setTakeoverActive(false);
    setBotError(null);
    setSessionMessage("Undid the last accepted move.");
  };
  const automation: SimulatorMatchAutomation = {
    label: "Practice opponent controls",
    panelLabel: "Practice opponent settings",
    summary: automationStatus,
    control: (
      <SimulatorBotQuickControls
        pacing={botPacing}
        takeoverActive={takeoverActive}
        canStep={canStepBot}
        disabled={server.hasGameEnded()}
        testIdPrefix="ga-practice-bot"
        onToggleTakeover={() => {
          setTakeoverActive((active) => !active);
          setBotError(null);
        }}
        onChangePacing={setBotPacing}
        onStep={runBotMove}
      />
    ),
    details: (
      <section className="ga-practice-automation-details">
        <header>
          <strong>Practice opponent</strong>
          <span>{automationStatus}</span>
        </header>
        <label>
          <span>Strategy</span>
          <select
            value={strategyId}
            disabled={takeoverActive || server.hasGameEnded()}
            onChange={(event) => {
              const candidate = GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES.find(
                (option) => option.id === event.currentTarget.value,
              );
              if (!candidate) return;
              setStrategyId(candidate.id);
              setBotError(null);
            }}
            data-testid="ga-practice-bot-strategy"
          >
            {GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES.filter(
              (option) => !("testOnly" in option) || option.testOnly !== true,
            ).map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <small>{strategyOption.description}</small>
        </label>
        <div className="ga-practice-session-actions">
          <span>{server.replayJournal.commands.length} accepted moves</span>
          <button
            type="button"
            onClick={() => {
              if (defaultPracticeDeck.kind === "error") {
                setBotError(`Deck setup is unavailable: ${defaultPracticeDeck.message}`);
                return;
              }
              setSetupOpen(true);
            }}
          >
            New deck matchup
          </button>
        </div>
        {sessionMessage ? (
          <p className="ga-practice-session-message" role="status">
            {sessionMessage}
            <button
              type="button"
              aria-label="Dismiss session message"
              onClick={() => setSessionMessage(null)}
            >
              ×
            </button>
          </p>
        ) : null}
        {botError ? <p role="alert">{botError}</p> : null}
      </section>
    ),
  };

  return (
    <div>
      <GrandArchiveTabletop
        fixture={fixture}
        automation={automation}
        historyAccessory={
          <GrandArchivePracticeChat
            messages={chatMessages}
            onSendMessage={(text) => {
              setChatMessages((messages) => [
                ...messages,
                {
                  id: ++nextChatMessageId.current,
                  recordedAt: Date.now(),
                  turn: fixture.table.status.turn,
                  actorId: humanId,
                  message: text,
                },
              ]);
            }}
          />
        }
        errorMessage={botError ?? undefined}
        canUndo={server.replayJournal.commands.some((command) => command.actorId === humanId)}
        onUndo={undoLastMove}
        onSubmitProtocolInteraction={(submission) => {
          const result = server.submitInteraction(seatedViewer, submission, {
            gameId: "grand-archive-local-standard",
            sourceAuthority: "client",
          });
          setBotError(result.success ? null : (result.error ?? "The interaction was rejected."));
          refresh();
          return result.success;
        }}
      />
      <output hidden>
        {JSON.stringify(
          projectGrandArchiveViewerState(
            server.program,
            server.runtime.state,
            grandArchivePlayerId(seatedViewer),
          ),
        )}
      </output>
      {server.hasGameEnded() && summaryOpen ? (
        <GrandArchiveGameSummary
          viewerId={seatedViewer}
          winnerIds={server.runtime.state.winnerIds}
          participantLabel={(playerId) =>
            server.runtime.state.players[grandArchivePlayerId(playerId)]?.name ?? playerId
          }
          onInspectBoard={() => setSummaryOpen(false)}
          onMainMenu={() => window.location.assign("/grand-archive/simulator")}
          onPlayAgain={() => {
            clearGrandArchivePracticeSession();
            onNewMatch(restartPracticePreparation(server), strategyId);
          }}
        />
      ) : null}
      {setupOpen && defaultPracticeDeck.kind === "ready" ? (
        <GrandArchivePracticeSetup
          initialDeck={defaultPracticeDeck.deck}
          onCancel={() => setSetupOpen(false)}
          onStart={(nextServer) => {
            clearGrandArchivePracticeSession();
            onNewMatch(nextServer, strategyId);
            setChatMessages([]);
            nextChatMessageId.current = 0;
            setTakeoverActive(false);
            setBotError(null);
            setSummaryOpen(true);
            setSessionMessage("Started a new validated deck matchup.");
            setSetupOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
