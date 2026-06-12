import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockPilot,
  expectCardInHand,
  expectCardInTrash,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04JamilSGundamX058 } from "./058-jamil-s-gundam-x.ts";

describe("Jamil's Gundam X (GD04-058)", () => {
  describe("【During Pair･(Vulture) Pilot】【Destroyed】If it is your turn, return this Unit's paired Pilot to its owner's hand.", () => {
    it("returns the paired Vulture Pilot to hand when destroyed on its controller's turn", () => {
      const vulturePilot = createMockPilot({ traits: ["vulture"], cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [vulturePilot],
        play: [gd04JamilSGundamX058],
        resourceArea: activeResources(1),
      });
      engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_ONE);
      engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_ONE);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(vulturePilot, unitId));
      const pilotId = engine.getG().pilotAssignments[unitId]!;

      engine.destroyUnit(unitId);

      expectCardInTrash(engine, unitId, PLAYER_ONE);
      expectCardInHand(engine, pilotId, PLAYER_ONE);
      expect(engine.getG().pilotAssignments[unitId]).toBeUndefined();
    });

    it("does not return the paired Pilot when the Pilot lacks Vulture", () => {
      const wrongPilot = createMockPilot({ traits: ["newtype"], cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [wrongPilot],
        play: [gd04JamilSGundamX058],
        resourceArea: activeResources(1),
      });
      engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_ONE);
      engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_ONE);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(wrongPilot, unitId));
      const pilotId = engine.getG().pilotAssignments[unitId]!;

      engine.destroyUnit(unitId);

      expectCardInTrash(engine, unitId, PLAYER_ONE);
      expectCardInTrash(engine, pilotId, PLAYER_ONE);
      expect(engine.getG().pilotAssignments[unitId]).toBeUndefined();
    });

    it("does not return the paired Vulture Pilot when destroyed on the opponent's turn", () => {
      const vulturePilot = createMockPilot({ traits: ["vulture"], cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [vulturePilot],
        play: [gd04JamilSGundamX058],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(vulturePilot, unitId));
      const pilotId = engine.getG().pilotAssignments[unitId]!;
      engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
      engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_TWO);

      engine.destroyUnit(unitId);

      expectCardInTrash(engine, unitId, PLAYER_ONE);
      expectCardInTrash(engine, pilotId, PLAYER_ONE);
      expect(engine.getG().pilotAssignments[unitId]).toBeUndefined();
    });
  });
});
