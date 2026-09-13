import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05M1AstrayShrike015 } from "./015-m1-astray-shrike.ts";

describe("M1 Astray Shrike (GD05-015)", () => {
  /** @behavioral-proof complete: Deploy timing, enemy/rested target filter, damage value, and no-target branch are public. */
  describe("【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.", () => {
    it("deals exactly 1 damage to the chosen rested enemy and excludes active enemies", () => {
      const restedEnemy = createMockUnit({ hp: 4 });
      const activeEnemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05M1AstrayShrike015],
          resourceArea: activeResources(2),
        },
        { play: [{ card: restedEnemy, exhausted: true }, activeEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [restedEnemyId, activeEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd05M1AstrayShrike015));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection")
        throw new Error("Expected the rested enemy target choice");
      expect(choice.legalTargetIds).toEqual([restedEnemyId]);
      expectSuccess(p1.resolveEffect({ targets: [restedEnemyId!] }));

      expect(p2.getDamage(restedEnemyId!)).toBe(1);
      expect(p2.getDamage(activeEnemyId!)).toBe(0);
    });

    it("does not publish a target choice when every enemy Unit is active", () => {
      const activeEnemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05M1AstrayShrike015],
          resourceArea: activeResources(2),
        },
        { play: [activeEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const activeEnemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd05M1AstrayShrike015));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(activeEnemyId)).toBe(0);
    });
  });
});
