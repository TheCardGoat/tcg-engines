import { z } from "zod";
import { CHAT_PRESET_KEYS, MAX_CHAT_TEXT_LENGTH } from "./shared";

/**
 * Client -> Server gateway WebSocket message schemas.
 *
 * Single source of truth for runtime validation at the trust boundary
 * (client → ws-gateway middleware). Internal traffic (ws-gateway → inbox
 * stream → game-server) trusts these types and skips revalidation.
 *
 * Each schema is paired with a `z.infer` type alias used by the typed
 * `ClientToServerEvents` map in `./events.ts`.
 *
 * Public (unauthenticated) messages: `ping`.
 * Authenticated messages require ticket / JWT / session.
 */

export const GatewayPingMessage = z.object({
  type: z.literal("ping"),
  /** Optional client timestamp for round-trip latency measurement. */
  t: z.number().optional(),
});

export const JoinGameMessage = z.object({
  type: z.literal("join_game"),
  gameId: z.string().min(1),
  role: z.enum(["player", "spectator"]).default("player"),
  /** `game_profiles.game_profile_id` when known — correlation only; ticket/session is authoritative. */
  gameProfileId: z.string().min(1).optional(),
  /** Auth account id (`users.id`) when known — correlation only. */
  userId: z.string().min(1).optional(),
  correlationId: z.string().optional(),
});

export const ExecuteMoveMessage = z.object({
  type: z.literal("execute_move"),
  gameId: z.string().min(1),
  /** Game roster seat id (`game_profiles.game_profile_id`); optional echo for logs. */
  gameProfileId: z.string().min(1).optional(),
  /** Auth account id (`users.id`) when known — correlation only. */
  userId: z.string().min(1).optional(),
  expectedVersion: z.number().int().min(0),
  moveType: z.string().min(1),
  payload: z.record(z.string(), z.unknown()),
  correlationId: z.string().optional(),
});

export const ReconnectMessage = z.object({
  correlationId: z.string().optional(),
  gameId: z.string().min(1),
  gameProfileId: z.string().min(1).optional(),
  lastReceivedVersion: z.number().int().min(0),
  type: z.literal("reconnect"),
  userId: z.string().min(1).optional(),
});

export const LeaveGameMessage = z.object({
  gameId: z.string().min(1),
  gameProfileId: z.string().min(1).optional(),
  type: z.literal("leave_game"),
  userId: z.string().min(1).optional(),
});

export const SendChatMessage = z.object({
  gameId: z.string().min(1),
  presetKey: z.enum(CHAT_PRESET_KEYS),
  type: z.literal("send_chat_message"),
});

export const SendFreeTextChatMessage = z.object({
  gameId: z.string().min(1),
  text: z
    .string()
    .trim()
    .min(1)
    .max(MAX_CHAT_TEXT_LENGTH)
    .refine((value) => !/[\r\n]/.test(value), {
      message: "Chat messages cannot contain newlines",
    }),
  type: z.literal("send_free_text_chat_message"),
});

export const HeartbeatMessage = z
  .object({
    type: z.literal("heartbeat"),
    /** Optional echoes for correlation; connection/ticket is authoritative. */
    gameProfileId: z.string().min(1).optional(),
    userId: z.string().min(1).optional(),
    /**
     * Game the client is currently in. Server uses this to detect stale state
     * (version mismatch) and match advancement (game ended).
     */
    game: z
      .object({
        gameId: z.string().min(1),
        matchId: z.string().min(1),
        stateVersion: z.number().int().min(0),
      })
      .optional(),
    /**
     * Client-side inactivity signals piggybacked on the heartbeat.
     * Used to surface AFK status to the opponent.
     */
    activity: z
      .object({
        idle: z.boolean(),
        tabVisible: z.boolean(),
      })
      .optional(),
  })
  .strict();

/**
 * Client pushes authoritative state for non-authoritative (client-authority) games.
 * The server stores the state in Redis and broadcasts to spectators.
 */
export const PushStateMessage = z
  .object({
    type: z.literal("push_state"),
    gameId: z.string().min(1),
    /** Serialized engine state (the client is authoritative). */
    state: z.unknown(),
    /** Monotonic version — client manages the version counter. */
    version: z.number().int().min(0),
    /** Move type that produced this state (for spectator display). */
    moveType: z.string().min(1),
    /** Actor who made the move. */
    actorId: z.string().min(1),
    /** Single accepted move delta for normal client-authority actions. */
    acceptedMove: z
      .object({
        actorId: z.string(),
        gameId: z.string(),
        input: z.unknown().optional(),
        moveId: z.string(),
        newStateID: z.number().int().min(0).optional(),
        processedCommand: z.unknown(),
        restoredCheckpointStateID: z.number().int().min(0).optional(),
        sourceAuthority: z.enum(["server", "client"]),
        stateVersion: z.number().int().min(0),
        timestamp: z.number().int().nonnegative(),
        transitionType: z.enum(["move", "undo"]).optional(),
        turnNumber: z.number().int().min(0),
        undoneMoveId: z.string().optional(),
        undoneStateID: z.number().int().min(0).optional(),
      })
      .optional(),
    /** Batch accepted move delta used when backfilling initial client-side history. */
    acceptedMoves: z
      .array(
        z.object({
          actorId: z.string(),
          gameId: z.string(),
          input: z.unknown().optional(),
          moveId: z.string(),
          newStateID: z.number().int().min(0).optional(),
          processedCommand: z.unknown(),
          restoredCheckpointStateID: z.number().int().min(0).optional(),
          sourceAuthority: z.enum(["server", "client"]),
          stateVersion: z.number().int().min(0),
          timestamp: z.number().int().nonnegative(),
          transitionType: z.enum(["move", "undo"]).optional(),
          turnNumber: z.number().int().min(0),
          undoneMoveId: z.string().optional(),
          undoneStateID: z.number().int().min(0).optional(),
        }),
      )
      .optional(),
    engineLogs: z
      .array(
        z.object({
          gameId: z.string(),
          log: z.unknown(),
          sourceAuthority: z.enum(["server", "client"]),
          stateVersion: z.number().int().min(0),
          timestamp: z.number().int().nonnegative(),
        }),
      )
      .optional(),
  })
  .passthrough();

/**
 * Client polls for matchmaking status on reconnect.
 * Server responds with a matchmaking_status WebSocket message.
 */
export const MatchmakingPollMessage = z.object({
  type: z.literal("matchmaking_poll"),
});

/** Client accepts a pending match found by the matchmaking worker. */
export const MatchmakingAcceptMessage = z.object({
  pendingMatchId: z.string().min(1),
  type: z.literal("matchmaking_accept"),
});

/** Client declines a pending match found by the matchmaking worker. */
export const MatchmakingDeclineMessage = z.object({
  pendingMatchId: z.string().min(1),
  type: z.literal("matchmaking_decline"),
});

/**
 * Immediate inactivity signal sent when the client's idle/tab-visibility state changes.
 * Sent in addition to the heartbeat piggyback so the server reacts within ~1 second.
 */
export const ActivityUpdateMessage = z.object({
  gameId: z.string().min(1),
  idle: z.boolean(),
  tabVisible: z.boolean(),
  type: z.literal("activity_update"),
});

/** Skip the opponent's turn when they are in negative time (first timeout). */
export const SkipOpponentTurnMessage = z.object({
  gameId: z.string().min(1),
  type: z.literal("skip_opponent_turn"),
});

/** Drop the opponent when they have timed out twice (second timeout). */
export const DropPlayerMessage = z.object({
  gameId: z.string().min(1),
  type: z.literal("drop_player"),
});

/**
 * Client requests a lightweight state sync check after receiving a
 * `game_already_completed` error.
 */
export const RequestGameStateSyncMessage = z.object({
  gameId: z.string().min(1),
  stateVersion: z.number().int().optional(),
  type: z.literal("request_game_state_sync"),
});

// --- Proposal (bilateral consent) messages ---

export const ProposalActionType = z.enum([
  "cancel_match",
  "undo",
  "enable_free_text_chat",
  "enable_manual_mode",
  "disable_manual_mode",
]);

export const ProposalSendMessage = z.object({
  actionType: ProposalActionType,
  gameId: z.string().min(1),
  type: z.literal("proposal_send"),
});

export const ProposalAcceptMessage = z.object({
  actionType: ProposalActionType,
  gameId: z.string().min(1),
  type: z.literal("proposal_accept"),
});

export const ProposalDeclineMessage = z.object({
  actionType: ProposalActionType,
  gameId: z.string().min(1),
  type: z.literal("proposal_decline"),
});

export const GatewayClientMessage = z.union([
  GatewayPingMessage,
  JoinGameMessage,
  ExecuteMoveMessage,
  ReconnectMessage,
  LeaveGameMessage,
  SendChatMessage,
  SendFreeTextChatMessage,
  HeartbeatMessage,
  ActivityUpdateMessage,
  PushStateMessage,
  MatchmakingPollMessage,
  MatchmakingAcceptMessage,
  MatchmakingDeclineMessage,
  SkipOpponentTurnMessage,
  DropPlayerMessage,
  ProposalSendMessage,
  ProposalAcceptMessage,
  ProposalDeclineMessage,
  RequestGameStateSyncMessage,
]);

export type MatchmakingPollMsg = z.infer<typeof MatchmakingPollMessage>;
export type GatewayPingMsg = z.infer<typeof GatewayPingMessage>;
export type JoinGameMsg = z.infer<typeof JoinGameMessage>;
export type ExecuteMoveMsg = z.infer<typeof ExecuteMoveMessage>;
export type ReconnectMsg = z.infer<typeof ReconnectMessage>;
export type LeaveGameMsg = z.infer<typeof LeaveGameMessage>;
export type SendChatMessageMsg = z.infer<typeof SendChatMessage>;
export type SendFreeTextChatMessageMsg = z.infer<typeof SendFreeTextChatMessage>;
export type HeartbeatMsg = z.infer<typeof HeartbeatMessage>;
export type PushStateMsg = z.infer<typeof PushStateMessage>;
export type MatchmakingAcceptMsg = z.infer<typeof MatchmakingAcceptMessage>;
export type MatchmakingDeclineMsg = z.infer<typeof MatchmakingDeclineMessage>;
export type SkipOpponentTurnMsg = z.infer<typeof SkipOpponentTurnMessage>;
export type DropPlayerMsg = z.infer<typeof DropPlayerMessage>;
export type ProposalActionTypeValue = z.infer<typeof ProposalActionType>;
export type ProposalSendMsg = z.infer<typeof ProposalSendMessage>;
export type ProposalAcceptMsg = z.infer<typeof ProposalAcceptMessage>;
export type ProposalDeclineMsg = z.infer<typeof ProposalDeclineMessage>;
export type ActivityUpdateMsg = z.infer<typeof ActivityUpdateMessage>;
export type RequestGameStateSyncMsg = z.infer<typeof RequestGameStateSyncMessage>;
export type GatewayClientMsg = z.infer<typeof GatewayClientMessage>;
