import type { MatchInfo } from "./match.js";
import type { GameSnapshot } from "./snapshot.js";

/** Cross-game user prefs the live-match page needs at bootstrap. */
export interface UserSettings {
  defaultCardBackId?: string;
  defaultPlaymatId?: string;
  reducedMotion?: boolean;
  locale?: string;
  /** Open extension point — deployables can store extra prefs here. */
  extras?: Record<string, unknown>;
}

/**
 * Realtime channel info for a live match. The ticket is short-lived and
 * single-use; deployables should refresh it via the practice/match ticket
 * endpoint when it expires. `protocolVersion` lets clients refuse stale
 * gateways without parsing every message.
 */
export interface RealtimeAccess {
  wsUrl: string;
  ticket: string;
  protocolVersion: number;
}

export type ViewerSeat = number | "spectator";

/**
 * Bootstrap payload returned by
 * `GET /v1/play/matches/:matchId/games/:gameId/context`. The live-match page
 * server-load returns exactly this shape — no extra fields, no per-game
 * wrappers.
 */
export interface MatchPageData {
  match: MatchInfo;
  game: GameSnapshot;
  viewerSeat: ViewerSeat;
  realtime: RealtimeAccess;
  userSettings?: UserSettings;
}

/**
 * Lightweight summary returned by
 * `GET /v1/play/matches/:matchId` for landing-on-match resolution.
 */
export interface MatchResolution {
  match: MatchInfo;
  /** The game the user should land on; `null` when the match has no live game. */
  currentGameId: string | null;
}

/**
 * Returned by `POST /v1/play/practice` and
 * `GET /v1/play/practice/:gameId`. The page builds a `MatchPageData`-shaped
 * value from this plus the practice ticket.
 */
export interface PracticeConfig {
  matchId: string;
  gameId: string;
  playerId: string;
  botPlayerId: string;
  playerDeckText: string;
  bot?: {
    fixtureId?: string;
    deckText?: string;
    strategyId?: string;
  };
  seed?: string;
}

export interface PracticeCreatedResponse extends PracticeConfig {
  wsTicket: string;
  authToken?: string;
}

export interface PracticeTicketResponse {
  ticket: string;
  authToken?: string;
}
