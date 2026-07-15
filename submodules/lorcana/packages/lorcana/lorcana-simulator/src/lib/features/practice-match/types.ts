import type {
  AcceptedMoveRecord,
  EngineLogRecord,
  LorcanaServerAuthoritativeSnapshot,
} from "@tcg/lorcana-engine";
import type { HumanVsAiMatchConfig } from "../simulator-devtools/vs-ai/types.js";

export interface PracticeMatchCreationResponse {
  object: "practice_match";
  matchId: string;
  gameId: string;
  playerId: string;
  botPlayerId: string;
}

export interface PracticeMatchSession {
  matchId: string;
  gameId: string;
  /** Roster seat / `game_profiles.game_profile_id` (legacy persisted key: `playerId`). */
  gameProfileId: string;
  /** Auth account id (`users.id`) when known at save time. */
  userId?: string;
  botPlayerId: string;
  deckConfig: HumanVsAiMatchConfig;
  /** Pre-issued WebSocket ticket (e.g. from quick-match API for guest users). */
  wsTicket?: string;
}

export interface PracticeMatchSnapshot {
  engineSnapshot: LorcanaServerAuthoritativeSnapshot;
}

export interface PracticeMatchRecentHistory {
  acceptedMoves: AcceptedMoveRecord[];
  engineLogs: EngineLogRecord[];
}
