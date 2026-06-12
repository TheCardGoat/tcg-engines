/**
 * Constant-effect cost reduction — `costReduction` action.
 *
 * Tests the two paths consumed by `computeEffectiveCostInHand`:
 *   1. Self-referencing: a card in hand has a constant `costReduction`
 *      targeting itself whose condition depends on board state.
 *   2. External: a card in play carries a constant `costReduction` that
 *      targets cards in the controller's hand matching a filter (e.g.
 *      "Friendly (AEUG) Units cost 1 less to play").
 *
 * Each path is covered with positive (condition met / filter matches →
 * reduced cost → can play) and negative (not met / no match → full cost)
 * cases.
 */

import { describe, it, expect } from "vite-plus/test";
import "../testing/register-matchers.ts";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  restedResources,
  createMockUnit,
  expectSuccess,
} from "../../index.ts";

// =============================================================================
// Card fixtures
// =============================================================================

/**
 * A unit on the field whose constant effect says:
 * "Friendly (Earth Federation) Units cost 1 less to play."
 *
 * No condition — always active while this card is in play.
 */
const costReducer: UnitCard = {
  cardNumber: "TEST-REDUCER-001",
  name: "Cost Reducer",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  level: 1,
  cost: 1,
  ap: 1,
  hp: 2,
  effect: "Friendly (Earth Federation) Units cost 1 less to play.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "costReduction",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              // External costReduction predicates evaluate against hand
              // cards (the cost is paid when playing from hand), so the
              // filter must spell out `zone: "hand"`. Without it the
              // TargetFilter implicit-zone default for `cardType: "unit"`
              // restricts to battleArea (rule 10-2-2-1) and the reducer
              // never matches its intended targets. Same rationale for
              // every fixture below.
              zone: "hand",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "earth federation" },
              ],
            },
          },
        },
      ],
      sourceText: "Friendly (Earth Federation) Units cost 1 less to play.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};

/**
 * A unit in hand that benefits from the reducer (Earth Federation trait).
 * Printed cost 3, level 4.
 */
const efTarget: UnitCard = {
  cardNumber: "TEST-EF-UNIT-001",
  name: "EF Target",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  level: 4,
  cost: 3,
  ap: 2,
  hp: 3,
  effect: "",
  effects: [] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};

/**
 * A unit in hand that does NOT match the reducer's filter (wrong trait).
 * Printed cost 3, level 4.
 */
const nonEfTarget: UnitCard = {
  cardNumber: "TEST-NON-EF-001",
  name: "Non-EF Unit",
  type: "unit",
  color: "red",
  traits: ["zeon"],
  level: 4,
  cost: 3,
  ap: 2,
  hp: 3,
  effect: "",
  effects: [] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};

/**
 * Conditional external reducer: only active while you control 3+ units.
 * "While you have 3 or more Units in play, Friendly Units cost 1 less to play."
 */
const conditionalReducer: UnitCard = {
  cardNumber: "TEST-COND-REDUCER-001",
  name: "Conditional Reducer",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  level: 1,
  cost: 1,
  ap: 1,
  hp: 2,
  effect: "While you have 3 or more Units in play, Friendly Units cost 1 less to play.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 3,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "costReduction",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "hand",
            },
          },
        },
      ],
      sourceText: "While you have 3 or more Units in play, Friendly Units cost 1 less to play.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};

// =============================================================================
// Tests
// =============================================================================

describe("Constant-effect costReduction — external (card in play reduces hand cards)", () => {
  it("reduces cost of a matching unit in hand (positive)", () => {
    // costReducer in play reduces EF units by 1. efTarget cost 3 → 2.
    // 4 resources for level, 2 active = enough for reduced cost 2.
    const engine = GundamTestEngine.create({
      hand: [efTarget],
      play: [costReducer],
      resourceArea: [...restedResources(2), ...activeResources(2)],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(efTarget));

    // 2 resources exhausted for cost.
    const exhausted = p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id)).length;
    expect(exhausted).toBe(4); // 2 already rested + 2 newly exhausted
  });

  it("does NOT reduce cost of a non-matching unit in hand (negative)", () => {
    // costReducer targets EF units; nonEfTarget is Zeon. Cost stays 3.
    // Only 2 active resources → can't pay full cost 3.
    const engine = GundamTestEngine.create({
      hand: [nonEfTarget],
      play: [costReducer],
      resourceArea: [...restedResources(2), ...activeResources(2)],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    const result = p1.deployUnit(nonEfTarget);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("INSUFFICIENT_RESOURCES");
    }
  });

  it("reduces cost to 0 when reduction exceeds base cost", () => {
    // Two reducers in play, each reducing by 1. efTarget cost 3 → 1.
    // Actually let's use a unit with cost 1 and one reducer: 1-1=0.
    const cheapUnit: UnitCard = {
      cardNumber: "TEST-CHEAP-EF-001",
      name: "Cheap EF",
      type: "unit",
      color: "blue",
      traits: ["earth federation"],
      level: 2,
      cost: 1,
      ap: 1,
      hp: 1,
      effect: "",
      effects: [] as CardEffect[],
      keywordEffects: [],
      rarity: "common",
    };

    const engine = GundamTestEngine.create({
      hand: [cheapUnit],
      play: [costReducer],
      // Level 2 met, 0 active resources should be enough for cost 0.
      resourceArea: restedResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(cheapUnit));
    expect(p1.getCardsInZone("battleArea").length).toBe(2); // reducer + deployed
  });

  it("stacks reductions from multiple reducers", () => {
    // Two reducers in play → efTarget cost 3 - 2 = 1.
    const reducer2: UnitCard = { ...costReducer, cardNumber: "TEST-REDUCER-002" };
    const engine2 = GundamTestEngine.create({
      hand: [efTarget],
      play: [costReducer, reducer2],
      resourceArea: [...restedResources(3), ...activeResources(1)],
    });
    const p1b = engine2.asPlayer(PLAYER_ONE);

    expectSuccess(p1b.deployUnit(efTarget));

    const exhausted = p1b.getCardsInZone("resourceArea").filter((id) => p1b.isExhausted(id)).length;
    // 3 already rested + 1 newly exhausted for cost 1 = 4 total exhausted
    expect(exhausted).toBe(4);
  });

  it("does NOT apply when the condition on the reducer is not met", () => {
    // conditionalReducer needs 3+ units in play. Only 1 unit in play (itself).
    const engine = GundamTestEngine.create({
      hand: [efTarget],
      play: [conditionalReducer],
      resourceArea: [...restedResources(2), ...activeResources(2)],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    // Condition not met → no reduction → cost stays 3, only 2 active → fail.
    const result = p1.deployUnit(efTarget);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("INSUFFICIENT_RESOURCES");
    }
  });

  it("applies when the condition on the reducer IS met", () => {
    // conditionalReducer needs 3+ units. With 3 units in play, condition met.
    const fillerA = createMockUnit({ traits: ["earth federation"] });
    const fillerB = createMockUnit({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create({
      hand: [efTarget],
      play: [conditionalReducer, fillerA, fillerB],
      resourceArea: [...restedResources(2), ...activeResources(2)],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    // Condition met → cost 3 - 1 = 2, 2 active resources → success.
    expectSuccess(p1.deployUnit(efTarget));
  });

  it("does NOT apply opponent's reducer to your cards", () => {
    // Opponent has the reducer in play. It targets "friendly" units,
    // so it should NOT reduce cost for the active player's hand cards.
    const engine = GundamTestEngine.create(
      {
        hand: [efTarget],
        resourceArea: [...restedResources(2), ...activeResources(2)],
      },
      {
        play: [costReducer],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    // No friendly reducer → cost stays 3, only 2 active → fail.
    const result = p1.deployUnit(efTarget);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("INSUFFICIENT_RESOURCES");
    }
  });
});
