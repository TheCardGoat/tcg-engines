import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import {
  projectFabInteraction,
  projectFabInteractionCached,
  projectionComputeCounts,
} from "./interaction.ts";
import { FleshAndBloodServerEngine } from "./server-engine.ts";

/** Fresh runtime with player-1 holding priority and no pending decision. */
function serverEngine(): FleshAndBloodServerEngine {
  const fixture = FabTestEngine.create({
    player1: { hand: [], deck: 8, actionPoints: 1 },
    player2: { hand: [], deck: 8, actionPoints: 1 },
  });
  return new FleshAndBloodServerEngine(fixture.getRuntime());
}

describe("FAB projection memo", () => {
  it("computes one projection per (state, actor) and invalidates when the state advances", () => {
    const engine = serverEngine();
    const before = projectionComputeCounts.project;

    const first = projectFabInteractionCached(engine.runtime, "player-1");
    const second = projectFabInteractionCached(engine.runtime, "player-1");
    expect(projectionComputeCounts.project - before).toBe(1);
    expect(second).toBe(first);

    // The uncached export always computes, for tests that observe fresh work.
    projectFabInteraction(engine.runtime, "player-1");
    expect(projectionComputeCounts.project - before).toBe(2);

    // A different actor gets its own memo entry at the same state.
    projectFabInteractionCached(engine.runtime, "player-2");
    expect(projectionComputeCounts.project - before).toBe(3);

    // Committing a command advances the state version: the next cached read
    // for the same actor recomputes exactly once.
    const view = projectFabInteractionCached(engine.runtime, "player-1").view;
    const pass = view.actions.find((action) => action.intent === "pass");
    expect(pass).toBeDefined();
    const result = engine.submitInteraction(
      "player-1",
      buildInteractionSubmission({ view, action: pass!, values: {} }),
      { gameId: "projection-memo", sourceAuthority: "server" },
    );
    expect(result.success).toBe(true);

    const beforeAfterCommit = projectionComputeCounts.project;
    const fresh = projectFabInteractionCached(engine.runtime, "player-1");
    expect(projectionComputeCounts.project - beforeAfterCommit).toBe(1);
    expect(fresh.view.stateVersion).toBe(first.view.stateVersion + 1);
    expect(fresh).not.toBe(first);
  });
});
