import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailVStreetkid,
  welcomeToNightCityRetailZetatechBerserk,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const berserk = welcomeToNightCityRetailZetatechBerserk;

describe("Zetatech Berserk", () => {
  it("is a green Cyberware/Zetatech gear with printed cost 6", () => {
    expect(berserk).toMatchObject({
      type: "gear",
      color: "green",
      classifications: ["Cyberware", "Zetatech"],
      cost: 6,
      power: 3,
      printNumber: "096",
    });
  });

  it("costs 6 €$ with no face-up Legends", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [berserk],
      field: [welcomeToNightCityRetailFieldOperator],
      legendArea: [
        { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
        { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
        { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
      ],
      eddies: 6,
    });
    const id = engine.findCardId(berserk, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(6);
  });

  it("reduces cost by 1 per friendly face-up Legend, minimum 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [berserk],
      field: [welcomeToNightCityRetailFieldOperator],
      legendArea: [
        { card: welcomeToNightCityRetailVStreetkid, faceDown: false },
        { card: welcomeToNightCityRetailVStreetkid, faceDown: false },
        { card: welcomeToNightCityRetailVStreetkid, faceDown: false },
      ],
      eddies: 3,
    });
    const id = engine.findCardId(berserk, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(3);
    engine.attachGear(berserk, welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });
});
