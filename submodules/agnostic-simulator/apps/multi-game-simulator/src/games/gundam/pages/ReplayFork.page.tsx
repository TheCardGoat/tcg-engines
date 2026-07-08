import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { loadGundamReplay } from "../replay/loadReplay.ts";
import type { GundamReplayOrchestrator } from "../replay/replayOrchestrator.ts";
import { SimulatorApp } from "../src/SimulatorApp.tsx";
import { createLiveMatchViewerEngine } from "../src/engine/live/liveState.ts";
import { asViewerId } from "../src/game/types.ts";

type LoadState =
  | { readonly status: "loading" }
  | { readonly status: "error"; readonly message: string }
  | { readonly status: "ready"; readonly orchestrator: GundamReplayOrchestrator };

export function ReplayForkPage() {
  const { gameId = "" } = useParams<{ gameId: string }>();
  const [search] = useSearchParams();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const step = Number.parseInt(search.get("step") ?? "0", 10);
  const side = search.get("side") === "playerTwo" ? "playerTwo" : "playerOne";

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
            message: error instanceof Error ? error.message : "Unable to fork replay.",
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
      <main className="min-h-screen grid place-items-center text-hud-text">
        <div className="font-mono text-center space-y-3 px-6">
          <div className="text-hud-xs tracking-hud-label text-hud-text-faint">
            GUNDAM · REPLAY FORK
          </div>
          <div className="text-hud-lg font-bold">
            {loadState.status === "loading" ? "Opening fork" : "Fork unavailable"}
          </div>
          <div className="text-hud-sm text-hud-text-faint max-w-md">
            {loadState.status === "loading"
              ? "Loading the selected replay step."
              : loadState.message}
          </div>
        </div>
      </main>
    );
  }

  return <ReplayForkBoard orchestrator={loadState.orchestrator} step={step} side={side} />;
}

function ReplayForkBoard({
  orchestrator,
  step,
  side,
}: {
  readonly orchestrator: GundamReplayOrchestrator;
  readonly step: number;
  readonly side: "playerOne" | "playerTwo";
}) {
  const state = useMemo(() => orchestrator.stateAt(step), [orchestrator, step]);
  const playerIds = readPlayerIds(state);
  const viewerId = side === "playerTwo" ? (playerIds[1] ?? playerIds[0]) : playerIds[0];
  const { runtime, staticResources, viewerPlayerId } = useMemo(
    () => createLiveMatchViewerEngine(state),
    [state],
  );

  return (
    <>
      <SimulatorApp
        runtime={runtime}
        staticResources={staticResources}
        viewerId={asViewerId(viewerId ?? viewerPlayerId)}
      />
      <div className="fixed left-4 top-4 z-50 rounded-md border border-cyan-300/30 bg-slate-950/90 px-3 py-2 font-mono text-[11px] text-cyan-100 shadow-lg">
        Forked replay step {Math.max(0, step)} as {side === "playerTwo" ? "P2" : "P1"}
      </div>
    </>
  );
}

function readPlayerIds(state: Record<string, unknown>): readonly string[] {
  const ctx = state.ctx as { playerIds?: unknown } | undefined;
  return Array.isArray(ctx?.playerIds)
    ? ctx.playerIds.filter((id): id is string => typeof id === "string")
    : [];
}
