import type { RawGundamCard, RawSet, Scraper } from "../types/scraper.ts";
import { RateLimiter } from "../utils/rate-limiter.ts";

const BASE_URL = "https://www.gundam-gcg.com/en/cards/";
const DETAIL_URL = `${BASE_URL}detail.php`;
const DOMAIN = "www.gundam-gcg.com";

const CARD_ID_RE = /[A-Z]+[A-Z0-9]*-\d{3}(?:_p\d+)?|[RT]-\d{3}(?:_p\d+)?/i;

function decodeHtml(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_m, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, code: string) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(input: string): string {
  return decodeHtml(input.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, " "))
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function normalizeSetCode(name: string): string {
  const bracketed = name.match(/\[([A-Z0-9-]+)\]/);
  if (bracketed?.[1]) return bracketed[1].toLowerCase();

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function baseCardNumber(cardId: string): string {
  return cardId.replace(/_p\d+$/i, "");
}

function normalizeCardId(raw: string): string {
  const match = raw.match(/^(.+?)(?:(_p\d+))?$/i);
  if (!match) return raw;
  return `${match[1]!.toUpperCase()}${match[2]?.toLowerCase() ?? ""}`;
}

function cardSetCode(cardNumber: string): string {
  return cardNumber.split("-")[0]?.toLowerCase() ?? cardNumber.toLowerCase();
}

function absoluteUrl(raw: string): string | null {
  if (!raw) return null;
  return new URL(decodeHtml(raw), BASE_URL).toString();
}

function parseNumber(raw: string | null): number | null {
  if (!raw || raw === "-") return null;
  const normalized = raw
    .trim()
    .replace(/[０-９]/g, (c) => String(c.charCodeAt(0) - 0xff10))
    .replace(/^\+/, "");
  const parsed = Number.parseInt(normalized, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function parseOfficialSetList(html: string): RawSet[] {
  const sets = new Map<string, RawSet>();
  const optionRe =
    /<a\b[^>]*class="[^"]*\bjs-selectBtn-package\b[^"]*"[^>]*data-val="([^"]*)"[^>]*>(.*?)<\/a>/gis;

  for (const match of html.matchAll(optionRe)) {
    const packageId = match[1]?.trim();
    const name = stripTags(match[2] ?? "");
    if (!packageId || !name || name.toUpperCase() === "ALL") continue;

    const id = normalizeSetCode(name);
    if (!sets.has(packageId)) {
      sets.set(packageId, { id, name, packageId });
    }
  }

  return [...sets.values()];
}

export function parseOfficialCardIds(html: string): string[] {
  const seen = new Set<string>();
  const linkRe = /detail\.php\?detailSearch=([^"'&<\s]+)/gi;

  for (const match of html.matchAll(linkRe)) {
    const raw = decodeURIComponent(decodeHtml(match[1] ?? ""));
    const id = raw.match(CARD_ID_RE)?.[0];
    if (id) seen.add(normalizeCardId(id));
  }

  return [...seen].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

export function parseOfficialCardDetail(
  html: string,
  fallbackId: string,
  fallbackSet: RawSet | null,
): RawGundamCard | null {
  if (!html.includes('class="cardNo"') || !html.includes('class="cardName"')) return null;

  const cardNumber = stripTags(html.match(/<div class="cardNo">\s*([\s\S]*?)<\/div>/i)?.[1] ?? "");
  const cardId = normalizeCardId(fallbackId);
  const code = cardNumber || baseCardNumber(cardId);
  const rarity = stripTags(html.match(/<div class="rarity">\s*([\s\S]*?)<\/div>/i)?.[1] ?? "");
  const name = stripTags(html.match(/<h1 class="cardName">\s*([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const imageRaw = html.match(/<div class="cardImage">\s*<img\b[^>]*src=\s*"([^"]+)"/i)?.[1] ?? "";
  const image = absoluteUrl(imageRaw);

  const fields = new Map<string, string>();
  const fieldRe =
    /<dl class="dataBox[^"]*">\s*<dt class="dataTit">\s*([\s\S]*?)\s*<\/dt>\s*<dd class="dataTxt[^"]*">\s*([\s\S]*?)\s*<\/dd>\s*<\/dl>/gi;

  for (const match of html.matchAll(fieldRe)) {
    const key = stripTags(match[1] ?? "");
    const value = stripTags(match[2] ?? "");
    if (key) fields.set(key, value);
  }

  const effectHtml =
    html.match(
      /<div class="cardDataRow overview">\s*<div class="dataTxt isRegular">\s*([\s\S]*?)\s*<\/div>/i,
    )?.[1] ?? "";
  const effect = stripTags(effectHtml).replace(/\n{3,}/g, "\n\n") || null;
  const setCode = cardSetCode(code);
  const set =
    fallbackSet && fallbackSet.id === setCode
      ? fallbackSet
      : {
          id: setCode,
          name: fallbackSet?.name ?? setCode.toUpperCase(),
          packageId: fallbackSet?.packageId,
        };

  return {
    id: cardId,
    code,
    name,
    rarity,
    cardType: fields.get("TYPE") ?? "",
    level: fields.get("Lv.") ?? null,
    cost: parseNumber(fields.get("COST") ?? null),
    color: fields.get("COLOR") ?? null,
    ap: parseNumber(fields.get("AP") ?? null),
    hp: parseNumber(fields.get("HP") ?? null),
    effect,
    zone: fields.get("Zone") ?? null,
    trait: fields.get("Trait") ?? null,
    link: fields.get("Link") ?? null,
    images: {
      small: image,
      large: image,
    },
    sourceTitle: fields.get("Source Title") ?? null,
    getIt: fields.get("Where to get it") ?? null,
    set,
  };
}

export class OfficialSiteScraper implements Scraper {
  readonly name = "official-site";
  readonly source = BASE_URL;
  readonly #limiter: RateLimiter;
  #sets: RawSet[] | null = null;

  constructor(limiter = new RateLimiter(2)) {
    this.#limiter = limiter;
  }

  async #fetchText(url: string): Promise<string> {
    await this.#limiter.throttle(DOMAIN);
    const res = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "gundam-simulator-card-scraper/1.0",
      },
    });
    if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
    return res.text();
  }

  async scrapeSetList(): Promise<RawSet[]> {
    if (this.#sets) return this.#sets;
    this.#sets = parseOfficialSetList(await this.#fetchText(BASE_URL));
    return this.#sets;
  }

  async scrapeCards(setId: string): Promise<RawGundamCard[]> {
    const sets = await this.scrapeSetList();
    const set = sets.find((s) => s.id === setId || s.packageId === setId);
    if (!set?.packageId) throw new Error(`Unknown official set "${setId}"`);

    const listUrl = new URL(BASE_URL);
    listUrl.searchParams.set("search", "true");
    listUrl.searchParams.set("package", set.packageId);

    const ids = parseOfficialCardIds(await this.#fetchText(listUrl.toString()));
    const cards: RawGundamCard[] = [];

    for (const [index, id] of ids.entries()) {
      const detailUrl = new URL(DETAIL_URL);
      detailUrl.searchParams.set("detailSearch", id);
      const card = parseOfficialCardDetail(await this.#fetchText(detailUrl.toString()), id, set);
      if (card) cards.push(card);
      process.stdout.write(`\r  ${set.id}: ${index + 1}/${ids.length}`);
    }

    process.stdout.write("\n");
    return cards;
  }
}
