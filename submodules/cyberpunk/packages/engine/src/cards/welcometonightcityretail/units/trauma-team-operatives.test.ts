import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailTakeControl,
  welcomeToNightCityRetailTetratronicRippler,
  welcomeToNightCityRetailTraumaTeamOperatives,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const operatives = welcomeToNightCityRetailTraumaTeamOperatives;

describe("Trauma Team Operatives", () => {
  it("has the exact yellow Medtech/Trauma Team identity and cost-reducer DSL", () => {
    expect(operatives).toMatchObject({
      canonicalId: "trauma-team-operatives",
      slug: "trauma-team-operatives",
      name: "Trauma Team Operatives",
      displayName: "Trauma Team Operatives",
      type: "unit",
      color: "yellow",
      classifications: ["Medtech", "Trauma Team"],
      cost: 6,
      power: 7,
      ram: 2,
      hasSellTag: false,
      rarity: "Common",
      printNumber: "056",
      rulesText: "Play this Unit for -1 €$ for each Unit in your trash, to a minimum of 1 €$.",
      costModifier: {
        reducer: "perTargetCount",
        reductionPerCount: 1,
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["trash"],
          cardTypes: ["unit"],
        },
        min: 1,
      },
    });
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

    const short = CyberpunkTestEngine.createWithFixture({ hand: [operatives], eddies: 5 });
    for (const legend of short.getCardsInZone("legendArea", P1)) {
      short.judgeSpendCard(legend, { as: P1 });
    }
    expect(short.expectFailure(() => short.playCard(operatives, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("costs exactly 4 with two friendly Units in trash and rejects one less", () => {
    const createEngine = (eddies: number) => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [operatives],
        trash: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailCorpoSecurity],
        eddies,
      });
      for (const legend of engine.getCardsInZone("legendArea", P1)) {
        engine.judgeSpendCard(legend, { as: P1 });
      }
      return engine;
    };

    const success = createEngine(4);
    expect(
      computeEffectiveCost(success.getState(), success.findCardId(operatives, "hand", P1), P1),
    ).toBe(4);
    success.playCard(operatives, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);

    const short = createEngine(3);
    expect(short.expectFailure(() => short.playCard(operatives, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("ignores friendly non-Units and rival Units in trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [operatives],
        trash: [welcomeToNightCityRetailTetratronicRippler, welcomeToNightCityRetailTakeControl],
        eddies: 6,
      },
      { trash: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailCorpoSecurity] },
    );

    expect(
      computeEffectiveCost(engine.getState(), engine.findCardId(operatives, "hand", P1), P1),
    ).toBe(6);
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
