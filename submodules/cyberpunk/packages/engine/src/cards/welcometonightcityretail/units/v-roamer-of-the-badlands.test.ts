import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailVRoamerOfTheBadlands,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("V — Roamer of the Badlands", () => {
  it("increases a Gig it steals by up to 5", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailVRoamerOfTheBadlands, spent: false, hasLag: false },
        ],
      },
      { gigArea: [{ dieType: "d8", faceValue: 2 }] },
    );
    const stolenGigId = engine.findGigIdByType(P2, "d8");

    engine.attackRival(welcomeToNightCityRetailVRoamerOfTheBadlands, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    engine.resolveAdjustGig(7, { as: P1 });

    expect(engine.getGigDice(P1).find((gig) => gig.id === stolenGigId)?.faceValue).toBe(7);
  });

  it("draws at end of its controller's turn with two 8+ Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailCorpoSecurity],
      field: [{ card: welcomeToNightCityRetailVRoamerOfTheBadlands, spent: false, hasLag: false }],
      gigArea: [
        { dieType: "d8", faceValue: 8 },
        { dieType: "d10", faceValue: 8 },
      ],
    });
    const handBefore = engine.getHandCount(P1);

    engine.completeTurn({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
  });

  it("does not draw at end of turn with fewer than two 8+ Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailCorpoSecurity],
      field: [{ card: welcomeToNightCityRetailVRoamerOfTheBadlands, spent: false, hasLag: false }],
      gigArea: [
        { dieType: "d8", faceValue: 8 },
        { dieType: "d10", faceValue: 7 },
      ],
    });
    const handBefore = engine.getHandCount(P1);

    engine.completeTurn({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore);
  });
});
