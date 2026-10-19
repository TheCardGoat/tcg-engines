import { describe, expect, it } from "vitest";
import { alphaClashServerAdapter } from "@tcg/alpha-clash-server-adapter";
import {
  alphaClashPracticeDeckFromPayload,
  alphaClashPracticeSetupFromSearch,
} from "./practice-setup";

function encodePayload(payload: unknown): string {
  return btoa(JSON.stringify(payload))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

/** Use an admitted deck, including its exact card quantities. */
function legalPayload() {
  const deck = alphaClashServerAdapter.practiceDecks!.getDeck("clarity-hyper-aggro")!;
  return {
    contenderId: deck.find((card) => card.sectionId === "contender")!.cardId,
    main: Object.fromEntries(
      deck.filter((card) => card.sectionId === "main").map((card) => [card.cardId, card.quantity]),
    ),
  };
}

describe("alpha-clash deck-builder practice payload", () => {
  it("round-trips a legal deck into a validated setup", () => {
    const payload = legalPayload();
    const encoded = encodePayload({ v: 1, c: payload.contenderId, m: payload.main });
    const deck = alphaClashPracticeDeckFromPayload(encoded);
    expect(deck[0]).toMatchObject({
      cardId: payload.contenderId,
      quantity: 1,
      sectionId: "contender",
    });
    expect(
      deck
        .filter((entry) => entry.sectionId === "main")
        .reduce((total, entry) => total + entry.quantity, 0),
    ).toBe(50);
    const setup = alphaClashPracticeSetupFromSearch(
      new URLSearchParams({
        deck: encoded,
        seed: "42",
        mode: "bot",
      }),
    );
    expect(setup).not.toBeNull();
    expect(setup?.playerDeckId).toBe("custom-deck");
    expect(
      alphaClashServerAdapter.validateDeckForFormat("constructed", setup!.playerDeck!).valid,
    ).toBe(true);
  });

  it("rejects malformed payloads with a clear error", () => {
    expect(() => alphaClashPracticeDeckFromPayload("not-a-payload")).toThrow(
      "Invalid Alpha Clash deck-builder link.",
    );
    expect(() =>
      alphaClashPracticeDeckFromPayload(encodePayload({ v: 2, c: "ac-ac1-047", m: {} })),
    ).toThrow("Invalid Alpha Clash deck-builder link.");
  });

  it("still resolves preset deck ids without a deck payload", () => {
    const setup = alphaClashPracticeSetupFromSearch(
      new URLSearchParams({ playerDeck: "clarity-hyper-aggro", seed: "7" }),
    );
    expect(setup?.playerDeckId).toBe("clarity-hyper-aggro");
    expect(setup?.playerDeck).toBeUndefined();
  });
});
