import { describe, expect, it } from "vitest";

import type { FleshAndBloodRawSnapshot } from "@tcg/flesh-and-blood-types/catalog";

import { catalogKeyIndex, extractLocalizedCatalogData } from "../src/localized.ts";
import {
  fleshAndBloodAssetPrintingsFromManifest,
  type FleshAndBloodAssetPrintings,
} from "../src/index.ts";

const assetPrintings: FleshAndBloodAssetPrintings = new Map();

const localizedCard = {
  unique_id: "card-001",
  name: "Cœur localisé",
  type_text: "Action générique",
  functional_text: "**Texte**",
  functional_text_plain: "Texte",
  printings: [
    {
      unique_id: "printing-001",
      set_printing_unique_id: "art-001",
      id: "TST001",
      set_id: "TST",
      edition: "N",
      foiling: "S",
      rarity: "C",
      image_url: "https://example.com/source.png",
    },
  ],
};

function snapshot(cards: unknown[] = [localizedCard]): FleshAndBloodRawSnapshot {
  return {
    schemaVersion: 2,
    source: "fab-cube",
    sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
    sourceRef: "develop",
    locale: "fr-FR",
    language: "french",
    fetchedAt: "2026-08-30T00:00:00.000Z",
    sourceVersion: "a".repeat(40),
    artifacts: [],
    sha256: "b".repeat(64),
    payload: {
      cards,
      sets: [{ unique_id: "set-001", id: "TST", name: "Ensemble" }],
      schemas: {},
      totalCards: cards.length,
      totalSets: 1,
    },
  };
}

const keys = catalogKeyIndex({
  provenance: { sha256: "c".repeat(64) },
  cards: [{ canonicalId: "card-001" }],
  sets: [{ id: "TST" }],
});

describe("localized Fab Cube extraction", () => {
  it("joins display data by canonical id and records independent source provenance", () => {
    const result = extractLocalizedCatalogData({ snapshot: snapshot(), keys, assetPrintings });

    expect(result.translations.locale).toBe("fr-FR");
    expect(result.translations.catalogSha256).toBe("c".repeat(64));
    expect(result.translations.provenance).toMatchObject({
      sourceRef: "develop",
      sourceVersion: "a".repeat(40),
      sha256: "b".repeat(64),
      locale: "fr-FR",
    });
    expect(result.translations.cards).toEqual([
      {
        canonicalId: "card-001",
        name: "Cœur localisé",
        functionalTextHtml: "**Texte**",
        functionalTextPlain: "Texte",
        typeText: "Action générique",
      },
    ]);
  });

  it("keeps upstream image URLs out of runtime printing metadata", () => {
    const result = extractLocalizedCatalogData({ snapshot: snapshot(), keys, assetPrintings });
    expect(result.printingsByCanonicalId["card-001"]?.[0]).toMatchObject({
      id: "printing-001",
      locale: "fr-FR",
      imageUrl: "",
      boardImageUrl: "",
    });
  });

  it("joins both first-party formats to the exact localized printing", () => {
    const assets = fleshAndBloodAssetPrintingsFromManifest({
      schemaVersion: 4,
      printings: {
        "printing-001": {
          cardCanonicalId: "card-001",
          boardPath: `fab/assets/board/${"a".repeat(64)}.webp`,
          fullPath: `fab/assets/full/${"b".repeat(64)}.webp`,
        },
      },
    });
    const result = extractLocalizedCatalogData({
      snapshot: snapshot(),
      keys,
      assetPrintings: assets,
    });
    expect(result.printingsByCanonicalId["card-001"]?.[0]).toMatchObject({
      id: "printing-001",
      locale: "fr-FR",
      boardImageUrl: `https://cdn.tcg.online/public/fab/assets/board/${"a".repeat(64)}.webp`,
      imageUrl: `https://cdn.tcg.online/public/fab/assets/full/${"b".repeat(64)}.webp`,
    });
    const wrongOwner = { ...localizedCard, unique_id: "card-002" };
    expect(() =>
      extractLocalizedCatalogData({
        snapshot: snapshot([wrongOwner]),
        keys: { ...keys, canonicalIds: new Set(["card-002"]) },
        assetPrintings: assets,
      }),
    ).toThrow("belongs to card-001, not card-002");
  });

  it("rejects duplicate localized identities", () => {
    expect(() =>
      extractLocalizedCatalogData({
        snapshot: snapshot([localizedCard, localizedCard]),
        keys,
        assetPrintings,
      }),
    ).toThrow("Duplicate localized card identity");
  });

  it("rejects duplicate localized printing identities", () => {
    const duplicatePrinting = {
      ...localizedCard,
      unique_id: "card-002",
      printings: localizedCard.printings,
    };
    const duplicateKeys = catalogKeyIndex({
      provenance: { sha256: "c".repeat(64) },
      cards: [{ canonicalId: "card-001" }, { canonicalId: "card-002" }],
      sets: [{ id: "TST" }],
    });
    expect(() =>
      extractLocalizedCatalogData({
        snapshot: snapshot([localizedCard, duplicatePrinting]),
        keys: duplicateKeys,
        assetPrintings,
      }),
    ).toThrow("Duplicate localized printing identity");
  });

  it("reports translated cards absent from the English catalog", () => {
    const unknown = { ...localizedCard, unique_id: "unknown-card" };
    const result = extractLocalizedCatalogData({
      snapshot: snapshot([unknown]),
      keys,
      assetPrintings,
    });
    expect(result.translations.cards).toEqual([]);
    expect(result.unmatchedCardIds).toEqual(["unknown-card"]);
  });

  it("reports localized sets absent from the English catalog", () => {
    const localizedSnapshot = snapshot();
    localizedSnapshot.payload = {
      cards: [localizedCard],
      sets: [{ unique_id: "set-002", id: "NEW", name: "Nouvel ensemble" }],
      schemas: {},
      totalCards: 1,
      totalSets: 1,
    };
    const result = extractLocalizedCatalogData({
      snapshot: localizedSnapshot,
      keys,
      assetPrintings,
    });
    expect(result.unmatchedSetIds).toEqual(["NEW"]);
  });
});
