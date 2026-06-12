import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectCardInHand,
  expectCardInTrash,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03TierenHighMobilityType078 } from "./078-tieren-high-mobility-type.ts";

describe("Tieren High Mobility Type (GD03-078)", () => {
  describe("【During Link】【Destroyed】Return the card paired with this Unit to your hand.", () => {
    it("returns the paired Pilot to hand when destroyed as a Link Unit", () => {
      const sergei = createMockPilot({ name: "Sergei Smirnov", cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [sergei],
        play: [gd03TierenHighMobilityType078],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(sergei, unitId));
      const pilotId = engine.getG().pilotAssignments[unitId]!;

      engine.destroyUnit(unitId);

      expectCardInTrash(engine, unitId, PLAYER_ONE);
      expectCardInHand(engine, pilotId, PLAYER_ONE);
      expect(engine.getG().pilotAssignments[unitId]).toBeUndefined();
    });

    it("does not return the paired Pilot when destroyed while paired but not linked", () => {
      const wrongPilot = createMockPilot({ name: "Wrong Pilot", cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [wrongPilot],
        play: [gd03TierenHighMobilityType078],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(wrongPilot, unitId));
      const pilotId = engine.getG().pilotAssignments[unitId]!;

      engine.destroyUnit(unitId);

      expectCardInTrash(engine, unitId, PLAYER_ONE);
      expectCardInTrash(engine, pilotId, PLAYER_ONE);
      expect(engine.getG().pilotAssignments[unitId]).toBeUndefined();
    });
  });
});
