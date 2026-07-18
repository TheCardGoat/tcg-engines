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
import { gd02GalbaldyBeta014 } from "./014-galbaldy-beta.ts";

describe("Galbaldy Beta (GD02-014)", () => {
  describe("【Deploy】Choose 1 of your (Titans) Units. It gets AP+1 during this turn.", () => {
    it("shows the eligible Titans Units and gives the chosen ally AP+1", () => {
      const ally = createMockUnit({ traits: ["titans"], ap: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd02GalbaldyBeta014],
        play: [ally],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const allyId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02GalbaldyBeta014));
      const sourceId = p1.getCardsInZone("battleArea")[1]!;
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible Titans target choice");
      }
      expect(targetChoice.legalTargetIds).toEqual(expect.arrayContaining([allyId, sourceId]));
      expectSuccess(p1.resolveEffect({ targets: [allyId] }));

      expect(p1.getVisibleCard(allyId)?.effectiveAp).toBe(4);
      expect(p1.getVisibleCard(sourceId)?.effectiveAp).toBe(3);
    });

    it("does not offer a non-Titans ally or an enemy Titans Unit", () => {
      const nonTitans = createMockUnit({ traits: ["earth federation"], ap: 3 });
      const enemyTitans = createMockUnit({ traits: ["titans"], ap: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GalbaldyBeta014],
          play: [nonTitans],
          resourceArea: activeResources(2),
        },
        { play: [enemyTitans] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const nonTitansId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02GalbaldyBeta014));
      const sourceId = p1.getCardsInZone("battleArea")[1]!;
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible Titans target choice");
      }
      expect(targetChoice.legalTargetIds).toEqual([sourceId]);
      expectSuccess(p1.resolveEffect({ targets: [sourceId] }));

      expect(p1.getVisibleCard(nonTitansId)?.effectiveAp).toBe(3);
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    });

    it("removes the AP bonus when the turn ends", () => {
      const ally = createMockUnit({ traits: ["titans"], ap: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GalbaldyBeta014],
          play: [ally],
          resourceArea: activeResources(2),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const allyId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02GalbaldyBeta014));
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

    it("cannot deploy below Lv.2", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GalbaldyBeta014],
        resourceArea: activeResources(1),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after another legal play leaves only 1 active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GalbaldyBeta014],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });
});
