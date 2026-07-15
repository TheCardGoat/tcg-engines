/** Player-visible coverage for attack effects gained from a paired Pilot. */

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
  createMockPilot,
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
  return createMockPilot({
    name,
    apBonus: 0,
    hpBonus: 0,
    effects: [effect],
  });
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
      { play: [host], hand: [pilot], resourceArea: activeResources(1) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.assignPilot(pilot, host));

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(host, enemyId));

    expect(p1.getVisibleCard(attackerId)?.effectiveAp).toBe(8);
  });

  it("fires an attack trigger with a duringLink condition when the paired unit is a Link Unit", () => {
    const pilot = makePilotWithAttackTrigger(["attack"], "Link Attack Pilot", [
      { type: "duringLink" },
    ]);
    const host = makeHost("[Link Attack Pilot]");
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [host], hand: [pilot], resourceArea: activeResources(1) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.assignPilot(pilot, host));

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(host, enemyId));

    expect(p1.getVisibleCard(attackerId)?.effectiveAp).toBe(8);
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
      { play: [host], hand: [pilot], resourceArea: activeResources(1) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.assignPilot(pilot, host));

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(host, enemyId));

    expect(p1.getVisibleCard(attackerId)?.effectiveAp).toBe(3);
  });
});
