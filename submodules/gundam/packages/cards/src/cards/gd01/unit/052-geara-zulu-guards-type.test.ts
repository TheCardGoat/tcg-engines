import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GearaZuluGuardsType052 } from "./052-geara-zulu-guards-type.ts";

describe("Geara Zulu (Guards Type) (GD01-052)", () => {
  it("offers enemy Units and deals 1 damage only to the chosen target on deploy", () => {
    const firstEnemy = createMockUnit({ hp: 4 });
    const secondEnemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd01GearaZuluGuardsType052], resourceArea: activeResources(4) },
      { play: [firstEnemy, secondEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01GearaZuluGuardsType052));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstEnemyId, secondEnemyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));

    expect(p2.getDamage(firstEnemyId!)).toBe(0);
    expect(p2.getDamage(secondEnemyId!)).toBe(1);
  });

  it("rejects a friendly Unit submitted to the visible enemy-only prompt", () => {
    const friendly = createMockUnit({ hp: 4 });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GearaZuluGuardsType052],
        play: [friendly],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd01GearaZuluGuardsType052));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectFailure(p1.resolveEffect({ targets: [friendlyId] }), "ILLEGAL_TARGET");

    expect(p1.getDamage(friendlyId)).toBe(0);
    expect(p2.getDamage(enemyId)).toBe(0);
  });

  it("deploys cleanly without opening a prompt when no enemy Unit exists", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01GearaZuluGuardsType052],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01GearaZuluGuardsType052));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
  });
});
