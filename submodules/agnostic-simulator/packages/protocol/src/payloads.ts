/**
 * Server -> Client payload shapes.
 *
 * These describe the *args* of each event in `ServerToClientEvents`. They are
 * NOT validated at runtime — the server is the producer, types are sufficient.
 *
 * Game-engine-specific shapes (Lorcana animations, accepted-move records,
 * engine logs, cards maps, match state views) are intentionally typed as
 * `unknown[]` / `unknown` so this package stays game-agnostic. Concrete
 * shapes live alongside the producers in `apps/api/src/modules/play/types`
 * and remain re-exported from `apps/api/src/modules/gateway/protocol/`.
 */

import type { ChatMessage } from "./chat.js";
import type { PlayableGameSlug } from "./games.js";
import type { EngineInteractionView } from "./interactions.js";

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
}

export interface GameJoinedPayload {
  gameId: string;
  role: "player" | "spectator";
  stateVersion: number;
  state: unknown;
  cardsMaps?: unknown;
  players: { id: string; connected: boolean; disconnectedAt?: string }[];
  playerVisualSettings?: Record<string, PlayerVisualSettings>;
  pendingProposal?: PendingProposal;
  interactionView?: EngineInteractionView;
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
  animations: unknown[];
  /** Full state snapshot, included whenever the backend can avoid client-side patch application. */
  state: unknown;
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
}

export interface StateSyncPayload extends Omit<ClientUpdateBaseProperties, "patches"> {}
export interface StateUpdatePayload extends ClientUpdateBaseProperties {
  moveType?: string;
  actorId?: string;
  payload?: unknown;
  acceptedMove?: unknown;
}

export interface MoveAcceptedPayload extends ClientUpdateBaseProperties {
  moveType: string;
  actorId: string;
  acceptedMove?: unknown;
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
  reason: "creator_cancelled" | "expired";
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
}

export interface ProposalResolvedPayload {
  gameId: string;
  matchId: string;
  actionType: string;
  resolution: "accepted" | "declined" | "failed";
}

export interface ProposalExpiredPayload {
  gameId: string;
  matchId: string;
  actionType: string;
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
}

export interface GlobalAnnouncementPayload {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning" | "critical";
  issuedAt: string;
}

export interface FriendMessagePayload {
  messageId: string;
  fromUserId: string;
  fromUserName: string;
  content: string;
  sentAt: string;
}
