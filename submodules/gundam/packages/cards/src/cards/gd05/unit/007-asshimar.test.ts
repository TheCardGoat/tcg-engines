import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05Asshimar007 } from "./007-asshimar.ts";

describe("Asshimar (GD05-007)", () => {
  /** @behavioral-proof complete: linked AP/Repair grant, end-phase healing, and non-Link exclusion are public. */
  describe("【During Link】This Unit gets AP+2 and <Repair 1>.", () => {
    it("grants AP+2 and recovers exactly 1 HP at the controller's End Phase after a legal Titans pairing", () => {
      const pilot = createMockPilot({ traits: ["titans"] });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [{ card: gd05Asshimar007, damage: 2 }],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, unitId));

      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(gd05Asshimar007.ap + pilot.apBonus + 2);
      expect(p1.getVisibleCard(unitId)?.keywords).toContain("Repair");
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getDamage(unitId)).toBe(1);
    });

    it("does not grant the Link bonuses or Repair healing to a non-Titans Pilot", () => {
      const pilot = createMockPilot({ traits: ["earth federation"] });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [{ card: gd05Asshimar007, damage: 2 }],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, unitId));

      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(gd05Asshimar007.ap + pilot.apBonus);
      expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("Repair");
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getDamage(unitId)).toBe(2);
    });
  });
});
