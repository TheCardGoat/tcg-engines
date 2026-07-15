import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  createMockPilot,
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

    expect(p1.getVisibleCard(dynamesId!)?.effectiveAp).toBe(5);
  });

  it("recovers 2 HP when it destroys an enemy Unit with battle damage during your turn", () => {
    const fragileEnemy = createMockUnit({ ap: 0, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [{ card: st07GundamDynames005, damage: 3 }] },
      { play: [{ card: fragileEnemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const dynamesId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(dynamesId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(dynamesId)).toBe(1);
    expect(p2.getCardsInZone("trash")).toContain(enemyId);
  });

  it("does not recover when the enemy Unit survives the battle damage", () => {
    const sturdyEnemy = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [{ card: st07GundamDynames005, damage: 3 }] },
      { play: [{ card: sturdyEnemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const dynamesId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(dynamesId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(dynamesId)).toBe(3);
  });
});
