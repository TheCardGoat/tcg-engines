import { describe, expect, it } from "vitest";
import { buildDeck } from "@tcg-engines/naruto-engine";
import { parseNarutoPracticeDeckPayload } from "../pages/deckImport.ts";

function encode(value: unknown): string {
  return btoa(JSON.stringify(value)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

describe("Naruto practice deck payload", () => {
  it("round-trips a valid grouped Preview deck", () => {
    const deck = buildDeck("N-001");
    const counts = (ids: readonly string[]) =>
      Object.fromEntries(
        ids.reduce((map, id) => map.set(id, (map.get(id) ?? 0) + 1), new Map<string, number>()),
      );
    const parsed = parseNarutoPracticeDeckPayload(
      encode({
        v: 2,
        l: deck.leaderId,
        m: counts(deck.cardIds),
        ca: deck.chakraCardIds[0],
        sa: deck.summonCardId,
      }),
    );
    expect(parsed.errors).toEqual([]);
    expect(parsed.issues).toEqual([]);
    expect(parsed.deck.leaderId).toBe(deck.leaderId);
    expect(parsed.deck.summonCardId).toBe(deck.summonCardId);
    expect(counts(parsed.deck.cardIds)).toEqual(counts(deck.cardIds));
    expect(counts(parsed.deck.chakraCardIds)).toEqual(counts(deck.chakraCardIds));
  });

  it("rejects an invalid payload without starting a deck", () => {
    expect(parseNarutoPracticeDeckPayload("not-a-payload").errors).toEqual([
      "Invalid Naruto deck-builder link",
    ]);
  });
});
