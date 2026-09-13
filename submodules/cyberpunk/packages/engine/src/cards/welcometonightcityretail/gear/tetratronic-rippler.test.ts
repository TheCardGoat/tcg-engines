import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailTetratronicRippler,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const rippler = welcomeToNightCityRetailTetratronicRippler;

describe("Tetratronic Rippler", () => {
  it("is a blue Cyberware gear", () => {
    expect(rippler).toMatchObject({
      type: "gear",
      color: "blue",
      classifications: ["Cyberware"],
      cost: 1,
      power: 1,
      printNumber: "130",
    });
  });

  it("when the host is spent, lets you trash the top card of your deck", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [rippler],
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("scry");
    if (!choice || choice.type !== "scry") throw new Error("Expected scry");
    engine.resolveScryTo("trash", [choice.payload.revealedCardIds[0]!], { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("keeps the top card on top when you decline to trash it", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [rippler],
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveScryTo("deckTop", [], { as: P1 });

    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});
