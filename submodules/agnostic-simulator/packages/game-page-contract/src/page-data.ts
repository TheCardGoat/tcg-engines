import type { PresentationEnvelope } from "@tcg/protocol/presentation";
import type { MatchInfo } from "./match.js";

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
 * single-use; live-match pages refresh it by refetching their canonical
 * bootstrap. `protocolVersion` lets clients refuse stale gateways without
 * parsing every message.
 */
export interface RealtimeAccess {
  wsUrl: string;
  ticket: string;
  protocolVersion: number;
}

export type SpectatorAccess = "public" | "authenticated" | "disabled";
export type ReplayAccess = "public_after_match" | "authenticated_after_match" | "participants";

export interface ViewerPermissions {
  act: boolean;
  chat: boolean;
  propose: boolean;
  useManualControls: boolean;
  concede: boolean;
  spectate: boolean;
  viewReplay: boolean;
  downloadReplay: boolean;
  forkReplay: boolean;
}

export type ResolvedMatchViewer =
  | {
      role: "player";
      actorId: string;
      seat: 1 | 2;
      userId: string;
      permissions: ViewerPermissions;
    }
  | {
      role: "spectator";
      spectatorId: string;
      userId?: string;
      permissions: ViewerPermissions;
    };

export interface ViewerProjectedGameState {
  gameId: string;
  gameNumber: number;
  status: "in_progress" | "completed";
  authority: "server" | "client";
  stateVersion: number;
  /** Opaque, server-selected view. Never an unfiltered server-engine snapshot. */
  view: unknown;
  /** Opaque game-owned resources safe for this viewer. */
  resources?: unknown;
  presentation?: PresentationEnvelope;
  clock?: import("./snapshot.js").ClockSnapshot;
  interactionView?: unknown;
  /** Server-authoritative availability for the seated player's undo control. */
  undoable?: boolean;
}

export interface LiveMatchCapabilities {
  actions: boolean;
  chat: boolean;
  proposals: boolean;
  manualControls: boolean;
  spectating: boolean;
  conceding: boolean;
  replay: boolean;
}

export interface LiveMatchHistory {
  recentMoves: import("./ws.js").MoveRecord[];
  engineLogs: import("./ws.js").GameLogEntry[];
  /** Player-only chat. Spectator bootstraps omit this field. */
  chatMessages?: unknown[];
  freeTextEnabled?: boolean;
}

export interface LiveMatchPresence {
  players: Array<{
    id: string;
    connected: boolean;
    disconnectedAt?: string;
  }>;
  spectatorCount?: number;
}

export interface ScopedRealtimeAccess extends RealtimeAccess {
  reconnectToken: string;
  expiresAt: string;
}

/**
 * Canonical, viewer-specific live-match response. Identity, role, state
 * visibility, and realtime scope are selected by the server.
 */
export interface LiveMatchBootstrapV1 {
  schemaVersion: 1;
  match: MatchInfo;
  game: ViewerProjectedGameState;
  viewer: ResolvedMatchViewer;
  capabilities: LiveMatchCapabilities;
  presence: LiveMatchPresence;
  history: LiveMatchHistory;
  realtime?: ScopedRealtimeAccess;
  userSettings?: UserSettings;
  replayUrl?: string;
}

export type ViewerSeat = number | "spectator";

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
 * `GET /v1/play/practice/:gameId`. Practice owns its compatibility adapter;
 * this type is not accepted by canonical live-match routes.
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
