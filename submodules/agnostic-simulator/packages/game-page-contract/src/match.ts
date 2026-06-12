import type { GameId, GameType, MatchId, PlayerId } from "./ids.js";

/**
 * Visual / UX preferences attached to a participant for the current match.
 * Game-agnostic; deployables that don't support a setting simply ignore it.
 */
export interface ParticipantVisualSettings {
  cardBackId?: string;
  playmatId?: string;
}

/**
 * One side of a match. The contract assumes 2-player today; multiplayer is a
 * forward-compatible extension via `seat: number`. Page-layer code must only
 * branch on `seat === viewerSeat` semantics, never on hard-coded seat counts.
 */
export interface Participant {
  id: PlayerId;
  seat: number;
  /** Missing => guest or bot. */
  userId?: string;
  displayName: string;
  isBot?: boolean;
  visualSettings?: ParticipantVisualSettings;
  isMobile?: boolean;
}

export type MatchStatus = "in_progress" | "completed" | "abandoned";

/**
 * `practice_vs_bot` and `local` are local-authority matchTypes; everything
 * else is server-authority. The page chooses an orchestrator from
 * `GameSnapshot.authority`, not from `matchType`.
 */
export type MatchType = "ranked" | "casual" | "practice_vs_bot" | "private" | "local";

export interface MatchInfo {
  matchId: MatchId;
  gameType: GameType;
  /** Game-defined format slug (e.g. "core-constructed"). */
  format: string;
  matchType: MatchType;
  status: MatchStatus;
  participants: Participant[];
  /** All games in this match (for best-of-N). */
  gameIds: GameId[];
  scores?: Record<PlayerId, number>;
  winnerId?: PlayerId;
}
