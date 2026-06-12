import { describe, expect, it } from "vite-plus/test";
import {
  alphaDyingNightVSPistol,
  alphaFloorIt,
  alphaKiroshiOptics,
  alphaMantisBlades,
  alphaSandevistan,
  alphaViktorVektorSitDownAndRelax,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Viktor Vektor - Sit Down and Relax", () => {
  it("calls to search the top five for up to two low-cost gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: alphaViktorVektorSitDownAndRelax, faceDown: true }],
      eddies: 1,
    });
    const topDeckCards = [
      alphaKiroshiOptics,
      alphaMantisBlades,
      alphaSandevistan,
      alphaFloorIt,
      alphaDyingNightVSPistol,
    ].map((definition) => {
      const card = engine.getCardsInZone("deck", P1).find((c) => c.definitionId === definition.id);
      if (!card) {
        throw new Error(`Expected ${definition.displayName} to exist in P1's deck.`);
      }
      return card;
    });
    engine.judgeStackDeck(topDeckCards, { as: P1 });

    engine.callLegend(alphaViktorVektorSitDownAndRelax, { as: P1 });
    const choice = engine.getPrompt(P1).choice;
    expect(choice?.type).toBe("searchDeck");
    if (choice?.type !== "searchDeck") {
      throw new Error("Expected Viktor to create a searchDeck choice.");
    }
    const selected = choice.payload.revealedCardIds.filter((cardId) => {
      const definitionId = engine.getCard(cardId).definitionId;
      return definitionId === alphaKiroshiOptics.id || definitionId === alphaMantisBlades.id;
    });
    expect(selected).toHaveLength(2);
    expect(engine.resolveSearchDeck(selected, { as: P1 })).toMatchObject({ success: true });

    const handDefinitions = engine.getCardsInZone("hand", P1).map((card) => card.definitionId);
    expect(handDefinitions).toContain(alphaKiroshiOptics.id);
    expect(handDefinitions).toContain(alphaMantisBlades.id);
    expect(handDefinitions).not.toContain(alphaSandevistan.id);
  });
});
