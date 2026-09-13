/**
 * Spec → tests: ../specs/13-keywords.md (fluent API + public game logs)
 * Full keyword matrix also covered by keyword-*.real-cards.test.ts
 */

import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectCard,
  expectPlayer,
  expectFailure,
  resolveBattle,
  endTurn,
  expectPublicLog,
  expectLogType,
  getLogsOfType,
} from "../../index.ts";
import { st01Gundam001 } from "../../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { gd01SaylaMass087 } from "../../../../../cards/src/cards/gd01/pilot/087-sayla-mass.ts";
import { gd05AbyssGundam040 } from "../../../../../cards/src/cards/gd05/unit/040-abyss-gundam.ts";
import { st10MobileWorkerTekkadan010 } from "../../../../../cards/src/cards/st10/unit/010-mobile-worker-tekkadan.ts";
import { eb01GquuuuuuxOmegaPsycommu024 } from "../../../../../cards/src/cards/eb01/unit/024-gquuuuuux-omega-psycommu.ts";
import { gd01WingGundamZero024 } from "../../../../../cards/src/cards/gd01/unit/024-wing-gundam-zero.ts";
import { gd05DestinyGundam055 } from "../../../../../cards/src/cards/gd05/unit/055-destiny-gundam.ts";
import { eb01PsychoZakuEx045 } from "../../../../../cards/src/cards/eb01/unit/045-psycho-zaku-ex.ts";
import { st10ZetaGundam002 } from "../../../../../cards/src/cards/st10/unit/002-zeta-gundam.ts";

function damageCommand(amount: number) {
  return createMockCommand({
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount,
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【Main】Deal ${amount} damage to one friendly Unit.`,
      },
    ],
  });
}

describe("Section 13 — Keyword effects (specs/13-keywords.md)", () => {
  it("13-1-1: <Repair> recovers HP at the end of its controller's turn", () => {
    const damage = damageCommand(1);
    const engine = GundamTestEngine.create(
      { hand: [damage], play: [st01Gundam001], deck: 5 },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.playCommand(damage);
    p1.must.resolveTargets(st01Gundam001);
    expectCard(p1, st01Gundam001).toHaveDamage(1);
    expectPublicLog(engine, "gundam.move.playCommand", { playerId: PLAYER_ONE });
    expectLogType(engine, "gundam.combat.damageDealt", { min: 1 });

    endTurn(engine);
    expectCard(p1, st01Gundam001).toHaveDamage(0);
    // Repair 2 on 1 damage recovers 1 (cannot go past full HP) — public to both players.
    expectPublicLog(engine, "gundam.effect.hpRecovered", { amount: 1 });
  });

  it("13-1-1-2: granted Repair stacks with printed Repair", () => {
    const damage = damageCommand(4);
    const engine = GundamTestEngine.create(
      {
        hand: [gd01SaylaMass087, damage],
        play: [st01Gundam001],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.assignPilot(gd01SaylaMass087, st01Gundam001);
    expectPublicLog(engine, "gundam.move.assignPilot", { playerId: PLAYER_ONE });
    p1.must.playCommand(damage);
    p1.must.resolveTargets(st01Gundam001);
    endTurn(engine);
    // Repair 2 + granted 1 = 3 → 4 damage becomes 1
    expectCard(p1, st01Gundam001).toHaveDamage(1);
    expectPublicLog(engine, "gundam.effect.hpRecovered", { amount: 3 });
  });

  it("13-1-2: <Breach> damages the enemy Base after destroying a Unit", () => {
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const mockBase = createMockBase({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [eb01GquuuuuuxOmegaPsycommu024] },
      {
        play: [{ card: defender, exhausted: true }],
        baseSection: [mockBase],
        shieldArea: [st10MobileWorkerTekkadan010],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    resolveBattle(engine, eb01GquuuuuuxOmegaPsycommu024, defender);
    expectCard(p2, defender).toBeIn("trash");
    const baseId = p2.cardIn("baseSection", mockBase).instanceId;
    expect(p2.getDamage(baseId)).toBeGreaterThan(0);
    expectPlayer(p2).toHaveShieldCount(1);

    // Combat + destruction are public; Breach base damage is public combat damage.
    expectPublicLog(engine, "gundam.move.attackDeclared", {
      attackerPlayerId: PLAYER_ONE,
      attackerId: p1.unit(eb01GquuuuuuxOmegaPsycommu024).instanceId,
    });
    expectLogType(engine, "gundam.combat.unitDefeated", { min: 1 });
    expectPublicLog(engine, "gundam.combat.unitDefeated", {
      cardId: p2.cardIn("trash", defender).instanceId,
      ownerId: PLAYER_TWO,
    });
    // At least defender combat damage + Breach to base.
    expectLogType(engine, "gundam.combat.damageDealt", { min: 2 });
    const baseDamageLogs = getLogsOfType(engine, "gundam.combat.damageDealt").filter(
      ({ typed }) => typed.type === "gundam.combat.damageDealt" && typed.values.cardId === baseId,
    );
    expect(baseDamageLogs.length).toBeGreaterThanOrEqual(1);
    expectLogType(engine, "gundam.combat.resolved", { min: 1 });
  });

  it("13-1-3: <Support> rests source, buffs other friendly Unit, rejects self", () => {
    const engine = GundamTestEngine.create({
      play: [gd05AbyssGundam040, st10MobileWorkerTekkadan010],
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectFailure(p1.useSupport(gd05AbyssGundam040, gd05AbyssGundam040), "ILLEGAL_TARGET");
    p1.must.useSupport(gd05AbyssGundam040, st10MobileWorkerTekkadan010);
    expectCard(p1, gd05AbyssGundam040).toBeRested();
    expectCard(p1, st10MobileWorkerTekkadan010).toHaveAp(st10MobileWorkerTekkadan010.ap + 2);

    // Support is an activated ability: public activate + temporary AP mod.
    // Resting the source is a cost (state change) without a separate exhausted log.
    expectPublicLog(engine, "gundam.move.activateAbility", { playerId: PLAYER_ONE });
    expectPublicLog(engine, "gundam.effect.statModified", {
      cardId: p1.unit(st10MobileWorkerTekkadan010).instanceId,
      stat: "ap",
      amount: 2,
    });
  });

  it("13-1-4: <Blocker> redirects a direct attack", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { play: [st10MobileWorkerTekkadan010] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    p1.must.attack(st01Gundam001).into("direct");
    p2.must.declareBlock(st10MobileWorkerTekkadan010);
    expectCard(p2, st10MobileWorkerTekkadan010).toBeRested();

    expectPublicLog(engine, "gundam.move.attackDeclared", {
      attackerPlayerId: PLAYER_ONE,
      targetId: "direct",
    });
    expectPublicLog(engine, "gundam.move.blockDeclared", {
      blockerPlayerId: PLAYER_TWO,
      blockerId: p2.unit(st10MobileWorkerTekkadan010).instanceId,
      attackerId: p1.unit(st01Gundam001).instanceId,
    });
    // Blocker rest is part of declareBlock (no separate exhausted effect log).
  });

  it("13-1-5: <First Strike> deals damage first", () => {
    const defender = createMockUnit({ ap: 10, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd05DestinyGundam055] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.unit(gd05DestinyGundam055).instanceId;
    resolveBattle(engine, gd05DestinyGundam055, defender);
    expectCard(p2, defender).toBeIn("trash");
    expectCard(p1, gd05DestinyGundam055).toHaveDamage(0);

    expectPublicLog(engine, "gundam.move.attackDeclared", {
      attackerPlayerId: PLAYER_ONE,
      attackerId,
    });
    // First Strike: defender is defeated; attacker never receives return damage.
    expectLogType(engine, "gundam.combat.unitDefeated", { min: 1 });
    expectPublicLog(engine, "gundam.combat.unitDefeated", {
      ownerId: PLAYER_TWO,
    });
    const damageToAttacker = getLogsOfType(engine, "gundam.combat.damageDealt").filter(
      ({ typed }) =>
        typed.type === "gundam.combat.damageDealt" && typed.values.cardId === attackerId,
    );
    expect(damageToAttacker).toHaveLength(0);
    expectLogType(engine, "gundam.combat.resolved", { min: 1 });
  });

  it("13-1-6: <High-Maneuver> prevents Blocker", () => {
    const engine = GundamTestEngine.create(
      { play: [gd01WingGundamZero024] },
      { play: [st10MobileWorkerTekkadan010] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    p1.must.attack(gd01WingGundamZero024).into("direct");
    expectFailure(p2.declareBlock(st10MobileWorkerTekkadan010), "CANNOT_BLOCK_HIGH_MANEUVER");

    // Attack is public; failed block must not emit a blockDeclared success log.
    expectPublicLog(engine, "gundam.move.attackDeclared", {
      attackerPlayerId: PLAYER_ONE,
      targetId: "direct",
    });
    expectLogType(engine, "gundam.move.blockDeclared", { count: 0 });
  });

  it("13-1-7: <Suppression> destroys the first two Shields", () => {
    const engine = GundamTestEngine.create(
      { play: [eb01PsychoZakuEx045] },
      {
        shieldArea: [
          st10MobileWorkerTekkadan010,
          st10MobileWorkerTekkadan010,
          st10MobileWorkerTekkadan010,
        ],
      },
    );
    resolveBattle(engine, eb01PsychoZakuEx045, "direct");
    expectPlayer(engine.asPlayer(PLAYER_TWO)).toHaveShieldCount(1).toHaveZoneCount("trash", 2);

    expectPublicLog(engine, "gundam.move.attackDeclared", {
      attackerPlayerId: PLAYER_ONE,
      targetId: "direct",
    });
    // Two shields destroyed by Suppression — each public.
    expectLogType(engine, "gundam.combat.shieldRemoved", { count: 2 });
    expectLogType(engine, "gundam.combat.resolved", { min: 1 });
  });

  it("13-1-8: <Development> optional exile gates the follow-up effect", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [st10ZetaGundam002],
        trash: [st10ZetaGundam002, st10ZetaGundam002],
        resourceArea: activeResources(5),
      },
      { play: [st10MobileWorkerTekkadan010] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    // Multiple identical trash copies — use instance ids
    const trashIds = p1.getCardsInZone("trash");

    p1.must.deployUnit(st10ZetaGundam002);
    expectPublicLog(engine, "gundam.move.deployUnit", {
      playerId: PLAYER_ONE,
      cost: st10ZetaGundam002.cost,
    });

    const development = p1.getBoardView().pendingChoice;
    if (
      development?.kind !== "targetSelection" ||
      development.optionalDirectiveIndex === undefined
    ) {
      throw new Error("Expected optional Development exile");
    }
    // Optional Development prompt is queued publicly (system), not private.
    expectLogType(engine, "gundam.pending.enqueued", { min: 1 });

    p1.must.resolveEffect({
      optionalAnswers: { [development.optionalDirectiveIndex]: true },
      targets: trashIds,
    });
    p1.must.resolveTargets(st10MobileWorkerTekkadan010);
    expect(trashIds.every((id) => p1.getCardZone(id) === "removalArea")).toBe(true);
    expectCard(p2, st10MobileWorkerTekkadan010).toBeRested();

    // Exile to removal is public zone movement; rest on the enemy is public.
    for (const id of trashIds) {
      expectPublicLog(engine, "gundam.effect.movedToZone", {
        cardId: id,
        to: "removalArea",
      });
    }
    expectPublicLog(engine, "gundam.effect.exhausted", {
      cardId: p2.unit(st10MobileWorkerTekkadan010).instanceId,
    });
    expectLogType(engine, "gundam.pending.resolved", { min: 1 });
  });
});
