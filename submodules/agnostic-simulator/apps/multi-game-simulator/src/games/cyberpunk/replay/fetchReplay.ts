import type { GameSlug } from "@tcg/simulator-contract";
import { playUrl } from "../../../runtime/gameRuntimeApi";
import { CYBERPUNK_GAME_SLUG } from "../engine/live/apiOrigin";
import type { CyberpunkGameAnalyticsRecord } from "../components/EndGameModal/postGameApi";
import { ReplayPlaybackV1Schema, type ReplayReversal } from "@tcg/game-page-contract";

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

export type PersistedReplayStep = { patches: unknown[]; logs: unknown[] } & (
  | { acceptedMove: ReplayMoveRecord; reversal?: never }
  | { acceptedMove: null; reversal: ReplayReversal }
);

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

export type ReplayBlobSource = "api";

export interface ReplayBlobLoadResult {
  blob: ArrayBuffer;
  source: ReplayBlobSource;
}

interface ReplayBlobLoaderDeps {
  fetchReplayBlob?: (gameId: string) => Promise<ArrayBuffer>;
}

export function buildReplayDataUrl(gameSlug: GameSlug, gameId: string): string {
  return playUrl(gameSlug, `/replays/${encodeURIComponent(gameId)}`);
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
  const fetchRemoteReplay = deps.fetchReplayBlob ?? fetchReplayBlob;

  try {
    return { blob: await fetchRemoteReplay(gameId), source: "api" };
  } catch (error) {
    console.error("[CyberpunkReplay] API fetch failed", {
      gameId,
      error,
    });
    throw error;
  }
}

export async function decompressReplayBlob(compressed: ArrayBuffer): Promise<PersistedReplayData> {
  const playback = ReplayPlaybackV1Schema.parse(
    JSON.parse(new TextDecoder().decode(compressed)) as unknown,
  );
  const replay = playback.replay;
  const playerIds = replay.participants.map((participant) => participant.id);
  if (playerIds.length < 2) throw new Error("Replay is missing player participants.");
  return {
    version: 2,
    gameId: replay.gameId,
    matchId: replay.matchId,
    gameType: replay.gameType,
    seed: replay.seed,
    playerIds: [playerIds[0]!, playerIds[1]!],
    cardsMaps: readReplayCardsMaps(playback.resources),
    initialState: JSON.stringify(replay.initialState),
    steps: replay.steps.map((step) => ({
      patches: step.patches,
      logs: step.logs,
      ...(step.acceptedMove === null
        ? { acceptedMove: null, reversal: step.reversal }
        : {
            acceptedMove: {
              ...step.acceptedMove,
              ...(step.acceptedMove.payload !== undefined
                ? { input: step.acceptedMove.payload }
                : {}),
            },
          }),
    })),
    metadata: {
      ...replay.metadata,
      completedAt: replay.metadata.completedAt ?? playback.publishedAt,
      players: [toReplayPlayer(replay.participants[0]!), toReplayPlayer(replay.participants[1]!)],
      authority: playback.trust === "server_authoritative" ? "server" : "client",
    },
  };
}

function readReplayCardsMaps(resources: unknown): PersistedReplayData["cardsMaps"] {
  if (!resources || typeof resources !== "object" || !("cardsMaps" in resources)) {
    return { cardInstances: {}, owners: {} };
  }
  const cardsMaps = (resources as { cardsMaps?: unknown }).cardsMaps;
  if (!cardsMaps || typeof cardsMaps !== "object") return { cardInstances: {}, owners: {} };
  const value = cardsMaps as { cardInstances?: unknown; owners?: unknown };
  if (!value.cardInstances || !value.owners) return { cardInstances: {}, owners: {} };
  return cardsMaps as PersistedReplayData["cardsMaps"];
}

function toReplayPlayer(participant: { id: string; displayName: string }): ReplayPlayerInfo {
  return { id: participant.id, displayName: participant.displayName, username: null };
}

async function requestArrayBuffer(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Failed to fetch replay (${response.status})`);
  }
  return response.arrayBuffer();
}
