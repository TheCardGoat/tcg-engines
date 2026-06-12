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
} from "./gateway";
import {
  ExecuteMoveMessage,
  GatewayClientMessage,
  GatewayPingMessage,
  HeartbeatMessage,
  JoinGameMessage,
  LeaveGameMessage,
  RequestGameStateSyncMessage,
  SubmitInteractionMessage,
} from "./schemas";

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
      protocolVersion: 1,
      stateVersion: 7,
      requestId: "cyberpunk:7:playCard",
      actionId: "playCard",
      values: { cardId: "card_1" },
    },
    correlationId: "c_3",
  },
  {
    type: "heartbeat",
    game: { gameId: "g_1", matchId: "m_1", stateVersion: 7 },
    activity: { idle: false, tabVisible: true },
  },
  { type: "request_game_state_sync", gameId: "g_1", stateVersion: 7 },
  { type: "leave_game", gameId: "g_1" },
];

describe("raw gateway websocket contract", () => {
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
          protocolVersion: 1,
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
        gameId: "g_1",
        stateVersion: 8,
        patches: [],
        engineLogs: [],
        animations: [],
        state,
        moveType: "playCard",
        actorId: "p_1",
        payload: { cardId: "card_1" },
        interactionView: {
          protocolVersion: 1,
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
        animations: [],
        state,
        moveType: "playCard",
      },
      {
        type: "state_sync",
        gameId: "g_1",
        stateVersion: 8,
        engineLogs: [],
        animations: [],
        state,
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
