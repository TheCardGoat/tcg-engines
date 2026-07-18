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
import { gd02GenoaceCustom026 } from "./026-genoace-custom.ts";
import { gd02WhiteWolf106 } from "../command/106-white-wolf.ts";
import { gd02FlitAsuno088 } from "../pilot/088-flit-asuno.ts";

describe("Genoace Custom (GD02-026)", () => {
  describe("Printed Lv.2 and cost 2", () => {
    it("cannot deploy with only 1 total Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GenoaceCustom026],
        resourceArea: activeResources(1),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 1 active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GenoaceCustom026],
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

  describe("Link Condition: [Woolf Enneacle]", () => {
    it("can attack on its deploy turn after Woolf Enneacle is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GenoaceCustom026, gd02WhiteWolf106],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GenoaceCustom026));
      const genoaceId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.playCommandAsPilot(gd02WhiteWolf106, genoaceId));
      expectSuccess(p1.enterBattle(genoaceId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: genoaceId });
    });

    it("cannot attack on its deploy turn after a different Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GenoaceCustom026, gd02FlitAsuno088],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GenoaceCustom026));
      const genoaceId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02FlitAsuno088, genoaceId));

      expectFailure(p1.enterBattle(genoaceId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("【Deploy】If you are Lv.7 or higher, choose 1 of your (AGE System) Units. It gets AP+2 during this turn.", () => {
    it("offers the friendly AGE System Unit and visibly gives it AP+2 at Lv.7", () => {
      const ageSystemUnit = createMockUnit({ traits: ["age system"], ap: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd02GenoaceCustom026],
        play: [ageSystemUnit],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02GenoaceCustom026));
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible AGE System target choice");
      }
      expect(targetChoice.legalTargetIds).toEqual([targetId]);
      expectSuccess(p1.resolveEffect({ targets: [targetId] }));

      expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(5);
    });

    it("does not publish the effect below Lv.7", () => {
      const ageSystemUnit = createMockUnit({ traits: ["age system"], ap: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd02GenoaceCustom026],
        play: [ageSystemUnit],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02GenoaceCustom026));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(3);
    });

    it("does not offer a friendly Unit outside AGE System or an enemy AGE System Unit", () => {
      const friendlyOther = createMockUnit({ traits: ["earth federation"], ap: 3 });
      const enemyAgeSystem = createMockUnit({ traits: ["age system"], ap: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GenoaceCustom026],
          play: [friendlyOther],
          resourceArea: activeResources(7),
        },
        { play: [enemyAgeSystem] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02GenoaceCustom026));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getVisibleCard(friendlyId)?.effectiveAp).toBe(3);
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    });

    it("removes the AP bonus when the turn ends", () => {
      const ageSystemUnit = createMockUnit({ traits: ["age system"], ap: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GenoaceCustom026],
          play: [ageSystemUnit],
          resourceArea: activeResources(7),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02GenoaceCustom026));
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible AGE System target choice");
      }
      expect(targetChoice.legalTargetIds).toContain(targetId);
      expectSuccess(p1.resolveEffect({ targets: [targetId] }));
      expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(5);
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(3);
    });
  });
});
