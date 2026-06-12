import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd01ByarlantCustom019 } from "./019-byarlant-custom.ts";

describe("Byarlant Custom (GD01-019)", () => {
  describe("While 4 or more enemy Units are in play, this Unit gains <Blocker>.", () => {
    it("grants <Blocker> when the enemy has 4+ units in play", () => {
      const engine = GundamTestEngine.create(
        { play: [gd01ByarlantCustom019] },
        {
          play: [createMockUnit(), createMockUnit(), createMockUnit(), createMockUnit()],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const framework = engine.getRuntime().getFrameworkReadAPI();

      const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
      expect(stats.keywords).toContain("Blocker");
    });

    it("does NOT grant <Blocker> when the enemy has fewer than 4 units", () => {
      const engine = GundamTestEngine.create(
        { play: [gd01ByarlantCustom019] },
        { play: [createMockUnit(), createMockUnit(), createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const framework = engine.getRuntime().getFrameworkReadAPI();

      const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
      expect(stats.keywords).not.toContain("Blocker");
    });
  });
});
