import { describe, expect, it } from "bun:test";
import type { ServerGameEngine } from "@tcg/shared/game-engine";
import { serializeCyberpunkState } from "./state-view";

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

describe("cyberpunk state-view", () => {
  it("renders core fields from Cyberpunk match state", () => {
    const engine = makeMockEngine({
      ctx: { stateID: 12 },
      G: {
        gameEnded: false,
        turnMetadata: {
          activePlayerId: "p1",
          turnNumber: 5,
          phase: "main",
        },
        players: {
          p1: {
            life: 18,
            gigs: 3,
            hand: ["c1", "c2", "c3"],
            deck: { items: Array.from({ length: 40 }) },
            discard: ["d1"],
            play: [{ id: "u1" }, { id: "u2" }],
          },
          p2: {
            life: 20,
            gigs: 1,
            hand: ["x1"],
            deck: Array.from({ length: 35 }),
            discard: [],
            play: [],
          },
        },
      },
    });

    const view = serializeCyberpunkState({ engine, actorId: "p1" });
    expect(view.stateId).toBe(12);
    expect(view.turn).toBe(5);
    expect(view.phase).toBe("main");
    expect(view.activePlayerId).toBe("p1");
    expect(view.isActorTurn).toBe(true);
    expect(view.gameEnded).toBe(false);
    expect(view.actor.life).toBe(18);
    expect(view.actor.gigs).toBe(3);
    expect(view.actor.handCount).toBe(3);
    expect(view.actor.deckCount).toBe(40);
    expect(view.actor.unitsInPlay).toBe(2);
    expect(view.opponent.id).toBe("p2");
    expect(view.opponent.life).toBe(20);
    expect(view.opponent.handCount).toBe(1);
    expect(view.opponent.deckCount).toBe(35);
  });

  it("is defensive against missing G or turnMetadata", () => {
    const engine = makeMockEngine({});
    const view = serializeCyberpunkState({ engine, actorId: "p1" });
    expect(view.turn).toBe(0);
    expect(view.gameEnded).toBe(false);
    expect(view.actor.handCount).toBe(0);
    expect(view.opponent.id).toBe("unknown");
  });

  it("surfaces gameEnded when set", () => {
    const engine = makeMockEngine({
      ctx: { stateID: 0 },
      G: { gameEnded: true, turnMetadata: { activePlayerId: "p1", turnNumber: 1 }, players: {} },
    });
    const view = serializeCyberpunkState({ engine, actorId: "p1" });
    expect(view.gameEnded).toBe(true);
  });

  it("surfaces pendingChoice", () => {
    const engine = makeMockEngine({
      ctx: { stateID: 0 },
      G: {
        gameEnded: false,
        turnMetadata: { activePlayerId: "p1", turnNumber: 1, pendingChoice: { kind: "discard" } },
        players: {},
      },
    });
    const view = serializeCyberpunkState({ engine, actorId: "p1" });
    expect(view.pendingChoice).toEqual({ kind: "discard" });
  });
});
