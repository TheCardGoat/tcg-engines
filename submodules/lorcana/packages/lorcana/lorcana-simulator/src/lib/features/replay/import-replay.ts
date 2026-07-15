/**
 * Import Replay from ZIP File
 *
 * Reads a .zip file previously downloaded from the replay page,
 * extracts replay.json, re-compresses it as gzip, and saves to IndexedDB.
 */

import { unzipSync } from "fflate";
import { saveReplay } from "./replay-store.js";
import type { PersistedReplayData } from "./fetch-replay.js";

const TTL_MS = 14 * 24 * 60 * 60 * 1000;

export class ReplayImportError extends Error {}

/**
 * Parse a .zip File into PersistedReplayData.
 * Throws ReplayImportError if the file is invalid.
 */
async function readZipAsReplayData(
  file: File,
): Promise<{ data: PersistedReplayData; raw: Uint8Array }> {
  const arrayBuffer = await file.arrayBuffer();
  let files: ReturnType<typeof unzipSync>;
  try {
    files = unzipSync(new Uint8Array(arrayBuffer));
  } catch {
    throw new ReplayImportError("Not a valid ZIP file.");
  }

  const replayEntry = files["replay.json"];
  if (!replayEntry) {
    throw new ReplayImportError('ZIP does not contain "replay.json".');
  }

  let parsed: PersistedReplayData;
  try {
    parsed = JSON.parse(new TextDecoder().decode(replayEntry)) as PersistedReplayData;
  } catch {
    throw new ReplayImportError("replay.json is not valid JSON.");
  }

  if (!parsed.gameId || !parsed.playerIds || !parsed.metadata) {
    throw new ReplayImportError("replay.json is missing required fields.");
  }

  return { data: parsed, raw: replayEntry };
}

/**
 * Re-compress raw JSON bytes as gzip using the browser's CompressionStream.
 */
async function gzipBytes(input: Uint8Array): Promise<ArrayBuffer> {
  const stream = new Blob([input.buffer as ArrayBuffer])
    .stream()
    .pipeThrough(
      new CompressionStream("gzip") as unknown as ReadableWritablePair<Uint8Array, Uint8Array>,
    );
  return new Response(stream).arrayBuffer();
}

/**
 * Import a downloaded replay ZIP file into IndexedDB.
 * Returns the gameId of the imported replay.
 */
export async function importReplayFromFile(file: File): Promise<string> {
  if (!file.name.endsWith(".zip")) {
    throw new ReplayImportError("Please select a .zip replay file.");
  }

  const { data, raw } = await readZipAsReplayData(file);
  const compressed = await gzipBytes(raw);

  const firstPlayerId = data.steps?.find((s) => s.acceptedMove.turnNumber === 1)?.acceptedMove
    .actorId;

  await saveReplay({
    gameId: data.gameId,
    matchId: data.matchId,
    savedAt: Date.now(),
    expiresAt: Date.now() + TTL_MS,
    playerIds: data.playerIds,
    totalMoves: data.metadata.totalMoves,
    totalTurns: data.metadata.totalTurns,
    winnerId: data.metadata.winnerId,
    createdAt: data.metadata.createdAt,
    completedAt: data.metadata.completedAt,
    sizeBytes: compressed.byteLength,
    durationMs: data.metadata.durationMs,
    matchType: data.metadata.matchType,
    endReason: data.metadata.endReason,
    players: data.metadata.players,
    deckColors: data.metadata.deckColors,
    firstPlayerId,
    data: compressed,
  });

  return data.gameId;
}
