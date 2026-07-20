import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st07GundamDynames005 } from "./005-gundam-dynames.ts";

describe("Gundam Dynames (ST07-005)", () => {
  it("deploys with printed 2 AP/4 HP for Lv.4 and cost 3", () => {
    const engine = GundamTestEngine.create({
      hand: [st07GundamDynames005],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(st07GundamDynames005));
    const id = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 2, effectiveHp: 4 });
    expect(p1.getCardsInZone("resourceArea").filter((r) => p1.isExhausted(r))).toHaveLength(3);
  });

  it("requires Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [st07GundamDynames005],
      resourceArea: activeResources(3),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st07GundamDynames005),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires three active resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st07GundamDynames005],
      resourceArea: restedResources(4),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st07GundamDynames005),
      "INSUFFICIENT_RESOURCES",
    );
  });

  it("gets AP+2 only while linked with Lockon Stratos", () => {
    const lockon = createMockPilot({ name: "Lockon Stratos", level: 1, cost: 1, apBonus: 0 });
    const engine = GundamTestEngine.create({
      hand: [lockon],
      play: [st07GundamDynames005],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(lockon, id));
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 4 });
  });

  it("does not get AP+2 from a Pilot outside its Link Condition", () => {
    const pilot = createMockPilot({ name: "Setsuna F. Seiei", level: 1, cost: 1, apBonus: 0 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [st07GundamDynames005],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(pilot, id));
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 2 });
  });

  it("recovers exactly 2 HP when it destroys an enemy with battle damage on its turn", () => {
    const enemy = createMockUnit({ ap: 0, hp: 2 });
    const engine = GundamTestEngine.create(
      { play: [{ card: st07GundamDynames005, damage: 3 }] },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const id = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(id, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.getDamage(id)).toBe(1);
    expect(p1.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("does not recover when another friendly Unit destroys the enemy", () => {
    const ally = createMockUnit({ ap: 3, hp: 5 });
    const enemy = createMockUnit({ ap: 0, hp: 2 });
    const engine = GundamTestEngine.create(
      { play: [{ card: st07GundamDynames005, damage: 3 }, ally] },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [dynamesId, allyId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.enterBattle(allyId!, p2.getCardsInZone("battleArea")[0]!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.getDamage(dynamesId!)).toBe(3);
  });

  it("does not recover when the enemy survives", () => {
    const enemy = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [{ card: st07GundamDynames005, damage: 3 }] },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(id, p2.getCardsInZone("battleArea")[0]!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.getDamage(id)).toBe(3);
  });

  it("does not recover when it destroys an attacker on the opponent's turn", () => {
    const enemy = createMockUnit({ ap: 1, hp: 2 });
    const engine = GundamTestEngine.create(
      { play: [{ card: st07GundamDynames005, damage: 1, exhausted: true }], deck: 5 },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const id = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(enemyId, id));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getDamage(id)).toBe(2);
  });
});
