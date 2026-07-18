import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailOctant } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const octant = welcomeToNightCityRetailOctant;

describe("Octant", () => {
  it("costs its printed 7 €$ when no friendly Gig has value 8 or more", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [octant],
      eddies: 7,
      gigArea: [{ dieType: "d6", faceValue: 6 }],
    });

    engine.playCard(octant, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      octant.id,
    );
  });

  it("reduces the play cost by one for each friendly 8+ Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [octant],
      eddies: 5,
      gigArea: [
        { dieType: "d8", faceValue: 8 },
        { dieType: "d10", faceValue: 9 },
        { dieType: "d6", faceValue: 7 },
      ],
    });

    engine.playCard(octant, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
  });

  it("never reduces the play cost below 1 €$", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [octant],
      eddies: 1,
      gigArea: [
        { dieType: "d8", faceValue: 8 },
        { dieType: "d10", faceValue: 9 },
        { dieType: "d12", faceValue: 10 },
        { dieType: "d20", faceValue: 11 },
      ],
    });

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
});
