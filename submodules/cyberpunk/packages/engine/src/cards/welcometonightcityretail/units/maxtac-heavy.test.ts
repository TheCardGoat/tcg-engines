import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMaxtacHeavy,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const heavy = welcomeToNightCityRetailMaxtacHeavy;

describe("MaxTac Heavy", () => {
  it("is a green NCPD unit with printed cost 7", () => {
    expect(heavy).toMatchObject({
      type: "unit",
      color: "green",
      classifications: ["NCPD"],
      cost: 7,
      power: 8,
      printNumber: "081",
    });
    expect(heavy.costModifier).toMatchObject({ reducer: "perTargetCount", min: 1 });
  });

  it("costs its printed 7 €$ against an empty rival field", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [heavy],
      legendArea: [],
      eddies: heavy.cost,
    });
    const id = engine.findCardId(heavy, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(heavy.cost);
    engine.playCard(heavy, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("reduces cost by 1 per rival Unit, never below 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [heavy],
        eddies: 1,
      },
      {
        field: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
      },
    );
    const id = engine.findCardId(heavy, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(1);
    engine.playCard(heavy, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });
});
