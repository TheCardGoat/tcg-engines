import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, getEffectiveStats } from "@tcg/gundam-engine";
import { gd03GundamDynames026 } from "./026-gundam-dynames.ts";

describe("Gundam Dynames (GD03-026)", () => {
  it("has printed Breach 3 in effective stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03GundamDynames026] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);

    expect(stats.keywords).toContain("Breach");
  });
});
