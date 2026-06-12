import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockUnit,
  expectAttackRedirectedTo,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { st09FreedomGundam004 } from "./004-freedom-gundam.ts";

function effectiveKeywords(engine: GundamTestEngine): string[] {
  const rt = engine.getRuntime();
  const uid = rt.getInstanceIdByDefinition(
    PLAYER_ONE as PlayerId,
    st09FreedomGundam004.cardNumber,
  )!;
  const fw = rt.getFrameworkReadAPI();
  return getEffectiveStats(uid, engine.getG(), fw.cards, fw).keywords;
}

describe("Freedom Gundam (ST09-004)", () => {
  describe("<Blocker> and friendly-Base Suppression", () => {
    it("data declares printed Blocker and constant Suppression grant", () => {
      expect(st09FreedomGundam004.keywordEffects).toEqual([{ keyword: "Blocker" }]);
      const effect = st09FreedomGundam004.effects?.[0];
      const directive = effect?.directives[0];

      expect(effect?.type).toBe("constant");
      expect(effect?.activation).toEqual({
        conditions: [{ type: "friendlyBaseInPlay" }],
      });
      if (!directive || !("action" in directive) || directive.action.action !== "grantKeyword") {
        throw new Error("Unexpected directive shape");
      }
      expect(directive.action).toEqual({
        action: "grantKeyword",
        keyword: "Suppression",
        duration: "permanent",
        target: { owner: "self", cardType: "unit" },
      });
    });

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
        { play: [defender, st09FreedomGundam004] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p2.declareBlock(blockerId));

      expectAttackRedirectedTo(engine, blockerId);
      expect(engine.getG().turnMetadata.pendingCombat?.target).toBe(defenderId);
    });
  });
});
