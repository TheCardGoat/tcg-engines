import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailAnimalsWrecker } from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const wrecker = welcomeToNightCityRetailAnimalsWrecker;

describe("Animals Wrecker", () => {
  it("is a flavor-only red Animal/Ganger unit", () => {
    expect(wrecker).toMatchObject({
      type: "unit",
      color: "red",
      classifications: ["Animal", "Ganger"],
      cost: 6,
      power: 10,
      ram: 3,
      hasSellTag: false,
      printNumber: "007",
    });
    expect(wrecker.abilities).toEqual([]);
  });

  it("plays as a vanilla Unit for its printed cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [wrecker],
      legendArea: [],
      eddies: 6,
    });

    engine.playCard(wrecker, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    const onField = engine.getCard(wrecker, "field", P1);
    expect(onField.meta.hasLag).toBe(true);
    expect(getEffectivePower(engine.getState(), onField.instanceId)).toBe(10);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      wrecker.id,
    );
    engine.expectNoPendingChoice();
  });
});
