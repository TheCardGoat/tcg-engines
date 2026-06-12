import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd04Gundam008 } from "./008-gundam.ts";

describe("Gundam (GD04-008)", () => {
  it("【During Link】 gains <High-Maneuver>", () => {
    const amuro = createMockPilot({ name: "Amuro Ray" });
    const engine = GundamTestEngine.create({
      hand: [amuro],
      play: [gd04Gundam008],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(amuro, unitId));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("HighManeuver");
  });

  it("does not gain <High-Maneuver> when paired but not linked", () => {
    const nonAmuro = createMockPilot({ name: "Kai Shiden" });
    const engine = GundamTestEngine.create({
      hand: [nonAmuro],
      play: [gd04Gundam008],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(nonAmuro, unitId));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(stats.keywords).not.toContain("HighManeuver");
  });
});
