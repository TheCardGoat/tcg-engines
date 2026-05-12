import { z } from "zod";

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
    t: z.number().optional(),
    type: z.literal("ping"),
  })
  .strict();

export const RawGatewayJoinGameMessageSchema = z
  .object({
    correlationId: z.string().optional(),
    gameId: opaqueId,
    gameProfileId: opaqueId.optional(),
    role: z.enum(["player", "spectator"]).default("player"),
    type: z.literal("join_game"),
    userId: opaqueId.optional(),
  })
  .strict();

export const RawGatewayExecuteMoveMessageSchema = z
  .object({
    correlationId: z.string().optional(),
    expectedVersion: z.number().int().nonnegative(),
    gameId: opaqueId,
    gameProfileId: opaqueId.optional(),
    moveType: opaqueId,
    payload: looseObject,
    type: z.literal("execute_move"),
    userId: opaqueId.optional(),
  })
  .strict();

export const RawGatewayHeartbeatMessageSchema = z
  .object({
    activity: z
      .object({
        idle: z.boolean(),
        tabVisible: z.boolean(),
      })
      .strict()
      .optional(),
    game: z
      .object({
        gameId: opaqueId,
        matchId: opaqueId,
        stateVersion: z.number().int().nonnegative(),
      })
      .strict()
      .optional(),
    gameProfileId: opaqueId.optional(),
    type: z.literal("heartbeat"),
    userId: opaqueId.optional(),
  })
  .strict();

export const RawGatewayLeaveGameMessageSchema = z
  .object({
    gameId: opaqueId,
    gameProfileId: opaqueId.optional(),
    type: z.literal("leave_game"),
    userId: opaqueId.optional(),
  })
  .strict();

export const RawGatewayRequestStateSyncMessageSchema = z
  .object({
    gameId: opaqueId,
    stateVersion: z.number().int().optional(),
    type: z.literal("request_game_state_sync"),
  })
  .strict();

export const RawGatewayClientMessageSchema = z.discriminatedUnion("type", [
  RawGatewayPingMessageSchema,
  RawGatewayJoinGameMessageSchema,
  RawGatewayExecuteMoveMessageSchema,
  RawGatewayHeartbeatMessageSchema,
  RawGatewayLeaveGameMessageSchema,
  RawGatewayRequestStateSyncMessageSchema,
]);

export const RawGatewayMatchInfoSchema = z
  .object({
    matchCompleted: z.boolean(),
    matchId: opaqueId,
    matchStatus: matchStatus,
    nextGameId: opaqueId.optional(),
    player1Score: z.number().int().nonnegative(),
    player2Score: z.number().int().nonnegative(),
    winnerId: opaqueId.optional(),
  })
  .strict();

export const RawGatewayWelcomeMessageSchema = z
  .object({
    authenticated: z.boolean(),
    authenticationMethod: z.string().optional(),
    connectionId: opaqueId,
    game: z.string().nullable().optional(),
    type: z.literal("welcome"),
    userId: z.string().nullable().optional(),
    userName: z.string().nullable().optional(),
  })
  .strict();

export const RawGatewayErrorMessageSchema = z
  .object({
    code: z.string(),
    correlationId: z.string().optional(),
    message: z.string(),
    type: z.union([z.literal("gateway_error"), z.literal("error")]),
  })
  .strict();

export const RawGatewayGameJoinedMessageSchema = z
  .object({
    cardsMaps: z.unknown().optional(),
    correlationId: z.string().optional(),
    gameId: opaqueId,
    manualModeEnabled: z.boolean().optional(),
    pendingProposal: z.unknown().optional(),
    playerVisualSettings: z.record(z.string(), z.unknown()).optional(),
    players: z.array(
      z
        .object({
          id: opaqueId,
          connected: z.boolean(),
          disconnectedAt: z.string().optional(),
        })
        .strict(),
    ),
    role: z.enum(["player", "spectator"]),
    state: z.unknown(),
    stateVersion: z.number().int().nonnegative(),
    type: z.literal("game_joined"),
  })
  .strict();

const rawGatewayUpdateBase = {
  animations: z.array(z.unknown()),
  engineLogs: z.array(z.unknown()),
  gameId: opaqueId,
  matchInfo: RawGatewayMatchInfoSchema.optional(),
  patches: z.array(z.unknown()),
  serverProcessingMs: z.number().optional(),
  state: z.unknown(),
  stateVersion: z.number().int().nonnegative(),
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
  })
  .strict();

export const RawGatewayStateSyncMessageSchema = z
  .object({
    animations: z.array(z.unknown()),
    engineLogs: z.array(z.unknown()),
    gameId: opaqueId,
    matchInfo: RawGatewayMatchInfoSchema.optional(),
    serverProcessingMs: z.number().optional(),
    state: z.unknown(),
    stateVersion: z.number().int().nonnegative(),
    type: z.literal("state_sync"),
  })
  .strict();

export const RawGatewayMoveRejectedMessageSchema = z
  .object({
    code: z.enum(["rejected_stale", "rejected_illegal"]),
    correlationId: z.string().optional(),
    currentVersion: z.number().int().nonnegative(),
    gameId: opaqueId,
    reason: z.string(),
    state: z.unknown().optional(),
    type: z.literal("move_rejected"),
  })
  .strict();

export const RawGatewayGameEndedMessageSchema = z
  .object({
    gameId: opaqueId,
    matchCompleted: z.boolean().optional(),
    matchId: opaqueId.optional(),
    matchStatus: matchStatus.optional(),
    nextGameId: opaqueId.optional(),
    player1Score: z.number().int().nonnegative().optional(),
    player2Score: z.number().int().nonnegative().optional(),
    reason: z.string(),
    type: z.literal("game_ended"),
    winnerId: opaqueId.optional(),
  })
  .strict();

export const RawGatewayMatchStateMessageSchema = z
  .object({
    currentGameId: opaqueId.optional(),
    durationMs: z.number().optional(),
    format: z.string().optional(),
    gameIds: z.array(opaqueId),
    gameType: z.string().optional(),
    matchId: opaqueId,
    player1Score: z.number().int().nonnegative(),
    player2Score: z.number().int().nonnegative(),
    status: matchStatus,
    type: z.literal("match_state"),
    winnerId: opaqueId.optional(),
  })
  .passthrough();

export const RawGatewayHeartbeatAckMessageSchema = z
  .object({
    serverTime: z.string(),
    stateVersions: z.record(z.string(), z.number().int().nonnegative()),
    type: z.literal("heartbeat_ack"),
  })
  .strict();

export const RawGatewayPongMessageSchema = z
  .object({
    serverTime: z.string().optional(),
    t: z.number().optional(),
    type: z.literal("pong"),
  })
  .strict();

export const RawGatewayServerMessageSchema = z.discriminatedUnion("type", [
  RawGatewayWelcomeMessageSchema,
  RawGatewayErrorMessageSchema,
  RawGatewayGameJoinedMessageSchema,
  RawGatewayMoveAcceptedMessageSchema,
  RawGatewayStateUpdateMessageSchema,
  RawGatewayStateSyncMessageSchema,
  RawGatewayMoveRejectedMessageSchema,
  RawGatewayGameEndedMessageSchema,
  RawGatewayMatchStateMessageSchema,
  RawGatewayHeartbeatAckMessageSchema,
  RawGatewayPongMessageSchema,
]);

export type RawGatewayPingMessage = z.infer<typeof RawGatewayPingMessageSchema>;
export type RawGatewayJoinGameMessage = z.infer<typeof RawGatewayJoinGameMessageSchema>;
export type RawGatewayExecuteMoveMessage = z.infer<typeof RawGatewayExecuteMoveMessageSchema>;
export type RawGatewayHeartbeatMessage = z.infer<typeof RawGatewayHeartbeatMessageSchema>;
export type RawGatewayLeaveGameMessage = z.infer<typeof RawGatewayLeaveGameMessageSchema>;
export type RawGatewayRequestStateSyncMessage = z.infer<
  typeof RawGatewayRequestStateSyncMessageSchema
>;
export type RawGatewayClientMessage = z.infer<typeof RawGatewayClientMessageSchema>;
export type RawGatewayMatchInfo = z.infer<typeof RawGatewayMatchInfoSchema>;
export type RawGatewayServerMessage = z.infer<typeof RawGatewayServerMessageSchema>;
