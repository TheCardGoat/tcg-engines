import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, getEffectiveStats } from "@tcg/gundam-engine";
import { gd03MessalaMaMode012 } from "./012-messala-ma-mode.ts";

describe("Messala (MA Mode) (GD03-012)", () => {
  it("has printed Repair 1 in effective stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03MessalaMaMode012] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);

    expect(stats.keywords).toContain("Repair");
  });
});
