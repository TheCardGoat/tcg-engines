import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectAttackRedirectedTo,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { st09BlastImpulseGundam007 } from "./007-blast-impulse-gundam.ts";

describe("Blast Impulse Gundam (ST09-007)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("rests Blast Impulse Gundam and redirects a Unit attack to it", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 6 });
      const originalTarget = createMockUnit({ name: "Original Target", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: originalTarget, exhausted: true }, st09BlastImpulseGundam007] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, blockerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectSuccess(p2.declareBlock(blockerId!));

      expectAttackRedirectedTo(engine, blockerId!);
      expect(p2.isExhausted(blockerId!)).toBe(true);
      expect(p2.getDamage(originalTargetId!)).toBe(0);
    });

    it("redirects a direct attack before it damages the player", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [st09BlastImpulseGundam007] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(blockerId));
      expectAttackRedirectedTo(engine, blockerId);
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(blockerId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getBoardView().winner).toBeUndefined();
    });

    it("cannot block while Blast Impulse Gundam is already rested", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 6 });
      const originalTarget = createMockUnit({ name: "Original Target", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [
            { card: originalTarget, exhausted: true },
            { card: st09BlastImpulseGundam007, exhausted: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, blockerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectFailure(p2.declareBlock(blockerId!), "CANNOT_BLOCK");

      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: originalTargetId });
    });

    it("cannot block when Blast Impulse Gundam was the original attack target", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: st09BlastImpulseGundam007, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, blockerId));
      expectFailure(p2.declareBlock(blockerId), "BLOCKER_IS_TARGET");

      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: blockerId });
    });

    it("cannot block an attacker with <High-Maneuver>", () => {
      const attacker = createMockUnit({
        name: "High-Maneuver Attacker",
        ap: 1,
        hp: 6,
        keywordEffects: [{ keyword: "HighManeuver" }],
      });
      const originalTarget = createMockUnit({ name: "Original Target", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: originalTarget, exhausted: true }, st09BlastImpulseGundam007] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, blockerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectFailure(p2.declareBlock(blockerId!), "CANNOT_BLOCK_HIGH_MANEUVER");

      expect(p2.isExhausted(blockerId!)).toBe(false);
      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: originalTargetId });
    });
  });
});
