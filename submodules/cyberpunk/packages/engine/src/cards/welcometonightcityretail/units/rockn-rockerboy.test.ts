import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailRocknRockerboy } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const rocker = welcomeToNightCityRetailRocknRockerboy;

describe("Rockn' Rockerboy", () => {
  it("is a flavor-only yellow Rocker unit", () => {
    expect(rocker).toMatchObject({
      type: "unit",
      color: "yellow",
      classifications: ["Rocker"],
      cost: 5,
      power: 8,
      printNumber: "052",
    });
    expect(rocker.abilities).toEqual([]);
  });

  it("plays as a vanilla Unit for its printed cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [rocker],
      legendArea: [],
      eddies: rocker.cost,
    });

    engine.playCard(rocker, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      rocker.id,
    );
  });
});
