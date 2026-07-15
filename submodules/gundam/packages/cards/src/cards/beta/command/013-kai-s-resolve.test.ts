import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { betaKaiSResolve013 } from "./013-kai-s-resolve.ts";

describe("Kai's Resolve (ST01-013, beta reprint)", () => {
  describe("【Main】Choose 1 friendly Unit. It recovers 3 HP.", () => {
    it("recovers 3 HP from a friendly unit", () => {
      const unit = createMockUnit({ ap: 2, hp: 6 });
      const engine = GundamTestEngine.create({
        hand: [betaKaiSResolve013],
        play: [unit],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      engine.getG().damage[unitId!] = 5;
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(betaKaiSResolve013, { targets: [unitId!] }));

      expect(getDamageCounter(engine, unitId!)).toBe(2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
