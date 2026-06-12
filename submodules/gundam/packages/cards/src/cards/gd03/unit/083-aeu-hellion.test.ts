import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, getEffectiveStats } from "@tcg/gundam-engine";
import { gd03AeuHellion083 } from "./083-aeu-hellion.ts";

describe("AEU Hellion (GD03-083)", () => {
  it("has Blocker", () => {
    const engine = GundamTestEngine.create({ play: [gd03AeuHellion083] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "Blocker",
    );
  });
});
