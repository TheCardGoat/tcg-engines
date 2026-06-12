import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03GundamVirsagoGundamAshtaron040 } from "./040-gundam-virsago-gundam-ashtaron.ts";

describe("Gundam Virsago & Gundam Ashtaron (GD03-040)", () => {
  it("【During Link】 gains High-Maneuver", () => {
    const shagia = createMockPilot({ name: "Shagia Frost" });
    const engine = GundamTestEngine.create({
      hand: [shagia],
      play: [gd03GundamVirsagoGundamAshtaron040],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(shagia, unitId));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "HighManeuver",
    );
  });
});
