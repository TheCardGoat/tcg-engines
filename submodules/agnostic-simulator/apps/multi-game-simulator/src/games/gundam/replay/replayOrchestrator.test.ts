import { describe, expect, it } from "vite-plus/test";

import type { ReplayPlaybackV1 } from "@tcg/game-page-contract";

import { createDevRuntime } from "../src/game/dev-runtime.ts";
import { GundamReplayOrchestrator } from "./replayOrchestrator.ts";

describe("GundamReplayOrchestrator", () => {
  it("accepts the projection-backed payload emitted for server-authoritative replays", () => {
    const projection = createDevRuntime().runtime.getFilteredView({ role: "spectator" });
    const orchestrator = new GundamReplayOrchestrator(playbackFor(projection));

    expect(orchestrator.currentState).toEqual(projection);
    expect(orchestrator.currentTurn).toBe(projection.status.turn + 1);
    expect(orchestrator.totalTurns).toBe(projection.status.turn + 1);
    orchestrator.dispose();
  });

  it("continues to accept complete raw snapshots", () => {
    const rawState = createDevRuntime().runtime.getState();
    const orchestrator = new GundamReplayOrchestrator(playbackFor(rawState));

    expect(orchestrator.currentState).toEqual(rawState);
    expect(orchestrator.currentTurn).toBe(rawState.ctx.status.turn + 1);
    orchestrator.dispose();
  });

  it("rejects raw snapshots missing renderer-required private zone maps", () => {
    const rawState = createDevRuntime().runtime.getState();
    const malformedState = {
      ...rawState,
      ctx: {
        ...rawState.ctx,
        zones: {
          public: rawState.ctx.zones.public,
          reveals: rawState.ctx.zones.reveals,
        },
      },
    };

    expect(() => new GundamReplayOrchestrator(playbackFor(malformedState))).toThrow(
      "Replay did not contain a valid Gundam engine snapshot.",
    );
  });

  it("opens the cursor belonging to an engine state version", () => {
    const projection = createDevRuntime().runtime.getFilteredView({ role: "spectator" });
    const playback = playbackFor(projection);
    playback.replay.steps.push(replayStep(4, 1, "/stateID", 4), replayStep(7, 2, "/stateID", 7));
    const orchestrator = new GundamReplayOrchestrator(playback);

    expect(orchestrator.cursorForStateVersion(7)).toBe(2);
    expect(orchestrator.cursorForStateVersion(6)).toBe(1);
    orchestrator.goToStateVersion(7);
    expect(orchestrator.currentStep).toBe(2);
    expect("stateID" in orchestrator.currentState && orchestrator.currentState.stateID).toBe(7);
    orchestrator.dispose();
  });
});

function replayStep(stateVersion: number, turnNumber: number, path: string, value: number) {
  return {
    patches: [{ op: "replace" as const, path, value }],
    acceptedMove: {
      stateVersion,
      turnNumber,
      actorId: "player_one",
      moveId: "test-move",
      timestamp: stateVersion,
    },
    logs: [],
  };
}

function playbackFor(initialState: unknown): ReplayPlaybackV1 {
  return {
    schemaVersion: 1,
    trust: "server_authoritative",
    publishedAt: "2026-08-05T00:00:00.000Z",
    replay: {
      version: 3,
      gameType: "gundam",
      matchId: "match-review",
      gameId: "game-review",
      seed: "review-seed",
      participants: [],
      initialState,
      checkpoints: [{ cursor: 0, state: initialState }],
      steps: [],
      metadata: {
        totalMoves: 0,
        totalTurns: 0,
        createdAt: "2026-08-05T00:00:00.000Z",
      },
    },
  };
}
