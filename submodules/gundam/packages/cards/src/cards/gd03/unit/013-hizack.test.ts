import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03Hizack013 } from "./013-hizack.ts";

describe("Hizack (GD03-013)", () => {
  it("gets AP+1 and Repair while another Jupitris Unit is in play", () => {
    const ally = createMockUnit({ traits: ["jupitris"] });
    const engine = GundamTestEngine.create({ play: [gd03Hizack013, ally] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);

    expect(stats.ap).toBe(3);
    expect(stats.keywords).toContain("Repair");
  });

  it("stays at printed AP without another Jupitris Unit", () => {
    const ally = createMockUnit({ traits: ["titans"] });
    const engine = GundamTestEngine.create({ play: [gd03Hizack013, ally] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);

    expect(stats.ap).toBe(2);
    expect(stats.keywords).not.toContain("Repair");
  });
});
