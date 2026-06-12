import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type ReactNode,
} from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  IconArrowBackUp,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGitFork,
  IconGripVertical,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import type { MatchState, MoveLog } from "@tcg/cyberpunk-engine";
import type { EngineInteractionView, InteractionSubmissionValue } from "@tcg/protocol";
import { createLiveMatchViewerEngine } from "../engine/live/liveState";
import { PLAYER_SIDE_TO_ID, type EngineAction, type Side } from "../engine";
import { BoardPage } from "./Board.page";
import { loadCyberpunkReplay } from "../replay/loadReplay";
import type { CyberpunkReplayOrchestrator } from "../replay/replayOrchestrator";
import classes from "./Replay.module.css";

const SPEEDS = [
  { label: "0.5x", ms: 1600 },
  { label: "1x", ms: 800 },
  { label: "2x", ms: 400 },
  { label: "4x", ms: 150 },
] as const;

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; orchestrator: CyberpunkReplayOrchestrator };

export function ReplayPage() {
  const { gameId = "" } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [speedIndex, setSpeedIndex] = useState(1);
  const [showForkMenu, setShowForkMenu] = useState(false);
  const initialStep = useMemo(() => Number(searchParams.get("step") ?? "0"), [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoadState({ status: "loading" });
    loadCyberpunkReplay(gameId)
      .then((orchestrator) => {
        if (cancelled) return;
        if (Number.isFinite(initialStep) && initialStep > 0) {
          orchestrator.goToStep(initialStep);
        }
        setLoadState({ status: "ready", orchestrator });
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to load replay.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [gameId, initialStep]);

  useEffect(() => {
    return () => {
      if (loadState.status === "ready") {
        loadState.orchestrator.dispose();
      }
    };
  }, [loadState]);

  if (loadState.status === "loading") {
    return <LoadingPage>Loading replay...</LoadingPage>;
  }

  if (loadState.status === "error") {
    return (
      <LoadingPage>
        <section className={classes.errorPanel}>
          <h1>Replay unavailable</h1>
          <p>{loadState.message}</p>
          <Link className={classes.backLink} to="/matchmaking">
            Back to matchmaking
          </Link>
        </section>
      </LoadingPage>
    );
  }

  const { orchestrator } = loadState;
  const cycleSpeed = () => {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    orchestrator.setSpeed(SPEEDS[next]?.ms ?? 800);
  };

  return (
    <ReplayBoard
      orchestrator={orchestrator}
      speedLabel={SPEEDS[speedIndex]?.label ?? "1x"}
      onCycleSpeed={cycleSpeed}
      showForkMenu={showForkMenu}
      setShowForkMenu={setShowForkMenu}
    />
  );
}

function ReplayBoard({
  orchestrator,
  speedLabel,
  onCycleSpeed,
  showForkMenu,
  setShowForkMenu,
}: {
  orchestrator: CyberpunkReplayOrchestrator;
  speedLabel: string;
  onCycleSpeed: () => void;
  showForkMenu: boolean;
  setShowForkMenu: (open: boolean) => void;
}) {
  const snapshot = useReplaySnapshot(orchestrator);
  const postGameContext = useMemo(() => replayPostGameContext(orchestrator), [orchestrator]);
  const remoteDispatch = useCallback(
    (
      _action: EngineAction,
      _state: MatchState,
      _actor: {
        side: Side;
        interactionView: EngineInteractionView;
        submission: unknown;
        optimisticResult?: unknown;
      },
    ) => false,
    [],
  );
  const remoteSubmitInteraction = useCallback(
    (
      _submission: {
        side: Side;
        interactionView: EngineInteractionView;
        actionId: string;
        values: Record<string, InteractionSubmissionValue>;
      },
      _state: MatchState,
    ) => false,
    [],
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (snapshot.step === 0) {
      url.searchParams.delete("step");
    } else {
      url.searchParams.set("step", String(snapshot.step));
    }
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }, [snapshot.step]);

  return (
    <main className={classes.page}>
      <BoardPage
        key={`replay:${snapshot.step}`}
        initialEngineBuilder={() => createLiveMatchViewerEngine(snapshot.state)}
        initialAi={{ player: null, opponent: null }}
        initialHumanSide="player"
        initialAiMode="step"
        autoResolveSingletonCardTargets={false}
        remoteDispatch={remoteDispatch}
        remoteSubmitInteraction={remoteSubmitInteraction}
        remoteMoveLogs={snapshot.moveLogs}
        remoteReturnUrl="/matchmaking"
        postGameContext={postGameContext}
        lockLocalHistoryControls
        lockLocalResetControls
      />

      <ReplayControls
        orchestrator={orchestrator}
        snapshot={snapshot}
        speedLabel={speedLabel}
        onCycleSpeed={onCycleSpeed}
        onFork={() => {
          orchestrator.pause();
          setShowForkMenu(true);
        }}
      />

      {showForkMenu ? (
        <div className={classes.forkMenu} role="dialog" aria-label="Choose a side to play">
          <Link
            to={`/replay/${encodeURIComponent(orchestrator.gameId)}/fork?step=${snapshot.step}&side=playerOne`}
            reloadDocument
          >
            Play as P1
          </Link>
          <Link
            to={`/replay/${encodeURIComponent(orchestrator.gameId)}/fork?step=${snapshot.step}&side=playerTwo`}
            reloadDocument
          >
            Play as P2
          </Link>
          <button type="button" onClick={() => setShowForkMenu(false)}>
            Cancel
          </button>
        </div>
      ) : null}
    </main>
  );
}

function ReplayControls({
  orchestrator,
  snapshot,
  speedLabel,
  onCycleSpeed,
  onFork,
}: {
  orchestrator: CyberpunkReplayOrchestrator;
  snapshot: ReplaySnapshot;
  speedLabel: string;
  onCycleSpeed: () => void;
  onFork: () => void;
}) {
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const activeSide = replayActiveSide(snapshot.state);
  const controlClasses = [
    classes.controls,
    activeSide === "player" ? classes.controlsPlayerActive : classes.controlsOpponentActive,
    dragPosition ? classes.controlsDragged : "",
  ]
    .filter(Boolean)
    .join(" ");
  const dragStyle: CSSProperties | undefined = dragPosition
    ? { left: dragPosition.x, top: dragPosition.y }
    : undefined;

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", "replay-controls");
  };

  const handleDragEnd = (event: DragEvent<HTMLDivElement>) => {
    if (event.clientX <= 0 && event.clientY <= 0) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const nextX = clamp(
      event.clientX - dragOffsetRef.current.x,
      8,
      Math.max(8, window.innerWidth - rect.width - 8),
    );
    const nextY = clamp(
      event.clientY - dragOffsetRef.current.y,
      8,
      Math.max(8, window.innerHeight - rect.height - 8),
    );
    setDragPosition({ x: nextX, y: nextY });
  };

  return (
    <div
      className={controlClasses}
      style={dragStyle}
      aria-label="Replay controls"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <span
        className={classes.dragHandle}
        draggable
        role="button"
        aria-label="Move replay controls"
        title="Drag to move replay controls"
      >
        <IconGripVertical size={16} />
      </span>
      <div className={classes.controlGroup}>
        <Link className={classes.iconButton} to="/matchmaking" title="Back">
          <IconArrowBackUp size={18} />
        </Link>
      </div>
      <div className={classes.controlGroup}>
        <button
          className={classes.iconButton}
          type="button"
          onClick={() => orchestrator.goToStep(0)}
          disabled={!snapshot.hasPatchData || snapshot.step === 0}
          title="Go to start"
        >
          <IconPlayerSkipBack size={18} />
        </button>
        <button
          className={classes.iconButton}
          type="button"
          onClick={() => orchestrator.prevTurn()}
          disabled={!snapshot.hasPatchData || snapshot.step === 0}
          title="Previous turn"
        >
          <IconChevronsLeft size={18} />
        </button>
        <button
          className={classes.iconButton}
          type="button"
          onClick={() => orchestrator.prevStep()}
          disabled={!snapshot.hasPatchData || snapshot.step === 0}
          title="Previous step"
        >
          <IconChevronLeft size={18} />
        </button>
        <button
          className={`${classes.iconButton} ${classes.primaryButton}`}
          type="button"
          onClick={() => orchestrator.togglePlay()}
          disabled={!snapshot.hasPatchData}
          title={snapshot.isPlaying ? "Pause" : "Play"}
        >
          {snapshot.isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
        </button>
        <button
          className={classes.iconButton}
          type="button"
          onClick={() => orchestrator.nextStep()}
          disabled={!snapshot.hasPatchData || snapshot.isAtEnd}
          title="Next step"
        >
          <IconChevronRight size={18} />
        </button>
        <button
          className={classes.iconButton}
          type="button"
          onClick={() => orchestrator.nextTurn()}
          disabled={!snapshot.hasPatchData || snapshot.isAtEnd}
          title="Next turn"
        >
          <IconChevronsRight size={18} />
        </button>
        <button
          className={classes.iconButton}
          type="button"
          onClick={() => orchestrator.goToStep(snapshot.totalSteps - 1)}
          disabled={!snapshot.hasPatchData || snapshot.isAtEnd}
          title="Go to end"
        >
          <IconPlayerSkipForward size={18} />
        </button>
      </div>
      <div className={classes.position}>
        {snapshot.currentTurn > 0 ? (
          <>
            T<strong>{snapshot.currentTurn}</strong> ·{" "}
          </>
        ) : null}
        <strong>{snapshot.step}</strong>/{snapshot.totalSteps - 1}
      </div>
      <button className={classes.textButton} type="button" onClick={onCycleSpeed}>
        {speedLabel}
      </button>
      <button
        className={`${classes.textButton} ${classes.primaryButton}`}
        type="button"
        onClick={onFork}
        disabled={!snapshot.hasPatchData || snapshot.isAtEnd}
        title="Play from this position against the AI"
      >
        <IconGitFork size={16} />
        Play from Here
      </button>
    </div>
  );
}

function replayActiveSide(state: MatchState): Side {
  const activePlayerId = String(state.G.turnMetadata.activePlayerId);
  return activePlayerId === String(PLAYER_SIDE_TO_ID.opponent) ? "opponent" : "player";
}

function replayPostGameContext(orchestrator: CyberpunkReplayOrchestrator) {
  const metadata = orchestrator.metadata;
  return {
    gameId: orchestrator.gameId,
    matchId: orchestrator.matchId,
    gameNumber: 1,
    format: metadata.matchType === "best_of_3" ? "best_of_3" : "best_of_1",
    matchStatus: "completed",
    currentGameId: orchestrator.gameId,
    actorIds: {
      player: orchestrator.playerIds[0],
      opponent: orchestrator.playerIds[1],
    },
    ...(metadata.analytics
      ? { analytics: { status: "saved", payload: metadata.analytics } as const }
      : {}),
  } as const;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

interface ReplaySnapshot {
  step: number;
  totalSteps: number;
  currentTurn: number;
  isPlaying: boolean;
  isAtEnd: boolean;
  hasPatchData: boolean;
  state: MatchState;
  moveLogs: MoveLog[];
}

function useReplaySnapshot(orchestrator: CyberpunkReplayOrchestrator): ReplaySnapshot {
  const [snapshot, setSnapshot] = useState<ReplaySnapshot>(() =>
    createReplaySnapshot(orchestrator),
  );

  useEffect(
    () =>
      orchestrator.subscribe(() => {
        setSnapshot(createReplaySnapshot(orchestrator));
      }),
    [orchestrator],
  );

  return snapshot;
}

function createReplaySnapshot(orchestrator: CyberpunkReplayOrchestrator): ReplaySnapshot {
  return {
    step: orchestrator.currentStep,
    totalSteps: orchestrator.totalSteps,
    currentTurn: orchestrator.currentTurn,
    isPlaying: orchestrator.isPlaying,
    isAtEnd: orchestrator.isAtEnd,
    hasPatchData: orchestrator.hasPatchData,
    state: orchestrator.currentState,
    moveLogs: orchestrator.currentMoveLogs,
  };
}

function LoadingPage({ children }: { children: ReactNode }) {
  return <main className={classes.loadingPage}>{children}</main>;
}
