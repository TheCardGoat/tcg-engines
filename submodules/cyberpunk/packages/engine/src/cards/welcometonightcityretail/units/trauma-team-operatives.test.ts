import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailTraumaTeamOperatives,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const operatives = welcomeToNightCityRetailTraumaTeamOperatives;

describe("Trauma Team Operatives", () => {
  it("is a yellow Medtech/Trauma Team unit with printed cost 6", () => {
    expect(operatives).toMatchObject({
      type: "unit",
      color: "yellow",
      classifications: ["Medtech", "Trauma Team"],
      cost: 6,
      power: 7,
      printNumber: "056",
    });
    expect(operatives.costModifier).toMatchObject({ reducer: "perTargetCount", min: 1 });
  });

  it("costs the printed 6 €$ with an empty trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [operatives],
      eddies: 6,
    });
    const id = engine.findCardId(operatives, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(6);
    engine.playCard(operatives, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("reduces cost by 1 per Unit in trash, never below 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [operatives],
      trash: [
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
      ],
      eddies: 1,
    });
    const id = engine.findCardId(operatives, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(1);
    engine.playCard(operatives, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });
});
