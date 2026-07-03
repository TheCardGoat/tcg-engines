import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Sasha Yakovleva - Won't Let You Down", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown);
  });

  it("reveals and adds the top deck card when attacking, then gains power equal to its cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [alphaCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
            spent: false,
            playedThisTurn: false,
          },
        ],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      { preserveDeckOrder: true },
    );
    const sashaId = engine.findCardId(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      "field",
      P1,
    );

    engine.attackRival(welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
    expect(engine.getEvents("cardsRevealed")).toHaveLength(1);
    expect(getEffectivePower(engine.getState(), sashaId)).toBe(alphaCorpoSecurity.cost);
  });
});
