import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { st01GundamAerialPermetScoreSix006 } from "./006-gundam-aerial-permet-score-six.ts";

describe("Gundam Aerial (Permet Score Six) (ST01-006)", () => {
  describe("【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-3 during this turn.", () => {
    function effectiveAp(engine: GundamTestEngine, cardId: string): number {
      const fw = engine.getRuntime().getFrameworkReadAPI();
      return getEffectiveStats(cardId, engine.getG(), fw.cards, fw).ap;
    }

    it("data encodes a when-paired AP-3 modifier for an enemy Lv.5-or-lower Unit", () => {
      const effect = st01GundamAerialPermetScoreSix006.effects?.[0];

      expect(effect?.type).toBe("triggered");
      expect(effect?.activation.timing).toEqual(["whenPaired"]);
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -3,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
              count: 1,
            },
          },
        },
      ]);
    });

    it("applies AP-3 to the chosen enemy Lv.5 Unit when paired", () => {
      const suletta = createMockPilot({ name: "Suletta Mercury", level: 1, cost: 1 });
      const enemy = createMockUnit({ ap: 5, hp: 5, level: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [suletta],
          play: [st01GundamAerialPermetScoreSix006],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unitId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(suletta, unitId!));

      expect(effectiveAp(engine, enemyId!)).toBe(2);
    });

    it("does not apply AP-3 to a Lv.6 enemy Unit", () => {
      const suletta = createMockPilot({ name: "Suletta Mercury", level: 1, cost: 1 });
      const enemy = createMockUnit({ ap: 5, hp: 5, level: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [suletta],
          play: [st01GundamAerialPermetScoreSix006],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unitId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(suletta, unitId!));

      expect(effectiveAp(engine, enemyId!)).toBe(5);
    });
  });
});
