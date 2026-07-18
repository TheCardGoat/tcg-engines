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
import { gd02Byarlant004 } from "./004-byarlant.ts";
import { gd02FlitAsuno088 } from "../pilot/088-flit-asuno.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Byarlant (GD02-004)", () => {
  describe("Printed Lv.5 and cost 3", () => {
    it("cannot deploy with only 4 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Byarlant004],
        resourceArea: activeResources(4),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 2 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02Byarlant004],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: [Jerid Messa]", () => {
    it("can attack on its deploy turn after Jerid Messa is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Byarlant004, gd02JeridMessa086],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02Byarlant004));
      const byarlantId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02JeridMessa086, byarlantId));
      expectSuccess(p1.enterBattle(byarlantId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: byarlantId });
    });

    it("cannot attack on its deploy turn after a different Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Byarlant004, gd02FlitAsuno088],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02Byarlant004));
      const byarlantId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02FlitAsuno088, byarlantId));

      expectFailure(p1.enterBattle(byarlantId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("【When Paired】Choose 1 rested enemy Unit with 3 or less HP. It won't be set as active during the start phase of your opponent's next turn.", () => {
    it("keeps the chosen enemy Unit rested through its controller's next Start Phase", () => {
      const pilot = createMockPilot();
      const enemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd02Byarlant004],
          resourceArea: activeResources(5),
          baseSection: [createMockBase({ hp: 20 })],
          deck: 5,
        },
        { play: [enemy], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const byarlantId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.assignPilot(pilot, byarlantId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("offers only rested enemy Units with 3 or less HP", () => {
      const pilot = createMockPilot();
      const friendly = createMockUnit({ hp: 2 });
      const legalEnemy = createMockUnit({ hp: 3 });
      const activeEnemy = createMockUnit({ hp: 2 });
      const sturdyEnemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd02Byarlant004, friendly],
          resourceArea: activeResources(5),
          baseSection: [createMockBase({ hp: 20 })],
          deck: 5,
        },
        {
          play: [legalEnemy, activeEnemy, sturdyEnemy],
          baseSection: [createMockBase({ hp: 20 })],
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [byarlantId, friendlyId] = p1.getCardsInZone("battleArea");
      const [legalEnemyId, activeEnemyId, sturdyEnemyId] = p2.getCardsInZone("battleArea");

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [legalEnemyId!, sturdyEnemyId!]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [friendlyId!]);
      expectSuccess(p1.assignPilot(pilot, byarlantId!));

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [legalEnemyId],
      });
      expect(p2.isExhausted(activeEnemyId!)).toBe(false);
      expect(p2.isExhausted(sturdyEnemyId!)).toBe(true);
    });
  });
});
