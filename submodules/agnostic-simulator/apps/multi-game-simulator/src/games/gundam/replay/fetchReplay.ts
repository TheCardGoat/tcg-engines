import { ReplayStepSchema } from "@tcg/game-page-contract";
import { ReplayPlaybackV1Schema } from "@tcg/game-page-contract";
import type { ReplayMetadata, ReplayStep } from "@tcg/game-page-contract";
import type { GameSlug } from "@tcg/simulator-contract";

import { playUrl } from "../../../runtime/gameRuntimeApi.ts";
import { gundamRuntimeRequestHeaders } from "../src/engine/live/runtimeHeaders.ts";

export interface GundamReplayData {
  readonly version: number;
  readonly gameType: string;
  readonly matchId: string;
  readonly gameId: string;
  readonly seed: string;
  readonly playerIds: readonly [string, string];
  readonly cardsMaps?: unknown;
  readonly initialState: unknown;
  readonly steps: readonly ReplayStep[];
  readonly metadata: ReplayMetadata;
}

export function buildReplayDataUrl(gameSlug: GameSlug, gameId: string): string {
  return playUrl(gameSlug, `/replays/${encodeURIComponent(gameId)}`);
}

export async function fetchReplayBlob(
  gameId: string,
  gameSlug: GameSlug = "gundam",
): Promise<ArrayBuffer> {
  const response = await fetch(buildReplayDataUrl(gameSlug, gameId), {
    credentials: "include",
    headers: gundamRuntimeRequestHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch replay (${response.status}).`);
  }
  return response.arrayBuffer();
}

export async function decompressReplayBlob(compressed: ArrayBuffer): Promise<GundamReplayData> {
  const playback = ReplayPlaybackV1Schema.parse(
    JSON.parse(new TextDecoder().decode(compressed)) as unknown,
  );
  return parseGundamReplayPayload(playback.replay);
}

export function parseGundamReplayPayload(value: unknown): GundamReplayData {
  if (!isRecord(value)) {
    throw new Error("Replay payload was not an object.");
  }
  const gameType = readString(value.gameType, "gameType");
  const gameId = readString(value.gameId, "gameId");
  const matchId = readString(value.matchId, "matchId");
  const seed = typeof value.seed === "string" ? value.seed : "";
  const playerIds = readPlayerIds(value);
  const steps = readReplaySteps(value.steps);
  const metadata = readReplayMetadata(value.metadata, steps.length);

  return {
    version: typeof value.version === "number" ? value.version : 0,
    gameType,
    gameId,
    matchId,
    seed,
    playerIds,
    cardsMaps: value.cardsMaps,
    initialState: value.initialState,
    steps,
    metadata,
  };
}

function readString(value: unknown, field: string): string {
  if (typeof value === "string" && value.length > 0) return value;
  throw new Error(`Replay payload is missing ${field}.`);
}

function readPlayerIds(value: Record<string, unknown>): readonly [string, string] {
  if (Array.isArray(value.playerIds)) {
    const ids = value.playerIds.filter((id): id is string => typeof id === "string");
    if (ids.length >= 2) return [ids[0]!, ids[1]!];
  }
  if (Array.isArray(value.participants)) {
    const ids = value.participants
      .map((participant) =>
        isRecord(participant)
          ? typeof participant.id === "string"
            ? participant.id
            : typeof participant.playerId === "string"
              ? participant.playerId
              : null
          : null,
      )
      .filter((id): id is string => Boolean(id));
    if (ids.length >= 2) return [ids[0]!, ids[1]!];
  }
  throw new Error("Replay payload is missing player ids.");
}

function readReplaySteps(value: unknown): readonly ReplayStep[] {
  if (!Array.isArray(value)) return [];
  return value.map((step) => ReplayStepSchema.parse(step));
}

function readReplayMetadata(value: unknown, totalMoves: number): ReplayMetadata {
  const metadata = isRecord(value) ? value : {};
  return {
    totalMoves:
      typeof metadata.totalMoves === "number" && Number.isFinite(metadata.totalMoves)
        ? metadata.totalMoves
        : totalMoves,
    totalTurns:
      typeof metadata.totalTurns === "number" && Number.isFinite(metadata.totalTurns)
        ? metadata.totalTurns
        : 0,
    ...(typeof metadata.durationMs === "number" ? { durationMs: metadata.durationMs } : {}),
    ...(typeof metadata.winnerId === "string" ? { winnerId: metadata.winnerId } : {}),
    ...(typeof metadata.endReason === "string" ? { endReason: metadata.endReason } : {}),
    createdAt:
      typeof metadata.createdAt === "string" ? metadata.createdAt : new Date(0).toISOString(),
    ...(typeof metadata.completedAt === "string" ? { completedAt: metadata.completedAt } : {}),
    ...(metadata.matchType === "ranked" ||
    metadata.matchType === "casual" ||
    metadata.matchType === "practice_vs_bot" ||
    metadata.matchType === "private" ||
    metadata.matchType === "local"
      ? { matchType: metadata.matchType }
      : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
