import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GundamEpyon002 } from "./002-gundam-epyon.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam Epyon (GD02-002)", () => {
  describe("Printed Lv.8 and cost 7", () => {
    it("cannot deploy with only 7 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamEpyon002],
        resourceArea: activeResources(7),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 6 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamEpyon002],
        resourceArea: activeResources(8),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("【During Link】【Once per Turn】During your turn, when one of your Units destroys an enemy Unit with battle damage, set this Unit as active.", () => {
    it("sets linked Epyon active when another friendly Unit destroys an enemy Unit in battle", () => {
      const zechs = createMockPilot({ name: "Zechs Merquise" });
      const attacker = createMockUnit({ ap: 4, hp: 5 });
      const defender = createMockUnit({ ap: 0, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [zechs],
          play: [gd02GundamEpyon002, attacker],
          resourceArea: activeResources(8),
          baseSection: [createMockBase({ hp: 20 })],
          deck: 5,
        },
        { play: [defender], baseSection: [createMockBase({ hp: 20 })], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [epyonId, attackerId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.assignPilot(zechs, epyonId!));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [epyonId!]);
      expect(p1.isExhausted(epyonId!)).toBe(true);
      resolveUnitBattle(engine, PLAYER_ONE, attackerId!, defenderId);

      expect(p1.isExhausted(epyonId!)).toBe(false);
      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("sets Epyon active only once during the turn", () => {
      const zechs = createMockPilot({ name: "Zechs Merquise" });
      const firstAttacker = createMockUnit({ ap: 4, hp: 5 });
      const firstDefender = createMockUnit({ ap: 0, hp: 1 });
      const secondDefender = createMockUnit({ ap: 0, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [zechs],
          play: [gd02GundamEpyon002, firstAttacker],
          resourceArea: activeResources(8),
          baseSection: [createMockBase({ hp: 20 })],
          deck: 5,
        },
        {
          play: [firstDefender, secondDefender],
          baseSection: [createMockBase({ hp: 20 })],
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [epyonId, firstAttackerId] = p1.getCardsInZone("battleArea");
      const [firstDefenderId, secondDefenderId] = p2.getCardsInZone("battleArea");

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [firstDefenderId!, secondDefenderId!]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.assignPilot(zechs, epyonId!));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [epyonId!]);
      resolveUnitBattle(engine, PLAYER_ONE, firstAttackerId!, firstDefenderId!);
      expect(p1.isExhausted(epyonId!)).toBe(false);
      resolveUnitBattle(engine, PLAYER_ONE, epyonId!, secondDefenderId!);

      expect(p1.isExhausted(epyonId!)).toBe(true);
      expect(p2.getCardZone(secondDefenderId!)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("does not set Epyon active while paired but not linked", () => {
      const wrongPilot = createMockPilot({ name: "Ordinary Pilot" });
      const attacker = createMockUnit({ ap: 4, hp: 5 });
      const defender = createMockUnit({ ap: 0, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [wrongPilot],
          play: [gd02GundamEpyon002, attacker],
          resourceArea: activeResources(8),
          baseSection: [createMockBase({ hp: 20 })],
          deck: 5,
        },
        { play: [defender], baseSection: [createMockBase({ hp: 20 })], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [epyonId, attackerId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.assignPilot(wrongPilot, epyonId!));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [epyonId!]);
      resolveUnitBattle(engine, PLAYER_ONE, attackerId!, defenderId);

      expect(p1.isExhausted(epyonId!)).toBe(true);
    });

    it("does not set Epyon active when a friendly Unit destroys an attacker on the opponent's turn", () => {
      const zechs = createMockPilot({ name: "Zechs Merquise" });
      const friendlyDefender = createMockUnit({ ap: 4, hp: 5 });
      const enemyAttacker = createMockUnit({ ap: 1, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [zechs],
          play: [gd02GundamEpyon002, friendlyDefender],
          resourceArea: activeResources(8),
          baseSection: [createMockBase({ hp: 20 })],
          deck: 5,
        },
        {
          play: [enemyAttacker],
          baseSection: [createMockBase({ hp: 20 })],
          deck: 5,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [epyonId, friendlyDefenderId] = p1.getCardsInZone("battleArea");
      const enemyAttackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(zechs, epyonId!));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [epyonId!, friendlyDefenderId!]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      resolveUnitBattle(engine, PLAYER_TWO, enemyAttackerId, friendlyDefenderId!);

      expect(p2.getCardZone(enemyAttackerId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.isExhausted(epyonId!)).toBe(true);
    });
  });
});
