import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckViktorVektorSitDownAndRelax,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSandevistan,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectSearchDeckChoice } from "../../../testing/index.ts";

describe("Viktor Vektor - Sit Down and Relax (The Heist retail starter)", () => {
  it("calls to search the top 5 for up to two low-cost Gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: theHeistRetailStarterDeckViktorVektorSitDownAndRelax, faceDown: true },
        ],
        deck: [
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailSandevistan,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(theHeistRetailStarterDeckViktorVektorSitDownAndRelax, { as: P1 });
    expectSearchDeckChoice(engine, {
      lookCount: 5,
      reveal: true,
      select: { kind: "upTo", max: 2 },
    });
    engine.resolveSearchDeck(
      [welcomeToNightCityRetailDyingNightVSPistol, welcomeToNightCityRetailMantisBlades],
      { as: P1 },
    );

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailDyingNightVSPistol.id,
        welcomeToNightCityRetailMantisBlades.id,
      ]),
    );
  });

  it("can resolve the search with no selected cards when no eligible Gear is revealed", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: theHeistRetailStarterDeckViktorVektorSitDownAndRelax, faceDown: true },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(theHeistRetailStarterDeckViktorVektorSitDownAndRelax, { as: P1 });
    expectSearchDeckChoice(engine, {
      lookCount: 5,
      reveal: true,
      select: { kind: "upTo", max: 2 },
    });
    engine.resolveSearchDeck([], { as: P1 });

    expect(engine.getHandCount(P1)).toBe(0);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
