import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamBarbatosAdapt056 } from "./056-gundam-barbatos-adapt.ts";

describe("Gundam Barbatos Adapt (GD03-056)", () => {
  it("【Deploy】 deals 1 damage to one friendly Unit and one enemy Unit", () => {
    const ally = createMockUnit({ hp: 4 });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03GundamBarbatosAdapt056],
        play: [ally],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03GundamBarbatosAdapt056));
    const deployedId = p1.getCardsInZone("battleArea").find((id) => id !== allyId);
    expect(deployedId).toBeDefined();
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      minTargets: 2,
      maxTargets: 2,
      groups: [
        {
          minTargets: 1,
          maxTargets: 1,
          legalTargetIds: expect.arrayContaining([allyId, deployedId]),
        },
        { minTargets: 1, maxTargets: 1, legalTargetIds: [enemyId] },
      ],
    });
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected target selection");
    expect(choice.groups[0]?.legalTargetIds).not.toContain(enemyId);
    expect(choice.groups[1]?.legalTargetIds).not.toContain(allyId);
    expect(choice.groups[1]?.legalTargetIds).not.toContain(deployedId);
    expectSuccess(p1.resolveEffect({ targets: [allyId, enemyId] }));

    expect(p1.getDamage(allyId)).toBe(1);
    expect(p1.getDamage(deployedId!)).toBe(0);
    expect(engine.asPlayer(PLAYER_TWO).getDamage(enemyId)).toBe(1);
  });
});
