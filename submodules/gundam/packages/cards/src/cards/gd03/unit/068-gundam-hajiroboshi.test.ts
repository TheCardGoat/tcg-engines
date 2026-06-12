import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockBase,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03GundamHajiroboshi068 } from "./068-gundam-hajiroboshi.ts";

describe("Gundam Hajiroboshi (GD03-068)", () => {
  it("gains Blocker while a friendly Base is in play", () => {
    const engine = GundamTestEngine.create({
      play: [gd03GundamHajiroboshi068],
      baseSection: [createMockBase()],
    });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "Blocker",
    );
  });
});
