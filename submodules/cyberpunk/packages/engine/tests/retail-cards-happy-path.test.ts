import { describe, expect, it } from "vite-plus/test";

import { structuredCards } from "@tcg/cyberpunk-cards";

import { CyberpunkTestEngine, P1 } from "../src/testing/index.ts";

describe("official cards", () => {
  it("loads every structured card into an engine fixture", () => {
    expect(structuredCards.length).toBeGreaterThan(0);

    for (const card of structuredCards) {
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
