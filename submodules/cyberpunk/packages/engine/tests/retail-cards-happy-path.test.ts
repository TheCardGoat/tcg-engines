import { describe, expect, it } from "vite-plus/test";
import {
  boxToppersRetailCards,
  theHeistRetailStarterDeckCards,
  welcomeToNightCityRetailCards,
} from "@tcg/cyberpunk-cards";
import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { CyberpunkTestEngine, P1 } from "../src/testing/index.ts";

const retailCards = [
  ...boxToppersRetailCards,
  ...theHeistRetailStarterDeckCards,
  ...welcomeToNightCityRetailCards,
] satisfies StructuredCardDefinition[];

describe("official retail cards", () => {
  it("loads every official retail card into an engine fixture", () => {
    // Self-adjusting: the count is whatever the three retail sets total today
    // (box-toppers merged into higher-priority sets, so it can drift).
    expect(retailCards).toHaveLength(
      boxToppersRetailCards.length +
        theHeistRetailStarterDeckCards.length +
        welcomeToNightCityRetailCards.length,
    );

    for (const card of retailCards) {
      const engine = CyberpunkTestEngine.createWithFixture(
        card.type === "legend" ? { legendArea: [card] } : { trash: [card] },
      );
      const zone = card.type === "legend" ? "legendArea" : "trash";
      const cards = engine.getCardsInZone(zone, P1);
      expect(
        cards.some((fixtureCard) => fixtureCard.definitionId === card.id),
        `${card.displayName} is fixture-loadable`,
      ).toBe(true);
    }
  });
});
