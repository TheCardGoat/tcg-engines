import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Daughtress049 } from "./049-daughtress.ts";

describe("Daughtress (GD02-049)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.1 requirement", () => {
      const engine = GundamTestEngine.create({ hand: [gd02Daughtress049], resourceArea: [] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand after another legal deployment rests its active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02Daughtress049],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("【Activate･Main】<Support 1>", () => {
    it("rests itself and gives one other friendly Unit AP+1 during the turn", () => {
      const ally = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({ play: [gd02Daughtress049, ally] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [supporterId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.useSupport(supporterId!, allyId!));

      expect(p1.isExhausted(supporterId!)).toBe(true);
      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(3);
    });

    it("cannot support itself", () => {
      const engine = GundamTestEngine.create({ play: [gd02Daughtress049] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const supporterId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.useSupport(supporterId, supporterId), "ILLEGAL_TARGET");

      expect(p1.isExhausted(supporterId)).toBe(false);
      expect(p1.getVisibleCard(supporterId)?.effectiveAp).toBe(1);
    });
  });
});
