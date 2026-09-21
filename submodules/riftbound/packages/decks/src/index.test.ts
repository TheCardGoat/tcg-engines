import { describe, expect, it } from "vitest";

import type {
  RiftboundCardDefinition,
  RiftboundCatalog,
  RiftboundDeckBoards,
  RiftboundDeckDocument,
} from "@tcg/riftbound-types";
import {
  flattenRiftboundDeckBoards,
  inspectRiftboundDeckStructure,
  inspectRiftboundDeckRegistration,
  listRiftboundChosenChampions,
  parseRiftboundDeckJson,
  parseRiftboundDeckText,
  partitionRiftboundDeckEntries,
  retainRiftboundChosenChampionId,
  RiftboundDeckParseError,
  riftboundDeckListIdentityEntries,
  serializeRiftboundDeckJson,
  serializeRiftboundDeckText,
} from "./index.ts";

function card(
  canonicalId: string,
  name: string,
  cardType: string,
  collectorNumber: string,
  tags: string[] = [],
): RiftboundCardDefinition {
  return {
    canonicalId,
    slug: canonicalId,
    name,
    printings: [
      {
        id: `${canonicalId}-standard`,
        artId: `${canonicalId}-art`,
        upstreamPrintingId: `${canonicalId}-standard`,
        setCode: "TST",
        collectorNumber,
        rarity: "common",
        imageUrl: `https://cmsassets.rgpub.io/${canonicalId}.png`,
        artist: "Riot Artist",
      },
    ],
    cardType,
    domains: ["order"],
    tags,
    keywords: [],
    flags: [],
    orientation: "portrait",
  };
}

const cards = {
  legend: card("legend-1", "Test Legend", "legend", "001", ["Test Champion"]),
  champion: card("champion-1", "Test Champion", "champion unit", "006", ["Test Champion"]),
  unit: card("unit-1", "Test Unit", "unit", "002"),
  secondUnit: card("unit-2", "Second Unit", "unit", "003"),
  battlefield: card("battlefield-1", "Test Battlefield", "battlefield", "004"),
  rune: card("rune-1", "Test Rune", "basic rune", "005"),
};

const catalog: RiftboundCatalog = {
  schemaVersion: 1,
  game: "riftbound",
  provenance: {
    source: "riot-card-gallery",
    sourceUrl: "https://playriftbound.com/en-us/card-gallery/",
    locale: "en-US",
    fetchedAt: "2026-07-21T12:00:00.000Z",
    sha256: "a".repeat(64),
    productionEligible: false,
  },
  sets: [{ id: "TST", name: "Test Set" }],
  cards: Object.values(cards),
};

function entry(cardDefinition: RiftboundCardDefinition, quantity: number) {
  return {
    canonicalId: cardDefinition.canonicalId,
    printingId: cardDefinition.printings[0]!.id,
    quantity,
  };
}

const completeBoards: RiftboundDeckBoards = {
  legend: entry(cards.legend, 1),
  mainDeck: [entry(cards.champion, 1), entry(cards.unit, 3), entry(cards.secondUnit, 36)],
  battlefields: [entry(cards.battlefield, 3)],
  runes: [entry(cards.rune, 12)],
  sideboard: [],
  bench: [],
};

const document: RiftboundDeckDocument = {
  schemaVersion: 2,
  game: "riftbound",
  name: "Reference Deck",
  boards: completeBoards,
  declarations: { chosenChampionId: cards.champion.canonicalId },
};

describe("Riftbound deck boards", () => {
  it("partitions persisted boards by catalog metadata and preserves printing identity", () => {
    const persisted = flattenRiftboundDeckBoards(completeBoards);
    const hydrated = partitionRiftboundDeckEntries(persisted, catalog);

    expect(hydrated).toEqual(completeBoards);
    expect(hydrated.legend?.printingId).toBe("legend-1-standard");
  });

  it("reports structure without treating rune quantities as an ordinary copy-limit violation", () => {
    const issues = inspectRiftboundDeckStructure(completeBoards, catalog);

    expect(issues).not.toContainEqual(
      expect.objectContaining({ board: "runes", code: "COPY_LIMIT" }),
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ canonicalId: "unit-2", code: "COPY_LIMIT" }),
    );
  });

  it("requires an eligible registered Chosen Champion and exposes valid candidates", () => {
    expect(listRiftboundChosenChampions(completeBoards, catalog)).toEqual([cards.champion]);
    expect(
      inspectRiftboundDeckRegistration(completeBoards, cards.champion.canonicalId, catalog),
    ).not.toContainEqual(expect.objectContaining({ code: expect.stringContaining("CHOSEN_") }));
    expect(inspectRiftboundDeckRegistration(completeBoards, null, catalog)).toContainEqual(
      expect.objectContaining({ code: "CHOSEN_CHAMPION_REQUIRED" }),
    );
    expect(
      inspectRiftboundDeckRegistration(completeBoards, cards.unit.canonicalId, catalog),
    ).toContainEqual(expect.objectContaining({ code: "CHOSEN_CHAMPION_TYPE" }));
  });

  it("clears a Chosen Champion after that Champion leaves the Main Deck", () => {
    expect(
      retainRiftboundChosenChampionId(cards.champion.canonicalId, completeBoards, catalog),
    ).toBe(cards.champion.canonicalId);
    expect(
      retainRiftboundChosenChampionId(
        cards.champion.canonicalId,
        { ...completeBoards, mainDeck: completeBoards.mainDeck.slice(1) },
        catalog,
      ),
    ).toBeNull();
  });

  it("accepts only an empty or eight-card constructed sideboard", () => {
    expect(
      inspectRiftboundDeckStructure(
        { ...completeBoards, sideboard: [entry(cards.unit, 1)] },
        catalog,
      ),
    ).toContainEqual(expect.objectContaining({ code: "SIDEBOARD_COUNT" }));
    expect(
      inspectRiftboundDeckStructure(
        { ...completeBoards, sideboard: [entry(cards.unit, 8)] },
        catalog,
      ),
    ).not.toContainEqual(expect.objectContaining({ code: "SIDEBOARD_COUNT" }));
  });

  it("hashes playable canonical quantities while ignoring printing choice and bench", () => {
    const alternate: RiftboundDeckBoards = {
      ...completeBoards,
      mainDeck: completeBoards.mainDeck.map((item) =>
        item.canonicalId === cards.unit.canonicalId
          ? { ...item, printingId: "unit-1-alternate" }
          : item,
      ),
      bench: [entry(cards.unit, 99)],
    };

    expect(riftboundDeckListIdentityEntries(alternate)).toEqual(
      riftboundDeckListIdentityEntries(completeBoards),
    );
    expect(
      riftboundDeckListIdentityEntries({
        ...completeBoards,
        mainDeck: [{ ...completeBoards.mainDeck[0]!, quantity: 2 }, completeBoards.mainDeck[1]!],
      }),
    ).not.toEqual(riftboundDeckListIdentityEntries(completeBoards));
  });
});

describe("Riftbound deck interchange", () => {
  it("round-trips deterministic JSON against the current supplied card data", () => {
    const serialized = serializeRiftboundDeckJson(document);
    expect(serializeRiftboundDeckJson(parseRiftboundDeckJson(serialized, catalog).document)).toBe(
      serialized,
    );

    const legacySerialized = JSON.stringify({
      ...document,
      catalog: { sha256: "old-catalog" },
    });
    expect(parseRiftboundDeckJson(legacySerialized, catalog).document).toEqual(document);
  });

  it("rejects malformed JSON declarations instead of silently dropping them", () => {
    const malformed = JSON.stringify({
      ...document,
      declarations: { chosenChampionId: 123 },
    });

    expect(() => parseRiftboundDeckJson(malformed, catalog)).toThrow(
      "declarations.chosenChampionId must be a non-empty string",
    );
  });

  it("round-trips deterministic text using canonical and printing IDs", () => {
    const serialized = serializeRiftboundDeckText(document);
    const parsed = parseRiftboundDeckText(serialized, catalog);

    expect(parsed.warnings).toEqual([]);
    expect(parsed.document.declarations?.chosenChampionId).toBe(cards.champion.canonicalId);
    expect(serializeRiftboundDeckText(parsed.document)).toBe(serialized);
  });

  it("skips unknown cards with a warning instead of failing the whole list", () => {
    const parsed = parseRiftboundDeckText("[Main Deck]\n1 Test Unit\n1 Missing Card\n", catalog);
    expect(parsed.document.boards.mainDeck[0]).toEqual(entry(cards.unit, 1));
    expect(parsed.warnings.some((warning) => /Missing Card/.test(warning))).toBe(true);
  });

  it("rejects a list when no card can be resolved", () => {
    expect(() => parseRiftboundDeckText("[Main Deck]\n1 Missing Card\n", catalog)).toThrow(
      /Missing Card/,
    );
  });

  it("allows a unique name fallback with a warning and rejects ambiguous names", () => {
    const unique = parseRiftboundDeckText("[Main Deck]\n1 Test Unit\n", catalog);
    expect(unique.document.boards.mainDeck[0]).toEqual(entry(cards.unit, 1));
    expect(unique.warnings).toHaveLength(1);

    const ambiguousCatalog: RiftboundCatalog = {
      ...catalog,
      cards: [...catalog.cards, card("unit-3", "Test Unit", "unit", "006")],
    };
    expect(() => parseRiftboundDeckText("[Main Deck]\n1 Test Unit\n", ambiguousCatalog)).toThrow(
      RiftboundDeckParseError,
    );
  });

  it("does not add executable rule fields to interchange output", () => {
    const output = `${serializeRiftboundDeckJson(document)}${serializeRiftboundDeckText(document)}`;
    for (const forbidden of ["Ability", "Effect", "Trigger", "Target", "legalAction", "prompt"]) {
      expect(output).not.toContain(forbidden);
    }
  });
});
