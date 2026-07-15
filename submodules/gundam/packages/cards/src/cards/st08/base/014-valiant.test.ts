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
import { st08Valiant014 } from "./014-valiant.ts";

describe("Valiant (ST08-014)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("flips Valiant from shieldArea into baseSection", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st08Valiant014] },
      );
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

  describe("【Deploy】Add 1 of your Shields to your hand. Then, choose 1 of your Units. It gets AP+2 during this turn.", () => {
    it("moves a shield to hand and grants AP+2 to the chosen friendly Unit", () => {
      const unit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08Valiant014],
          play: [unit],
          resourceArea: activeResources(2),
          shieldArea: [createMockUnit({ name: "Shield" })],
          deck: 4,
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const shieldId = p1.getCardsInZone("shieldArea")[0]!;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st08Valiant014));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(p1.getHand()).toContain(shieldId);
      expect(p1.getHand()).toHaveLength(handBefore);
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(4);
      expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
    });

    it("rejects an enemy Unit target", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08Valiant014],
          play: [createMockUnit({ name: "Friendly", ap: 2, hp: 5 })],
          resourceArea: activeResources(2),
          shieldArea: [createMockUnit({ name: "Shield" })],
          deck: 2,
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployBase(st08Valiant014));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({ kind: "targetSelection" });
      if (choice?.kind !== "targetSelection") throw new Error("Expected a target choice");
      expect(choice.legalTargetIds).not.toContain(enemyId);
      expectFailure(p1.resolveEffect({ targets: [enemyId] }), "ILLEGAL_TARGET");
    });
  });
});
