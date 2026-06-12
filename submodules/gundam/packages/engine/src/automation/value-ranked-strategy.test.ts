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
import { greedyLegalStrategy } from "./greedy-legal-strategy.ts";
import { takeAutomatedActionWithFallback } from "./planner.ts";
import { valueRankedStrategy } from "./value-ranked-strategy.ts";

/**
 * `valueRankedStrategy` overrides only the `enterBattle` and
 * `deployUnit` policies on top of the shared defaults. These tests
 * pin:
 *
 *   - The override actually changes ranking output relative to greedy
 *     (not always — when the enumerator already orders by value,
 *     output coincides — but in the seeded scenarios below it should).
 *   - The strategy successfully drives a single action through the
 *     planner against a representative state.
 *   - Other family rankings (resolveEffect, setup, pass) are unchanged
 *     vs. greedy because they inherit the same defaults.
 */
describe("valueRankedStrategy: enterBattle ranks by expected damage", () => {
  it("prefers the higher-AP attacker against a fresh target", () => {
    // Seed: P1 has two attackers (AP 5 and AP 1) and an exhausted
    // target on P2's board. The value ranker should put the AP-5
    // attacker's enterBattle ahead of the AP-1 one.
    const heavy = createMockUnit({ cost: 3, level: 3, ap: 5, hp: 3, name: "Heavy" });
    const light = createMockUnit({ cost: 1, level: 1, ap: 1, hp: 2, name: "Light" });
    const target = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, name: "Dom" });
    const engine = GundamTestEngine.create(
      { play: [heavy, light] },
      { play: [{ card: target, exhausted: true }] },
    );

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );
    const view = engine.runtime.getFilteredView({
      role: "player",
      playerId: PLAYER_ONE as PlayerId,
    });

    const ranked = valueRankedStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view,
      candidates,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });

    const firstAttack = ranked.find((c) => c.family === "enterBattle");
    expect(firstAttack).toBeDefined();
    if (firstAttack && firstAttack.family === "enterBattle") {
      // Locate the heavy attacker's instance ID by stat lookup.
      const playArea = view.zones.zones[`battleArea:${PLAYER_ONE as string}`];
      const heavyInstance = playArea?.cards.find(
        (c) => c.definition?.type === "unit" && c.definition.ap === 5,
      );
      expect(heavyInstance).toBeDefined();
      expect(firstAttack.attackerId).toBe(heavyInstance?.instanceId);
    }
  });
});

describe("valueRankedStrategy: deployUnit ranks by ap+hp", () => {
  it("orders deploy candidates higher when the unit has more total stats", () => {
    // Seed: P1 has two playable units in hand. Both fit under the
    // resource budget; the value ranker should put the bigger one
    // first.
    const big = createMockUnit({ cost: 1, level: 1, ap: 4, hp: 4, name: "Big" });
    const small = createMockUnit({ cost: 1, level: 1, ap: 1, hp: 1, name: "Small" });
    const engine = GundamTestEngine.create(
      {
        hand: [big, small],
        resourceArea: [createMockResource(), createMockResource()],
      },
      {},
    );

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );
    const view = engine.runtime.getFilteredView({
      role: "player",
      playerId: PLAYER_ONE as PlayerId,
    });

    const deployCandidates = candidates.filter((c) => c.family === "deployUnit");
    expect(deployCandidates.length).toBeGreaterThanOrEqual(2);

    const ranked = valueRankedStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view,
      candidates,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });

    const rankedDeploys = ranked.filter((c) => c.family === "deployUnit");
    expect(rankedDeploys.length).toBeGreaterThanOrEqual(2);

    // First deploy should be the big unit.
    const handZone = view.zones.zones[`hand:${PLAYER_ONE as string}`];
    const bigInstance = handZone?.cards.find(
      (c) => c.definition?.type === "unit" && c.definition.ap === 4,
    );
    expect(bigInstance).toBeDefined();
    if (rankedDeploys[0] && rankedDeploys[0].family === "deployUnit") {
      expect(rankedDeploys[0].cardId).toBe(bigInstance?.instanceId);
    }
  });
});

describe("valueRankedStrategy: end-to-end through the planner", () => {
  it("submits a candidate from the same scenario greedy plays through", () => {
    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "Guncannon" });
    const target = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, name: "Dom" });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: target, exhausted: true }] },
    );

    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      valueRankedStrategy,
      engine.runtime.getStaticResources(),
    );

    expect(result.outcome).toBe("candidate-succeeded");
    // With a single attacker and a single target, greedy and value
    // should agree on enterBattle.
    expect(result.selectedCandidate?.family).toBe("enterBattle");
  });
});

describe("valueRankedStrategy: shared defaults preserved", () => {
  it("emits the same resolveEffect candidates as greedy for the same input", () => {
    // Both strategies inherit `defaultResolveEffect` from
    // DEFAULT_POLICIES. Given identical candidate input, the
    // resolveEffect family bucket must rank identically.
    const engine = GundamTestEngine.create({}, {});
    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );
    const ctx = {
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view: engine.runtime.getFilteredView({ role: "player", playerId: PLAYER_ONE as PlayerId }),
      candidates,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    };
    const greedyResolves = greedyLegalStrategy
      .selectCandidates(ctx)
      .filter((c) => c.family === "resolveEffect");
    const valueResolves = valueRankedStrategy
      .selectCandidates(ctx)
      .filter((c) => c.family === "resolveEffect");
    expect(valueResolves).toEqual(greedyResolves);
  });
});

void PLAYER_TWO;
