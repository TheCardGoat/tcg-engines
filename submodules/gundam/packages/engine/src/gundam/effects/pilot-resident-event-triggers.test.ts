/**
 * Pilot-resident triggered effects with event-driven timings must fire
 * when the paired unit is the subject of the matching event. Rule
 * 3-3-9-1: text printed on a Pilot card belongs to the pilot, so when
 * the paired unit does X (attacks, is destroyed, pairs) the pilot's
 * triggered effects for that event activate.
 *
 * The observer scan in `enqueueObserverTriggers` iterates every card in
 * battleArea + baseSection on both sides. Because `executePilotPairing`
 * moves the pilot card into battleArea (PR #103), the observer pass
 * already visits pilot cards. These tests lock that in so future
 * refactors of the scan (e.g. switching to a per-cardType partition)
 * don't silently drop pilot observers.
 *
 * Covers:
 *   - `triggered` + `["attack"]` on a pilot fires on attackDeclared of
 *     the paired unit.
 *   - `triggered` + `["duringLink", "attack"]` fires when the host unit
 *     is a Link Unit at attack-declaration.
 *   - Same effect does NOT fire when the host is not a Link Unit
 *     (link-condition unsatisfied).
 */

import { describe, it, expect } from "vite-plus/test";
import type {
  CardEffect,
  EffectCondition,
  EffectTiming,
  PilotCard,
  UnitCard,
} from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "../../index.ts";

// -----------------------------------------------------------------------------
// Fixtures
// -----------------------------------------------------------------------------

function makePilotWithAttackTrigger(
  timing: readonly EffectTiming[],
  name = "Synthetic Test Pilot",
  conditions?: readonly EffectCondition[],
): PilotCard {
  // `statModifier` thisTurn AP+5 on the paired unit (owner: "self" on a
  // pilot source rebinds to the paired unit via selfIdentityCardId — PR
  // #122). Pre-combat snapshot before enterBattle lets us observe the
  // fire via continuousEffects. We use a large amount (5) and a unique
  // duration marker so accidental stacking is obvious.
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: [...timing], ...(conditions ? { conditions: [...conditions] } : {}) },
    directives: [
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: 5,
          duration: "thisTurn",
          target: { owner: "self", cardType: "unit" },
        },
      },
    ],
    sourceText: `【${timing.join("】【")}】AP+5.`,
  };
  return {
    cardNumber: `TEST-P-ATK-${Math.random().toString(36).slice(2, 8)}`,
    name,
    type: "pilot",
    color: "blue",
    traits: [],
    level: 1,
    cost: 1,
    apBonus: 0,
    hpBonus: 0,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  } as PilotCard;
}

function makeHost(linkCondition: string | undefined): UnitCard {
  return createMockUnit({
    ap: 3,
    hp: 5,
    level: 3,
    cost: 2,
    ...(linkCondition ? { linkCondition } : {}),
  } as unknown as Parameters<typeof createMockUnit>[0]) as UnitCard;
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("Pilot-resident triggered effects — event-driven timings", () => {
  it("fires a plain `['attack']` triggered effect when the paired unit attacks", () => {
    const pilot = makePilotWithAttackTrigger(["attack"], "Plain Attack Pilot");
    const host = makeHost("[Plain Attack Pilot]");
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [host, pilot], resourceArea: activeResources(6) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(pilot, host));

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(host, enemyId));
    // The pilot trigger parked an AP+5 thisTurn modifier on the host.
    const modifiers = engine
      .getG()
      .continuousEffects.filter(
        (e) =>
          e.targetId === attackerId &&
          e.payload.kind === "stat-modifier" &&
          e.payload.stat === "ap" &&
          e.payload.modifier === 5,
      );
    expect(modifiers.length).toBeGreaterThanOrEqual(1);
  });

  it("fires an attack trigger with a duringLink condition when the paired unit is a Link Unit", () => {
    const pilot = makePilotWithAttackTrigger(["attack"], "Link Attack Pilot", [
      { type: "duringLink" },
    ]);
    const host = makeHost("[Link Attack Pilot]");
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [host, pilot], resourceArea: activeResources(6) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(pilot, host));

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(host, enemyId));
    const modifiers = engine
      .getG()
      .continuousEffects.filter(
        (e) =>
          e.targetId === attackerId &&
          e.payload.kind === "stat-modifier" &&
          e.payload.stat === "ap" &&
          e.payload.modifier === 5,
      );
    expect(modifiers.length).toBeGreaterThanOrEqual(1);
  });

  it("does NOT fire an attack trigger with a duringLink condition when the paired unit is not a Link Unit", () => {
    // Host's link condition names a DIFFERENT pilot, so pairing the
    // synthetic pilot assigns a pilot but does not satisfy the link
    // condition. The duringLink continuous precondition fails at
    // attackDeclared and the trigger must be filtered out.
    const pilot = makePilotWithAttackTrigger(["attack"], "Unlinked Pilot", [
      { type: "duringLink" },
    ]);
    const host = makeHost("[Some Other Name]");
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [host, pilot], resourceArea: activeResources(6) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(pilot, host));

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(host, enemyId));
    const modifiers = engine
      .getG()
      .continuousEffects.filter(
        (e) =>
          e.targetId === attackerId &&
          e.payload.kind === "stat-modifier" &&
          e.payload.stat === "ap" &&
          e.payload.modifier === 5,
      );
    expect(modifiers.length).toBe(0);
  });
});
