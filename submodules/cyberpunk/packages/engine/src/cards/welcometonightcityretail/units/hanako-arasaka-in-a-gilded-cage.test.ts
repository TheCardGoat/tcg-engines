import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailHanakoArasakaInAGildedCage,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRebootOptics,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Hanako Arasaka - In A Gilded Cage", () => {
  it("reveals the top four and starts a search-deck choice keyed to a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHanakoArasakaInAGildedCage],
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailRebootOptics,
        ],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailHanakoArasakaInAGildedCage, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailHanakoArasakaInAGildedCage.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailRebootOptics.id,
    ]);
    expect(
      engine
        .getCardsInZone("deck", P1)
        .map((card) => card.definitionId)
        .slice(-2),
    ).toEqual([welcomeToNightCityRetailFieldOperator.id, welcomeToNightCityRetailMantisBlades.id]);
  });
});
