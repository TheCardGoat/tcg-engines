import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMemoryRelapse,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const relapse = welcomeToNightCityRetailMemoryRelapse;

describe("Memory Relapse", () => {
  it("is a green Braindance program", () => {
    expect(relapse).toMatchObject({
      type: "program",
      color: "green",
      classifications: ["Braindance"],
      cost: 3,
      printNumber: "100",
    });
    expect(relapse.abilities[0]?.effects.map((effect) => effect.effect)).toEqual([
      "spend",
      "grantRule",
      "draw",
    ]);
  });

  it("spends a rival Unit, stops it from readying, and draws when Street Cred is even", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [relapse],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      },
      { preserveDeckOrder: true },
    );
    const handBefore = engine.getHandCount(P1);

    engine.playCard(relapse, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    const operator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(operator.meta.spent).toBe(true);
    expect(getEffectiveRules(engine.getState(), operator.instanceId as string)).toContain(
      "cantReady",
    );
    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("does not draw when Street Cred is odd", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [relapse],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      },
    );
    const handBefore = engine.getHandCount(P1);

    engine.playCard(relapse, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore - 1);
  });
});
