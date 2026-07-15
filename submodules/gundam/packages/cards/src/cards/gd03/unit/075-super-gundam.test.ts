import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd03SuperGundam075 } from "./075-super-gundam.ts";

describe("Super Gundam (GD03-075)", () => {
  it("【During Link】【Attack】 offers only an enemy Unit with no paired Pilot for AP-2", () => {
    const aeugPilot = createMockPilot({ traits: ["aeug"], cost: 1 });
    const enemyPilot = createMockPilot({ cost: 1 });
    const pairedEnemy = createMockUnit({ ap: 4, hp: 10 });
    const unpairedEnemy = createMockUnit({ ap: 4, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [aeugPilot],
        play: [gd03SuperGundam075],
        resourceArea: activeResources(4),
        deck: 5,
      },
      {
        hand: [enemyPilot],
        play: [
          { card: pairedEnemy, exhausted: true },
          { card: unpairedEnemy, exhausted: true },
        ],
        resourceArea: activeResources(2),
        deck: 5,
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [pairedEnemyId, unpairedEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.assignPilot(enemyPilot, pairedEnemyId!));
    const pairedEnemyAp = p2.getVisibleCard(pairedEnemyId!)?.effectiveAp;
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.assignPilot(aeugPilot, attackerId));
    expectSuccess(p1.enterBattle(attackerId, unpairedEnemyId!));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [unpairedEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [unpairedEnemyId!] }));

    expect(p2.getVisibleCard(unpairedEnemyId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(pairedEnemyId!)?.effectiveAp).toBe(pairedEnemyAp);

    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p2.getVisibleCard(unpairedEnemyId!)?.effectiveAp).toBe(4);
  });

  it("does not offer the AP reduction while paired but not linked", () => {
    const wrongPilot = createMockPilot({ traits: ["zeon"], cost: 1 });
    const enemy = createMockUnit({ ap: 4, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [wrongPilot],
        play: [gd03SuperGundam075],
        resourceArea: activeResources(5),
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(wrongPilot, attackerId));
    expectSuccess(p1.enterBattle(attackerId, enemyId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
  });
});
