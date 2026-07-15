import { describe, expect, it } from "vite-plus/test";

import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockResource,
} from "../gundam/testing/index.ts";
import type { PlayerId } from "../types/branded.ts";

import { enumerateGundamBotCandidates } from "./candidate-enumerator.ts";
import { passOnlyStrategy } from "./pass-only-strategy.ts";
import { takeAutomatedActionWithFallback } from "./planner.ts";
import type { GundamBotCandidate } from "./candidate-types.ts";

/**
 * Helper: run the strategy against the candidates the enumerator
 * produces for the current state, so tests exercise the same shape
 * the planner sees in production.
 */
function rank(engine: GundamTestEngine, playerId: PlayerId): readonly GundamBotCandidate[] {
  const candidates = enumerateGundamBotCandidates(
    engine.runtime.getState(),
    playerId,
    engine.runtime.getStaticResources(),
  );
  return passOnlyStrategy.selectCandidates({
    playerId,
    state: engine.runtime.getState(),
    view: engine.runtime.getFilteredView({ role: "player", playerId }),
    candidates,
    turnNumber: 0,
    pendingChoice: engine.runtime.getPendingChoice({ role: "player", playerId }) ?? null,
    cards: engine.runtime.getCardReadAPI(),
  });
}

function viewFor(engine: GundamTestEngine, playerId: PlayerId) {
  return engine.runtime.getFilteredView({ role: "player", playerId });
}

describe("passOnlyStrategy: filters out aggressive actions", () => {
  it("drops deployUnit candidates even when the deploy is legal", () => {
    const rx = createMockUnit({
      cost: 1,
      level: 1,
      ap: 2,
      hp: 3,
      color: "blue",
      name: "RX-78-2",
    });
    const engine = GundamTestEngine.create(
      { hand: [rx], resourceArea: [createMockResource(), createMockResource()] },
      {},
    );

    const ranked = rank(engine, PLAYER_ONE as PlayerId);
    expect(ranked.every((c) => c.family !== "deployUnit")).toBe(true);
  });

  it("drops enterBattle candidates even when an attack is legal", () => {
    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "RX-78-2" });
    const target = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, name: "Dom" });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: target, exhausted: true }] },
    );

    const ranked = rank(engine, PLAYER_ONE as PlayerId);
    expect(ranked.every((c) => c.family !== "enterBattle")).toBe(true);
  });

  it("drops declareBlock candidates — pass-only always takes the shield loss", () => {
    // We don't construct a full block-window scenario here; instead we
    // prove the filter regardless of state by handing the strategy a
    // synthetic candidate list. This is a unit test of the strategy
    // shape, not an end-to-end block-flow test.
    const engine = GundamTestEngine.create({}, {});
    const synthetic: readonly GundamBotCandidate[] = [
      { family: "declareBlock", blockerId: "b1" },
      { family: "passBlock" },
    ];
    const ranked = passOnlyStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view: viewFor(engine, PLAYER_ONE as PlayerId),
      candidates: synthetic,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });
    expect(ranked).toEqual([{ family: "passBlock" }]);
  });
});

describe("passOnlyStrategy: keeps forced / setup responses", () => {
  it("keeps chooseFirstPlayer over aggressive options", () => {
    const engine = GundamTestEngine.create({}, {});
    const synthetic: readonly GundamBotCandidate[] = [
      { family: "deployUnit", cardId: "x" },
      { family: "chooseFirstPlayer", playerId: "player_one" },
      { family: "passTurn" },
    ];
    const ranked = passOnlyStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view: viewFor(engine, PLAYER_ONE as PlayerId),
      candidates: synthetic,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });
    expect(ranked[0]?.family).toBe("chooseFirstPlayer");
    expect(ranked).toHaveLength(2);
  });

  it("keeps alterHand (mulligan decision)", () => {
    const engine = GundamTestEngine.create({}, {});
    const synthetic: readonly GundamBotCandidate[] = [
      { family: "alterHand", wantsRedraw: false },
      { family: "passTurn" },
    ];
    const ranked = passOnlyStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view: viewFor(engine, PLAYER_ONE as PlayerId),
      candidates: synthetic,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });
    expect(ranked[0]?.family).toBe("alterHand");
  });

  it("keeps resolveEffect so pending effects don't stall the match", () => {
    const engine = GundamTestEngine.create({}, {});
    const synthetic: readonly GundamBotCandidate[] = [
      { family: "resolveEffect" },
      { family: "passTurn" },
    ];
    const ranked = passOnlyStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view: viewFor(engine, PLAYER_ONE as PlayerId),
      candidates: synthetic,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });
    expect(ranked[0]?.family).toBe("resolveEffect");
  });

  it("keeps discardToHandLimit so end-of-turn is reachable", () => {
    const engine = GundamTestEngine.create({}, {});
    const synthetic: readonly GundamBotCandidate[] = [
      { family: "discardToHandLimit", cardIds: ["c1"] },
      { family: "concede" },
    ];
    const ranked = passOnlyStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view: viewFor(engine, PLAYER_ONE as PlayerId),
      candidates: synthetic,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });
    expect(ranked).toHaveLength(1);
    expect(ranked[0]?.family).toBe("discardToHandLimit");
  });
});

describe("passOnlyStrategy: end-to-end via planner", () => {
  it("submits passTurn in a mid-main-phase state where deploys are legal", () => {
    const rx = createMockUnit({
      cost: 1,
      level: 1,
      ap: 2,
      hp: 3,
      color: "blue",
      name: "RX-78-2",
    });
    const engine = GundamTestEngine.create(
      { hand: [rx], resourceArea: [createMockResource(), createMockResource()] },
      {},
    );

    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      passOnlyStrategy,
      engine.runtime.getStaticResources(),
    );

    // Either the strategy chose passTurn, or the planner's fallback
    // did — both outcomes prove the bot didn't deploy the unit.
    expect(result.selectedCandidate?.family ?? "passTurn").toBe("passTurn");
    expect(
      result.outcome === "candidate-succeeded" || result.outcome === "no-candidates-pass-succeeded",
    ).toBe(true);
  });
});

describe("passOnlyStrategy: ordering within allowed set", () => {
  it("ranks setup/forced responses above step passes", () => {
    const engine = GundamTestEngine.create({}, {});
    const synthetic: readonly GundamBotCandidate[] = [
      { family: "passTurn" },
      { family: "passActionStep" },
      { family: "chooseFirstPlayer", playerId: "player_one" },
    ];
    const ranked = passOnlyStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view: viewFor(engine, PLAYER_ONE as PlayerId),
      candidates: synthetic,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });
    expect(ranked.map((c) => c.family)).toEqual([
      "chooseFirstPlayer",
      "passActionStep",
      "passTurn",
    ]);
  });

  it("prefers keep-hand over redraw via the shared alterHand policy", () => {
    const engine = GundamTestEngine.create({}, {});
    const synthetic: readonly GundamBotCandidate[] = [
      { family: "alterHand", wantsRedraw: true },
      { family: "alterHand", wantsRedraw: false },
    ];
    const ranked = passOnlyStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view: viewFor(engine, PLAYER_ONE as PlayerId),
      candidates: synthetic,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });
    // The shared default alterHand policy keeps the opening hand —
    // strategies inheriting `composeStrategy` defaults all submit
    // `wantsRedraw: false` regardless of the input candidate order.
    expect(ranked[0]).toEqual({ family: "alterHand", wantsRedraw: false });
  });
});

describe("passOnlyStrategy: placeholder player", () => {
  it("handles a PLAYER_TWO perspective", () => {
    const engine = GundamTestEngine.create({}, {});
    const ranked = rank(engine, PLAYER_TWO as PlayerId);
    // Whatever the enumerator produced for player_two, no aggressive
    // candidate survived.
    for (const c of ranked) {
      expect(
        ["deployUnit", "deployBase", "playCommand", "enterBattle", "activateAbility"].includes(
          c.family,
        ),
      ).toBe(false);
    }
  });
});
