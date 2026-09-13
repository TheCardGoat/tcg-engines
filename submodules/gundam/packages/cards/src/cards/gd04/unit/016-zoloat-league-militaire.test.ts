import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectCard,
  expectFailure,
  expectLogType,
  expectPublicLog,
} from "@tcg/gundam-engine";
import { gd04ZoloatLeagueMilitaire016 } from "./016-zoloat-league-militaire.ts";

describe("Zoloat (League Militaire) (GD04-016)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("redirects an enemy attack to this Unit and rests it", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd04ZoloatLeagueMilitaire016] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectCard(p1, gd04ZoloatLeagueMilitaire016).toShowKeyword("Blocker");
      p2.must.attack(attacker).into("direct");
      p1.must.declareBlock(gd04ZoloatLeagueMilitaire016);
      expectPublicLog(engine, "gundam.move.blockDeclared", {
        blockerPlayerId: PLAYER_ONE,
      });
      expect(p1.getBoardView().pendingCombat).toMatchObject({
        blockerId: p1.unit(gd04ZoloatLeagueMilitaire016).instanceId,
        stage: "blocker-declared",
      });
      expectCard(p1, gd04ZoloatLeagueMilitaire016).toBeRested();
      p1.must.passBattleAction();
      p2.must.passBattleAction();

      expectLogType(engine, "gundam.combat.damageDealt", { min: 1 });
      expectCard(p1, gd04ZoloatLeagueMilitaire016).toHaveDamage(1);
    });

    it("cannot block a High-Maneuver attacker", () => {
      const highManeuver = createMockUnit({
        ap: 1,
        hp: 5,
        keywordEffects: [{ keyword: "HighManeuver" }],
      });
      const engine = GundamTestEngine.create(
        { play: [gd04ZoloatLeagueMilitaire016] },
        { play: [highManeuver] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p2.must.attack(highManeuver).into("direct");
      expectFailure(p1.declareBlock(gd04ZoloatLeagueMilitaire016), "CANNOT_BLOCK_HIGH_MANEUVER");
      expectCard(p1, gd04ZoloatLeagueMilitaire016).toBeReady();
    });
  });

  describe("This Unit can't choose the enemy player as its attack target.", () => {
    it("rejects a direct attack against the enemy player", () => {
      const engine = GundamTestEngine.create(
        { play: [gd04ZoloatLeagueMilitaire016], deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.enterBattle(gd04ZoloatLeagueMilitaire016, "direct"), "CANNOT_TARGET_PLAYER");
      expect(
        p1.getVisibleCard(p1.unit(gd04ZoloatLeagueMilitaire016).instanceId)?.restrictions,
      ).toContain("cannot-target-player");
    });

    it("may still attack a rested enemy Unit", () => {
      const defender = createMockUnit({ ap: 1, hp: 3 });
      const engine = GundamTestEngine.create(
        { play: [gd04ZoloatLeagueMilitaire016], deck: 5 },
        { play: [{ card: defender, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(gd04ZoloatLeagueMilitaire016).into(defender);
      expect(p1.getBoardView().pendingCombat?.target).toBe(p2.unit(defender).instanceId);
    });
  });
});
