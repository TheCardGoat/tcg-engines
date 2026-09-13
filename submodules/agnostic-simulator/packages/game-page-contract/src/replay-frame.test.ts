import { describe, expect, it } from "vitest";
import {
  materializeReplayFrameAtCursor,
  materializeReplayStateAtCursor,
} from "./replay-materializer";
import type { ReplayPlaybackV1, ReplayStep } from "./replay";
const move = { stateVersion: 1, turnNumber: 1, actorId: "p1", moveId: "move", timestamp: 1 };
function playback(steps: ReplayStep[]): ReplayPlaybackV1 {
  return {
    schemaVersion: 1,
    trust: "server_authoritative",
    publishedAt: "2026-09-04T00:00:00.000Z",
    resources: { cards: { hero: "h" } },
    presentationBindings: { printingIdByInstanceId: { hero: "alternate" } },
    replay: {
      version: 3,
      gameType: "flesh-and-blood",
      matchId: "match",
      gameId: "game",
      seed: "seed",
      participants: [],
      initialState: { turn: 0 },
      checkpoints: [],
      steps,
      metadata: { totalMoves: steps.length, totalTurns: 1, createdAt: "2026-09-04T00:00:00.000Z" },
    },
  };
}
describe("resource-aware replay seeking", () => {
  it.each(["lorcana", "gundam", "cyberpunk", "one-piece", "riftbound"] as const)(
    "retains legacy %s state and resources without adding presentation fields",
    (gameType) => {
      const legacy = playback([
        { acceptedMove: move, logs: [], patches: [{ op: "replace", path: "/turn", value: 1 }] },
        {
          acceptedMove: { ...move, stateVersion: 2 },
          logs: [],
          patches: [{ op: "replace", path: "/turn", value: 2 }],
        },
      ]);
      delete legacy.presentationBindings;
      legacy.replay.gameType = gameType;
      legacy.replay.checkpoints = [{ cursor: 1, state: { turn: 1 } }];
      const original = structuredClone(legacy);
      for (const cursor of [0, 2, 1, 0]) {
        expect(materializeReplayFrameAtCursor(legacy, cursor)).toEqual({
          state: { turn: cursor },
          resources: legacy.resources,
        });
      }
      expect(legacy).toEqual(original);
    },
  );
  it("seeks across token creation, concealment and undo using a legacy state-only checkpoint", () => {
    const replay = playback([
      {
        acceptedMove: move,
        logs: [],
        patches: [{ op: "replace", path: "/turn", value: 1 }],
        resourcePatches: [{ op: "add", path: "/cards/token", value: "t" }],
        presentationBindings: { printingIdByInstanceId: { hero: "alternate", token: "default" } },
      },
      {
        acceptedMove: move,
        logs: [],
        patches: [{ op: "replace", path: "/turn", value: 2 }],
        resourcePatches: [{ op: "remove", path: "/cards/token" }],
        presentationBindings: { printingIdByInstanceId: { hero: "alternate" } },
      },
      {
        acceptedMove: move,
        logs: [],
        patches: [{ op: "replace", path: "/turn", value: 1 }],
        resourcePatches: [{ op: "add", path: "/cards/token", value: "t" }],
        presentationBindings: { printingIdByInstanceId: { hero: "alternate", token: "default" } },
      },
    ]);
    replay.replay.checkpoints = [{ cursor: 2, state: { turn: 2 } }];
    expect(materializeReplayFrameAtCursor(replay, 3)).toMatchObject({
      state: { turn: 1 },
      resources: { cards: { hero: "h", token: "t" } },
      presentationBindings: { printingIdByInstanceId: { hero: "alternate", token: "default" } },
    });
    expect(materializeReplayFrameAtCursor(replay, 2).resources).toEqual({ cards: { hero: "h" } });
    expect(materializeReplayStateAtCursor(replay.replay, 3)).toEqual({ turn: 1 });
  });
  it("distinguishes absent resources, explicit null and a resource-aware checkpoint", () => {
    const replay = playback([
      { acceptedMove: move, logs: [], patches: [], resourcePatches: [{ op: "remove", path: "" }] },
      {
        acceptedMove: move,
        logs: [],
        patches: [],
        resourcePatches: [{ op: "add", path: "", value: null }],
      },
    ]);
    expect(Object.hasOwn(materializeReplayFrameAtCursor(replay, 1), "resources")).toBe(false);
    expect(materializeReplayFrameAtCursor(replay, 2).resources).toBeNull();
    replay.replay.checkpoints.push({ cursor: 2, state: { turn: 0 }, resources: null });
    expect(materializeReplayFrameAtCursor(replay, 2).resources).toBeNull();
    expect(replay.resources).toEqual({ cards: { hero: "h" } });
  });
});
