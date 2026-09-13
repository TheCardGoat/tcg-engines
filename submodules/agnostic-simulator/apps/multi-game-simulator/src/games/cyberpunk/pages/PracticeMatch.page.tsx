import { useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DEFAULT_SCENARIO,
  createPracticeAiConfig,
  createPracticeEngine,
  getPracticeDeckFixture,
  getStrategyById,
  loadPracticeMatchConfig,
} from "../engine";
import { BoardSharedPage } from "./BoardShared.page";
import type { LocalCommandCommit } from "../engine";
import { useRegisterSimulatorDebugExportSource } from "../../../simulator/debug-export/SimulatorDebugExportContext";
import { LocalSimulatorDebugHistoryRecorder } from "../../../simulator/debug-export/local-debug-history";
import classes from "./Practice.module.css";
import { cyberpunkSimulatorPath } from "./simulatorPaths";

export function PracticeMatchPage() {
  const { matchId = "" } = useParams<{ matchId: string }>();
  const config = loadPracticeMatchConfig(matchId);

  if (!config) {
    return <PracticeRecovery message="Practice match not found or expired." />;
  }

  if (
    (config.playerDeckFixtureId && !getPracticeDeckFixture(config.playerDeckFixtureId)) ||
    (config.botDeckFixtureId && !getPracticeDeckFixture(config.botDeckFixtureId)) ||
    (config.playerStrategyId && !getStrategyById(config.playerStrategyId)) ||
    !getStrategyById(config.botStrategyId)
  ) {
    return (
      <PracticeRecovery message="Practice match uses a deck or strategy that is unavailable." />
    );
  }

  return <ReadyPracticeMatch config={config} />;
}

function ReadyPracticeMatch({
  config,
}: {
  readonly config: NonNullable<ReturnType<typeof loadPracticeMatchConfig>>;
}) {
  const debugHistory = useMemo(() => {
    const initialEngine = createPracticeEngine(config);
    return new LocalSimulatorDebugHistoryRecorder(
      {
        slug: "cyberpunk",
        gameId: config.matchId,
        matchId: config.matchId,
        ...(config.seed ? { seed: config.seed } : {}),
        environment: "development",
        ...(import.meta.env.VITE_GIT_SHA ? { releaseSha: import.meta.env.VITE_GIT_SHA } : {}),
      },
      initialEngine.getState(),
    );
  }, [config]);
  useRegisterSimulatorDebugExportSource(debugHistory);
  const recordCommit = useCallback(
    (commit: LocalCommandCommit) => {
      const { result } = commit;
      debugHistory.record({
        stateAfter: result.state,
        stateVersion: result.stateID,
        turnNumber: result.state.G.turnMetadata.turnNumber,
        actorId: commit.side,
        moveId: result.processedCommand.move,
        commandId: result.processedCommand.commandID,
        input: commit.action ?? result.processedCommand.input,
        processedCommand: result.processedCommand,
        timestamp: Date.now(),
        domainEvents: result.gameEvents,
      });
    },
    [debugHistory],
  );

  return (
    <>
      <div data-testid="practice-match-id" data-match-id={config.matchId} hidden>
        {config.matchId}
      </div>
      <div data-testid="practice-match-seed" data-seed={config.seed} hidden>
        {config.seed}
      </div>
      <BoardSharedPage
        key={config.matchId}
        scenarioId={DEFAULT_SCENARIO}
        initialEngineBuilder={() => createPracticeEngine(config)}
        initialAi={createPracticeAiConfig(config)}
        initialHumanSide="player"
        initialAiMode="auto"
        initialAiSpeed="balanced"
        onLocalCommandCommitted={recordCommit}
      />
    </>
  );
}

function PracticeRecovery({ message }: { message: string }) {
  return (
    <main className={classes.page}>
      <div className={classes.shell}>
        <header className={classes.header}>
          <p className={classes.eyebrow}>Cyberpunk · practice</p>
          <h1 className={classes.title}>Practice match unavailable</h1>
          <p className={classes.lead}>{message}</p>
          <Link className={classes.backLink} to={cyberpunkSimulatorPath("/practice")}>
            Start a new practice match
          </Link>
        </header>
      </div>
    </main>
  );
}
