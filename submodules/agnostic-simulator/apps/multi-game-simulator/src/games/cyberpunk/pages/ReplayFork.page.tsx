import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { MatchState } from "@tcg/cyberpunk-engine";
import { createLiveMatchViewerEngine } from "../engine/live/liveState";
import { DEFAULT_SCENARIO, getStrategyById, type AISideConfig, type Side } from "../engine";
import { BoardPage } from "./Board.page";
import { loadCyberpunkReplay } from "../replay/loadReplay";
import type { CyberpunkReplayOrchestrator } from "../replay/replayOrchestrator";
import classes from "./Replay.module.css";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; orchestrator: CyberpunkReplayOrchestrator };

export function ReplayForkPage() {
  const { gameId = "" } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const step = useMemo(() => Number(searchParams.get("step") ?? "0"), [searchParams]);
  const humanSide = useMemo(() => readForkSide(searchParams), [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoadState({ status: "loading" });
    loadCyberpunkReplay(gameId)
      .then((orchestrator) => {
        if (cancelled) return;
        if (Number.isFinite(step)) {
          orchestrator.goToStep(step);
        }
        setLoadState({ status: "ready", orchestrator });
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to fork replay.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [gameId, step]);

  useEffect(() => {
    return () => {
      if (loadState.status === "ready") {
        loadState.orchestrator.dispose();
      }
    };
  }, [loadState]);

  if (loadState.status === "loading") {
    return <main className={classes.loadingPage}>Forking replay...</main>;
  }

  if (loadState.status === "error") {
    return (
      <main className={classes.loadingPage}>
        <section className={classes.errorPanel}>
          <h1>Fork unavailable</h1>
          <p>{loadState.message}</p>
          <Link className={classes.backLink} to={`/replay/${encodeURIComponent(gameId)}`}>
            Back to replay
          </Link>
        </section>
      </main>
    );
  }

  const { orchestrator } = loadState;
  const ai = forkAiConfig(humanSide);
  if (orchestrator.currentState.G.gameEnded) {
    return (
      <main className={classes.loadingPage}>
        <section className={classes.errorPanel}>
          <h1>Fork unavailable</h1>
          <p>Cannot fork from a terminal game state.</p>
          <Link
            className={classes.backLink}
            to={`/replay/${encodeURIComponent(gameId)}?step=${orchestrator.currentStep}`}
          >
            Back to replay
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={classes.page}>
      <BoardPage
        key={`fork:${orchestrator.currentStep}:${humanSide}`}
        scenarioId={DEFAULT_SCENARIO}
        initialEngineBuilder={() =>
          createLiveMatchViewerEngine(createForkPracticeState(orchestrator.currentState))
        }
        initialAi={ai}
        initialHumanSide={humanSide}
        initialAiMode="auto"
        initialAiSpeed="balanced"
        autoResolveSingletonCardTargets={false}
      />
      <div className={classes.forkHeader}>
        <strong>Forked replay</strong>
        <span>
          Step {orchestrator.currentStep} · controlling {humanSide === "player" ? "P1" : "P2"}
        </span>
        <Link
          className={classes.backLink}
          to={`/replay/${encodeURIComponent(gameId)}?step=${orchestrator.currentStep}`}
        >
          Back
        </Link>
      </div>
    </main>
  );
}

function createForkPracticeState(state: MatchState): MatchState {
  const forkState = structuredClone(state);
  forkState.ctx.timeControl = { mode: "none" };
  delete forkState.ctx.clockState;
  return forkState;
}

function readForkSide(searchParams: URLSearchParams): Side {
  const side = searchParams.get("side");
  if (side === "playerTwo") {
    return "opponent";
  }
  if (side === "playerOne") {
    return "player";
  }
  // Legacy fork links used `control=opponent`; keep that route working when
  // `side` is absent or invalid.
  return searchParams.get("control") === "opponent" ? "opponent" : "player";
}

function forkAiConfig(humanSide: Side): AISideConfig {
  const strategy = getStrategyById("default")?.strategy ?? null;
  return humanSide === "player"
    ? { player: null, opponent: strategy }
    : { player: strategy, opponent: null };
}
