import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Field Operator", () => {
  it("is the exact 3-cost 2-power green Arasaka Corpo Techie with its Play trigger", () => {
    const operator = welcomeToNightCityRetailFieldOperator;

    expect(operator).toMatchObject({
      canonicalId: "field-operator",
      slug: "field-operator",
      name: "Field Operator",
      displayName: "Field Operator",
      type: "unit",
      color: "green",
      classifications: ["Arasaka", "Corpo", "Techie"],
      cost: 3,
      power: 2,
      ram: 2,
      hasSellTag: false,
      timingTriggers: ["play"],
      printNumber: "078",
      rarity: "Common",
      rulesText: "{Play} If your ☆ (Street Cred) is an even number, draw 1.",
    });
    expect(operator.abilities).toEqual([
      expect.objectContaining({
        trigger: { trigger: "play" },
        effects: [
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [
              {
                condition: "streetCredParity",
                controller: "friendly",
                parity: "even",
              },
            ],
          },
        ],
      }),
    ]);
  });

  it("draws on play when friendly Street Cred is even", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFieldOperator],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.hasLag).toBe(
      true,
    );
  });

  it("does not draw on play when friendly Street Cred is odd", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFieldOperator],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      { gigArea: [{ dieType: "d8", faceValue: 4 }] },
    );

    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
  });

  it("does not treat Null Street Cred as even when the controller has no Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailFieldOperator],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 3,
      gigArea: [],
    });

    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
