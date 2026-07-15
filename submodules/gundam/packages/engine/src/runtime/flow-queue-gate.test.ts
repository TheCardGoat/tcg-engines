/**
 * Flow / pending-queue structural guard.
 *
 * Verifies that `resolveOneTransition` refuses to evaluate any endIf
 * while `G.pendingEffects` is non-empty — even when the flow's
 * `onTransitionCheck` hook is omitted. This is the belt-and-braces
 * backstop for new code paths that might bypass the drain hook.
 *
 * The test fixtures stand up a tiny synthetic flow + state directly so
 * the assertion targets the framework layer, not any game-specific
 * lifecycle wiring. `resolveFlowTransitions` mutates its `state`
 * argument in place via mutative drafts, but at runtime is happy to
 * mutate a plain object — we hand it one and cast at the boundary.
 */

import { describe, it, expect } from "vite-plus/test";
import type { Draft } from "mutative";
import { resolveFlowTransitions } from "./match-runtime.flow.ts";
import type { FlowDefinition, MatchState } from "../types/index.ts";

interface SyntheticG {
  pendingEffects: { id: string }[];
}

function buildState(g: SyntheticG): MatchState<SyntheticG> {
  return {
    G: g,
    ctx: {
      gameId: "test",
      _stateID: 0,
      playerIds: ["P1", "P2"],
      status: {
        gameSegment: "main",
        phase: "phaseA",
        step: undefined,
        turn: 0,
        turnPlayer: "P1",
        activePlayer: "P1",
        gameEnded: false,
      },
      events: [],
      moveHistory: [],
    },
  } as unknown as MatchState<SyntheticG>;
}

function buildFlow(endIfShouldFire: boolean): FlowDefinition {
  return {
    initialGameSegment: "main",
    gameSegments: {
      main: {
        id: "main",
        name: "Main",
        order: 0,
        turn: {
          initialPhase: "phaseA",
          phases: {
            phaseA: {
              id: "phaseA",
              name: "Phase A",
              order: 0,
              endIf: () => endIfShouldFire,
              nextPhase: "phaseB",
            },
            phaseB: {
              id: "phaseB",
              name: "Phase B",
              order: 1,
              endIf: () => false,
            },
          },
        },
      },
    },
  };
}

describe("resolveOneTransition pending-effect guard", () => {
  it("advances when the queue is empty (control)", () => {
    const state = buildState({ pendingEffects: [] });
    const flow = buildFlow(true);
    resolveFlowTransitions(state as unknown as Draft<MatchState>, flow);
    expect(state.ctx.status.phase).toBe("phaseB");
  });

  it("does NOT advance when the queue is non-empty, even without onTransitionCheck", () => {
    const state = buildState({ pendingEffects: [{ id: "pending-1" }] });
    const flow = buildFlow(true);
    resolveFlowTransitions(state as unknown as Draft<MatchState>, flow);
    // With a non-empty queue, the structural guard short-circuits the
    // endIf and the flow stays in phaseA.
    expect(state.ctx.status.phase).toBe("phaseA");
  });

  it("resumes advance after the queue drains", () => {
    const g: SyntheticG = { pendingEffects: [{ id: "pending-1" }] };
    const state = buildState(g);
    const flow = buildFlow(true);
    resolveFlowTransitions(state as unknown as Draft<MatchState>, flow);
    expect(state.ctx.status.phase).toBe("phaseA");
    // Drain externally and re-run — flow now advances.
    g.pendingEffects = [];
    resolveFlowTransitions(state as unknown as Draft<MatchState>, flow);
    expect(state.ctx.status.phase).toBe("phaseB");
  });
});
