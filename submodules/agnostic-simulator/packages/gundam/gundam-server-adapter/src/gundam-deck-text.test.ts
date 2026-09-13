import * as gundamCards from "@tcg/gundam-cards";
import { getGundamPrintingInfosForCanonical, listGundamCanonicalIds } from "@tcg/gundam-cards";
import type { Card } from "@tcg/gundam-types";
import { describe, expect, it } from "vite-plus/test";

import {
  GUNDAM_MAIN_DECK_SECTION_ID,
  GUNDAM_RESOURCE_DECK_SECTION_ID,
  GUNDAM_SIDEBOARD_SECTION_ID,
  gundamDeckInterchangeAdapter,
} from "./gundam-deck-document.js";
import {
  decodeGundamDeckDocumentFromText,
  encodeGundamDeckDocumentToText,
} from "./gundam-deck-text.js";

describe("Gundam human-readable deck text", () => {
  it("round-trips Unicode names, printing ids, and main/Resource sections", () => {
    const parallel = canonicalWithMultiplePrintings();
    const resource = resourceCard();
    const document = gundamDeckInterchangeAdapter.createDocument({
      formatId: "standard",
      name: "宇宙のデッキ — Café",
      sections: {
        main: [
          {
            canonicalId: parallel.canonicalId,
            printingId: parallel.printings[1]!.printingId,
            quantity: 4,
          },
        ],
        resource: [{ canonicalId: resource.canonicalId, quantity: 10 }],
      },
    });

    const encoded = encodeGundamDeckDocumentToText(document);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    const decoded = decodeGundamDeckDocumentFromText(encoded.value);

    expect(encoded.value).toContain("[Main Deck]");
    expect(encoded.value).toContain("[Resource Deck]");
    expect(encoded.value).not.toContain("[Side Deck]");
    expect(decoded).toEqual({ ok: true, document, diagnostics: [] });
  });

  it("rejects a non-Gundam document instead of emitting a misleading list", () => {
    const result = encodeGundamDeckDocumentToText({
      schemaVersion: 1,
      game: "lorcana",
      formatId: "standard",
      sections: [
        { id: GUNDAM_MAIN_DECK_SECTION_ID, entries: [] },
        { id: GUNDAM_RESOURCE_DECK_SECTION_ID, entries: [] },
      ],
    });

    expect(result).toEqual({
      ok: false,
      diagnostics: [
        {
          kind: "wrong-game",
          message: "Expected a Gundam deck document, received lorcana.",
          receivedGame: "lorcana",
        },
      ],
    });
  });

  it("rejects missing, duplicate, and unknown Gundam sections", () => {
    const result = encodeGundamDeckDocumentToText({
      schemaVersion: 1,
      game: "gundam",
      formatId: "standard",
      sections: [
        { id: GUNDAM_MAIN_DECK_SECTION_ID, entries: [] },
        { id: GUNDAM_MAIN_DECK_SECTION_ID, entries: [] },
        { id: GUNDAM_SIDEBOARD_SECTION_ID, entries: [] },
        { id: "bench", entries: [] },
      ],
    });

    expect(result).toEqual({
      ok: false,
      diagnostics: [
        {
          kind: "unexpected-section",
          message: "Standard Gundam decks cannot contain a sideboard.",
          sectionId: GUNDAM_SIDEBOARD_SECTION_ID,
          sectionIndex: 2,
        },
        {
          kind: "unknown-section",
          message: 'Unsupported Gundam deck section "bench".',
          sectionId: "bench",
          sectionIndex: 3,
        },
        {
          kind: "duplicate-section",
          message: 'Gundam deck section "main" appears 2 times.',
          sectionId: GUNDAM_MAIN_DECK_SECTION_ID,
        },
        {
          kind: "missing-section",
          message: 'Missing Gundam deck section "resource".',
          sectionId: GUNDAM_RESOURCE_DECK_SECTION_ID,
        },
      ],
    });
  });

  it("round-trips the BO3 sideboard without making it part of standard", () => {
    const main = canonicalWithMultiplePrintings();
    const side = canonicalWithMultiplePrintings();
    const resource = resourceCard();
    const document = gundamDeckInterchangeAdapter.createDocument({
      formatId: "bo3",
      name: "BO3",
      sections: {
        main: [{ canonicalId: main.canonicalId, quantity: 4 }],
        resource: [{ canonicalId: resource.canonicalId, quantity: 10 }],
        side: [
          {
            canonicalId: side.canonicalId,
            printingId: side.printings[0]!.printingId,
            quantity: 10,
          },
        ],
      },
    });

    const encoded = encodeGundamDeckDocumentToText(document);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    expect(encoded.value).toContain("[Sideboard]");
    expect(decodeGundamDeckDocumentFromText(encoded.value)).toEqual({
      ok: true,
      document,
      diagnostics: [],
    });
  });

  it("rejects a BO3 list without a sideboard", () => {
    const card = playableCard();
    const resource = resourceCard();
    const result = decodeGundamDeckDocumentFromText(
      [
        "GUNDAM DECK",
        "Format: bo3",
        "[Main Deck]",
        `4 ${card.canonicalId}`,
        "[Resource Deck]",
        `10 ${resource.canonicalId}`,
      ].join("\n"),
    );

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        kind: "missing-section",
        sectionId: GUNDAM_SIDEBOARD_SECTION_ID,
      }),
    );
  });

  it("returns a line-level malformed diagnostic and preserves valid entries", () => {
    const card = playableCard();
    const resource = resourceCard();
    const result = decodeGundamDeckDocumentFromText(
      [
        "GUNDAM DECK",
        "[Main Deck]",
        "this is not an entry",
        `4 ${card.canonicalId}`,
        "[Resource Deck]",
        `10 ${resource.canonicalId}`,
      ].join("\n"),
    );

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ kind: "malformed-line", line: 3 }),
    );
    expect(result.document.sections.main).toEqual([
      { card: { canonicalId: card.canonicalId, quantity: 4 } },
    ]);
  });

  it("retains an unknown printing and reports its exact source line", () => {
    const card = playableCard();
    const resource = resourceCard();
    const result = decodeGundamDeckDocumentFromText(
      [
        "GUNDAM DECK",
        "[Main Deck]",
        `4 ${card.canonicalId} printing=UNKNOWN_p9 | ignored display name`,
        "[Resource Deck]",
        `10 ${resource.canonicalId}`,
      ].join("\n"),
    );

    expect(result.ok).toBe(true);
    expect(result.document.sections.main?.[0]).toEqual({
      card: { canonicalId: card.canonicalId, quantity: 4 },
      appearance: {
        printingAllocations: [{ printingId: "UNKNOWN_p9", quantity: 4 }],
      },
    });
    expect(result.diagnostics).toContainEqual({
      kind: "unresolved-printing",
      line: 3,
      canonicalId: card.canonicalId,
      printingId: "UNKNOWN_p9",
      message: "Unknown Gundam printing UNKNOWN_p9.",
    });
  });

  it("merges repeated rows for the same canonical card and printing", () => {
    const card = canonicalWithMultiplePrintings();
    const resource = resourceCard();
    const printingId = card.printings[0]!.printingId;
    const result = decodeGundamDeckDocumentFromText(
      [
        "GUNDAM DECK",
        "[Main Deck]",
        `1 ${card.canonicalId} printing=${printingId}`,
        `3 ${card.canonicalId} printing=${printingId}`,
        "[Resource Deck]",
        `10 ${resource.canonicalId}`,
      ].join("\n"),
    );

    expect(result.ok).toBe(true);
    expect(result.document.sections.main).toEqual([
      {
        card: { canonicalId: card.canonicalId, quantity: 4 },
        appearance: {
          printingAllocations: [{ printingId, quantity: 4 }],
        },
      },
    ]);
  });

  it("reports missing Resource Deck instead of interpreting it as a side deck", () => {
    const card = playableCard();
    const result = decodeGundamDeckDocumentFromText(
      ["GUNDAM DECK", "[Main Deck]", `4 ${card.canonicalId}`].join("\n"),
    );

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        kind: "missing-section",
        sectionId: GUNDAM_RESOURCE_DECK_SECTION_ID,
      }),
    );
  });
});

function playableCard(): Card {
  const card = allCards().find((candidate) => candidate.type !== "resource");
  if (!card) throw new Error("Expected a playable Gundam card.");
  return card;
}

function resourceCard(): Card {
  const card = allCards().find((candidate) => candidate.type === "resource");
  if (!card) throw new Error("Expected a Gundam Resource card.");
  return card;
}

function canonicalWithMultiplePrintings() {
  for (const canonicalId of listGundamCanonicalIds()) {
    const printings = getGundamPrintingInfosForCanonical(canonicalId);
    if (printings.length >= 2) return { canonicalId, printings };
  }
  throw new Error("Expected a Gundam card with multiple printings.");
}

function allCards(): Card[] {
  return Object.values(gundamCards).filter(isCard);
}

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "canonicalId" in value &&
    typeof (value as { canonicalId: unknown }).canonicalId === "string" &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string"
  );
}
