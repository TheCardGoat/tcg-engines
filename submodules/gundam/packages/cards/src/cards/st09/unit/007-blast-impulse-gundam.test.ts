import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectAttackRedirectedTo,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09BlastImpulseGundam007 } from "./007-blast-impulse-gundam.ts";

describe("Blast Impulse Gundam (ST09-007)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("declares Blocker and no structured triggered effects", () => {
      expect(st09BlastImpulseGundam007.keywordEffects).toEqual([{ keyword: "Blocker" }]);
      expect(st09BlastImpulseGundam007.effects ?? []).toEqual([]);
      expect(st09BlastImpulseGundam007.linkCondition).toBe("[Shinn Asuka]");
      expect(st09BlastImpulseGundam007.traits).toContain("minerva squad");
    });

    it("intercepts an attack targeted at another friendly unit", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [defender, st09BlastImpulseGundam007] },
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
