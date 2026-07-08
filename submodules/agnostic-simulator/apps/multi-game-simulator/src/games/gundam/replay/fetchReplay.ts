import type {
  JsonPatch,
  ReplayChatMessage,
  ReplayMetadata,
  ReplayStep,
} from "@tcg/game-page-contract";
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
  readonly chatMessages?: readonly ReplayChatMessage[];
  readonly metadata: ReplayMetadata;
}

export function buildReplayDataUrl(gameSlug: GameSlug, gameId: string): string {
  return playUrl(gameSlug, `/replays/${encodeURIComponent(gameId)}/data`);
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
  if (typeof globalThis.DecompressionStream !== "function") {
    throw new Error("Replay playback requires a browser with gzip decompression support.");
  }
  const stream = new Blob([compressed])
    .stream()
    .pipeThrough(
      new globalThis.DecompressionStream("gzip") as unknown as ReadableWritablePair<
        Uint8Array,
        Uint8Array
      >,
    );
  const decompressed = await new Response(stream).text();
  return parseGundamReplayPayload(JSON.parse(decompressed));
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
    chatMessages: Array.isArray(value.chatMessages)
      ? value.chatMessages.filter(isReplayChatMessage)
      : undefined,
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
  return value.map((step, index) => {
    if (!isRecord(step)) {
      throw new Error(`Replay step ${index} was not an object.`);
    }
    return {
      patches: Array.isArray(step.patches) ? (step.patches as JsonPatch) : [],
      acceptedMove: isRecord(step.acceptedMove)
        ? (step.acceptedMove as unknown as ReplayStep["acceptedMove"])
        : ({} as ReplayStep["acceptedMove"]),
      logs: Array.isArray(step.logs) ? (step.logs as ReplayStep["logs"]) : [],
    };
  });
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

function isReplayChatMessage(value: unknown): value is ReplayChatMessage {
  return (
    isRecord(value) &&
    typeof value.from === "string" &&
    typeof value.body === "string" &&
    typeof value.ts === "number"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
