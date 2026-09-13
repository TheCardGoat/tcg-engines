import * as gundamCards from "@tcg/gundam-cards";
import { getGundamPrintingInfosForCanonical, listGundamCanonicalIds } from "@tcg/gundam-cards";
import { isDeckListToken, type DeckList } from "@tcg/gundam-engine";
import type { DeckDocumentV1 } from "@tcg/game-page-contract/deck-document";
import type { Card } from "@tcg/gundam-types";
import { describe, expect, it } from "vite-plus/test";
import { gundamServerAdapter } from "./adapter.js";
import {
  GUNDAM_MAIN_DECK_SECTION_ID,
  GUNDAM_RESOURCE_DECK_SECTION_ID,
  applyGundamSetupPresentationToDocument,
  gundamDeckDocumentToCards,
  gundamDeckDocumentToDeckList,
  gundamDeckInterchangeAdapter,
  gundamDeckListToDocument,
  getGundamSetupPresentationSlots,
  gundamSetupPresentationFromDocument,
} from "./gundam-deck-document.js";

describe("Gundam DeckDocumentV2 mapping", () => {
  it("round-trips Standard and BO3 native deck lists through keyed sections", () => {
    const standard = legalDeckList();
    const standardDocument = gundamDeckListToDocument(standard);
    expect(standardDocument.schemaVersion).toBe(2);
    expect(Object.keys(standardDocument.sections)).toEqual(["main", "resource"]);
    expect(gundamDeckDocumentToDeckList(standardDocument)).toMatchObject({
      deck: standard,
      diagnostics: [],
    });

    const bo3: DeckList = {
      ...standard,
      name: "BO3 interchange",
      sideboard: [
        { cardNumber: standard.cards[0]!.cardNumber, count: 4 },
        { cardNumber: standard.cards[1]!.cardNumber, count: 4 },
        { cardNumber: standard.cards[2]!.cardNumber, count: 2 },
      ],
    };
    const bo3Document = gundamDeckListToDocument(bo3);
    expect(Object.keys(bo3Document.sections)).toEqual(["main", "resource", "side"]);
    expect(gundamDeckDocumentToDeckList(bo3Document)).toMatchObject({
      deck: bo3,
      diagnostics: [],
    });
  });

  it("preserves mixed printing allocations under one registered card entry", () => {
    const parallel = canonicalWithMultiplePrintings();
    const resource = resourceCard();
    const document = gundamDeckInterchangeAdapter.createDocument({
      formatId: "standard",
      sections: {
        main: [
          {
            canonicalId: parallel.canonicalId,
            printingId: parallel.printings[0]!.printingId,
            quantity: 3,
          },
          {
            canonicalId: parallel.canonicalId,
            printingId: parallel.printings[1]!.printingId,
            quantity: 2,
          },
        ],
        resource: [{ canonicalId: resource.canonicalId, quantity: 10 }],
      },
    });

    expect(document.sections.main).toEqual([
      {
        card: { canonicalId: parallel.canonicalId, quantity: 5 },
        appearance: {
          printingAllocations: [
            { printingId: parallel.printings[0]!.printingId, quantity: 3 },
            { printingId: parallel.printings[1]!.printingId, quantity: 2 },
          ],
        },
      },
    ]);
    const mapped = gundamDeckDocumentToCards(document);
    expect(mapped.diagnostics).toEqual([]);
    expect(mapped.deck.map((entry) => entry.printingId)).toEqual([
      parallel.printings[0]!.printingId,
      parallel.printings[1]!.printingId,
      undefined,
    ]);
    expect(
      gundamServerAdapter
        .validateDeckForFormat("standard", mapped.deck)
        .rules.find((rule) => rule.kind === "copy-limit"),
    ).toEqual(expect.objectContaining({ passed: false }));
  });

  it("stores EX Base and EX Resource cosmetics in root appearance, outside sections", () => {
    const base = gundamDeckListToDocument(legalDeckList());
    const [baseSlot, resourceSlot] = getGundamSetupPresentationSlots();
    const variantCanonicalId = baseSlot!.variantCanonicalIds[0]!;
    const variantPrinting = getGundamPrintingInfosForCanonical(variantCanonicalId)[0]!.printingId;
    const document = applyGundamSetupPresentationToDocument(base, {
      "ex-base": variantPrinting,
      "ex-resource": resourceSlot!.defaultPrintingId,
    });

    expect(document.sections).not.toHaveProperty("setup");
    expect(document.appearance).toEqual({
      setup: {
        "ex-base": variantPrinting,
        "ex-resource": resourceSlot!.defaultPrintingId,
      },
    });
    expect(gundamSetupPresentationFromDocument(document)).toEqual(document.appearance!.setup);
    expect(gundamDeckDocumentToDeckList(document)).toMatchObject({
      deck: legalDeckList(),
      diagnostics: [],
    });
  });

  it("losslessly reads an active V1 deck and moves setup presentation during migration", () => {
    const base = legalDeckList();
    const [baseSlot, resourceSlot] = getGundamSetupPresentationSlots();
    const legacy: DeckDocumentV1 = {
      schemaVersion: 1,
      game: "gundam",
      formatId: "standard",
      name: base.name,
      sections: [
        {
          id: "main",
          roles: ["validation", "runtime"],
          entries: base.cards.map((entry) => ({
            canonicalId: entry.cardNumber,
            quantity: entry.count,
          })),
        },
        {
          id: "resource",
          roles: ["validation", "runtime"],
          entries: [{ canonicalId: base.resource.cardNumber, quantity: base.resource.count }],
        },
        {
          id: "setup",
          roles: ["presentation"],
          entries: [
            {
              canonicalId: baseSlot!.canonicalId,
              printingId: baseSlot!.defaultPrintingId,
              quantity: 1,
            },
            {
              canonicalId: resourceSlot!.canonicalId,
              printingId: resourceSlot!.defaultPrintingId,
              quantity: 1,
            },
          ],
        },
      ],
    };

    expect(gundamDeckDocumentToDeckList(legacy)).toMatchObject({ deck: base, diagnostics: [] });
    expect(gundamSetupPresentationFromDocument(legacy)).toEqual({
      "ex-base": baseSlot!.defaultPrintingId,
      "ex-resource": resourceSlot!.defaultPrintingId,
    });
    const migrated = applyGundamSetupPresentationToDocument(legacy, {});
    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.sections).not.toHaveProperty("setup");
    expect(migrated.appearance?.setup).toEqual(gundamSetupPresentationFromDocument(legacy));
  });

  it("fails closed when a V1 format or sideboard topology cannot be migrated losslessly", () => {
    const deck = legalDeckList();
    const baseSections: DeckDocumentV1["sections"] = [
      {
        id: "main",
        entries: deck.cards.map((entry) => ({
          canonicalId: entry.cardNumber,
          quantity: entry.count,
        })),
      },
      {
        id: "resource",
        entries: [{ canonicalId: deck.resource.cardNumber, quantity: deck.resource.count }],
      },
    ];
    const legacy = (formatId: string, sections = baseSections): DeckDocumentV1 => ({
      schemaVersion: 1,
      game: "gundam",
      formatId,
      sections,
    });

    expect(gundamDeckDocumentToCards(legacy("BO3")).diagnostics).toContainEqual(
      expect.objectContaining({ message: 'Unsupported Gundam deck format "BO3".' }),
    );
    expect(gundamDeckInterchangeAdapter.migrateDocument(legacy("BO3"))).toEqual({
      ok: false,
      diagnostics: [expect.objectContaining({ message: 'Unsupported Gundam deck format "BO3".' })],
    });
    expect(
      gundamDeckDocumentToCards(
        legacy("standard", [
          ...baseSections,
          { id: "side", entries: [{ canonicalId: deck.cards[0]!.cardNumber, quantity: 1 }] },
        ]),
      ).diagnostics,
    ).toContainEqual(
      expect.objectContaining({ message: "Standard Gundam decks cannot contain a sideboard." }),
    );
    expect(gundamDeckDocumentToCards(legacy("bo3")).diagnostics).toContainEqual(
      expect.objectContaining({ message: 'Gundam bo3 deck is missing section "side".' }),
    );
    expect(
      gundamDeckInterchangeAdapter.migrateDocument(
        legacy("standard", [
          ...baseSections,
          {
            id: "maybeboard",
            entries: [{ canonicalId: deck.cards[0]!.cardNumber, quantity: 1 }],
          },
        ]),
      ),
    ).toEqual({
      ok: false,
      diagnostics: [
        expect.objectContaining({ message: 'Unsupported Gundam V1 section "maybeboard".' }),
      ],
    });
  });

  it("reports resource cards placed in main and main cards placed in resource", () => {
    const deck = legalDeckList();
    const document = gundamDeckInterchangeAdapter.createDocument({
      formatId: "standard",
      sections: {
        main: [{ canonicalId: deck.resource.cardNumber, quantity: 1 }],
        resource: [{ canonicalId: deck.cards[0]!.cardNumber, quantity: 10 }],
      },
    });

    expect(gundamDeckDocumentToCards(document).diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "malformed",
          message: expect.stringContaining("Resource cards must be in the Gundam Resource Deck"),
        }),
        expect.objectContaining({
          kind: "malformed",
          message: expect.stringContaining(
            "Only Resource cards can be in the Gundam Resource Deck",
          ),
        }),
      ]),
    );
  });

  it("retains unknown identities as structured unresolved diagnostics", () => {
    const deck = legalDeckList();
    const document = gundamDeckInterchangeAdapter.createDocument({
      formatId: "standard",
      sections: {
        main: [{ canonicalId: "GD99-999", quantity: 1 }],
        resource: [{ canonicalId: deck.resource.cardNumber, quantity: 10 }],
      },
    });

    const mapped = gundamDeckDocumentToCards(document);
    expect(mapped.deck).toContainEqual(
      expect.objectContaining({ canonicalId: "GD99-999", sectionId: "main" }),
    );
    expect(mapped.diagnostics).toContainEqual(
      expect.objectContaining({ kind: "unresolved", canonicalId: "GD99-999" }),
    );
  });
});

function legalDeckList(): DeckList {
  const cards = sameColorCards(13);
  return {
    name: "Interchange test",
    cards: cards.map((card, index) => ({
      cardNumber: card.canonicalId,
      count: index === cards.length - 1 ? 2 : 4,
    })),
    resource: { cardNumber: resourceCard().canonicalId, count: 10 },
  };
}

function sameColorCards(minimum: number): Card[] {
  const byColor = new Map<string, Card[]>();
  for (const card of allCards()) {
    if (!card.color || card.type === "resource" || isDeckListToken(card.cardNumber)) continue;
    const cards = byColor.get(card.color) ?? [];
    if (!cards.some((candidate) => candidate.canonicalId === card.canonicalId)) cards.push(card);
    byColor.set(card.color, cards);
  }
  const cards = [...byColor.values()].find((entries) => entries.length >= minimum);
  if (!cards) throw new Error(`Expected at least ${minimum} Gundam cards in one color.`);
  return cards.slice(0, minimum);
}

function resourceCard(): Card {
  const card = allCards().find(
    (candidate) => candidate.type === "resource" && !isDeckListToken(candidate.cardNumber),
  );
  if (!card) throw new Error("Expected a Gundam Resource card.");
  return card;
}

function canonicalWithMultiplePrintings() {
  for (const canonicalId of listGundamCanonicalIds()) {
    const printings = getGundamPrintingInfosForCanonical(canonicalId);
    if (printings.length >= 2) return { canonicalId, printings };
  }
  throw new Error("Expected a Gundam canonical card with multiple printings.");
}

function allCards(): Card[] {
  return Object.values(gundamCards).filter(isCard);
}

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "cardNumber" in value &&
    typeof (value as { cardNumber: unknown }).cardNumber === "string" &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string"
  );
}
