/**
 * Download Replay as ZIP
 *
 * Fetches replay data from the API, packages it into a .zip file
 * containing replay.json, and triggers a browser download.
 * Analytics are embedded into metadata.analytics when provided.
 */

import { zipSync } from "fflate";
import { fetchReplayBlob, decompressReplayBlob } from "./fetch-replay.js";
import type { GameAnalyticsSummary } from "@/features/simulator/post-game/notes-api.js";

/**
 * Download replay data as a .zip file.
 * If analytics is provided, it is embedded into the replay metadata before packaging.
 */
export async function downloadReplayZip(
  gameId: string,
  analytics?: GameAnalyticsSummary,
): Promise<void> {
  const compressed = await fetchReplayBlob(gameId);
  const data = await decompressReplayBlob(compressed);
  if (analytics) data.metadata.analytics = analytics;

  const json = new TextEncoder().encode(JSON.stringify(data, null, 2));
  const zipped = zipSync({ "replay.json": json });
  const blob = new Blob([new Uint8Array(zipped)], { type: "application/zip" });

  triggerBrowserDownload(blob, buildFilename(data.metadata.createdAt, data.gameId, data.matchId));
}

/**
 * Download replay from an already-loaded ArrayBuffer (e.g., from IndexedDB).
 * Avoids an extra API call.
 * If analytics is provided, it is embedded into the replay metadata before packaging.
 */
export async function downloadReplayZipFromBlob(
  gameId: string,
  compressedBlob: ArrayBuffer,
  analytics?: GameAnalyticsSummary,
): Promise<void> {
  const data = await decompressReplayBlob(compressedBlob);
  if (analytics) data.metadata.analytics = analytics;

  const json = new TextEncoder().encode(JSON.stringify(data, null, 2));
  const zipped = zipSync({ "replay.json": json });
  const blob = new Blob([new Uint8Array(zipped)], { type: "application/zip" });

  triggerBrowserDownload(blob, buildFilename(data.metadata.createdAt, data.gameId, data.matchId));
}

function buildFilename(createdAt: string, gameId: string, matchId: string): string {
  const date = new Date(createdAt).toISOString().slice(0, 10).replace(/-/g, "");
  return `replay-${date}-${gameId}-${matchId}.zip`;
}

function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
