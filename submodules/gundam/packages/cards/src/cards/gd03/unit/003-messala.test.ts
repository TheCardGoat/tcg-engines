import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, getEffectiveStats } from "@tcg/gundam-engine";
import { gd03Messala003 } from "./003-messala.ts";

describe("Messala (GD03-003)", () => {
  it("has printed Blocker and Repair keywords in effective stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03Messala003] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);

    expect(stats.keywords).toContain("Blocker");
    expect(stats.keywords).toContain("Repair");
  });
});
