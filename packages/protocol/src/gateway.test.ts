import { describe, expect, test } from "bun:test";
import {
  type RawGatewayClientMessage,
  RawGatewayClientMessageSchema,
  RawGatewayExecuteMoveMessageSchema,
  RawGatewayHeartbeatMessageSchema,
  RawGatewayJoinGameMessageSchema,
  RawGatewayLeaveGameMessageSchema,
  RawGatewayPingMessageSchema,
  RawGatewayRequestStateSyncMessageSchema,
  type RawGatewayServerMessage,
  RawGatewayServerMessageSchema,
} from "./gateway";
import {
  ExecuteMoveMessage,
  GatewayClientMessage,
  GatewayPingMessage,
  HeartbeatMessage,
  JoinGameMessage,
  LeaveGameMessage,
  RequestGameStateSyncMessage,
} from "./schemas";

const standaloneClientMessages: RawGatewayClientMessage[] = [
  { t: 123, type: "ping" },
  { correlationId: "c_1", gameId: "g_1", role: "player", type: "join_game" },
  {
    correlationId: "c_2",
    expectedVersion: 7,
    gameId: "g_1",
    moveType: "playCard",
    payload: { cardId: "card_1" },
    type: "execute_move",
  },
  {
    activity: { idle: false, tabVisible: true },
    game: { gameId: "g_1", matchId: "m_1", stateVersion: 7 },
    type: "heartbeat",
  },
  { gameId: "g_1", stateVersion: 7, type: "request_game_state_sync" },
  { gameId: "g_1", type: "leave_game" },
];

describe("raw gateway websocket contract", () => {
  test("parses standalone simulator client messages", () => {
    for (const message of standaloneClientMessages) {
      expect(RawGatewayClientMessageSchema.parse(message)).toEqual(message);
    }
  });

  test("parses standalone simulator server messages used for live play", () => {
    const state = { G: {}, ctx: { stateID: 7 } };
    const messages: RawGatewayServerMessage[] = [
      {
        authenticated: true,
        authenticationMethod: "ticket",
        connectionId: "conn_1",
        game: "cyberpunk",
        type: "welcome",
        userId: "u_1",
        userName: "Runner",
      },
      {
        gameId: "g_1",
        players: [{ id: "p_1", connected: true }],
        role: "player",
        state,
        stateVersion: 7,
        type: "game_joined",
      },
      {
        actorId: "p_1",
        animations: [],
        engineLogs: [],
        gameId: "g_1",
        matchInfo: {
          matchId: "m_1",
          matchStatus: "in_progress",
          matchCompleted: false,
          nextGameId: "g_2",
          player1Score: 1,
          player2Score: 0,
        },
        moveType: "playCard",
        patches: [],
        payload: { cardId: "card_1" },
        state,
        stateVersion: 8,
        type: "move_accepted",
      },
      {
        animations: [],
        engineLogs: [],
        gameId: "g_1",
        moveType: "playCard",
        patches: [],
        state,
        stateVersion: 8,
        type: "state_update",
      },
      {
        animations: [],
        engineLogs: [],
        gameId: "g_1",
        state,
        stateVersion: 8,
        type: "state_sync",
      },
      {
        code: "rejected_stale",
        currentVersion: 8,
        gameId: "g_1",
        reason: "stale",
        type: "move_rejected",
      },
      {
        gameId: "g_1",
        matchCompleted: true,
        matchId: "m_1",
        matchStatus: "completed",
        player1Score: 2,
        player2Score: 0,
        reason: "Game completed",
        type: "game_ended",
      },
      {
        gameIds: ["g_1", "g_2"],
        gameType: "cyberpunk",
        matchId: "m_1",
        player1Score: 2,
        player2Score: 0,
        status: "completed",
        type: "match_state",
      },
      {
        serverTime: "2026-05-12T00:00:00.000Z",
        stateVersions: { g_1: 8 },
        type: "heartbeat_ack",
      },
      { serverTime: "2026-05-12T00:00:00.000Z", t: 123, type: "pong" },
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
      [RawGatewayHeartbeatMessageSchema, HeartbeatMessage, standaloneClientMessages[3]],
      [
        RawGatewayRequestStateSyncMessageSchema,
        RequestGameStateSyncMessage,
        standaloneClientMessages[4],
      ],
      [RawGatewayLeaveGameMessageSchema, LeaveGameMessage, standaloneClientMessages[5]],
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
      expectedVersion: 7,
      gameId: "g_1",
      moveId: "playCard",
      payload: { cardId: "card_1" },
      type: "execute_move",
    };

    expect(() => RawGatewayClientMessageSchema.parse(legacyShape)).toThrow();
    expect(() => GatewayClientMessage.parse(legacyShape)).toThrow();
  });
});
