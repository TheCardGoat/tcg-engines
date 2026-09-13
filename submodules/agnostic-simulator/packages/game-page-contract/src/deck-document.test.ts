import { describe, expect, it } from "vitest";

import { encodeDeckToUrlParam } from "./deck-codec.js";
import {
  decodeDeckDocumentFromUrlParam,
  encodeDeckDocumentToUrlParam,
  flattenDeckDocument,
  parseDeckDocument,
  rewriteDeckDocumentPrintings,
  type DeckDocumentV1,
  type DeckDocumentV2,
} from "./deck-document.js";

const LEGACY_DOCUMENT: DeckDocumentV1 = {
  schemaVersion: 1,
  game: "gundam",
  formatId: "standard",
  name: "Legacy deck",
  sections: [
    {
      id: "main",
      entries: [{ canonicalId: "GD01-001", printingId: "GD01-001_p1", quantity: 4 }],
    },
    { id: "resource", entries: [{ canonicalId: "R-001", quantity: 10 }] },
  ],
};

const DOCUMENT: DeckDocumentV2 = {
  schemaVersion: 2,
  game: "gundam",
  formatId: "standard",
  name: "Blue deck",
  sections: {
    main: [
      {
        card: { canonicalId: "GD01-001", quantity: 4 },
        appearance: {
          printingAllocations: [
            { printingId: "GD01-001_p1", quantity: 3 },
            { printingId: "GD01-001_p2", quantity: 1 },
          ],
        },
      },
    ],
    resource: [{ card: { canonicalId: "R-001", quantity: 10 } }],
  },
  appearance: { setupPrintingIds: { exBase: "EXBP-001" } },
};

describe("DeckDocumentV2", () => {
  it("round-trips V2 documents with declarations and appearance", () => {
    const encoded = encodeDeckDocumentToUrlParam(DOCUMENT);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    expect(decodeDeckDocumentFromUrlParam(encoded.value)).toEqual({
      ok: true,
      document: DOCUMENT,
      diagnostics: [],
    });
  });

  it("retains V1 decoding for explicit active-game migration", () => {
    const encoded = encodeDeckDocumentToUrlParam(LEGACY_DOCUMENT);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    expect(decodeDeckDocumentFromUrlParam(encoded.value)).toEqual({
      ok: true,
      document: LEGACY_DOCUMENT,
      diagnostics: [],
    });
  });

  it("flattens mixed printing allocations without losing quantities", () => {
    expect(flattenDeckDocument(DOCUMENT)).toEqual([
      {
        canonicalId: "GD01-001",
        printingId: "GD01-001_p1",
        quantity: 3,
        sectionId: "main",
      },
      {
        canonicalId: "GD01-001",
        printingId: "GD01-001_p2",
        quantity: 1,
        sectionId: "main",
      },
      { canonicalId: "R-001", quantity: 10, sectionId: "resource" },
    ]);
  });

  it("rejects V2 role projection so format-owned policy cannot live in data", () => {
    expect(() => flattenDeckDocument(DOCUMENT, { role: "runtime" })).toThrow(
      "requires a game-owned format definition",
    );
  });

  it("requires printing allocations to exactly cover the card quantity", () => {
    const invalid = {
      ...DOCUMENT,
      sections: {
        main: [
          {
            card: { canonicalId: "GD01-001", quantity: 4 },
            appearance: {
              printingAllocations: [{ printingId: "GD01-001_p1", quantity: 3 }],
            },
          },
        ],
      },
    };
    const encoded = encodeDeckDocumentToUrlParam(invalid);
    expect(encoded).toEqual({
      ok: false,
      diagnostics: [
        expect.objectContaining({
          kind: "malformed",
          path: "sections.main[0].appearance.printingAllocations",
        }),
      ],
    });
  });

  it("rejects duplicate canonical identities within one V2 section", () => {
    const encoded = encodeDeckDocumentToUrlParam({
      ...DOCUMENT,
      sections: {
        main: [
          { card: { canonicalId: "GD01-001", quantity: 2 } },
          { card: { canonicalId: "GD01-001", quantity: 2 } },
        ],
      },
    });

    expect(encoded).toEqual({
      ok: false,
      diagnostics: [
        expect.objectContaining({
          kind: "malformed",
          path: "sections.main[1].card.canonicalId",
        }),
      ],
    });
  });

  it("preserves reserved section keys without mutating the sections prototype", () => {
    const input = JSON.parse(
      '{"schemaVersion":2,"game":"gundam","formatId":"standard","sections":{"__proto__":[{"card":{"canonicalId":"GD01-001","quantity":1}}]}}',
    );
    const parsed = parseDeckDocument(input);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok || parsed.document.schemaVersion !== 2) return;
    expect(Object.hasOwn(parsed.document.sections, "__proto__")).toBe(true);
    expect(flattenDeckDocument(parsed.document)).toEqual([
      { canonicalId: "GD01-001", quantity: 1, sectionId: "__proto__" },
    ]);
  });

  it("rejects V1 lifecycle fields and generic selections in V2", () => {
    expect(
      encodeDeckDocumentToUrlParam({
        ...DOCUMENT,
        selections: { chosenChampionId: "GD01-001" },
      }),
    ).toEqual({
      ok: false,
      diagnostics: [expect.objectContaining({ kind: "malformed", path: "selections" })],
    });
    expect(
      encodeDeckDocumentToUrlParam({
        ...DOCUMENT,
        sections: {
          main: [
            {
              card: { canonicalId: "GD01-001", quantity: 4 },
              roles: ["runtime"],
            },
          ],
        },
      }),
    ).toEqual({
      ok: false,
      diagnostics: [expect.objectContaining({ kind: "malformed", path: "sections.main[0].roles" })],
    });
  });

  it("keeps compatibility printing rewrites but makes V2 appearance explicit", () => {
    const rewritten = rewriteDeckDocumentPrintings(
      DOCUMENT,
      new Map([["GD01-001", "GD01-001_p3"]]),
    );
    expect(rewritten.name).toBeUndefined();
    expect(rewritten.schemaVersion).toBe(2);
    if (rewritten.schemaVersion !== 2) return;
    expect(rewritten.sections.main?.[0]?.appearance?.printingAllocations).toEqual([
      { printingId: "GD01-001_p3", quantity: 4 },
    ]);
  });

  it("reports both supported schema versions", () => {
    const encoded = encodeDeckToUrlParam(JSON.stringify({ ...DOCUMENT, schemaVersion: 3 }));
    const result = decodeDeckDocumentFromUrlParam(encoded);
    expect(result.ok).toBe(false);
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        kind: "unsupported-version",
        receivedVersion: 3,
        supportedVersions: [1, 2],
      }),
    ]);
  });

  it("reports unresolved mixed printing allocations independently", () => {
    const encoded = encodeDeckDocumentToUrlParam(DOCUMENT);
    if (!encoded.ok) throw new Error("test document did not encode");
    const result = decodeDeckDocumentFromUrlParam(encoded.value, {
      resolveEntry: (entry) => entry.printingId !== "GD01-001_p2",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.diagnostics).toEqual([
      {
        kind: "unresolved",
        message: "Could not resolve GD01-001 printing GD01-001_p2.",
        sectionId: "main",
        entryIndex: 1,
        canonicalId: "GD01-001",
        printingId: "GD01-001_p2",
      },
    ]);
  });
});
