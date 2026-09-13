import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAnimalsWrecker,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailRogueAmendiaresQueenOfTheAfterlife,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const rogue = welcomeToNightCityRetailRogueAmendiaresQueenOfTheAfterlife;

describe("Rogue Amendiares — Queen of the Afterlife", () => {
  it("is a blue QUICK Merc unit", () => {
    expect(rogue).toMatchObject({
      type: "unit",
      color: "blue",
      classifications: ["Fixer", "Merc"],
      cost: 5,
      power: 4,
      printNumber: "126",
    });
    expect(rogue.keywords).toContain("quick");
  });

  it("readies 2 Eddies the first time another friendly Unit steals a Gig below its power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: rogue, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailAnimalsWrecker, spent: false, hasLag: false },
        ],
        eddies: 1,
        spentEddies: 2,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailAnimalsWrecker, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getEvents("gigStolen")).toHaveLength(1);
    expect(engine.getEddies(P1)).toBe(3);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(0);
  });

  it("does not ready Eddies when this Unit itself steals", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: rogue, spent: false, hasLag: false }],
        eddies: 1,
        spentEddies: 2,
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.attackRival(rogue, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(2);
  });

  it("spends itself and 2 €$ to make a rival Unit lose this Unit's power this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: rogue, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      },
    );

    engine.activateAbility(rogue, 2, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    const operator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(engine.getCard(rogue, "field", P1).meta.spent).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expect(welcomeToNightCityRetailFieldOperator.power).toBe(2);
    expect(rogue.power).toBe(4);
    expect(
      engine
        .getState()
        .G.activeEffects.some(
          (effect) =>
            effect.kind === "powerModifier" &&
            effect.targetCardId === operator.instanceId &&
            effect.powerModifier === -rogue.power,
        ),
    ).toBe(true);
    expect(getEffectivePower(engine.getState(), operator.instanceId as string)).toBe(0);
  });
});
