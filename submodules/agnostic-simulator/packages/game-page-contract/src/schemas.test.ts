import { composeDropEligibility, unsupportedTimeoutChannel } from "@tcg/protocol";
import { describe, expect, test } from "vitest";

import type {
  ClientMsg,
  GameSnapshot,
  LiveMatchBootstrapV1,
  MatchInfo,
  ReplayFile,
  ReplayPlaybackV1,
  ServerMsg,
} from "./index.js";
import {
  ClientMsgSchema,
  GameSnapshotSchema,
  GameTypeSchema,
  LiveMatchBootstrapV1Schema,
  MatchInfoSchema,
  REPLAY_FILE_VERSION,
  ReplayFileSchema,
  ReplayPlaybackV1Schema,
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
    deckDeclarationsByOwnerId: {
      p1: { chosenChampionId: "champion-alpha", nested: { revealed: false } },
    },
  },
};

const sampleMatch: MatchInfo = {
  matchId: "m1",
  gameType: "lorcana",
  format: "core-constructed",
  matchType: "ranked",
  status: "in_progress",
  participants: [
    {
      id: "p1",
      seat: 0,
      displayName: "Alice",
      userId: "u1",
      mmrAtMatch: 1420,
      subscriptionTier: "premium",
      isPremium: true,
    },
    { id: "p2", seat: 1, displayName: "Bot", isBot: true, isPremium: false },
  ],
  gameIds: ["g1"],
};

describe("schemas", () => {
  test("accepts Grand Archive as a page-contract game", () => {
    expect(GameTypeSchema.parse("grand-archive")).toBe("grand-archive");
  });

  test("MatchInfo round-trip", () => {
    const parsed = MatchInfoSchema.parse(sampleMatch);
    expect(parsed).toEqual(sampleMatch);
  });

  test("GameSnapshot round-trip", () => {
    const parsed = GameSnapshotSchema.parse(sampleSnapshot);
    expect(parsed).toEqual(sampleSnapshot);
  });

  test("LiveMatchBootstrapV1 keeps server-resolved player identity and projected state", () => {
    const data: LiveMatchBootstrapV1 = {
      schemaVersion: 1,
      match: sampleMatch,
      game: {
        gameId: "g1",
        gameNumber: 1,
        status: "in_progress",
        authority: "server",
        stateVersion: 7,
        view: { privateFor: "p1" },
        resources: { visibleCards: ["i1"] },
      },
      viewer: {
        role: "player",
        actorId: "p1",
        seat: 1,
        userId: "u1",
        permissions: {
          act: true,
          chat: true,
          propose: true,
          useManualControls: true,
          concede: true,
          spectate: false,
          viewReplay: false,
          downloadReplay: false,
          forkReplay: false,
        },
      },
      capabilities: {
        actions: true,
        chat: true,
        proposals: true,
        manualControls: true,
        spectating: true,
        conceding: true,
        replay: false,
      },
      presence: { players: [{ id: "p1", connected: true }] },
      history: { recentMoves: [], engineLogs: [], chatMessages: [] },
      realtime: {
        wsUrl: "wss://gateway.example.com",
        ticket: "ticket",
        reconnectToken: "scoped-token",
        expiresAt: "2026-05-06T00:01:00Z",
        protocolVersion: 2,
      },
    };

    expect(LiveMatchBootstrapV1Schema.parse(data)).toEqual(data);
  });

  test("LiveMatchBootstrapV1 accepts optional dropEligibility and rejects a malformed payload", () => {
    const dropEligibility = composeDropEligibility({
      nowMs: 1_700_000_000_000,
      timeout: unsupportedTimeoutChannel(),
      disconnect: { connected: true },
    });
    const base = {
      schemaVersion: 1 as const,
      match: sampleMatch,
      game: {
        gameId: "g1",
        gameNumber: 1,
        status: "in_progress" as const,
        authority: "server" as const,
        stateVersion: 7,
        view: { public: true },
      },
      viewer: {
        role: "player" as const,
        actorId: "p1",
        seat: 1,
        userId: "u1",
        permissions: {
          act: true,
          chat: true,
          propose: true,
          useManualControls: true,
          concede: true,
          spectate: true,
          viewReplay: false,
          downloadReplay: false,
          forkReplay: false,
        },
      },
      capabilities: {
        actions: true,
        chat: true,
        proposals: true,
        manualControls: true,
        spectating: true,
        conceding: true,
        replay: false,
      },
      presence: { players: [{ id: "p1", connected: true }] },
      history: { recentMoves: [], engineLogs: [], chatMessages: [] },
    };
    expect(LiveMatchBootstrapV1Schema.parse({ ...base, dropEligibility })).toEqual({
      ...base,
      dropEligibility,
    });
    expect(
      LiveMatchBootstrapV1Schema.safeParse({ ...base, dropEligibility: { allowed: true } }).success,
    ).toBe(false);
  });

  test("LiveMatchBootstrapV1 accepts a read-only anonymous spectator", () => {
    const parsed = LiveMatchBootstrapV1Schema.parse({
      schemaVersion: 1,
      match: sampleMatch,
      game: {
        gameId: "g1",
        gameNumber: 1,
        status: "in_progress",
        authority: "server",
        stateVersion: 7,
        view: { public: true },
      },
      viewer: {
        role: "spectator",
        spectatorId: "spectator_session",
        permissions: {
          act: false,
          chat: false,
          propose: false,
          useManualControls: false,
          concede: false,
          spectate: true,
          viewReplay: false,
          downloadReplay: false,
          forkReplay: false,
        },
      },
      capabilities: {
        actions: false,
        chat: false,
        proposals: false,
        manualControls: false,
        spectating: true,
        conceding: false,
        replay: false,
      },
      presence: { players: [], spectatorCount: 2 },
      history: { recentMoves: [], engineLogs: [] },
    });

    expect(parsed.viewer.role).toBe("spectator");
    expect(parsed.history).not.toHaveProperty("chatMessages");
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
        animationPlan: null,
      },
      {
        type: "state_update",
        gameId: "g1",
        stateVersion: 6,
        patches: [],
        logs: [],
        animationPlan: null,
      },
      {
        type: "state_sync",
        gameId: "g1",
        snapshot: sampleSnapshot,
        animationPlan: null,
      },
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
      initialState: { stub: true },
      checkpoints: [{ cursor: 0, state: { stub: true } }],
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

    const playback: ReplayPlaybackV1 = {
      schemaVersion: 1,
      trust: "server_authoritative",
      publishedAt: "2026-05-06T00:02:00Z",
      replay: file,
    };
    expect(ReplayPlaybackV1Schema.parse(playback)).toEqual(playback);
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
        initialState: null,
        checkpoints: [],
        steps: [],
        metadata: { totalMoves: 0, totalTurns: 0, createdAt: "x" },
      }),
    ).toThrow();
  });
});
