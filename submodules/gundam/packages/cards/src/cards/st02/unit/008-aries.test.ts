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
import { st02Aries008 } from "./008-aries.ts";

describe("Aries (ST02-008)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("rests Aries and redirects a Unit attack to it", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ name: "Original Target", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: originalTarget, exhausted: true }, st02Aries008] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, ariesId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectSuccess(p2.declareBlock(ariesId!));

      expectAttackRedirectedTo(engine, ariesId!);
      expect(p2.isExhausted(ariesId!)).toBe(true);
      expect(p2.getDamage(originalTargetId!)).toBe(0);
    });

    it("redirects a direct attack before it damages the player", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create({ play: [attacker] }, { play: [st02Aries008] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const ariesId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(ariesId));
      expectAttackRedirectedTo(engine, ariesId);
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(ariesId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getBoardView().winner).toBeUndefined();
    });

    it("cannot block while Aries is already rested", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ name: "Original Target", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [
            { card: originalTarget, exhausted: true },
            { card: st02Aries008, exhausted: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, ariesId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectFailure(p2.declareBlock(ariesId!), "CANNOT_BLOCK");

      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: originalTargetId });
    });

    it("cannot block when Aries was the original attack target", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: st02Aries008, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const ariesId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, ariesId));
      expectFailure(p2.declareBlock(ariesId), "BLOCKER_IS_TARGET");

      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: ariesId });
    });

    it("cannot block an attacker with <High-Maneuver>", () => {
      const attacker = createMockUnit({
        name: "High-Maneuver Attacker",
        ap: 1,
        hp: 5,
        keywordEffects: [{ keyword: "HighManeuver" }],
      });
      const originalTarget = createMockUnit({ name: "Original Target", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: originalTarget, exhausted: true }, st02Aries008] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, ariesId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectFailure(p2.declareBlock(ariesId!), "CANNOT_BLOCK_HIGH_MANEUVER");

      expect(p2.isExhausted(ariesId!)).toBe(false);
      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: originalTargetId });
    });
  });
});
