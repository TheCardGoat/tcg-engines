import { describe, expect, it } from "bun:test";
import type { LorcanaServer, PlayerId } from "@tcg/lorcana-engine";

import { HarnessAiController } from "./harness-ai-controller.svelte.js";

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
  it("syncs AI turn state without enumerating automated actions", () => {
    (globalThis as { $state?: <T>(value: T) => T }).$state ??= (value) => value;

    const controller = new HarnessAiController(createServerStub(), {
      strategyId: "deck-aware-lore-race",
      initialPlayMode: "step",
    });

    expect(controller.state.mode).toBe("ai-paused");

    controller.dispose();
  });
});
