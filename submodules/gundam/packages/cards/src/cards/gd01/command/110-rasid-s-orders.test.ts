import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  hasGrantAttackTargetOption,
} from "@tcg/gundam-engine";
import { gd01RasidSOrders110 } from "./110-rasid-s-orders.ts";

describe("Rasid's Orders (GD01-110)", () => {
  describe("【Main】/【Action】Choose 1 Unit that is Lv.4 or higher. It may choose an active enemy Unit with 6 or less AP as its attack target.", () => {
    it("installs a force-attack-target effect on a friendly unit during main-phase", () => {
      const unit = createMockUnit({ ap: 5, hp: 5, level: 4 });
      const engine = GundamTestEngine.create({
        hand: [gd01RasidSOrders110],
        play: [unit],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01RasidSOrders110));

      expect(hasGrantAttackTargetOption(engine, unitId!)).toBe(true);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("installs a force-attack-target effect on a friendly unit during action-phase", () => {
      const unit = createMockUnit({ ap: 5, hp: 5, level: 4 });
      const engine = GundamTestEngine.create({
        hand: [gd01RasidSOrders110],
        play: [unit],
        resourceArea: activeResources(3),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01RasidSOrders110));

      expect(hasGrantAttackTargetOption(engine, unitId!)).toBe(true);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
