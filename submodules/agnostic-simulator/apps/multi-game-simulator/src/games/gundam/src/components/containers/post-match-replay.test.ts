import { describe, expect, it } from "vite-plus/test";

import { parseGundamReplayPayload } from "../../../replay/fetchReplay.ts";
import { projectGundamPostMatchReplay } from "./post-match-replay.ts";

describe("projectGundamPostMatchReplay", () => {
  it("uses authoritative metadata and reconstructs per-player history and logs", () => {
    const replay = parseGundamReplayPayload({
      version: 3,
      gameType: "gundam",
      matchId: "match-1",
      gameId: "game-1",
      seed: "seed",
      playerIds: ["p1", "p2"],
      initialState: {},
      steps: [
        {
          patches: [],
          logs: [],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 0,
            actorId: "p1",
            moveId: "chooseFirstPlayer",
            timestamp: 1_000,
          },
        },
        {
          patches: [],
          logs: [
            {
              tag: "engine_log",
              ts: 2_000,
              data: {
                moveType: "attack",
                playerId: "p2",
                timestamp: 2_000,
                turnNumber: 3,
                public: [{ key: "gundam.move.attack", values: {} }],
              },
            },
          ],
          acceptedMove: {
            stateVersion: 2,
            turnNumber: 3,
            actorId: "p2",
            moveId: "attack",
            timestamp: 2_000,
          },
        },
      ],
      metadata: {
        totalMoves: 2,
        totalTurns: 3,
        durationMs: 1_000,
        winnerId: "p2",
        endReason: "p2 won",
        createdAt: "2026-09-08T00:00:00.000Z",
      },
    });

    const summary = projectGundamPostMatchReplay(replay);

    expect(summary.metadata).toMatchObject({ totalMoves: 2, totalTurns: 4, durationMs: 1_000 });
    expect(summary.movesByPlayerId).toEqual({ p1: 1, p2: 1 });
    expect(summary.moveLogs).toEqual([
      expect.objectContaining({
        turnNumber: 3,
        log: expect.objectContaining({ type: "attack", playerId: "p2" }),
      }),
    ]);
  });
});
