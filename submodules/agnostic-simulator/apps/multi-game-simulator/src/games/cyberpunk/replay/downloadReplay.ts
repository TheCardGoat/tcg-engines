import { zipSync } from "fflate";
import type { CyberpunkGameAnalyticsRecord } from "../components/EndGameModal/postGameApi";
import { decompressReplayBlob, fetchReplayBlob } from "./fetchReplay";

export async function downloadReplayZip(
  gameId: string,
  analytics?: CyberpunkGameAnalyticsRecord,
): Promise<void> {
  const compressed = await fetchReplayBlob(gameId);
  await downloadReplayZipFromBlob(gameId, compressed, analytics);
}

export async function downloadReplayZipFromBlob(
  _gameId: string,
  compressedBlob: ArrayBuffer,
  analytics?: CyberpunkGameAnalyticsRecord,
): Promise<void> {
  const data = await decompressReplayBlob(compressedBlob);
  if (analytics) {
    data.metadata.analytics = analytics;
  }

  const replayJson = new TextEncoder().encode(JSON.stringify(data, null, 2));
  const zipped = zipSync({ "replay.json": replayJson });
  const blob = new Blob([new Uint8Array(zipped)], { type: "application/zip" });

  triggerBrowserDownload(
    blob,
    buildReplayFilename(data.metadata.createdAt, data.gameId, data.matchId),
  );
}

function buildReplayFilename(createdAt: string, gameId: string, matchId: string): string {
  const date = new Date(createdAt).toISOString().slice(0, 10).replace(/-/g, "");
  return `cyberpunk-replay-${date}-${gameId}-${matchId}.zip`;
}

function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 100);
}
