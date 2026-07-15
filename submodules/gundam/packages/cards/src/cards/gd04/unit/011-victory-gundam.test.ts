import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04VictoryGundam011 } from "./011-victory-gundam.ts";

describe("Victory Gundam (GD04-011)", () => {
  describe("【Destroyed】If another friendly (League Militaire) Unit is in play, deploy 1 [Parts]((League Militaire)･AP1･HP1･This Unit can't choose the enemy player as its attack target) Unit token.", () => {
    it("deploys an active Parts token when battle destroys it beside another League Militaire Unit", () => {
      const otherLeagueMilitaire = createMockUnit({
        name: "Other League Militaire Unit",
        traits: ["league militaire"],
      });
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 2, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: gd04VictoryGundam011, exhausted: true }, otherLeagueMilitaire],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const battleAreaBefore = p1.getCardsInZone("battleArea");
      const [victoryGundamId] = battleAreaBefore;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, victoryGundamId!));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      const partsId = p1
        .getCardsInZone("battleArea")
        .find((cardId) => !battleAreaBefore.includes(cardId));
      expect(p1.getCardsInZone("trash")).toContain(victoryGundamId);
      expect(partsId).toBeDefined();
      expect(p1.isExhausted(partsId!)).toBe(false);
      expect(p1.getVisibleCard(partsId!)).toMatchObject({
        effectiveAp: 1,
        effectiveHp: 1,
        restrictions: ["cannot-target-player"],
      });
      expect(p1.getLegalAttackTargets(partsId!)).not.toContain("direct");
    });

    it("does not deploy a Parts token without another League Militaire Unit", () => {
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 2, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [{ card: gd04VictoryGundam011, exhausted: true }] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const victoryGundamId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, victoryGundamId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getCardsInZone("trash")).toContain(victoryGundamId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });
  });
});
