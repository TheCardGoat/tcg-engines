import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, getEffectiveStats } from "@tcg/gundam-engine";
import { gd03FullArmorUnicornGundamDestroyMode010 } from "./010-full-armor-unicorn-gundam-destroy-mode.ts";

describe("Full Armor Unicorn Gundam (Destroy Mode) (GD03-010)", () => {
  it("has printed Repair 3 in effective stats", () => {
    const engine = GundamTestEngine.create(
      { play: [gd03FullArmorUnicornGundamDestroyMode010] },
      {},
    );
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);

    expect(stats.keywords).toContain("Repair");
  });
});
