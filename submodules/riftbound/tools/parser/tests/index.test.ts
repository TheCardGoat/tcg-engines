import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import type { RiftboundImportContext } from "@tcg/riftbound-types";
import {
  assertProductionEligibleRiftboundCatalog,
  catalogFromSnapshot,
  formatRiftboundCatalogJson,
  extractRiftboundTranslations,
  formatRiftboundTranslationsJson,
  generateRiftboundCatalogFiles,
  normalizeRiftboundCatalog,
  riftboundDisplayHtmlToPlainText,
  sanitizeRiftboundDisplayHtml,
} from "../src/index.ts";

const galleryContext: RiftboundImportContext = {
  source: "riot-card-gallery",
  sourceUrl: "https://playriftbound.com/en-us/card-gallery/",
  locale: "en_US",
  fetchedAt: "2026-07-20T12:00:00.000Z",
  sha256: "a".repeat(64),
};

function galleryCard(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: "ogn-001-298",
    collectorNumber: 1,
    name: "Test Unit",
    publicCode: "OGN-001/001",
    set: { value: { id: "OGN", label: "Origins" } },
    cardType: { type: [{ id: "unit", label: "Unit" }] },
    rarity: { value: { id: "common", label: "Common" } },
    domain: { values: [{ id: "order", label: "Order" }] },
    cardImage: {
      url: "https://cmsassets.rgpub.io/sanity/images/source/abcdefabcdefabcdefabcdefabcdefabcdefabcd-744x1039.png",
      dimensions: { width: 744, height: 1039 },
    },
    orientation: "portrait",
    illustrator: { values: [{ id: "artist", label: "Official Artist" }] },
    text: {
      richText: {
        type: "html",
        body: "<p>[Action] Give me +1 :rb_might:.</p>",
      },
    },
    tags: { tags: ["Demacia"] },
    ...overrides,
  };
}

function galleryPayload(cards = [galleryCard()]): Record<string, unknown> {
  return {
    sets: [{ id: "OGN", name: "Origins", collectorNumberMax: 1 }],
    cards,
    reportedTotal: cards.length,
  };
}

describe("Riftbound catalog normalization", () => {
  it("normalizes gallery metadata without interpreting printed text", () => {
    const catalog = normalizeRiftboundCatalog(
      galleryPayload([
        galleryCard({
          energy: { value: { id: 2, label: "2" } },
          power: { value: { id: 1, label: "1" } },
          might: { value: { id: 3, label: "3" } },
          mightBonus: { value: { id: 2, label: "+2" } },
          flags: [{ id: "new", label: "New" }],
          effect: {
            richText: { type: "html", body: "<p>Additional printed reference text.</p>" },
          },
        }),
      ]),
      galleryContext,
    );
    expect(catalog.provenance).toMatchObject({
      source: "riot-card-gallery",
      locale: "en-US",
      productionEligible: false,
    });
    expect(catalog.cards[0]).toMatchObject({
      canonicalId: "ogn-001-298",
      slug: "ogn-001-298",
      cardType: "unit",
      domains: ["order"],
      energy: 2,
      power: 1,
      might: 3,
      mightBonus: 2,
      flags: ["new"],
      keywords: [],
      rulesTextPlain: "[Action] Give me +1 :rb_might:.",
      effectTextPlain: "Additional printed reference text.",
    });
    expect(catalog.cards[0]).not.toHaveProperty("ability");
    expect(catalog.cards[0]).not.toHaveProperty("trigger");
    expect(catalog.cards[0]).not.toHaveProperty("effects");
  });

  it("keeps absent statistics absent instead of coercing them to zero", () => {
    const card = normalizeRiftboundCatalog(galleryPayload(), galleryContext).cards[0]!;
    expect(card).not.toHaveProperty("energy");
    expect(card).not.toHaveProperty("power");
    expect(card).not.toHaveProperty("might");
  });

  it("sanitizes display HTML while preserving text and Riftbound icon placeholders", () => {
    const unsafe =
      '<p onclick="steal()">Deal <strong>2</strong> :rb_might:.</p><script>alert(1)</script><img src=x onerror=steal()>';
    expect(sanitizeRiftboundDisplayHtml(unsafe)).toBe("<p>Deal <strong>2</strong> :rb_might:.</p>");
    expect(riftboundDisplayHtmlToPlainText(unsafe)).toBe("Deal 2 :rb_might:.");
  });

  it("does not merge same-name cards with distinct official identities", () => {
    const cards = [galleryCard(), galleryCard({ id: "ogn-001a-298", publicCode: "OGN-001A/001" })];
    const catalog = normalizeRiftboundCatalog(galleryPayload(cards), galleryContext);
    expect(catalog.cards.map((card) => card.canonicalId)).toEqual(["ogn-001-298", "ogn-001a-298"]);
    expect(catalog.cards[1]?.printings[0]?.collectorNumber).toBe("001A");
  });

  it("preserves every currently observed type, domain, and rarity as data", () => {
    const types = ["battlefield", "gear", "legend", "rune", "spell", "unit"];
    const domains = ["body", "calm", "chaos", "colorless", "fury", "mind", "order"];
    const rarities = ["common", "epic", "rare", "showcase", "uncommon"];
    for (const [index, type] of types.entries()) {
      const domain = domains[index % domains.length]!;
      const rarity = rarities[index % rarities.length]!;
      const card = galleryCard({
        id: `card-${index}`,
        publicCode: `OGN-${index + 1}/001`,
        cardType: { type: [{ id: type, label: type }] },
        domain: { values: [{ id: domain, label: domain }] },
        rarity: { value: { id: rarity, label: rarity } },
      });
      const normalized = normalizeRiftboundCatalog(galleryPayload([card]), galleryContext)
        .cards[0]!;
      expect(normalized.cardType).toBe(type);
      expect(normalized.domains).toEqual([domain]);
      expect(normalized.printings[0]?.rarity).toBe(rarity);
    }

    const token = galleryCard({
      id: "token-card",
      publicCode: "UNL-T01",
      cardType: {
        type: [],
        superType: [{ id: "token", label: "Token" }],
      },
    });
    expect(
      normalizeRiftboundCatalog(galleryPayload([token]), galleryContext).cards[0]?.cardType,
    ).toBe("token");
  });

  it("rejects duplicate set, canonical, and printing identities", () => {
    expect(() =>
      normalizeRiftboundCatalog(
        {
          ...galleryPayload(),
          sets: [
            { id: "OGN", name: "Origins" },
            { id: "OGN", name: "Origins Again" },
          ],
        },
        galleryContext,
      ),
    ).toThrow("Duplicate set identity");
    expect(() =>
      normalizeRiftboundCatalog(galleryPayload([galleryCard(), galleryCard()]), galleryContext),
    ).toThrow("Duplicate canonical card identity");
  });

  it("generates deterministic JSON", () => {
    const first = normalizeRiftboundCatalog(galleryPayload(), galleryContext);
    const second = normalizeRiftboundCatalog(galleryPayload(), galleryContext);
    expect(formatRiftboundCatalogJson(first)).toBe(formatRiftboundCatalogJson(second));
  });

  it("rejects a raw snapshot whose payload no longer matches its checksum", () => {
    const payload = galleryPayload();
    const snapshot = {
      schemaVersion: 1,
      source: "riot-card-gallery",
      sourceUrl: galleryContext.sourceUrl,
      locale: galleryContext.locale,
      fetchedAt: galleryContext.fetchedAt,
      sha256: createHash("sha256").update(JSON.stringify(payload)).digest("hex"),
      payload,
    };
    expect(() => catalogFromSnapshot(snapshot)).not.toThrow();
    snapshot.payload = { ...payload, reportedTotal: 2 };
    expect(() => catalogFromSnapshot(snapshot)).toThrow("SHA-256 does not match");
  });

  it("accepts a reportedTotal larger than the embedded payload when base ranges are covered", () => {
    const payload = { ...galleryPayload(), reportedTotal: 2 };
    expect(() => normalizeRiftboundCatalog(payload, galleryContext)).not.toThrow();
  });

  it("rejects a gallery payload missing base collector numbers of a declared set", () => {
    const payload = {
      ...galleryPayload(),
      sets: [{ id: "OGN", name: "Origins", collectorNumberMax: 2 }],
    };
    expect(() => normalizeRiftboundCatalog(payload, galleryContext)).toThrow(
      "gallery.set OGN: missing base collector numbers 2",
    );
  });

  it("rejects gallery catalogs at the production gate", () => {
    const catalog = normalizeRiftboundCatalog(galleryPayload(), galleryContext);
    expect(() => assertProductionEligibleRiftboundCatalog(catalog)).toThrow(
      "authenticated Riot content API provenance",
    );
  });

  it("accepts a versioned authenticated Riot API fixture", () => {
    const catalog = normalizeRiftboundCatalog(
      {
        game: "riftbound",
        version: "2026.7",
        lastUpdated: "2026-07-20T00:00:00Z",
        sets: [
          {
            id: "OGN",
            name: "Origins",
            cards: [
              {
                id: "official-card-1",
                collectorNumber: 1,
                set: "OGN",
                name: "Official Card",
                description: "<p>Official printed text.</p>",
                type: "Unit",
                rarity: "Common",
                faction: "Order",
                stats: { energy: 1, might: 2 },
                keywords: ["Future Unknown Keyword"],
                art: {
                  fullURL: "https://example.riotgames.com/card.png",
                  artist: "Official Artist",
                },
                tags: ["Demacia"],
              },
            ],
          },
        ],
      },
      {
        source: "riot-content-api",
        sourceUrl: "https://europe.api.riotgames.com/riftbound/content/v1/contents?locale=en",
        locale: "en",
        fetchedAt: "2026-07-20T12:00:00.000Z",
        sha256: "b".repeat(64),
      },
    );
    expect(catalog.cards[0]?.keywords).toEqual(["Future Unknown Keyword"]);
    expect(() => assertProductionEligibleRiftboundCatalog(catalog)).not.toThrow();
  });

  it("reports a precise path when upstream schemas drift", () => {
    expect(() =>
      normalizeRiftboundCatalog(
        galleryPayload([galleryCard({ cardImage: undefined })]),
        galleryContext,
      ),
    ).toThrow("gallery.cards.0.cardImage");
  });

  it("writes deterministic JSON plus a thin TypeScript module", async () => {
    const outputDirectory = await mkdtemp(path.join(tmpdir(), "riftbound-catalog-"));
    try {
      const snapshotPath = new URL("./fixtures/gallery-snapshot.json", import.meta.url).pathname;
      const catalog = await generateRiftboundCatalogFiles({ snapshotPath, outputDirectory });
      expect(catalog.cards).toHaveLength(1);
      expect(await readFile(path.join(outputDirectory, "riftbound-catalog.json"), "utf8")).toBe(
        formatRiftboundCatalogJson(catalog),
      );
      expect(await readFile(path.join(outputDirectory, "riftbound-catalog.ts"), "utf8")).toContain(
        'with { type: "json" }',
      );
      const translations = extractRiftboundTranslations(catalog);
      expect(
        await readFile(path.join(outputDirectory, "riftbound-translations.json"), "utf8"),
      ).toBe(formatRiftboundTranslationsJson(translations));
      expect(translations.cards[0]).toMatchObject({
        canonicalId: catalog.cards[0]?.canonicalId,
        name: catalog.cards[0]?.name,
      });
      expect(
        await readFile(path.join(outputDirectory, "riftbound-translations.ts"), "utf8"),
      ).toContain('with { type: "json" }');
      await expect(
        generateRiftboundCatalogFiles({
          snapshotPath,
          outputDirectory,
          production: true,
        }),
      ).rejects.toThrow("authenticated Riot content API provenance");
    } finally {
      await rm(outputDirectory, { recursive: true, force: true });
    }
  });
});
