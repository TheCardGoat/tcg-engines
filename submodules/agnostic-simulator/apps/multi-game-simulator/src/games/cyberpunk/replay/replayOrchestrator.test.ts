import { describe, expect, it } from "vite-plus/test";
import type { ReplayPlaybackV1 } from "@tcg/game-page-contract";

import { DEFAULT_SCENARIO, P1, getScenario } from "../engine/fixtures/scenarios.js";
import { CyberpunkReplayOrchestrator } from "./replayOrchestrator.ts";

describe("CyberpunkReplayOrchestrator", () => {
  it("maps an engine state version to the exact replay cursor or nearest prior cursor", () => {
    const initialState = getScenario(DEFAULT_SCENARIO).build().getState();
    const playback: ReplayPlaybackV1 = {
      schemaVersion: 1,
      trust: "server_authoritative",
      publishedAt: "2026-08-13T00:00:00.000Z",
      replay: {
        version: 3,
        gameType: "cyberpunk",
        matchId: "match-1",
        gameId: "game-1",
        seed: "seed-1",
        participants: [
          { id: "p1", displayName: "Player 1", seat: 1 },
          { id: "p2", displayName: "Player 2", seat: 2 },
        ],
        initialState,
        checkpoints: [{ cursor: 0, state: initialState }],
        steps: [step(4, 1), step(7, 2)],
        metadata: {
          totalMoves: 2,
          totalTurns: 2,
          createdAt: "2026-08-13T00:00:00.000Z",
        },
      },
    };
    const orchestrator = new CyberpunkReplayOrchestrator(playback);

    expect(orchestrator.cursorForStateVersion(7)).toBe(2);
    expect(orchestrator.cursorForStateVersion(6)).toBe(1);
    orchestrator.goToStateVersion(7);
    expect(orchestrator.currentStep).toBe(2);
    expect(orchestrator.currentState.ctx.stateID).toBe(7);
    orchestrator.dispose();
  });

  it("hydrates a hosted replay whose patches target a viewer projection", () => {
    const source = getScenario(DEFAULT_SCENARIO).build();
    const projection = source.getFilteredView(P1);
    const playback = playbackFor(projection, [
      {
        patches: [{ op: "replace" as const, path: "/stateID", value: 4 }],
        acceptedMove: {
          stateVersion: 4,
          turnNumber: 1,
          actorId: "p1",
          moveId: "gainGig",
          timestamp: 4,
        },
        logs: [],
      },
    ]);

    const orchestrator = new CyberpunkReplayOrchestrator(playback);

    expect(orchestrator.currentState.ctx.matchId).toBe("match-1");
    orchestrator.nextStep();
    expect(orchestrator.currentState.ctx.stateID).toBe(4);
    orchestrator.dispose();
  });
});

function playbackFor(
  initialState: ReplayPlaybackV1["replay"]["initialState"],
  steps: ReplayPlaybackV1["replay"]["steps"],
): ReplayPlaybackV1 {
  return {
    schemaVersion: 1,
    trust: "server_authoritative",
    publishedAt: "2026-08-13T00:00:00.000Z",
    replay: {
      version: 3,
      gameType: "cyberpunk",
      matchId: "match-1",
      gameId: "game-1",
      seed: "seed-1",
      participants: [
        { id: "p1", displayName: "Player 1", seat: 1 },
        { id: "p2", displayName: "Player 2", seat: 2 },
      ],
      initialState,
      checkpoints: [{ cursor: 0, state: initialState }],
      steps,
      metadata: {
        totalMoves: steps.length,
        totalTurns: 1,
        createdAt: "2026-08-13T00:00:00.000Z",
      },
    },
  };
}

function step(stateVersion: number, turnNumber: number) {
  return {
    patches: [{ op: "replace" as const, path: "/ctx/stateID", value: stateVersion }],
    acceptedMove: {
      stateVersion,
      turnNumber,
      actorId: "p1",
      moveId: "test-move",
      timestamp: stateVersion,
    },
    logs: [],
  };
}
