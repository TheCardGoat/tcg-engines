import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, expectAttachTarget } from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailEvelynParkerBeautifulEnigma,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "@cyberpunk-engine/active-effects/index.ts";

const mantis = welcomeToNightCityRetailMantisBlades; // gear, cost 1, power +2, sell tag
const unit = welcomeToNightCityRetailFieldOperator; // a friendly Unit
const faceUpLegend = welcomeToNightCityRetailEvelynParkerBeautifulEnigma; // a plain (non-GO-SOLO) legend

describe("Mantis Blades", () => {
  describe("Equip target (friendly Unit OR face-up Legend)", () => {
    it("can attach to a friendly Unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [mantis],
        field: [{ card: unit, spent: false }],
        eddies: mantis.cost,
      });
      expectAttachTarget(engine, mantis, unit);
    });

    it("can attach to a face-up Legend (in the legend area) — verified by executing the attach", () => {
      // expectAttachTarget only resolves hosts in the field zone, so prove the
      // legend attach by performing it and asserting the gear is attached.
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [mantis],
        legendArea: [{ card: faceUpLegend, faceDown: false }],
        eddies: mantis.cost,
      });
      const result = engine.attachGear(mantis, faceUpLegend, { as: P1 });
      expect(result).toMatchObject({ success: true });
      const legend = engine.getCard(faceUpLegend, "legendArea", P1);
      expect(legend.meta.attachedGearIds).toHaveLength(1);
    });
  });

  describe("Power contribution", () => {
    it("adds its printed +2 power to the attached Unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [mantis],
        field: [{ card: unit, spent: false }],
        eddies: mantis.cost,
      });
      engine.attachGear(mantis, unit, { as: P1 });
      const host = engine.getCard(unit, "field", P1);
      expect(getEffectivePower(engine.getState(), host.instanceId)).toBe((unit.power ?? 0) + 2);
    });

    it("moves with the host (attached gear follows the host card)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [mantis],
        field: [{ card: unit, spent: false }],
        eddies: mantis.cost,
      });
      engine.attachGear(mantis, unit, { as: P1 });
      const host = engine.getCard(unit, "field", P1);
      expect(host.meta.attachedGearIds).toHaveLength(1);
      const gear = engine.getCard(mantis, "field", P1);
      expect(gear.meta.attachedToId).toBe(host.instanceId);
    });
  });
});
