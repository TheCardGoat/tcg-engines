import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09ImpulseGundam001 } from "./001-impulse-gundam.ts";
import { st09SwordImpulseGundam006 } from "./006-sword-impulse-gundam.ts";

describe("Sword Impulse Gundam (ST09-006)", () => {
  describe("【Deploy】If you deploy this Unit from your trash, choose 1 enemy Unit that is Lv.3 or lower. Destroy it.", () => {
    it("destroys an enemy Lv.3 or lower Unit when deployed from trash", () => {
      const lowLevelEnemy = createMockUnit({ level: 3 });
      const highLevelEnemy = createMockUnit({ level: 4 });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [st09SwordImpulseGundam006],
          resourceArea: activeResources(2),
        },
        { play: [lowLevelEnemy, highLevelEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const impulseId = p1.getCardsInZone("battleArea")[0]!;
      const swordId = p1.getCardsInZone("trash")[0]!;
      const [lowLevelEnemyId, highLevelEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.activateAbility(impulseId, 0, { targets: [swordId] }));

      expect(p1.getCardsInZone("battleArea")).toEqual([swordId]);
      expect(p2.getCardsInZone("trash")).toContain(lowLevelEnemyId);
      expect(p2.getCardsInZone("battleArea")).toEqual([highLevelEnemyId]);
    });

    it("does not destroy an enemy Unit when deployed from hand", () => {
      const enemy = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st09SwordImpulseGundam006], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const swordId = p1.getCardsInZone("hand")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(swordId));

      expect(p1.getCardsInZone("battleArea")).toEqual([swordId]);
      expect(p2.getCardsInZone("battleArea")).toEqual([enemyId]);
      expect(p2.getCardsInZone("trash")).toHaveLength(0);
    });
  });
});
