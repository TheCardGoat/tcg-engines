import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckMt0d12Flathead,
  welcomeToNightCityRetailOctant,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const octant = welcomeToNightCityRetailOctant;

describe("Octant", () => {
  it("is the exact red 7-cost 8-power Militech Zetatech Drone", () => {
    expect(octant).toMatchObject({
      canonicalId: "octant",
      slug: "octant",
      name: "Octant",
      displayName: "Octant",
      type: "unit",
      color: "red",
      classifications: ["Drone", "Militech", "Zetatech"],
      cost: 7,
      power: 8,
      ram: 4,
      hasSellTag: false,
      printNumber: "015",
      rulesText:
        "Play this Unit for -1 €$ for each friendly Gig with 8+ value, to a minimum of 1 €$.",
      costModifier: {
        reducer: "perTargetCount",
        reductionPerCount: 1,
        target: {
          selector: "gig",
          controller: "friendly",
          amount: "all",
          minValue: 8,
        },
        min: 1,
      },
    });
  });

  it("costs its printed 7 €$ when no friendly Gig has value 8 or more", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [octant],
      eddies: 7,
      gigArea: [{ dieType: "d6", faceValue: 6 }],
    });

    const octantId = engine.findCardId(octant, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), octantId, P1)).toBe(7);
    engine.playCard(octant, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      octant.id,
    );
    expect(engine.getCard(octant, "field", P1).meta.hasLag).toBe(true);
  });

  it("counts the inclusive value-8 boundary but not value 7 or rival 8+ Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [octant],
        eddies: 6,
        gigArea: [
          { dieType: "d8", faceValue: 8 },
          { dieType: "d6", faceValue: 7 },
        ],
      },
      {
        gigArea: [
          { dieType: "d10", faceValue: 8 },
          { dieType: "d12", faceValue: 9 },
        ],
      },
    );

    const octantId = engine.findCardId(octant, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), octantId, P1)).toBe(6);
    engine.playCard(octant, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
  });

  it("reduces the play cost by one for each qualifying friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [octant],
      eddies: 4,
      gigArea: [
        { dieType: "d8", faceValue: 8 },
        { dieType: "d10", faceValue: 9 },
        { dieType: "d12", faceValue: 10 },
      ],
    });

    const octantId = engine.findCardId(octant, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), octantId, P1)).toBe(4);
    engine.playCard(octant, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("never reduces the play cost below 1 €$", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [octant],
      eddies: 1,
    });
    const qualifyingDice = ["d8", "d10", "d12", "d20", "d8", "d10", "d12"] as const;
    for (const [index, dieType] of qualifyingDice.entries()) {
      engine.judgeAddGigDie(P1, dieType, 8 + index, {
        id: `octant-floor-gig-${index}`,
        as: P1,
      });
    }

    const octantId = engine.findCardId(octant, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), octantId, P1)).toBe(1);
    engine.playCard(octant, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
  });

  it("does not discount Gigs below the 8-value threshold", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [octant],
      eddies: 7,
      gigArea: [
        { dieType: "d4", faceValue: 4 },
        { dieType: "d6", faceValue: 7 },
      ],
    });

    engine.playCard(octant, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
  });

  it("uses its printed 8 power to defeat a 7-power Unit in a public fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: octant, spent: false, hasLag: false }] },
      { field: [{ card: theHeistRetailStarterDeckMt0d12Flathead, spent: true }] },
    );

    engine.attackUnit(octant, theHeistRetailStarterDeckMt0d12Flathead, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCard(octant, "field", P1)).toBeDefined();
    expect(
      engine.getCardsInZone("trash", engine.getOpponentOf(P1)).map((card) => card.definitionId),
    ).toContain(theHeistRetailStarterDeckMt0d12Flathead.id);
  });
});
