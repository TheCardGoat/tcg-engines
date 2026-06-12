import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  getEffectiveStats,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st03Sinanju001 } from "./001-sinanju.ts";

describe("Sinanju (ST03-001)", () => {
  describe("【During Pair】This Unit gains <High-Maneuver>.", () => {
    function keywords(engine: GundamTestEngine, unitId: string): string[] {
      const fw = engine.getRuntime().getFrameworkReadAPI();
      return getEffectiveStats(unitId, engine.getG(), fw.cards, fw).keywords;
    }

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

      expect(keywords(engine, sinanjuId!)).toContain("HighManeuver");
    });

    it("does not gain High-Maneuver while unpaired", () => {
      const engine = GundamTestEngine.create({ play: [st03Sinanju001] });
      const [sinanjuId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

      expect(keywords(engine, sinanjuId!)).not.toContain("HighManeuver");
    });
  });

  describe("During your turn, when this Unit destroys an enemy shield area card with battle damage, choose 1 enemy Unit. Deal 2 damage to it.", () => {
    it("deals 2 damage to an enemy Unit after direct battle damage destroys a shield", () => {
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [st03Sinanju001] },
        { play: [enemy], deck: 2 },
      );
      seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(engine.resolveCombat({ attackerId: sinanjuId, target: "direct" }));

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

      expectSuccess(engine.resolveCombat({ attackerId: sinanjuId, target: "direct" }));

      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
      expect(p2.getDamage(enemyId)).toBe(2);
    });

    it("does not trigger when Sinanju destroys an enemy Unit instead of a shield-area card", () => {
      const enemy = createMockUnit({ hp: 1 });
      const engine = GundamTestEngine.create({ play: [st03Sinanju001] }, { play: [enemy] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(engine.resolveCombat({ attackerId: sinanjuId, target: enemyId }));

      expect(p2.getCardsInZone("trash")).toContain(enemyId);
      expect(engine.getPendingChoice()).toBeUndefined();
    });
  });
});
