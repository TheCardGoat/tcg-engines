import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { st01Gundam001 } from "./001-gundam.ts";

describe("Gundam (ST01-001)", () => {
  describe("<Repair 2>", () => {
    it("data declares Repair 2", () => {
      expect(st01Gundam001.keywordEffects).toEqual([{ keyword: "Repair", value: 2 }]);
    });

    it("recovers 2 damage at the end of its controller's turn", () => {
      const engine = GundamTestEngine.create({ play: [st01Gundam001], deck: 5 }, { deck: 5 });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundamId] = p1.getCardsInZone("battleArea");
      engine.getG().damage[gundamId!] = 3;

      engine.endTurn();

      expect(getDamageCounter(engine, gundamId!)).toBe(1);
    });
  });

  describe("【During Pair】During your turn, all your Units get AP+1.", () => {
    function friendlyStats(engine: GundamTestEngine, cardId: string) {
      const fw = engine.getRuntime().getFrameworkReadAPI();
      return getEffectiveStats(cardId, engine.getG(), fw.cards, fw);
    }

    it("data encodes during-pair AP+1 for friendly Units during your turn", () => {
      const effect = st01Gundam001.effects?.[0];

      expect(effect?.type).toBe("constant");
      expect(effect?.activation).toEqual({
        conditions: [{ type: "duringPair" }, { type: "isTurn", whose: "friendly" }],
      });
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: { owner: "friendly", cardType: "unit" },
          },
        },
      ]);
    });

    it("buffs all friendly Units while paired on its controller's turn", () => {
      const ally = createMockUnit({ ap: 2, hp: 4 });
      const amuro = createMockPilot({ name: "Amuro Ray", level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [amuro],
        play: [st01Gundam001, ally],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundamId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(amuro, st01Gundam001));

      expect(friendlyStats(engine, gundamId!).ap).toBe(5);
      expect(friendlyStats(engine, allyId!).ap).toBe(3);
    });

    it("does not buff friendly Units on the opponent's turn", () => {
      const ally = createMockUnit({ ap: 2, hp: 4 });
      const amuro = createMockPilot({ name: "Amuro Ray", level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [amuro],
          play: [st01Gundam001, ally],
          resourceArea: activeResources(4),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundamId, allyId] = p1.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(amuro, st01Gundam001));

      engine.endTurn();

      expect(engine.getState().ctx.status.turnPlayer).toBe(PLAYER_TWO);
      expect(friendlyStats(engine, gundamId!).ap).toBe(4);
      expect(friendlyStats(engine, allyId!).ap).toBe(2);
    });
  });
});
