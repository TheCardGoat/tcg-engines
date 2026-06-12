import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, getEffectiveStats } from "@tcg/gundam-engine";
import { gd03GundamBarbatos6thForm061 } from "./061-gundam-barbatos-6th-form.ts";

describe("Gundam Barbatos 6th Form (GD03-061)", () => {
  it("while this Unit has exactly 1 remaining HP, it gains <Repair 3>", () => {
    const engine = GundamTestEngine.create({ play: [gd03GundamBarbatos6thForm061] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    engine.getG().damage[unitId] = 3;

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);

    expect(stats.keywords).toContain("Repair");
  });

  it("does not gain <Repair 3> above 1 remaining HP", () => {
    const engine = GundamTestEngine.create({ play: [gd03GundamBarbatos6thForm061] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    engine.getG().damage[unitId] = 2;

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);

    expect(stats.keywords).not.toContain("Repair");
  });
});
