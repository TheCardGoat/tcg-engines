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
  const apiKey = process.env.MATCH_MANAGEMENT_API_KEY;
  if (!apiKey) {
    throw new Error("MATCH_MANAGEMENT_API_KEY is required to inspect raw replay artifacts");
  }
  return fetchReplayUrl(
    replayId,
    `${base}/v1/internal/games/cyberpunk/runtime/games/${encodedId}/replay-data`,
    apiKey,
  );
}

async function fetchReplayUrl(
  replayId: string,
  url: string,
  apiKey: string,
): Promise<PersistedReplayData> {
  const res = await fetch(url, {
    headers: { "x-api-key": apiKey },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
  if (res.status === 404) throw new ReplayNotFoundError(replayId);
  if (!res.ok) {
    throw new Error(`Failed to fetch replay (${res.status} ${res.statusText}) from ${url}`);
  }

  const payload = (await res.json()) as { replay?: PersistedReplayData };
  if (!payload.replay) throw new ReplayNotFoundError(replayId);
  const parsed = payload.replay;
  if (parsed.gameType !== "cyberpunk") {
    throw new Error(`Replay ${replayId} is gameType=${parsed.gameType}, expected cyberpunk`);
  }
  return parsed;
}
