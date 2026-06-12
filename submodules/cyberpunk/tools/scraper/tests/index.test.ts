import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test } from "vite-plus/test";

import type { RawCardRecord } from "@tcg/cyberpunk-types";

import {
  extractCatalogSlugsFromRouter,
  extractDetailFallbackFields,
  extractRawCardFromRouter,
  extractTsrScript,
  fetchAllRawCards,
  loadDocument,
  normalizeCard,
  parseRouterState,
  preserveStableCardIds,
} from "../src/index.ts";

async function readFixture(name: string): Promise<string> {
  const localPath = resolve(process.cwd(), "tests/fixtures", name);
  const workspacePath = resolve(process.cwd(), "tools/scraper/tests/fixtures", name);
  return readFile(existsSync(localPath) ? localPath : workspacePath, "utf8");
}

test("parses catalog slugs from the TSR script embedded in the HTML", async () => {
  const html = await readFixture("catalog-page.html");
  const $ = loadDocument(html);
  const scriptText = extractTsrScript($);

  expect(scriptText).not.toBeNull();
  expect(extractCatalogSlugsFromRouter(parseRouterState(scriptText!))).toEqual([
    "reboot-optics",
    "v-streetkid",
  ]);
});

test("parses a detail-page raw card record from the TSR script", async () => {
  const html = await readFixture("detail-page.html");
  const $ = loadDocument(html);
  const scriptText = extractTsrScript($);
  const rawCard = extractRawCardFromRouter(parseRouterState(scriptText!));

  expect(rawCard.slug).toBe("reboot-optics");
  expect(rawCard.printings).toHaveLength(1);
  expect(rawCard.selected_printing_id).toBe(rawCard.printings[0]?.id ?? null);
  expect(rawCard.print_number).toBe("α028");
});

test("extracts visible detail fields from DOM fallback markup without TSR state", async () => {
  const html = await readFixture("detail-page-no-tsr.html");
  const fallback = extractDetailFallbackFields(loadDocument(html));

  expect(fallback).toMatchObject({
    slug: "reboot-optics",
    name: "Reboot Optics",
    subname: null,
    displayName: "Reboot Optics",
    color: "Yellow",
    cardType: "Program",
    classifications: ["Tech"],
    cost: 2,
    power: null,
    ram: 2,
    rulesText:
      "Give a friendly unit +4 power this turn. Defeat it at the end of the turn. (Discard programs after they resolve.)",
    setName: "Alpha Kit Set",
    setCode: "alpha",
    printNumber: "α028",
    artist: "Miguel Valderrama",
    imageUrl:
      "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a028.webp?Expires=1775139886&Key-Pair-Id=K3SGRHESIHQPEW&Signature=fallback",
    sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a028.webp",
    printings: [
      {
        href: "/cards/yorinobu-arasaka-embracing-destruction?printing=%CE%B1001",
        printing: "α001",
        collectorNumber: "α001",
        finish: "standard",
        artist: "ADIA",
        isSelected: true,
      },
      {
        href: "/cards/yorinobu-arasaka-embracing-destruction?printing=%CE%B1031",
        printing: "α031",
        collectorNumber: "α031",
        finish: "foil",
        artist: "VINCENZO RICCARDI",
        isSelected: false,
      },
    ],
  });
});

test("normalizes raw labels, nullable legend stats, and program null power", async () => {
  const html = await readFixture("detail-page.html");
  const rawProgram = extractRawCardFromRouter(
    parseRouterState(extractTsrScript(loadDocument(html))!),
  );
  const normalizedProgram = normalizeCard(rawProgram);

  expect(normalizedProgram.type).toBe("program");
  expect(normalizedProgram.power).toBeNull();
  expect(normalizedProgram.printNumber).toBe("α028");
  expect(normalizedProgram.color).toBe("yellow");
  expect(normalizedProgram.hasSellTag).toBe(true);

  const rawLegend: RawCardRecord = {
    ...rawProgram,
    id: "legend-nullable",
    external_id: "cyberpunk:goro-takemura-vengeful-bodyguard",
    name: "Goro Takemura",
    subname: "Vengeful Bodyguard",
    display_name: "Goro Takemura - Vengeful Bodyguard",
    slug: "goro-takemura-vengeful-bodyguard",
    image_url: "https://example.com/goro.webp",
    source_image_url: "https://example.com/goro.webp",
    color: "Green",
    card_type: "Legend",
    is_eddiable: true,
    classifications: ["Arasaka", "Corpo"],
    keywords: ["Go Solo", "Blocker", "Call", "Play", "Attack", "Flip", "Unknown Highlight"],
    cost: null,
    power: null,
    ram: 2,
    artist: "Pandart Studio",
    print_number: "125",
    printings: [],
    selected_printing_id: null,
  };

  const normalizedLegend = normalizeCard(rawLegend);

  expect(normalizedLegend.type).toBe("legend");
  expect(normalizedLegend.cost).toBeNull();
  expect(normalizedLegend.power).toBeNull();
  expect(normalizedLegend.keywords).toEqual(["goSolo", "blocker"]);
  expect(normalizedLegend.timingTriggers).toEqual(["call", "play", "attack", "flip"]);
});

test("hydrates catalog cards from detail records so alternate printings are included", async () => {
  const html = await readFixture("detail-page.html");
  const rawProgram = extractRawCardFromRouter(
    parseRouterState(extractTsrScript(loadDocument(html))!),
  );
  const catalogProgram: RawCardRecord = {
    ...rawProgram,
    printings: [],
    selected_printing_id: null,
  };
  const detailProgram: RawCardRecord = {
    ...rawProgram,
    printings: [
      {
        id: "standard-printing",
        collector_number: "α028",
        image_url: "https://example.com/a028.webp?signature=standard",
        source_image_url: "https://example.com/a028.webp",
        set: rawProgram.set,
        rarity: null,
        finish: "standard",
        artist: "Miguel Valderrama",
      },
      {
        id: "foil-printing",
        collector_number: "α031",
        image_url: "https://example.com/a031.webp?signature=foil",
        source_image_url: "https://example.com/a031.webp",
        set: rawProgram.set,
        rarity: null,
        finish: "foil",
        artist: "Vincenzo Riccardi",
      },
    ],
    selected_printing_id: "standard-printing",
  };
  const requests: string[] = [];
  const fetchImpl = async (url: string | URL | Request) => {
    const requestUrl = url instanceof Request ? url.url : url.toString();
    requests.push(requestUrl);

    if (requestUrl.includes("/cards/cyberpunk?")) {
      return Response.json({
        items: [catalogProgram],
        total: 1,
      });
    }

    if (requestUrl.endsWith(`/cards/cyberpunk/${rawProgram.slug}`)) {
      return Response.json(detailProgram);
    }

    return new Response("not found", {
      status: 404,
      statusText: "Not Found",
    });
  };

  const rawCards = await fetchAllRawCards({
    apiBaseUrl: "https://example.test/api",
    tenantId: "test-tenant",
    fetchImpl: fetchImpl as typeof fetch,
  });

  expect(requests).toEqual([
    "https://example.test/api/cards/cyberpunk?limit=100&offset=0",
    `https://example.test/api/cards/cyberpunk/${rawProgram.slug}`,
  ]);
  expect(rawCards).toHaveLength(1);
  expect(rawCards[0]?.printings.map((printing) => printing.collector_number)).toEqual([
    "α028",
    "α031",
  ]);
  expect(rawCards[0]?.selected_printing_id).toBe("standard-printing");
});

test("preserves stable card ids when refreshed API records change ids", async () => {
  const html = await readFixture("detail-page.html");
  const rawProgram = extractRawCardFromRouter(
    parseRouterState(extractTsrScript(loadDocument(html))!),
  );
  const refreshedRaw = {
    ...rawProgram,
    id: "refreshed-api-id",
  };
  const refreshedCard = {
    ...normalizeCard(refreshedRaw),
    id: "refreshed-api-id",
  };
  const existingRaw = {
    ...rawProgram,
    id: "stable-local-id",
  };
  const existingCard = {
    ...normalizeCard(existingRaw),
    id: "stable-local-id",
  };

  const snapshot = preserveStableCardIds(
    {
      rawCards: [refreshedRaw],
      cards: [refreshedCard],
    },
    {
      rawCards: [existingRaw],
      cards: [existingCard],
    },
  );

  expect(snapshot.rawCards[0]?.id).toBe("stable-local-id");
  expect(snapshot.cards[0]?.id).toBe("stable-local-id");
});
