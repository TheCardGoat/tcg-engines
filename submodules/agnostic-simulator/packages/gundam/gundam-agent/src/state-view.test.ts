import { describe, expect, it } from "bun:test";
import type { ServerGameEngine } from "@tcg/shared/game-engine";
import { serializeGundamState } from "./state-view";

function makeMockEngine(state: Record<string, unknown>): ServerGameEngine {
  return {
    dispatch: () => ({ success: false, error: "noop" }),
    getStateID: () => 0,
    getState: () => state,
    getActivePlayerId: () => "p1",
    hasGameEnded: () => false,
    getGameEndResult: () => undefined,
  } as ServerGameEngine;
}

describe("gundam state-view", () => {
  it("extracts turn/phase/step/active from match-state", () => {
    const engine = makeMockEngine({
      ctx: {
        _stateID: 7,
        status: { turn: 4, phase: "main", step: "actions", activePlayer: "p1" },
      },
      G: {
        players: {
          p1: {
            hand: ["c1", "c2"],
            deck: { items: Array.from({ length: 30 }, (_, i) => i) },
            resourceArea: [{ active: true }, { active: false }, { active: true }],
            shieldBaseRemaining: 6,
          },
          p2: {
            hand: ["x1", "x2", "x3"],
            deck: Array.from({ length: 28 }),
            resourceArea: [],
            shieldBaseRemaining: 6,
          },
        },
      },
    });

    const view = serializeGundamState({ engine, actorId: "p1" });
    expect(view.stateId).toBe(7);
    expect(view.turn).toBe(4);
    expect(view.phase).toBe("main");
    expect(view.step).toBe("actions");
    expect(view.isActorTurn).toBe(true);
    expect(view.activePlayerId).toBe("p1");
    expect(view.actor.handCount).toBe(2);
    expect(view.actor.deckCount).toBe(30);
    expect(view.actor.resourceAreaCount).toBe(3);
    expect(view.actor.resourceAreaActiveCount).toBe(2);
    expect(view.actor.shieldBaseRemaining).toBe(6);
    expect(view.opponent.id).toBe("p2");
    expect(view.opponent.handCount).toBe(3);
    expect(view.opponent.deckCount).toBe(28);
  });

  it("handles a missing G or ctx (defensive)", () => {
    const engine = makeMockEngine({});
    const view = serializeGundamState({ engine, actorId: "p1" });
    expect(view.stateId).toBe(0);
    expect(view.turn).toBe(0);
    expect(view.actor.handCount).toBe(0);
    expect(view.opponent.id).toBe("unknown");
  });

  it("isActorTurn = false when active player differs", () => {
    const engine = makeMockEngine({
      ctx: { _stateID: 1, status: { turn: 1, activePlayer: "p2" } },
      G: { players: { p1: {}, p2: {} } },
    });
    const view = serializeGundamState({ engine, actorId: "p1" });
    expect(view.isActorTurn).toBe(false);
  });

  it("surfaces pendingChoice when present", () => {
    const engine = makeMockEngine({
      ctx: { _stateID: 1, status: { turn: 1, activePlayer: "p1" } },
      G: { players: { p1: {}, p2: {} }, pendingChoice: { kind: "target-unit" } },
    });
    const view = serializeGundamState({ engine, actorId: "p1" });
    expect(view.pendingChoice).toEqual({ kind: "target-unit" });
  });
});
