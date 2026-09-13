import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDonTFearTheReaper,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const reaper = welcomeToNightCityRetailDonTFearTheReaper;

describe("(Don't Fear) The Reaper", () => {
  it("is a green Samurai program", () => {
    expect(reaper).toMatchObject({
      type: "program",
      color: "green",
      classifications: ["Samurai"],
      cost: 7,
      printNumber: "098",
    });
  });

  it("spends all rival Units then defeats a spent Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [reaper],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }],
        eddies: 7,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
        ],
      },
    );

    engine.playCard(reaper, { as: P1 });
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      reaper.id,
    );
  });

  it("can defeat a friendly spent Unit after spending rivals", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [reaper],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }],
        eddies: 7,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );

    engine.playCard(reaper, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });
});
