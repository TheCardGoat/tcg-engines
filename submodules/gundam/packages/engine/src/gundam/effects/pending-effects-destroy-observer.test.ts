/** Player-visible coverage for Destroyed ownership and qualification. */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../index.ts";

// -----------------------------------------------------------------------------
// Fixtures
// -----------------------------------------------------------------------------

/**
 * Unit with a plain 【Destroyed】 effect. Its harmless draw makes it easy
 * to prove that another card's destruction does not activate it.
 */
function makeDestroyedAbilityUnit(): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: ["destroyed"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【Destroyed】Draw 1.",
  };
  return {
    cardNumber: `TEST-OBS-DESTROY-${Math.random().toString(36).slice(2, 8)}`,
    name: "Observer On Destroy",
    type: "unit",
    canonicalId: "mock",
    slug: "mock",
    printings: [],
    traits: [],
    level: 1,
    cost: 1,
    ap: 1,
    hp: 1,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

/**
 * Self-destroy unit with a `【Destroyed】` trigger gated by an
 * `activation.qualification` that inspects the destroyed unit's own
 * `level`. Shape mirrors GD02-003 Gundam Mk-II (Titans) qualification
 * but with a draw directive so the test remains harness-local.
 */
function makeQualifiedOnDestroyUnit(maxLevel: number, ownLevel: number): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: {
      timing: ["destroyed"],
      qualification: { attribute: "level", comparison: "lte", value: maxLevel },
    },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: `【Destroyed】(if Lv≤${maxLevel}) Draw 1.`,
  };
  return {
    cardNumber: `TEST-QUAL-DESTROY-${Math.random().toString(36).slice(2, 8)}`,
    name: "Qualified Destroy Unit",
    type: "unit",
    canonicalId: "mock",
    slug: "mock",
    printings: [],
    traits: [],
    level: ownLevel,
    cost: 1,
    ap: 1,
    hp: 1,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

/**
 * Destroyed ability whose qualification describes the paired Pilot rather
 * than the dying Unit. This is the interaction printed on GD02-056.
 */
function makePilotQualifiedOnDestroyUnit(requiredTrait: string): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: {
      timing: ["destroyed"],
      qualification: { attribute: "trait", comparison: "includes", value: requiredTrait },
      conditions: [{ type: "duringPair" }],
    },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: `【During Pair·(${requiredTrait}) Pilot】【Destroyed】Draw 1.`,
  };
  return {
    cardNumber: `TEST-PILOT-QUAL-DESTROY-${requiredTrait}`,
    name: "Pilot-Qualified Destroy Unit",
    type: "unit",
    canonicalId: "mock",
    slug: "mock",
    printings: [],
    traits: [],
    level: 1,
    cost: 1,
    ap: 1,
    hp: 1,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

function destroyPairedUnitInCombat(pilotTraits: string[]) {
  const unit = makePilotQualifiedOnDestroyUnit("vulture");
  const pilot = createMockPilot({
    name: "Paired Pilot",
    traits: pilotTraits,
    level: 0,
    cost: 0,
  });
  const attacker = createMockUnit({ name: "Destroying Unit", ap: 5, hp: 5 });
  const engine = GundamTestEngine.create(
    {
      hand: [pilot],
      play: [{ card: unit, exhausted: true }],
      resourceArea: activeResources(1),
      deck: 5,
    },
    { play: [attacker], deck: 5 },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const unitId = p1.getCardsInZone("battleArea")[0]!;
  const attackerId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p1.assignPilot(pilot, unitId));
  expectSuccess(p1.passPhase());
  expectSuccess(p2.passActionStep());
  expectSuccess(p1.passActionStep());
  expectSuccess(p2.enterBattle(attackerId, unitId));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());

  return { p1, unitId };
}

describe("Destroyed qualification", () => {
  it("draws when the destroyed Unit itself satisfies the printed qualification", () => {
    const unitDef = makeQualifiedOnDestroyUnit(3, 2);
    const attacker = createMockUnit({ ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [{ card: unitDef, exhausted: true }], deck: 5 },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, unitId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardsInZone("trash")).toContain(unitId);
    expect(p1.getCardsInZone("deck")).toHaveLength(4);
    expect(p1.getHand()).toHaveLength(1);
  });

  it("does not draw when the destroyed Unit fails the printed qualification", () => {
    const unitDef = makeQualifiedOnDestroyUnit(3, 5);
    const attacker = createMockUnit({ ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [{ card: unitDef, exhausted: true }], deck: 5 },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, unitId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardsInZone("trash")).toContain(unitId);
    expect(p1.getCardsInZone("deck")).toHaveLength(5);
    expect(p1.getHand()).toHaveLength(0);
  });

  it("draws when the destroyed Unit was paired with a qualifying Pilot", () => {
    const { p1, unitId } = destroyPairedUnitInCombat(["vulture"]);

    expect(p1.getCardsInZone("trash")).toContain(unitId);
    expect(p1.getCardsInZone("deck")).toHaveLength(4);
    expect(p1.getHand()).toHaveLength(1);
  });

  it("does not draw when the paired Pilot lacks the printed qualification", () => {
    const { p1, unitId } = destroyPairedUnitInCombat(["earth federation"]);

    expect(p1.getCardsInZone("trash")).toContain(unitId);
    expect(p1.getCardsInZone("deck")).toHaveLength(5);
    expect(p1.getHand()).toHaveLength(0);
  });
});

// -----------------------------------------------------------------------------
// End-to-end: a Destroyed keyword belongs only to the destroyed card
// -----------------------------------------------------------------------------

describe("Destroyed keyword ownership", () => {
  it("does not activate an in-play card's 【Destroyed】 ability when another Unit dies", () => {
    const survivor = makeDestroyedAbilityUnit();
    const attacker = createMockUnit({ ap: 5, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 1 });

    const engine = GundamTestEngine.create(
      { play: [attacker, survivor], deck: 5 },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(attackerId!, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("trash")).toContain(defenderId);
    expect(p1.getCardsInZone("deck")).toHaveLength(5);
    expect(p1.getHand()).toHaveLength(0);
  });
});
