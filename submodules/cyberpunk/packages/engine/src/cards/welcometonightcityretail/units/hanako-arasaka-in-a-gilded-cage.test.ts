import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  welcomeToNightCityRetailHanakoArasakaInAGildedCage,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Hanako Arasaka - In A Gilded Cage", () => {
  it("reveals the top four and starts a search-deck choice keyed to a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHanakoArasakaInAGildedCage],
        deck: [alphaCorpoSecurity, alphaCorpoSecurity, alphaCorpoSecurity, alphaCorpoSecurity],
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
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
    expect(
      welcomeToNightCityRetailHanakoArasakaInAGildedCage.abilities[0]!.effects[0],
    ).toMatchObject({
      effect: "searchDeck",
      lookCount: 4,
      reveal: true,
    });
  });
});
