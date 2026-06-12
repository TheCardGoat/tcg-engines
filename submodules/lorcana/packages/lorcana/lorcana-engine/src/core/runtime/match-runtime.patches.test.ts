import { describe, expect, it } from "bun:test";
import { MatchRuntime } from "./match-runtime";
import type { MatchRuntimeConfig, MoveExecutionContext } from "./match-runtime.types";
import type { MoveInput } from "./types";
import { createEmptyMatchStaticResources } from "./static-resources";
import type { LorcanaG } from "../../types/runtime-state";

type CounterGameState = LorcanaG & { counter: number };

function incrementCounter(context: MoveExecutionContext<MoveInput<Record<string, never>>>): void {
  const state = context.G as CounterGameState;
  state.counter += 1;
}

function createRuntimeConfig(): MatchRuntimeConfig {
  return {
    name: "match-runtime-patches-test",
    setup: () => ({ counter: 0 }) as CounterGameState,
    moves: {
      increment: {
        ignorePriority: true,
        execute: incrementCounter,
      },
    },
    flow: {
      gameSegments: {
        main: {
          id: "main",
          name: "Main",
          order: 1,
          turn: {
            initialPhase: "main",
            phases: {
              main: {
                id: "main",
                name: "Main",
                order: 1,
                validMoves: ["increment"],
              },
            },
          },
        },
      },
      initialGameSegment: "main",
    },
    zones: {},
    playerView: (state) => state,
    projectBoard: (state) => state,
    deriveRuntimeCard: () => ({}),
  };
}

function createRuntime(capturePatches: boolean): MatchRuntime {
  const staticResources = createEmptyMatchStaticResources();

  return new MatchRuntime(createRuntimeConfig(), {
    players: [{ id: "player_one" }, { id: "player_two" }],
    seed: "patch-test-seed",
    capturePatches,
    cardsMaps: { cardInstances: {}, owners: {} },
    cardCatalog: staticResources.cards,
  });
}

describe("MatchRuntime patch capture", () => {
  it("captures patches when explicitly enabled", () => {
    const runtime = createRuntime(true);

    const result = runtime.processCommand(
      {
        commandID: "cmd-server",
        move: "increment",
        input: { args: {} },
      },
      "player_one",
      runtime.getCurrentStateID(),
      Date.now(),
      "player",
    );

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.patches.length).toBeGreaterThan(0);
  });

  it("skips patch capture when disabled", () => {
    const runtime = createRuntime(false);

    const result = runtime.processCommand(
      {
        commandID: "cmd-client",
        move: "increment",
        input: { args: {} },
      },
      "player_one",
      runtime.getCurrentStateID(),
      Date.now(),
      "player",
    );

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.patches).toEqual([]);
    expect((result.state.G as CounterGameState).counter).toBe(1);
  });
});
