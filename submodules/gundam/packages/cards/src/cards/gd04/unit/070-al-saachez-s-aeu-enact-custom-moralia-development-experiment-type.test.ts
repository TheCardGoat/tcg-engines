import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  asPlayerId,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04AliAlSaachez099 } from "../pilot/099-ali-al-saachez.ts";
import { gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070 } from "./070-al-saachez-s-aeu-enact-custom-moralia-development-experiment-type.ts";

describe("Al-Saachez's AEU Enact Custom Moralia Development Experiment Type (GD04-070)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({
      play: [gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070.type).toBe("unit");
    expect(gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070.level).toBe(2);
    expect(gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070.cost).toBe(2);
    expect(gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070.ap).toBe(3);
    expect(gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070.hp).toBe(1);
  });

  describe('【Deploy】You may pair 1 Pilot card with "Ali al-Saachez" in its card name from your hand with this Unit.', () => {
    it("pairs Ali al-Saachez from hand with this Unit when deployed", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [
            gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070,
            gd04AliAlSaachez099,
          ],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const playerId = asPlayerId(PLAYER_ONE);
      const runtime = engine.getRuntime();
      const pilotId = runtime.getInstanceIdByDefinition(playerId, gd04AliAlSaachez099.cardNumber);
      if (!pilotId) throw new Error("setup failed: Ali al-Saachez not in hand");

      expectSuccess(
        p1.deployUnit(gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070, {
          targets: [pilotId],
        }),
      );
      while (engine.getPendingChoice()) {
        expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
      }

      const unitId = runtime.getInstanceIdByDefinition(
        playerId,
        gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070.cardNumber,
      );
      if (!unitId) throw new Error("setup failed: unit not deployed");
      expect(engine.getG().pilotAssignments[unitId]).toBe(pilotId);
      expect(p1.getHand()).not.toContain(pilotId);
      expect(p1.getCardsInZone("battleArea")).toContain(pilotId);
    });

    it("can decline the optional pairing after deployment", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [
            gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070,
            gd04AliAlSaachez099,
          ],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const playerId = asPlayerId(PLAYER_ONE);
      const runtime = engine.getRuntime();
      const pilotId = runtime.getInstanceIdByDefinition(playerId, gd04AliAlSaachez099.cardNumber);
      if (!pilotId) throw new Error("setup failed: Ali al-Saachez not in hand");

      expectSuccess(
        p1.deployUnit(gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070, {
          targets: [pilotId],
        }),
      );
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      const unitId = p1
        .getCardsInZone("battleArea")
        .find(
          (id) =>
            engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(id)?.cardNumber ===
            gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070.cardNumber,
        );
      if (!unitId) throw new Error("setup failed: unit not deployed");
      expect(engine.getG().pilotAssignments[unitId]).toBeUndefined();
      expect(p1.getHand()).toHaveLength(1);
    });

    it("does not pair a Pilot without Ali al-Saachez in its card name", () => {
      const otherPilot = createMockPilot({ name: "Graham Aker", color: "white" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070, otherPilot],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const playerId = asPlayerId(PLAYER_ONE);
      const runtime = engine.getRuntime();
      const pilotId = runtime.getInstanceIdByDefinition(playerId, otherPilot.cardNumber);
      if (!pilotId) throw new Error("setup failed: pilot not in hand");

      expectSuccess(
        p1.deployUnit(gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070, {
          targets: [pilotId],
        }),
      );
      while (engine.getPendingChoice()) {
        expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
      }

      const unitId = runtime.getInstanceIdByDefinition(
        playerId,
        gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070.cardNumber,
      );
      if (!unitId) throw new Error("setup failed: unit not deployed");
      expect(engine.getG().pilotAssignments[unitId]).toBeUndefined();
      expect(p1.getHand()).toContain(pilotId);
    });
  });
});
