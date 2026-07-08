import { decompressReplayBlob, fetchReplayBlob } from "./fetchReplay.ts";
import { GundamReplayOrchestrator } from "./replayOrchestrator.ts";

export async function loadGundamReplay(gameId: string): Promise<GundamReplayOrchestrator> {
  const replay = await decompressReplayBlob(await fetchReplayBlob(gameId));
  return new GundamReplayOrchestrator(replay);
}
