import { describe, expect, it } from "vite-plus/test";
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
import { gd04KikerogaMsModeGq022 } from "./022-kikeroga-ms-mode-gq.ts";

describe("Kikeroga (MS Mode) (GQ) (GD04-022)", () => {
  describe("All your Unit tokens gain <Breach 1>.", () => {
    it("makes a friendly Unit token deal 1 Breach damage after destroying an enemy Unit in battle", () => {
      const token = createMockUnit({ name: "Friendly Unit Token", ap: 2, hp: 3 });
      const defender = createMockUnit({ name: "Fragile Enemy", ap: 0, hp: 1 });
      const base = createMockBase({ hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd04KikerogaMsModeGq022, { card: token, isToken: true }] },
        { play: [{ card: defender, exhausted: true }], baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [, tokenId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.enterBattle(tokenId!, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(baseId)).toBe(1);
    });

    it("does not grant Breach to a friendly non-token Unit", () => {
      const nonToken = createMockUnit({ name: "Friendly Non-Token", ap: 2, hp: 3 });
      const defender = createMockUnit({ name: "Fragile Enemy", ap: 0, hp: 1 });
      const base = createMockBase({ hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd04KikerogaMsModeGq022, nonToken] },
        { play: [{ card: defender, exhausted: true }], baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [, nonTokenId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.enterBattle(nonTokenId!, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(baseId)).toBe(0);
    });
  });

  describe("【During Link】All Units that are Lv.3 or lower other than Unit tokens are deployed rested.", () => {
    it("deploys a Lv.3 Unit rested and leaves a Lv.4 Unit active while linked", () => {
      const challia = createMockPilot({ name: "Challia Bull", level: 1, cost: 1 });
      const levelThreeUnit = createMockUnit({ name: "Lv.3 Unit", level: 3, cost: 1, hp: 3 });
      const levelFourUnit = createMockUnit({ name: "Lv.4 Unit", level: 4, cost: 1, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [challia, levelThreeUnit, levelFourUnit],
        play: [gd04KikerogaMsModeGq022],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const kikerogaId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(challia, kikerogaId));
      expectSuccess(p1.deployUnit(levelThreeUnit));
      expectSuccess(p1.deployUnit(levelFourUnit));

      expect(p1.isExhausted(levelThreeUnit)).toBe(true);
      expect(p1.isExhausted(levelFourUnit)).toBe(false);
    });

    it("deploys a Lv.3 Unit active when Kikeroga is not linked", () => {
      const levelThreeUnit = createMockUnit({ name: "Lv.3 Unit", level: 3, cost: 1, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [levelThreeUnit],
        play: [gd04KikerogaMsModeGq022],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(levelThreeUnit));

      expect(p1.isExhausted(levelThreeUnit)).toBe(false);
    });
  });
});
