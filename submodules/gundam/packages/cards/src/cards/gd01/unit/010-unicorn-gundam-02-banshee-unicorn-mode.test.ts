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
import { gd01UnicornGundam02BansheeUnicornMode010 } from "./010-unicorn-gundam-02-banshee-unicorn-mode.ts";

describe("Unicorn Gundam 02 Banshee (Unicorn Mode) (GD01-010)", () => {
  it("offers only enemy Units with 3 or less HP when paired", () => {
    const pilot = createMockPilot({ traits: ["cyber-newtype"], level: 1, cost: 1 });
    const legalEnemy = createMockUnit({ hp: 3 });
    const tooLarge = createMockUnit({ hp: 4 });
    const friendly = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01UnicornGundam02BansheeUnicornMode010, pilot],
        play: [friendly],
        resourceArea: activeResources(5),
      },
      { play: [legalEnemy, tooLarge] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [legalEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01UnicornGundam02BansheeUnicornMode010));
    const unitId = p1.getCardsInZone("battleArea")[1]!;
    expectSuccess(p1.assignPilot(pilot, unitId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [legalEnemyId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [legalEnemyId!] }));

    expect(p2.isExhausted(legalEnemyId!)).toBe(true);
    expectSuccess(p1.enterBattle(unitId, legalEnemyId!));
  });

  it("does not create a target prompt when every enemy Unit has 4 or more HP", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd01UnicornGundam02BansheeUnicornMode010],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, gd01UnicornGundam02BansheeUnicornMode010));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
  });
});
