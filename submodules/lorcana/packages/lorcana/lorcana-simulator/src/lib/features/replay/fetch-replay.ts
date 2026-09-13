/**
 * Replay Fetch & Decompress Helpers
 *
 * Fetches compressed replay data from the game server API and decompresses it.
 */

import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestArrayBuffer } from "$lib/data/transport/http-client.js";
import type { PlayerMatchMetadata } from "@/features/simulator/model/player-match-metadata.js";
import type { GameAnalyticsSummary } from "@/features/simulator/post-game/notes-api.js";
import { ReplayPlaybackV1Schema, type ReplayReversal } from "@tcg/game-page-contract";
import { loadReplayFromDevice } from "@tcg/simulator-runtime/replay-library";

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

export type PersistedReplayStep = { patches: unknown[]; logs: unknown[] } & (
  | { acceptedMove: ReplayMoveRecord; reversal?: never }
  | { acceptedMove: null; reversal: ReplayReversal }
);

export function persistedReplayStepPosition(
  step: PersistedReplayStep,
): ReplayMoveRecord | ReplayReversal {
  return step.acceptedMove ?? step.reversal;
}

export function firstPlayerIdFromReplaySteps(
  steps: readonly PersistedReplayStep[] | undefined,
): string | undefined {
  const opening = steps?.find((step) => persistedReplayStepPosition(step).turnNumber === 1);
  return opening ? persistedReplayStepPosition(opening).actorId : undefined;
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

function unwrapEngineReplayLog(log: { tag: string; data?: unknown }): unknown {
  return log.tag === "engine_log" && log.data !== undefined ? log.data : log;
}

type ReplayPlayerSide = "playerOne" | "playerTwo";

export type ReplayBlobSource = "api" | "device";

export interface ReplayBlobLoadResult {
  blob: ArrayBuffer;
  source: ReplayBlobSource;
}

interface ReplayBlobLoaderDeps {
  fetchReplayBlob?: (gameId: string) => Promise<ArrayBuffer>;
  preferredSource?: "api" | "device";
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
    const displayName =
      normalizePlayerName(info?.displayName) ?? normalizePlayerName(info?.username);
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
 * Fetch the canonical JSON replay. HTTP content encoding is handled by fetch.
 */
export async function fetchReplayBlob(gameId: string): Promise<ArrayBuffer> {
  const origin = getApiOrigin();
  const url = `${origin}/v1/games/lorcana/play/replays/${encodeURIComponent(gameId)}`;
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
 * Playback has one transport: the immutable server response.
 */
export async function loadReplayBlobForPlayback(
  gameId: string,
  deps: ReplayBlobLoaderDeps = {},
): Promise<ReplayBlobLoadResult> {
  if (deps.preferredSource === "device") {
    const playback = await loadReplayFromDevice("lorcana", gameId);
    if (!playback) throw new Error("This replay is not saved on this device.");
    return {
      blob: new TextEncoder().encode(JSON.stringify(playback)).buffer as ArrayBuffer,
      source: "device",
    };
  }
  const fetchRemoteReplay = deps.fetchReplayBlob ?? fetchReplayBlob;

  try {
    return { blob: await fetchRemoteReplay(gameId), source: "api" };
  } catch (error) {
    console.error("[Replay] API fetch failed", {
      gameId,
      error,
    });
    throw error;
  }
}

/**
 * Convert the canonical ReplayPlayback response into the existing renderer
 * input while the Svelte playback UI migrates to the shared controller.
 */
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
      logs: step.logs.map(unwrapEngineReplayLog),
      ...(step.acceptedMove === null
        ? { acceptedMove: null, reversal: step.reversal }
        : {
            acceptedMove: {
              stateVersion: step.acceptedMove.stateVersion,
              turnNumber: step.acceptedMove.turnNumber,
              actorId: step.acceptedMove.actorId,
              moveId: step.acceptedMove.moveId,
              ...(step.acceptedMove.payload !== undefined
                ? { input: step.acceptedMove.payload }
                : {}),
              timestamp: step.acceptedMove.timestamp,
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
