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
import { gd04Gundam008 } from "./008-gundam.ts";

describe("Gundam (GD04-008)", () => {
  describe("【During Link】This Unit gains <High-Maneuver>.", () => {
    it("prevents an enemy Blocker from blocking while linked", () => {
      const amuro = createMockPilot({ name: "Amuro Ray" });
      const blocker = createMockUnit({
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const engine = GundamTestEngine.create(
        {
          hand: [amuro],
          play: [gd04Gundam008],
          resourceArea: activeResources(5),
        },
        { play: [blocker] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(amuro, gundamId));
      expectSuccess(p1.enterBattle(gundamId, "direct"));

      expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
      expect(p2.isExhausted(blockerId)).toBe(false);
    });

    it("allows an enemy Blocker to block when the paired Pilot does not satisfy the link condition", () => {
      const nonAmuro = createMockPilot({ name: "Kai Shiden" });
      const blocker = createMockUnit({
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const engine = GundamTestEngine.create(
        {
          hand: [nonAmuro],
          play: [gd04Gundam008],
          resourceArea: activeResources(5),
        },
        { play: [blocker] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(nonAmuro, gundamId));
      expectSuccess(p1.enterBattle(gundamId, "direct"));
      expectSuccess(p2.declareBlock(blockerId));

      expect(p2.isExhausted(blockerId)).toBe(true);
    });
  });
});
