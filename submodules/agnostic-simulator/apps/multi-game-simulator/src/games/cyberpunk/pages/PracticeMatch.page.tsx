import { Link, useParams } from "react-router-dom";
import {
  DEFAULT_SCENARIO,
  createPracticeAiConfig,
  createPracticeEngine,
  getPracticeDeckFixture,
  getStrategyById,
  loadPracticeMatchConfig,
} from "../engine";
import { BoardPage } from "./Board.page";
import classes from "./Practice.module.css";

export function PracticeMatchPage() {
  const { matchId = "" } = useParams<{ matchId: string }>();
  const config = loadPracticeMatchConfig(matchId);

  if (!config) {
    return <PracticeRecovery message="Practice match not found or expired." />;
  }

  if (
    (config.playerDeckFixtureId && !getPracticeDeckFixture(config.playerDeckFixtureId)) ||
    (config.botDeckFixtureId && !getPracticeDeckFixture(config.botDeckFixtureId)) ||
    !getStrategyById(config.botStrategyId)
  ) {
    return (
      <PracticeRecovery message="Practice match uses a deck or strategy that is unavailable." />
    );
  }

  return (
    <BoardPage
      key={config.matchId}
      scenarioId={DEFAULT_SCENARIO}
      initialEngineBuilder={() => createPracticeEngine(config)}
      initialAi={createPracticeAiConfig(config)}
      initialHumanSide="player"
      initialAiMode="auto"
      initialAiSpeed="balanced"
    />
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
          <Link className={classes.backLink} to="/practice">
            Start a new practice match
          </Link>
        </header>
      </div>
    </main>
  );
}
