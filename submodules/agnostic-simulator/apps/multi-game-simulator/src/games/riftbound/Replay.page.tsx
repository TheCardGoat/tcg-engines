import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  ReplayPlaybackController,
  type ReplayPlaybackSnapshot,
} from "@tcg/simulator-runtime/replay-playback";
import { loadReplayWithSource } from "@tcg/simulator-runtime/replay-library";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import { playUrl } from "../../runtime/gameRuntimeApi";
import { isRiftboundClientMatchStateV1 } from "./state";
import { RiftboundTabletop } from "./RiftboundTabletop";

export function RiftboundReplayPage() {
  const { gameId = "" } = useParams<{ gameId: string }>();
  const [search] = useSearchParams();
  const preferredSource = search.get("source") === "device" ? "device" : "cloud";
  const [controller, setController] = useState<ReplayPlaybackController | null>(null);
  const [snapshot, setSnapshot] = useState<ReplayPlaybackSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let active: ReplayPlaybackController | null = null;
    let unsubscribe: (() => void) | null = null;
    loadReplayWithSource({
      gameSlug: "riftbound",
      gameId,
      cloudUrl: playUrl("riftbound", `/replays/${encodeURIComponent(gameId)}`),
      preferredSource,
    })
      .then(({ playback }) => {
        if (playback.replay.gameType !== "riftbound") {
          throw new Error("Replay is not a Riftbound recording.");
        }
        active = new ReplayPlaybackController(playback);
        if (cancelled) return active.dispose();
        unsubscribe = active.subscribe(setSnapshot);
        setController(active);
      })
      .catch(
        (reason) =>
          !cancelled && setError(reason instanceof Error ? reason.message : "Replay unavailable"),
      );
    return () => {
      cancelled = true;
      unsubscribe?.();
      active?.dispose();
    };
  }, [gameId, preferredSource]);

  if (error) return <SimulatorRouteStatus title="Replay unavailable" message={error} />;
  if (!controller || !snapshot) return <SimulatorRouteStatus title="Loading replay" />;
  if (!isRiftboundClientMatchStateV1(snapshot.state)) {
    return <SimulatorRouteStatus title="Replay unavailable" message="Invalid Riftbound state." />;
  }
  const state = snapshot.state;
  const viewerId = controller.playback.replay.participants[0]?.id ?? state.players[0];
  return (
    <RiftboundTabletop
      sessionKey={`riftbound:replay:${gameId}:${viewerId}`}
      state={state}
      viewerId={viewerId}
      readOnly
      replayControls={
        <nav className="riftbound-replay-actions" aria-label="Replay navigation">
          <button
            type="button"
            disabled={snapshot.cursor === 0}
            onClick={() => controller.previous()}
          >
            Previous
          </button>
          <span>
            {snapshot.cursor + 1} / {snapshot.totalSteps + 1}
          </span>
          <button
            type="button"
            disabled={snapshot.cursor === snapshot.totalSteps}
            onClick={() => controller.next()}
          >
            Next
          </button>
        </nav>
      }
    />
  );
}
