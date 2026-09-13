import { describe, expect, it } from "vitest";
import { allGrandArchiveCards } from "@tcg/grand-archive-cards";
import {
  grandArchivePlatformSetupSummary,
  grandArchiveDeckIdentity,
  grandArchiveDeckCardPresentation,
  grandArchiveDeckInterchangeAdapter,
  prepareGrandArchivePlatformDeck,
} from "./platform-decks.ts";

const champion = allGrandArchiveCards.find(
  (card) => card.types.includes("CHAMPION") && card.level === 0,
)!;
const mainCard = allGrandArchiveCards.find(
  (card) => card.types.includes("ACTION") && card.printings.length > 1,
)!;

const input = () => ({
  mainDeck: [{ cardId: mainCard.printings[1]!.id, quantity: 2 }],
  materialDeck: [{ cardId: champion.canonicalId, quantity: 1 }],
  sideboard: [{ cardId: mainCard.canonicalId, quantity: 1 }],
  startingChampionId: champion.printings[0]!.id,
});

describe("Grand Archive platform decks", () => {
  it("preserves sections, a selected printing, and canonical starting Champion through the runtime projection", () => {
    const result = prepareGrandArchivePlatformDeck(input());
    expect(result.document.declarations?.startingChampionId).toBe(champion.canonicalId);
    expect(result.identityEntries).toContainEqual({
      cardId: mainCard.canonicalId,
      canonicalId: mainCard.canonicalId,
      quantity: 2,
      sectionId: "main",
    });
    expect(result.identityEntries).toContainEqual({
      cardId: mainCard.canonicalId,
      canonicalId: mainCard.canonicalId,
      quantity: 1,
      sectionId: "sideboard",
    });
    const projected = grandArchiveDeckInterchangeAdapter.projectDocument(result.document, {
      role: "runtime",
    });
    expect(projected.diagnostics).toEqual([]);
    expect(projected.deck).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          canonicalId: mainCard.canonicalId,
          printingId: mainCard.printings[1]!.id,
          quantity: 2,
          sectionId: "main",
        }),
        expect.objectContaining({
          canonicalId: champion.canonicalId,
          quantity: 1,
          sectionId: "material",
        }),
        expect.objectContaining({
          canonicalId: mainCard.canonicalId,
          quantity: 1,
          sectionId: "sideboard",
        }),
      ]),
    );
  });

  it("saves incomplete drafts but does not consider them registered decks", () => {
    const { document } = prepareGrandArchivePlatformDeck({
      mainDeck: [],
      materialDeck: [],
      sideboard: [],
    });
    expect(
      grandArchiveDeckInterchangeAdapter.validateDocument(document, {
        validationMode: "registration",
      }).length,
    ).toBeGreaterThan(0);
  });

  it("rejects unknown cards, invalid quantities, and a starting Champion absent from material", () => {
    expect(() =>
      prepareGrandArchivePlatformDeck({
        ...input(),
        mainDeck: [{ cardId: "missing", quantity: 1 }],
      }),
    ).toThrow("Unknown Grand Archive card");
    expect(() =>
      prepareGrandArchivePlatformDeck({
        ...input(),
        mainDeck: [{ cardId: mainCard.canonicalId, quantity: 0.5 }],
      }),
    ).toThrow("quantity");
    expect(() => prepareGrandArchivePlatformDeck({ ...input(), materialDeck: [] })).toThrow(
      "Starting Champion",
    );
  });

  it("resolves actual printings without treating a canonical card id as a printing", () => {
    const printing = mainCard.printings[1]!;
    expect(grandArchiveDeckIdentity.normalizeInputCardId(printing.id)).toEqual({
      canonicalId: mainCard.canonicalId,
      printingId: printing.id,
    });
    expect(grandArchiveDeckIdentity.resolvePrintingId(mainCard.canonicalId)).toBeNull();
    expect(grandArchiveDeckCardPresentation(mainCard.canonicalId, printing.id)?.imageUrl).toBe(
      printing.imageUrl,
    );
    expect(grandArchiveDeckCardPresentation(champion.canonicalId, printing.id)).toBeNull();
  });
});

it("projects section counts and the registered Champion printing for shared matchmaking", () => {
  const selectedPrinting = champion.printings.at(-1)!;
  const prepared = prepareGrandArchivePlatformDeck({
    ...input(),
    materialDeck: [{ cardId: selectedPrinting.id, quantity: 1 }],
  });
  const summary = grandArchivePlatformSetupSummary(prepared.document);
  expect(summary?.sectionCardCounts).toEqual({ main: 2, material: 1, sideboard: 1 });
  expect(summary?.setupCards).toEqual([
    {
      slotId: "startingChampionId",
      canonicalId: champion.canonicalId,
      name: champion.name,
      imageUrl: selectedPrinting.imageUrl ?? null,
    },
  ]);
  const undeclared = prepareGrandArchivePlatformDeck({ ...input(), startingChampionId: null });
  expect(grandArchivePlatformSetupSummary(undeclared.document)?.setupCards).toEqual([]);
  expect(grandArchivePlatformSetupSummary(null)).toBeUndefined();
});
