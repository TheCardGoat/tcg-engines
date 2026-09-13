import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectCard,
  expectFailure,
  expectLogType,
  expectPublicLog,
} from "@tcg/gundam-engine";
import { gd01WingGundamZero024 } from "./024-wing-gundam-zero.ts";

describe("Wing Gundam Zero (GD01-024)", () => {
  describe("<High-Maneuver> (This Unit can't be blocked.)", () => {
    it("prevents an enemy Blocker from declaring a block", () => {
      const blocker = createMockUnit({
        level: 6,
        hp: 10,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const engine = GundamTestEngine.create(
        { play: [gd01WingGundamZero024] },
        { play: [blocker], shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectCard(p1, gd01WingGundamZero024).toShowKeyword("HighManeuver");
      p1.must.attack(gd01WingGundamZero024).into("direct");
      expectPublicLog(engine, "gundam.move.attackDeclared", {
        attackerPlayerId: PLAYER_ONE,
      });
      expectFailure(p2.declareBlock(blocker), "CANNOT_BLOCK_HIGH_MANEUVER");
      expectCard(p2, blocker).toBeReady();
    });
  });

  describe("【Deploy】Deal 3 damage to all Units that are Lv.5 or lower.", () => {
    it("deals 3 damage to every friendly and enemy Lv.5-or-lower Unit", () => {
      const friendlyLow = createMockUnit({ level: 5, hp: 5 });
      const enemyLow = createMockUnit({ level: 4, hp: 5 });
      const enemyHigh = createMockUnit({ level: 6, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd01WingGundamZero024],
          play: [friendlyLow],
          resourceArea: activeResources(8),
        },
        { play: [enemyLow, enemyHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.deployUnit(gd01WingGundamZero024);

      expectPublicLog(engine, "gundam.move.deployUnit", {
        playerId: PLAYER_ONE,
        cost: gd01WingGundamZero024.cost,
      });
      expectLogType(engine, "gundam.combat.damageDealt", { min: 1 });
      expectCard(p1, friendlyLow).toHaveDamage(3);
      expectCard(p2, enemyLow).toHaveDamage(3);
      expectCard(p2, enemyHigh).toHaveDamage(0);
      // Source is Lv.8, so it does not damage itself
      expectCard(p1, gd01WingGundamZero024).toHaveDamage(0);
    });

    it("does not damage Lv.6 Units on either side", () => {
      const friendlyHigh = createMockUnit({ level: 6, hp: 5 });
      const enemyHigh = createMockUnit({ level: 6, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd01WingGundamZero024],
          play: [friendlyHigh],
          resourceArea: activeResources(8),
        },
        { play: [enemyHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.deployUnit(gd01WingGundamZero024);

      expectCard(p1, friendlyHigh).toHaveDamage(0);
      expectCard(p2, enemyHigh).toHaveDamage(0);
    });
  });

  it("can attack on its deploy turn after pairing Heero Yuy", () => {
    const heero = createMockPilot({ name: "Heero Yuy", level: 1, cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01WingGundamZero024, heero],
        resourceArea: activeResources(9),
      },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    p1.must.deployUnit(gd01WingGundamZero024);
    p1.must.assignPilot(heero, gd01WingGundamZero024);
    p1.must.attack(gd01WingGundamZero024).into("direct");
    expect(p1.getBoardView().pendingCombat?.attackerId).toBe(
      p1.unit(gd01WingGundamZero024).instanceId,
    );
  });
});
