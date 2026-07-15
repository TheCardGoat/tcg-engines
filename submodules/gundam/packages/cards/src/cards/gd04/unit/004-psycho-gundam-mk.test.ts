import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd04PsychoGundamMk004 } from "./004-psycho-gundam-mk.ts";

describe("Psycho Gundam Mk-Ⅱ (GD04-004)", () => {
  describe("<Repair 2>", () => {
    it("recovers 2 HP at the end of its controller's turn", () => {
      const engine = GundamTestEngine.create({
        play: [{ card: gd04PsychoGundamMk004, damage: 3 }],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const psychoGundamId = p1.getCardsInZone("battleArea")[0]!;

      expect(p1.getDamage(psychoGundamId)).toBe(3);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getDamage(psychoGundamId)).toBe(1);
    });
  });

  it("draws 1 once per turn when a Cyber-Newtype Pilot is paired with a friendly blue Unit", () => {
    const blueUnit = createMockUnit({ color: "blue" });
    const pilot = createMockPilot({ traits: ["cyber-newtype"] });
    const deckCard = createMockUnit({ name: "Drawn Card" });
    const engine = GundamTestEngine.create({
      play: [gd04PsychoGundamMk004, blueUnit],
      hand: [pilot],
      deck: [deckCard],
      resourceArea: activeResources(8),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const blueUnitId = p1.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.assignPilot(pilot, blueUnitId));

    expect(p1.getCardsInZone("hand")).toHaveLength(1);
    expect(p1.getCardsInZone("deck")).toHaveLength(0);
  });

  it("does not draw when the Cyber-Newtype Pilot is paired with a non-blue Unit", () => {
    const redUnit = createMockUnit({ color: "red" });
    const pilot = createMockPilot({ traits: ["cyber-newtype"] });
    const deckCard = createMockUnit({ name: "Deck Card" });
    const engine = GundamTestEngine.create({
      play: [gd04PsychoGundamMk004, redUnit],
      hand: [pilot],
      deck: [deckCard],
      resourceArea: activeResources(8),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const redUnitId = p1.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.assignPilot(pilot, redUnitId));

    expect(p1.getCardsInZone("hand")).toHaveLength(0);
    expect(p1.getCardsInZone("deck")).toHaveLength(1);
  });

  it("draws only once when two qualifying Pilots are paired during the same turn", () => {
    const firstBlueUnit = createMockUnit({ color: "blue" });
    const secondBlueUnit = createMockUnit({ color: "blue" });
    const firstPilot = createMockPilot({ traits: ["cyber-newtype"] });
    const secondPilot = createMockPilot({ traits: ["cyber-newtype"] });
    const engine = GundamTestEngine.create({
      play: [gd04PsychoGundamMk004, firstBlueUnit, secondBlueUnit],
      hand: [firstPilot, secondPilot],
      deck: [createMockUnit({ name: "First Draw" }), createMockUnit({ name: "Second Draw" })],
      resourceArea: activeResources(8),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [, firstBlueUnitId, secondBlueUnitId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(firstPilot, firstBlueUnitId!));
    expectSuccess(p1.assignPilot(secondPilot, secondBlueUnitId!));

    expect(p1.getCardsInZone("deck")).toHaveLength(1);
  });
});
