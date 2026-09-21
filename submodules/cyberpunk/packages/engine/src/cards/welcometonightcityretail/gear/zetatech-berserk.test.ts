import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailVStreetkid,
  welcomeToNightCityRetailZetatechBerserk,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const berserk = welcomeToNightCityRetailZetatechBerserk;

describe("Zetatech Berserk", () => {
  it("has the exact green Cyberware/Zetatech identity, reducer, and host contract", () => {
    expect(berserk).toMatchObject({
      canonicalId: "zetatech-berserk",
      slug: "zetatech-berserk",
      name: "Zetatech Berserk",
      displayName: "Zetatech Berserk",
      type: "gear",
      color: "green",
      classifications: ["Cyberware", "Zetatech"],
      cost: 6,
      power: 3,
      ram: 2,
      hasSellTag: true,
      rarity: "Common",
      printNumber: "096",
      rulesText: "Play this Gear for -1 €$ for each friendly face-up Legend, to a minimum of 1 €$.",
      costModifier: {
        reducer: "perTargetCount",
        reductionPerCount: 1,
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["legendArea"],
          cardTypes: ["legend"],
          face: "faceUp",
        },
        min: 1,
      },
      attachment: {
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field", "legendArea"],
          cardTypes: ["unit", "legend"],
          face: "faceUp",
        },
      },
    });
  });

  it("costs exactly 6 with only face-down Legends and rejects 5", () => {
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
    engine.spendAllLegends();
    const id = engine.findCardId(berserk, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(6);
    engine.attachGear(berserk, welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);

    const short = CyberpunkTestEngine.createWithFixture({
      hand: [berserk],
      field: [welcomeToNightCityRetailFieldOperator],
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
      eddies: 5,
    });
    short.spendAllLegends();
    expect(
      short.expectFailure(() =>
        short.attachGear(berserk, welcomeToNightCityRetailFieldOperator, { as: P1 }),
      ).errorCode,
    ).toBe("INSUFFICIENT_EDDIES");
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
    engine.spendAllLegends();
    const id = engine.findCardId(berserk, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(3);
    engine.attachGear(berserk, welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    const hostId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectivePower(engine.getState(), hostId)).toBe(5);
  });

  it("counts only friendly Legends, not rival face-up Legends", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [berserk],
        field: [welcomeToNightCityRetailFieldOperator],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
        eddies: 6,
      },
      {
        legendArea: [
          { card: welcomeToNightCityRetailVStreetkid, faceDown: false },
          { card: welcomeToNightCityRetailVStreetkid, faceDown: false },
          { card: welcomeToNightCityRetailVStreetkid, faceDown: false },
        ],
      },
    );
    engine.spendAllLegends();
    const id = engine.findCardId(berserk, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(6);
    engine.attachGear(berserk, welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("can equip a friendly face-up Legend but rejects a face-down Legend", () => {
    const faceUp = CyberpunkTestEngine.createWithFixture({
      hand: [berserk],
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
      eddies: 5,
    });
    faceUp.attachGear(berserk, welcomeToNightCityRetailVStreetkid, { as: P1 });
    expect(faceUp.getCard(berserk, "field", P1).meta.attachedToId).toBe(
      faceUp.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1),
    );

    const faceDown = CyberpunkTestEngine.createWithFixture({
      hand: [berserk],
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
      eddies: 6,
    });
    expect(
      faceDown.expectFailure(() =>
        faceDown.attachGear(berserk, welcomeToNightCityRetailVStreetkid, { as: P1 }),
      ).errorCode,
    ).toBe("INVALID_CHOICE");
  });
});
