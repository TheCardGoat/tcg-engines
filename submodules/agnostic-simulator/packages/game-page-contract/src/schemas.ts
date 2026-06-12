import { z } from "zod";

import { REPLAY_FILE_VERSION } from "./replay.js";

// ---------- Primitives ----------

const opaqueId = z.string().min(1);

export const GameTypeSchema = z.enum(["lorcana", "gundam", "cyberpunk", "riftbound"]);

export const CardsMapsSchema = z
  .object({
    cardInstances: z.record(opaqueId, opaqueId),
    owners: z.record(opaqueId, z.array(opaqueId)),
  })
  .strict();

export const JsonPatchOpSchema = z.discriminatedUnion("op", [
  z.object({ op: z.literal("add"), path: z.string(), value: z.unknown() }).strict(),
  z.object({ op: z.literal("remove"), path: z.string() }).strict(),
  z.object({ op: z.literal("replace"), path: z.string(), value: z.unknown() }).strict(),
  z.object({ op: z.literal("move"), from: z.string(), path: z.string() }).strict(),
  z.object({ op: z.literal("copy"), from: z.string(), path: z.string() }).strict(),
  z.object({ op: z.literal("test"), path: z.string(), value: z.unknown() }).strict(),
]);

export const JsonPatchSchema = z.array(JsonPatchOpSchema);

// ---------- Match / participants ----------

export const ParticipantVisualSettingsSchema = z
  .object({
    cardBackId: z.string().optional(),
    playmatId: z.string().optional(),
  })
  .strict();

export const ParticipantSchema = z
  .object({
    id: opaqueId,
    seat: z.number().int().nonnegative(),
    userId: z.string().optional(),
    displayName: z.string(),
    isBot: z.boolean().optional(),
    visualSettings: ParticipantVisualSettingsSchema.optional(),
    isMobile: z.boolean().optional(),
    mmrAtMatch: z.number().optional(),
    subscriptionTier: z.string().optional(),
  })
  .strict();

export const MatchTypeSchema = z.enum(["ranked", "casual", "practice_vs_bot", "private", "local"]);

export const MatchStatusSchema = z.enum(["in_progress", "completed", "abandoned"]);

export const MatchInfoSchema = z
  .object({
    matchId: opaqueId,
    gameType: GameTypeSchema,
    format: z.string(),
    matchType: MatchTypeSchema,
    status: MatchStatusSchema,
    participants: z.array(ParticipantSchema),
    gameIds: z.array(opaqueId),
    scores: z.record(opaqueId, z.number()).optional(),
    winnerId: opaqueId.optional(),
  })
  .strict();

// ---------- Snapshot ----------

export const ClockSnapshotSchema = z
  .object({
    mode: z.enum(["none", "chess", "byo-yomi"]),
    perPlayerMs: z.record(opaqueId, z.number()),
    activePlayerId: opaqueId.optional(),
    asOfWallClockMs: z.number(),
  })
  .strict();

export const GameSnapshotSchema = z
  .object({
    gameId: opaqueId,
    gameNumber: z.number().int().positive(),
    status: z.enum(["in_progress", "completed"]),
    authority: z.enum(["server", "client"]),
    stateVersion: z.number().int().nonnegative(),
    state: z.unknown(),
    cardsMaps: CardsMapsSchema,
    clock: ClockSnapshotSchema.optional(),
  })
  .strict();

// ---------- WS log / move record ----------

export const GameLogEntrySchema = z
  .object({
    tag: z.string(),
    data: z.unknown().optional(),
    ts: z.number().optional(),
  })
  .strict();

export const AnimationCueSchema = z
  .object({
    tag: z.string(),
    data: z.unknown().optional(),
  })
  .strict();

export const MoveRecordSchema = z
  .object({
    stateVersion: z.number().int().nonnegative(),
    turnNumber: z.number().int().nonnegative(),
    actorId: opaqueId,
    moveId: z.string(),
    payload: z.unknown().optional(),
    timestamp: z.number(),
  })
  .strict();

// ---------- Client → server ----------

export const ClientMsgSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("join_game"),
      gameId: opaqueId,
      ticket: z.string(),
    })
    .strict(),
  z
    .object({
      type: z.literal("execute_move"),
      gameId: opaqueId,
      expectedVersion: z.number().int().nonnegative(),
      moveId: z.string(),
      payload: z.unknown().optional(),
      correlationId: z.string().optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal("leave_game"),
      gameId: opaqueId,
    })
    .strict(),
  z
    .object({
      type: z.literal("send_chat"),
      gameId: opaqueId,
      body: z.string(),
    })
    .strict(),
  z
    .object({
      type: z.literal("heartbeat"),
      gameId: opaqueId,
      lastSeenVersion: z.number().int().nonnegative(),
    })
    .strict(),
  z.object({ type: z.literal("ping") }).strict(),
]);

// ---------- Server → client ----------

export const MoveRejectedCodeSchema = z.enum([
  "stale_version",
  "illegal_move",
  "not_your_turn",
  "game_ended",
]);

export const ServerMsgSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("game_joined"),
      gameId: opaqueId,
      snapshot: GameSnapshotSchema,
      recentHistory: z.array(MoveRecordSchema),
    })
    .strict(),
  z
    .object({
      type: z.literal("move_accepted"),
      gameId: opaqueId,
      stateVersion: z.number().int().nonnegative(),
      patches: JsonPatchSchema,
      acceptedMove: MoveRecordSchema,
      logs: z.array(GameLogEntrySchema),
      animations: z.array(AnimationCueSchema).optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal("state_update"),
      gameId: opaqueId,
      stateVersion: z.number().int().nonnegative(),
      patches: JsonPatchSchema,
      logs: z.array(GameLogEntrySchema),
      animations: z.array(AnimationCueSchema).optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal("state_sync"),
      gameId: opaqueId,
      snapshot: GameSnapshotSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal("move_rejected"),
      gameId: opaqueId,
      code: MoveRejectedCodeSchema,
      currentVersion: z.number().int().nonnegative(),
      message: z.string().optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal("presence"),
      gameId: opaqueId,
      playerId: opaqueId,
      status: z.enum(["online", "offline", "thinking"]),
    })
    .strict(),
  z
    .object({
      type: z.literal("chat"),
      gameId: opaqueId,
      from: opaqueId,
      body: z.string(),
      ts: z.number(),
    })
    .strict(),
  z
    .object({
      type: z.literal("timeout_notice"),
      gameId: opaqueId,
      playerId: opaqueId,
      remainingMs: z.number(),
    })
    .strict(),
  z
    .object({
      type: z.literal("game_error"),
      gameId: opaqueId,
      message: z.string(),
    })
    .strict(),
  z.object({ type: z.literal("pong") }).strict(),
]);

// ---------- Page-data ----------

export const UserSettingsSchema = z
  .object({
    defaultCardBackId: z.string().optional(),
    defaultPlaymatId: z.string().optional(),
    reducedMotion: z.boolean().optional(),
    locale: z.string().optional(),
    extras: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const RealtimeAccessSchema = z
  .object({
    wsUrl: z.string().regex(/^wss?:\/\/.+/, "wsUrl must use ws:// or wss://"),
    ticket: z.string(),
    protocolVersion: z.number().int().positive(),
  })
  .strict();

export const MatchPageDataSchema = z
  .object({
    match: MatchInfoSchema,
    game: GameSnapshotSchema,
    viewerSeat: z.union([z.number().int().nonnegative(), z.literal("spectator")]),
    realtime: RealtimeAccessSchema,
    userSettings: UserSettingsSchema.optional(),
  })
  .strict();

export const MatchResolutionSchema = z
  .object({
    match: MatchInfoSchema,
    currentGameId: opaqueId.nullable(),
  })
  .strict();

export const PracticeBotSchema = z
  .object({
    fixtureId: z.string().optional(),
    deckText: z.string().optional(),
    strategyId: z.string().optional(),
  })
  .strict();

export const PracticeConfigSchema = z
  .object({
    matchId: opaqueId,
    gameId: opaqueId,
    playerId: opaqueId,
    botPlayerId: opaqueId,
    playerDeckText: z.string().min(1),
    bot: PracticeBotSchema.optional(),
    seed: z.string().optional(),
  })
  .strict();

export const PracticeCreatedResponseSchema = PracticeConfigSchema.extend({
  wsTicket: z.string(),
  authToken: z.string().optional(),
}).strict();

export const PracticeTicketResponseSchema = z
  .object({
    ticket: z.string(),
    authToken: z.string().optional(),
  })
  .strict();

export const PracticeRequestSchema = z
  .object({
    playerDeckText: z.string().min(1),
    bot: PracticeBotSchema.optional(),
    seed: z.string().optional(),
  })
  .strict();

// ---------- Connection diagnostics ----------

export const ConnectionDiagnosticEventSchema = z
  .object({
    at: z.iso.datetime(),
    type: z.string().min(1),
    message: z.string().optional(),
    details: z.unknown().optional(),
  })
  .strict();

export const ConnectionEndpointDiagnosticSchema = z
  .object({
    realtimeConfigured: z.boolean(),
    origin: z.string().optional(),
    namespace: z.string().optional(),
    path: z.string().optional(),
    transport: z.string().optional(),
  })
  .strict();

export const PlayerPresenceDiagnosticSchema = z
  .object({
    side: z.string().optional(),
    playerId: z.string().optional(),
    label: z.string().optional(),
    status: z.enum(["connected", "reconnecting", "disconnected", "checking", "unknown"]),
    connected: z.boolean().optional(),
    disconnectedAt: z.iso.datetime().optional(),
    lastPingAt: z.iso.datetime().optional(),
    latencyMs: z.number().optional(),
    disconnectCount: z.number().int().nonnegative().optional(),
    self: z.boolean().optional(),
  })
  .strict();

export const SimulatorConnectionDiagnosticSchema = z
  .object({
    schemaVersion: z.literal(1),
    generatedAt: z.iso.datetime(),
    gameSlug: z.string().min(1),
    route: z.string(),
    matchId: z.string().optional(),
    gameId: z.string().optional(),
    playerId: z.string().optional(),
    playerSide: z.string().optional(),
    endpoint: ConnectionEndpointDiagnosticSchema,
    connection: z
      .object({
        status: z.enum([
          "idle",
          "checking",
          "connecting",
          "connected",
          "disconnected",
          "reconnecting",
          "unavailable",
        ]),
        connectionId: z.string().optional(),
        socketId: z.string().optional(),
        authModeLabel: z.string().optional(),
        authenticated: z.boolean().optional(),
        latencyMs: z.number().optional(),
        lastPongAt: z.iso.datetime().optional(),
        lastPingAt: z.iso.datetime().optional(),
        reconnectAttempts: z.number().int().nonnegative().optional(),
        disconnectCount: z.number().int().nonnegative().optional(),
        lastError: z.string().optional(),
        serverInitiatedClose: z.boolean().optional(),
      })
      .strict(),
    presence: z.array(PlayerPresenceDiagnosticSchema).optional(),
    events: z.array(ConnectionDiagnosticEventSchema).optional(),
  })
  .strict();

// ---------- Replay ----------

export const ReplayChatMessageSchema = z
  .object({
    from: opaqueId,
    body: z.string(),
    ts: z.number(),
  })
  .strict();

export const ReplayStepSchema = z
  .object({
    patches: JsonPatchSchema,
    acceptedMove: MoveRecordSchema,
    logs: z.array(GameLogEntrySchema),
  })
  .strict();

export const ReplayMetadataSchema = z
  .object({
    totalMoves: z.number().int().nonnegative(),
    totalTurns: z.number().int().nonnegative(),
    durationMs: z.number().optional(),
    winnerId: opaqueId.optional(),
    endReason: z.string().optional(),
    createdAt: z.iso.datetime(),
    completedAt: z.iso.datetime().optional(),
    matchType: MatchTypeSchema.optional(),
  })
  .strict();

export const ReplayFileSchema = z
  .object({
    version: z.literal(REPLAY_FILE_VERSION),
    gameType: GameTypeSchema,
    matchId: opaqueId,
    gameId: opaqueId,
    seed: z.string(),
    participants: z.array(ParticipantSchema),
    cardsMaps: CardsMapsSchema,
    initialState: z.unknown(),
    steps: z.array(ReplayStepSchema),
    chatMessages: z.array(ReplayChatMessageSchema).optional(),
    metadata: ReplayMetadataSchema,
  })
  .strict();

export const ReplaySummarySchema = z
  .object({
    gameId: opaqueId,
    matchId: opaqueId,
    gameType: GameTypeSchema,
    participants: z.array(ParticipantSchema),
    metadata: ReplayMetadataSchema,
    sizeBytes: z.number().optional(),
  })
  .strict();
