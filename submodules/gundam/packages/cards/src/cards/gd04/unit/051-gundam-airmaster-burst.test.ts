import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamAirmasterBurst051 } from "./051-gundam-airmaster-burst.ts";

describe("Gundam Airmaster Burst (GD04-051)", () => {
  it("during pair with 7 cards in trash, grants keyword-bearing active enemies as attack targets", () => {
    const vulturePilot = createMockPilot({ traits: ["vulture"] });
    const keywordEnemy = createMockUnit({
      name: "Keyword Enemy",
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const vanillaEnemy = createMockUnit({ name: "Vanilla Enemy", ap: 2, hp: 5 });
    const trash = Array.from({ length: 7 }, () => createMockUnit());
    const engine = GundamTestEngine.create(
      {
        hand: [vulturePilot],
        play: [gd04GundamAirmasterBurst051],
        resourceArea: activeResources(1),
        trash,
      },
      { play: [keywordEnemy, vanillaEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(vulturePilot, unitId));

    const [keywordEnemyId, vanillaEnemyId] = engine
      .asPlayer(PLAYER_TWO)
      .getCardsInZone("battleArea");

    expect(p1.getLegalAttackTargets(unitId)).toContain(keywordEnemyId);
    expect(p1.getLegalAttackTargets(unitId)).not.toContain(vanillaEnemyId);
    expectSuccess(p1.enterBattle(unitId, keywordEnemyId!));
  });

  it("does not grant the attack option with fewer than 7 cards in trash", () => {
    const vulturePilot = createMockPilot({ traits: ["vulture"] });
    const keywordEnemy = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      {
        hand: [vulturePilot],
        play: [gd04GundamAirmasterBurst051],
        resourceArea: activeResources(1),
        trash: Array.from({ length: 6 }, () => createMockUnit()),
      },
      { play: [keywordEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(vulturePilot, unitId));

    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    expect(p1.getLegalAttackTargets(unitId)).not.toContain(enemyId);
    expectFailure(p1.enterBattle(unitId, enemyId), "INVALID_TARGET");
  });
});
