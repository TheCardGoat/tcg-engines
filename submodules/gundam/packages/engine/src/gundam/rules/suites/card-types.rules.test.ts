/**
 * Spec → tests: ../specs/03-card-types.md (fluent API)
 */

import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectCard,
  expectPlayer,
  expectFailure,
  resolveBattle,
  endTurn,
  expectPublicLog,
} from "../../index.ts";
import { st01Gundam001 } from "../../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { st01Gm005 } from "../../../../../cards/src/cards/st01/unit/005-gm.ts";
import { st01AmuroRay010 } from "../../../../../cards/src/cards/st01/pilot/010-amuro-ray.ts";
import { st01SulettaMercury011 } from "../../../../../cards/src/cards/st01/pilot/011-suletta-mercury.ts";
import { st01KaiSResolve013 } from "../../../../../cards/src/cards/st01/command/013-kai-s-resolve.ts";
import { st01WhiteBase015 } from "../../../../../cards/src/cards/st01/base/015-white-base.ts";
import { st10MobileWorkerTekkadan010 } from "../../../../../cards/src/cards/st10/unit/010-mobile-worker-tekkadan.ts";

describe("Section 3 — Card Types (specs/03-card-types.md)", () => {
  it("3-2-1 / 5-8-1 / 7-5-2-1: deploy a Unit into the battle area", () => {
    const engine = GundamTestEngine.create({
      hand: [st01Gm005],
      resourceArea: activeResources(Math.max(st01Gm005.level, st01Gm005.cost)),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.deployUnit(st01Gm005);
    expectPlayer(p1).toHaveHandCount(0).toHaveZoneCount("battleArea", 1);
    expectCard(p1, st01Gm005).toBeReady();
    expectPublicLog(engine, "gundam.move.deployUnit", {
      playerId: PLAYER_ONE,
      cost: st01Gm005.cost,
    });
  });

  it("3-2-4: newly deployed Unit cannot attack the same turn", () => {
    const engine = GundamTestEngine.create(
      { hand: [st01Gm005], resourceArea: activeResources(3), deck: 5 },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.deployUnit(st01Gm005);
    expectFailure(p1.enterBattle(st01Gm005, "direct"), "CANNOT_ATTACK");
  });

  it("3-2-6-2 / 3-2-6-3: Link Unit can attack the turn it is deployed", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [st01Gundam001, st01AmuroRay010],
        resourceArea: activeResources(8),
        deck: 5,
      },
      { shieldArea: [st01Gm005], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.deployUnit(st01Gundam001);
    p1.must.assignPilot(st01AmuroRay010, st01Gundam001);
    p1.must.attack(st01Gundam001).into("direct");
    expectCard(p1, st01Gundam001).toBeRested();
  });

  it("3-3-3 / 3-3-4: a Unit may have at most one Pilot paired", () => {
    const engine = GundamTestEngine.create({
      play: [st01Gundam001],
      hand: [st01AmuroRay010, st01SulettaMercury011],
      resourceArea: activeResources(8),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.assignPilot(st01AmuroRay010, st01Gundam001);
    expectCard(p1, st01Gundam001).toHavePilot();
    const pilotId = p1.getPilotId(p1.unit(st01Gundam001).instanceId);
    expectFailure(p1.assignPilot(st01SulettaMercury011, st01Gundam001), "UNIT_ALREADY_HAS_PILOT");
    expect(p1.getPilotId(p1.unit(st01Gundam001).instanceId)).toBe(pilotId);
  });

  it("3-3-6: paired Pilot moves to trash with its Unit after lethal combat", () => {
    const pilot = createMockPilot({
      name: "Fodder Pilot",
      level: 1,
      cost: 0,
      apBonus: 0,
      hpBonus: 0,
      effects: [],
    });
    const defender = createMockUnit({ ap: 10, hp: 1 });
    const engine = GundamTestEngine.create(
      {
        play: [st01Gundam001],
        hand: [pilot],
        resourceArea: activeResources(2),
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.assignPilot(pilot, st01Gundam001);
    const pilotId = p1.getPilotId(p1.unit(st01Gundam001).instanceId)!;
    resolveBattle(engine, st01Gundam001, defender);
    expectCard(p1, st01Gundam001).toBeIn("trash");
    expect(p1.getCardZone(pilotId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("3-4-4 / 4-9-1: Command is placed in trash after resolution", () => {
    const damaged = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [st01KaiSResolve013],
      play: [{ card: damaged, damage: 2 }],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.playCommand(st01KaiSResolve013, { targets: [damaged] });
    expectPlayer(p1).toHaveZoneCount("trash", 1).toHaveHandCount(0);
  });

  it("3-4-6-2: Command with 【Pilot】 can be paired via playCommandAsPilot", () => {
    const pilotCmd = createMockCommand({
      level: 1,
      cost: 1,
      pilotName: "Test Pilot",
      apBonus: 1,
      hpBonus: 1,
      traits: ["earth federation"],
    });
    const engine = GundamTestEngine.create({
      hand: [pilotCmd],
      play: [st01Gm005],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.playCommandAsPilot(pilotCmd, st01Gm005);
    expectCard(p1, st01Gm005).toHavePilot();
  });

  it("3-5-3 / 8-5-2-4: Base receives shield-area damage before Shields", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      {
        baseSection: [st01WhiteBase015],
        shieldArea: [st10MobileWorkerTekkadan010, st10MobileWorkerTekkadan010],
      },
    );
    const p2 = engine.asPlayer(PLAYER_TWO);
    resolveBattle(engine, st01Gundam001, "direct");
    expectCard(p2, st01WhiteBase015).toHaveDamage(st01Gundam001.ap);
    expectPlayer(p2).toHaveShieldCount(2);
  });

  it("3-6-1 / 7-4-1: Resource Phase places one Resource from the resource deck", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001], deck: 8, resourceDeck: 5 },
      { deck: 8, resourceDeck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const resourcesBefore = p1.getResourceCount();
    endTurn(engine); // P2 turn: start/draw/resource/main
    const p2 = engine.asPlayer(PLAYER_TWO);
    // After endTurn, P2 is active in main and should have placed a resource
    expect(p2.getResourceCount()).toBeGreaterThanOrEqual(1);
    endTurn(engine); // back to P1 — P1 places one resource during resource phase
    expectPlayer(p1).toHaveResourceCount(resourcesBefore + 1);
  });
});
