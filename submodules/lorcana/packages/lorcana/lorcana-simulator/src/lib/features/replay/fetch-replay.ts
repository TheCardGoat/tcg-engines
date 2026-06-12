/**
 * Replay Fetch & Decompress Helpers
 *
 * Fetches compressed replay data from the game server API and decompresses it.
 */

import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestArrayBuffer } from "$lib/data/transport/http-client.js";
import type { PlayerMatchMetadata } from "@/features/simulator/model/player-match-metadata.js";
import type { GameAnalyticsSummary } from "@/features/simulator/post-game/notes-api.js";
import { isReplayStoreAvailable, loadReplayData } from "./replay-store.js";

export interface ReplayPlayerInfo {
  id: string;
  displayName: string | null;
  username: string | null;
}

export interface PersistedReplayMetadata {
  totalMoves: number;
  totalTurns: number;
  durationMs?: number;
  createdAt: string;
  completedAt: string;
  winnerId?: string;
  endReason?: string;
  matchType?: string;
  authority?: "server" | "client";
  players?: [ReplayPlayerInfo, ReplayPlayerInfo];
  deckColors?: { player1: string[]; player2: string[] };
  /** Full analytics summary embedded at download time. */
  analytics?: GameAnalyticsSummary;
}

export interface ReplayMoveRecord {
  stateVersion: number;
  turnNumber: number;
  actorId: string;
  moveId: string;
  input?: unknown;
  timestamp: number;
}

export interface PersistedReplayStep {
  patches: unknown[];
  logs: unknown[];
  acceptedMove: ReplayMoveRecord;
}

export interface ReplayChatMessage {
  id: string;
  senderPlayerId: string;
  senderSeat: 0 | 1 | 2;
  kind: "preset" | "text" | "system";
  presetKey?: string;
  text?: string;
  timestamp: number;
}

export interface PersistedReplayData {
  version: 2;
  gameId: string;
  matchId: string;
  gameType: string;
  seed: string;
  playerIds: [string, string];
  cardsMaps: { cardInstances: Record<string, string>; owners: Record<string, string[]> };
  initialState: string;
  steps: PersistedReplayStep[];
  chatMessages?: ReplayChatMessage[];
  metadata: PersistedReplayMetadata;
}

type ReplayPlayerSide = "playerOne" | "playerTwo";

export type ReplayBlobSource = "indexed-db" | "api";

export interface ReplayBlobLoadResult {
  blob: ArrayBuffer;
  source: ReplayBlobSource;
}

interface ReplayBlobLoaderDeps {
  isReplayStoreAvailable?: () => boolean;
  loadReplayData?: (gameId: string) => Promise<ArrayBuffer | null>;
  fetchReplayBlob?: (gameId: string) => Promise<ArrayBuffer>;
}

function normalizePlayerName(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function getReplayPlayerInfo(
  metadata: PersistedReplayMetadata | null | undefined,
  index: 0 | 1,
): ReplayPlayerInfo | null {
  return metadata?.players?.[index] ?? null;
}

export function getReplayPlayerLabel(
  metadata: PersistedReplayMetadata | null | undefined,
  side: ReplayPlayerSide,
  fallback: string,
): string {
  const index = side === "playerOne" ? 0 : 1;
  const info = getReplayPlayerInfo(metadata, index);
  return normalizePlayerName(info?.displayName) ?? normalizePlayerName(info?.username) ?? fallback;
}

export function buildReplayPlayerMetadataMap(
  playerIds: readonly [string, string],
  metadata: PersistedReplayMetadata | null | undefined,
): Record<string, PlayerMatchMetadata> {
  const playerMetadataMap: Record<string, PlayerMatchMetadata> = {};

  playerIds.forEach((playerId, index) => {
    const info = getReplayPlayerInfo(metadata, index as 0 | 1);
    const displayName = normalizePlayerName(info?.displayName) ?? normalizePlayerName(info?.username);
    if (displayName) {
      playerMetadataMap[playerId] = { displayName };
    }
  });

  return playerMetadataMap;
}

export function buildForkedReplayPlayerMetadataMap(
  metadata: PersistedReplayMetadata | null | undefined,
  humanSide: ReplayPlayerSide,
): Record<string, PlayerMatchMetadata> {
  const humanIndex = humanSide === "playerOne" ? 0 : 1;
  const aiIndex = humanSide === "playerOne" ? 1 : 0;
  const playerMetadataMap: Record<string, PlayerMatchMetadata> = {};

  const humanName =
    normalizePlayerName(getReplayPlayerInfo(metadata, humanIndex)?.displayName) ??
    normalizePlayerName(getReplayPlayerInfo(metadata, humanIndex)?.username);
  const aiName =
    normalizePlayerName(getReplayPlayerInfo(metadata, aiIndex)?.displayName) ??
    normalizePlayerName(getReplayPlayerInfo(metadata, aiIndex)?.username);

  if (humanName) {
    playerMetadataMap.player_one = { displayName: humanName };
  }
  if (aiName) {
    playerMetadataMap.player_two = { displayName: aiName };
  }

  return playerMetadataMap;
}

/**
 * Fetch the compressed replay blob from the API.
 * Uses the /data endpoint which returns gzipped JSON directly (or redirects to S3).
 */
export async function fetchReplayBlob(gameId: string): Promise<ArrayBuffer> {
  const origin = getApiOrigin();
  const url = `${origin}/v1/games/lorcana/play/replays/${encodeURIComponent(gameId)}/data`;
  console.debug("[fetchReplayBlob] fetching", { gameId, url });
  try {
    return await requestArrayBuffer(url, undefined, `Failed to fetch replay for ${gameId}`);
  } catch (error) {
    console.error("[fetchReplayBlob] fetch failed", { gameId, url, error });
    throw error;
  }
}

/**
 * Load replay data for viewer/fork playback.
 *
 * Local saved replays still win, but public persisted replays must remain
 * playable even when the browser does not have a matching IndexedDB entry.
 */
export async function loadReplayBlobForPlayback(
  gameId: string,
  deps: ReplayBlobLoaderDeps = {},
): Promise<ReplayBlobLoadResult> {
  const canUseStore = deps.isReplayStoreAvailable ?? isReplayStoreAvailable;
  const loadLocalReplay = deps.loadReplayData ?? loadReplayData;
  const fetchRemoteReplay = deps.fetchReplayBlob ?? fetchReplayBlob;

  if (canUseStore()) {
    try {
      const localBlob = await loadLocalReplay(gameId);
      if (localBlob) {
        return { blob: localBlob, source: "indexed-db" };
      }
    } catch (error) {
      console.warn("[Replay] IndexedDB replay load failed, falling back to API", {
        gameId,
        error,
      });
    }
  }

  try {
    return { blob: await fetchRemoteReplay(gameId), source: "api" };
  } catch (error) {
    console.error("[Replay] API fetch failed after IndexedDB miss/unavailable", {
      gameId,
      error,
    });
    throw error;
  }
}

/**
 * Decompress a gzipped replay blob into PersistedReplayData.
 * Uses the browser-native DecompressionStream API.
 */
export async function decompressReplayBlob(compressed: ArrayBuffer): Promise<PersistedReplayData> {
  const stream = new Blob([compressed])
    .stream()
    .pipeThrough(
      new DecompressionStream("gzip") as unknown as ReadableWritablePair<Uint8Array, Uint8Array>,
    );

  const decompressed = await new Response(stream).text();
  return JSON.parse(decompressed) as PersistedReplayData;
}
