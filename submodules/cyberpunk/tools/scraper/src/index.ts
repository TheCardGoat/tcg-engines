import vm from "node:vm";

import { load, type CheerioAPI } from "cheerio";

import type {
  CardDefinition,
  CardKeyword,
  CardPrinting,
  CardSet,
  PrintFinish,
  RawCardColor,
  RawCardPrinting,
  RawCardRecord,
  RawCardType,
  RawHighlightedLabel,
  TimingTrigger,
} from "@tcg/cyberpunk-types";

export const CYBERPUNK_TCG_BASE_URL = "https://cyberpunktcg.com";
export const NETDECK_API_BASE_URL = "https://api.netdeck.gg/api";
export const CYBERPUNK_TENANT_ID = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
export const CDN_BASE_URL = "https://r2.tcg.online/public/cyberpunk/cards";

const TSR_SCRIPT_SELECTOR = 'script[id="$tsr-stream-barrier"]';
const DEFAULT_PAGE_SIZE = 100;
type NodeSelection = ReturnType<CheerioAPI>;

const RAW_COLOR_MAP = {
  Blue: "blue",
  Green: "green",
  Red: "red",
  Yellow: "yellow",
} as const satisfies Record<RawCardColor, CardDefinition["color"]>;

const RAW_TYPE_MAP = {
  Gear: "gear",
  Legend: "legend",
  Program: "program",
  Unit: "unit",
} as const satisfies Record<RawCardType, CardDefinition["type"]>;

const RAW_TRIGGER_MAP = {
  Attack: "attack",
  Call: "call",
  Flip: "flip",
  Play: "play",
} as const satisfies Record<string, TimingTrigger>;

const RAW_KEYWORD_MAP = {
  Blocker: "blocker",
  "Go Solo": "goSolo",
} as const satisfies Record<string, CardKeyword>;

const RAW_COLOR_VALUES = new Set<RawCardColor>(Object.keys(RAW_COLOR_MAP) as RawCardColor[]);
const RAW_TYPE_VALUES = new Set<RawCardType>(Object.keys(RAW_TYPE_MAP) as RawCardType[]);
const CANONICAL_CLASSIFICATIONS = [
  "Aldecado",
  "Arasaka",
  "Braindance",
  "Corpo",
  "Cyberware",
  "Doll",
  "Drone",
  "Extreme",
  "Ganger",
  "Implant",
  "Maelstrom",
  "Merc",
  "Militech",
  "Mox",
  "Mystic",
  "NCPD",
  "Netrunner",
  "Nomad",
  "Overclocking",
  "Plan",
  "Quickhack",
  "Ripperdoc",
  "Rockerboy",
  "Samurai",
  "Tech",
  "Vehicle",
  "Voodoo Boys",
  "Weapon",
  "Zetatech",
];
const CANONICAL_CLASSIFICATION_MAP = new Map(
  CANONICAL_CLASSIFICATIONS.map((classification) => [classification.toUpperCase(), classification]),
);

export interface ScrapeCatalogOptions {
  apiBaseUrl?: string;
  tenantId?: string;
  fetchImpl?: typeof fetch;
}

export interface ScrapedCatalogSnapshot {
  rawCards: RawCardRecord[];
  cards: CardDefinition[];
}

export interface DetailFallbackFields {
  slug: string;
  name: string | null;
  subname: string | null;
  displayName: string | null;
  color: RawCardColor | null;
  cardType: RawCardType | null;
  classifications: string[];
  keywords: RawHighlightedLabel[];
  cost: number | null;
  power: number | null;
  ram: number | null;
  rulesText: string | null;
  setName: string | null;
  setCode: string | null;
  printNumber: string | null;
  artist: string | null;
  imageUrl: string | null;
  sourceImageUrl: string | null;
  printings: DetailFallbackPrinting[];
}

export interface DetailFallbackPrinting {
  href: string;
  printing: string | null;
  collectorNumber: string;
  finish: PrintFinish;
  artist: string;
  isSelected: boolean;
}

export function loadDocument(html: string): CheerioAPI {
  return load(html);
}

export function extractTsrScript($: CheerioAPI): string | null {
  const script = $(TSR_SCRIPT_SELECTOR).last().html();
  const text = script?.trim();

  return text ? text : null;
}

export function parseRouterState(scriptText: string): Record<string, unknown> {
  const context: Record<string, unknown> = {
    console,
    document: {
      querySelectorAll() {
        return [];
      },
    },
    history: {
      state: {},
    },
    sessionStorage: {
      getItem() {
        return null;
      },
      removeItem() {},
      setItem() {},
    },
  };

  context.self = context;
  context.window = context;

  vm.runInNewContext(scriptText, context, {
    timeout: 1_000,
  });

  const tsrState = context.$_TSR;

  if (!isRecord(tsrState) || !isRecord(tsrState.router)) {
    throw new Error("TSR router state was not created by the extracted script.");
  }

  return tsrState.router;
}

export function extractCatalogSlugsFromRouter(router: unknown): string[] {
  const items = extractCatalogItemsFromRouter(router);
  const slugs = new Set<string>();

  for (const [index, item] of items.entries()) {
    const record = requireRecord(item, `catalog item ${index}`);
    slugs.add(requireString(record.slug, `catalog item ${index}.slug`));
  }

  return [...slugs].sort((left, right) => left.localeCompare(right));
}

export function extractCatalogSlugsFromDocument($: CheerioAPI): string[] {
  const slugs = new Set<string>();

  $('a[href^="/cards/"]').each((_, element) => {
    const href = $(element).attr("href");
    const match = href?.match(/^\/cards\/([^/?#]+)$/);

    if (match?.[1]) {
      slugs.add(match[1]);
    }
  });

  return [...slugs].sort((left, right) => left.localeCompare(right));
}

export function extractRawCardFromRouter(router: unknown): RawCardRecord {
  const matches = getRouterMatches(router);

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const match = requireRecord(matches[index], `router.matches[${index}]`);
    const data = match.l;

    if (!isRecord(data)) {
      continue;
    }

    if ("external_id" in data && "slug" in data && "card_type" in data) {
      return coerceRawCardRecord(data, `router.matches[${index}].l`);
    }
  }

  throw new Error("No raw card record was found in the TSR router state.");
}

export function extractDetailFallbackFields($: CheerioAPI): DetailFallbackFields {
  const heading = $("h1").first();
  const infoColumn = heading.closest("div.space-y-6");
  const headingBlock = infoColumn.find("div.flex.items-start.justify-between.gap-4").first();

  const name = readNodeText(heading);
  const subname = readNodeText(heading.siblings("p").first());
  const displayName = name ? (subname ? `${name} - ${subname}` : name) : null;

  const description = readAttribute($('meta[name="description"]').first(), "content");
  const metaCardInfo = parseMetaDescription(description);
  const typeText = readNodeText(headingBlock.find("span.chip-cyber").first());

  const rulesLabel = findFirstNodeByText($, infoColumn, "div.hud-label", (text) => {
    return text === "RULES TEXT";
  });
  const rulesText = readNodeText(rulesLabel.next("div"));

  const keywordLabel = findFirstNodeByText($, infoColumn, "div.hud-label", (text) => {
    return text.startsWith("KEYWORDS:");
  });
  const keywordText = readNodeText(keywordLabel);
  const keywords = parseKeywordLine(keywordText);

  const setValue = readLabeledValue($, "SET:");
  const { setCode, setName } = parseSetLine(setValue);

  const imageUrl =
    readAttribute($('meta[property="og:image"]').first(), "content") ??
    readAttribute($("div.aspect-card img, div.relative.aspect-card img").first(), "src");

  return {
    slug: slugFromCanonicalUrl(readCanonicalUrl($)),
    name,
    subname,
    displayName,
    color: metaCardInfo.color,
    cardType: parseRawCardType(typeText ?? metaCardInfo.cardType),
    classifications: readClassificationTexts($, infoColumn),
    keywords,
    cost: readStatValue($, infoColumn, "COST"),
    power: readStatValue($, infoColumn, "PWR"),
    ram: readStatValue($, infoColumn, "RAM"),
    rulesText,
    setName,
    setCode,
    printNumber: readLabeledValue($, "NUMBER:"),
    artist: readLabeledValue($, "ILLUSTRATED BY:"),
    imageUrl,
    sourceImageUrl: imageUrl ? stripUrlQuery(imageUrl) : null,
    printings: extractDetailFallbackPrintings($),
  };
}

export function extractDetailFallbackPrintings($: CheerioAPI): DetailFallbackPrinting[] {
  const printingsLabel = findFirstNodeByText($, $("body"), "div.hud-label-xs", (text) => {
    return /^\d+\s+PRINTINGS$/.test(text);
  });

  if (!printingsLabel.length) {
    return [];
  }

  const printings: DetailFallbackPrinting[] = [];

  printingsLabel
    .parent()
    .find('a[href^="/cards/"][href*="printing="]')
    .each((_, element) => {
      const link = $(element);
      const href = readAttribute(link, "href");
      const chip = link.find("span.chip-cyber").first();
      const chipText = readNodeText(chip);
      const parsedChip = parsePrintingChipText(chipText);
      const artist = readNodeText(link.find("span.hud-label-xs").last());

      if (!href || !parsedChip || !artist) {
        return;
      }

      printings.push({
        href,
        printing: parsePrintingQueryValue(href),
        collectorNumber: parsedChip.collectorNumber,
        finish: parsedChip.finish,
        artist,
        isSelected:
          link.attr("aria-current") === "page" ||
          link.attr("data-status") === "active" ||
          (link.attr("class") ?? "").split(/\s+/).includes("active") ||
          (chip.attr("class") ?? "").split(/\s+/).includes("chip-filled"),
      });
    });

  return printings;
}

export function normalizeCard(rawCard: RawCardRecord): CardDefinition {
  const timingTriggers: TimingTrigger[] = [];
  const keywords: CardKeyword[] = [];

  for (const label of rawCard.keywords) {
    const rawLabel = String(label);

    if (rawLabel in RAW_TRIGGER_MAP) {
      pushUnique(timingTriggers, RAW_TRIGGER_MAP[rawLabel as keyof typeof RAW_TRIGGER_MAP]);
      continue;
    }

    if (rawLabel in RAW_KEYWORD_MAP) {
      pushUnique(keywords, RAW_KEYWORD_MAP[rawLabel as keyof typeof RAW_KEYWORD_MAP]);
    }
  }

  const setCode = rawCard.set.code.toLowerCase();
  const sourceImageUrl = rawCard.source_image_url;
  const cdnImageUrl = buildCdnImageUrl(sourceImageUrl, setCode);

  const baseCard = {
    id: rawCard.id,
    externalId: rawCard.external_id,
    slug: rawCard.slug,
    name: rawCard.name,
    subname: rawCard.subname,
    displayName: rawCard.display_name,
    rulesText: rawCard.rules_text,
    flavorText: rawCard.flavor_text,
    description: rawCard.description,
    youtubeUrl: rawCard.youtube_url,
    sourceUrl: rawCard.source_url,
    color: RAW_COLOR_MAP[rawCard.color],
    classifications: [...rawCard.classifications],
    set: normalizeSet(rawCard.set),
    printNumber: rawCard.print_number,
    printings: rawCard.printings.map(normalizePrinting),
    selectedPrintingId: rawCard.selected_printing_id,
    artist: rawCard.artist,
    imageUrl: cdnImageUrl,
    sourceImageUrl,
    rarity: rawCard.rarity,
    legality: rawCard.legality,
    hasSellTag: rawCard.is_eddiable,
    ram: rawCard.ram,
    timingTriggers,
    keywords,
  };

  switch (rawCard.card_type) {
    case "Legend":
      return {
        ...baseCard,
        type: "legend",
        cost: rawCard.cost,
        power: rawCard.power,
      };
    case "Unit":
      return {
        ...baseCard,
        type: "unit",
        cost: requireNumber(rawCard.cost, `${rawCard.slug}.cost`),
        power: requireNumber(rawCard.power, `${rawCard.slug}.power`),
      };
    case "Gear":
      return {
        ...baseCard,
        type: "gear",
        cost: requireNumber(rawCard.cost, `${rawCard.slug}.cost`),
        power: requireNumber(rawCard.power, `${rawCard.slug}.power`),
      };
    case "Program":
      if (rawCard.power !== null) {
        throw new Error(
          `Expected program ${rawCard.slug} to have null power, received ${rawCard.power}.`,
        );
      }

      return {
        ...baseCard,
        type: "program",
        cost: requireNumber(rawCard.cost, `${rawCard.slug}.cost`),
        power: null,
      };
  }
}

export async function fetchCatalogSlugs(options: ScrapeCatalogOptions = {}): Promise<string[]> {
  const apiBaseUrl = options.apiBaseUrl ?? NETDECK_API_BASE_URL;
  const tenantId = options.tenantId ?? CYBERPUNK_TENANT_ID;
  const fetchImpl = options.fetchImpl ?? fetch;
  const slugs: string[] = [];
  let offset = 0;

  for (;;) {
    const url = `${apiBaseUrl}/cards/cyberpunk?limit=${DEFAULT_PAGE_SIZE}&offset=${offset}`;
    const response = await fetchJson<{ items: unknown[]; total: number }>(url, fetchImpl, tenantId);

    for (const [index, item] of response.items.entries()) {
      const record = requireRecord(item, `cards[${offset + index}]`);
      slugs.push(requireString(record.slug, `cards[${offset + index}].slug`));
    }

    offset += response.items.length;

    if (offset >= response.total || response.items.length === 0) {
      break;
    }
  }

  return slugs.sort((left, right) => left.localeCompare(right));
}

export async function fetchAllRawCards(
  options: ScrapeCatalogOptions = {},
): Promise<RawCardRecord[]> {
  const apiBaseUrl = options.apiBaseUrl ?? NETDECK_API_BASE_URL;
  const tenantId = options.tenantId ?? CYBERPUNK_TENANT_ID;
  const fetchImpl = options.fetchImpl ?? fetch;
  const catalogCards: RawCardRecord[] = [];
  let offset = 0;

  for (;;) {
    const url = `${apiBaseUrl}/cards/cyberpunk?limit=${DEFAULT_PAGE_SIZE}&offset=${offset}`;
    const response = await fetchJson<{ items: unknown[]; total: number }>(url, fetchImpl, tenantId);

    for (const [index, item] of response.items.entries()) {
      catalogCards.push(coerceRawCardRecord(item, `cards[${offset + index}]`));
    }

    offset += response.items.length;

    if (offset >= response.total || response.items.length === 0) {
      break;
    }
  }

  return Promise.all(catalogCards.map((card) => fetchRawCard(card.slug, options)));
}

export async function fetchRawCard(
  slug: string,
  options: ScrapeCatalogOptions = {},
): Promise<RawCardRecord> {
  const apiBaseUrl = options.apiBaseUrl ?? NETDECK_API_BASE_URL;
  const tenantId = options.tenantId ?? CYBERPUNK_TENANT_ID;
  const fetchImpl = options.fetchImpl ?? fetch;
  const url = `${apiBaseUrl}/cards/cyberpunk/${encodeURIComponent(slug)}`;
  const data = await fetchJson<unknown>(url, fetchImpl, tenantId);

  return coerceRawCardRecord(data, `card:${slug}`);
}

export async function scrapeCatalog(
  options: ScrapeCatalogOptions = {},
): Promise<ScrapedCatalogSnapshot> {
  const rawCards = await fetchAllRawCards(options);

  rawCards.sort((left, right) => left.slug.localeCompare(right.slug));

  assertUnique(rawCards, "id", (card) => card.id);
  assertUnique(rawCards, "external_id", (card) => card.external_id);
  assertUnique(rawCards, "slug", (card) => card.slug);

  const cards = rawCards.map(normalizeCard);

  assertUnique(cards, "id", (card) => card.id);
  assertUnique(cards, "externalId", (card) => card.externalId);
  assertUnique(cards, "slug", (card) => card.slug);

  return {
    rawCards,
    cards,
  };
}

export function formatGeneratedCardsModule(snapshot: ScrapedCatalogSnapshot): string {
  const rawCardsJson = JSON.stringify(snapshot.rawCards, null, 2);
  const cardsJson = JSON.stringify(snapshot.cards, null, 2);

  return `// This file is generated by @tcg/cyberpunk-scraper. Do not edit manually.
import type { CardDefinition, RawCardRecord } from "@tcg/cyberpunk-types";

export const rawCards = ${rawCardsJson} satisfies RawCardRecord[];

export const cards = ${cardsJson} satisfies CardDefinition[];
`;
}

export function preserveStableCardIds(
  snapshot: ScrapedCatalogSnapshot,
  existingSnapshot: ScrapedCatalogSnapshot,
): ScrapedCatalogSnapshot {
  const rawIds = buildStableIdMap(existingSnapshot.rawCards, rawCardIdentityKeys);
  const cardIds = buildStableIdMap(existingSnapshot.cards, cardIdentityKeys);

  return {
    rawCards: snapshot.rawCards.map((card) => {
      return {
        ...card,
        id: readStableId(rawIds, rawCardIdentityKeys(card)) ?? card.id,
      };
    }),
    cards: snapshot.cards.map((card) => {
      return {
        ...card,
        id: readStableId(cardIds, cardIdentityKeys(card)) ?? card.id,
      };
    }),
  };
}

function extractCatalogItemsFromRouter(router: unknown): unknown[] {
  const matches = getRouterMatches(router);

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const match = requireRecord(matches[index], `router.matches[${index}]`);
    const data = match.l;

    if (!isRecord(data)) {
      continue;
    }

    const results = data.results;

    if (isRecord(results) && Array.isArray(results.items)) {
      return results.items;
    }

    if (Array.isArray(data.cards)) {
      return data.cards;
    }
  }

  throw new Error("No catalog items array was found in the TSR router state.");
}

function getRouterMatches(router: unknown): unknown[] {
  const record = requireRecord(router, "router");

  if (!Array.isArray(record.matches)) {
    throw new Error("TSR router state did not include a matches array.");
  }

  return record.matches;
}

function normalizeSet(rawSet: { code: string; name: string }): CardSet {
  return {
    code: rawSet.code as CardSet["code"],
    name: rawSet.name,
  };
}

function buildStableIdMap<T extends { id: string }>(
  cards: readonly T[],
  readKeys: (card: T) => string[],
): Map<string, string> {
  const ids = new Map<string, string>();

  for (const card of cards) {
    for (const key of readKeys(card)) {
      if (!ids.has(key)) {
        ids.set(key, card.id);
      }
    }
  }

  return ids;
}

function readStableId(ids: ReadonlyMap<string, string>, keys: readonly string[]): string | null {
  for (const key of keys) {
    const id = ids.get(key);

    if (id) {
      return id;
    }
  }

  return null;
}

function rawCardIdentityKeys(card: RawCardRecord): string[] {
  return [
    `slug:${card.slug}`,
    `external:${card.external_id}`,
    `display:${card.display_name}`,
    `name:${card.set.code}:${card.card_type}:${card.name}`,
  ];
}

function cardIdentityKeys(card: CardDefinition): string[] {
  return [
    `slug:${card.slug}`,
    `external:${card.externalId}`,
    `display:${card.displayName}`,
    `name:${card.set.code}:${card.type}:${card.name}`,
  ];
}

function normalizePrinting(rawPrinting: RawCardPrinting): CardPrinting {
  const setCode = rawPrinting.set.code.toLowerCase();
  const cdnImageUrl = buildCdnImageUrl(rawPrinting.source_image_url, setCode);

  return {
    id: rawPrinting.id,
    collectorNumber: rawPrinting.collector_number,
    imageUrl: cdnImageUrl,
    sourceImageUrl: rawPrinting.source_image_url,
    set: normalizeSet(rawPrinting.set),
    rarity: rawPrinting.rarity ?? null,
    finish: rawPrinting.finish,
    artist: rawPrinting.artist,
  };
}

async function fetchJson<TResult>(
  url: string,
  fetchImpl: typeof fetch,
  tenantId: string,
): Promise<TResult> {
  const response = await fetchImpl(url, {
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed for ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<TResult>;
}

function assertUnique<T>(items: readonly T[], label: string, readValue: (item: T) => string) {
  const seen = new Set<string>();

  for (const item of items) {
    const value = readValue(item);

    if (seen.has(value)) {
      throw new Error(`Duplicate ${label} detected: ${value}`);
    }

    seen.add(value);
  }
}

function parseMetaDescription(description: string | null): {
  color: RawCardColor | null;
  cardType: RawCardType | null;
} {
  if (!description) {
    return {
      color: null,
      cardType: null,
    };
  }

  const match = description.match(/,\s+a\s+([A-Za-z]+)\s+([A-Za-z]+),/);

  return {
    color: parseRawCardColor(match?.[1] ?? null),
    cardType: parseRawCardType(match?.[2] ?? null),
  };
}

function readClassificationTexts($: CheerioAPI, infoColumn: NodeSelection): string[] {
  const classifications: string[] = infoColumn
    .children("div")
    .eq(1)
    .find("span.chip-cyber")
    .toArray()
    .map((element) => canonicalizeClassification(normalizeText($(element).text())))
    .filter((value) => value.length > 0);

  return [...new Set(classifications)];
}

function parseKeywordLine(text: string | null): RawHighlightedLabel[] {
  if (!text) {
    return [];
  }

  const [, valueText] = text.split("KEYWORDS:");

  if (!valueText) {
    return [];
  }

  return valueText
    .split(",")
    .map((part) => normalizeText(part))
    .filter(Boolean);
}

function parsePrintingChipText(text: string | null): {
  collectorNumber: string;
  finish: PrintFinish;
} | null {
  if (!text) {
    return null;
  }

  const match = normalizeText(text).match(/^(.+?)\s+([A-Za-z]+)$/);

  if (!match) {
    return null;
  }

  const finish = parsePrintFinish(match[2]);

  if (!finish) {
    return null;
  }

  return {
    collectorNumber: normalizeCollectorNumber(match[1]),
    finish,
  };
}

function parsePrintFinish(value: string): PrintFinish | null {
  const normalizedValue = value.toLowerCase();

  return normalizedValue === "foil" || normalizedValue === "standard" ? normalizedValue : null;
}

function parsePrintingQueryValue(href: string): string | null {
  try {
    const printing = new URL(href, CYBERPUNK_TCG_BASE_URL).searchParams.get("printing");

    return printing ? normalizeCollectorNumber(printing) : null;
  } catch {
    return null;
  }
}

function normalizeCollectorNumber(value: string): string {
  return normalizeText(value).replace(/^Α/, "α");
}

function readCanonicalUrl($: CheerioAPI): string | null {
  return readAttribute($('link[rel="canonical"]').first(), "href");
}

function slugFromCanonicalUrl(url: string | null): string {
  if (!url) {
    return "";
  }

  const match = url.match(/\/cards\/([^/?#]+)/);

  return match?.[1] ?? "";
}

function stripUrlQuery(url: string): string {
  const [withoutQuery] = url.split("?");
  return withoutQuery;
}

function buildCdnImageUrl(sourceImageUrl: string, setCode: string): string {
  const filename = sourceImageUrl.split("/").pop();
  return `${CDN_BASE_URL}/${setCode}/${filename}`;
}

function readLabeledValue($: CheerioAPI, label: string): string | null {
  const labelNode = findFirstNodeByText($, $("body"), "span.text-muted-foreground", (text) => {
    return text === label;
  });

  const valueNode = labelNode.parent().find("span.font-medium").first();
  return readNodeText(valueNode);
}

function parseSetLine(value: string | null): {
  setCode: string | null;
  setName: string | null;
} {
  if (!value) {
    return {
      setCode: null,
      setName: null,
    };
  }

  const match = value.match(/^(.*?)\s*\((.*?)\)$/);

  if (!match) {
    return {
      setCode: null,
      setName: value,
    };
  }

  return {
    setCode: match[2].trim().toLowerCase(),
    setName: match[1].trim(),
  };
}

function readStatValue($: CheerioAPI, scope: NodeSelection, label: string): number | null {
  const labelNode = findFirstNodeByText($, scope, "span.hud-label", (text) => {
    return text === label;
  });

  if (!labelNode.length) {
    return null;
  }

  const siblingLabels: string[] = labelNode
    .parent()
    .find("span.hud-label")
    .toArray()
    .map((element) => normalizeText($(element).text()))
    .filter((value) => value.length > 0);

  for (let index = siblingLabels.length - 1; index >= 0; index -= 1) {
    const value = parseOptionalNumber(siblingLabels[index]);

    if (value !== null) {
      return value;
    }
  }

  return null;
}

function coerceRawCardRecord(value: unknown, context: string): RawCardRecord {
  const record = requireRecord(value, context);

  return {
    id: requireString(record.id, `${context}.id`),
    external_id: requireString(record.external_id, `${context}.external_id`),
    name: requireString(record.name, `${context}.name`),
    subname: requireNullableString(record.subname, `${context}.subname`),
    display_name: requireString(record.display_name, `${context}.display_name`),
    slug: requireString(record.slug, `${context}.slug`),
    rules_text: requireNullableString(record.rules_text, `${context}.rules_text`),
    flavor_text: requireNullableString(record.flavor_text, `${context}.flavor_text`),
    description: readOptionalNullableString(record.description, `${context}.description`),
    youtube_url: readOptionalNullableString(record.youtube_url, `${context}.youtube_url`),
    source_url: readOptionalNullableString(record.source_url, `${context}.source_url`),
    set: coerceRawSet(record.set, `${context}.set`),
    rarity: requireNullableString(record.rarity, `${context}.rarity`),
    image_url: requireString(record.image_url, `${context}.image_url`),
    source_image_url: requireString(record.source_image_url, `${context}.source_image_url`),
    color: requireRawCardColor(record.color, `${context}.color`),
    card_type: requireRawCardType(record.card_type, `${context}.card_type`),
    is_eddiable: requireBoolean(record.is_eddiable, `${context}.is_eddiable`),
    classifications: requireStringArray(record.classifications, `${context}.classifications`),
    keywords: requireStringArray(record.keywords, `${context}.keywords`),
    cost: requireNullableNumber(record.cost, `${context}.cost`),
    power: requireNullableNumber(record.power, `${context}.power`),
    ram: requireNumber(record.ram, `${context}.ram`),
    artist: requireString(record.artist, `${context}.artist`),
    print_number: requireString(record.print_number, `${context}.print_number`),
    printings: coerceRawPrintings(record.printings, `${context}.printings`),
    selected_printing_id: requireNullableString(
      record.selected_printing_id,
      `${context}.selected_printing_id`,
    ),
    legality: requireString(record.legality, `${context}.legality`) as RawCardRecord["legality"],
  };
}

function coerceRawSet(value: unknown, context: string): RawCardRecord["set"] {
  const record = requireRecord(value, context);

  return {
    code: requireString(record.code, `${context}.code`) as RawCardRecord["set"]["code"],
    name: requireString(record.name, `${context}.name`),
  };
}

function coerceRawPrintings(value: unknown, context: string): RawCardRecord["printings"] {
  if (!Array.isArray(value)) {
    throw new Error(`Expected ${context} to be an array.`);
  }

  return value.map((entry, index): RawCardPrinting => {
    const record = requireRecord(entry, `${context}[${index}]`);

    return {
      id: requireString(record.id, `${context}[${index}].id`),
      collector_number: requireString(
        record.collector_number,
        `${context}[${index}].collector_number`,
      ),
      image_url: requireString(record.image_url, `${context}[${index}].image_url`),
      source_image_url: requireString(
        record.source_image_url,
        `${context}[${index}].source_image_url`,
      ),
      set: coerceRawSet(record.set, `${context}[${index}].set`),
      rarity: requireNullableString(record.rarity, `${context}[${index}].rarity`),
      finish: requireString(
        record.finish,
        `${context}[${index}].finish`,
      ) as RawCardPrinting["finish"],
      artist: requireString(record.artist, `${context}[${index}].artist`),
    };
  });
}

function requireRawCardColor(value: unknown, context: string): RawCardColor {
  const stringValue = requireString(value, context);

  if (!RAW_COLOR_VALUES.has(stringValue as RawCardColor)) {
    throw new Error(`Unexpected raw card color for ${context}: ${stringValue}`);
  }

  return stringValue as RawCardColor;
}

function requireRawCardType(value: unknown, context: string): RawCardType {
  const stringValue = requireString(value, context);

  if (!RAW_TYPE_VALUES.has(stringValue as RawCardType)) {
    throw new Error(`Unexpected raw card type for ${context}: ${stringValue}`);
  }

  return stringValue as RawCardType;
}

function parseRawCardColor(value: string | null): RawCardColor | null {
  if (!value) {
    return null;
  }

  const canonicalValue = toCanonicalToken(value);

  return RAW_COLOR_VALUES.has(canonicalValue as RawCardColor)
    ? (canonicalValue as RawCardColor)
    : null;
}

function parseRawCardType(value: string | null): RawCardType | null {
  if (!value) {
    return null;
  }

  const canonicalValue = toCanonicalToken(value);

  return RAW_TYPE_VALUES.has(canonicalValue as RawCardType)
    ? (canonicalValue as RawCardType)
    : null;
}

function canonicalizeClassification(value: string): string {
  return CANONICAL_CLASSIFICATION_MAP.get(value.toUpperCase()) ?? value;
}

function requireRecord(value: unknown, context: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`Expected ${context} to be an object.`);
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requireString(value: unknown, context: string): string {
  if (typeof value !== "string") {
    throw new Error(`Expected ${context} to be a string.`);
  }

  return value;
}

function requireNullableString(value: unknown, context: string): string | null {
  if (value === null) {
    return null;
  }

  return requireString(value, context);
}

function readOptionalNullableString(value: unknown, context: string): string | null {
  if (value === undefined) {
    return null;
  }

  return requireNullableString(value, context);
}

function requireNumber(value: unknown, context: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Expected ${context} to be a number.`);
  }

  return value;
}

function requireNullableNumber(value: unknown, context: string): number | null {
  if (value === null) {
    return null;
  }

  return requireNumber(value, context);
}

function requireBoolean(value: unknown, context: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`Expected ${context} to be a boolean.`);
  }

  return value;
}

function requireStringArray<TString extends string>(value: unknown, context: string): TString[] {
  if (!Array.isArray(value)) {
    throw new Error(`Expected ${context} to be an array.`);
  }

  return value.map((entry, index) => requireString(entry, `${context}[${index}]`)) as TString[];
}

function findFirstNodeByText(
  $: CheerioAPI,
  scope: NodeSelection,
  selector: string,
  predicate: (text: string) => boolean,
): NodeSelection {
  for (const element of scope.find(selector).toArray()) {
    if (predicate(normalizeText($(element).text()))) {
      return $(element);
    }
  }

  return $([]);
}

function readNodeText(node: NodeSelection): string | null {
  if (!node.length) {
    return null;
  }

  const text = normalizeText(node.text());
  return text ? text : null;
}

function readAttribute(node: NodeSelection, attributeName: string): string | null {
  if (!node.length) {
    return null;
  }

  const value = node.attr(attributeName)?.trim();
  return value ? value : null;
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function toCanonicalToken(value: string): string {
  const normalized = normalizeText(value).toLowerCase();

  if (!normalized) {
    return "";
  }

  return `${normalized.slice(0, 1).toUpperCase()}${normalized.slice(1)}`;
}

function parseOptionalNumber(value: string): number | null {
  if (!value || !/^-?\d+$/.test(value)) {
    return null;
  }

  return Number(value);
}

function pushUnique<TValue>(items: TValue[], value: TValue): void {
  if (!items.includes(value)) {
    items.push(value);
  }
}
