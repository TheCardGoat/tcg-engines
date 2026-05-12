/**
 * Typed Socket.io event maps shared by ws-gateway, game-server, and (future)
 * web client. Drives the typed `Server<...>` and `Socket<...>` generics so
 * `socket.emit("execute_move", payload)` is exhaustively type-checked at
 * compile time.
 *
 * Per-event payloads come from `./schemas.ts` (client→server, derived via
 * `z.infer`) and `./payloads.ts` (server→client, plain interfaces). Adding
 * a new event = adding a payload + a one-line entry here; the inbox
 * dispatcher's `switch` becomes non-exhaustive and TS forces the update.
 */

import type {
  ActivityUpdateMsg,
  DropPlayerMsg,
  ExecuteMoveMsg,
  GatewayPingMsg,
  HeartbeatMsg,
  JoinGameMsg,
  LeaveGameMsg,
  MatchmakingAcceptMsg,
  MatchmakingDeclineMsg,
  MatchmakingPollMsg,
  ProposalAcceptMsg,
  ProposalDeclineMsg,
  ProposalSendMsg,
  PushStateMsg,
  ReconnectMsg,
  RequestGameStateSyncMsg,
  SendChatMessageMsg,
  SendFreeTextChatMessageMsg,
  SkipOpponentTurnMsg,
} from "./schemas";
import type { PlayableGameSlug } from "./shared";
import type {
  ChatMessageEventPayload,
  ErrorPayload,
  GameChatHistoryPayload,
  GameEndedPayload,
  GameJoinedPayload,
  GameRecentHistoryPayload,
  GatewayErrorPayload,
  GatewayPongPayload,
  GatewayWelcomePayload,
  HeartbeatAckPayload,
  LobbyPlayerJoinedPayload,
  LobbyPlayerLeftPayload,
  LobbyRoomCancelledPayload,
  MatchFoundPayload,
  MatchReadyExpiredPayload,
  MatchReadyPayload,
  MatchReadyUpdatePayload,
  MatchStatePayload,
  MatchmakingCancelledPayload,
  MatchmakingStatusPayload,
  MoveAcceptedPayload,
  MoveRejectedPayload,
  PlayerActivityPayload,
  PlayerDropPendingPayload,
  PresenceChangePayload,
  ProposalExpiredPayload,
  ProposalReceivedPayload,
  ProposalResolvedPayload,
  RequestStateSyncPayload,
  ServerShuttingDownPayload,
  StateSyncPayload,
  StateUpdatePayload,
  TimeoutNotificationPayload,
} from "./payloads";

/**
 * Stripped version of the client→server messages: the ws-gateway has already
 * pulled `type` off the envelope, so handlers receive just the payload body.
 */
type Without<T, K extends string> = Omit<T, K>;
type Payload<T extends { type: string }> = Without<T, "type">;

export interface ClientToServerEvents {
  ping: (payload: Payload<GatewayPingMsg>) => void;
  join_game: (payload: Payload<JoinGameMsg>) => void;
  execute_move: (payload: Payload<ExecuteMoveMsg>) => void;
  reconnect: (payload: Payload<ReconnectMsg>) => void;
  leave_game: (payload: Payload<LeaveGameMsg>) => void;
  send_chat_message: (payload: Payload<SendChatMessageMsg>) => void;
  send_free_text_chat_message: (payload: Payload<SendFreeTextChatMessageMsg>) => void;
  heartbeat: (payload: Payload<HeartbeatMsg>) => void;
  activity_update: (payload: Payload<ActivityUpdateMsg>) => void;
  push_state: (payload: Payload<PushStateMsg>) => void;
  matchmaking_poll: (payload: Payload<MatchmakingPollMsg>) => void;
  matchmaking_accept: (payload: Payload<MatchmakingAcceptMsg>) => void;
  matchmaking_decline: (payload: Payload<MatchmakingDeclineMsg>) => void;
  skip_opponent_turn: (payload: Payload<SkipOpponentTurnMsg>) => void;
  drop_player: (payload: Payload<DropPlayerMsg>) => void;
  request_game_state_sync: (payload: Payload<RequestGameStateSyncMsg>) => void;
  proposal_send: (payload: Payload<ProposalSendMsg>) => void;
  proposal_accept: (payload: Payload<ProposalAcceptMsg>) => void;
  proposal_decline: (payload: Payload<ProposalDeclineMsg>) => void;
}

export interface ServerToClientEvents {
  pong: (payload: GatewayPongPayload) => void;
  welcome: (payload: GatewayWelcomePayload) => void;
  gateway_error: (payload: GatewayErrorPayload) => void;
  error: (payload: ErrorPayload) => void;
  game_joined: (payload: GameJoinedPayload) => void;
  game_recent_history: (payload: GameRecentHistoryPayload) => void;
  game_chat_history: (payload: GameChatHistoryPayload) => void;
  chat_message: (payload: ChatMessageEventPayload) => void;
  state_update: (payload: StateUpdatePayload) => void;
  state_sync: (payload: StateSyncPayload) => void;
  move_accepted: (payload: MoveAcceptedPayload) => void;
  move_rejected: (payload: MoveRejectedPayload) => void;
  presence_change: (payload: PresenceChangePayload) => void;
  game_ended: (payload: GameEndedPayload) => void;
  match_state: (payload: MatchStatePayload) => void;
  heartbeat_ack: (payload: HeartbeatAckPayload) => void;
  matchmaking_status: (payload: MatchmakingStatusPayload) => void;
  match_found: (payload: MatchFoundPayload) => void;
  matchmaking_cancelled: (payload: MatchmakingCancelledPayload) => void;
  match_ready: (payload: MatchReadyPayload) => void;
  match_ready_update: (payload: MatchReadyUpdatePayload) => void;
  match_ready_expired: (payload: MatchReadyExpiredPayload) => void;
  timeout_notification: (payload: TimeoutNotificationPayload) => void;
  lobby_player_joined: (payload: LobbyPlayerJoinedPayload) => void;
  lobby_room_cancelled: (payload: LobbyRoomCancelledPayload) => void;
  lobby_player_left: (payload: LobbyPlayerLeftPayload) => void;
  request_state_sync: (payload: RequestStateSyncPayload) => void;
  server_shutting_down: (payload: ServerShuttingDownPayload) => void;
  player_drop_pending: (payload: PlayerDropPendingPayload) => void;
  player_activity: (payload: PlayerActivityPayload) => void;
  proposal_received: (payload: ProposalReceivedPayload) => void;
  proposal_resolved: (payload: ProposalResolvedPayload) => void;
  proposal_expired: (payload: ProposalExpiredPayload) => void;

  // Explicit response events for the call/response pattern (§5).
  // The ws-gateway is stateless: there is no pendingAcks map. The client
  // Generates a `correlationId` per call and listens for the matching
  // `:response` event. Game-server emits these via `io.to(socketId).emit(...)`,
  // Routed by the Streams adapter to the right ws-gateway → exact socket.
  "execute_move:response": (payload: Response<MoveAcceptedPayload, MoveRejectedPayload>) => void;
  "join_game:response": (payload: Response<GameJoinedPayload, ErrorPayload>) => void;
  "reconnect:response": (payload: Response<GameJoinedPayload, ErrorPayload>) => void;
  "request_game_state_sync:response": (payload: Response<StateSyncPayload, ErrorPayload>) => void;
  "proposal_send:response": (payload: Response<ProposalReceivedPayload, ErrorPayload>) => void;
  "proposal_accept:response": (payload: Response<ProposalResolvedPayload, ErrorPayload>) => void;
  "proposal_decline:response": (payload: Response<ProposalResolvedPayload, ErrorPayload>) => void;
}

/**
 * Discriminated union for explicit response events. `correlationId` ties the
 * response back to the originating client `call(...)` (see §5 of the plan).
 */
export type Response<TOk, TErr> =
  | { correlationId: string; status: "ok"; data: TOk }
  | { correlationId: string; status: "err"; data: TErr };

/**
 * Currently unused — we deliberately do NOT use Socket.io's `serverSideEmit`
 * for inter-server traffic because it broadcasts to all subscribed nodes,
 * which is wrong for "exactly-one game-server processes this move". The
 * inbox stream + consumer group provides exactly-one semantics instead.
 *
 * Kept as a placeholder so the typed `Server<C2S, S2C, InterServerEvents,
 * SocketData>` generic chain stays explicit and we don't accidentally widen
 * to `DefaultEventsMap` later.
 */
export interface InterServerEvents {
  // Intentionally empty
}

/**
 * Per-socket data attached to every Socket.io socket on the ws-gateway.
 * Populated by the auth middleware (`io.use(authMiddleware)`) and read by
 * the inbound event handlers when building inbox envelopes.
 */
export interface SocketData {
  /**
   * The game namespace this socket connected through. Derived from
   * `socket.nsp.name` (`/lorcana` → `"lorcana"`) at namespace
   * registration time and never changes for the socket's lifetime.
   * Drives inbox stream selection and downstream routing.
   */
  gameSlug: PlayableGameSlug;
  userId: string | null;
  authenticated: boolean;
  authMethod: "ticket" | "jwt" | "anonymous";
  /** Optional echo for log correlation; never trusted for auth. */
  userName: string | null;
  /** Game ids this socket is currently a member of (drives Socket.io rooms). */
  joinedGames: Set<string>;
}
