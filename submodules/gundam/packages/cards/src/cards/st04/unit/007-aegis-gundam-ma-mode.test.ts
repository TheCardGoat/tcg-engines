import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st04AegisGundamMaMode007 } from "./007-aegis-gundam-ma-mode.ts";

describe("Aegis Gundam (MA Mode) (ST04-007)", () => {
  describe("Printed Lv.4 and cost 3", () => {
    it("deploys from hand to the battle area and rests exactly 3 Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st04AegisGundamMaMode007],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const aegisId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(aegisId));

      expect(p1.getCardZone(aegisId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
      expect(p1.getVisibleCard(aegisId)?.keywords).toContain("Breach");
    });

    it("stays in hand below its printed Lv.4 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st04AegisGundamMaMode007],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const aegisId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(aegisId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(aegisId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("stays in hand when a legal deployment leaves only 2 active Resources", () => {
      const spender = createMockUnit({ name: "Resource Spender", level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, st04AegisGundamMaMode007],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [spenderId, aegisId] = p1.getHand();

      expectSuccess(p1.deployUnit(spenderId!));
      expectFailure(p1.deployUnit(aegisId!), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(aegisId!)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st04AegisGundamMaMode007],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aegisId = p1.getHand()[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(aegisId), "WRONG_PHASE");

      expect(p1.getCardZone(aegisId)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)", () => {
    it("destroys the enemy's top Shield after destroying a Unit with battle damage", () => {
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 3 });
      const shield = createMockUnit({ name: "Shield" });
      const engine = GundamTestEngine.create(
        { play: [st04AegisGundamMaMode007] },
        { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aegisId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(aegisId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    });

    it("deals exactly 3 damage to the enemy Base before any Shield", () => {
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 3 });
      const base = createMockBase({ name: "Base", hp: 5 });
      const shield = createMockUnit({ name: "Shield" });
      const engine = GundamTestEngine.create(
        { play: [st04AegisGundamMaMode007] },
        {
          play: [{ card: defender, exhausted: true }],
          baseSection: [base],
          shieldArea: [shield],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aegisId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.enterBattle(aegisId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(baseId)).toBe(3);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
    });

    it("does not activate when the enemy Unit survives battle damage", () => {
      const defender = createMockUnit({ name: "Surviving Defender", ap: 0, hp: 4 });
      const shield = createMockUnit({ name: "Shield" });
      const engine = GundamTestEngine.create(
        { play: [st04AegisGundamMaMode007] },
        { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aegisId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(aegisId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(defenderId)).toBe(3);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
    });

    it("still activates when both battling Units are destroyed", () => {
      const defender = createMockUnit({ name: "Mutual-Kill Defender", ap: 4, hp: 3 });
      const shield = createMockUnit({ name: "Shield" });
      const engine = GundamTestEngine.create(
        { play: [st04AegisGundamMaMode007] },
        { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aegisId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(aegisId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getCardZone(aegisId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    });

    it("cleanly does nothing when the opponent has no Base or Shields", () => {
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 3 });
      const engine = GundamTestEngine.create(
        { play: [st04AegisGundamMaMode007] },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aegisId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(aegisId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    });
  });
});
