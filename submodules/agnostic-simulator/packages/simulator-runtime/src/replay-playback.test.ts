import { describe, expect, it } from "vitest";
import type { ReplayPlaybackV1 } from "@tcg/game-page-contract";
import { ReplayPlaybackController, applyReplayPatch } from "./replay-playback";

const playback: ReplayPlaybackV1 = {
  schemaVersion: 1,
  trust: "server_authoritative",
  publishedAt: "2026-01-01T00:00:00.000Z",
  replay: {
    version: 3,
    gameType: "gundam",
    matchId: "m1",
    gameId: "g1",
    seed: "seed",
    participants: [],
    initialState: { count: 0, cards: ["a"] },
    checkpoints: [{ cursor: 0, state: { count: 0, cards: ["a"] } }],
    steps: [
      {
        patches: [
          { op: "replace", path: "/count", value: 1 },
          { op: "add", path: "/cards/-", value: "b" },
        ],
        acceptedMove: {
          stateVersion: 1,
          turnNumber: 1,
          actorId: "p1",
          moveId: "draw",
          timestamp: 1,
        },
        logs: [],
      },
      {
        patches: [{ op: "replace", path: "/count", value: 2 }],
        acceptedMove: {
          stateVersion: 4,
          turnNumber: 2,
          actorId: "p2",
          moveId: "pass",
          timestamp: 2,
        },
        logs: [],
      },
    ],
    metadata: { totalMoves: 1, totalTurns: 1, createdAt: "2026-01-01T00:00:00.000Z" },
  },
};

describe("ReplayPlaybackController", () => {
  it("applies patches and seeks back to the initial checkpoint", () => {
    const controller = new ReplayPlaybackController(playback);
    controller.seek(1);
    expect(controller.snapshot.state).toEqual({ count: 1, cards: ["a", "b"] });
    controller.seek(0);
    expect(controller.snapshot.state).toEqual({ count: 0, cards: ["a"] });
  });

  it("does not mutate the input while applying patches", () => {
    const source = { nested: { value: 1 } };
    expect(applyReplayPatch(source, [{ op: "replace", path: "/nested/value", value: 2 }])).toEqual({
      nested: { value: 2 },
    });
    expect(source).toEqual({ nested: { value: 1 } });
  });

  it("maps engine state versions to replay cursors without conflating the two", () => {
    const controller = new ReplayPlaybackController(playback);

    expect(controller.cursorForStateVersion(1)).toBe(1);
    expect(controller.cursorForStateVersion(4)).toBe(2);
    expect(controller.cursorForStateVersion(3)).toBe(1);
    expect(controller.cursorForStateVersion(0)).toBe(0);

    controller.seekStateVersion(4);
    expect(controller.snapshot.cursor).toBe(2);
    expect(controller.snapshot.state).toMatchObject({ count: 2 });
  });
});
