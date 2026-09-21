import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailViktorVektorDropYourIllusions,
  welcomeToNightCityRetailWeGottaLiveTogether,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const weGotta = welcomeToNightCityRetailWeGottaLiveTogether;

describe("We Gotta Live Together", () => {
  it("has the exact green Aldecaldo Nomad identity, replacement cost, and two optional plays", () => {
    expect(weGotta).toMatchObject({
      canonicalId: "we-gotta-live-together",
      slug: "we-gotta-live-together",
      name: "We Gotta Live Together",
      displayName: "We Gotta Live Together",
      type: "program",
      color: "green",
      classifications: ["Aldecado", "Nomad"],
      cost: 5,
      power: null,
      ram: 2,
      hasSellTag: true,
      rarity: "Uncommon",
      printNumber: "104",
      timingTriggers: ["play"],
      reminderText: ["Discard programs after they resolve."],
      rulesText:
        "If a Rival controls at least 2 more Gigs than you, play this Program for 3 €$.\nPlay up to 2 Units with cost 3 or less from your trash for free.",
      costModifier: {
        reducer: "replace",
        amount: 3,
        conditions: [
          {
            condition: "gigCountDifference",
            controller: "rival",
            comparison: "gte",
            other: "friendly",
            value: 2,
          },
        ],
      },
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            expect.objectContaining({ effect: "playCard", free: true, optional: true }),
            expect.objectContaining({ effect: "playCard", free: true, optional: true }),
          ],
        },
      ],
    });
    expect(weGotta.abilities[0]?.effects).toHaveLength(2);
  });

  it("costs 3 €$ when a Rival controls at least 2 more Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [weGotta],
        trash: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
        eddies: 3,
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
    );
    const id = engine.findCardId(weGotta, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(3);
    engine.playCard(weGotta, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("keeps its printed 5 €$ cost when the Rival does not lead by 2 Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [weGotta],
        legendArea: [],
        eddies: 3,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
    );
    const id = engine.findCardId(weGotta, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(5);
    const failure = engine.expectFailure(() => engine.playCard(weGotta, { as: P1 }));
    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
  });

  it("plays up to 2 cost-3-or-less Units from trash for free", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [weGotta],
      legendArea: [],
      trash: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      eddies: 5,
    });

    engine.playCard(weGotta, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
    engine.resolveCardToPlay(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
    engine.resolveCardToPlay(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailCorpoSecurity.id,
        welcomeToNightCityRetailFieldOperator.id,
      ]),
    );
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("offers only friendly trash Units costing at most 3", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [weGotta],
      legendArea: [],
      trash: [
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailViktorVektorDropYourIllusions,
        welcomeToNightCityRetailMantisBlades,
      ],
      eddies: 5,
    });
    engine.playCard(weGotta, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToPlay")
      throw new Error("Expected free-play choice.");
    expect(choice.payload.cardIds).toEqual([
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "trash", P1),
    ]);
  });

  it("may decline the first optional play and resolve without playing a Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [weGotta],
      legendArea: [],
      trash: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 5,
    });
    engine.playCard(weGotta, { as: P1 });
    engine.resolveCardToPlay(undefined, { as: P1, pass: true });
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
