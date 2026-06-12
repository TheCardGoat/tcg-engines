import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockCommand,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd01Michaelis076 } from "./076-michaelis.ts";

describe("Michaelis (GD01-076)", () => {
  describe("While there are 4 or more Command cards in your trash, this Unit gets AP+1 and HP+1.", () => {
    it("gets AP+1/HP+1 when 4+ Command cards are in trash", () => {
      const engine = GundamTestEngine.create({
        play: [gd01Michaelis076],
        trash: [createMockCommand(), createMockCommand(), createMockCommand(), createMockCommand()],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const framework = engine.getRuntime().getFrameworkReadAPI();

      const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
      // Printed AP 3 + 1, HP 3 + 1
      expect(stats.ap).toBe(4);
      expect(stats.hp).toBe(4);
    });

    it("keeps printed stats when fewer than 4 Command cards are in trash", () => {
      const engine = GundamTestEngine.create({
        play: [gd01Michaelis076],
        trash: [createMockCommand(), createMockCommand(), createMockCommand()],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const framework = engine.getRuntime().getFrameworkReadAPI();

      const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
      expect(stats.ap).toBe(3);
      expect(stats.hp).toBe(3);
    });
  });
});
