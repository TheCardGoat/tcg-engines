import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainRideshareAi,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const delamain = welcomeToNightCityRetailDelamainRideshareAi;

describe("Delamain — Rideshare AI", () => {
  it("is a blue AI unit with power 0", () => {
    expect(delamain).toMatchObject({
      type: "unit",
      color: "blue",
      classifications: ["AI"],
      cost: 3,
      power: 0,
      printNumber: "111",
    });
  });

  it("draws 2 on Play", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [delamain],
      deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailCorpoSecurity],
      eddies: 3,
    });
    const handBefore = engine.getHandCount(P1);
    engine.playCard(delamain, { as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore - 1 + 2);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      delamain.id,
    );
  });

  it("does not steal Gigs on a successful direct attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: delamain, spent: false, hasLag: false }],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    engine.attackRival(delamain, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getGigDice(P1)).toHaveLength(0);
    expect(engine.getEvents("gigStolen")).toHaveLength(0);
  });
});
