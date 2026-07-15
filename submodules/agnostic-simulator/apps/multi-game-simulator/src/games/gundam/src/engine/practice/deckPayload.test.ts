import { encodeDeckToUrlParam } from "@tcg/game-page-contract";
import { describe, expect, it } from "vitest";

import { DEFAULT_DECK_ID, SAMPLE_DECKS } from "../../data/sample-decks/index.ts";
import { gundamDeckToHistoric, resolveGundamPracticePayload } from "./deckPayload.ts";

describe("resolveGundamPracticePayload", () => {
  it("falls back to legal sample decks when no deck payload is supplied", () => {
    const result = resolveGundamPracticePayload(new URLSearchParams());

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.payload.playerDeck).toBe(SAMPLE_DECKS[DEFAULT_DECK_ID]);
    expect(result.payload.botDeck).toBe(SAMPLE_DECKS[DEFAULT_DECK_ID]);
    expect(result.payload.botStrategyId).toBe("value-ranked");
  });

  it("decodes a base64url JSON DeckList and flattens it for quick-match", () => {
    const deck = SAMPLE_DECKS["seed-aggro"];
    const params = new URLSearchParams({
      deck: encodeDeckToUrlParam(JSON.stringify(deck)),
      opponent: "ef-starter",
      strategy: "pass-only",
    });

    const result = resolveGundamPracticePayload(params);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.payload.playerDeck.name).toBe(deck.name);
    expect(result.payload.botDeckListId).toBe("ef-starter");
    expect(result.payload.botStrategyId).toBe("pass-only");
    expect(gundamDeckToHistoric(deck).at(-1)).toEqual({
      cardPublicId: deck.resource.cardNumber,
      quantity: deck.resource.count,
    });
  });

  it("rejects malformed or illegal deck payloads", () => {
    const malformed = resolveGundamPracticePayload(new URLSearchParams({ deck: "not!valid!" }));
    expect(malformed.ok).toBe(false);

    const illegal = {
      ...SAMPLE_DECKS["seed-aggro"],
      cards: [{ cardNumber: "EXBP-001", count: 50 }],
    };
    const result = resolveGundamPracticePayload(
      new URLSearchParams({ deck: encodeDeckToUrlParam(JSON.stringify(illegal)) }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.details.join("\n")).toContain("token");
  });
});
