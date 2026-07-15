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
import { gd04GundamKyriosTailBooster023 } from "./023-gundam-kyrios-tail-booster.ts";

describe("Gundam Kyrios (Tail Booster) (GD04-023)", () => {
  describe("【Deploy】Choose 1 of your Units paired with a (Super Soldier) Pilot. During this turn, it may choose an active enemy Unit that is Lv.4 or lower as its attack target.", () => {
    it("lets the chosen Unit attack an active Lv.4 enemy but not an active Lv.5 enemy", () => {
      const superSoldier = createMockPilot({
        name: "Allelujah Test",
        traits: ["super soldier"],
        level: 1,
        cost: 1,
      });
      const friendlyUnit = createMockUnit({ name: "Chosen Unit", ap: 3, hp: 4 });
      const levelFourEnemy = createMockUnit({ name: "Lv.4 Enemy", level: 4, hp: 6 });
      const levelFiveEnemy = createMockUnit({ name: "Lv.5 Enemy", level: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04GundamKyriosTailBooster023, superSoldier],
          play: [friendlyUnit],
          resourceArea: activeResources(5),
        },
        { play: [levelFourEnemy, levelFiveEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const [levelFourEnemyId, levelFiveEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(superSoldier, friendlyId));
      expect(p1.getLegalAttackTargets(friendlyId)).not.toContain(levelFourEnemyId);

      expectSuccess(p1.deployUnit(gd04GundamKyriosTailBooster023, { targets: [friendlyId] }));

      expect(p1.getLegalAttackTargets(friendlyId)).toContain(levelFourEnemyId);
      expect(p1.getLegalAttackTargets(friendlyId)).not.toContain(levelFiveEnemyId);
      expectSuccess(p1.enterBattle(friendlyId, levelFourEnemyId!));
    });

    it("does not grant an active-enemy attack target when no friendly Unit has a Super Soldier Pilot", () => {
      const friendlyUnit = createMockUnit({ name: "Unpaired Unit", ap: 3, hp: 4 });
      const activeEnemy = createMockUnit({ name: "Active Enemy", level: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04GundamKyriosTailBooster023],
          play: [friendlyUnit],
          resourceArea: activeResources(5),
        },
        { play: [activeEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const activeEnemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd04GundamKyriosTailBooster023));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(gd04GundamKyriosTailBooster023)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getLegalAttackTargets(friendlyId)).not.toContain(activeEnemyId);
      expectFailure(p1.enterBattle(friendlyId, activeEnemyId), "INVALID_TARGET");
    });
  });
});
