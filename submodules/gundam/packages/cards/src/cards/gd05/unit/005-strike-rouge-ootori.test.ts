import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCard,
  expectFailure,
  expectLogType,
  expectPublicLog,
  restedResources,
} from "@tcg/gundam-engine";
import { gd05StrikeRougeOotori005 } from "./005-strike-rouge-ootori.ts";

describe("Strike Rouge (Ootori) (GD05-005)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("rests this Unit and redirects an enemy attack to it", () => {
      const attacker = createMockUnit({ ap: 2, hp: 5 });
      const originalTarget = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [{ card: originalTarget, exhausted: true }, gd05StrikeRougeOotori005],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectCard(p2, gd05StrikeRougeOotori005).toShowKeyword("Blocker");
      p1.must.attack(attacker).into(originalTarget);
      p2.must.declareBlock(gd05StrikeRougeOotori005);

      expectPublicLog(engine, "gundam.move.blockDeclared", {
        blockerPlayerId: PLAYER_TWO,
      });
      expect(p1.getBoardView().pendingCombat).toMatchObject({
        blockerId: p2.unit(gd05StrikeRougeOotori005).instanceId,
        stage: "blocker-declared",
      });
      expectCard(p2, gd05StrikeRougeOotori005).toBeRested();

      p2.must.passBattleAction();
      p1.must.passBattleAction();

      expectLogType(engine, "gundam.combat.damageDealt", { min: 1 });
      expectCard(p2, gd05StrikeRougeOotori005).toHaveDamage(2);
      expectCard(p2, originalTarget).toHaveDamage(0);
    });

    it("cannot block while rested", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [
            { card: originalTarget, exhausted: true },
            { card: gd05StrikeRougeOotori005, exhausted: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(attacker).into(originalTarget);
      expectFailure(p2.declareBlock(gd05StrikeRougeOotori005), "CANNOT_BLOCK");
      expect(p1.getBoardView().pendingCombat).toMatchObject({
        target: p2.unit(originalTarget).instanceId,
      });
    });

    it("cannot block a High-Maneuver attacker", () => {
      const highManeuver = createMockUnit({
        ap: 2,
        hp: 5,
        keywordEffects: [{ keyword: "HighManeuver" }],
      });
      const originalTarget = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [highManeuver] },
        {
          play: [{ card: originalTarget, exhausted: true }, gd05StrikeRougeOotori005],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(highManeuver).into(originalTarget);
      expectFailure(p2.declareBlock(gd05StrikeRougeOotori005), "CANNOT_BLOCK_HIGH_MANEUVER");
      expectCard(p2, gd05StrikeRougeOotori005).toBeReady();
    });
  });

  it("cannot deploy below Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [gd05StrikeRougeOotori005],
      resourceArea: activeResources(3),
      deck: 5,
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd05StrikeRougeOotori005),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("cannot deploy without enough active resources for cost 3", () => {
    const engine = GundamTestEngine.create({
      hand: [gd05StrikeRougeOotori005],
      // Lv.4 satisfied by total resources; only 2 active leaves cost 3 unpaid
      resourceArea: [...restedResources(2), ...activeResources(2)],
      deck: 5,
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd05StrikeRougeOotori005),
      "INSUFFICIENT_RESOURCES",
    );
  });
});
