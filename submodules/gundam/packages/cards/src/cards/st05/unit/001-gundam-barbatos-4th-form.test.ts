import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { st05GundamBarbatos4thForm001 } from "./001-gundam-barbatos-4th-form.ts";

describe("Gundam Barbatos 4th Form (ST05-001)", () => {
  describe("【Deploy】Choose 1 of your other Units. Deal 1 damage to it. It gets AP+1 during this turn.", () => {
    function stats(engine: GundamTestEngine, cardId: string) {
      const fw = engine.getRuntime().getFrameworkReadAPI();
      return getEffectiveStats(cardId, engine.getG(), fw.cards, fw);
    }

    it("data encodes other-friendly target for both damage and AP+1", () => {
      const effect = st05GundamBarbatos4thForm001.effects?.[0];
      const target = { owner: "friendly", cardType: "unit", excludeSource: true, count: 1 };

      expect(effect?.type).toBe("triggered");
      expect(effect?.activation.timing).toEqual(["deploy"]);
      expect(effect?.directives).toEqual([
        { action: { action: "dealDamage", amount: 1, target } },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisTurn",
            target,
          },
        },
      ]);
    });

    it("damages and buffs the chosen other friendly Unit on deploy", () => {
      const ally = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st05GundamBarbatos4thForm001],
        play: [ally],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(st05GundamBarbatos4thForm001, { targets: [allyId!] }));

      expect(getDamageCounter(engine, allyId!)).toBe(1);
      expect(stats(engine, allyId!).ap).toBe(3);
    });
  });

  describe("While this is damaged, it gains <Suppression>.", () => {
    function keywords(engine: GundamTestEngine, cardId: string): string[] {
      const fw = engine.getRuntime().getFrameworkReadAPI();
      return getEffectiveStats(cardId, engine.getG(), fw.cards, fw).keywords;
    }

    it("data encodes self-damaged Suppression grant", () => {
      const effect = st05GundamBarbatos4thForm001.effects?.[1];

      expect(effect?.type).toBe("constant");
      expect(effect?.activation).toEqual({
        conditions: [{ type: "selfIsDamaged" }],
      });
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "grantKeyword",
            keyword: "Suppression",
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ]);
    });

    it("gains Suppression while damaged", () => {
      const engine = GundamTestEngine.create({ play: [st05GundamBarbatos4thForm001] });
      const [barbatosId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
      engine.getG().damage[barbatosId!] = 1;

      expect(keywords(engine, barbatosId!)).toContain("Suppression");
    });

    it("does not gain Suppression while undamaged", () => {
      const engine = GundamTestEngine.create({ play: [st05GundamBarbatos4thForm001] });
      const [barbatosId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

      expect(keywords(engine, barbatosId!)).not.toContain("Suppression");
    });
  });
});
