import type { PresentationBindings, PresentationBundle } from "@tcg/protocol/presentation";
import type { GameId, GameType, MatchId, PlayerId } from "./ids.js";
import type { JsonPatch } from "./json-patch.js";
import type { MatchType, Participant } from "./match.js";
import type { GameLogEntry, MoveRecord } from "./ws.js";

/**
 * Schema version for the on-disk / on-wire replay file. Version 3 adds
 * top-level `gameType` so the file is self-describing for partners; earlier
 * legacy files are migrated by server-side tooling before browser delivery.
 */
export const REPLAY_FILE_VERSION = 3 as const;
export type ReplayFileVersion = typeof REPLAY_FILE_VERSION;

export interface ReplayReversal {
  stateVersion: number;
  turnNumber: number;
  actorId: PlayerId;
  timestamp: number;
}

export type ReplayStep = ReplayStepState &
  (
    | { acceptedMove: MoveRecord; reversal?: never }
    | { acceptedMove: null; reversal: ReplayReversal }
  );

/** Timeline position is independent of whether gameplay was accepted. */
export function replayStepPosition(step: ReplayStep): MoveRecord | ReplayReversal {
  return step.acceptedMove ?? step.reversal;
}

interface ReplayStepState {
  presentationBindings?: PresentationBindings;
  patches: JsonPatch;
  resourcePatches?: JsonPatch;
  logs: GameLogEntry[];
}

export interface ReplayCheckpoint {
  presentationBindings?: PresentationBindings;
  /** Number of replay steps already applied to reach this state. */
  cursor: number;
  state: unknown;
  resources?: unknown;
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
  /** Game-specific opaque blob; deployable's `parseState` narrows it. */
  initialState: unknown;
  checkpoints: ReplayCheckpoint[];
  steps: ReplayStep[];
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

export type ReplayTrust = "server_authoritative" | "player_authored_unverified";

export type ReplayCloudSaveStatus = "saving" | "saved" | "failed" | "expired";

export interface ReplayAvailability {
  status: ReplayCloudSaveStatus;
  /** Time at which the shared cloud object stops being available; null means legacy retention. */
  availableUntil: string | null;
  /** This viewer's immutable entitlement promise, when they are a retained participant. */
  viewerExpiresAt: string | null;
}

/** Canonical browser-facing replay response. HTTP owns compression. */
export interface ReplayPlaybackV1 {
  schemaVersion: 1;
  trust: ReplayTrust;
  publishedAt: string;
  availability?: ReplayAvailability;
  resources?: unknown;
  presentation?: PresentationBundle;
  presentationBindings?: PresentationBindings;
  replay: ReplayFile;
}
