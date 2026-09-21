import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailRiotShield,
  welcomeToNightCityRetailSandevistan,
  welcomeToNightCityRetailViktorVektorDropYourIllusions,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const viktor = welcomeToNightCityRetailViktorVektorDropYourIllusions;
const cyberware = welcomeToNightCityRetailSandevistan;

describe("Viktor Vektor — Drop Your Illusions", () => {
  it("has the exact yellow Ripperdoc identity and first-Cyberware modifier DSL", () => {
    expect(viktor).toMatchObject({
      canonicalId: "viktor-vektor-drop-your-illusions",
      slug: "viktor-vektor-drop-your-illusions",
      name: "Viktor Vektor",
      subname: "Drop Your Illusions",
      displayName: "Viktor Vektor: Drop Your Illusions",
      type: "unit",
      color: "yellow",
      classifications: ["Ripperdoc"],
      cost: 5,
      power: 5,
      ram: 2,
      hasSellTag: false,
      rarity: "Epic",
      printNumber: "057",
      rulesText: "Play your first CYBERWARE Gear each turn for -3 €$, to a minimum of 1 €$.",
      abilities: [
        {
          kind: "static",
          text: "Play your first CYBERWARE Gear each turn for -3 €$, to a minimum of 1 €$.",
          limits: ["firstTimeEachTurn"],
          effects: [
            {
              effect: "grantCostModifier",
              player: "friendly",
              appliesTo: {
                selector: "card",
                controller: "friendly",
                zones: ["hand"],
                cardTypes: ["gear"],
                classifications: ["Cyberware"],
              },
              modifier: { reducer: "flat", amount: 3, min: 1 },
              duration: "continuous",
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 5, enters with Lag, and rejects one less", () => {
    const success = CyberpunkTestEngine.createWithFixture({ hand: [viktor], eddies: 5 });
    for (const legend of success.getCardsInZone("legendArea", P1)) {
      success.judgeSpendCard(legend, { as: P1 });
    }
    success.playCard(viktor, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(success.getCard(viktor, "field", P1).meta.hasLag).toBe(true);

    const short = CyberpunkTestEngine.createWithFixture({ hand: [viktor], eddies: 4 });
    for (const legend of short.getCardsInZone("legendArea", P1)) {
      short.judgeSpendCard(legend, { as: P1 });
    }
    expect(short.expectFailure(() => short.playCard(viktor, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
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

  it("does not consume the discount when a non-Cyberware Gear is played first", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        { card: viktor, spent: false },
        { card: welcomeToNightCityRetailFieldOperator, spent: false },
      ],
      hand: [welcomeToNightCityRetailRiotShield, cyberware],
      eddies: 3,
    });
    const shieldId = engine.findCardId(welcomeToNightCityRetailRiotShield, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), shieldId, P1)).toBe(2);
    engine.attachGear(welcomeToNightCityRetailRiotShield, welcomeToNightCityRetailFieldOperator, {
      as: P1,
    });
    const cyberwareId = engine.findCardId(cyberware, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), cyberwareId, P1)).toBe(1);
    engine.attachGear(cyberware, viktor, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("refreshes the first-Cyberware discount on its controller's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        { card: viktor, spent: false },
        { card: welcomeToNightCityRetailFieldOperator, spent: false },
      ],
      hand: [cyberware, welcomeToNightCityRetailZetatechFaceplate],
      eddies: 5,
    });
    engine.attachGear(cyberware, viktor, { as: P1 });
    const faceplateId = engine.findCardId(welcomeToNightCityRetailZetatechFaceplate, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), faceplateId, P1)).toBe(2);
    engine.completeTurn({ as: P1 });
    engine.completeTurn({ as: P2 });
    expect(computeEffectiveCost(engine.getState(), faceplateId, P1)).toBe(1);
  });
});
