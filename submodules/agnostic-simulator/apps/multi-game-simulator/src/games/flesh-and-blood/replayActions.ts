import { fetchReplayPlayback, saveReplayOnDevice } from "@tcg/simulator-runtime";
import { replayDataUrl } from "../../runtime/replayActions";
import { isFabViewerResourcesShape } from "./projection";

/** A stored FAB replay must have the card definitions needed by the board. */
export async function saveFabReplayOnDevice(gameId: string): Promise<void> {
  const playback = await fetchReplayPlayback(
    replayDataUrl("flesh-and-blood", gameId),
    fetch,
    AbortSignal.timeout(20_000),
  );
  if (!isFabViewerResourcesShape(playback.resources)) {
    throw new Error("Replay card data is missing. This game cannot be watched yet.");
  }
  await saveReplayOnDevice("flesh-and-blood", playback);
}
