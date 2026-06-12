import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  createMockPilot,
  getEffectiveStats,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07GundamDynames005 } from "./005-gundam-dynames.ts";

describe("Gundam Dynames (ST07-005)", () => {
  it("【During Link】This Unit gets AP+2.", () => {
    const lockon = createMockPilot({ name: "Lockon Stratos", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [lockon],
      play: [st07GundamDynames005],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [dynamesId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(lockon, st07GundamDynames005));

    const fw = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(dynamesId!, engine.getG(), fw.cards, fw).ap).toBe(5);
  });

  it("recovers 2 HP when it destroys an enemy Unit with battle damage during your turn", () => {
    const fragileEnemy = createMockUnit({ ap: 0, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [st07GundamDynames005] },
      { play: [{ card: fragileEnemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const dynamesId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().damage[dynamesId] = 3;

    expectSuccess(engine.resolveCombat({ attackerId: dynamesId, target: enemyId }));

    expect(p1.getDamage(dynamesId)).toBe(1);
    expect(p2.getCardsInZone("trash")).toContain(enemyId);
  });

  it("does not recover when the enemy Unit survives the battle damage", () => {
    const sturdyEnemy = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [st07GundamDynames005] },
      { play: [{ card: sturdyEnemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const dynamesId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().damage[dynamesId] = 3;

    expectSuccess(engine.resolveCombat({ attackerId: dynamesId, target: enemyId }));

    expect(p1.getDamage(dynamesId)).toBe(3);
  });
});
