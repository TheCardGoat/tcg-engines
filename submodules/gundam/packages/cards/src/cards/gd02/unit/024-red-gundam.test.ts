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
import { gd02RedGundam024 } from "./024-red-gundam.ts";
import { gd02UndyingPersistence109 } from "../command/109-undying-persistence.ts";
import { gd02LalahSune089 } from "../pilot/089-lalah-sune.ts";

describe("Red Gundam (GD02-024)", () => {
  describe("Printed Lv.5 and cost 3", () => {
    it("cannot deploy with only 4 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02RedGundam024],
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
        hand: [spender, gd02RedGundam024],
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

  describe("【During Link】This Unit gains <High-Maneuver>.", () => {
    it("prevents an enemy Blocker from blocking after a Clan Pilot creates a Link Unit", () => {
      const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02UndyingPersistence109],
          play: [gd02RedGundam024],
          resourceArea: activeResources(5),
        },
        { play: [blocker], shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const redGundamId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(gd02UndyingPersistence109, redGundamId));
      expect(p1.getVisibleCard(redGundamId)?.keywords).toContain("HighManeuver");
      expectSuccess(p1.enterBattle(redGundamId, "direct"));

      expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
      expect(p2.isExhausted(blockerId)).toBe(false);
    });

    it("allows a Blocker to block when the paired Pilot is not a Clan Pilot", () => {
      const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02LalahSune089],
          play: [gd02RedGundam024],
          resourceArea: activeResources(5),
        },
        { play: [blocker], shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const redGundamId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd02LalahSune089, redGundamId));
      expect(p1.getVisibleCard(redGundamId)?.keywords).not.toContain("HighManeuver");
      expectSuccess(p1.enterBattle(redGundamId, "direct"));
      expectSuccess(p2.declareBlock(blockerId));

      expect(p2.isExhausted(blockerId)).toBe(true);
    });

    it("updates the visible keyword as soon as the matching Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02UndyingPersistence109],
        play: [gd02RedGundam024],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const redGundamId = p1.getCardsInZone("battleArea")[0]!;

      expect(p1.getVisibleCard(redGundamId)?.keywords).not.toContain("HighManeuver");
      expectSuccess(p1.playCommandAsPilot(gd02UndyingPersistence109, redGundamId));

      expect(p1.getVisibleCard(redGundamId)?.keywords).toContain("HighManeuver");
    });
  });
});
