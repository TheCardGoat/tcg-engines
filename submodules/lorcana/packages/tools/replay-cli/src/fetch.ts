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
  const url = `${apiOrigin.replace(/\/$/, "")}/v1/play/replays/${encodeURIComponent(replayId)}/data`;
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30_000) });
  if (res.status === 404) {
    throw new ReplayNotFoundError(replayId);
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch replay (${res.status} ${res.statusText}) from ${url}`);
  }
  const compressed = new Uint8Array(await res.arrayBuffer());
  const json = Bun.gunzipSync(compressed);
  const text = new TextDecoder().decode(json);
  return JSON.parse(text) as PersistedReplayData;
}
