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
import { st03TheBlueGiant014 } from "../../st03/command/014-the-blue-giant.ts";
import { tWireGuidedArm022 } from "./022-wire-guided-arm.ts";

describe("Wire-Guided Arm (T-022)", () => {
  describe("This Unit can't be paired with a Pilot.", () => {
    it("rejects a normal Pilot and leaves both cards in their original zones", () => {
      const pilot = createMockPilot({ name: "Test Pilot", cost: 1, level: 1 });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [tWireGuidedArm022],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const wireGuidedArmId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;

      expectFailure(p1.assignPilot(pilotId, wireGuidedArmId), "UNIT_CANNOT_PAIR_PILOT");

      expect(p1.getPilotId(wireGuidedArmId)).toBeUndefined();
      expect(p1.getCardZone(wireGuidedArmId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(0);
    });

    it("rejects a Command card played as its printed Pilot", () => {
      const engine = GundamTestEngine.create({
        hand: [st03TheBlueGiant014],
        play: [tWireGuidedArm022],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const wireGuidedArmId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectFailure(p1.playCommandAsPilot(commandId, wireGuidedArmId), "UNIT_CANNOT_PAIR_PILOT");

      expect(p1.getPilotId(wireGuidedArmId)).toBeUndefined();
      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(0);
    });

    it("does not prevent the rejected normal Pilot from pairing with an ordinary Unit", () => {
      const pilot = createMockPilot({ name: "Test Pilot", cost: 1, level: 1 });
      const ordinaryUnit = createMockUnit({ name: "Ordinary Unit" });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [tWireGuidedArm022, ordinaryUnit],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [wireGuidedArmId, ordinaryUnitId] = p1.getCardsInZone("battleArea");
      const pilotId = p1.getHand()[0]!;

      expectFailure(p1.assignPilot(pilotId, wireGuidedArmId!), "UNIT_CANNOT_PAIR_PILOT");
      expectSuccess(p1.assignPilot(pilotId, ordinaryUnitId!));

      expect(p1.getPilotId(wireGuidedArmId!)).toBeUndefined();
      expect(p1.getPilotId(ordinaryUnitId!)).toBe(pilotId);
      expect(p1.getCardZone(pilotId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("does not prevent the rejected Command-as-Pilot from pairing with an ordinary Unit", () => {
      const ordinaryUnit = createMockUnit({ name: "Ordinary Unit" });
      const engine = GundamTestEngine.create({
        hand: [st03TheBlueGiant014],
        play: [tWireGuidedArm022, ordinaryUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [wireGuidedArmId, ordinaryUnitId] = p1.getCardsInZone("battleArea");
      const commandId = p1.getHand()[0]!;

      expectFailure(p1.playCommandAsPilot(commandId, wireGuidedArmId!), "UNIT_CANNOT_PAIR_PILOT");
      expectSuccess(p1.playCommandAsPilot(commandId, ordinaryUnitId!));

      expect(p1.getPilotId(wireGuidedArmId!)).toBeUndefined();
      expect(p1.getPilotId(ordinaryUnitId!)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("does not let Player One pair their Pilot with Player Two's Wire-Guided Arm", () => {
      const pilot = createMockPilot({ name: "Player One Pilot", cost: 1, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [pilot], resourceArea: activeResources(1) },
        { play: [tWireGuidedArm022] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const pilotId = p1.getHand()[0]!;
      const enemyWireGuidedArmId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(pilotId, enemyWireGuidedArmId), "UNIT_NOT_ON_BATTLEFIELD");

      expect(p1.getCardZone(pilotId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p2.getPilotId(enemyWireGuidedArmId)).toBeUndefined();
    });

    it("does not let Player Two pair their Pilot with Player One's Wire-Guided Arm", () => {
      const pilot = createMockPilot({ name: "Player Two Pilot", cost: 1, level: 1 });
      const engine = GundamTestEngine.create(
        { play: [tWireGuidedArm022] },
        { hand: [pilot], resourceArea: activeResources(1) },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const wireGuidedArmId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p2.getHand()[0]!;

      expectFailure(p2.assignPilot(pilotId, wireGuidedArmId), "UNIT_NOT_ON_BATTLEFIELD");

      expect(p2.getCardZone(pilotId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p1.getPilotId(wireGuidedArmId)).toBeUndefined();
    });

    it("can still declare an ordinary direct attack", () => {
      const engine = GundamTestEngine.create(
        { play: [tWireGuidedArm022] },
        { shieldArea: [createMockUnit({ name: "Shield" })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const wireGuidedArmId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(wireGuidedArmId, "direct"));

      expect(p1.isExhausted(wireGuidedArmId)).toBe(true);
      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: wireGuidedArmId });
    });

    it("does not stop an ordinary Unit controlled by the same player from accepting a Pilot", () => {
      const pilot = createMockPilot({ name: "Test Pilot", cost: 1, level: 1 });
      const ordinaryUnit = createMockUnit({ name: "Ordinary Unit" });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [ordinaryUnit, tWireGuidedArm022],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [ordinaryUnitId, wireGuidedArmId] = p1.getCardsInZone("battleArea");
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(pilotId, ordinaryUnitId!));

      expect(p1.getPilotId(ordinaryUnitId!)).toBe(pilotId);
      expect(p1.getPilotId(wireGuidedArmId!)).toBeUndefined();
    });
  });
});
