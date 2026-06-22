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
    expect(retailCards).toHaveLength(57);

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
