import { readFile } from "node:fs/promises";

import { describe, expect, it, vi } from "vitest";

import {
  discoverNextChunkUrls,
  extractExBurstCardDetail,
  extractExBurstCatalogEntries,
  extractSimulatorCardsFromBundle,
  reconcileSources,
  scrapeNarutoCardGameSimulator,
  type ExBurstCommunitySource,
  type SimulatorCommunitySource,
} from "../src/index.ts";

async function fixture(name: string): Promise<string> {
  return readFile(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
}

describe("Naruto community-source scraper", () => {
  it("discovers only same-origin Next.js chunks", async () => {
    expect(
      discoverNextChunkUrls(
        await fixture("simulator-collection.html"),
        "https://narutocardgamesimulator.com/en/collection",
      ),
    ).toEqual([
      "https://narutocardgamesimulator.com/_next/static/chunks/runtime.js",
      "https://narutocardgamesimulator.com/_next/static/chunks/cards.js",
    ]);
  });

  it("extracts and validates the serialized simulator card map", async () => {
    const cards = extractSimulatorCardsFromBundle(await fixture("simulator-cards.js"));
    expect(cards).toHaveLength(2);
    expect(cards[0]).toMatchObject({
      id: "N-001",
      cardType: "leader",
      nameEn: "Naruto Uzumaki",
      life: 15,
    });
    expect(cards[1]).toMatchObject({ id: "C-001", cardType: "chakra" });
  });

  it("fetches the collection and the single card-data chunk without calling a private API", async () => {
    const page = await fixture("simulator-collection.html");
    const bundle = await fixture("simulator-cards.js");
    const requests: string[] = [];
    const fetchImpl = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      requests.push(url);
      if (url.endsWith("/en/collection")) return new Response(page);
      if (url.endsWith("/cards.js")) return new Response(bundle);
      if (url.endsWith("/runtime.js")) return new Response("const runtime=true;");
      return new Response(null, { status: 404 });
    }) as typeof fetch;

    const source = await scrapeNarutoCardGameSimulator({
      fetchImpl,
      now: () => new Date("2026-08-02T12:00:00.000Z"),
    });
    expect(source.cards).toHaveLength(2);
    expect(source.payloadUrl).toMatch(/\/cards\.js$/);
    expect(requests.every((url) => !new URL(url).pathname.startsWith("/api/"))).toBe(true);
  });

  it("extracts ExBurst catalog identities and visible detail fields", async () => {
    expect(extractExBurstCatalogEntries(await fixture("exburst-list.html"))).toEqual([
      {
        number: "C-001",
        name: "Chakra Card",
        imageUrl: "https://exburst.dev/nrtb/cards/hd/C-001.webp",
      },
      {
        number: "N-001",
        name: "Naruto Uzumaki",
        imageUrl: "https://exburst.dev/nrtb/cards/hd/N-001.webp",
      },
    ]);
    expect(
      extractExBurstCardDetail(
        await fixture("exburst-detail.html"),
        "https://exburst.dev/naruto/cards/N-001",
      ),
    ).toMatchObject({
      number: "N-001",
      name: "Naruto Uzumaki",
      rarity: "L",
      fields: {
        Effect: ["[Recovery] Flip all CHAKRA face-up.", "[Rush] This card can attack."],
        Type: ["LEADER"],
        DMG: ["1"],
        POW: ["3"],
      },
    });
  });

  it("reports exact matches, source-only cards, and stat conflicts", async () => {
    const cards = extractSimulatorCardsFromBundle(await fixture("simulator-cards.js"));
    const simulator: SimulatorCommunitySource = {
      source: "naruto-card-game-simulator",
      sourceUrl: "https://narutocardgamesimulator.com/en/collection",
      payloadUrl: "https://narutocardgamesimulator.com/cards.js",
      fetchedAt: "2026-08-02T12:00:00.000Z",
      sha256: "a".repeat(64),
      cards,
    };
    const exBurst: ExBurstCommunitySource = {
      source: "exburst",
      sourceUrl: "https://exburst.dev/naruto/cardlist",
      fetchedAt: "2026-08-02T12:00:00.000Z",
      sha256: "b".repeat(64),
      reportedCardCount: 2,
      cards: [
        {
          number: "N-001",
          name: "Naruto Uzumaki",
          imageUrl: "",
          detailUrl: "https://exburst.dev/naruto/cards/N-001",
          rarity: "L",
          fields: { Type: ["LEADER"], DMG: ["1"], POW: ["4"] },
        },
        {
          number: "N-002",
          name: "Choji Akimichi",
          imageUrl: "",
          detailUrl: "https://exburst.dev/naruto/cards/N-002",
          rarity: "R",
          fields: { Type: ["CHARACTER"] },
        },
      ],
    };

    expect(reconcileSources(simulator, exBurst)).toEqual({
      exactNumberMatches: 1,
      inferredIdentityMatches: [],
      simulatorOnly: ["C-001"],
      exBurstOnly: ["N-002"],
      conflicts: [
        {
          simulatorId: "N-001",
          exBurstNumber: "N-001",
          fields: ["power"],
        },
      ],
    });
  });

  it("uses the reviewed reveal ordinal to disambiguate otherwise identical sample cards", async () => {
    const base = extractSimulatorCardsFromBundle(await fixture("simulator-cards.js"))[0]!;
    const reveal = {
      ...base,
      id: "N-reveal-04",
      number: "",
      cardType: "character" as const,
      life: null,
      health: 6,
      damage: 3,
      power: 6,
      skills: [],
    };
    const simulator: SimulatorCommunitySource = {
      source: "naruto-card-game-simulator",
      sourceUrl: "https://narutocardgamesimulator.com/en/collection",
      payloadUrl: "https://narutocardgamesimulator.com/cards.js",
      fetchedAt: "2026-08-02T12:00:00.000Z",
      sha256: "a".repeat(64),
      cards: [reveal],
    };
    const sample = (number: string) => ({
      number,
      name: "Naruto Uzumaki",
      imageUrl: "",
      detailUrl: `https://exburst.dev/naruto/cards/${number}`,
      rarity: null,
      fields: { Type: ["CHARACTER"], DMG: ["3"], POW: ["6"], HP: ["6"] },
    });
    const exBurst: ExBurstCommunitySource = {
      source: "exburst",
      sourceUrl: "https://exburst.dev/naruto/cardlist",
      fetchedAt: "2026-08-02T12:00:00.000Z",
      sha256: "b".repeat(64),
      reportedCardCount: 2,
      cards: [sample("SAMPLE-4"), sample("SAMPLE-12")],
    };

    expect(reconcileSources(simulator, exBurst)).toMatchObject({
      exactNumberMatches: 0,
      inferredIdentityMatches: [
        { simulatorId: "N-reveal-04", exBurstNumber: "SAMPLE-4", score: 28 },
      ],
      simulatorOnly: [],
      exBurstOnly: ["SAMPLE-12"],
    });
  });
});
