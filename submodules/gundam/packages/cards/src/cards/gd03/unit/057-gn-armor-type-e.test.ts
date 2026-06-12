import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, getEffectiveStats } from "@tcg/gundam-engine";
import { gd03GnArmorTypeE057 } from "./057-gn-armor-type-e.ts";

describe("GN Armor (Type-E) (GD03-057)", () => {
  it("has Blocker", () => {
    const engine = GundamTestEngine.create({ play: [gd03GnArmorTypeE057] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "Blocker",
    );
  });
});
