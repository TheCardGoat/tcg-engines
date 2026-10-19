import { describe, expect, it } from "vitest";
import { alphaClashServerAdapter as adapter } from "./adapter";
import { alphaClashReleaseDecks } from "./release-policy";
import {
  alphaClashPracticeDecks,
  getAlphaClashMetaPracticeDeck,
  getAlphaClashPracticeCatalog,
  resolveAlphaClashLabDeck,
} from "./practice";

describe("audited curated practice presets", () => {
  for (const preset of alphaClashReleaseDecks()) {
    it(`${preset.id} is published only after every release check passes`, () => {
      const approved = preset.issues.length === 0;
      expect(adapter.practiceDecks!.ids.includes(preset.id)).toBe(approved);
      expect(alphaClashPracticeDecks.some((deck) => deck.id === preset.id)).toBe(approved);
      expect(getAlphaClashPracticeCatalog().decks.some((deck) => deck.id === preset.id)).toBe(
        approved,
      );
      expect(Boolean(getAlphaClashMetaPracticeDeck(preset.id))).toBe(approved);
      for (const suffix of ["", "@42"]) {
        const deck = adapter.practiceDecks!.getDeck(`${preset.id}${suffix}`);
        if (!approved) {
          expect(deck).toBeUndefined();
          continue;
        }
        expect(deck).toBeDefined();
        expect(adapter.validateDeckForFormat("constructed", deck!).valid).toBe(true);
        const lab = resolveAlphaClashLabDeck(preset.id);
        expect(deck!.filter((entry) => entry.sectionId === "contender")).toEqual([
          { cardId: lab.contenderId, quantity: 1, sectionId: "contender" },
        ]);
        expect(
          deck!
            .filter((entry) => entry.sectionId === "main")
            .flatMap((entry) => Array(entry.quantity).fill(entry.cardId))
            .sort(),
        ).toEqual([...lab.deckIds].sort());
      }
    });
  }

  it.each(["starter-titan", "starter-titan@42", "starter-warden", "starter-warden@42", "unknown"])(
    "does not expose unaudited generated preset %s",
    (id) => {
      expect(adapter.practiceDecks!.ids).not.toContain(id);
      expect(adapter.practiceDecks!.getDeck(id)).toBeUndefined();
    },
  );

  it("retains raw curated lists for developer audit tooling", () => {
    expect(resolveAlphaClashLabDeck("clarity-hyper-aggro").deckIds).toHaveLength(50);
  });
});
