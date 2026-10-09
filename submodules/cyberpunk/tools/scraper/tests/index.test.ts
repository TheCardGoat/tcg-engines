import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test, vi } from "vite-plus/test";

import type { RawCardRecord } from "@tcg/cyberpunk-types";

vi.mock("@tcg/cyberpunk-cards", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tcg/cyberpunk-cards")>();
  return {
    ...actual,
    getCyberpunkArtIdForPrinting: (printingId: string) =>
      printingId === "2fea8070-6006-465c-9055-2fc9860467f3"
        ? printingId
        : actual.getCyberpunkArtIdForPrinting(printingId),
  };
});

import {
  attachCardFaqs,
  deduplicateRawCardsById,
  extractCatalogSlugsFromRouter,
  extractDetailFallbackFields,
  extractRawCardFromRouter,
  extractTsrScript,
  fetchAllRawCards,
  fetchCardFaqs,
  foldAccentMangledSlug,
  formatGeneratedCardsModule,
  loadDocument,
  normalizeCard,
  parseRouterState,
  preserveStableCardIds,
  refreshCatalogFaqsOnly,
  scrapeCatalog,
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
  expect(rawCard.rulings).toHaveLength(2);
  expect(rawCard.rulings?.[0]).toMatchObject({
    kind: "faq",
    question: "Can I increase a Gig by less than 3?",
    answer: "Yes. You may increase it by 0, 1, 2, or 3.",
    language_code: "en",
    card_printing_id: null,
  });
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
  expect(normalizedProgram.rulings).toEqual([
    {
      id: "faq-1",
      kind: "faq",
      question: "Can I increase a Gig by less than 3?",
      answer: "Yes. You may increase it by 0, 1, 2, or 3.",
      languageCode: "en",
      cardPrintingId: null,
      source: null,
      rulingDate: null,
    },
    {
      id: "errata-1",
      kind: "errata",
      question: null,
      answer: "Use the updated rules text.",
      languageCode: "en",
      cardPrintingId: rawProgram.printings[0]?.id,
      source: "Official card database",
      rulingDate: "2026-09-01",
    },
  ]);
  expect(normalizedProgram.imageUrl).toBe(
    "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a028.webp",
  );
  expect("sourceImageUrl" in normalizedProgram).toBe(false);
  expect(normalizedProgram.printings[0]).toMatchObject({
    id: rawProgram.printings[0]?.id,
    artId: rawProgram.printings[0]?.id,
    collectorNumber: "α028",
    setCode: "alpha",
    rarity: "",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a028.webp",
  });
  expect(
    normalizedProgram.printings.some((printing) =>
      ["sourceImageUrl", "set", "finish", "artist"].some((field) => field in printing),
    ),
  ).toBe(false);

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
  expect(rawCards[0]?.rulings?.map((ruling) => ruling.kind)).toEqual(["faq", "errata"]);
});

test("loads the separately published card FAQ feed and attaches it to the card", async () => {
  const html = await readFixture("detail-page.html");
  const rawCard = extractRawCardFromRouter(parseRouterState(extractTsrScript(loadDocument(html))!));
  const faq = {
    id: "official-faq-1",
    scope: "card",
    question: "When does this happen?",
    answer: "Before the fight.",
    sort_order: 100,
    published_at: "2026-09-04T22:57:19.946Z",
    card: { external_id: rawCard.external_id, slug: rawCard.slug },
  };
  const earlierFaq = {
    ...faq,
    id: "official-faq-earlier",
    sort_order: 50,
    question: "Which ruling comes first?",
    answer: "This one.",
  };
  const requests: string[] = [];
  const fetchImpl = async (url: string | URL | Request) => {
    const requestUrl = url instanceof Request ? url.url : url.toString();
    requests.push(requestUrl);
    if (requestUrl.includes("/cards/cyberpunk?")) {
      return Response.json({ items: [rawCard], total: 1 });
    }
    if (requestUrl.endsWith(`/cards/cyberpunk/${rawCard.slug}`)) {
      return Response.json({ ...rawCard, rulings: [] });
    }
    if (requestUrl.endsWith("/faqs/cyberpunk?scope=card")) {
      return Response.json({ items: [faq, earlierFaq], total: 2 });
    }
    return new Response("not found", { status: 404 });
  };
  const options = {
    apiBaseUrl: "https://example.test/api",
    tenantId: "test-tenant",
    fetchImpl: fetchImpl as typeof fetch,
  };
  const snapshot = await scrapeCatalog(options);

  expect(requests).toContain("https://example.test/api/faqs/cyberpunk?scope=card");
  expect(snapshot.rawCards[0]?.rulings?.map((ruling) => ruling.id)).toEqual([
    earlierFaq.id,
    faq.id,
  ]);
  expect(snapshot.rawCards[0]?.rulings?.[1]).toMatchObject({
    kind: "faq",
    question: faq.question,
    answer: faq.answer,
    language_code: "en",
    card_printing_id: null,
    ruling_date: faq.published_at,
  });
  expect(snapshot.cards[0]?.rulings?.[0]?.answer).toBe(earlierFaq.answer);

  const incompleteFaqFetch = async (url: string | URL | Request) => {
    const requestUrl = url instanceof Request ? url.url : url.toString();
    if (requestUrl.endsWith("/faqs/cyberpunk?scope=card")) {
      return Response.json({ items: [faq], total: 2 });
    }
    return fetchImpl(url);
  };
  await expect(
    fetchCardFaqs({ ...options, fetchImpl: incompleteFaqFetch as typeof fetch }),
  ).rejects.toThrow("Card FAQ feed is incomplete");
});

test("replaces stale general FAQs while keeping printing-specific detail rulings", async () => {
  const html = await readFixture("detail-page.html");
  const rawCard = extractRawCardFromRouter(parseRouterState(extractTsrScript(loadDocument(html))!));
  const freshFaq = {
    id: "new-faq",
    kind: "faq" as const,
    question: "What changed?",
    answer: "The ruling was updated.",
    language_code: "en",
    card_printing_id: null,
    source: null,
    ruling_date: null,
  };
  const [updated] = attachCardFaqs([rawCard], new Map([[rawCard.external_id, [freshFaq]]]));

  expect(updated?.rulings?.map((ruling) => ruling.id)).toEqual(["errata-1", "new-faq"]);
  expect(rawCard.rulings?.map((ruling) => ruling.id)).toEqual(["faq-1", "errata-1"]);
});

test("attaches a FAQ from a sibling record to the canonical card row", async () => {
  const html = await readFixture("detail-page.html");
  const card = extractRawCardFromRouter(parseRouterState(extractTsrScript(loadDocument(html))!));
  const canonical: RawCardRecord = {
    ...card,
    external_id: "retail-card",
    set: { code: "welcometonightcityretail", name: "Retail" },
    rulings: [],
  };
  const sibling: RawCardRecord = {
    ...card,
    external_id: "older-card",
    set: { code: "alpha", name: "Alpha" },
    rulings: [],
  };
  const faq = {
    id: "sibling-faq",
    kind: "faq" as const,
    question: "Does this work?",
    answer: "Yes.",
    language_code: "en",
    card_printing_id: null,
    source: null,
    ruling_date: null,
  };
  const [retail, alpha] = attachCardFaqs(
    [canonical, sibling],
    new Map([[sibling.external_id, [faq]]]),
  );
  expect(retail?.rulings?.map((entry) => entry.id)).toEqual([faq.id]);
  expect(alpha?.rulings).toBeUndefined();
});

test("FAQ-only refresh preserves card data and replaces only rulings", async () => {
  const html = await readFixture("detail-page.html");
  const card = extractRawCardFromRouter(parseRouterState(extractTsrScript(loadDocument(html))!));
  const snapshot = { rawCards: [card], cards: [normalizeCard(card)] };
  const faq = {
    id: "fresh-faq",
    kind: "faq" as const,
    question: "What changed?",
    answer: "The FAQ.",
    language_code: "en",
    card_printing_id: null,
    source: null,
    ruling_date: null,
  };
  const refreshed = refreshCatalogFaqsOnly(snapshot, new Map([[card.external_id, [faq]]]));
  expect(refreshed.rawCards[0]?.rulings?.map((entry) => entry.id)).toEqual(["errata-1", faq.id]);
  expect(refreshed.cards[0]?.rulings?.map((entry) => entry.id)).toEqual(["errata-1", faq.id]);
  const { rulings: beforeRulings, ...beforeCard } = snapshot.cards[0]!;
  const { rulings: afterRulings, ...afterCard } = refreshed.cards[0]!;
  expect(afterCard).toEqual(beforeCard);
  expect(beforeRulings).not.toEqual(afterRulings);
});

test("the official-site fallback keeps detail rulings when the FAQ API is unavailable", async () => {
  const html = await readFixture("detail-page.html");
  const rawCard = extractRawCardFromRouter(parseRouterState(extractTsrScript(loadDocument(html))!));
  const fetchImpl = async (url: string | URL | Request) => {
    const requestUrl = url instanceof Request ? url.url : url.toString();
    if (requestUrl.startsWith("https://api.netdeck.gg/"))
      return new Response("unavailable", { status: 503 });
    if (requestUrl.endsWith("/cards"))
      return new Response(`<a href="/cards/${rawCard.slug}">${rawCard.name}</a>`);
    return new Response(html);
  };
  const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
  try {
    const snapshot = await scrapeCatalog({ fetchImpl: fetchImpl as typeof fetch });
    expect(snapshot.rawCards[0]?.rulings?.map((entry) => entry.id)).toContain("faq-1");
    expect(warning).toHaveBeenCalledWith(expect.stringContaining("FAQ feed unavailable"));
  } finally {
    warning.mockRestore();
  }
});

test("keeps FAQs from duplicate card records in the generated catalog", async () => {
  const html = await readFixture("detail-page.html");
  const rawCard = extractRawCardFromRouter(parseRouterState(extractTsrScript(loadDocument(html))!));
  const duplicate: RawCardRecord = {
    ...rawCard,
    set: { code: "spoiler", name: "Spoiler" },
    rulings: [
      {
        id: "faq-2",
        kind: "faq",
        question: "Does this apply to each printing?",
        answer: "Yes.",
        language_code: "en",
        card_printing_id: null,
        source: null,
        ruling_date: null,
      },
    ],
  };
  const [merged] = deduplicateRawCardsById([rawCard, duplicate]);

  expect(merged?.rulings?.map((ruling) => ruling.id)).toEqual(["faq-1", "errata-1", "faq-2"]);

  const moduleText = formatGeneratedCardsModule({
    rawCards: [merged!],
    cards: [normalizeCard(merged!)],
  });
  expect(moduleText).toContain('question: "Does this apply to each printing?"');
  expect(moduleText).toContain('cardPrintingId: "fb096d3f-48eb-47c0-a065-81b39691e12f"');
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

test("keeps upstream slugs untouched for names without diacritics", async () => {
  const html = await readFixture("detail-page.html");
  const rawCard = extractRawCardFromRouter(parseRouterState(extractTsrScript(loadDocument(html))!));

  expect(foldAccentMangledSlug(rawCard).slug).toBe(rawCard.slug);
});

test("folds accent-mangled upstream slugs onto the canonical slugify of the display name", async () => {
  const html = await readFixture("detail-page.html");
  const rawCard = extractRawCardFromRouter(parseRouterState(extractTsrScript(loadDocument(html))!));

  // Upstream slugifier turned the combining acute in "Matón" into a hyphen.
  const folded = foldAccentMangledSlug({
    ...rawCard,
    slug: "gilded-mato-n",
    name: "Gilded Matón",
    display_name: "Gilded Matón",
  });

  expect(folded.slug).toBe("gilded-maton");
});
