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
  getDamageCounter,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03GundamNt1001 } from "./001-gundam-nt-1.ts";

describe("Gundam NT-1 (GD03-001)", () => {
  it("has printed Repair 2 in effective stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03GundamNt1001] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);

    expect(stats.keywords).toContain("Repair");
  });

  describe("【When Paired】Choose 1 rested enemy Unit. Deal 1 damage to it. When this effect destroys an enemy Unit, draw 1.", () => {
    it("deals 1 damage to a rested enemy Unit and draws 1 when that damage destroys it", () => {
      const pilot = createMockPilot({ name: "Christina Mackenzie", cost: 1 });
      const fragileEnemy = createMockUnit({ hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd03GundamNt1001],
          resourceArea: activeResources(5),
          deck: 3,
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const nt1Id = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.assignPilot(pilot, nt1Id));

      expectCardInTrash(engine, enemyId, PLAYER_TWO);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
      expect(p1.getCardsInZone("hand")).toHaveLength(1);
    });

    it("does not draw when the effect damage does not destroy the enemy Unit", () => {
      const pilot = createMockPilot({ name: "Amuro Ray", cost: 1 });
      const sturdyEnemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd03GundamNt1001],
          resourceArea: activeResources(5),
          deck: 3,
        },
        { play: [{ card: sturdyEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const nt1Id = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.assignPilot(pilot, nt1Id));

      expect(getDamageCounter(engine, enemyId)).toBe(1);
      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
      expect(p1.getCardsInZone("hand")).toHaveLength(0);
    });

    it("does not hit active enemy Units", () => {
      const pilot = createMockPilot({ cost: 1 });
      const activeEnemy = createMockUnit({ hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd03GundamNt1001],
          resourceArea: activeResources(5),
          deck: 3,
        },
        { play: [activeEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const nt1Id = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, nt1Id));

      expect(getDamageCounter(engine, enemyId)).toBe(0);
      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
      expect(p1.getCardsInZone("hand")).toHaveLength(0);
    });
  });
});
