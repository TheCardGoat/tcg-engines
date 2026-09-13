import { describe, expect, it } from "bun:test";
import { REPLAY_FILE_VERSION, ReplayPlaybackV1Schema } from "@tcg/game-page-contract";
import {
  decompressReplayBlob,
  firstPlayerIdFromReplaySteps,
  persistedReplayStepPosition,
} from "./fetch-replay.js";

const participants = [
  { id: "p1", seat: 0, displayName: "Alice" },
  { id: "p2", seat: 1, displayName: "Bot", isBot: true },
] as const;

describe("decompressReplayBlob", () => {
  it("preserves reversal-only steps instead of fabricating an accepted move", async () => {
    const playback = ReplayPlaybackV1Schema.parse({
      schemaVersion: 1,
      trust: "server_authoritative",
      publishedAt: "2026-05-06T00:02:00Z",
      replay: {
        version: REPLAY_FILE_VERSION,
        gameType: "lorcana",
        matchId: "m1",
        gameId: "g1",
        seed: "seed-1",
        participants,
        initialState: { stub: true },
        checkpoints: [{ cursor: 0, state: { stub: true } }],
        steps: [
          {
            patches: [{ op: "add", path: "/x", value: 1 }],
            logs: [
              {
                tag: "engine_log",
                data: {
                  moveType: "playCard",
                  public: [{ key: "lorcana.move.playCard", values: { cardId: "i1" } }],
                },
                ts: 1000,
              },
            ],
            acceptedMove: {
              stateVersion: 1,
              turnNumber: 1,
              actorId: "p1",
              moveId: "playCard",
              payload: { cardInstanceId: "i1" },
              timestamp: 1000,
            },
          },
          {
            patches: [{ op: "remove", path: "/x" }],
            logs: [{ tag: "lorcana:move_rejected" }],
            acceptedMove: null,
            reversal: {
              stateVersion: 2,
              turnNumber: 1,
              actorId: "p1",
              timestamp: 2000,
            },
          },
        ],
        metadata: {
          totalMoves: 2,
          totalTurns: 1,
          createdAt: "2026-05-06T00:00:00Z",
        },
      },
    });
    const data = await decompressReplayBlob(
      new TextEncoder().encode(JSON.stringify(playback)).buffer as ArrayBuffer,
    );

    expect(data.steps).toHaveLength(2);
    expect(data.steps[0]).toEqual({
      patches: [{ op: "add", path: "/x", value: 1 }],
      logs: [
        {
          moveType: "playCard",
          public: [{ key: "lorcana.move.playCard", values: { cardId: "i1" } }],
        },
      ],
      acceptedMove: {
        stateVersion: 1,
        turnNumber: 1,
        actorId: "p1",
        moveId: "playCard",
        input: { cardInstanceId: "i1" },
        timestamp: 1000,
      },
    });
    expect(data.steps[1]).toEqual({
      patches: [{ op: "remove", path: "/x" }],
      logs: [{ tag: "lorcana:move_rejected" }],
      acceptedMove: null,
      reversal: {
        stateVersion: 2,
        turnNumber: 1,
        actorId: "p1",
        timestamp: 2000,
      },
    });
    expect(persistedReplayStepPosition(data.steps[1]!)).toEqual({
      stateVersion: 2,
      turnNumber: 1,
      actorId: "p1",
      timestamp: 2000,
    });
    expect(firstPlayerIdFromReplaySteps(data.steps)).toBe("p1");
  });
});
