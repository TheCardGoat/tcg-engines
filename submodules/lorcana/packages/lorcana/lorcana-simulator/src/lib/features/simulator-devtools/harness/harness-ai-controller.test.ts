import { describe, expect, it } from "bun:test";
import type { LorcanaServer, PlayerId } from "@tcg/lorcana-engine";

// Bun runs this suite's files concurrently. Keep the Svelte rune shim installed
// for the process so a later module import cannot race a per-test cleanup.
if (!Object.hasOwn(globalThis, "$state")) {
  Object.defineProperty(globalThis, "$state", {
    configurable: true,
    value: <T>(value: T) => value,
  });
}

function createServerStub(): LorcanaServer {
  return {
    getCurrentActorId: () => "player_two" as PlayerId,
    getTurnNumber: () => 3,
    getWinner: () => undefined,
    onStateUpdate: () => () => {},
    resolveAutomatedActionStrategyForPlayer: () => undefined,
    enumerateAutomatedActionsForCurrentActor: () => {
      throw new Error("sync mode must not enumerate automated actions");
    },
  } as unknown as LorcanaServer;
}

describe("HarnessAiController", () => {
  it("syncs AI turn state without enumerating automated actions", async () => {
    const { HarnessAiController } = await import("./harness-ai-controller.svelte.js");
    const controller = new HarnessAiController(createServerStub(), {
      strategyId: "deck-aware-lore-race",
      initialPlayMode: "step",
    });

    expect(controller.state.mode).toBe("ai-paused");

    controller.dispose();
  });
});
