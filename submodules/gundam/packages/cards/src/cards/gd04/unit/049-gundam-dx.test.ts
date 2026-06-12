import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectCardInTrash,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamDx049 } from "./049-gundam-dx.ts";

describe("Gundam DX (GD04-049)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04GundamDx049.keywordEffects.map((effect) => effect.keyword)).toEqual(["Suppression"]);
  });

  describe("【During Pair】【Attack】If you are attacking the enemy player, you may choose 7 (Vulture) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit/Base that is Lv.8 or lower. Destroy it.", () => {
    function vultureTrash(count: number) {
      return Array.from({ length: count }, (_, index) =>
        createMockUnit({ name: `Vulture ${index + 1}`, traits: ["vulture"] }),
      );
    }

    it("exiles 7 Vulture cards from trash to destroy an enemy Lv.8 Unit on direct attack", () => {
      const pilot = createMockPilot({ name: "Garrod Ran", cost: 1 });
      const trash = vultureTrash(7);
      const destroyTarget = createMockUnit({ name: "Enemy Target", level: 8, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd04GundamDx049],
          trash,
          resourceArea: activeResources(1),
        },
        { play: [destroyTarget] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamDxId = p1.getCardsInZone("battleArea")[0]!;
      const trashIds = p1.getCardsInZone("trash");
      const targetId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, gundamDxId));
      expectSuccess(p1.enterBattle(gundamDxId, "direct"));
      expectSuccess(
        p1.resolveEffect({ targets: [...trashIds, targetId], optionalAnswers: { 0: true } }),
      );

      for (const trashId of trashIds) {
        expect(engine.getState().ctx.zones.private.cardIndex[trashId]?.zoneKey).toBe("removalArea");
      }
      expectCardInTrash(engine, targetId, PLAYER_TWO);
    });

    it("declining the exile skips the destroy", () => {
      const pilot = createMockPilot({ name: "Garrod Ran", cost: 1 });
      const trash = vultureTrash(7);
      const destroyTarget = createMockUnit({ name: "Enemy Target", level: 8, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd04GundamDx049],
          trash,
          resourceArea: activeResources(1),
        },
        { play: [destroyTarget] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamDxId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, gundamDxId));
      expectSuccess(p1.enterBattle(gundamDxId, "direct"));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(p2.getCardsInZone("battleArea")).toContain(targetId);
      expect(p1.getCardsInZone("removalArea")).toEqual([]);
    });

    it("does not trigger when attacking an enemy Unit instead of the enemy player", () => {
      const pilot = createMockPilot({ name: "Garrod Ran", cost: 1 });
      const trash = vultureTrash(7);
      const attackTarget = {
        card: createMockUnit({ name: "Rested Enemy", ap: 1, hp: 7 }),
        exhausted: true,
      };
      const destroyTarget = createMockUnit({ name: "Enemy Target", level: 8, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd04GundamDx049],
          trash,
          resourceArea: activeResources(1),
        },
        { play: [attackTarget, destroyTarget] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamDxId = p1.getCardsInZone("battleArea")[0]!;
      const [attackTargetId, destroyTargetId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, gundamDxId));
      expectSuccess(p1.enterBattle(gundamDxId, attackTargetId!));

      expect(p2.getCardsInZone("battleArea")).toContain(destroyTargetId!);
      expect(p1.getCardsInZone("removalArea")).toEqual([]);
    });
  });
});
