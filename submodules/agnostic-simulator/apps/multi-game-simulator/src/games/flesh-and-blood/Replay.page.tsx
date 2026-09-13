import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { ActionIcon, Button, Group, Select, Slider } from "@mantine/core";
import {
  ArrowLeft,
  GitFork,
  Minus,
  Pause,
  Play,
  Plus,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
} from "lucide-react";
import styles from "./ReplayPlayer.module.css";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import {
  loadReplayWithSource,
  ReplayPlaybackController,
  REPLAY_MOVE_INTERVAL_MS,
} from "@tcg/simulator-runtime";
import { materializeReplayFrameAtCursor } from "@tcg/game-page-contract/replay-materializer";
import { replayStepPosition } from "@tcg/game-page-contract/replay";
import { playUrl } from "../../runtime/gameRuntimeApi";
import { parseNonNegativeIntegerQuery, syncReplayStepQuery } from "../../runtime/replayQuery";
import { FleshAndBloodTabletop } from "./FleshAndBloodTabletop";
import {
  FabPresentationCatalogProvider,
  useFabPresentationRegistry,
} from "./FabPresentationCatalog";
import { useFabCardPresentation } from "./useFabCardPresentation";
import { coerceFabPresentationState, isFabViewerResourcesShape } from "./projection";
import { appendFabEngineLogRecords, useFabMatchHistory } from "./use-fab-event-log";

type ReplayLoad =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; controller: ReplayPlaybackController };

export function FabReplayPage() {
  const { gameId = "" } = useParams();
  const [search] = useSearchParams();
  const requestedStep = parseNonNegativeIntegerQuery(search.get("step"));
  const requestedVersion = parseNonNegativeIntegerQuery(search.get("stateVersion"));
  const preferredSource = search.get("source") === "device" ? "device" : "cloud";
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [load, setLoad] = useState<ReplayLoad>({ status: "loading" });
  useEffect(() => {
    let cancelled = false;
    let controller: ReplayPlaybackController | undefined;
    setLoad({ status: "loading" });
    void loadReplayWithSource({
      gameSlug: "flesh-and-blood",
      gameId,
      cloudUrl: playUrl("flesh-and-blood", `/replays/${encodeURIComponent(gameId)}`),
      preferredSource,
    })
      .then(({ playback }) => {
        if (cancelled) return;
        if (playback.replay.gameType !== "flesh-and-blood")
          throw new Error("This is not a Flesh and Blood replay.");
        controller = new ReplayPlaybackController(playback);
        if (requestedVersion !== null) controller.seekStateVersion(requestedVersion);
        else if (requestedStep !== null) controller.seek(requestedStep);
        setLoad({ status: "ready", controller });
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setLoad({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to load replay.",
          });
      });
    return () => {
      cancelled = true;
      controller?.dispose();
    };
  }, [gameId, requestedStep, requestedVersion, preferredSource, loadAttempt]);
  if (load.status !== "ready")
    return (
      <SimulatorRouteStatus
        title={load.status === "loading" ? "Loading replay" : "Replay unavailable"}
        message={load.status === "loading" ? "Fetching the recorded game." : load.message}
        action={
          load.status === "error" ? (
            <Group justify="center">
              <Button onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Retry</Button>
              <Button component={Link} variant="default" to="/flesh-and-blood/matchmaking">
                Back to matchmaking
              </Button>
            </Group>
          ) : null
        }
      />
    );
  return (
    <FabPresentationCatalogProvider key={gameId}>
      <FabReplayBoard controller={load.controller} />
    </FabPresentationCatalogProvider>
  );
}

function FabReplayBoard({ controller }: { controller: ReplayPlaybackController }) {
  const [snapshot, setSnapshot] = useState(() => controller.snapshot);
  const replay = controller.playback.replay;
  const [viewerId, setViewerId] = useState(replay.participants[0]?.id ?? "");
  const registry = useFabPresentationRegistry();
  useEffect(() => controller.subscribe(setSnapshot), [controller]);
  const frame = useMemo(
    () => materializeReplayFrameAtCursor(controller.playback, snapshot.cursor),
    [controller, snapshot.cursor],
  );
  const definitions = useMemo(
    () =>
      isFabViewerResourcesShape(frame.resources)
        ? Object.values(frame.resources.cardDefinitions)
        : [],
    [frame.resources],
  );
  useFabCardPresentation(definitions, `${replay.gameId}:${snapshot.cursor}`);
  const [artRevision, setArtRevision] = useState(0);
  useEffect(() => registry.subscribe(() => setArtRevision((revision) => revision + 1)), [registry]);
  const state = useMemo(
    () =>
      coerceFabPresentationState(
        frame.state,
        viewerId,
        frame.resources,
        frame.presentationBindings?.printingIdByInstanceId,
        registry.getSnapshot().resolver,
      ),
    [frame, viewerId, registry, artRevision],
  );
  const records = useMemo(
    () =>
      appendFabEngineLogRecords(
        [],
        replay.steps.slice(0, snapshot.cursor).flatMap((step) =>
          step.logs.map((entry) => ({
            stateVersion: replayStepPosition(step).stateVersion,
            timestamp: replayStepPosition(step).timestamp,
            log: entry.data,
          })),
        ),
      ),
    [replay, snapshot.cursor],
  );
  const seatIds = useMemo(() => replay.participants.map((participant) => participant.id), [replay]);
  const history = useFabMatchHistory({
    records,
    viewerId,
    seatIds,
    firstTurnPlayerId: state?.firstTurnPlayerId,
  });
  useEffect(() => {
    const url = new URL(window.location.href);
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${syncReplayStepQuery(url.search, snapshot.cursor)}`,
    );
  }, [snapshot.cursor]);
  if (!state)
    return (
      <SimulatorRouteStatus
        title="Replay unavailable"
        message="The recorded board or card resources are incomplete."
      />
    );
  const seek = (cursor: number) => {
    controller.pause();
    controller.seek(cursor);
  };
  const turnAt = (cursor: number) => {
    const step = replay.steps[cursor - 1];
    return step ? replayStepPosition(step).turnNumber : 1;
  };
  const nextTurn = () => {
    const index = replay.steps.findIndex(
      (step, index) =>
        index >= snapshot.cursor && replayStepPosition(step).turnNumber > turnAt(snapshot.cursor),
    );
    seek(index < 0 ? snapshot.totalSteps : index + 1);
  };
  const previousTurn = () => {
    const turn = turnAt(snapshot.cursor);
    let cursor = snapshot.cursor - 1;
    while (cursor > 0 && turnAt(cursor) >= turn) cursor -= 1;
    while (cursor > 1 && turnAt(cursor - 1) === turnAt(cursor)) cursor -= 1;
    seek(Math.max(0, cursor));
  };
  const result = state.result;
  const winnerName =
    result?.kind === "win"
      ? (replay.participants.find((participant) => participant.id === result.winnerId)
          ?.displayName ?? "Winner")
      : undefined;
  return (
    <FleshAndBloodTabletop
      sessionKey={`replay:${replay.gameId}`}
      state={state}
      viewerId={viewerId}
      readOnly
      animationTransition={{
        mode: "sync",
        plan: null,
        version: snapshot.cursor,
        correlationId: `replay:${snapshot.cursor}:${viewerId}`,
      }}
      participantPresentation={Object.fromEntries(
        replay.participants.map((participant) => [
          participant.id,
          { displayName: participant.displayName },
        ]),
      )}
      matchHistory={history}
      replayControls={
        <section className={styles.player} aria-label="Replay player">
          <div className={styles.position}>
            <strong>Turn {state.turnNumber}</strong>
            <span>
              Move {snapshot.cursor} / {snapshot.totalSteps}
            </span>
          </div>
          <Slider
            thumbLabel="Replay position"
            color="var(--fab-priority-self)"
            size="sm"
            min={0}
            max={Math.max(1, snapshot.totalSteps)}
            disabled={snapshot.totalSteps === 0}
            value={snapshot.cursor}
            onChange={seek}
            label={(value) => `Move ${value}`}
          />
          <div className={styles.transport} role="group" aria-label="Playback controls">
            <ActionIcon
              variant="subtle"
              aria-label="Previous turn"
              title="Previous turn"
              disabled={snapshot.cursor === 0}
              onClick={previousTurn}
            >
              <SkipBack size={17} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              aria-label="Previous move"
              title="Previous move"
              disabled={snapshot.cursor === 0}
              onClick={() => seek(snapshot.cursor - 1)}
            >
              <StepBack size={19} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              className={styles.play}
              aria-label={snapshot.isPlaying ? "Pause" : "Play"}
              title={snapshot.isPlaying ? "Pause" : "Play"}
              disabled={snapshot.totalSteps === 0}
              onClick={() => (snapshot.isPlaying ? controller.pause() : controller.play())}
            >
              {snapshot.isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              aria-label="Next move"
              title="Next move"
              disabled={snapshot.cursor === snapshot.totalSteps}
              onClick={() => seek(snapshot.cursor + 1)}
            >
              <StepForward size={19} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              aria-label="Next turn"
              title="Next turn"
              disabled={snapshot.cursor === snapshot.totalSteps}
              onClick={nextTurn}
            >
              <SkipForward size={17} />
            </ActionIcon>
          </div>
          <div className={styles.speed} role="group" aria-label="Playback speed">
            <ActionIcon
              variant="subtle"
              aria-label="Decrease playback speed"
              title="Slower"
              disabled={snapshot.speed <= 0.25}
              onClick={() => controller.setSpeed(Math.max(0.25, snapshot.speed / 2))}
            >
              <Minus size={14} />
            </ActionIcon>
            <span>
              <strong>{snapshot.speed}×</strong>
              <small>
                {Number((REPLAY_MOVE_INTERVAL_MS / 1000 / snapshot.speed).toFixed(2))}s / move
              </small>
            </span>
            <ActionIcon
              variant="subtle"
              aria-label="Increase playback speed"
              title="Faster"
              disabled={snapshot.speed >= 4}
              onClick={() => controller.setSpeed(Math.min(4, snapshot.speed * 2))}
            >
              <Plus size={14} />
            </ActionIcon>
          </div>
          {state.result ? (
            <p className={styles.result} role="status">
              {state.result.kind === "draw" ? "Draw" : `${winnerName} wins`} · {state.result.reason}
            </p>
          ) : null}
          {state.result ? (
            <Button
              fullWidth
              size="xs"
              color="var(--fab-priority-self)"
              c="var(--board-bg)"
              variant="light"
              disabled
              leftSection={<GitFork size={16} />}
            >
              Fork game
            </Button>
          ) : (
            <Button
              fullWidth
              size="xs"
              color="var(--fab-priority-self)"
              c="var(--board-bg)"
              variant="light"
              leftSection={<GitFork size={16} />}
              component={Link}
              onClick={() => controller.pause()}
              to={`/flesh-and-blood/simulator/replay/${encodeURIComponent(replay.gameId)}/fork?step=${snapshot.cursor}&side=${viewerId === replay.participants[1]?.id ? "playerTwo" : "playerOne"}`}
            >
              Fork game
            </Button>
          )}
          {state.result ? (
            <p className={styles.hint}>Step back to fork a playable position.</p>
          ) : null}
          <Select
            classNames={{
              root: styles.perspective,
              label: styles.perspectiveLabel,
              wrapper: styles.perspectiveInput,
            }}
            size="xs"
            label="View from"
            value={viewerId}
            data={replay.participants.map((participant) => ({
              value: participant.id,
              label: participant.displayName,
            }))}
            onChange={(value) => {
              if (value) setViewerId(value);
            }}
          />
          <Link className={styles.back} to="/flesh-and-blood/matchmaking">
            <ArrowLeft size={13} /> Matchmaking
          </Link>
        </section>
      }
    />
  );
}
