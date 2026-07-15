import type { CardsMaps } from "./cards.js";
import type { GameId, GameType, MatchId, PlayerId } from "./ids.js";
import type { JsonPatch } from "./json-patch.js";
import type { MatchType, Participant } from "./match.js";
import type { GameLogEntry, MoveRecord } from "./ws.js";

/**
 * Schema version for the on-disk / on-wire replay file. Version 3 adds
 * top-level `gameType` so the file is self-describing for partners; earlier
 * Lorcana files (v2) are read-time materialized into this shape — the
 * deployable owns the migration if it cares to persist v3.
 */
export const REPLAY_FILE_VERSION = 3 as const;
export type ReplayFileVersion = typeof REPLAY_FILE_VERSION;

export interface ReplayChatMessage {
  from: PlayerId;
  body: string;
  ts: number;
}

export interface ReplayStep {
  patches: JsonPatch;
  acceptedMove: MoveRecord;
  logs: GameLogEntry[];
}

export interface ReplayMetadata {
  totalMoves: number;
  totalTurns: number;
  durationMs?: number;
  winnerId?: PlayerId;
  /** Game-defined string; renderer maps to copy. */
  endReason?: string;
  createdAt: string;
  completedAt?: string;
  matchType?: MatchType;
}

export interface ReplayFile {
  version: ReplayFileVersion;
  gameType: GameType;
  matchId: MatchId;
  gameId: GameId;
  /** RNG seed for reproducibility. */
  seed: string;
  participants: Participant[];
  cardsMaps: CardsMaps;
  /** Game-specific opaque blob; deployable's `parseState` narrows it. */
  initialState: unknown;
  steps: ReplayStep[];
  chatMessages?: ReplayChatMessage[];
  metadata: ReplayMetadata;
}

/**
 * Lightweight summary returned by `GET /v1/play/replays/:gameId/meta` for the
 * replay-list page. Avoids downloading the full gzipped file.
 */
export interface ReplaySummary {
  gameId: GameId;
  matchId: MatchId;
  gameType: GameType;
  participants: Participant[];
  metadata: ReplayMetadata;
  /** Compressed file size in bytes; useful for storage UI. */
  sizeBytes?: number;
}
