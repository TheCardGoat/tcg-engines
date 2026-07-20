import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { loadGundamReplay } from "../replay/loadReplay.ts";
import type { GundamReplayOrchestrator } from "../replay/replayOrchestrator.ts";
import { createLiveMatchViewerEngine } from "../src/engine/live/liveState.ts";
import { asViewerId } from "../src/game/types.ts";
import { LiveSimulatorShell } from "./LiveMatch.page.tsx";

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
  readonly state: Record<string, unknown>;
}

export function ReplayPage() {
  const { gameId = "" } = useParams<{ gameId: string }>();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    let loadedOrchestrator: GundamReplayOrchestrator | null = null;
    setLoadState({ status: "loading" });
    loadGundamReplay(gameId)
      .then((orchestrator) => {
        if (cancelled) {
          orchestrator.dispose();
          return;
        }
        loadedOrchestrator = orchestrator;
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
  }, [gameId]);

  if (loadState.status !== "ready") {
    return (
      <ReplayStatus
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
    () => createLiveMatchViewerEngine(snapshot.state),
    [snapshot.state],
  );

  return (
    <>
      <LiveSimulatorShell
        runtime={runtime}
        staticResources={staticResources}
        viewerId={asViewerId(viewerPlayerId)}
        remoteSubmit={() => {
          throw new Error("Replay playback is read-only.");
        }}
        getInteractionView={() => undefined}
        getAnimationPackets={() => []}
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
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md border border-cyan-300/30 bg-slate-950/90 px-3 py-2 font-mono text-[11px] text-cyan-100 shadow-lg">
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

function ReplayStatus({ title, message }: { readonly title: string; readonly message: string }) {
  return (
    <main className="min-h-screen grid place-items-center text-hud-text">
      <div className="font-mono text-center space-y-3 px-6">
        <div className="text-hud-xs tracking-hud-label text-hud-text-faint">GUNDAM · REPLAY</div>
        <div className="text-hud-lg font-bold">{title}</div>
        <div className="text-hud-sm text-hud-text-faint max-w-md">{message}</div>
      </div>
    </main>
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
  state: Record<string, unknown>,
): { winnerId: string | null; reason: string | null } | null {
  const ctx = state.ctx as
    | { status?: { gameEnded?: unknown; winner?: unknown; reason?: unknown } }
    | undefined;
  const status = ctx?.status;
  if (!status?.gameEnded) return null;
  return {
    winnerId: typeof status.winner === "string" ? status.winner : null,
    reason: typeof status.reason === "string" ? status.reason : null,
  };
}
