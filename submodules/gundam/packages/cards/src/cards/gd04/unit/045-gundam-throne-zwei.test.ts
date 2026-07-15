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
import { gd04GundamThroneZwei045 } from "./045-gundam-throne-zwei.ts";

describe("Gundam Throne Zwei (GD04-045)", () => {
  it("when linked, grants a chosen CB Unit the option to attack damaged active enemy Units this turn", () => {
    const trinityPilot = createMockPilot({ name: "Trinity Pilot", traits: ["trinity"] });
    const damagedActiveEnemy = createMockUnit({ name: "Damaged Active Enemy", hp: 5 });
    const undamagedActiveEnemy = createMockUnit({ name: "Undamaged Active Enemy", hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [trinityPilot],
        play: [gd04GundamThroneZwei045],
        resourceArea: activeResources(4),
      },
      { play: [{ card: damagedActiveEnemy, damage: 1 }, undamagedActiveEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const pilotId = p1.getHand()[0]!;
    const zweiId = p1.getCardsInZone("battleArea")[0]!;
    const [damagedEnemyId, undamagedEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilotId, zweiId));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected the Link effect to ask for a CB Unit");
    }
    expect(choice.legalTargetIds).toEqual([zweiId]);
    expect(choice.minTargets).toBe(1);
    expect(choice.maxTargets).toBe(1);

    expectSuccess(p1.resolveEffect({ targets: [zweiId] }));

    expect(p1.getLegalAttackTargets(zweiId)).toContain(damagedEnemyId);
    expect(p1.getLegalAttackTargets(zweiId)).not.toContain(undamagedEnemyId);
    expectSuccess(p1.enterBattle(zweiId, damagedEnemyId!));
  });
});
