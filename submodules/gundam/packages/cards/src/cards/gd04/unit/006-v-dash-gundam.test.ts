import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04VDashGundam006 } from "./006-v-dash-gundam.ts";

describe("V-Dash Gundam (GD04-006)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04VDashGundam006.keywordEffects.map((effect) => effect.keyword)).toEqual(["Breach"]);
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

    expect(engine.getG().exhausted[allyId!]).toBe(true);
    expect(engine.getG().exhausted[enemyId!]).toBe(true);
    expect(engine.getG().exhausted[vDashId!] ?? false).toBe(false);
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
