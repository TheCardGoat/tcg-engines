import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDetonate,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGorillaArms,
  welcomeToNightCityRetailKiroshiOptics,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const detonate = welcomeToNightCityRetailDetonate;

describe("Detonate", () => {
  it("is a QUICK program that defeats a rival Gear with power 2 or less", () => {
    expect(detonate).toMatchObject({
      type: "program",
      color: "red",
      cost: 1,
      printNumber: "031",
    });
    expect(detonate.keywords).toContain("quick");
    expect(detonate.abilities[1]?.effects[0]).toMatchObject({
      effect: "defeat",
      target: { cardTypes: ["gear"], maxPower: 2 },
    });
  });

  it("defeats an equipped rival Gear of power 2 or less", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [detonate],
        eddies: 1,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
      },
    );

    engine.playCard(detonate, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailKiroshiOptics, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      detonate.id,
    );
  });

  it("does not offer a Gear whose power is greater than 2", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [detonate],
        eddies: 1,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            attachedGears: [welcomeToNightCityRetailGorillaArms],
          },
        ],
      },
    );

    engine.playCard(detonate, { as: P1 });

    const gorilla = engine.getCard(welcomeToNightCityRetailGorillaArms, "field", P2);
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).not.toBe("chooseTarget");
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailGorillaArms.id,
    );
    expect(gorilla.zone).toBe("field");
  });
});
