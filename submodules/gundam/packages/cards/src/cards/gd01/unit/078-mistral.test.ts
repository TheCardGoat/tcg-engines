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
import { gd01Mistral078 } from "./078-mistral.ts";

describe("Mistral (GD01-078)", () => {
  it("offers enemy Units, gives the chosen Unit AP-1 this turn, then visibly expires", () => {
    const firstEnemy = createMockUnit({ ap: 3, hp: 5 });
    const secondEnemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Mistral078],
        resourceArea: activeResources(1),
        deck: 5,
      },
      { play: [firstEnemy, secondEnemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01Mistral078));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstEnemyId, secondEnemyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));

    expect(p2.getVisibleCard(firstEnemyId!)?.effectiveAp).toBe(3);
    expect(p2.getVisibleCard(secondEnemyId!)?.effectiveAp).toBe(2);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p2.getVisibleCard(secondEnemyId!)?.effectiveAp).toBe(3);
  });

  it("does not offer a friendly Unit in the enemy-only target prompt", () => {
    const friendly = createMockUnit({ ap: 3, hp: 5 });
    const firstEnemy = createMockUnit({ ap: 3, hp: 5 });
    const secondEnemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd01Mistral078], play: [friendly], resourceArea: activeResources(1) },
      { play: [firstEnemy, secondEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.deployUnit(gd01Mistral078, { targets: [friendlyId] }), "INVALID_TARGET");

    expect(p1.getVisibleCard(friendlyId)?.effectiveAp).toBe(3);
  });
});
