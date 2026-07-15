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
import { st08Davao015 } from "./015-davao.ts";

describe("Davao (ST08-015)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("flips Davao from shieldArea into baseSection", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [st08Davao015] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const shieldId = p2.getCardsInZone("shieldArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        sourceCardId: shieldId,
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

      expect(p2.getCardZone(shieldId)).toBe(`baseSection:${PLAYER_TWO}`);
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("moves the first shield to hand and deploys Davao to baseSection", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st08Davao015],
          resourceArea: activeResources(3),
          shieldArea: [
            createMockUnit({ name: "First Shield" }),
            createMockUnit({ name: "Second Shield" }),
          ],
          deck: 4,
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const shieldIds = p1.getCardsInZone("shieldArea");
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st08Davao015));

      expect(p1.getHand()).toContain(shieldIds[0]);
      expect(p1.getHand()).toHaveLength(handBefore);
      expect(p1.getCardsInZone("shieldArea")).toEqual([shieldIds[1]]);
      expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
    });
  });

  describe("【Activate·Main】【Once per Turn】②：Choose 1 of your Units. It recovers 2 HP.", () => {
    it("recovers 2 damage from the chosen friendly Unit", () => {
      const damaged = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [st08Davao015],
          play: [{ card: damaged, damage: 3 }],
          resourceArea: activeResources(3),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(st08Davao015));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(p1.getDamage(unitId)).toBe(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("rejects an enemy Unit target", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [st08Davao015],
          play: [{ card: createMockUnit({ name: "Friendly", hp: 5 }), damage: 1 }],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(st08Davao015));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({ kind: "targetSelection" });
      if (choice?.kind !== "targetSelection") throw new Error("Expected a target choice");
      expect(choice.legalTargetIds).not.toContain(enemyId);
      expectFailure(p1.resolveEffect({ targets: [enemyId] }), "ILLEGAL_TARGET");
    });

    it("cannot activate without two payable resources", () => {
      const damaged = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [st08Davao015],
          play: [{ card: damaged, damage: 2 }],
          resourceArea: activeResources(1),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(st08Davao015, { targets: [unitId] }),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });
});
