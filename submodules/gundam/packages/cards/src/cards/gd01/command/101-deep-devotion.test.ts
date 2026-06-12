import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  markAsLinkUnit,
  expectCardInTrash,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd01DeepDevotion101 } from "./101-deep-devotion.ts";

describe("Deep Devotion (GD01-101)", () => {
  describe("【Main】/【Action】Choose 1 friendly Link Unit. It recovers 3 HP.", () => {
    it("recovers 3 HP from a friendly link unit", () => {
      const unit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [gd01DeepDevotion101],
        play: [unit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      // Seed 4 damage on the unit
      engine.getG().damage[unitId!] = 4;
      // Mark it as a Link Unit for targeting purposes
      markAsLinkUnit(engine, unitId!);
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01DeepDevotion101, { targets: [unitId!] }));

      // max(0, 4 - 3) = 1
      expect(getDamageCounter(engine, unitId!)).toBe(1);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target a friendly unit that is not linked", () => {
      const unit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [gd01DeepDevotion101],
        play: [unit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(gd01DeepDevotion101, { targets: [unitId!] }), "INVALID_TARGET");
    });
  });
});
