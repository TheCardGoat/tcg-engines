import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd02AspiringPilot120 } from "./120-aspiring-pilot.ts";

describe("Aspiring Pilot (GD02-120)", () => {
  describe("【Action】Choose 1 of your (AEUG) Units. It recovers 2 HP.", () => {
    it("recovers 2 HP from a friendly (AEUG) unit in the action phase", () => {
      const aeug = createMockUnit({ traits: ["aeug"], ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [gd02AspiringPilot120],
        play: [aeug],
        resourceArea: activeResources(4),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      engine.getG().damage[unitId!] = 3;
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd02AspiringPilot120, { targets: [unitId!] }));

      expect(getDamageCounter(engine, unitId!)).toBe(1);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot be played in the main phase", () => {
      const aeug = createMockUnit({ traits: ["aeug"], ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [gd02AspiringPilot120],
        play: [aeug],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(gd02AspiringPilot120, { targets: [unitId!] }), "WRONG_TIMING");
    });

    it("cannot target a non-(AEUG) unit", () => {
      const nonAeug = createMockUnit({ traits: ["titans"], ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [gd02AspiringPilot120],
        play: [nonAeug],
        resourceArea: activeResources(4),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(gd02AspiringPilot120, { targets: [unitId!] }), "INVALID_TARGET");
    });
  });
});
