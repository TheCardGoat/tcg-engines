import type { DeckDocumentV1 } from "@tcg/game-page-contract/deck-document";
import { describe, expect, it } from "vitest";
import { defineGameDeckInterchangeAdapter } from "./deck-interchange.ts";

const formats = {
  standard: {
    id: "standard",
    label: "Standard",
    declarationFields: [
      {
        id: "chosenIdentity",
        label: "Chosen identity",
        kind: "card-reference",
        required: true,
        sourceSectionId: "main",
      },
    ],
    appearanceFields: [{ id: "sleeveId", label: "Sleeve", kind: "string", required: false }],
    sections: [
      { id: "main", label: "Main", roles: ["validation", "runtime"], required: true },
      { id: "side", label: "Side", roles: ["validation"], required: false },
    ],
  },
} as const;

describe("V2 deck interchange", () => {
  it("writes registered copies with copy-specific printing allocations", () => {
    const adapter = defineGameDeckInterchangeAdapter({
      game: "cyberpunk",
      defaultFormatId: "standard",
      formats,
    });

    const document = adapter.createDocument({
      sections: {
        main: [
          { canonicalId: "card-a", printingId: "card-a-p1", quantity: 2 },
          { canonicalId: "card-a", printingId: "card-a-p2", quantity: 1 },
        ],
        side: [{ canonicalId: "card-b", quantity: 1 }],
      },
      declarations: { chosenIdentity: "card-a" },
      appearance: { sleeveId: "sleeve-1" },
    });

    expect(document).toMatchObject({
      schemaVersion: 2,
      sections: {
        main: [
          {
            card: { canonicalId: "card-a", quantity: 3 },
            appearance: {
              printingAllocations: [
                { printingId: "card-a-p1", quantity: 2 },
                { printingId: "card-a-p2", quantity: 1 },
              ],
            },
          },
        ],
      },
      declarations: { chosenIdentity: "card-a" },
      appearance: { sleeveId: "sleeve-1" },
    });
    expect(adapter.projectDocument(document, { role: "runtime" })).toMatchObject({
      deck: expect.any(Array),
      declarations: { chosenIdentity: "card-a" },
      appearance: { sleeveId: "sleeve-1" },
    });
    expect(adapter.projectDocument(document, { role: "runtime" }).deck).toHaveLength(2);
    expect(adapter.projectDocument(document, { role: "validation" }).deck).toHaveLength(3);
    expect(adapter.projectDocument(document, { role: "validation" }).deck).toContainEqual(
      expect.objectContaining({ canonicalId: "card-b", sectionId: "side", quantity: 1 }),
    );
  });

  it("rejects V1 for blank-slate games", () => {
    const adapter = defineGameDeckInterchangeAdapter({
      game: "cyberpunk",
      defaultFormatId: "standard",
      formats,
    });
    const legacy: DeckDocumentV1 = {
      schemaVersion: 1,
      game: "cyberpunk",
      formatId: "standard",
      sections: [{ id: "main", entries: [{ canonicalId: "card-a", quantity: 1 }] }],
    };

    expect(adapter.projectDocument(legacy).diagnostics).toContainEqual(
      expect.objectContaining({
        kind: "malformed",
        message: expect.stringContaining("requires a new V2 deck"),
      }),
    );
  });

  it("rejects input sections which the selected format does not define", () => {
    const adapter = defineGameDeckInterchangeAdapter({
      game: "cyberpunk",
      defaultFormatId: "standard",
      formats,
    });

    expect(() =>
      adapter.createDocument({
        sections: {
          main: [],
          legacyPresentation: [],
        } as never,
      }),
    ).toThrow('Unknown cyberpunk standard deck section "legacyPresentation"');
  });

  it("rejects inherited object keys as unsupported format ids", () => {
    const adapter = defineGameDeckInterchangeAdapter({
      game: "cyberpunk",
      defaultFormatId: "standard",
      formats,
    });

    expect(
      adapter.projectDocument({
        schemaVersion: 2,
        game: "cyberpunk",
        formatId: "constructor",
        sections: {},
      }),
    ).toMatchObject({
      deck: [],
      diagnostics: [
        {
          kind: "malformed",
          path: "formatId",
          message: expect.stringContaining("Unsupported"),
        },
      ],
    });
  });

  it("cannot create a document with an invalid registered quantity", () => {
    const adapter = defineGameDeckInterchangeAdapter({
      game: "cyberpunk",
      defaultFormatId: "standard",
      formats,
    });

    expect(() =>
      adapter.createDocument({
        sections: { main: [{ canonicalId: "card-a", quantity: 0 }] },
      }),
    ).toThrow("positive integer");
  });

  it("allows incomplete drafts but rejects incomplete registrations", () => {
    const adapter = defineGameDeckInterchangeAdapter({
      game: "cyberpunk",
      defaultFormatId: "standard",
      formats: {
        standard: {
          ...formats.standard,
          sections: [
            {
              id: "main",
              label: "Main",
              roles: ["validation", "runtime"],
              required: true,
              exactCards: 2,
            },
            formats.standard.sections[1],
          ],
        },
      },
    });
    const draft = adapter.createDocument({
      sections: { main: [{ canonicalId: "card-a", quantity: 1 }], side: [] },
    });

    expect(adapter.validateDocument(draft)).toEqual([]);
    expect(adapter.validateDocument(draft, { validationMode: "registration" })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "sections.main", message: expect.stringContaining("2") }),
        expect.objectContaining({
          path: "declarations.chosenIdentity",
          message: expect.stringContaining("required"),
        }),
      ]),
    );
  });

  it("rejects undeclared extension fields and card references outside their source section", () => {
    const adapter = defineGameDeckInterchangeAdapter({
      game: "cyberpunk",
      defaultFormatId: "standard",
      formats,
    });

    expect(() =>
      adapter.createDocument({
        sections: { main: [{ canonicalId: "card-a", quantity: 1 }], side: [] },
        declarations: { chosenIdentity: "card-b" },
      }),
    ).toThrow("must reference a card registered in main");
    expect(() =>
      adapter.createDocument({
        sections: { main: [], side: [] },
        appearance: { legacyPresentation: "card-back" },
      }),
    ).toThrow('Unsupported appearance field "legacyPresentation"');
  });

  it("migrates V1 only when the active game opts in", () => {
    const adapter = defineGameDeckInterchangeAdapter({
      game: "lorcana",
      defaultFormatId: "standard",
      formats,
      migrateV1: true,
    });
    const legacy: DeckDocumentV1 = {
      schemaVersion: 1,
      game: "lorcana",
      formatId: "standard",
      sections: [{ id: "main", entries: [{ canonicalId: "card-a", quantity: 4 }] }],
    };

    expect(adapter.projectDocument(legacy, { role: "validation" })).toEqual({
      deck: [
        {
          cardId: "card-a",
          canonicalId: "card-a",
          sectionId: "main",
          quantity: 4,
        },
      ],
      diagnostics: [],
    });
  });

  it("returns diagnostics when a V1 migration produces an unsupported V2 shape", () => {
    const adapter = defineGameDeckInterchangeAdapter({
      game: "lorcana",
      defaultFormatId: "standard",
      formats,
      migrateV1: true,
    });
    const legacy: DeckDocumentV1 = {
      schemaVersion: 1,
      game: "lorcana",
      formatId: "retired-format",
      sections: [{ id: "legacy", entries: [] }],
    };

    expect(adapter.migrateDocument(legacy)).toEqual({
      ok: false,
      diagnostics: [
        expect.objectContaining({
          kind: "malformed",
          path: "formatId",
          message: expect.stringContaining("Unsupported"),
        }),
      ],
    });
  });

  it("does not migrate a V1 document from another game", () => {
    const adapter = defineGameDeckInterchangeAdapter({
      game: "lorcana",
      defaultFormatId: "standard",
      formats,
      migrateV1: true,
    });
    const legacy: DeckDocumentV1 = {
      schemaVersion: 1,
      game: "gundam",
      formatId: "standard",
      sections: [{ id: "main", entries: [] }],
    };

    expect(adapter.projectDocument(legacy).diagnostics).toContainEqual(
      expect.objectContaining({ kind: "malformed", path: "game" }),
    );
  });
});
