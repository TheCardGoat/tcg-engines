import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd02GundamAge1Titus031 } from "./031-gundam-age-1-titus.ts";

describe("Gundam AGE-1 Titus (GD02-031)", () => {
  it("does NOT get AP+2 while controller is below Lv.7", () => {
    const engine = GundamTestEngine.create(
      { play: [gd02GundamAge1Titus031], resourceArea: activeResources(5) },
      {},
    );
    const [unitId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId!, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(2);
  });

  it("gets AP+2 while controller is Lv.7 or higher", () => {
    const engine = GundamTestEngine.create(
      { play: [gd02GundamAge1Titus031], resourceArea: activeResources(7) },
      {},
    );
    const [unitId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId!, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(4); // printed 2 + 2
  });
});
