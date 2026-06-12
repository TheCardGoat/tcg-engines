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
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03BernardWiseman089 } from "./089-bernard-wiseman.ts";

describe("Bernard Wiseman (GD03-089)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03BernardWiseman089] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
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

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(getEffectiveStats(hostId, engine.getG(), framework.cards, framework).ap).toBe(4);
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

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(getEffectiveStats(hostId, engine.getG(), framework.cards, framework).ap).toBe(2);
    });
  });
});
