import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st03Sinanju001 } from "./001-sinanju.ts";

describe("Sinanju (ST03-001)", () => {
  describe("【During Pair】This Unit gains <High-Maneuver>.", () => {
    it("gains High-Maneuver while paired", () => {
      const fullFrontal = createMockPilot({ name: "Full Frontal", level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [fullFrontal],
        play: [st03Sinanju001],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [sinanjuId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(fullFrontal, st03Sinanju001));

      expect(p1.getVisibleCard(sinanjuId!)?.keywords).toContain("HighManeuver");
    });

    it("does not gain High-Maneuver while unpaired", () => {
      const engine = GundamTestEngine.create({ play: [st03Sinanju001] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [sinanjuId] = p1.getCardsInZone("battleArea");

      expect(p1.getVisibleCard(sinanjuId!)?.keywords).not.toContain("HighManeuver");
    });
  });

  describe("During your turn, when this Unit destroys an enemy shield area card with battle damage, choose 1 enemy Unit. Deal 2 damage to it.", () => {
    it("deals 2 damage to an enemy Unit after direct battle damage destroys a shield", () => {
      const enemy = createMockUnit({ hp: 5 });
      const shield = createMockUnit({ name: "Shield Card" });
      const engine = GundamTestEngine.create(
        { play: [st03Sinanju001] },
        { play: [enemy], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(sinanjuId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: sinanjuId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p2.getDamage(enemyId)).toBe(2);
    });

    it("also triggers when battle damage destroys an enemy Base in the shield area", () => {
      const enemy = createMockUnit({ hp: 5 });
      const base = createMockBase({ hp: 1 });
      const engine = GundamTestEngine.create(
        { play: [st03Sinanju001] },
        { baseSection: [base], play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(sinanjuId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: sinanjuId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
      expect(p2.getDamage(enemyId)).toBe(2);
    });

    it("does not trigger when Sinanju destroys an enemy Unit instead of a shield-area card", () => {
      const enemy = createMockUnit({ hp: 1 });
      const engine = GundamTestEngine.create(
        { play: [st03Sinanju001] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(sinanjuId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardsInZone("trash")).toContain(enemyId);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
