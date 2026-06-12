import { describe, expect, it } from "bun:test";
import type { ServerGameEngine } from "@tcg/shared/game-engine";
import { serializeLorcanaState } from "./state-view";

function makeMockEngine(boardOverride: Record<string, unknown>): ServerGameEngine {
  return {
    dispatch: () => ({ success: false, error: "noop" }),
    getStateID: () => 0,
    getState: () => ({}),
    getActivePlayerId: () => "p1",
    hasGameEnded: () => false,
    getGameEndResult: () => undefined,
    // Augment with Lorcana-style `engine.getBoard()` for the state serializer to read.
    ...({ engine: { getBoard: () => boardOverride } } as Record<string, unknown>),
  } as ServerGameEngine;
}

const SAMPLE_BOARD = {
  gameID: "game-1",
  matchID: "match-1",
  stateID: 42,
  turnNumber: 3,
  phase: "main",
  step: "playerActions",
  turnPlayer: "p1",
  priorityPlayer: "p1",
  status: "playing" as const,
  players: {
    p1: {
      lore: 4,
      canAddCardToInkwell: true,
      handCount: 5,
      deckCount: 30,
      hand: ["c1", "c2"],
      play: ["c10"],
      inkwell: ["i1", "i2"],
      discard: ["d1"],
    },
    p2: {
      lore: 2,
      canAddCardToInkwell: false,
      handCount: 6,
      deckCount: 28,
      hand: ["x1", "x2"],
      play: ["c20"],
      inkwell: ["j1"],
      discard: [],
    },
  },
  cards: {
    c1: { id: "c1", definitionId: "MULAN_HERO", cardType: "character", playCost: 3 },
    c2: { id: "c2", definitionId: "INK_BOLT", cardType: "action", playCost: 1 },
    c10: {
      id: "c10",
      definitionId: "MICKEY",
      cardType: "character",
      exerted: false,
      drying: false,
      strength: 2,
      willpower: 3,
      lore: 1,
    },
    c20: {
      id: "c20",
      definitionId: "RIVAL",
      cardType: "character",
      exerted: true,
      drying: false,
      strength: 3,
      willpower: 2,
    },
    i1: { id: "i1", cardType: "character", exerted: true },
    i2: { id: "i2", cardType: "character", exerted: false },
    j1: { id: "j1", cardType: "character", exerted: true },
    d1: { id: "d1", cardType: "action", definitionId: "DISCARDED" },
  },
  bagEffects: [],
  pendingEffects: [],
};

describe("lorcana state-view", () => {
  it("renders core fields (turn, phase, lore, hand IDs)", () => {
    const engine = makeMockEngine(SAMPLE_BOARD);
    const view = serializeLorcanaState({ engine, actorId: "p1" });

    expect(view.gameId).toBe("game-1");
    expect(view.matchId).toBe("match-1");
    expect(view.stateId).toBe(42);
    expect(view.turn).toBe(3);
    expect(view.phase).toBe("main");
    expect(view.isActorTurn).toBe(true);
    expect(view.status).toBe("playing");
    expect(view.actor.lore).toBe(4);
    expect(view.actor.canAddCardToInkwell).toBe(true);
    expect(view.actor.handCount).toBe(5);
    expect(view.actor.hand?.map((c) => c.id)).toEqual(["c1", "c2"]);
    expect(view.actor.play?.map((c) => c.id)).toEqual(["c10"]);
  });

  it("hides opponent hand contents but keeps hand count", () => {
    const engine = makeMockEngine(SAMPLE_BOARD);
    const view = serializeLorcanaState({ engine, actorId: "p1" });

    expect(view.opponent.id).toBe("p2");
    expect(view.opponent.handCount).toBe(6);
    expect(view.opponent.hand).toBeUndefined();
    expect(view.opponent.play.map((c) => c.id)).toEqual(["c20"]);
  });

  it("computes inkwellReadyCount from non-exerted inkwell cards", () => {
    const engine = makeMockEngine(SAMPLE_BOARD);
    const view = serializeLorcanaState({ engine, actorId: "p1" });

    expect(view.actor.inkwellCount).toBe(2);
    expect(view.actor.inkwellReadyCount).toBe(1); // i1 is exerted, i2 is ready
  });

  it("propagates pendingChoice when present", () => {
    const board = {
      ...SAMPLE_BOARD,
      pendingChoice: { type: "mulligan", playerID: "p1" },
    };
    const engine = makeMockEngine(board);
    const view = serializeLorcanaState({ engine, actorId: "p1" });

    expect(view.pendingChoice).toEqual({ type: "mulligan", forPlayer: "p1" });
  });

  it("is defensive against missing fields in the projection", () => {
    const engine = makeMockEngine({});
    const view = serializeLorcanaState({ engine, actorId: "p1" });

    expect(view.gameId).toBe("");
    expect(view.stateId).toBe(0);
    expect(view.actor.lore).toBe(0);
    expect(view.actor.handCount).toBe(0);
    expect(view.actor.play).toEqual([]);
    expect(view.opponent.id).toBe("unknown");
  });

  it("marks isActorTurn = false when priority is on the opponent", () => {
    const board = {
      ...SAMPLE_BOARD,
      priorityPlayer: "p2",
    };
    const engine = makeMockEngine(board);
    const view = serializeLorcanaState({ engine, actorId: "p1" });

    expect(view.isActorTurn).toBe(false);
  });
});
