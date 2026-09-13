import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";

import { loadGundamReplay } from "../replay/loadReplay.ts";
import type { GundamReplayOrchestrator } from "../replay/replayOrchestrator.ts";
import {
  createReplayViewerEngine,
  type GundamReplayViewerState,
} from "../src/engine/live/liveState.ts";
import { asViewerId } from "../src/game/types.ts";
import { LiveSimulatorShell } from "./LiveMatch.page.tsx";
import { parseNonNegativeIntegerQuery, syncReplayStepQuery } from "../../../runtime/replayQuery.ts";

type LoadState =
  | { readonly status: "loading" }
  | { readonly status: "error"; readonly message: string }
  | { readonly status: "ready"; readonly orchestrator: GundamReplayOrchestrator };

interface ReplaySnapshot {
  readonly step: number;
  readonly turn: number;
  readonly totalSteps: number;
  readonly totalTurns: number;
  readonly isPlaying: boolean;
  readonly state: GundamReplayViewerState;
}

export function ReplayPage() {
  const { gameId = "" } = useParams<{ gameId: string }>();
  const [search] = useSearchParams();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const requestedStateVersion = parseNonNegativeIntegerQuery(search.get("stateVersion"));
  const requestedCursor = parseNonNegativeIntegerQuery(search.get("step"));
  const preferredSource = search.get("source") === "device" ? "device" : "cloud";

  useEffect(() => {
    let cancelled = false;
    let loadedOrchestrator: GundamReplayOrchestrator | null = null;
    setLoadState({ status: "loading" });
    loadGundamReplay(gameId, preferredSource)
      .then((orchestrator) => {
        if (cancelled) {
          orchestrator.dispose();
          return;
        }
        loadedOrchestrator = orchestrator;
        if (requestedStateVersion !== null) {
          orchestrator.goToStateVersion(requestedStateVersion);
        } else if (requestedCursor !== null) {
          orchestrator.goToStep(requestedCursor);
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
      loadedOrchestrator?.dispose();
    };
  }, [gameId, requestedCursor, requestedStateVersion, preferredSource]);

  if (loadState.status !== "ready") {
    return (
      <SimulatorRouteStatus
        title={loadState.status === "loading" ? "Loading replay" : "Replay unavailable"}
        message={loadState.status === "loading" ? "Fetching the recorded game." : loadState.message}
      />
    );
  }

  return <ReplayBoard orchestrator={loadState.orchestrator} />;
}

function ReplayBoard({ orchestrator }: { readonly orchestrator: GundamReplayOrchestrator }) {
  const snapshot = useReplaySnapshot(orchestrator);
  const { runtime, staticResources, viewerPlayerId } = useMemo(
    () => createReplayViewerEngine(snapshot.state),
    [snapshot.state],
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    const search = syncReplayStepQuery(url.search, snapshot.step);
    window.history.replaceState({}, "", `${url.pathname}${search}`);
  }, [snapshot.step]);

  return (
    <>
      <LiveSimulatorShell
        runtime={runtime}
        staticResources={staticResources}
        viewerId={asViewerId(viewerPlayerId)}
        presentation={orchestrator.presentation}
        remoteSubmit={() => {
          throw new Error("Replay playback is read-only.");
        }}
        getInteractionView={() => undefined}
        getAnimationPackets={() => []}
        getEngineLogRecords={() => []}
        autoPassEnabled={false}
        ended={readEnded(snapshot.state)}
        copyDiagnosticJson={async () => {
          await navigator.clipboard?.writeText(
            JSON.stringify({
              game: "gundam",
              replay: orchestrator.gameId,
              matchId: orchestrator.matchId,
              step: snapshot.step,
              turn: snapshot.turn,
            }),
          );
        }}
        copyFeedback={null}
      />
      <ReplayControls orchestrator={orchestrator} snapshot={snapshot} />
    </>
  );
}

function ReplayControls({
  orchestrator,
  snapshot,
}: {
  readonly orchestrator: GundamReplayOrchestrator;
  readonly snapshot: ReplaySnapshot;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md border border-cyan-300/30 bg-slate-950/90 px-3 py-2 font-mono text-hud-xs text-cyan-100 shadow-lg">
      <button
        type="button"
        className="rounded border px-2 py-1"
        onClick={() => orchestrator.prevTurn()}
      >
        Prev turn
      </button>
      <button
        type="button"
        className="rounded border px-2 py-1"
        onClick={() => orchestrator.prevStep()}
      >
        Prev
      </button>
      <button
        type="button"
        className="rounded border px-2 py-1"
        onClick={() => orchestrator.togglePlay()}
      >
        {snapshot.isPlaying ? "Pause" : "Play"}
      </button>
      <button
        type="button"
        className="rounded border px-2 py-1"
        onClick={() => orchestrator.nextStep()}
      >
        Next
      </button>
      <button
        type="button"
        className="rounded border px-2 py-1"
        onClick={() => orchestrator.nextTurn()}
      >
        Next turn
      </button>
      <span className="px-2">
        Step {snapshot.step}/{snapshot.totalSteps - 1} · Turn {snapshot.turn}/{snapshot.totalTurns}
      </span>
      <Link
        className="rounded border px-2 py-1"
        to={`/replay/${encodeURIComponent(orchestrator.gameId)}/fork?step=${snapshot.step}&side=playerOne`}
      >
        Fork P1
      </Link>
      <Link
        className="rounded border px-2 py-1"
        to={`/replay/${encodeURIComponent(orchestrator.gameId)}/fork?step=${snapshot.step}&side=playerTwo`}
      >
        Fork P2
      </Link>
    </div>
  );
}

function useReplaySnapshot(orchestrator: GundamReplayOrchestrator): ReplaySnapshot {
  const [snapshot, setSnapshot] = useState(() => createReplaySnapshot(orchestrator));

  useEffect(() => {
    setSnapshot(createReplaySnapshot(orchestrator));
    return orchestrator.subscribe(() => setSnapshot(createReplaySnapshot(orchestrator)));
  }, [orchestrator]);

  return snapshot;
}

function createReplaySnapshot(orchestrator: GundamReplayOrchestrator): ReplaySnapshot {
  return {
    step: orchestrator.currentStep,
    turn: orchestrator.currentTurn,
    totalSteps: orchestrator.totalSteps,
    totalTurns: orchestrator.totalTurns,
    isPlaying: orchestrator.isPlaying,
    state: orchestrator.currentState,
  };
}

function readEnded(
  state: GundamReplayViewerState,
): { winnerId: string | null; reason: string | null } | null {
  const status = "ctx" in state ? state.ctx.status : state.status;
  if (!status.gameEnded) return null;
  return {
    winnerId: status.winner ?? null,
    reason: status.winReason ?? null,
  };
}
