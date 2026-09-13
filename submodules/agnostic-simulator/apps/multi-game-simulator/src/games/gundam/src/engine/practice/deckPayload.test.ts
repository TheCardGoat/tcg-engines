import {
  encodeDeckDocumentToUrlParam,
  encodeDeckToUrlParam,
  type DeckDocumentV1,
} from "@tcg/game-page-contract";
import { GUNDAM_MAIN_DECK_SIZE, GUNDAM_RESOURCE_DECK_SIZE } from "@tcg/gundam-engine";
import {
  applyGundamSetupPresentationToDocument,
  gundamDeckListToDocument,
} from "@tcg/gundam-server-adapter";
import { describe, expect, it } from "vitest";

import { DEFAULT_DECK_ID, SAMPLE_DECKS } from "../../data/sample-decks/index.ts";
import {
  gundamDeckToHistoric,
  gundamDocumentCardsToHistoric,
  resolveGundamPracticePayload,
} from "./deckPayload.ts";

describe("resolveGundamPracticePayload", () => {
  it("falls back to legal sample decks when no deck payload is supplied", () => {
    const result = resolveGundamPracticePayload(new URLSearchParams());

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.payload.playerDeck).toBe(SAMPLE_DECKS[DEFAULT_DECK_ID]);
    expect(result.payload.botDeckSource).toEqual({
      kind: "inline",
      deck: SAMPLE_DECKS[DEFAULT_DECK_ID],
      deckListId: DEFAULT_DECK_ID,
    });
    expect(result.payload.botStrategyId).toBe("combat-aware");
  });

  it("decodes a DeckDocumentV2 and flattens it for quick-match", () => {
    const deck = SAMPLE_DECKS["seed-aggro"];
    const document = applyGundamSetupPresentationToDocument(gundamDeckListToDocument(deck), {
      "ex-base": "EXB-001_p5",
      "ex-resource": "EXRP-007",
    });
    const params = new URLSearchParams({
      deck: encodeDocument(document),
      deckVersionId: "version_9",
      opponent: "ef-starter",
      strategy: "pass-only",
    });

    const result = resolveGundamPracticePayload(params);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.payload.playerDeck.name).toBe(deck.name);
    expect(result.payload.botDeckSource).toMatchObject({
      kind: "inline",
      deckListId: "ef-starter",
    });
    expect(result.payload.botStrategyId).toBe("pass-only");
    expect(result.payload.playerDeckVersionId).toBe("version_9");
    expect(result.payload.playerSetupPresentation).toEqual({
      "ex-base": "EXB-001_p5",
      "ex-resource": "EXRP-007",
    });
    expect(gundamDeckToHistoric(deck).at(-1)).toEqual({
      cardPublicId: deck.resource.cardNumber,
      quantity: deck.resource.count,
      sectionId: "resource",
    });
    expect(gundamDeckToHistoric(deck).at(0)?.sectionId).toBe("main");
  });

  it("preserves an immutable saved bot deck reference for server-side resolution", () => {
    const result = resolveGundamPracticePayload(
      new URLSearchParams({
        opponentSource: "saved_version",
        botProfileId: "profile_1",
        botDeckId: "deck_2",
        botDeckVersionId: "version_7",
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.payload.botDeckSource).toEqual({
      kind: "saved_version",
      gameProfileId: "profile_1",
      deckId: "deck_2",
      deckVersionId: "version_7",
      formatId: "standard",
    });
  });

  it("rejects incomplete saved bot deck references instead of falling back", () => {
    const result = resolveGundamPracticePayload(
      new URLSearchParams({
        opponentSource: "saved_version",
        botDeckId: "deck_2",
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toContain("incomplete");
  });

  it("rejects malformed deck payloads", () => {
    const malformed = resolveGundamPracticePayload(new URLSearchParams({ deck: "not!valid!" }));
    expect(malformed.ok).toBe(false);
  });

  it("rejects unsupported deck document versions with details", () => {
    const unsupported = encodeDeckToUrlParam(
      JSON.stringify({ ...gundamDeckListToDocument(SAMPLE_DECKS["seed-aggro"]), schemaVersion: 3 }),
    );

    const result = resolveGundamPracticePayload(new URLSearchParams({ deck: unsupported }));

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.details.join("\n")).toContain("Unsupported deck document schema version 3");
  });

  it("starts practice with an illegal deck and reports the violations as warnings", () => {
    const illegal = {
      ...SAMPLE_DECKS["seed-aggro"],
      cards: [{ cardNumber: "EXBP-001", count: 50 }],
    };
    const result = resolveGundamPracticePayload(
      new URLSearchParams({ deck: encodeDocument(gundamDeckListToDocument(illegal)) }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.payload.playerDeck).toEqual({
      name: illegal.name,
      cards: illegal.cards,
      resource: illegal.resource,
    });
    expect(result.payload.warnings.join("\n")).toContain("token");
  });

  it("drops entries the engine cannot instantiate instead of failing", () => {
    const deck = {
      ...SAMPLE_DECKS["seed-aggro"],
      cards: [...SAMPLE_DECKS["seed-aggro"].cards, { cardNumber: "FAKE-999", count: 4 }],
    };
    const result = resolveGundamPracticePayload(
      new URLSearchParams({ deck: encodeDocument(gundamDeckListToDocument(deck)) }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.payload.playerDeck.cards).toEqual(SAMPLE_DECKS["seed-aggro"].cards);
    expect(result.payload.warnings.length).toBeGreaterThan(0);
  });

  it("caps untrusted card quantities before practice deck expansion", () => {
    const sample = SAMPLE_DECKS["seed-aggro"];
    const oversized = {
      ...sample,
      cards: [{ ...sample.cards[0]!, count: 1_000_000_000 }],
      resource: { ...sample.resource, count: 1_000_000_000 },
    };
    const result = resolveGundamPracticePayload(
      new URLSearchParams({ deck: encodeDocument(gundamDeckListToDocument(oversized)) }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.payload.playerDeck.cards).toEqual([
      { ...oversized.cards[0], count: GUNDAM_MAIN_DECK_SIZE },
    ]);
    expect(result.payload.playerDeck.resource.count).toBe(GUNDAM_RESOURCE_DECK_SIZE);
  });

  it("hands unresolved cards through as warnings and sanitizes only unusable entries", () => {
    const document = gundamDeckListToDocument(SAMPLE_DECKS["seed-aggro"]);
    document.sections.main.push({
      card: { canonicalId: "GD99-999", quantity: 1 },
    });

    const result = resolveGundamPracticePayload(
      new URLSearchParams({ deck: encodeDocument(document) }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.payload.playerDeck.cards).toEqual(SAMPLE_DECKS["seed-aggro"].cards);
    expect(result.payload.warnings.join("\n")).toContain("Unknown Gundam card: GD99-999");
  });

  it("threads per-copy printing selections into the quick-match payload", () => {
    const deck = SAMPLE_DECKS["seed-aggro"];
    const canonicalId = deck.cards[0]!.cardNumber;
    const result = resolveGundamPracticePayload(
      new URLSearchParams({
        deck: encodeDocument(
          gundamDeckListToDocument(deck, { [canonicalId]: `${canonicalId}_p1` }),
        ),
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.payload.playerPrintingSelections[canonicalId]).toBe(`${canonicalId}_p1`);
    expect(gundamDeckToHistoric(deck, result.payload.playerPrintingSelections)[0]).toEqual({
      cardPublicId: canonicalId,
      quantity: deck.cards[0]!.count,
      sectionId: "main",
      printingId: `${canonicalId}_p1`,
    });
    // Entries without a selection must not synthesize a printingId.
    expect(gundamDeckToHistoric(deck, result.payload.playerPrintingSelections).at(-1)).toEqual({
      cardPublicId: deck.resource.cardNumber,
      quantity: deck.resource.count,
      sectionId: "resource",
    });
  });

  it("keeps mixed printings of one canonical as separate historic rows", () => {
    const canonicalId = SAMPLE_DECKS["seed-aggro"].cards[0]!.cardNumber;
    const result = resolveGundamPracticePayload(
      new URLSearchParams({
        deck: encodeDocument({
          schemaVersion: 1,
          game: "gundam",
          formatId: "standard",
          name: "Mixed art",
          sections: [
            {
              id: "main",
              entries: [
                { canonicalId, printingId: canonicalId, quantity: 2 },
                { canonicalId, printingId: `${canonicalId}_p1`, quantity: 2 },
              ],
            },
            {
              id: "resource",
              entries: [
                { canonicalId: "R-001", printingId: "R-001_p4", quantity: 5 },
                { canonicalId: "R-001", printingId: "R-001_p5", quantity: 5 },
              ],
            },
          ],
        }),
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const mainRows = gundamDeckToHistoric(
      result.payload.playerDeck,
      result.payload.playerPrintingSelections,
    ).filter((entry) => entry.sectionId === "main");
    expect(mainRows).toEqual([
      { cardPublicId: canonicalId, quantity: 2, sectionId: "main", printingId: canonicalId },
      {
        cardPublicId: canonicalId,
        quantity: 2,
        sectionId: "main",
        printingId: `${canonicalId}_p1`,
      },
    ]);
    expect(gundamDocumentCardsToHistoric(result.payload.playerDocumentCards ?? [])).toEqual([
      ...mainRows,
      { cardPublicId: "R-001", quantity: 5, sectionId: "resource", printingId: "R-001_p4" },
      { cardPublicId: "R-001", quantity: 5, sectionId: "resource", printingId: "R-001_p5" },
    ]);
  });
});

function encodeDocument(document: DeckDocumentV1): string {
  const encoded = encodeDeckDocumentToUrlParam(document);
  if (!encoded.ok)
    throw new Error(encoded.diagnostics.map((diagnostic) => diagnostic.message).join("\n"));
  return encoded.value;
}
