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
import { st01Guntank004 } from "./004-guntank.ts";

describe("Guntank (ST01-004)", () => {
  describe("Printed Lv.3 and cost 2", () => {
    it("cannot deploy with only 2 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st01Guntank004],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy with fewer than 2 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, st01Guntank004],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const guntankId = p1.getHand()[0]!;
      expectFailure(p1.deployUnit(guntankId), "INSUFFICIENT_RESOURCES");
      expect(p1.getHand()).toContain(guntankId);
    });

    it("deploys from hand to the battle area for 2 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st01Guntank004],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(cardId));

      expect(p1.getHand()).not.toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toContain(cardId);
      expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });

  describe("【Deploy】Choose 1 enemy Unit with 2 or less HP. Rest it.", () => {
    it("rests the chosen enemy Unit at the 2 HP boundary", () => {
      const enemy = createMockUnit({ hp: 2 });
      const engine = GundamTestEngine.create(
        { hand: [st01Guntank004], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const guntankId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(guntankId, { targets: [enemyId] }));

      expect(p1.getCardZone(guntankId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("rejects an enemy Unit with 3 HP and leaves Guntank in hand", () => {
      const enemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st01Guntank004], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const guntankId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.deployUnit(guntankId, { targets: [enemyId] }), "INVALID_TARGET");

      expect(p1.getHand()).toContain(guntankId);
      expect(p2.isExhausted(enemyId)).toBe(false);
    });

    it("rejects a friendly Unit even when it has 2 HP", () => {
      const friendly = createMockUnit({ hp: 2 });
      const engine = GundamTestEngine.create({
        hand: [st01Guntank004],
        play: [friendly],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const guntankId = p1.getHand()[0]!;
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.deployUnit(guntankId, { targets: [friendlyId] }), "INVALID_TARGET");

      expect(p1.getHand()).toContain(guntankId);
      expect(p1.isExhausted(friendlyId)).toBe(false);
    });

    it("shows every legal enemy and rests only the selected Unit", () => {
      const firstEnemy = createMockUnit({ name: "First Enemy", hp: 1 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", hp: 2 });
      const ineligibleEnemy = createMockUnit({ name: "Ineligible Enemy", hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st01Guntank004], resourceArea: activeResources(3) },
        { play: [firstEnemy, secondEnemy, ineligibleEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [firstId, secondId, ineligibleId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(st01Guntank004));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [firstId, secondId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));

      expect(p2.isExhausted(firstId!)).toBe(false);
      expect(p2.isExhausted(secondId!)).toBe(true);
      expect(p2.isExhausted(ineligibleId!)).toBe(false);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("deploys without a pending choice when no legal enemy exists", () => {
      const enemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st01Guntank004], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const guntankId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(guntankId));

      expect(p1.getCardZone(guntankId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.isExhausted(enemyId)).toBe(false);
    });
  });
});
