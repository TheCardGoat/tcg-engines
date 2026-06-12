import { describe, expect, it } from "vite-plus/test";
import { promoLucynaKushinada } from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  P1,
  expectCallableLegend,
  expectNoPendingChoice,
} from "@cyberpunk-engine/testing/index.ts";

const lucyna = promoLucynaKushinada;

describe("Lucyna Kushinada", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: lucyna, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, lucyna);
    });

    it("does NOT create a pending choice after calling", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [lucyna],
        eddies: 2,
      });
      engine.callLegend(lucyna);
      expectNoPendingChoice(engine);
    });
  });

  describe("No card-specific abilities", () => {
    it("can be called as a standard face-down Legend without creating a pending ability", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [lucyna],
        eddies: 2,
      });

      engine.callLegend(lucyna);

      const calledLucyna = engine.getCard(lucyna, "legendArea", P1);
      expect(calledLucyna.meta.faceDown).toBe(false);
      expect(calledLucyna.meta.spent).toBe(false);
      expect(engine.getEddies(P1)).toBe(1);
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    });

    it("declares no card-specific timing triggers, keywords, or abilities", () => {
      expect(lucyna.rulesText).toBeNull();
      expect(lucyna.timingTriggers).toEqual([]);
      expect(lucyna.keywords).toEqual([]);
      expect(lucyna.abilities).toEqual([]);
    });
  });
});
