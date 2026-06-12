import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01DuelGundamAssaultShroud045 } from "./045-duel-gundam-assault-shroud.ts";

describe("Duel Gundam (Assault Shroud) (GD01-045)", () => {
  it("data keeps the printed top-3 deploy-from-deck text visible", () => {
    const effect = gd01DuelGundamAssaultShroud045.effects?.[0];

    expect(effect?.activation.timing).toEqual(["whenPaired"]);
    expect(effect?.sourceText).toContain("Look at the top 3 cards of your deck");
    expect(effect?.sourceText).toContain("deploy 1 (ZAFT) Unit card");
  });

  describe("【When Paired】Look at the top 3 cards of your deck. You may deploy 1 (ZAFT) Unit card that is Lv.4 or lower among them. Return the remaining cards randomly to the bottom of your deck.", () => {
    it("deploys a matching ZAFT Unit with Lv.4 or lower from the top 3 cards", () => {
      const pilot = createMockPilot({ level: 1, cost: 1 });
      const zaftUnit = createMockUnit({ traits: ["zaft"], level: 4, cost: 2 });
      const nonZaftUnit = createMockUnit({ traits: ["earth federation"], level: 3, cost: 2 });
      const highLevelZaftUnit = createMockUnit({ traits: ["zaft"], level: 5, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [gd01DuelGundamAssaultShroud045],
        resourceArea: activeResources(1),
        deck: [nonZaftUnit, zaftUnit, highLevelZaftUnit],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const duelId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, duelId));

      const battleArea = p1.getCardsInZone("battleArea");
      const hand = p1.getHand();
      const deployedZaftId = battleArea.find((id) => id.includes(`_${zaftUnit.cardNumber}_`));

      expect(deployedZaftId).toBeDefined();
      expect(hand.some((id) => id.includes(`_${zaftUnit.cardNumber}_`))).toBe(false);
      expect(engine.getG().turnMetadata.deployedThisTurn).toContain(deployedZaftId);
    });

    it("does not deploy a Unit when the top cards have no matching ZAFT Lv.4 or lower Unit", () => {
      const pilot = createMockPilot({ level: 1, cost: 1 });
      const nonZaftUnit = createMockUnit({ traits: ["earth federation"], level: 3, cost: 2 });
      const highLevelZaftUnit = createMockUnit({ traits: ["zaft"], level: 5, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [gd01DuelGundamAssaultShroud045],
        resourceArea: activeResources(1),
        deck: [nonZaftUnit, highLevelZaftUnit],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const duelId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, duelId));

      expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
      expect(p1.getHand()).toHaveLength(0);
    });
  });
});
