import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import os from "node:os";
import path from "node:path";
import { normalizeGrandArchiveSnapshot, readAndNormalizeGrandArchiveSnapshot } from "./index.ts";

describe("Grand Archive Index catalog normalization", () => {
  it("rejects a raw snapshot whose payload does not match its provenance digest", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "grand-archive-catalog-"));
    const snapshotPath = path.join(directory, "snapshot.json");
    try {
      await writeFile(
        snapshotPath,
        JSON.stringify({
          schemaVersion: 1,
          source: "gatcg-index-api",
          sourceUrl: "https://api.gatcg.com/cards/search",
          openApiUrl: "https://api.gatcg.com/openapi.json",
          fetchedAt: "2026-08-22T00:00:00.000Z",
          sha256: "tampered",
          payload: { cards: [] },
        }),
      );
      await expect(readAndNormalizeGrandArchiveSnapshot(snapshotPath)).rejects.toThrow(
        "checksum mismatch",
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("reads a provenance-preserving compressed official snapshot", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "grand-archive-catalog-"));
    const snapshotPath = path.join(directory, "snapshot.json.gz");
    const payload = { cards: [] };
    try {
      await writeFile(
        snapshotPath,
        gzipSync(
          JSON.stringify({
            schemaVersion: 1,
            source: "gatcg-index-api",
            sourceUrl: "https://api.gatcg.com/cards/search",
            openApiUrl: "https://api.gatcg.com/openapi.json",
            fetchedAt: "2026-08-22T00:00:00.000Z",
            sha256: createHash("sha256").update(JSON.stringify(payload)).digest("hex"),
            payload,
          }),
        ),
      );
      await expect(readAndNormalizeGrandArchiveSnapshot(snapshotPath)).resolves.toMatchObject({
        cards: [],
        provenance: { source: "gatcg-index-api" },
      });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("preserves Index identities and maps fast speed without making rules executable", () => {
    const catalog = normalizeGrandArchiveSnapshot({
      schemaVersion: 1,
      source: "gatcg-index-api",
      sourceUrl: "https://api.gatcg.com/cards/search",
      openApiUrl: "https://api.gatcg.com/openapi.json",
      fetchedAt: "2026-08-22T00:00:00.000Z",
      sha256: "fixture",
      payload: {
        cards: [
          {
            uuid: "card-uuid",
            slug: "fixture",
            name: "Fixture",
            types: ["ACTION"],
            subtypes: ["SPELL"],
            classes: ["MAGE"],
            elements: ["ARCANE"],
            cost: { type: "memory", value: "1" },
            cost_memory: 1,
            cost_reserve: null,
            level: null,
            power: null,
            life: null,
            durability: null,
            speed: true,
            effect: "Draw a card.",
            effect_raw: "Draw a card.",
            effect_html: "Draw a card.",
            legality: null,
            references: [],
            referenced_by: [],
            editions: [
              {
                uuid: "edition-uuid",
                slug: "fixture-amb",
                collector_number: "001",
                rarity: 1,
                image: "/cards/images/fixture.jpg",
                configuration: "default",
                orientation: null,
                illustrator: null,
                flavor: null,
                other_orientations: [
                  {
                    uuid: "back-card-uuid",
                    slug: "fixture-transformed",
                    name: "Fixture, Transformed",
                    types: ["ALLY"],
                    subtypes: ["MAGE", "HUMAN"],
                    classes: ["MAGE"],
                    elements: ["ARCANE"],
                    cost: { type: "reserve", value: "2" },
                    cost_memory: null,
                    cost_reserve: 2,
                    level: null,
                    power: 2,
                    life: 3,
                    durability: null,
                    speed: null,
                    effect: "Taunt",
                    effect_raw: "Taunt",
                    effect_html: "Taunt",
                    edition: { orientation: "back" },
                  },
                ],
                set: {
                  id: "set-uuid",
                  prefix: "AMB",
                  name: "Mortal Ambition",
                  language: "EN",
                  release_date: "2024-10-11",
                },
              },
            ],
          },
        ],
      },
    });
    expect(catalog.cards[0]).toMatchObject({
      canonicalId: "card-uuid",
      speed: "fast",
      externalIds: { gatcgIndex: "card-uuid" },
      printings: [
        { id: "edition-uuid", imageUrl: "https://api.gatcg.com/cards/images/fixture.jpg" },
      ],
    });
    expect(catalog.cards[0]?.effectRaw).toBe("Draw a card.");
    expect(catalog.cards[0]?.relatedFaces).toEqual([
      expect.objectContaining({
        canonicalId: "back-card-uuid",
        orientation: "back",
        name: "Fixture, Transformed",
      }),
    ]);
  });
});
