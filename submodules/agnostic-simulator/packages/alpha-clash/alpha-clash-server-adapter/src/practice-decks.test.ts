import { describe, expect, it } from "vitest";
import { officialCatalog } from "@tcg/alpha-clash-cards";
import { alphaClashServerAdapter } from "./adapter";

const official = new Map(officialCatalog.map((card) => [card.id, card]));

describe("official practice decks", () => {
  for (const preset of ["starter-titan", "starter-warden"]) {
    for (const suffix of ["", "@42"]) {
      it(`${preset}${suffix} contains only real cards with artwork`, () => {
        const deck = alphaClashServerAdapter.practiceDecks!.getDeck(`${preset}${suffix}`)!;
        expect(deck).toBeDefined();
        expect(alphaClashServerAdapter.validateDeckForFormat("constructed", deck).valid).toBe(true);
        for (const entry of deck) {
          const card = official.get(entry.cardId);
          expect(card, entry.cardId).toBeDefined();
          expect(card!.printings?.[0]?.productId, entry.cardId).toBeGreaterThan(0);
          expect(JSON.stringify(card), entry.cardId).not.toContain('"kind":"unparsed"');
        }
        expect(deck.find((entry) => entry.sectionId === "contender")?.cardId).toBe(
          preset === "starter-titan" ? "ac-st-001" : "ac-ac1-096",
        );
      });
    }
  }
});
