import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st08GustavKarlType00008 } from "./008-gustav-karl-type-00.ts";

describe("Gustav Karl Type-00 (ST08-008)", () => {
  describe("Printed Lv.3 and cost 3", () => {
    it("deploys for three active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st08GustavKarlType00008],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08GustavKarlType00008));
      expect(p1.getCardsInZone("resourceArea").every((id) => p1.isExhausted(id))).toBe(true);
    });

    it("cannot deploy below Lv.3", () => {
      const engine = GundamTestEngine.create({
        hand: [st08GustavKarlType00008],
        resourceArea: activeResources(2),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st08GustavKarlType00008),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });
  });

  describe("While 3 or more enemy Units are in play, this Unit gains <Blocker>.", () => {
    function keywordsWithEnemyCount(count: number): readonly string[] {
      const enemies = Array.from({ length: count }, () => createMockUnit({ ap: 1, hp: 3 }));
      const engine = GundamTestEngine.create(
        { play: [st08GustavKarlType00008] },
        { play: enemies },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gustavId] = p1.getCardsInZone("battleArea");
      expectSuccess(p1.passPhase());

      return p1.getVisibleCard(gustavId!)?.keywords ?? [];
    }

    it("gains Blocker while 3 enemy Units are in play", () => {
      expect(keywordsWithEnemyCount(3)).toContain("Blocker");
    });

    it("does not gain Blocker with only 2 enemy Units in play", () => {
      expect(keywordsWithEnemyCount(2)).not.toContain("Blocker");
    });

    it("uses the conditional Blocker grant to intercept an attack", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const otherEnemies = Array.from({ length: 3 }, () => createMockUnit({ ap: 1, hp: 3 }));
      const engine = GundamTestEngine.create(
        { play: [attacker, ...otherEnemies] },
        { play: [{ card: defender, exhausted: true }, st08GustavKarlType00008] },
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
      });
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(blockerId)).toBe(3);
    });

    it("cannot block while only 2 enemy Units are in play", () => {
      const attacker = createMockUnit({ ap: 2, hp: 5 });
      const other = createMockUnit();
      const engine = GundamTestEngine.create(
        { play: [attacker, other] },
        { play: [st08GustavKarlType00008] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gustavId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectFailure(p2.declareBlock(gustavId), "CANNOT_BLOCK_DIRECT");
      expect(p2.isExhausted(gustavId)).toBe(false);
    });

    it("loses Blocker immediately when the third enemy Unit leaves play", () => {
      const victim = createMockUnit({ hp: 1 });
      const engine = GundamTestEngine.create(
        { play: [st08GustavKarlType00008] },
        { play: [{ card: victim, exhausted: true }, createMockUnit(), createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gustavId = p1.getCardsInZone("battleArea")[0]!;
      const victimId = p2.getCardsInZone("battleArea")[0]!;
      expect(p1.getVisibleCard(gustavId)?.keywords).toContain("Blocker");
      expectSuccess(p1.enterBattle(gustavId, victimId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getCardZone(victimId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getVisibleCard(gustavId)?.keywords).not.toContain("Blocker");
    });
  });
});
