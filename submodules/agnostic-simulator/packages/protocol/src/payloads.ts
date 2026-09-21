import type { DropEligibility } from "./drop-eligibility.js";
import type { PresentationEnvelope } from "./presentation.js";
/**
 * Server -> Client payload shapes.
 *
 * These describe the *args* of each event in `ServerToClientEvents`. They are
 * NOT validated at runtime — the server is the producer, types are sufficient.
 *
 * Game-engine-specific shapes (Lorcana animations, accepted-move records,
 * engine logs, cards maps, match state views) are intentionally typed as
 * `unknown[]` / `unknown` so this package stays game-agnostic. Concrete
 * shapes live alongside the game adapters and play-service producers; this
 * package exposes only the game-agnostic Socket.IO event contract.
 */

import type { ChatMessage } from "./chat.js";
import type { PlayableGameSlug } from "./games.js";
import type { EngineInteractionView } from "./interactions.js";
import type { AnimationPlanV2 } from "./animations.js";

export interface GatewayPongPayload {
  /** ISO-8601 server timestamp. */
  serverTime: string;
  /** Echoed client timestamp for latency calculation. */
  t?: number;
}

export interface GatewayWelcomePayload {
  authenticated: boolean;
  authenticationMethod?: string;
  /** Server-assigned connection id. */
  connectionId: string;
  /**
   * The game namespace this socket connected through. Echoed so the
   * client can sanity-check it ended up where it intended to.
   */
  gameSlug?: PlayableGameSlug;
  userId?: string | null;
  userName?: string | null;
}

/** A connected viewer must renew credentials and rejoin before sending more commands. */
export const VIEWER_SCOPE_EXPIRED = "viewer_scope_expired";

export interface GatewayErrorPayload {
  code: string;
  message: string;
  correlationId?: string;
}

export interface PlayerVisualSettings {
  cardBack?: string;
  playmat?: string;
}

export interface PendingProposal {
  actionType:
    | "cancel_match"
    | "undo"
    | "enable_free_text_chat"
    | "enable_manual_mode"
    | "disable_manual_mode";
  senderPlayerId: string;
  deadline: number;
  undoScope?: "last_move" | "turn_start";
}

export interface GameJoinedPayload {
  gameId: string;
  role: "player" | "spectator";
  stateVersion: number;
  /** Present only when the HTTP bootstrap version was stale. */
  state?: unknown;
  /** Viewer-filtered, game-owned presentation resources for the included state. */
  resources?: unknown;
  presentation?: PresentationEnvelope;
  cardsMaps?: unknown;
  players: { id: string; connected: boolean; disconnectedAt?: string }[];
  playerVisualSettings?: Record<string, PlayerVisualSettings>;
  pendingProposal?: PendingProposal;
  interactionView?: EngineInteractionView;
  /** Whether the seated recipient may undo the latest authoritative move. */
  undoable?: boolean;
  /** Server-projected drop claim for this viewer's opponent. Spectators receive a view-only copy. */
  dropEligibility?: DropEligibility;
  correlationId?: string;
}

export interface GameRecentHistoryPayload {
  gameId: string;
  acceptedMoves: unknown[];
  engineLogs: unknown[];
}

export interface GameChatHistoryPayload {
  gameId: string;
  matchId: string;
  messages: ChatMessage[];
  freeTextEnabled: boolean;
}

export interface ChatMessageEventPayload {
  gameId: string;
  matchId: string;
  message: ChatMessage;
}

export interface ClientUpdateBaseProperties {
  gameId: string;
  stateVersion: number;
  patches: unknown[];
  /** Engine logs stripped for the acting player (includes their own private data). */
  engineLogs: unknown[];
  animationPlan: AnimationPlanV2 | null;
  /** Full state snapshot, included whenever the backend can avoid client-side patch application. */
  state: unknown;
  /** Viewer-filtered, game-owned resources that correspond to this state snapshot. */
  resources?: unknown;
  presentation?: PresentationEnvelope;
  /** Server-side processing time in milliseconds (from message receipt to response send). */
  serverProcessingMs?: number;
  matchInfo?: {
    matchId: string;
    matchStatus: "waiting" | "in_progress" | "completed" | "abandoned";
    matchCompleted: boolean;
    nextGameId?: string;
    player1Score: number;
    player2Score: number;
    winnerId?: string;
  };
  interactionView?: EngineInteractionView;
  /** Whether the receiving player may undo their latest authoritative move. */
  undoable?: boolean;
  /** Server-projected drop claim for this viewer's opponent. */
  dropEligibility?: DropEligibility;
}

export interface StateSyncPayload extends Omit<ClientUpdateBaseProperties, "patches"> {}
export interface StateUpdatePayload extends ClientUpdateBaseProperties {
  moveType?: string;
  actorId?: string;
  payload?: unknown;
  acceptedMove?: unknown;
}

/** Durable result of persisting a client-authority snapshot. */
export interface PushStateResultPayload {
  gameId: string;
  stateVersion: number;
  matchId: string;
  matchCompleted: boolean;
}

export interface MoveAcceptedPayload extends ClientUpdateBaseProperties {
  moveType: string;
  actorId: string;
  acceptedMove?: unknown;
  /** Game-owned command outcome, sent only to the acting player. */
  outcome?: unknown;
  correlationId?: string;
}

export interface MoveRejectedPayload {
  gameId: string;
  reason: string;
  code: "rejected_stale" | "rejected_illegal";
  currentVersion: number;
  state?: unknown;
  correlationId?: string;
}

export interface PresenceChangePayload {
  gameId: string;
  playerId: string;
  status: "connected" | "disconnected";
  /** ISO-8601 timestamp of when the player disconnected. Only present when status is "disconnected". */
  disconnectedAt?: string;
}

/** Per-actor refresh of drop claim legality after clocks or presence change. */
export interface DropEligibilityPayload {
  gameId: string;
  dropEligibility: DropEligibility;
}

export interface GameEndedPayload {
  gameId: string;
  winnerId?: string;
  reason: string;
  matchId?: string;
  nextGameId?: string;
  matchCompleted?: boolean;
  matchStatus?: "waiting" | "in_progress" | "completed" | "abandoned";
  player1Score?: number;
  player2Score?: number;
}

/** The terminal game state committed, but durable match progression did not. */
export interface MatchFinalizationFailedPayload {
  gameId: string;
  matchId: string;
  message: string;
}

/** Concrete shape produced by `play/types/MatchStateView`; treat as opaque here. */
export type MatchStatePayload = Record<string, unknown> & { durationMs?: number };

export interface ErrorPayload {
  code: string;
  message: string;
  correlationId?: string;
}

export interface HeartbeatAckPayload {
  serverTime: string;
  stateVersions: Record<string, number>;
  /** Echoes the client probe id without exposing game or user data. */
  correlationId?: string;
  /** Echoes the client timestamp so the originating browser can calculate full-path RTT. */
  clientSentAt?: number;
}

export interface RecentOpponentAvoidancePayload {
  recentOpponentCount: number;
  broadensAt: number;
  broadened: boolean;
}

export interface MatchmakingStatusPayload {
  queued: boolean;
  queuedAt?: number;
  expiresAt?: number;
  position?: number;
  recentOpponentAvoidance?: RecentOpponentAvoidancePayload;
  pendingMatchId?: string;
  pendingMatchDeadline?: number;
  pendingMatchServerNow?: number;
  pendingSelfAccepted?: boolean;
  pendingOpponentAccepted?: boolean;
}

export interface MatchFoundPayload {
  matchId: string;
  gameId: string;
  playerId: string;
  opponentDisplayName: string;
  format: string;
  mode: string;
}

export interface MatchmakingCancelledPayload {
  reason: "timeout" | "manual" | "match_creation_error";
  /**
   * Server-side failure description for `match_creation_error` (e.g.
   * "Card not found: gilded-maton") so clients can explain why a paired match
   * never materialized.
   */
  detail?: string;
}

export interface MatchReadyPayload {
  pendingMatchId: string;
  opponentDisplayName: string;
  acceptDeadline: number;
  serverNow: number;
}

export interface MatchReadyUpdatePayload {
  pendingMatchId: string;
  opponentAccepted: boolean;
}

export interface MatchReadyExpiredPayload {
  pendingMatchId: string;
  reason: "declined" | "timeout";
}

export interface TimeoutNotificationPayload {
  gameId: string;
  timedOutPlayerId: string;
  timeoutCount: number;
  canSkip: boolean;
  canDrop: boolean;
}

export interface LobbyPlayerJoinedPayload {
  roomCode: string;
  joinerDisplayName: string;
  joinerGameProfileId: string;
}

export interface LobbyRoomCancelledPayload {
  roomCode: string;
  reason: "creator_cancelled" | "expired" | "match_creation_error";
}

export interface LobbyPlayerLeftPayload {
  roomCode: string;
}

export interface FriendLobbyInvitePayload {
  invite: {
    inviteId: string;
    direction: "incoming" | "outgoing";
    status: "pending" | "accepted" | "declined" | "cancelled" | "expired";
    gameSlug: string;
    gameName: string;
    roomCode: string;
    bestOf: 1 | 3;
    friend: {
      userId: string;
      displayName: string;
      image: string | null;
    };
    createdAt: string;
    expiresAt: string;
    resolvedAt: string | null;
  };
}

export interface RequestStateSyncPayload {
  gameId: string;
}

export interface ServerShuttingDownPayload {
  reason: string;
}

export interface PlayerDropPendingPayload {
  gameId: string;
  droppedPlayerId: string;
  reason: string;
}

export interface PlayerActivityPayload {
  gameId: string;
  playerId: string;
  idle: boolean;
  tabVisible: boolean;
  isAfk: boolean;
}

// --- Proposal (bilateral consent) payloads ---

export interface ProposalReceivedPayload {
  gameId: string;
  matchId: string;
  actionType: string;
  senderPlayerId: string;
  deadline: number;
  /** Undo granularity. Omitted for non-undo and legacy last-move requests. */
  undoScope?: "last_move" | "turn_start";
}

export interface ProposalResolvedPayload {
  gameId: string;
  matchId: string;
  actionType: string;
  resolution: "accepted" | "declined" | "failed";
  undoScope?: "last_move" | "turn_start";
}

export interface ProposalExpiredPayload {
  gameId: string;
  matchId: string;
  actionType: string;
  undoScope?: "last_move" | "turn_start";
}

/**
 * Tournament/event progression broadcast.
 *
 * Fired into every socket subscribed to `event:{eventId}` whenever the
 * `TournamentMessagingService` publishes a lifecycle event (round
 * started/completed, match result, bracket advancement, registration
 * change, etc.). The `messageType` discriminates the underlying state
 * change; `payload` carries the message-type-specific fields.
 *
 * Clients on a live-event page should subscribe via `subscribe_event` on
 * connection, then dispatch on `messageType` to update bracket / standings
 * / "now playing" UI in real time.
 */
export interface TournamentUpdatePayload {
  eventId: string;
  messageType:
    | "round_started"
    | "round_completed"
    | "match_completed"
    | "player_ready"
    | "break_started"
    | "tournament_completed"
    | "player_dropped"
    | "registration_update";
  timestamp: string;
  payload: Record<string, unknown>;
}

/** Acknowledges a `subscribe_event` / `unsubscribe_event` call. */
export interface EventSubscriptionAckPayload {
  eventId: string;
  subscribed: boolean;
  correlationId: string;
}

export interface FriendMessagePayload {
  messageId: string;
  fromUserId: string;
  fromUserName: string;
  content: string;
  sentAt: string;
}

/** Full public-lobby list for one game namespace after a lobby state change. */
export interface PublicLobbyRoomsSnapshotPayload {
  generatedAt: string;
  rooms: {
    object: "lobby_room_list";
    rooms: Array<{
      object: "lobby_room";
      roomCode: string;
      status: "waiting" | "ready" | "matched";
      bestOf: 1 | 3;
      createdAt: number;
      expiresAt: number;
      visibility: "private" | "public";
      isCreator: boolean;
      isJoiner: boolean;
      creatorDisplayName: string | null;
      joinerDisplayName: string | null;
      creatorDeckId: string;
      creatorDeckName: string | null;
      joinerDeckId: string | null;
      joinerDeckName: string | null;
    }>;
    total: number;
  };
}

/** Public-only snapshot delivered to matchmaking-page viewers in one game namespace. */
export interface MatchmakingDashboardSnapshotPayload {
  revision: number;
  generatedAt: string;
  queueStats: {
    partitions: Array<{
      queueId?: string | null;
      seasonId?: string | null;
      format: string;
      mode: string;
      matchType: string;
      inQueue: number;
      liveMatches: number;
    }>;
    practiceMatches: number;
  };
  liveMatches: {
    matches: Array<{
      gameSlug: string;
      matchId: string;
      currentGameId?: string;
      player1: { id: string; displayName: string; isMobile?: boolean };
      player2: { id: string; displayName: string; isMobile?: boolean };
      player1Score: number;
      player2Score: number;
      player1Inks: string[];
      player2Inks: string[];
      turnNumber: number;
      format: "best_of_1" | "best_of_3";
      matchType: string;
      createdAt: string;
      spectatorCount: number;
    }>;
    total: number;
  };
  activity: Array<{
    queueId: string | null;
    format: string;
    mode: string;
    matchType: string;
    action: "joined" | "left";
    reason: "matched" | "expired" | "requeued" | "manual";
    occurredAt: string;
  }>;
}
