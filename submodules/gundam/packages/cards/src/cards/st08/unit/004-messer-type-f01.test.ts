import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st08MesserTypeF01004 } from "./004-messer-type-f01.ts";

describe("Messer Type-F01 (ST08-004)", () => {
  describe("【Attack】If this Unit is attacking an enemy Unit, choose 1 enemy Unit. Deal 1 damage to it.", () => {
    it("deals 1 damage to an enemy Unit when attacking an enemy Unit", () => {
      const defender = createMockUnit({ cardNumber: "TEST-MESSER-DEFENDER", hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [st08MesserTypeF01004] },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [defenderId],
      });
      expectSuccess(p1.resolveEffect({ targets: [defenderId] }));

      expect(p2.getDamage(defenderId)).toBe(1);
    });

    it("does not deal effect damage when attacking the enemy player directly", () => {
      const bystander = createMockUnit({ cardNumber: "TEST-MESSER-BYSTANDER", hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [st08MesserTypeF01004] },
        { play: [bystander] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const bystanderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(bystanderId)).toBe(0);
    });
  });
});
