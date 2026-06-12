import { decompressReplayBlob, loadReplayBlobForPlayback } from "./fetchReplay";
import { CyberpunkReplayOrchestrator } from "./replayOrchestrator";

export async function loadCyberpunkReplay(gameId: string): Promise<CyberpunkReplayOrchestrator> {
  console.info("[CyberpunkReplay] Loading replay", { gameId });
  try {
    const { blob, source } = await loadReplayBlobForPlayback(gameId);
    console.info("[CyberpunkReplay] Loaded replay blob", {
      gameId,
      source,
      bytes: blob.byteLength,
    });

    const replay = await decompressReplayBlob(blob);
    console.info("[CyberpunkReplay] Decompressed replay", {
      gameId: replay.gameId,
      matchId: replay.matchId,
      gameType: replay.gameType,
      players: replay.playerIds,
      steps: replay.steps.length,
      totalMoves: replay.metadata.totalMoves,
      totalTurns: replay.metadata.totalTurns,
      createdAt: replay.metadata.createdAt,
      completedAt: replay.metadata.completedAt,
    });

    const orchestrator = new CyberpunkReplayOrchestrator(replay);
    console.info("[CyberpunkReplay] Replay orchestrator ready", {
      gameId: replay.gameId,
      states: orchestrator.totalSteps,
      turns: orchestrator.totalTurns,
      hasPatchData: orchestrator.hasPatchData,
    });
    return orchestrator;
  } catch (error) {
    console.error("[CyberpunkReplay] Replay load failed", { gameId, error });
    throw error;
  }
}
