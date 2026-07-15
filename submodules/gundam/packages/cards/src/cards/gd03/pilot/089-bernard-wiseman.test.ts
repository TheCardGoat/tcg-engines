import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03BernardWiseman089 } from "./089-bernard-wiseman.ts";

describe("Bernard Wiseman (GD03-089)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03BernardWiseman089] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03BernardWiseman089)).toBe(`hand:${PLAYER_TWO}`);
  });

  describe("Increase this Unit's AP by an amount equal to the number of (Cyclops Team) Pilot cards/Command cards with unique names in your trash.", () => {
    it("gives the paired Unit AP equal to unique Cyclops Team Pilot and Command names in trash", () => {
      const host = createMockUnit({ ap: 2, hp: 5, linkCondition: "[Bernard Wiseman]" });
      const duplicatePilotA = createMockPilot({
        name: "Cyclops Pilot",
        traits: ["cyclops team"],
      });
      const duplicatePilotB = createMockPilot({
        name: "Cyclops Pilot",
        traits: ["cyclops team"],
      });
      const command = createMockCommand({
        name: "Cyclops Command",
        traits: ["cyclops team"],
      });
      const wrongTrait = createMockCommand({
        name: "Wrong Command",
        traits: ["zeon"],
      });
      const wrongType = createMockUnit({
        name: "Cyclops Unit",
        traits: ["cyclops team"],
      });
      const engine = GundamTestEngine.create({
        hand: [gd03BernardWiseman089],
        play: [host],
        trash: [duplicatePilotA, duplicatePilotB, command, wrongTrait, wrongType],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03BernardWiseman089, hostId));

      expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(4);
    });

    it("does not increase AP when no Cyclops Team Pilot or Command cards are in trash", () => {
      const host = createMockUnit({ ap: 2, hp: 5, linkCondition: "[Bernard Wiseman]" });
      const engine = GundamTestEngine.create({
        hand: [gd03BernardWiseman089],
        play: [host],
        trash: [createMockUnit({ name: "Cyclops Unit", traits: ["cyclops team"] })],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03BernardWiseman089, hostId));

      expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(2);
    });
  });
});
