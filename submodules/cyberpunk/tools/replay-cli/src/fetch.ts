import { gunzipSync } from "node:zlib";

export interface ReplayPlayerInfo {
  id: string;
  displayName: string | null;
  username: string | null;
  mmr?: number;
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
  deckColors?: { player1: unknown[]; player2: unknown[] };
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

export class ReplayNotFoundError extends Error {
  constructor(public readonly gameId: string) {
    super(`Replay not found for gameId=${gameId}`);
    this.name = "ReplayNotFoundError";
  }
}

export async function fetchReplay(
  replayId: string,
  apiOrigin: string,
): Promise<PersistedReplayData> {
  const base = apiOrigin.replace(/\/$/, "");
  const encodedId = encodeURIComponent(replayId);
  const urls = [
    `${base}/v1/games/cyberpunk/play/replays/${encodedId}/data`,
    `${base}/v1/play/replays/${encodedId}/data`,
  ];

  let lastError: Error | null = null;
  for (const url of urls) {
    try {
      return await fetchReplayUrl(replayId, url);
    } catch (err) {
      if (err instanceof ReplayNotFoundError) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new ReplayNotFoundError(replayId);
}

async function fetchReplayUrl(replayId: string, url: string): Promise<PersistedReplayData> {
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30_000) });
  if (res.status === 404) throw new ReplayNotFoundError(replayId);
  if (!res.ok) {
    throw new Error(`Failed to fetch replay (${res.status} ${res.statusText}) from ${url}`);
  }

  const compressed = new Uint8Array(await res.arrayBuffer());
  const text = gunzipSync(compressed).toString("utf8");
  const parsed = JSON.parse(text) as PersistedReplayData;
  if (parsed.gameType !== "cyberpunk") {
    throw new Error(`Replay ${replayId} is gameType=${parsed.gameType}, expected cyberpunk`);
  }
  return parsed;
}
