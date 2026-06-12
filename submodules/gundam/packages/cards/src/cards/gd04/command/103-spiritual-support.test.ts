import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd04SpiritualSupport103 } from "./103-spiritual-support.ts";

describe("Spiritual Support (GD04-103)", () => {
  it("【Main】grants Repair 2 to a friendly Unit during this turn", () => {
    const unit = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd04SpiritualSupport103],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd04SpiritualSupport103, { targets: [unitId] }));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "Repair",
    );
  });
});
