import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectCard,
  expectPlayer,
  expectPublicLog,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05WingGundamZeroEw067 } from "./067-wing-gundam-zero-ew.ts";

describe("Wing Gundam Zero (EW) (GD05-067)", () => {
  describe("While a rested enemy Unit is in play, this Unit gains <Suppression>.", () => {
    it("does not show Suppression while every enemy Unit is active", () => {
      const activeEnemy = createMockUnit({ name: "Active Enemy" });
      const engine = GundamTestEngine.create(
        { play: [gd05WingGundamZeroEw067] },
        { play: [activeEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expect(
        p1.getVisibleCard(p1.unit(gd05WingGundamZeroEw067).instanceId)?.keywords,
      ).not.toContain("Suppression");
    });

    it("gains Suppression while a rested enemy Unit is in play", () => {
      const restedEnemy = createMockUnit({ name: "Rested Enemy" });
      const engine = GundamTestEngine.create(
        { play: [gd05WingGundamZeroEw067] },
        { play: [{ card: restedEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectCard(p1, gd05WingGundamZeroEw067).toShowKeyword("Suppression");
    });

    it("destroys the first two Shields when attacking with Suppression from a rested enemy", () => {
      const restedEnemy = createMockUnit({ name: "Rested Enemy" });
      const shieldA = createMockUnit({ name: "Shield A" });
      const shieldB = createMockUnit({ name: "Shield B" });
      const engine = GundamTestEngine.create(
        { play: [gd05WingGundamZeroEw067] },
        {
          play: [{ card: restedEnemy, exhausted: true }],
          shieldArea: [shieldA, shieldB],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectCard(p1, gd05WingGundamZeroEw067).toShowKeyword("Suppression");
      p1.must.attack(gd05WingGundamZeroEw067).into("direct");
      expectPublicLog(engine, "gundam.move.attackDeclared", {
        attackerPlayerId: PLAYER_ONE,
      });
      // Attack trigger may prompt a rest choice even if the only enemy is already rested
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind === "targetSelection") {
        p1.must.resolveTargets(restedEnemy);
      }
      p2.must.passBlock().passBattleAction();
      p1.must.passBattleAction();

      expectPlayer(p2).toHaveShieldCount(0);
    });
  });

  describe("【Attack】Choose 1 enemy Unit. Rest it.", () => {
    it("rests only the chosen enemy Unit", () => {
      const chosen = createMockUnit();
      const unchosen = createMockUnit();
      const engine = GundamTestEngine.create(
        { play: [gd05WingGundamZeroEw067] },
        { play: [chosen, unchosen] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      expect(
        p1.getVisibleCard(p1.unit(gd05WingGundamZeroEw067).instanceId)?.keywords,
      ).not.toContain("Suppression");

      p1.must.attack(gd05WingGundamZeroEw067).into("direct");
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected Attack rest target");
      expect(choice.legalTargetIds).toEqual(
        expect.arrayContaining([p2.unit(chosen).instanceId, p2.unit(unchosen).instanceId]),
      );
      p1.must.resolveTargets(chosen);

      expectCard(p2, chosen).toBeRested();
      expectCard(p2, unchosen).toBeReady();
      expectCard(p1, gd05WingGundamZeroEw067).toShowKeyword("Suppression");
    });
  });
});
