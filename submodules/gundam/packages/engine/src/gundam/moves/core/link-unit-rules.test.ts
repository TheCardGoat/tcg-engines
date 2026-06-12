/**
 * Link Unit rules — 3-2-6 + 10-1-6 (WhenLinked trigger gating).
 *
 * Regression tests for the two bugs uncovered by manual rule review:
 *   Bug 1 — `【When Linked】` triggers fired even when the pairing did
 *           not satisfy the unit's link condition. The pilotPaired event
 *           now carries `isLink` and `enqueueOwnCardTriggers` gates
 *           `whenLinked` on it.
 *   Bug 2 — units with no printed `linkCondition` were being treated as
 *           Link Units (granting them rule-3-2-6-3 attack-on-deploy).
 *           `satisfiesLinkCondition` now returns false in that case.
 *
 * The previously-present "Rush" keyword branch in `canAttack` has been
 * removed — Rush is not a keyword in this game.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  createMockPilot,
  createMockResource,
} from "../../index.ts";
import type { TestCardEntry } from "../../testing/test-engine.ts";

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => ({
    card: createMockResource(),
    exhausted: false,
  }));
}

const whenLinkedDraw: CardEffect = {
  type: "triggered",
  activation: { timing: ["whenLinked"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "【When Linked】 Draw 1.",
};

describe("【When Linked】 trigger gating (rule 3-2-6-2)", () => {
  it("fires when the paired pilot satisfies the unit's link condition", () => {
    const unit = createMockUnit({
      level: 1,
      cost: 1,
      effects: [whenLinkedDraw],
      linkCondition: "[Amuro Ray]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const pilot = createMockPilot({ name: "Amuro Ray", level: 1, cost: 1 });

    const engine = GundamTestEngine.create(
      { hand: [unit, pilot], resourceArea: resources(5), deck: 10 },
      {},
    );
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(pilot, unit));

    // Trigger auto-drained from the transition check.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before - 1);
  });

  it("does NOT fire when the paired pilot fails the link condition", () => {
    const unit = createMockUnit({
      level: 1,
      cost: 1,
      effects: [whenLinkedDraw],
      linkCondition: "[Amuro Ray]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const pilot = createMockPilot({ name: "Heero Yuy", level: 1, cost: 1 });

    const engine = GundamTestEngine.create(
      { hand: [unit, pilot], resourceArea: resources(5), deck: 10 },
      {},
    );
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(pilot, unit));

    // Pilot satisfies whenPaired timing generally but NOT whenLinked —
    // no draw should happen (non-link pairing).
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before);
  });
});

describe("Link-Unit attack-on-deploy gating (rule 3-2-6-3)", () => {
  it("unit with no linkCondition cannot attack the turn it's deployed even when paired", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const pilot = createMockPilot({ name: "Any Pilot", level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 3 });

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

  it("unit with explicit linkCondition satisfied by pilot CAN attack the deploy turn", () => {
    const unit = createMockUnit({
      level: 1,
      cost: 1,
      linkCondition: "[Amuro Ray]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const pilot = createMockPilot({ name: "Amuro Ray", level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 3 });

    const engine = GundamTestEngine.create(
      { hand: [unit, pilot], resourceArea: resources(5) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(pilot, unit));

    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(unit, enemyId));
  });
});
