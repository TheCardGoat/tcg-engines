import { describe, expect, it } from "vitest";

import { defineFleshAndBloodCard, typeBoxTokens } from "@tcg/flesh-and-blood-types/authoring";
import type { FleshAndBloodCatalog } from "@tcg/flesh-and-blood-types/catalog";

import {
  createFleshAndBloodCatalogIndex,
  fleshAndBloodCatalog,
  fleshAndBloodStructuredCardsByCanonicalId,
} from "./index.ts";
import { burnUpShockRed } from "./cards/actions/burn-up-shock.ts";
import cardIdentitySourceJson from "./generated/flesh-and-blood-card-data.json" with { type: "json" };

const catalog: FleshAndBloodCatalog = {
  schemaVersion: 1,
  game: "flesh-and-blood",
  provenance: {
    source: "fab-cube",
    sourceUrl: "https://github.com/the-fab-cube/flesh-and-blood-cards",
    sourceRef: "test-ref",
    locale: "en-US",
    fetchedAt: "2026-07-29T08:00:00.000Z",
    sourceVersion: "a".repeat(40),
    sha256: "a".repeat(64),
    productionEligible: false,
  },
  sets: [{ id: "MST", name: "Monarch" }],
  cards: [
    {
      canonicalId: "test-001",
      slug: "test-reunion",
      name: "Test Reunion",
      printings: [
        {
          id: "printing-001",
          artId: "art-001",
          setCode: "MST",
          collectorNumber: "MST131",
          rarity: "M",
          imageUrl: "https://example.com/card.png",
          finish: "S",
          edition: "N",
          expansionSlot: false,
        },
      ],
      functionalTextHtml: "**Ward 10**",
      functionalTextPlain: "Ward 10",
      typeText: "Illusionist Action - Aura",
      playedHorizontally: false,
      legalities: {
        blitz: {
          legal: true,
          banned: false,
          suspended: false,
          livingLegend: false,
          restricted: false,
        },
        cc: {
          legal: true,
          banned: false,
          suspended: false,
          livingLegend: false,
          restricted: false,
        },
        commoner: {
          legal: false,
          banned: false,
          suspended: false,
          livingLegend: false,
          restricted: false,
        },
        ll: {
          legal: true,
          banned: false,
          suspended: false,
          livingLegend: false,
          restricted: false,
        },
        silverAge: {
          legal: false,
          banned: false,
          suspended: false,
          livingLegend: false,
          restricted: false,
        },
      },
    },
  ],
};

describe("Flesh and Blood card catalog", () => {
  it("ships a populated generated catalog", () => {
    expect(fleshAndBloodCatalog.cards.length).toBeGreaterThan(0);
    expect(fleshAndBloodCatalog.sets.length).toBeGreaterThan(0);
    expect(fleshAndBloodCatalog.provenance).not.toBeNull();
    expect(fleshAndBloodCatalog.provenance?.source).toBe("fab-cube");
    expect(fleshAndBloodCatalog.provenance?.sourceVersion).toMatch(/^[a-f0-9]{40}$/);
    expect(
      fleshAndBloodCatalog.cards
        .flatMap((card) => card.printings)
        .every(
          (printing) =>
            printing.imageUrl === "" || printing.imageUrl.startsWith("https://cdn.tcg.online/"),
        ),
    ).toBe(true);
  });

  it("reconciles every locally authored identity and printed property with upstream", () => {
    const identitySourceByCanonicalId = new Map(
      cardIdentitySourceJson.cards.map((card) => [card.canonicalId, card] as const),
    );
    const numericProperties = [
      ["pitch", "pitch"],
      ["cost", "cost"],
      ["power", "power"],
      ["defense", "defense"],
      ["life", "health"],
      ["intellect", "intelligence"],
      ["arcane", "arcane"],
    ] as const;

    const keywordFamily = (keyword: string): string =>
      keyword.toLocaleLowerCase().replaceAll("-", " ").trim();

    for (const authored of fleshAndBloodStructuredCardsByCanonicalId.values()) {
      const upstream = identitySourceByCanonicalId.get(authored.canonicalId);
      expect(upstream, authored.canonicalId).toBeDefined();
      const catalogCard = fleshAndBloodCatalog.cards.find(
        (card) => card.canonicalId === authored.canonicalId,
      );
      expect(catalogCard, `${authored.canonicalId} catalog`).toBeDefined();
      expect(Array.isArray(catalogCard?.printings), `${authored.canonicalId} printings`).toBe(true);
      const authoredTypes =
        authored.layout.kind === "split"
          ? authored.layout.faces.flatMap((face) => [...face.types])
          : typeBoxTokens(authored.base.typeBox);
      const withoutSyntheticGeneric = (types: readonly string[]) =>
        [...new Set(types.filter((type) => type !== "Generic"))].sort();
      expect(
        withoutSyntheticGeneric(upstream?.types ?? []),
        `${authored.canonicalId} type box`,
      ).toEqual(withoutSyntheticGeneric(authoredTypes));
      for (const [authoredKey, upstreamKey] of numericProperties) {
        const authoredValue = authored.base.numeric[authoredKey];
        if (authoredValue !== undefined) {
          const upstreamValue = upstream?.[upstreamKey];
          expect(
            upstreamKey === "pitch" && upstreamValue !== undefined
              ? Number(upstreamValue)
              : upstreamValue,
            `${authored.canonicalId} ${upstreamKey}`,
          ).toBe(authoredValue);
        }
      }
      const authoredKeywordFamilies = authored.base.keywords
        .map((keyword) =>
          keywordFamily(keyword.name === "label-keyword" ? keyword.label.name : keyword.name),
        )
        .sort();
      const upstreamKeywords = [
        ...(upstream?.cardKeywords ?? []),
        ...(upstream?.abilityAndEffectKeywords ?? []),
        ...(upstream?.grantedKeywords ?? []),
        ...(upstream?.removedKeywords ?? []),
        ...(upstream?.interactsWithKeywords ?? []),
      ].map(keywordFamily);
      const upstreamFunctionalText = keywordFamily(upstream?.functionalTextPlain ?? "");
      for (const family of authoredKeywordFamilies) {
        expect(
          upstreamKeywords.some(
            (keyword) =>
              keyword === family ||
              keyword.startsWith(`${family} `) ||
              keyword.endsWith(` ${family}`),
          ) || upstreamFunctionalText.includes(family),
          `${authored.canonicalId} printed keyword ${family}`,
        ).toBe(true);
      }
    }
  });

  it("preserves every catalog hybrid supertype alternative in its structured definition", () => {
    const hybrids = cardIdentitySourceJson.cards.filter(
      (card) =>
        card.typeText.includes(" / ") &&
        fleshAndBloodStructuredCardsByCanonicalId.has(card.canonicalId),
    );
    expect(hybrids.length).toBeGreaterThan(100);
    for (const card of hybrids) {
      expect(card.supertypeSets, `${card.name} (${card.canonicalId})`).toBeDefined();
      expect(
        fleshAndBloodStructuredCardsByCanonicalId.get(card.canonicalId)?.base.typeBox.supertypeSets,
        `${card.name} (${card.canonicalId})`,
      ).toEqual(card.supertypeSets);
    }
  });

  it("rejects a hybrid group on a split card until groups are modeled per face", () => {
    const { base: _base, ...source } = burnUpShockRed;

    expect(() =>
      defineFleshAndBloodCard({
        ...source,
        supertypeSets: [["Runeblade"], ["Lightning"]],
      }),
    ).toThrow("hybrid supertype groups on split cards require a per-face type-box representation");
  });

  it("indexes canonical, printing, set, collector, and search metadata", () => {
    const index = createFleshAndBloodCatalogIndex(catalog);
    expect(index.getCard("test-001")?.name).toBe("Test Reunion");
    expect(index.getCard("printing-001")?.name).toBe("Test Reunion");
    expect(index.getSet("MST")?.name).toBe("Monarch");
    expect(index.cardsBySetCollectorNumber.get("MST:MST131")?.[0]?.name).toBe("Test Reunion");
    for (const query of ["test reunion", "illusionist", "ward", "mst", "mst131"]) {
      expect(index.search(query)).toHaveLength(1);
    }
  });
});
