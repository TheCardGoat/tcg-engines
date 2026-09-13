import {
  downloadReplayArchive,
  fetchAndSaveReplay,
  fetchReplayPlayback,
} from "@tcg/simulator-runtime";
import type { GameSlug } from "@tcg/simulator-contract";
import { playUrl } from "./gameRuntimeApi";

export function replayDataUrl(gameSlug: GameSlug, gameId: string): string {
  return playUrl(gameSlug, `/replays/${encodeURIComponent(gameId)}`);
}

export async function saveHostedReplayOnDevice(gameSlug: GameSlug, gameId: string) {
  return fetchAndSaveReplay(replayDataUrl(gameSlug, gameId), gameSlug);
}

export async function downloadHostedReplay(gameSlug: GameSlug, gameId: string): Promise<void> {
  const playback = await fetchReplayPlayback(replayDataUrl(gameSlug, gameId));
  downloadReplayArchive(playback);
}
