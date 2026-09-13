import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  hydrateFleshAndBloodCatalog,
  hydrateFleshAndBloodCatalogParts,
  type FleshAndBloodRawSnapshot,
} from "@tcg/flesh-and-blood-types/catalog";
import { hydrateFleshAndBloodCatalogSourceParts } from "../../../packages/types/src/catalog-defaults.ts";

import {
  assertNoCatalogRemovals,
  auditFleshAndBloodCatalog,
  catalogFromSnapshot,
  compactFleshAndBloodCatalog,
  diffFleshAndBloodCatalogs,
  extractFleshAndBloodTranslations,
  fabCubeImageSourcesFromSnapshot,
  fleshAndBloodAssetPrintingsFromManifest,
  FleshAndBloodCatalogError,
  normalizeFabCubeCatalog,
  splitFleshAndBloodCatalog,
  verifyFleshAndBloodTranslationCatalog,
} from "../src/index.ts";

const rawSet = {
  unique_id: "set-001",
  id: "WTR",
  name: "Welcome to Rathe",
  printings: [
    { initial_release_date: "2019-10-11T00:00:00.000Z" },
    { initial_release_date: "2019-10-18T00:00:00.000Z" },
  ],
};

const rawCard = {
  unique_id: "card-001",
  name: "Romping Club",
  color: "",
  pitch: "",
  cost: "",
  power: "4",
  defense: "",
  health: "",
  intelligence: "",
  arcane: "",
  types: ["Brute", "Weapon", "Club", "2H"],
  traits: [],
  card_keywords: [],
  abilities_and_effects: ["Once per Turn Action"],
  ability_and_effect_keywords: ["Attack"],
  granted_keywords: [],
  removed_keywords: [],
  interacts_with_keywords: [],
  functional_text: "**Once per Turn Action** - {r}{r}: **Attack**",
  functional_text_plain: "Once per Turn Action - {r}{r}: Attack",
  type_text: "Brute Weapon - Club (2H)",
  played_horizontally: false,
  blitz_legal: true,
  cc_legal: true,
  commoner_legal: true,
  ll_legal: true,
  silver_age_legal: true,
  blitz_living_legend: false,
  cc_living_legend: false,
  blitz_banned: false,
  cc_banned: false,
  commoner_banned: false,
  ll_banned: false,
  silver_age_banned: false,
  upf_banned: false,
  blitz_suspended: false,
  cc_suspended: false,
  commoner_suspended: false,
  ll_restricted: false,
  printings: [
    {
      unique_id: "printing-001",
      set_printing_unique_id: "art-001",
      id: "WTR003",
      set_id: "WTR",
      edition: "A",
      foiling: "S",
      rarity: "C",
      expansion_slot: false,
      artists: ["Artist"],
      art_variations: [],
      flavor_text: "",
      flavor_text_plain: "",
      image_url: "https://example.com/wtr003.png",
      image_rotation_degrees: 0,
      tcgplayer_product_id: "225104",
      tcgplayer_url: "https://www.tcgplayer.com/product/225104",
    },
    {
      unique_id: "printing-002",
      set_printing_unique_id: "art-001",
      id: "WTR003",
      set_id: "WTR",
      edition: "U",
      foiling: "R",
      rarity: "C",
      expansion_slot: false,
      artists: ["Artist"],
      art_variations: [],
      flavor_text: "",
      flavor_text_plain: "",
      image_url: "https://example.com/wtr003.png",
      image_rotation_degrees: 0,
      tcgplayer_product_id: "225104",
      tcgplayer_url: "https://www.tcgplayer.com/product/225104",
    },
  ],
};

const rawSnapshotPayload = {
  cards: [rawCard],
  sets: [rawSet],
  totalCards: 1,
  totalSets: 1,
};

const rawSnapshot: FleshAndBloodRawSnapshot = {
  schemaVersion: 2,
  source: "fab-cube",
  sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
  sourceRef: "test-ref",
  sourceVersion: "a".repeat(40),
  locale: "en-US",
  fetchedAt: "2026-07-29T08:00:00.000Z",
  artifacts: [],
  sha256: createHash("sha256").update(JSON.stringify(rawSnapshotPayload)).digest("hex"),
  payload: rawSnapshotPayload,
};

function assetPrintings(
  entries: ReadonlyArray<readonly [printingId: string, cardCanonicalId: string, hash: string]>,
) {
  return fleshAndBloodAssetPrintingsFromManifest({
    schemaVersion: 4,
    printings: Object.fromEntries(
      entries.map(([printingId, cardCanonicalId, hash]) => [
        printingId,
        {
          cardCanonicalId,
          boardPath: `fab/assets/board/${hash}.webp`,
          fullPath: `fab/assets/full/${hash}.webp`,
        },
      ]),
    ),
  });
}

describe("Flesh and Blood catalog parser", () => {
  it("normalizes a The FAB Cube payload into a catalog", () => {
    const catalog = normalizeFabCubeCatalog(
      rawSnapshot.payload,
      {
        source: "fab-cube",
        sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
        sourceRef: "test-ref",
        sourceVersion: "a".repeat(40),
        locale: "en-US",
        fetchedAt: "2026-07-29T08:00:00.000Z",
        sha256: "a".repeat(64),
      },
      fleshAndBloodAssetPrintingsFromManifest({
        schemaVersion: 4,
        printings: {
          "printing-001": {
            cardCanonicalId: "card-001",
            boardPath: `fab/assets/board/${"a".repeat(64)}.webp`,
            fullPath: `fab/assets/full/${"b".repeat(64)}.webp`,
          },
        },
      }),
    );

    expect(catalog.cards).toHaveLength(1);
    expect(catalog.sets).toHaveLength(1);
    expect(catalog.sets[0]?.releaseDate).toBe("2019-10-11T00:00:00.000Z");

    const card = catalog.cards[0]!;
    expect(card.canonicalId).toBe("card-001");
    expect(card.slug).toBe("romping-club");
    expect(card.name).toBe("Romping Club");
    expect(card.power).toBe(4);
    expect(card.types).toEqual(["Brute", "Weapon", "Club", "2H"]);
    expect(card.typeText).toBe("Brute Weapon - Club (2H)");
    expect(card.legalities.cc.legal).toBe(true);
    expect(card.legalities.cc.banned).toBe(false);

    expect(card.printings).toHaveLength(2);
    const [standard, rainbow] = card.printings;
    expect(standard?.finish).toBe("S");
    expect(standard?.edition).toBe("A");
    expect(standard?.artId).toBe("art-001");
    expect(standard?.setPrintingId).toBe("art-001");
    expect(standard?.artists).toEqual(["Artist"]);
    expect(standard?.locale).toBe("en-US");
    expect(standard?.externalIds?.tcgPlayer).toBe("225104");
    expect(standard?.externalIds?.fabCube).toBe("printing-001");
    expect(standard?.imageUrl).toBe(
      `https://cdn.tcg.online/public/fab/assets/full/${"b".repeat(64)}.webp`,
    );
    expect(standard?.boardImageUrl).toBe(
      `https://cdn.tcg.online/public/fab/assets/board/${"a".repeat(64)}.webp`,
    );
    expect(rainbow?.imageUrl).toBe("");
    expect(rainbow?.boardImageUrl).toBe("");
    expect(rainbow?.finish).toBe("R");
    expect(rainbow?.edition).toBe("U");
    expect(rainbow?.artId).toBe("art-001");
    expect(standard?.id).not.toBe(rainbow?.id);
  });

  it("keeps snapshot unique_ids whose printings array is still empty", () => {
    const unpublished = {
      ...rawCard,
      unique_id: "unpublished-001",
      name: "Rise to the Challenge",
      color: "Red",
      pitch: "1",
      types: ["Brute", "Block"],
      type_text: "Brute Block",
      functional_text: "",
      functional_text_plain: "",
      printings: [],
    };
    const catalog = normalizeFabCubeCatalog(
      { cards: [unpublished], sets: [rawSet], totalCards: 1, totalSets: 1 },
      {
        source: "fab-cube",
        sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
        sourceRef: "test-ref",
        sourceVersion: "a".repeat(40),
        locale: "en-US",
        fetchedAt: "2026-09-11T00:00:00.000Z",
        sha256: "b".repeat(64),
      },
      fleshAndBloodAssetPrintingsFromManifest({ schemaVersion: 4, printings: {} }),
    );

    expect(catalog.cards).toHaveLength(1);
    expect(catalog.cards[0]).toMatchObject({
      canonicalId: "unpublished-001",
      name: "Rise to the Challenge",
      slug: "rise-to-the-challenge-red",
      pitch: "1",
      printings: [],
    });
    const { cardData, printingData } = splitFleshAndBloodCatalog(catalog);
    expect(printingData.printingsByCanonicalId["unpublished-001"]).toEqual([]);
    expect(
      hydrateFleshAndBloodCatalogSourceParts(cardData, printingData).cards[0]?.canonicalId,
    ).toBe("unpublished-001");
  });

  it("admits official IAR release-note identities that Cube has not published yet", () => {
    const malice = {
      ...rawCard,
      unique_id: "malice-001",
      name: "Malice, Domina of the Dead",
      types: ["Shadow", "Necromancer", "Hero"],
      type_text: "Shadow Necromancer Hero",
      printings: [],
    };
    const catalog = normalizeFabCubeCatalog(
      { cards: [malice], sets: [rawSet], totalCards: 1, totalSets: 1 },
      {
        source: "fab-cube",
        sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
        sourceRef: "test-ref",
        sourceVersion: "a".repeat(40),
        locale: "en-US",
        fetchedAt: "2026-09-11T00:00:00.000Z",
        sha256: "b".repeat(64),
      },
    );

    expect(catalog.cards.map((card) => card.name).sort()).toEqual([
      "Clambering Corpses",
      "Malice, Domina of the Dead",
      "Otherworldly Ossuary",
    ]);
    expect(catalog.cards.find((card) => card.name === "Clambering Corpses")).toMatchObject({
      canonicalId: "2vfyA32UrTDEvWN89DzbY",
      slug: "clambering-corpses-blue",
      pitch: "3",
      power: 1,
      defense: 3,
      printings: [],
    });
    expect(catalog.cards.find((card) => card.name === "Otherworldly Ossuary")).toMatchObject({
      canonicalId: "yZVKqsVG5nMJ5jkmz466z",
      slug: "otherworldly-ossuary-blue",
      pitch: "3",
      cost: 1,
      defense: 3,
      printings: [],
    });
  });

  it("rejects invented or mismatched asset-manifest paths", () => {
    expect(() =>
      fleshAndBloodAssetPrintingsFromManifest({
        schemaVersion: 4,
        printings: {
          "printing-001": {
            cardCanonicalId: "card-001",
            boardPath: `fab/assets/board/${"a".repeat(64)}.webp`,
            fullPath: "fab/printings/printing-001/full.webp",
          },
        },
      }),
    ).toThrow(FleshAndBloodCatalogError);

    const mismatched = fleshAndBloodAssetPrintingsFromManifest({
      schemaVersion: 4,
      printings: {
        "printing-001": {
          cardCanonicalId: "another-card",
          boardPath: `fab/assets/board/${"b".repeat(64)}.webp`,
          fullPath: `fab/assets/full/${"c".repeat(64)}.webp`,
        },
      },
    });
    expect(() =>
      normalizeFabCubeCatalog(
        rawSnapshot.payload,
        {
          source: "fab-cube",
          sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
          sourceRef: "test-ref",
          sourceVersion: "a".repeat(40),
          locale: "en-US",
          fetchedAt: "2026-07-29T08:00:00.000Z",
          sha256: "a".repeat(64),
        },
        mismatched,
      ),
    ).toThrow("belongs to another-card, not card-001");
  });

  it("round-trips canonical catalog defaults through the sparse JSON contract", () => {
    const catalog = catalogFromSnapshot(
      rawSnapshot,
      assetPrintings([["printing-001", "card-001", "1".repeat(64)]]),
    );
    const compact = JSON.parse(JSON.stringify(compactFleshAndBloodCatalog(catalog)));
    const card = compact.cards[0]!;
    const printing = card.printings[0]!;

    expect(card).not.toHaveProperty("traits");
    expect(card).not.toHaveProperty("playedHorizontally");
    expect(card).not.toHaveProperty("grantedKeywords");
    expect(card).not.toHaveProperty("legalities");
    expect(printing).not.toHaveProperty("artVariationIds");
    expect(printing).not.toHaveProperty("imageRotationDegrees");
    const hydrated = hydrateFleshAndBloodCatalog(compact);
    expect(hydrated.cards[0]).toMatchObject({
      canonicalId: "card-001",
      slug: "romping-club",
      name: "Romping Club",
      typeText: "Brute Weapon - Club (2H)",
    });
    expect(hydrated.cards[0]).not.toHaveProperty("power");
    expect(hydrated.cards[0]).not.toHaveProperty("types");
    expect(hydrated.cards[0]).not.toHaveProperty("abilitiesAndEffects");
  });

  it("round-trips independently loadable card and printing catalog shards", () => {
    const catalog = catalogFromSnapshot(
      rawSnapshot,
      assetPrintings([["printing-001", "card-001", "1".repeat(64)]]),
    );
    const { cardData, printingData } = splitFleshAndBloodCatalog(catalog);

    expect(cardData.cards[0]).not.toHaveProperty("printings");
    expect(printingData.printingsByCanonicalId["card-001"]).toHaveLength(
      catalog.cards[0]?.printings.length,
    );
    const hydrated = hydrateFleshAndBloodCatalogParts(cardData, printingData);
    expect(hydrated.cards[0]).not.toHaveProperty("power");
    expect(hydrated.cards[0]).not.toHaveProperty("types");
    expect(hydrated.cards[0]).not.toHaveProperty("abilitiesAndEffects");
    expect(hydrateFleshAndBloodCatalogSourceParts(cardData, printingData)).toEqual(catalog);
    expect(() =>
      hydrateFleshAndBloodCatalogParts(cardData, {
        ...printingData,
        catalogSha256: "different-source",
      }),
    ).toThrow("do not describe the same source");
  });

  it("normalizes hybrid card-pool supertype alternatives", () => {
    const catalog = normalizeFabCubeCatalog(
      {
        cards: [
          {
            ...rawCard,
            unique_id: "hybrid-001",
            name: "Hybrid Attack",
            types: ["Assassin", "Ninja", "Action", "Attack"],
            type_text: "Assassin / Ninja Action - Attack",
          },
        ],
        sets: [rawSet],
      },
      {
        source: "fab-cube",
        sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
        sourceRef: "test-ref",
        sourceVersion: "a".repeat(40),
        locale: "en-US",
        fetchedAt: "2026-07-29T08:00:00.000Z",
        sha256: "a".repeat(64),
      },
    );

    expect(catalog.cards[0]?.supertypeSets).toEqual([["Assassin"], ["Ninja"]]);
  });

  it("uses printed type text when an upstream primary-type array contradicts it", () => {
    const catalog = normalizeFabCubeCatalog(
      {
        cards: [
          {
            ...rawCard,
            unique_id: "instant-001",
            types: ["Lightning", "Wizard", "Action"],
            type_text: "Lightning Wizard Instant",
          },
        ],
        sets: [rawSet],
      },
      {
        source: "fab-cube",
        sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
        sourceRef: "test-ref",
        sourceVersion: "a".repeat(40),
        locale: "en-US",
        fetchedAt: "2026-07-29T08:00:00.000Z",
        sha256: "a".repeat(64),
      },
    );

    expect(catalog.cards[0]?.types).toEqual(["Lightning", "Wizard", "Instant"]);
  });

  it.each(["BRdKgPG6pJk8pGT7CWCpB", "kLgnHP8nHtnMwHfqN9zkp", "Mbrg9P78qm9PGCdPLbncD"])(
    "corrects Comet Collision metadata when upstream still reports Instant (%s)",
    (canonicalId) => {
      const catalog = normalizeFabCubeCatalog(
        {
          cards: [
            {
              ...rawCard,
              unique_id: canonicalId,
              name: "Comet Collision",
              types: ["Lightning", "Wizard", "Instant"],
              type_text: "Lightning Wizard Instant",
            },
          ],
          sets: [rawSet],
        },
        {
          source: "fab-cube",
          sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
          sourceRef: "test-ref",
          sourceVersion: "a".repeat(40),
          locale: "en-US",
          fetchedAt: "2026-07-29T08:00:00.000Z",
          sha256: "a".repeat(64),
        },
      );

      expect(catalog.cards[0]).toMatchObject({
        types: ["Lightning", "Wizard", "Action"],
        typeText: "Lightning Wizard Action",
      });
    },
  );

  it("includes pitch color in the slug for colored cards", () => {
    const payload = {
      cards: [
        {
          ...rawCard,
          unique_id: "card-002",
          name: "Overpower",
          color: "Yellow",
          pitch: "2",
          types: ["Warrior", "Attack Reaction"],
        },
      ],
      sets: [rawSet],
    };

    const catalog = normalizeFabCubeCatalog(payload, {
      source: "fab-cube",
      sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
      sourceRef: "test-ref",
      sourceVersion: "a".repeat(40),
      locale: "en-US",
      fetchedAt: "2026-07-29T08:00:00.000Z",
      sha256: "a".repeat(64),
    });

    expect(catalog.cards).toHaveLength(1);
    expect(catalog.cards[0]?.slug).toBe("overpower-yellow");
  });

  it("preserves printings with missing image URLs for metadata validation", () => {
    const payload = {
      cards: [
        {
          ...rawCard,
          printings: [
            {
              ...rawCard.printings[0],
              image_url: null,
            },
          ],
        },
      ],
      sets: [rawSet],
    };

    const catalog = normalizeFabCubeCatalog(payload, {
      source: "fab-cube",
      sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
      sourceRef: "test-ref",
      sourceVersion: "a".repeat(40),
      locale: "en-US",
      fetchedAt: "2026-07-29T08:00:00.000Z",
      sha256: "a".repeat(64),
    });

    expect(catalog.cards).toHaveLength(1);
    expect(catalog.cards[0]?.printings[0]?.imageUrl).toBe("");
    expect(auditFleshAndBloodCatalog(catalog).missingImagePrintingIds).toEqual(["printing-001"]);
  });

  it("preserves source quality order before replacing URLs with the first-party CDN", () => {
    const catalog = normalizeFabCubeCatalog(
      {
        cards: [
          {
            ...rawCard,
            printings: [
              {
                ...rawCard.printings[0],
                unique_id: "thumbnail-printing",
                image_url: "https://source.example/media/images/WTR003.webp",
              },
              {
                ...rawCard.printings[1],
                unique_id: "large-printing",
                image_url: "https://source.example/media/cards/large/WTR003.webp",
              },
            ],
          },
        ],
        sets: [rawSet],
      },
      {
        source: "fab-cube",
        sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
        sourceRef: "test-ref",
        sourceVersion: "a".repeat(40),
        locale: "en-US",
        fetchedAt: "2026-07-29T08:00:00.000Z",
        sha256: "a".repeat(64),
      },
      assetPrintings([
        ["large-printing", "card-001", "d".repeat(64)],
        ["thumbnail-printing", "card-001", "e".repeat(64)],
      ]),
    );

    expect(catalog.cards[0]?.printings.map((printing) => printing.id)).toEqual([
      "large-printing",
      "thumbnail-printing",
    ]);
    expect(catalog.cards[0]?.printings[0]?.imageUrl).toBe(
      `https://cdn.tcg.online/public/fab/assets/full/${"d".repeat(64)}.webp`,
    );
  });

  it("derives set stubs for sets referenced by cards but missing from the source", () => {
    const payload = {
      cards: [rawCard],
      sets: [],
    };

    const catalog = normalizeFabCubeCatalog(payload, {
      source: "fab-cube",
      sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
      sourceRef: "test-ref",
      sourceVersion: "a".repeat(40),
      locale: "en-US",
      fetchedAt: "2026-07-29T08:00:00.000Z",
      sha256: "a".repeat(64),
    });

    expect(catalog.sets).toHaveLength(1);
    expect(catalog.sets[0]?.id).toBe("WTR");
  });

  it("validates and normalizes from a raw snapshot", () => {
    const catalog = catalogFromSnapshot(rawSnapshot);
    expect(catalog.cards).toHaveLength(1);
    expect(catalog.provenance.source).toBe("fab-cube");
  });

  it("throws when snapshot SHA-256 does not match", () => {
    const tampered = {
      ...rawSnapshot,
      sha256: "b".repeat(64),
    };
    expect(() => catalogFromSnapshot(tampered)).toThrow(FleshAndBloodCatalogError);
  });

  it("classifies shared source images without deleting valid printings", () => {
    const catalog = normalizeFabCubeCatalog(
      rawSnapshot.payload,
      {
        source: "fab-cube",
        sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
        sourceRef: "test-ref",
        sourceVersion: "a".repeat(40),
        locale: "en-US",
        fetchedAt: "2026-07-29T08:00:00.000Z",
        sha256: "a".repeat(64),
      },
      assetPrintings([
        ["printing-001", "card-001", "f".repeat(64)],
        ["printing-002", "card-001", "0".repeat(64)],
      ]),
    );
    const audit = auditFleshAndBloodCatalog(catalog);
    expect(audit.printingCount).toBe(2);
    expect(audit.uniqueSourceImageCount).toBe(2);
    expect(audit.printingsSharingSourceImages).toBe(0);
    expect(audit.crossCardArtworkGroups).toEqual({});
  });

  it("requires translation catalogs to cover the canonical catalog exactly", () => {
    const catalog = normalizeFabCubeCatalog(rawSnapshot.payload, {
      source: "fab-cube",
      sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
      sourceRef: "test-ref",
      sourceVersion: "a".repeat(40),
      locale: "en-US",
      fetchedAt: "2026-07-29T08:00:00.000Z",
      sha256: "a".repeat(64),
    });
    const translations = extractFleshAndBloodTranslations(catalog);
    expect(() => verifyFleshAndBloodTranslationCatalog(translations, catalog)).not.toThrow();
    expect(() =>
      verifyFleshAndBloodTranslationCatalog(
        { ...translations, cards: [...translations.cards, translations.cards[0]!] },
        catalog,
      ),
    ).toThrow("Duplicate translated card identity");
  });

  it("allows partial non-English catalogs for cards not printed in that language", () => {
    const catalog = normalizeFabCubeCatalog(rawSnapshot.payload, {
      source: "fab-cube",
      sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
      sourceRef: "test-ref",
      sourceVersion: "a".repeat(40),
      locale: "en-US",
      fetchedAt: "2026-07-29T08:00:00.000Z",
      sha256: "a".repeat(64),
    });
    const english = extractFleshAndBloodTranslations(catalog);
    expect(() =>
      verifyFleshAndBloodTranslationCatalog(
        {
          ...english,
          locale: "de-DE",
          provenance: english.provenance ? { ...english.provenance, locale: "de-DE" } : null,
          cards: [],
          sets: [],
        },
        catalog,
      ),
    ).not.toThrow();
  });

  it("normalizes Disease without retaining UPF metadata", () => {
    const catalog = normalizeFabCubeCatalog(
      {
        cards: [
          {
            ...rawCard,
            unique_id: "disease-001",
            types: ["Token", "Disease"],
            type_text: "Token - Disease",
          },
        ],
        sets: [rawSet],
      },
      {
        source: "fab-cube",
        sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
        sourceRef: "test-ref",
        sourceVersion: "a".repeat(40),
        locale: "en-US",
        fetchedAt: "2026-07-29T08:00:00.000Z",
        sha256: "a".repeat(64),
      },
    );

    expect(catalog.cards[0]?.types).toEqual(["Token", "Disease"]);
    expect(catalog.cards[0]?.legalities).not.toHaveProperty("upf");
  });

  it("reports and rejects stable identity removals", () => {
    const previous = normalizeFabCubeCatalog(rawSnapshot.payload, {
      source: "fab-cube",
      sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
      sourceRef: "test-ref",
      sourceVersion: "a".repeat(40),
      locale: "en-US",
      fetchedAt: "2026-07-29T08:00:00.000Z",
      sha256: "a".repeat(64),
    });
    const next = { ...previous, cards: [] };
    const report = diffFleshAndBloodCatalogs(previous, next);

    expect(report.removedCardIds).toEqual(["card-001"]);
    expect(() => assertNoCatalogRemovals(report)).toThrow("explicit removal flag");
  });

  it("reports upstream image-source changes even when runtime CDN URLs stay stable", () => {
    const catalog = normalizeFabCubeCatalog(rawSnapshot.payload, {
      source: "fab-cube",
      sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
      sourceRef: "test-ref",
      sourceVersion: "a".repeat(40),
      locale: "en-US",
      fetchedAt: "2026-07-29T08:00:00.000Z",
      sha256: "a".repeat(64),
    });
    const nextSources = new Map(fabCubeImageSourcesFromSnapshot(rawSnapshot));
    nextSources.set("printing-001", "https://example.com/replaced.png");

    const report = diffFleshAndBloodCatalogs(catalog, catalog, {
      previous: fabCubeImageSourcesFromSnapshot(rawSnapshot),
      next: nextSources,
    });

    expect(report.changedImageSourcePrintingIds).toEqual(["printing-001"]);
  });
});
