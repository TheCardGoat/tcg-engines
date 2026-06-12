import { describe, expect, test } from "bun:test";

import type {
  ClientMsg,
  GameSnapshot,
  MatchInfo,
  MatchPageData,
  ReplayFile,
  ServerMsg,
} from "./index.js";
import {
  ClientMsgSchema,
  GameSnapshotSchema,
  MatchInfoSchema,
  MatchPageDataSchema,
  REPLAY_FILE_VERSION,
  ReplayFileSchema,
  ServerMsgSchema,
} from "./index.js";

const sampleSnapshot: GameSnapshot = {
  gameId: "g1",
  gameNumber: 1,
  status: "in_progress",
  authority: "server",
  stateVersion: 7,
  state: { foo: "bar" },
  cardsMaps: {
    cardInstances: { i1: "c1", i2: "c2" },
    owners: { p1: ["i1"], p2: ["i2"] },
  },
};

const sampleMatch: MatchInfo = {
  matchId: "m1",
  gameType: "lorcana",
  format: "core-constructed",
  matchType: "ranked",
  status: "in_progress",
  participants: [
    { id: "p1", seat: 0, displayName: "Alice", userId: "u1" },
    { id: "p2", seat: 1, displayName: "Bot", isBot: true },
  ],
  gameIds: ["g1"],
};

describe("schemas", () => {
  test("MatchInfo round-trip", () => {
    const parsed = MatchInfoSchema.parse(sampleMatch);
    expect(parsed).toEqual(sampleMatch);
  });

  test("GameSnapshot round-trip", () => {
    const parsed = GameSnapshotSchema.parse(sampleSnapshot);
    expect(parsed).toEqual(sampleSnapshot);
  });

  test("MatchPageData round-trip", () => {
    const data: MatchPageData = {
      match: sampleMatch,
      game: sampleSnapshot,
      viewerSeat: 0,
      realtime: {
        wsUrl: "wss://gateway.example.com/v1",
        ticket: "t-abc",
        protocolVersion: 1,
      },
    };
    expect(MatchPageDataSchema.parse(data)).toEqual(data);
  });

  test("every ClientMsg variant parses", () => {
    const messages: ClientMsg[] = [
      { type: "join_game", gameId: "g1", ticket: "t" },
      {
        type: "execute_move",
        gameId: "g1",
        expectedVersion: 5,
        moveId: "playCard",
        payload: { cardInstanceId: "i1" },
      },
      { type: "leave_game", gameId: "g1" },
      { type: "send_chat", gameId: "g1", body: "gg" },
      { type: "heartbeat", gameId: "g1", lastSeenVersion: 5 },
      { type: "ping" },
    ];
    for (const m of messages) {
      expect(ClientMsgSchema.parse(m)).toEqual(m);
    }
  });

  test("every ServerMsg variant parses", () => {
    const moveRecord = {
      stateVersion: 6,
      turnNumber: 3,
      actorId: "p1",
      moveId: "playCard",
      timestamp: 1700000000000,
    };
    const messages: ServerMsg[] = [
      {
        type: "game_joined",
        gameId: "g1",
        snapshot: sampleSnapshot,
        recentHistory: [moveRecord],
      },
      {
        type: "move_accepted",
        gameId: "g1",
        stateVersion: 6,
        patches: [{ op: "replace", path: "/foo", value: "bar" }],
        acceptedMove: moveRecord,
        logs: [{ tag: "lorcana:lore_gained" }],
      },
      {
        type: "state_update",
        gameId: "g1",
        stateVersion: 6,
        patches: [],
        logs: [],
      },
      { type: "state_sync", gameId: "g1", snapshot: sampleSnapshot },
      {
        type: "move_rejected",
        gameId: "g1",
        code: "stale_version",
        currentVersion: 7,
      },
      {
        type: "presence",
        gameId: "g1",
        playerId: "p1",
        status: "online",
      },
      { type: "chat", gameId: "g1", from: "p1", body: "gg", ts: 1 },
      {
        type: "timeout_notice",
        gameId: "g1",
        playerId: "p1",
        remainingMs: 30000,
      },
      { type: "game_error", gameId: "g1", message: "boom" },
      { type: "pong" },
    ];
    for (const m of messages) {
      expect(ServerMsgSchema.parse(m)).toEqual(m);
    }
  });

  test("ReplayFile v3 round-trip", () => {
    const file: ReplayFile = {
      version: REPLAY_FILE_VERSION,
      gameType: "lorcana",
      matchId: "m1",
      gameId: "g1",
      seed: "seed-1",
      participants: sampleMatch.participants,
      cardsMaps: sampleSnapshot.cardsMaps,
      initialState: { stub: true },
      steps: [
        {
          patches: [{ op: "add", path: "/x", value: 1 }],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "playCard",
            timestamp: 1,
          },
          logs: [],
        },
      ],
      metadata: {
        totalMoves: 1,
        totalTurns: 1,
        createdAt: "2026-05-06T00:00:00Z",
      },
    };
    expect(ReplayFileSchema.parse(file)).toEqual(file);
  });

  test("rejects unknown ServerMsg type", () => {
    expect(() => ServerMsgSchema.parse({ type: "garbage" })).toThrow();
  });

  test("rejects ReplayFile with wrong version", () => {
    expect(() =>
      ReplayFileSchema.parse({
        version: 2,
        gameType: "lorcana",
        matchId: "m",
        gameId: "g",
        seed: "s",
        participants: [],
        cardsMaps: { cardInstances: {}, owners: {} },
        initialState: null,
        steps: [],
        metadata: { totalMoves: 0, totalTurns: 0, createdAt: "x" },
      }),
    ).toThrow();
  });
});
