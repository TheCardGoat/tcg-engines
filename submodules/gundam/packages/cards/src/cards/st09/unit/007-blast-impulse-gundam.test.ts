import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09BlastImpulseGundam007 } from "./007-blast-impulse-gundam.ts";

describe("Blast Impulse Gundam (ST09-007)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("intercepts an attack targeted at another friendly unit", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: defender, exhausted: true }, st09BlastImpulseGundam007] },
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

      expect(p2.getCardZone(defenderId)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getCardZone(blockerId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });
});
