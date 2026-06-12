/**
 * deploy-unit — Rule compliance tests
 *
 * Covers the remediation of 5 rule gaps identified in the deploy-unit move:
 *
 *   Gap 5 (minor):   G.exhausted[cardId] cleared on deploy
 *   Gap 2 (high):    satisfiesLinkCondition — link condition evaluation
 *   Gap 1 (high):    Link Unit can attack on the turn it is deployed (rule 3-2-6-3)
 *   Gap 3 (medium):  【Deploy】 triggered effects on other in-play cards fire (rule 10-1-6-1)
 */

import { describe, it, expect } from "vite-plus/test";
import "../../testing/register-matchers.ts";
import type { CardEffect, Card, UnitCard, PilotCard } from "@tcg/gundam-types";
import type { CardReadAPI } from "../../../types/move-types.ts";
import type { PlayerId } from "../../../types/branded.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  createMockPilot,
  createMockResource,
  satisfiesLinkCondition,
} from "../../../index.ts";
import type { TestCardEntry } from "../../../index.ts";

function active(card: ReturnType<typeof createMockResource>): TestCardEntry {
  return { card, exhausted: false };
}

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => active(createMockResource()));
}

/** Build a minimal CardReadAPI stub backed by an in-memory card map. */
function makeCardsStub(cardMap: Map<string, Card>): CardReadAPI {
  return {
    getDefinition: (id: string) => cardMap.get(id),
  } as unknown as CardReadAPI;
}

// =============================================================================
// Gap 5 — G.exhausted cleared on deploy
// =============================================================================

describe("Gap 5 — G.exhausted cleared on deploy", () => {
  it("newly deployed unit has G.exhausted set to false", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(3) }, {});

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));

    // Retrieve the instance ID via the runtime
    const instanceId = engine
      .getRuntime()
      .getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;

    // G.exhausted must be explicitly false after deploy
    expect(engine.getG().exhausted[instanceId]).toBe(false);
  });

  it("stale G.exhausted entry is cleared when unit is deployed", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(3) }, {});

    // Pre-poison the G.exhausted entry before deploying
    const instanceId = engine
      .getRuntime()
      .getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;
    engine.getG().exhausted[instanceId] = true;

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));

    expect(engine.getG().exhausted[instanceId]).toBe(false);
  });
});

// =============================================================================
// Gap 2 — satisfiesLinkCondition
// =============================================================================

describe("Gap 2 — satisfiesLinkCondition (rules 3-2-6-1, 3-2-6-2, 3-2-6-4)", () => {
  function setup(unit: UnitCard, pilot: PilotCard) {
    const cards = makeCardsStub(
      new Map<string, Card>([
        ["unit-id", unit],
        ["pilot-id", pilot],
      ]),
    );
    return { cards };
  }

  it("returns false when unit has no link condition (rule 3-2-6-1/2)", () => {
    // A Unit printed without a link condition is never a Link Unit —
    // pairing any pilot with it does not make it satisfy link rules.
    const unit = createMockUnit(); // no linkCondition
    const pilot = createMockPilot({ name: "Any Pilot" });
    const { cards } = setup(unit, pilot);

    expect(satisfiesLinkCondition("pilot-id", "unit-id", cards)).toBe(false);
  });

  it("returns true when pilot name contains the bracketed requirement", () => {
    const unit = createMockUnit({ linkCondition: "[Garrod Ran]" });
    const pilot = createMockPilot({ name: "Garrod Ran & Tiffa Adill" });
    const { cards } = setup(unit, pilot);

    expect(satisfiesLinkCondition("pilot-id", "unit-id", cards)).toBe(true);
  });

  it("returns false when pilot name does not contain the requirement", () => {
    const unit = createMockUnit({ linkCondition: "[Garrod Ran]" });
    const pilot = createMockPilot({ name: "Heero Yuy" });
    const { cards } = setup(unit, pilot);

    expect(satisfiesLinkCondition("pilot-id", "unit-id", cards)).toBe(false);
  });

  it("is case-insensitive", () => {
    const unit = createMockUnit({ linkCondition: "[garrod ran]" });
    const pilot = createMockPilot({ name: "Garrod Ran" });
    const { cards } = setup(unit, pilot);

    expect(satisfiesLinkCondition("pilot-id", "unit-id", cards)).toBe(true);
  });

  it("checks alternate names when primary name does not match", () => {
    const unit = createMockUnit({ linkCondition: "[Amuro Ray]" });
    const pilot = createMockPilot({
      name: "Amuro (NewType)",
      alternateNames: ["Amuro Ray"],
    });
    const { cards } = setup(unit, pilot);

    expect(satisfiesLinkCondition("pilot-id", "unit-id", cards)).toBe(true);
  });

  it("returns false for malformed link condition (no brackets)", () => {
    const unit = createMockUnit({ linkCondition: "Garrod Ran" }); // missing brackets
    const pilot = createMockPilot({ name: "Garrod Ran" });
    const { cards } = setup(unit, pilot);

    expect(satisfiesLinkCondition("pilot-id", "unit-id", cards)).toBe(false);
  });
});

// =============================================================================
// Gap 1 — Link Unit attack exception (rule 3-2-6-3)
// =============================================================================

describe("Gap 1 — Link Unit can attack turn deployed (rule 3-2-6-3)", () => {
  it("non-link unit deployed this turn cannot attack", () => {
    const unit = createMockUnit({ level: 1, cost: 1 }); // no link condition, no pilot
    const enemy = createMockUnit({ level: 1, cost: 1 });

    const engine = GundamTestEngine.create(
      { hand: [unit], resourceArea: resources(3) },
      { play: [enemy] },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(unit));

    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectFailure(p1.enterBattle(unit, enemyId));
  });

  it("Link Unit deployed this turn can attack immediately", () => {
    const pilot = createMockPilot({ name: "Test Pilot", level: 1, cost: 1 });
    const unit = createMockUnit({
      level: 1,
      cost: 1,
      linkCondition: "[Test Pilot]",
    });
    const enemy = createMockUnit({ level: 1, cost: 1 });

    const engine = GundamTestEngine.create(
      { hand: [unit, pilot], resourceArea: resources(5) },
      { play: [enemy] },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(pilot, unit));

    // Pilot satisfies the link condition → Link Unit → can attack this turn
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(unit, enemyId));
  });

  it("non-matching pilot does not grant the Link Unit attack exception", () => {
    const pilot = createMockPilot({ name: "Wrong Pilot", level: 1, cost: 1 });
    const unit = createMockUnit({
      level: 1,
      cost: 1,
      linkCondition: "[Correct Pilot]",
    });
    const enemy = createMockUnit({ level: 1, cost: 1 });

    const engine = GundamTestEngine.create(
      { hand: [unit, pilot], resourceArea: resources(5) },
      { play: [enemy] },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(unit));
    // Pairing succeeds, but the pilot does NOT satisfy the link condition
    expectSuccess(p1.assignPilot(pilot, unit));

    // Unit is paired but NOT a Link Unit — cannot attack this turn
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectFailure(p1.enterBattle(unit, enemyId));
  });

  it("unit with no link condition is NEVER a Link Unit even when paired (rule 3-2-6-1/2)", () => {
    // A Unit printed without a link condition can never become a Link
    // Unit — it still cannot attack the turn it's deployed even if a
    // Pilot is paired with it (rule 3-2-4).
    const pilot = createMockPilot({ name: "Any Pilot", level: 1, cost: 1 });
    const unit = createMockUnit({ level: 1, cost: 1 }); // no linkCondition
    const enemy = createMockUnit({ level: 1, cost: 1 });

    const engine = GundamTestEngine.create(
      { hand: [unit, pilot], resourceArea: resources(5) },
      { play: [enemy] },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(pilot, unit));

    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectFailure(p1.enterBattle(unit, enemyId), "CANNOT_ATTACK");
  });
});

// =============================================================================
// Gap 3 — Field-wide 【Deploy】 observer triggers (rule 10-1-6-1)
// =============================================================================

describe("Gap 3 — Observer 【Deploy】 triggers fire on other in-play cards (rule 10-1-6-1)", () => {
  it("in-play card with 【Deploy】 trigger draws a card when a unit is deployed", () => {
    const deployTriggerEffect: CardEffect = {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "【Deploy】 Draw 1.",
    };
    const observer = createMockUnit({
      level: 1,
      cost: 1,
      effects: [deployTriggerEffect],
    });
    const incoming = createMockUnit({ level: 1, cost: 1 });

    const engine = GundamTestEngine.create(
      {
        hand: [incoming],
        play: [observer],
        resourceArea: resources(3),
        deck: 5,
      },
      {},
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    // Measure by deck size: observer draws 1 card from deck to hand
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    expectSuccess(p1.deployUnit(incoming));

    // Observer's 【Deploy】 fired → deck decreased by 1
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });

  it("deployed card's own 【Deploy】 effect fires exactly once (not double-fired)", () => {
    const selfDeployEffect: CardEffect = {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "【Deploy】 Draw 1.",
    };
    const unit = createMockUnit({
      level: 1,
      cost: 1,
      effects: [selfDeployEffect],
    });

    const engine = GundamTestEngine.create(
      { hand: [unit], resourceArea: resources(3), deck: 5 },
      {},
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    // Measure by deck size: unit's own Deploy trigger should draw exactly 1 card
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    expectSuccess(p1.deployUnit(unit));

    // Self-trigger fires once; field scan skips the deployed card → exactly 1 draw = 1 deck decrease
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });

  it("opponent's in-play card with 【Deploy】 trigger fires when active player deploys", () => {
    const opponentTriggerEffect: CardEffect = {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "【Deploy】 Draw 1.",
    };
    const opponentObserver = createMockUnit({
      level: 1,
      cost: 1,
      effects: [opponentTriggerEffect],
    });
    const incoming = createMockUnit({ level: 1, cost: 1 });

    const engine = GundamTestEngine.create(
      { hand: [incoming], resourceArea: resources(3) },
      { play: [opponentObserver], deck: 5 },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const p2HandBefore = p2.getHand().length;

    expectSuccess(p1.deployUnit(incoming));

    // Opponent's observer 【Deploy】 effect draws for the opponent
    expect(p2.getHand().length).toBe(p2HandBefore + 1);
  });
});
