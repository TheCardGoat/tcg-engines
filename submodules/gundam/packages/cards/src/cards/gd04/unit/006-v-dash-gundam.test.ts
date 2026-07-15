import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04VDashGundam006 } from "./006-v-dash-gundam.ts";

describe("V-Dash Gundam (GD04-006)", () => {
  it("<Breach 3> deals 3 damage to the enemy Base after destroying a Unit in battle", () => {
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const base = createMockBase({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04VDashGundam006] },
      { play: [{ card: defender, exhausted: true }], baseSection: [base] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const vDashId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const baseId = p2.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.enterBattle(vDashId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getDamage(baseId)).toBe(3);
  });

  it("【Activate･Main】 rests another friendly (League Militaire) Unit as cost and rests an enemy Unit with 4 or less HP", () => {
    const ally = createMockUnit({ traits: ["league militaire"], ap: 2, hp: 3 });
    const enemy = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({ play: [gd04VDashGundam006, ally] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [vDashId, allyId] = p1.getCardsInZone("battleArea");
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.activateAbility(vDashId!, 0, { targets: [enemyId!] }));

    expect(p1.isExhausted(allyId!)).toBe(true);
    expect(p2.isExhausted(enemyId!)).toBe(true);
    expect(p1.isExhausted(vDashId!)).toBe(false);
  });

  it("cannot activate without another active friendly (League Militaire) Unit to rest for cost", () => {
    const nonLeagueAlly = createMockUnit({ traits: ["earth federation"], ap: 2, hp: 3 });
    const enemy = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [gd04VDashGundam006, nonLeagueAlly] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [vDashId] = p1.getCardsInZone("battleArea");
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectFailure(p1.activateAbility(vDashId!, 0, { targets: [enemyId!] }), "COST_NOT_PAYABLE");
  });

  it("cannot target an enemy Unit with more than 4 HP", () => {
    const ally = createMockUnit({ traits: ["league militaire"], ap: 2, hp: 3 });
    const highHpEnemy = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04VDashGundam006, ally] },
      { play: [highHpEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [vDashId] = p1.getCardsInZone("battleArea");
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectFailure(p1.activateAbility(vDashId!, 0, { targets: [enemyId!] }), "ILLEGAL_TARGET");
  });
});
