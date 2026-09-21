import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Kerry Eurodyne - The Last Rockerboy", () => {
  it("is the exact red 4-cost 5-power Rocker Samurai Unit with its Spend ability", () => {
    expect(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy).toMatchObject({
      type: "unit",
      color: "red",
      classifications: ["Rocker", "Samurai"],
      printNumber: "012",
      cost: 4,
      power: 5,
      ram: 2,
      hasSellTag: false,
      abilities: [
        expect.objectContaining({
          trigger: { trigger: "activated" },
          costs: [
            {
              cost: "spend",
              target: { selector: "self" },
            },
          ],
          effects: [
            expect.objectContaining({
              effect: "draw",
              player: "friendly",
              amount: 2,
            }),
          ],
        }),
      ],
    });
  });

  it("spends to draw two cards when a friendly Gig has value 8 or more", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      field: [{ card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, spent: false }],
      gigArea: [{ dieType: "d10", faceValue: 8 }],
    });
    const handBefore = engine.getHandCount(P1);

    engine.activateAbility(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, 0, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore + 2);
    expect(
      engine.getCard(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, "field", P1).meta.spent,
    ).toBe(true);
  });

  it("cannot activate or spend without a friendly 8+ value Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      field: [{ card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, spent: false }],
      gigArea: [{ dieType: "d10", faceValue: 7 }],
    });
    const handBefore = engine.getHandCount(P1);

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, 0, { as: P1 }),
    );

    expect(failure.errorCode).toBe("NO_VALID_TARGETS");
    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(
      engine.getCard(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, "field", P1).meta.spent,
    ).toBe(false);
  });

  it("finds a qualifying friendly Gig even when a lower-value Gig comes first", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      field: [{ card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, spent: false }],
      gigArea: [
        { dieType: "d10", faceValue: 7 },
        { dieType: "d12", faceValue: 9 },
      ],
    });
    const handBefore = engine.getHandCount(P1);

    engine.activateAbility(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, 0, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore + 2);
  });

  it("does not count a rival 8+ Gig as controlled", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
        field: [{ card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, spent: false }],
        gigArea: [{ dieType: "d10", faceValue: 7 }],
      },
      { gigArea: [{ dieType: "d12", faceValue: 9 }] },
    );
    const p1HandBefore = engine.getHandCount(P1);
    const p2HandBefore = engine.getHandCount(P2);

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, 0, { as: P1 }),
    );

    expect(failure.errorCode).toBe("NO_VALID_TARGETS");
    expect(engine.getHandCount(P1)).toBe(p1HandBefore);
    expect(engine.getHandCount(P2)).toBe(p2HandBefore);
    expect(
      engine.getCard(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, "field", P1).meta.spent,
    ).toBe(false);
  });

  it("cannot activate while Kerry is already spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      field: [
        {
          card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
          spent: true,
          hasLag: false,
        },
      ],
      gigArea: [{ dieType: "d10", faceValue: 8 }],
    });
    const handBefore = engine.getHandCount(P1);

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, 0, { as: P1 }),
    );

    expect(failure.errorCode).toBe("CARD_SPENT");
    expect(engine.getHandCount(P1)).toBe(handBefore);
  });

  it("cannot activate its Spend ability while Kerry has Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      field: [
        {
          card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
          spent: false,
          hasLag: true,
        },
      ],
      gigArea: [{ dieType: "d10", faceValue: 8 }],
    });
    const handBefore = engine.getHandCount(P1);

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, 0, { as: P1 }),
    );

    expect(failure.errorCode).toBe("CARD_SPENT");
    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(
      engine.getCard(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, "field", P1).meta.spent,
    ).toBe(false);
  });
});
