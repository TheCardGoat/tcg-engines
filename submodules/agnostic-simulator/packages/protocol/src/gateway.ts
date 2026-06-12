import { z } from "zod";
import { EngineInteractionView, InteractionSubmission } from "./interactions.js";

const opaqueId = z.string().min(1);
const looseObject = z.record(z.string(), z.unknown());
const matchStatus = z.enum(["waiting", "in_progress", "completed", "abandoned"]);

/**
 * Raw JSON WebSocket contract for clients that connect to
 * `/v1/gateway/ws?game=<slug>&ticket=<ticket>`.
 *
 * This is the deployed native WebSocket shape. Authentication is carried by
 * the WS URL, moves use `moveType`, and state snapshots are included directly
 * on update messages.
 */

export const RawGatewayPingMessageSchema = z
  .object({
    type: z.literal("ping"),
    t: z.number().optional(),
  })
  .strict();

export const RawGatewayJoinGameMessageSchema = z
  .object({
    type: z.literal("join_game"),
    gameId: opaqueId,
    role: z.enum(["player", "spectator"]).default("player"),
    gameProfileId: opaqueId.optional(),
    userId: opaqueId.optional(),
    correlationId: z.string().optional(),
  })
  .strict();

export const RawGatewayExecuteMoveMessageSchema = z
  .object({
    type: z.literal("execute_move"),
    gameId: opaqueId,
    expectedVersion: z.number().int().nonnegative(),
    moveType: opaqueId,
    payload: looseObject,
    gameProfileId: opaqueId.optional(),
    userId: opaqueId.optional(),
    correlationId: z.string().optional(),
  })
  .strict();

export const RawGatewaySubmitInteractionMessageSchema = z
  .object({
    type: z.literal("submit_interaction"),
    gameId: opaqueId,
    expectedVersion: z.number().int().nonnegative(),
    submission: InteractionSubmission,
    gameProfileId: opaqueId.optional(),
    userId: opaqueId.optional(),
    correlationId: z.string().optional(),
  })
  .strict();

export const RawGatewayHeartbeatMessageSchema = z
  .object({
    type: z.literal("heartbeat"),
    gameProfileId: opaqueId.optional(),
    userId: opaqueId.optional(),
    game: z
      .object({
        gameId: opaqueId,
        matchId: opaqueId,
        stateVersion: z.number().int().nonnegative(),
      })
      .strict()
      .optional(),
    activity: z
      .object({
        idle: z.boolean(),
        tabVisible: z.boolean(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const RawGatewayLeaveGameMessageSchema = z
  .object({
    type: z.literal("leave_game"),
    gameId: opaqueId,
    gameProfileId: opaqueId.optional(),
    userId: opaqueId.optional(),
  })
  .strict();

export const RawGatewayRequestStateSyncMessageSchema = z
  .object({
    type: z.literal("request_game_state_sync"),
    gameId: opaqueId,
    stateVersion: z.number().int().optional(),
  })
  .strict();

export const RawGatewayClientMessageSchema = z.discriminatedUnion("type", [
  RawGatewayPingMessageSchema,
  RawGatewayJoinGameMessageSchema,
  RawGatewayExecuteMoveMessageSchema,
  RawGatewaySubmitInteractionMessageSchema,
  RawGatewayHeartbeatMessageSchema,
  RawGatewayLeaveGameMessageSchema,
  RawGatewayRequestStateSyncMessageSchema,
]);

export const RawGatewayMatchInfoSchema = z
  .object({
    matchId: opaqueId,
    matchStatus: matchStatus,
    matchCompleted: z.boolean(),
    nextGameId: opaqueId.optional(),
    player1Score: z.number().int().nonnegative(),
    player2Score: z.number().int().nonnegative(),
    winnerId: opaqueId.optional(),
  })
  .strict();

export const RawGatewayWelcomeMessageSchema = z
  .object({
    type: z.literal("welcome"),
    authenticated: z.boolean(),
    authenticationMethod: z.string().optional(),
    connectionId: opaqueId,
    userId: z.string().nullable().optional(),
    userName: z.string().nullable().optional(),
    game: z.string().nullable().optional(),
  })
  .strict();

export const RawGatewayErrorMessageSchema = z
  .object({
    type: z.union([z.literal("gateway_error"), z.literal("error")]),
    code: z.string(),
    message: z.string(),
    correlationId: z.string().optional(),
  })
  .strict();

export const RawGatewayGameJoinedMessageSchema = z
  .object({
    type: z.literal("game_joined"),
    gameId: opaqueId,
    role: z.enum(["player", "spectator"]),
    stateVersion: z.number().int().nonnegative(),
    state: z.unknown(),
    cardsMaps: z.unknown().optional(),
    players: z.array(
      z
        .object({
          id: opaqueId,
          connected: z.boolean(),
          disconnectedAt: z.string().optional(),
        })
        .strict(),
    ),
    playerVisualSettings: z.record(z.string(), z.unknown()).optional(),
    pendingProposal: z.unknown().optional(),
    manualModeEnabled: z.boolean().optional(),
    interactionView: EngineInteractionView.optional(),
    correlationId: z.string().optional(),
  })
  .strict();

export const RawGatewayGameRecentHistoryMessageSchema = z
  .object({
    type: z.literal("game_recent_history"),
    gameId: opaqueId,
    acceptedMoves: z.array(z.unknown()),
    engineLogs: z.array(z.unknown()),
  })
  .strict();

export const RawGatewayGameChatHistoryMessageSchema = z
  .object({
    type: z.literal("game_chat_history"),
    gameId: opaqueId,
    matchId: opaqueId,
    messages: z.array(z.unknown()),
    freeTextEnabled: z.boolean(),
  })
  .strict();

export const RawGatewayChatMessageSchema = z
  .object({
    type: z.literal("chat_message"),
    gameId: opaqueId,
    matchId: opaqueId,
    message: z.unknown(),
  })
  .strict();

export const RawGatewayRequestStateSyncServerMessageSchema = z
  .object({
    type: z.literal("request_state_sync"),
    gameId: opaqueId,
  })
  .strict();

export const RawGatewayProposalReceivedMessageSchema = z
  .object({
    type: z.literal("proposal_received"),
    gameId: opaqueId,
    matchId: opaqueId,
    actionType: z.string(),
    senderPlayerId: opaqueId,
    deadline: z.number(),
  })
  .strict();

export const RawGatewayProposalResolvedMessageSchema = z
  .object({
    type: z.literal("proposal_resolved"),
    gameId: opaqueId,
    matchId: opaqueId,
    actionType: z.string(),
    resolution: z.enum(["accepted", "declined", "failed"]),
  })
  .strict();

export const RawGatewayProposalExpiredMessageSchema = z
  .object({
    type: z.literal("proposal_expired"),
    gameId: opaqueId,
    matchId: opaqueId,
    actionType: z.string(),
  })
  .strict();

const rawGatewayUpdateBase = {
  gameId: opaqueId,
  stateVersion: z.number().int().nonnegative(),
  patches: z.array(z.unknown()),
  engineLogs: z.array(z.unknown()),
  animations: z.array(z.unknown()),
  state: z.unknown(),
  serverProcessingMs: z.number().optional(),
  matchInfo: RawGatewayMatchInfoSchema.optional(),
  interactionView: EngineInteractionView.optional(),
} as const;

export const RawGatewayMoveAcceptedMessageSchema = z
  .object({
    type: z.literal("move_accepted"),
    ...rawGatewayUpdateBase,
    moveType: opaqueId,
    actorId: opaqueId,
    payload: z.unknown().optional(),
    acceptedMove: z.unknown().optional(),
    undoable: z.boolean().optional(),
    correlationId: z.string().optional(),
  })
  .strict();

export const RawGatewayStateUpdateMessageSchema = z
  .object({
    type: z.literal("state_update"),
    ...rawGatewayUpdateBase,
    moveType: opaqueId.optional(),
    actorId: opaqueId.optional(),
    payload: z.unknown().optional(),
    acceptedMove: z.unknown().optional(),
  })
  .strict();

export const RawGatewayStateSyncMessageSchema = z
  .object({
    type: z.literal("state_sync"),
    gameId: opaqueId,
    stateVersion: z.number().int().nonnegative(),
    engineLogs: z.array(z.unknown()),
    animations: z.array(z.unknown()),
    state: z.unknown(),
    serverProcessingMs: z.number().optional(),
    matchInfo: RawGatewayMatchInfoSchema.optional(),
    interactionView: EngineInteractionView.optional(),
  })
  .strict();

export const RawGatewayMoveRejectedMessageSchema = z
  .object({
    type: z.literal("move_rejected"),
    gameId: opaqueId,
    reason: z.string(),
    code: z.enum(["rejected_stale", "rejected_illegal"]),
    currentVersion: z.number().int().nonnegative(),
    state: z.unknown().optional(),
    correlationId: z.string().optional(),
  })
  .strict();

export const RawGatewayGameEndedMessageSchema = z
  .object({
    type: z.literal("game_ended"),
    gameId: opaqueId,
    winnerId: opaqueId.optional(),
    reason: z.string(),
    matchId: opaqueId.optional(),
    nextGameId: opaqueId.optional(),
    matchCompleted: z.boolean().optional(),
    matchStatus: matchStatus.optional(),
    player1Score: z.number().int().nonnegative().optional(),
    player2Score: z.number().int().nonnegative().optional(),
  })
  .strict();

export const RawGatewayMatchStateMessageSchema = z
  .object({
    type: z.literal("match_state"),
    matchId: opaqueId,
    gameType: z.string().optional(),
    format: z.string().optional(),
    status: matchStatus,
    player1Score: z.number().int().nonnegative(),
    player2Score: z.number().int().nonnegative(),
    currentGameId: opaqueId.optional(),
    gameIds: z.array(opaqueId),
    winnerId: opaqueId.optional(),
    durationMs: z.number().optional(),
  })
  .passthrough();

export const RawGatewayHeartbeatAckMessageSchema = z
  .object({
    type: z.literal("heartbeat_ack"),
    serverTime: z.string(),
    stateVersions: z.record(z.string(), z.number().int().nonnegative()),
  })
  .strict();

export const RawGatewayPongMessageSchema = z
  .object({
    type: z.literal("pong"),
    serverTime: z.string().optional(),
    t: z.number().optional(),
  })
  .strict();

export const RawGatewayServerMessageSchema = z.discriminatedUnion("type", [
  RawGatewayWelcomeMessageSchema,
  RawGatewayErrorMessageSchema,
  RawGatewayGameJoinedMessageSchema,
  RawGatewayGameRecentHistoryMessageSchema,
  RawGatewayGameChatHistoryMessageSchema,
  RawGatewayChatMessageSchema,
  RawGatewayMoveAcceptedMessageSchema,
  RawGatewayStateUpdateMessageSchema,
  RawGatewayStateSyncMessageSchema,
  RawGatewayMoveRejectedMessageSchema,
  RawGatewayGameEndedMessageSchema,
  RawGatewayMatchStateMessageSchema,
  RawGatewayHeartbeatAckMessageSchema,
  RawGatewayPongMessageSchema,
  RawGatewayRequestStateSyncServerMessageSchema,
  RawGatewayProposalReceivedMessageSchema,
  RawGatewayProposalResolvedMessageSchema,
  RawGatewayProposalExpiredMessageSchema,
]);

export type RawGatewayPingMessage = z.infer<typeof RawGatewayPingMessageSchema>;
export type RawGatewayJoinGameMessage = z.infer<typeof RawGatewayJoinGameMessageSchema>;
export type RawGatewayExecuteMoveMessage = z.infer<typeof RawGatewayExecuteMoveMessageSchema>;
export type RawGatewaySubmitInteractionMessage = z.infer<
  typeof RawGatewaySubmitInteractionMessageSchema
>;
export type RawGatewayHeartbeatMessage = z.infer<typeof RawGatewayHeartbeatMessageSchema>;
export type RawGatewayLeaveGameMessage = z.infer<typeof RawGatewayLeaveGameMessageSchema>;
export type RawGatewayRequestStateSyncMessage = z.infer<
  typeof RawGatewayRequestStateSyncMessageSchema
>;
export type RawGatewayClientMessage = z.infer<typeof RawGatewayClientMessageSchema>;
export type RawGatewayMatchInfo = z.infer<typeof RawGatewayMatchInfoSchema>;
export type RawGatewayServerMessage = z.infer<typeof RawGatewayServerMessageSchema>;
