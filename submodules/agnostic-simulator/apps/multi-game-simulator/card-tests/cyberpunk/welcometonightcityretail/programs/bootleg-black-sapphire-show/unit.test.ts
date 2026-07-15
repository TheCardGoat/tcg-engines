import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1 } from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailBootlegBlackSapphireShow,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";

const bootleg = welcomeToNightCityRetailBootlegBlackSapphireShow; // program, cost 5, sell tag
// Deck cards used only to verify the top-card sell + draw destinations.
const topDeck = welcomeToNightCityRetailCorpoSecurity;

describe("Bootleg Black Sapphire Show", () => {
  describe("[PLAY] Sell the top card of your deck", () => {
    it("sells the top card of the deck (moves it to the Eddies area) regardless of gigs", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [bootleg],
          eddies: bootleg.cost,
          deck: [topDeck],
          gigArea: [{ dieType: "d4", faceValue: 2 }], // only even
        },
        {},
        { preserveDeckOrder: true },
      );
      const deckBefore = engine.getCardsInZone("deck", P1).length;
      engine.playCard(bootleg);
      // Top deck card sold -> deck decreased by 1 (the sell), sold card to Eddies.
      expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 1);
    });
  });

  describe("If you control an even-value Gig AND an odd-value Gig, draw 2", () => {
    it("draws 2 when you control both an even-value and an odd-value Gig", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [bootleg],
          eddies: bootleg.cost,
          deck: [
            topDeck,
            welcomeToNightCityRetailSwordwiseHuscle,
            welcomeToNightCityRetailSwordwiseHuscle,
          ],
          gigArea: [
            { dieType: "d4", faceValue: 2 }, // even
            { dieType: "d6", faceValue: 3 }, // odd
          ],
        },
        {},
        { preserveDeckOrder: true },
      );
      const deckBefore = engine.getCardsInZone("deck", P1).length;
      engine.playCard(bootleg);
      // 1 sold from deck + 2 drawn = deck decreased by 3.
      expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 3);
    });

    it("does NOT draw when you control only even-value Gigs (no odd)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [bootleg],
          eddies: bootleg.cost,
          deck: [topDeck, welcomeToNightCityRetailSwordwiseHuscle],
          gigArea: [
            { dieType: "d4", faceValue: 2 }, // even
            { dieType: "d6", faceValue: 4 }, // even
          ],
        },
        {},
        { preserveDeckOrder: true },
      );
      const deckBefore = engine.getCardsInZone("deck", P1).length;
      engine.playCard(bootleg);
      // Only the sell (1) happens; no conditional draw.
      expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 1);
    });

    it("does NOT draw when you control only odd-value Gigs (no even)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [bootleg],
          eddies: bootleg.cost,
          deck: [topDeck, welcomeToNightCityRetailSwordwiseHuscle],
          gigArea: [
            { dieType: "d4", faceValue: 3 }, // odd
            { dieType: "d6", faceValue: 5 }, // odd
          ],
        },
        {},
        { preserveDeckOrder: true },
      );
      const deckBefore = engine.getCardsInZone("deck", P1).length;
      engine.playCard(bootleg);
      // Only the sell (1); no conditional draw.
      expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 1);
    });
  });
});
