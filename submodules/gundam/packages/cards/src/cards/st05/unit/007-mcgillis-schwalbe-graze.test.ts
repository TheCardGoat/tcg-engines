import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectAttackRedirectedTo,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { st05McgillisSchwalbeGraze007 } from "./007-mcgillis-schwalbe-graze.ts";

describe("McGillis' Schwalbe Graze (ST05-007)", () => {
  describe("<Blocker> and 【When Paired】AP-2 to enemy Lv.3-or-lower", () => {
    function effectiveAp(engine: GundamTestEngine, cardId: string): number {
      const fw = engine.getRuntime().getFrameworkReadAPI();
      return getEffectiveStats(cardId, engine.getG(), fw.cards, fw).ap;
    }

    it("data declares Blocker and a when-paired enemy Lv.3-or-lower AP-2 effect", () => {
      const effect = st05McgillisSchwalbeGraze007.effects?.[0];

      expect(st05McgillisSchwalbeGraze007.keywordEffects).toEqual([{ keyword: "Blocker" }]);
      expect(effect?.activation.timing).toEqual(["whenPaired"]);
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 3 }],
              count: 1,
            },
          },
        },
      ]);
    });

    it("applies AP-2 to the only enemy Lv.3 Unit when paired", () => {
      const mcgillis = createMockPilot({ name: "McGillis Fareed", level: 1, cost: 1 });
      const enemy = createMockUnit({ ap: 4, hp: 4, level: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [mcgillis],
          play: [st05McgillisSchwalbeGraze007],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(mcgillis, st05McgillisSchwalbeGraze007));

      expect(effectiveAp(engine, enemyId!)).toBe(2);
    });

    it("uses Blocker to intercept an attack", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [defender, st05McgillisSchwalbeGraze007] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p2.declareBlock(blockerId));

      expectAttackRedirectedTo(engine, blockerId);
    });
  });
});
