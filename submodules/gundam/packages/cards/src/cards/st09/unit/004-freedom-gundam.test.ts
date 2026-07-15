import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09FreedomGundam004 } from "./004-freedom-gundam.ts";

function effectiveKeywords(engine: GundamTestEngine): readonly string[] {
  const p1 = engine.asPlayer(PLAYER_ONE);
  const unitId = p1.getCardsInZone("battleArea")[0]!;
  return p1.getVisibleCard(unitId)?.keywords ?? [];
}

describe("Freedom Gundam (ST09-004)", () => {
  describe("<Blocker> and friendly-Base Suppression", () => {
    it("gains Suppression while a friendly Base is in play", () => {
      const base = createMockBase();
      const engine = GundamTestEngine.create(
        { play: [st09FreedomGundam004], baseSection: [base] },
        {},
      );

      expect(effectiveKeywords(engine)).toContain("Blocker");
      expect(effectiveKeywords(engine)).toContain("Suppression");
    });

    it("does not gain Suppression without a friendly Base", () => {
      const engine = GundamTestEngine.create({ play: [st09FreedomGundam004] }, {});

      expect(effectiveKeywords(engine)).toContain("Blocker");
      expect(effectiveKeywords(engine)).not.toContain("Suppression");
    });

    it("does not gain Suppression from an opponent's Base", () => {
      const base = createMockBase();
      const engine = GundamTestEngine.create(
        { play: [st09FreedomGundam004] },
        { baseSection: [base] },
      );

      expect(effectiveKeywords(engine)).not.toContain("Suppression");
    });

    it("uses Blocker to intercept an attack targeted at another friendly unit", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: defender, exhausted: true }, st09FreedomGundam004] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p2.declareBlock(blockerId));
      expect(p1.getBoardView().pendingCombat).toMatchObject({
        stage: "blocker-declared",
        blockerId,
        target: defenderId,
      });
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(blockerId)).toBe(3);
    });
  });
});
