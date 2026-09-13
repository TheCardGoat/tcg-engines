import { describe, expect, test } from "vite-plus/test";
import {
  RawGatewayClientMessageSchema,
  RawGatewayExecuteMoveMessageSchema,
  RawGatewayHeartbeatMessageSchema,
  RawGatewayJoinGameMessageSchema,
  RawGatewayLeaveGameMessageSchema,
  RawGatewayPingMessageSchema,
  RawGatewayRequestStateSyncMessageSchema,
  RawGatewayServerMessageSchema,
  RawGatewaySubmitInteractionMessageSchema,
  type RawGatewayClientMessage,
  type RawGatewayServerMessage,
} from "./gateway.js";
import {
  ExecuteMoveMessage,
  GatewayClientMessage,
  GatewayPingMessage,
  HeartbeatMessage,
  JoinGameMessage,
  LeaveGameMessage,
  RequestGameStateSyncMessage,
  SubmitInteractionMessage,
} from "./schemas.js";

const standaloneClientMessages: RawGatewayClientMessage[] = [
  { type: "ping", t: 123 },
  { type: "join_game", gameId: "g_1", role: "player", correlationId: "c_1" },
  {
    type: "execute_move",
    gameId: "g_1",
    expectedVersion: 7,
    moveType: "playCard",
    payload: { cardId: "card_1" },
    correlationId: "c_2",
  },
  {
    type: "submit_interaction",
    gameId: "g_1",
    expectedVersion: 7,
    submission: {
      protocolVersion: 2,
      stateVersion: 7,
      requestId: "cyberpunk:7:playCard",
      actionId: "playCard",
      values: { cardId: "card_1" },
    },
    correlationId: "c_3",
  },
  {
    type: "heartbeat",
    correlationId: "c2ff00f8-2d5f-4aa3-95cd-ffcb23390b89",
    clientSentAt: 1_788_436_800_000,
    previousCorrelationId: "826bc5fc-21de-43e5-acbf-8a098e7509af",
    previousRoundTripMs: 125,
    game: { gameId: "g_1", matchId: "m_1", stateVersion: 7 },
    activity: { idle: false, tabVisible: true },
  },
  { type: "request_game_state_sync", gameId: "g_1", stateVersion: 7 },
  { type: "leave_game", gameId: "g_1" },
];

test("session invalidations expose only match identity and a monotonic revision", () => {
  const event = { type: "match_session_changed", matchId: "m_1", revision: 3 };
  expect(RawGatewayServerMessageSchema.parse(event)).toEqual(event);
  expect(RawGatewayServerMessageSchema.safeParse({ ...event, revision: -1 }).success).toBe(false);
  expect(RawGatewayServerMessageSchema.safeParse({ ...event, state: {} }).success).toBe(false);
});

test("gateway state packets validate authoritative animation envelopes", () => {
  const base = {
    type: "state_update",
    gameId: "g_1",
    stateVersion: 8,
    patches: [],
    engineLogs: [],
    state: { ctx: {} },
  };
  expect(
    RawGatewayServerMessageSchema.safeParse({
      ...base,
      animationPlan: {
        id: "draw-1",
        version: 2,
        steps: [
          {
            id: "draw-1:step",
            type: "entityTransfer",
            entity: { kind: "entity", id: "card-1" },
            from: { kind: "zone", id: "deck" },
            to: { kind: "zone", id: "hand" },
            sourceFace: "hidden",
            destinationFace: "public",
          },
        ],
      },
    }).success,
  ).toBe(true);
  expect(
    RawGatewayServerMessageSchema.safeParse({
      ...base,
      animationPlan: { id: "", version: 2, steps: [] },
    }).success,
  ).toBe(false);
  expect(
    RawGatewayServerMessageSchema.safeParse({
      ...base,
      animationPlan: null,
      animations: [{ id: "private-engine-packet", payload: { cardId: "hidden-card" } }],
    }).success,
  ).toBe(false);
});

describe("gateway wire-message contract", () => {
  test("parses standalone simulator client messages", () => {
    for (const message of standaloneClientMessages) {
      expect(RawGatewayClientMessageSchema.parse(message)).toEqual(message);
    }
  });

  test("parses standalone simulator server messages used for live play", () => {
    const state = { ctx: { stateID: 7 }, G: {} };
    const messages: RawGatewayServerMessage[] = [
      {
        type: "welcome",
        authenticated: true,
        authenticationMethod: "ticket",
        connectionId: "conn_1",
        userId: "u_1",
        userName: "Runner",
        game: "cyberpunk",
      },
      {
        type: "game_joined",
        gameId: "g_1",
        role: "player",
        stateVersion: 7,
        state,
        interactionView: {
          protocolVersion: 2,
          gameSlug: "cyberpunk",
          actorId: "p_1",
          stateVersion: 7,
          status: "ready",
          actions: [],
        },
        players: [{ id: "p_1", connected: true }],
      },
      {
        type: "move_accepted",
        outcome: { kind: "game-owned-feedback", message: "Actor-only explanation" },
        gameId: "g_1",
        stateVersion: 8,
        patches: [],
        engineLogs: [],
        animationPlan: null,
        state,
        moveType: "playCard",
        actorId: "p_1",
        payload: { cardId: "card_1" },
        interactionView: {
          protocolVersion: 2,
          gameSlug: "cyberpunk",
          actorId: "p_1",
          stateVersion: 8,
          status: "waiting",
          actions: [],
        },
        matchInfo: {
          matchId: "m_1",
          matchStatus: "in_progress",
          matchCompleted: false,
          nextGameId: "g_2",
          player1Score: 1,
          player2Score: 0,
        },
      },
      {
        type: "state_update",
        gameId: "g_1",
        stateVersion: 8,
        patches: [],
        engineLogs: [],
        animationPlan: null,
        state,
        moveType: "playCard",
      },
      {
        type: "push_state:response",
        correlationId: "c_push",
        status: "ok",
        data: {
          gameId: "g_1",
          stateVersion: 8,
          matchId: "m_1",
          matchCompleted: true,
        },
      },
      {
        type: "state_sync",
        gameId: "g_1",
        stateVersion: 8,
        engineLogs: [],
        animationPlan: null,
        state,
        // The server attaches viewer-filtered cards maps whenever the game
        // engine publishes viewer resources; strict parsing must accept them.
        cardsMaps: {
          cardInstances: { c_1: "ST01-001" },
          owners: { p_1: ["c_1"] },
          presentation: { printingIdByInstanceId: { c_1: "ST01-001_p1" } },
        },
      },
      {
        type: "move_rejected",
        gameId: "g_1",
        reason: "stale",
        code: "rejected_stale",
        currentVersion: 8,
      },
      {
        type: "game_ended",
        gameId: "g_1",
        reason: "Game completed",
        matchId: "m_1",
        matchCompleted: true,
        matchStatus: "completed",
        player1Score: 2,
        player2Score: 0,
      },
      {
        type: "match_state",
        matchId: "m_1",
        gameType: "cyberpunk",
        status: "completed",
        player1Score: 2,
        player2Score: 0,
        gameIds: ["g_1", "g_2"],
      },
      {
        type: "heartbeat_ack",
        serverTime: "2026-05-12T00:00:00.000Z",
        stateVersions: { g_1: 8 },
      },
      { type: "pong", serverTime: "2026-05-12T00:00:00.000Z", t: 123 },
    ];

    for (const message of messages) {
      expect(RawGatewayServerMessageSchema.parse(message)).toEqual(message);
    }
  });

  test("standalone client messages accepted by the public contract are accepted by gateway ingress", () => {
    for (const message of standaloneClientMessages) {
      expect(GatewayClientMessage.parse(message)).toEqual(message);
    }
  });

  test("push_state accepts only non-empty correlation ids when confirmation is requested", () => {
    const message = {
      type: "push_state",
      gameId: "g_1",
      state: {},
      expectedVersion: 7,
      version: 8,
      moveType: "return",
      actorId: "p_1",
      correlationId: "c_push",
    };

    expect(GatewayClientMessage.parse(message)).toEqual(message);
    expect(() => GatewayClientMessage.parse({ ...message, correlationId: "" })).toThrow();
    expect(() => GatewayClientMessage.parse({ ...message, expectedVersion: undefined })).toThrow();
  });

  test("push_state accepts an initial CAS write and an explicit terminal result", () => {
    const message = {
      type: "push_state",
      gameId: "g_1",
      state: { schemaVersion: 1 },
      cardsMaps: { cardInstances: {}, owners: {} },
      expectedVersion: null,
      version: 0,
      moveType: "initialize",
      actorId: "p_1",
      gameEnd: { winnerId: "p_1", reason: "manual" },
    };

    expect(GatewayClientMessage.parse(message)).toEqual(message);
  });

  test("standalone contract stays aligned with the gateway ingress schemas it mirrors", () => {
    const pairs = [
      [RawGatewayPingMessageSchema, GatewayPingMessage, standaloneClientMessages[0]],
      [RawGatewayJoinGameMessageSchema, JoinGameMessage, standaloneClientMessages[1]],
      [RawGatewayExecuteMoveMessageSchema, ExecuteMoveMessage, standaloneClientMessages[2]],
      [
        RawGatewaySubmitInteractionMessageSchema,
        SubmitInteractionMessage,
        standaloneClientMessages[3],
      ],
      [RawGatewayHeartbeatMessageSchema, HeartbeatMessage, standaloneClientMessages[4]],
      [
        RawGatewayRequestStateSyncMessageSchema,
        RequestGameStateSyncMessage,
        standaloneClientMessages[5],
      ],
      [RawGatewayLeaveGameMessageSchema, LeaveGameMessage, standaloneClientMessages[6]],
    ] as const;

    for (const [contractSchema, protocolSchema, sample] of pairs) {
      expect(contractSchema.parse(sample)).toEqual(protocolSchema.parse(sample));
      expect(RawGatewayClientMessageSchema.parse(sample)).toEqual(
        GatewayClientMessage.parse(sample),
      );
    }
  });

  test("legacy page-contract execute_move is rejected by both raw contract and gateway ingress", () => {
    const legacyShape = {
      type: "execute_move",
      gameId: "g_1",
      expectedVersion: 7,
      moveId: "playCard",
      payload: { cardId: "card_1" },
    };

    expect(() => RawGatewayClientMessageSchema.parse(legacyShape)).toThrow();
    expect(() => GatewayClientMessage.parse(legacyShape)).toThrow();
  });
});
