import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailSandevistan,
  welcomeToNightCityRetailViktorVektorDropYourIllusions,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const viktor = welcomeToNightCityRetailViktorVektorDropYourIllusions;
const cyberware = welcomeToNightCityRetailSandevistan;

describe("Viktor Vektor — Drop Your Illusions", () => {
  it("is a yellow Ripperdoc unit", () => {
    expect(viktor).toMatchObject({
      type: "unit",
      color: "yellow",
      classifications: ["Ripperdoc"],
      cost: 5,
      power: 5,
      printNumber: "057",
    });
  });

  it("reduces the first Cyberware Gear played each turn by 3 €$, minimum 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: viktor, spent: false }],
      hand: [cyberware],
      eddies: 1,
    });
    const gearId = engine.findCardId(cyberware, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), gearId, P1)).toBe(1);
    engine.attachGear(cyberware, viktor, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("does not discount a second Cyberware Gear the same turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        { card: viktor, spent: false },
        { card: welcomeToNightCityRetailFieldOperator, spent: false },
      ],
      hand: [cyberware, welcomeToNightCityRetailZetatechFaceplate],
      eddies: 10,
    });

    engine.attachGear(cyberware, viktor, { as: P1 });
    const secondId = engine.findCardId(welcomeToNightCityRetailZetatechFaceplate, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), secondId, P1)).toBe(
      welcomeToNightCityRetailZetatechFaceplate.cost,
    );
  });
});
