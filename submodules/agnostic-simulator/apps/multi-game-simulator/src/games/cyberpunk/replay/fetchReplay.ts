import type { GameSlug } from "@tcg/simulator-contract";
import { playUrl } from "../../../runtime/gameRuntimeApi";
import { CYBERPUNK_GAME_SLUG } from "../engine/live/apiOrigin";
import type { CyberpunkGameAnalyticsRecord } from "../components/EndGameModal/postGameApi";
import { isReplayStoreAvailable, loadReplayData } from "./replayStore";

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
  analytics?: CyberpunkGameAnalyticsRecord;
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
  metadata: PersistedReplayMetadata;
}

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

export function buildReplayDataUrl(gameSlug: GameSlug, gameId: string): string {
  return playUrl(gameSlug, `/replays/${encodeURIComponent(gameId)}/data`);
}

export async function fetchReplayBlob(
  gameId: string,
  gameSlug: GameSlug = CYBERPUNK_GAME_SLUG,
): Promise<ArrayBuffer> {
  return requestArrayBuffer(buildReplayDataUrl(gameSlug, gameId));
}

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
      console.warn("[CyberpunkReplay] IndexedDB load failed; falling back to API", {
        gameId,
        error,
      });
    }
  }

  try {
    return { blob: await fetchRemoteReplay(gameId), source: "api" };
  } catch (error) {
    console.error("[CyberpunkReplay] API fetch failed after IndexedDB miss/unavailable", {
      gameId,
      error,
    });
    throw error;
  }
}

export async function decompressReplayBlob(compressed: ArrayBuffer): Promise<PersistedReplayData> {
  const stream = new Blob([compressed])
    .stream()
    .pipeThrough(
      new DecompressionStream("gzip") as unknown as ReadableWritablePair<Uint8Array, Uint8Array>,
    );

  const decompressed = await new Response(stream).text();
  return JSON.parse(decompressed) as PersistedReplayData;
}

async function requestArrayBuffer(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Failed to fetch replay (${response.status})`);
  }
  return response.arrayBuffer();
}
