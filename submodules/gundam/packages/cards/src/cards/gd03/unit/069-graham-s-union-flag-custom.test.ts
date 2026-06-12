import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03GrahamSUnionFlagCustom069 } from "./069-graham-s-union-flag-custom.ts";

describe("Graham's Union Flag Custom (GD03-069)", () => {
  it("has High-Maneuver", () => {
    const engine = GundamTestEngine.create({ play: [gd03GrahamSUnionFlagCustom069] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "HighManeuver",
    );
  });

  it("【During Link】sets this Unit active at the end of the turn when paired with a Pilot", () => {
    const graham = createMockPilot({ name: "Graham Aker" });
    const engine = GundamTestEngine.create({
      hand: [graham],
      play: [{ card: gd03GrahamSUnionFlagCustom069, exhausted: true }],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(graham, unitId));
    expect(engine.getG().exhausted[unitId]).toBe(true);

    engine.endTurn();

    expect(engine.getG().exhausted[unitId] ?? false).toBe(false);
  });
});
