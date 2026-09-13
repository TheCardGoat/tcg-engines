import { loadReplayWithSource } from "@tcg/simulator-runtime";

import { buildReplayDataUrl } from "./fetchReplay.ts";
import { GundamReplayOrchestrator } from "./replayOrchestrator.ts";

export async function loadGundamReplay(
  gameId: string,
  preferredSource: "cloud" | "device" = "cloud",
): Promise<GundamReplayOrchestrator> {
  const { playback } = await loadReplayWithSource({
    gameSlug: "gundam",
    gameId,
    cloudUrl: buildReplayDataUrl("gundam", gameId),
    preferredSource,
  });
  return new GundamReplayOrchestrator(playback);
}
