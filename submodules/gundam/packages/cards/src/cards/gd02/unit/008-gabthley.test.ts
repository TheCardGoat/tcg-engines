import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Gabthley008 } from "./008-gabthley.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02QuattroBajeena098 } from "../pilot/098-quattro-bajeena.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gabthley (GD02-008)", () => {
  describe("Printed Lv.4 and cost 3", () => {
    it("cannot deploy with only 3 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Gabthley008],
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
        hand: [spender, gd02Gabthley008],
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

  describe("【When Linked】Choose 1 rested enemy Unit. Deal 1 damage to it.", () => {
    it("offers the rested enemy Unit when a Titans Pilot creates a Link Unit", () => {
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02JeridMessa086],
          play: [gd02Gabthley008],
          resourceArea: activeResources(4),
          shieldArea: [createMockUnit()],
          deck: 5,
        },
        { play: [enemy], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gabthleyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.assignPilot(gd02JeridMessa086, gabthleyId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getDamage(enemyId)).toBe(1);
    });

    it("does not publish a choice when the only enemy Unit is active", () => {
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02JeridMessa086],
          play: [gd02Gabthley008],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gabthleyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd02JeridMessa086, gabthleyId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("does not trigger when the paired Pilot is outside the Link Condition", () => {
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02QuattroBajeena098],
          play: [gd02Gabthley008],
          resourceArea: activeResources(4),
          shieldArea: [createMockUnit()],
          deck: 5,
        },
        { play: [enemy], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gabthleyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.assignPilot(gd02QuattroBajeena098, gabthleyId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(0);
    });
  });
});
