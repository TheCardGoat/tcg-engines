import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { readFabWaitState } from "./wait-state.ts";

describe("readFabWaitState", () => {
  it("reports ordinary action-phase priority after seating", () => {
    const game = FabTestEngine.create({
      player1: { heroCardId: "hero-1", hand: [], deck: 4 },
      player2: { heroCardId: "hero-2", hand: [], deck: 4 },
      cardDefinitions: {
        "hero-1": { canonicalId: "hero-1", types: ["Hero"], intelligence: 4 },
        "hero-2": { canonicalId: "hero-2", types: ["Hero"], intelligence: 4 },
      },
    });
    const wait = readFabWaitState(game.getState());
    expect(wait).toMatchObject({
      kind: "priority",
      window: "action",
    });
  });

  it("does not invent a priority holder when combat is closed-priority", () => {
    const game = FabTestEngine.create({
      player1: { heroCardId: "hero-1", hand: [], deck: 4 },
      player2: { heroCardId: "hero-2", hand: [], deck: 4 },
      cardDefinitions: {
        "hero-1": { canonicalId: "hero-1", types: ["Hero"], intelligence: 4 },
        "hero-2": { canonicalId: "hero-2", types: ["Hero"], intelligence: 4 },
      },
    });
    const state = game.getState();
    state.priority = null;
    state.priority = null;
    expect(readFabWaitState(state).kind).toBe("resolving");
  });

  it("reports game-over after a concede", () => {
    const game = FabTestEngine.create({
      player1: { heroCardId: "hero-1", hand: [], deck: 4 },
      player2: { heroCardId: "hero-2", hand: [], deck: 4 },
      cardDefinitions: {
        "hero-1": { canonicalId: "hero-1", types: ["Hero"], intelligence: 4 },
        "hero-2": { canonicalId: "hero-2", types: ["Hero"], intelligence: 4 },
      },
    });
    game.as("hero-1").concede();
    expect(game.getRuntime().waitState()).toMatchObject({
      kind: "game-over",
    });
  });
});
