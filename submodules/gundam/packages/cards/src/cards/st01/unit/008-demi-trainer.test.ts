import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectAttackRedirectedTo,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st01DemiTrainer008 } from "./008-demi-trainer.ts";

describe("Demi Trainer (ST01-008)", () => {
  describe("Printed Lv.1 and cost 1", () => {
    it("cannot deploy without a Resource", () => {
      const engine = GundamTestEngine.create({ hand: [st01DemiTrainer008] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy when its only Resource is rested", () => {
      const engine = GundamTestEngine.create({
        hand: [st01DemiTrainer008],
        resourceArea: restedResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");
      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("deploys from hand to the battle area for 1 active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st01DemiTrainer008],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(cardId));

      expect(p1.getHand()).not.toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toContain(cardId);
      expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(cardId)?.keywords).toContain("Blocker");
    });
  });

  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("rests Demi Trainer and redirects a Unit attack to it", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: originalTarget, exhausted: true }, st01DemiTrainer008] },
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

    it("can redirect a direct attack before it damages the player", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create({ play: [attacker] }, { play: [st01DemiTrainer008] });
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

    it("cannot block while Demi Trainer is already rested", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [
            { card: originalTarget, exhausted: true },
            { card: st01DemiTrainer008, exhausted: true },
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

    it("cannot block when Demi Trainer was the original attack target", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: st01DemiTrainer008, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, blockerId));
      expectFailure(p2.declareBlock(blockerId), "BLOCKER_IS_TARGET");

      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: blockerId });
    });

    it("cannot block an attacker with High-Maneuver", () => {
      const attacker = createMockUnit({
        ap: 1,
        hp: 5,
        keywordEffects: [{ keyword: "HighManeuver" }],
      });
      const originalTarget = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: originalTarget, exhausted: true }, st01DemiTrainer008] },
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
