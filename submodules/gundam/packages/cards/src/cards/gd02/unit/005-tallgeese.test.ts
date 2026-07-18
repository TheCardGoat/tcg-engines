import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Tallgeese005 } from "./005-tallgeese.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Tallgeese (GD02-005)", () => {
  describe("Printed Lv.4 and cost 3", () => {
    it("cannot deploy with only 3 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Tallgeese005],
        resourceArea: activeResources(3),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 2 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02Tallgeese005],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("【During Link】【Attack】Choose 1 enemy Unit with 2 or less HP. Rest it.", () => {
    it("offers only the 2 HP enemy and rests the player's chosen target while linked", () => {
      const ozPilot = createMockPilot({ traits: ["oz"] });
      const combatTarget = createMockUnit({ hp: 6 });
      const frailEnemy = createMockUnit({ hp: 2 });
      const sturdyEnemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [ozPilot],
          play: [gd02Tallgeese005],
          resourceArea: activeResources(5),
          shieldArea: [createMockUnit()],
          deck: 5,
        },
        { play: [combatTarget, frailEnemy, sturdyEnemy], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;
      const [combatTargetId, frailEnemyId, sturdyEnemyId] = p2.getCardsInZone("battleArea");

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [combatTargetId!]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.assignPilot(ozPilot, tallgeeseId));
      expectSuccess(p1.enterBattle(tallgeeseId, combatTargetId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [frailEnemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [frailEnemyId!] }));

      expect(p2.isExhausted(frailEnemyId!)).toBe(true);
      expect(p2.isExhausted(sturdyEnemyId!)).toBe(false);
    });

    it("does not publish the Attack effect while paired but not linked", () => {
      const wrongPilot = createMockPilot({ traits: ["titans"] });
      const combatTarget = createMockUnit({ hp: 6 });
      const frailEnemy = createMockUnit({ hp: 2 });
      const engine = GundamTestEngine.create(
        {
          hand: [wrongPilot],
          play: [gd02Tallgeese005],
          resourceArea: activeResources(5),
          shieldArea: [createMockUnit()],
          deck: 5,
        },
        { play: [combatTarget, frailEnemy], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;
      const [combatTargetId, frailEnemyId] = p2.getCardsInZone("battleArea");

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [combatTargetId!]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.assignPilot(wrongPilot, tallgeeseId));
      expectSuccess(p1.enterBattle(tallgeeseId, combatTargetId!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.isExhausted(frailEnemyId!)).toBe(false);
    });

    it("publishes no target when every enemy Unit has more than 2 HP", () => {
      const ozPilot = createMockPilot({ traits: ["oz"] });
      const combatTarget = createMockUnit({ hp: 6 });
      const otherEnemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [ozPilot],
          play: [gd02Tallgeese005],
          resourceArea: activeResources(5),
          shieldArea: [createMockUnit()],
          deck: 5,
        },
        { play: [combatTarget, otherEnemy], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;
      const [combatTargetId, otherEnemyId] = p2.getCardsInZone("battleArea");

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [combatTargetId!]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.assignPilot(ozPilot, tallgeeseId));
      expectSuccess(p1.enterBattle(tallgeeseId, combatTargetId!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.isExhausted(otherEnemyId!)).toBe(false);
    });
  });
});
