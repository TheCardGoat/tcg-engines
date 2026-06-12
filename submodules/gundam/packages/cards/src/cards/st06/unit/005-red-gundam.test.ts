import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { st06RedGundam005 } from "./005-red-gundam.ts";

describe("Red Gundam (ST06-005)", () => {
  describe("<Breach 1> and 【Attack】Choose 1 to 2 friendly (Clan) Units. They get AP+2 during this turn.", () => {
    function effectiveAp(engine: GundamTestEngine, cardId: string): number {
      const fw = engine.getRuntime().getFrameworkReadAPI();
      return getEffectiveStats(cardId, engine.getG(), fw.cards, fw).ap;
    }

    it("data declares Breach 1 and attack AP+2 for 1 to 2 friendly Clan Units", () => {
      const effect = st06RedGundam005.effects?.[0];

      expect(st06RedGundam005.keywordEffects).toEqual([{ keyword: "Breach", value: 1 }]);
      expect(effect?.activation.timing).toEqual(["attack"]);
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "clan" }],
              count: { min: 1, max: 2 },
            },
          },
        },
      ]);
    });

    it("buffs two chosen friendly Clan Units on attack", () => {
      const ally = createMockUnit({ traits: ["clan"], ap: 2, hp: 4 });
      const enemy = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create({ play: [st06RedGundam005, ally] }, { play: [enemy] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [redId, allyId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(redId!, enemyId!));
      if (engine.getPendingChoice()) {
        expectSuccess(p1.resolveEffect({ targets: [redId!, allyId!] }));
      }

      expect(effectiveAp(engine, redId!)).toBe(6);
      expect(effectiveAp(engine, allyId!)).toBe(4);
    });
  });
});
