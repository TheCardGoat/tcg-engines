import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMaxtacHeavy,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const heavy = welcomeToNightCityRetailMaxtacHeavy;

describe("MaxTac Heavy", () => {
  it("is the exact green 7-cost 8-power NCPD Unit with its rival-Unit discount", () => {
    expect(heavy).toMatchObject({
      canonicalId: "maxtac-heavy",
      slug: "maxtac-heavy",
      name: "MaxTac Heavy",
      displayName: "MaxTac Heavy",
      type: "unit",
      color: "green",
      classifications: ["NCPD"],
      cost: 7,
      power: 8,
      ram: 3,
      hasSellTag: false,
      printNumber: "081",
      rulesText: "Play this Unit for -1 €$ for each of a Rival’s Units, to a minimum of 1 €$.",
      costModifier: {
        reducer: "perTargetCount",
        reductionPerCount: 1,
        target: {
          selector: "card",
          controller: "rival",
          zones: ["field"],
          cardTypes: ["unit"],
        },
        min: 1,
      },
    });
  });

  it("pays its printed 7 Eddies against an empty rival field", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [heavy],
      legendArea: [],
      eddies: heavy.cost,
    });

    engine.playCard(heavy, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(heavy.id);
  });

  it("reduces the public play cost by exactly one for each rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [heavy],
        eddies: 2,
        legendArea: [],
      },
      {
        field: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
      },
    );

    engine.playCard(heavy, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
  });

  it("does not count friendly Units or rival Legends toward the reduction", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [heavy],
        field: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 6,
        legendArea: [],
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity],
        legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
      },
    );

    engine.playCard(heavy, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
  });

  it("cannot be played for one Eddie when only five rival Units reduce it to two", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [heavy], eddies: 1, legendArea: [] },
      {
        field: Array.from({ length: 5 }, () => welcomeToNightCityRetailCorpoSecurity),
      },
    );

    const failure = engine.expectFailure(() => engine.playCard(heavy, { as: P1 }));

    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCard(heavy, "hand", P1)).toBeDefined();
  });

  it("never reduces below the printed minimum of one Eddie", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [heavy], eddies: 1, legendArea: [] },
      {
        field: Array.from({ length: 8 }, () => welcomeToNightCityRetailCorpoSecurity),
      },
    );

    engine.playCard(heavy, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(heavy.id);
  });
});
