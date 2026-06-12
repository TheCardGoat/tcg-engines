import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd04PsychoGundamMk004 } from "./004-psycho-gundam-mk.ts";

describe("Psycho Gundam Mk-Ⅱ (GD04-004)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04PsychoGundamMk004.keywordEffects.map((effect) => effect.keyword)).toEqual([
      "Repair",
    ]);
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
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(0);
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
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(1);
  });
});
