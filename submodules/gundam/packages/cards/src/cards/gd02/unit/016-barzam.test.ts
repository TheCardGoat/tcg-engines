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
import { gd02Barzam016 } from "./016-barzam.ts";

describe("Barzam (GD02-016)", () => {
  describe("Printed cost 2", () => {
    it("cannot deploy after a legal play leaves only 1 active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02Barzam016],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("【Deploy】Choose 1 of your (Titans) Units. It gets AP+1 during this turn.", () => {
    it("publishes the Titans target choice and visibly gives the chosen ally AP+1", () => {
      const ally = createMockUnit({ traits: ["titans"], ap: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd02Barzam016],
        play: [ally],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const allyId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02Barzam016));
      const barzamId = p1.getCardsInZone("battleArea")[1]!;
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible Titans target choice");
      }
      expect(targetChoice.legalTargetIds).toEqual(expect.arrayContaining([allyId, barzamId]));
      expectSuccess(p1.resolveEffect({ targets: [allyId] }));

      expect(p1.getVisibleCard(allyId)?.effectiveAp).toBe(4);
      expect(p1.getVisibleCard(barzamId)?.effectiveAp).toBe(3);
    });

    it("excludes friendly non-Titans and enemy Titans Units from the choice", () => {
      const nonTitans = createMockUnit({ traits: ["earth federation"], ap: 3 });
      const enemyTitans = createMockUnit({ traits: ["titans"], ap: 3 });
      const engine = GundamTestEngine.create(
        { hand: [gd02Barzam016], play: [nonTitans], resourceArea: activeResources(3) },
        { play: [enemyTitans] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const nonTitansId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02Barzam016));
      const barzamId = p1.getCardsInZone("battleArea")[1]!;
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible Titans target choice");
      }
      expect(targetChoice.legalTargetIds).toEqual([barzamId]);
      expectSuccess(p1.resolveEffect({ targets: [barzamId] }));

      expect(p1.getVisibleCard(nonTitansId)?.effectiveAp).toBe(3);
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    });

    it("removes the AP bonus after the turn", () => {
      const ally = createMockUnit({ traits: ["titans"], ap: 3 });
      const engine = GundamTestEngine.create(
        { hand: [gd02Barzam016], play: [ally], resourceArea: activeResources(3), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const allyId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02Barzam016));
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible Titans target choice");
      }
      expect(targetChoice.legalTargetIds).toContain(allyId);
      expectSuccess(p1.resolveEffect({ targets: [allyId] }));
      expect(p1.getVisibleCard(allyId)?.effectiveAp).toBe(4);
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(allyId)?.effectiveAp).toBe(3);
    });

    it("cannot deploy below Lv.3", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Barzam016],
        resourceArea: activeResources(2),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });
  });
});
