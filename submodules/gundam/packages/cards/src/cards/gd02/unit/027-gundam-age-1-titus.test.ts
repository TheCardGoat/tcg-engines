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
import { gd02GundamAge1Titus027 } from "./027-gundam-age-1-titus.ts";
import { gd02FlitAsuno088 } from "../pilot/088-flit-asuno.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam AGE-1 Titus (GD02-027)", () => {
  describe("Printed Lv.7 and cost 4", () => {
    it("cannot deploy with only 6 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAge1Titus027],
        resourceArea: activeResources(6),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 3 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 4 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamAge1Titus027],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: [Flit Asuno]", () => {
    it("can attack on its deploy turn after Flit Asuno is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAge1Titus027, gd02FlitAsuno088],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamAge1Titus027));
      const titusId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02FlitAsuno088, titusId));
      expectSuccess(p1.enterBattle(titusId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: titusId });
    });

    it("cannot attack on its deploy turn after a different Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAge1Titus027, gd02JeridMessa086],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamAge1Titus027));
      const titusId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02JeridMessa086, titusId));

      expectFailure(p1.enterBattle(titusId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("<Breach 3>", () => {
    it("destroys one Shield after Titus destroys an enemy Unit with battle damage", () => {
      const defender = createMockUnit({ ap: 0, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          play: [gd02GundamAge1Titus027],
          shieldArea: [createMockUnit()],
          deck: 5,
        },
        { play: [defender], shieldArea: [createMockUnit()], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const titusId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      resolveUnitBattle(engine, PLAYER_ONE, titusId, defenderId);

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(shieldsBefore - 1);
    });

    it("deals 3 visible damage to the enemy Base after a battle-damage destruction", () => {
      const defender = createMockUnit({ ap: 0, hp: 3 });
      const base = createMockBase({ hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [gd02GundamAge1Titus027],
          shieldArea: [createMockUnit()],
          deck: 5,
        },
        { play: [defender], baseSection: [base], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const titusId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      resolveUnitBattle(engine, PLAYER_ONE, titusId, defenderId);

      expect(p2.getDamage(baseId)).toBe(3);
      expect(p2.getCardZone(baseId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p1.getVisibleCard(titusId)?.keywordEffects).toContainEqual({
        keyword: "Breach",
        value: 3,
      });
    });
  });
});
