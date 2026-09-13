import { describe, expect, it } from "vitest";

import type { DeckDocumentV2 } from "./deck-document.js";
import {
  decodeDeckDocumentFromJson,
  encodeDeckDocumentToCanonicalJson,
} from "./deck-document-json.js";

const UNICODE_DOCUMENT: DeckDocumentV2 = {
  schemaVersion: 2,
  game: "gundam",
  formatId: "standard",
  name: "宇宙のデッキ — Café",
  sections: {
    resource: [{ card: { canonicalId: "R-001", quantity: 10 } }],
    main: [
      {
        card: { canonicalId: "GD01-001", quantity: 4 },
        appearance: {
          printingAllocations: [{ printingId: "GD01-001_p1", quantity: 4 }],
        },
      },
    ],
  },
};

describe("DeckDocumentV2 canonical JSON", () => {
  it("round-trips Unicode names, keyed sections, and printing allocations", () => {
    const encoded = encodeDeckDocumentToCanonicalJson(UNICODE_DOCUMENT);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const decoded = decodeDeckDocumentFromJson(encoded.value);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok || decoded.document.schemaVersion !== 2) return;
    expect(decoded.document).toEqual({
      ...UNICODE_DOCUMENT,
      sections: {
        main: UNICODE_DOCUMENT.sections.main,
        resource: UNICODE_DOCUMENT.sections.resource,
      },
    });
  });

  it("emits deterministic section keys without assuming a side deck", () => {
    const encoded = encodeDeckDocumentToCanonicalJson(UNICODE_DOCUMENT);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    expect(encoded.value.indexOf('"main"')).toBeLessThan(encoded.value.indexOf('"resource"'));
    expect(encoded.value).not.toContain('"side"');
    expect(encoded.value).not.toContain('"roles"');
  });

  it("returns a structured malformed diagnostic for invalid JSON text", () => {
    expect(decodeDeckDocumentFromJson('{"schemaVersion":2')).toEqual({
      ok: false,
      diagnostics: [{ kind: "malformed", message: "Deck document is not valid JSON." }],
    });
  });

  it("retains V1 lifecycle roles during the active-game migration window", () => {
    const legacy = {
      schemaVersion: 1 as const,
      game: "gundam" as const,
      formatId: "standard",
      sections: [
        {
          id: "setup",
          roles: ["presentation" as const],
          entries: [{ canonicalId: "EXB-001", printingId: "EXB-001_p1", quantity: 1 }],
        },
      ],
    };

    const encoded = encodeDeckDocumentToCanonicalJson(legacy);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    expect(decodeDeckDocumentFromJson(encoded.value)).toEqual({
      ok: true,
      document: legacy,
      diagnostics: [],
    });
  });
});
