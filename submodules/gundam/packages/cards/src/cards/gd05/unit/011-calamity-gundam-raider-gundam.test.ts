import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05CalamityGundamRaiderGundam011 } from "./011-calamity-gundam-raider-gundam.ts";

describe("Calamity Gundam & Raider Gundam (GD05-011)", () => {
  /** @behavioral-proof complete: optional cost, trait/source exclusion, rested-enemy target, damage, and decline branch are public. */
  describe("【Deploy】You may choose 1 of your other active (Earth Alliance) Units. Rest it. If you do, choose 1 rested enemy Unit. Deal 2 damage to it.", () => {
    it("may rest another Earth Alliance Unit to deal 2 damage to a rested enemy", () => {
      const payer = createMockUnit({ traits: ["earth alliance"] });
      const wrongTrait = createMockUnit({ traits: ["zaft"] });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05CalamityGundamRaiderGundam011],
          play: [payer, wrongTrait],
          resourceArea: activeResources(5),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [payerId, wrongTraitId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd05CalamityGundamRaiderGundam011));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "targetSelection") throw new Error("Expected the optional rest cost");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [payerId],
      });
      expectSuccess(p1.resolveEffect({ targets: [payerId!] }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p1.isExhausted(payerId!)).toBe(true);
      expect(p1.isExhausted(wrongTraitId!)).toBe(false);
      expect(p2.getDamage(enemyId)).toBe(2);
    });

    it("does not damage an enemy when its optional rest cost is declined", () => {
      const payer = createMockUnit({ traits: ["earth alliance"] });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05CalamityGundamRaiderGundam011],
          play: [payer],
          resourceArea: activeResources(5),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const payerId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd05CalamityGundamRaiderGundam011));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "targetSelection") throw new Error("Expected the optional rest cost");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: false } }));

      expect(p1.isExhausted(payerId)).toBe(false);
      expect(p2.getDamage(enemyId)).toBe(0);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
