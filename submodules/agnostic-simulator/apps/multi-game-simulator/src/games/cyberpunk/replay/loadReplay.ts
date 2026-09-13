import { loadReplayWithSource } from "@tcg/simulator-runtime";

import { buildReplayDataUrl } from "./fetchReplay";
import { CyberpunkReplayOrchestrator } from "./replayOrchestrator";

export async function loadCyberpunkReplay(
  gameId: string,
  preferredSource: "cloud" | "device" = "cloud",
): Promise<CyberpunkReplayOrchestrator> {
  const { playback } = await loadReplayWithSource({
    gameSlug: "cyberpunk",
    gameId,
    cloudUrl: buildReplayDataUrl("cyberpunk", gameId),
    preferredSource,
  });
  return new CyberpunkReplayOrchestrator(playback);
}
