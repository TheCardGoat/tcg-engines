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
} from "@tcg/gundam-engine";
import { st04Moebius004 } from "./004-moebius.ts";

describe("Moebius (ST04-004)", () => {
  describe("Printed Lv.1 and cost 1", () => {
    it("deploys from hand to the battle area and rests exactly 1 Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st04Moebius004],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const moebiusId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(moebiusId));

      expect(p1.getCardZone(moebiusId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
      expect(p1.getVisibleCard(moebiusId)?.keywords).toContain("Blocker");
    });

    it("stays in hand without the Resource required by its printed Lv.1", () => {
      const engine = GundamTestEngine.create({ hand: [st04Moebius004] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const moebiusId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(moebiusId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(moebiusId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("stays in hand when another legal play rests its only Resource", () => {
      const spender = createMockUnit({ name: "Resource Spender", level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [spender, st04Moebius004],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [spenderId, moebiusId] = p1.getHand();

      expectSuccess(p1.deployUnit(spenderId!));
      expectFailure(p1.deployUnit(moebiusId!), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(moebiusId!)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st04Moebius004],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const moebiusId = p1.getHand()[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(moebiusId), "WRONG_PHASE");

      expect(p1.getCardZone(moebiusId)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("rests Moebius, redirects a Unit attack, and protects the original target", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ name: "Original Target", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: originalTarget, exhausted: true }, st04Moebius004] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, moebiusId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectSuccess(p2.declareBlock(moebiusId!));

      expectAttackRedirectedTo(engine, moebiusId!);
      expect(p2.isExhausted(moebiusId!)).toBe(true);
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getDamage(originalTargetId!)).toBe(0);
      expect(p2.getCardZone(moebiusId!)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("can redirect a direct attack before a Shield is damaged", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const shield = createMockUnit({ name: "Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [st04Moebius004], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const moebiusId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(moebiusId));
      expectAttackRedirectedTo(engine, moebiusId);
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
      expect(p1.getBoardView().winner).toBeUndefined();
    });

    it("cannot block while already rested", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ name: "Original Target", hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [
            { card: originalTarget, exhausted: true },
            { card: st04Moebius004, exhausted: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, moebiusId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectFailure(p2.declareBlock(moebiusId!), "CANNOT_BLOCK");

      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: originalTargetId });
    });

    it("cannot block when Moebius was the original attack target", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: st04Moebius004, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const moebiusId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, moebiusId));
      expectFailure(p2.declareBlock(moebiusId), "BLOCKER_IS_TARGET");

      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: moebiusId });
    });

    it("cannot block an attacker with High-Maneuver", () => {
      const attacker = createMockUnit({
        name: "High-Maneuver Attacker",
        ap: 1,
        hp: 5,
        keywordEffects: [{ keyword: "HighManeuver" }],
      });
      const originalTarget = createMockUnit({ name: "Original Target", hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: originalTarget, exhausted: true }, st04Moebius004] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, moebiusId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectFailure(p2.declareBlock(moebiusId!), "CANNOT_BLOCK_HIGH_MANEUVER");

      expect(p2.isExhausted(moebiusId!)).toBe(false);
      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: originalTargetId });
    });
  });
});
