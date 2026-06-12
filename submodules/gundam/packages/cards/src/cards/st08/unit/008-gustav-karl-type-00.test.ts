import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectAttackRedirectedTo,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { st08GustavKarlType00008 } from "./008-gustav-karl-type-00.ts";

describe("Gustav Karl Type-00 (ST08-008)", () => {
  describe("While 3 or more enemy Units are in play, this Unit gains <Blocker>.", () => {
    function keywordsWithEnemyCount(count: number): string[] {
      const enemies = Array.from({ length: count }, () => createMockUnit({ ap: 1, hp: 3 }));
      const engine = GundamTestEngine.create(
        { play: [st08GustavKarlType00008] },
        { play: enemies },
      );
      const [gustavId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
      const fw = engine.getRuntime().getFrameworkReadAPI();

      return getEffectiveStats(gustavId!, engine.getG(), fw.cards, fw).keywords;
    }

    it("data encodes the enemy Unit count condition and self Blocker grant", () => {
      const effect = st08GustavKarlType00008.effects?.[0];

      expect(effect?.type).toBe("constant");
      expect(effect?.activation).toEqual({
        conditions: [{ type: "unitCount", owner: "opponent", comparison: "gte", count: 3 }],
      });
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ]);
    });

    it("gains Blocker while 3 enemy Units are in play", () => {
      expect(keywordsWithEnemyCount(3)).toContain("Blocker");
    });

    it("does not gain Blocker with only 2 enemy Units in play", () => {
      expect(keywordsWithEnemyCount(2)).not.toContain("Blocker");
    });

    it("uses the conditional Blocker grant to intercept an attack", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const otherEnemies = Array.from({ length: 3 }, () => createMockUnit({ ap: 1, hp: 3 }));
      const engine = GundamTestEngine.create(
        { play: [attacker, ...otherEnemies] },
        { play: [defender, st08GustavKarlType00008] },
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
