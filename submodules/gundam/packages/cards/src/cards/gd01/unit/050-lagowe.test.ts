import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Lagowe050 } from "./050-lagowe.ts";

describe("LaGOWE (GD01-050)", () => {
  it("links with a ZAFT Pilot, offers enemy Units, and deals 2 damage while attacking a Unit at 5 AP", () => {
    const zaftPilot = createMockPilot({
      traits: ["zaft"],
      apBonus: 3,
      level: 1,
      cost: 1,
    });
    const firstEnemy = createMockUnit({ hp: 7 });
    const secondEnemy = createMockUnit({ hp: 7 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Lagowe050, zaftPilot],
        deck: 2,
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [firstEnemy, secondEnemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(firstEnemyId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expectSuccess(p1.deployUnit(gd01Lagowe050));
    const lagoweId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(zaftPilot, lagoweId));
    expect(p1.getVisibleCard(lagoweId)?.effectiveAp).toBe(5);
    expectSuccess(p1.enterBattle(lagoweId, firstEnemyId!));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstEnemyId, secondEnemyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));

    expect(p2.getDamage(firstEnemyId!)).toBe(0);
    expect(p2.getDamage(secondEnemyId!)).toBe(2);
  });

  it("does not offer damage when it attacks a Unit below 5 AP", () => {
    const enemy = createMockUnit({ hp: 7 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [gd01Lagowe050],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const lagoweId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expectSuccess(p1.enterBattle(lagoweId, enemyId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
  });

  it("does not offer damage when it attacks the enemy player", () => {
    const pilot = createMockPilot({ apBonus: 3, level: 1, cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd01Lagowe050],
        resourceArea: activeResources(1),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const lagoweId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, lagoweId));
    expect(p1.getVisibleCard(lagoweId)?.effectiveAp).toBe(5);
    expectSuccess(p1.enterBattle(lagoweId, "direct"));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
