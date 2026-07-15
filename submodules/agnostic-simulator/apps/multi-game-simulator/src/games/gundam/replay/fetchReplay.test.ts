import { describe, expect, it } from "vitest";

import { parseGundamReplayPayload } from "./fetchReplay.ts";

describe("parseGundamReplayPayload", () => {
  it("accepts persisted platform replay payloads", () => {
    const replay = parseGundamReplayPayload({
      version: 2,
      gameType: "gundam",
      gameId: "game_1",
      matchId: "match_1",
      seed: "seed",
      playerIds: ["p1", "p2"],
      cardsMaps: { instances: {} },
      initialState: JSON.stringify({ state: { G: {}, ctx: { playerIds: ["p1", "p2"] } } }),
      steps: [
        {
          patches: [{ op: "replace", path: "/ctx/turnNumber", value: 2 }],
          acceptedMove: { input: { move: "passTurn" } },
          logs: [],
        },
      ],
      metadata: {
        totalMoves: 1,
        totalTurns: 2,
        durationMs: 1500,
        createdAt: "2026-07-05T08:00:00.000Z",
        completedAt: "2026-07-05T08:01:00.000Z",
        matchType: "practice_vs_bot",
        players: [],
        deckColors: { player1: [], player2: [] },
      },
    });

    expect(replay.playerIds).toEqual(["p1", "p2"]);
    expect(replay.initialState).toContain('"state"');
    expect(replay.steps).toHaveLength(1);
    expect(replay.metadata.matchType).toBe("practice_vs_bot");
  });

  it("accepts strict participant-based replay payloads", () => {
    const replay = parseGundamReplayPayload({
      version: 3,
      gameType: "gundam",
      gameId: "game_2",
      matchId: "match_2",
      seed: "seed",
      participants: [
        { id: "p1", seat: 1, displayName: "P1" },
        { id: "p2", seat: 2, displayName: "P2" },
      ],
      initialState: { G: {}, ctx: { playerIds: ["p1", "p2"] } },
      steps: [],
      metadata: {
        totalMoves: 0,
        totalTurns: 0,
        createdAt: "2026-07-05T08:00:00.000Z",
      },
    });

    expect(replay.playerIds).toEqual(["p1", "p2"]);
    expect(replay.initialState).toEqual({ G: {}, ctx: { playerIds: ["p1", "p2"] } });
  });
});
