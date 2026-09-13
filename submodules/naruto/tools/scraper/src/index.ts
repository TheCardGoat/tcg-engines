import { createHash } from "node:crypto";
import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { load } from "cheerio";
import JSON5 from "json5";
import type { Browser, BrowserContext, Page } from "playwright";

import type {
  CardDefinition,
  CardType,
  Color,
  Rarity,
  Skill,
  Support,
} from "@tcg-engines/naruto-cards";

export const NARUTO_CARD_GAME_SIMULATOR_COLLECTION_URL =
  "https://narutocardgamesimulator.com/en/collection";
export const EXBURST_CARD_LIST_URL = "https://exburst.dev/naruto/cardlist";
export const EXBURST_CARD_DETAIL_BASE_URL = "https://exburst.dev/naruto/cards";

const CARD_MAP_START =
  /\{\s*(?="[^"]+"\s*:\s*\{\s*(?:"id"|id)\s*:\s*"[^"]+"\s*,\s*(?:"set"|set)\s*:\s*"[^"]+"\s*,\s*(?:"number"|number)\s*:\s*"[^"]+")/;
const DEFAULT_TIMEOUT_MS = 30_000;
const DETAIL_PAUSE_MS = 150;

type JsonRecord = Record<string, unknown>;

export interface SimulatorCommunitySource {
  readonly source: "naruto-card-game-simulator";
  readonly sourceUrl: string;
  readonly payloadUrl: string;
  readonly fetchedAt: string;
  readonly sha256: string;
  readonly cards: readonly CardDefinition[];
}

export interface ExBurstCatalogEntry {
  readonly number: string;
  readonly name: string;
  readonly imageUrl: string;
}

export interface ExBurstCardRecord extends ExBurstCatalogEntry {
  readonly detailUrl: string;
  readonly rarity: string | null;
  readonly fields: Readonly<Record<string, readonly string[]>>;
}

export interface ExBurstCommunitySource {
  readonly source: "exburst";
  readonly sourceUrl: string;
  readonly fetchedAt: string;
  readonly sha256: string;
  readonly reportedCardCount: number;
  readonly cards: readonly ExBurstCardRecord[];
}

export interface CardSourceConflict {
  readonly simulatorId: string;
  readonly exBurstNumber: string;
  readonly fields: readonly string[];
}

export interface InferredIdentityMatch {
  readonly simulatorId: string;
  readonly exBurstNumber: string;
  readonly score: number;
}

export interface CardSourceReconciliation {
  readonly exactNumberMatches: number;
  readonly inferredIdentityMatches: readonly InferredIdentityMatch[];
  readonly simulatorOnly: readonly string[];
  readonly exBurstOnly: readonly string[];
  readonly conflicts: readonly CardSourceConflict[];
}

export interface NarutoCommunityCardSnapshot {
  readonly schemaVersion: 1;
  readonly status: "provisional-community-cross-check";
  readonly fetchedAt: string;
  readonly sources: {
    readonly narutoCardGameSimulator: SimulatorCommunitySource;
    readonly exBurst: ExBurstCommunitySource;
  };
  readonly reconciliation: CardSourceReconciliation;
  readonly limitations: readonly string[];
}

export interface ScrapeOptions {
  readonly fetchImpl?: typeof fetch;
  readonly now?: () => Date;
  readonly launchBrowser?: () => Promise<Browser>;
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireRecord(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) throw new Error(`${label} must be an object.`);
  return value;
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(`${label} must be a string.`);
  return value;
}

function nullableString(value: unknown, label: string): string | null {
  if (value === null) return null;
  return requireString(value, label);
}

function nullableNumber(value: unknown, label: string): number | null {
  if (value === null) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number or null.`);
  }
  return value;
}

function requireBoolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") throw new Error(`${label} must be a boolean.`);
  return value;
}

function requireStringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
  return value.map((entry, index) => requireString(entry, `${label}[${index}]`));
}

function enumValue<T extends string>(value: unknown, values: readonly T[], label: string): T {
  if (typeof value !== "string" || !values.includes(value as T)) {
    throw new Error(`${label} has unsupported value ${JSON.stringify(value)}.`);
  }
  return value as T;
}

function sha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function extractBalancedJsonObject(source: string, startIndex: number): string {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(startIndex, index + 1);
    }
  }

  throw new Error("The card-map JSON object was not balanced.");
}

function normalizeSkill(value: unknown, label: string): Skill {
  const skill = requireRecord(value, label);
  return {
    labels: requireStringArray(skill.labels, `${label}.labels`),
    text: requireString(skill.text, `${label}.text`),
  };
}

function normalizeSupport(value: unknown, label: string): Support | null {
  if (value === null) return null;
  const support = requireRecord(value, label);
  return {
    name: requireString(support.name, `${label}.name`),
    text: requireString(support.text, `${label}.text`),
    timing: requireString(support.timing, `${label}.timing`),
    cost: nullableNumber(support.cost, `${label}.cost`),
  };
}

function normalizeSimulatorCard(value: unknown, mapKey: string): CardDefinition {
  const card = requireRecord(value, `card ${mapKey}`);
  const id = requireString(card.id, `card ${mapKey}.id`);
  if (id !== mapKey) throw new Error(`Card-map key ${mapKey} does not match card id ${id}.`);
  if (!Array.isArray(card.skills)) throw new Error(`card ${mapKey}.skills must be an array.`);

  return {
    id,
    set: requireString(card.set, `card ${mapKey}.set`),
    number: requireString(card.number, `card ${mapKey}.number`),
    rarity: enumValue<Rarity>(
      card.rarity,
      ["", "L", "SR", "R", "C", "SB"],
      `card ${mapKey}.rarity`,
    ),
    cardType: enumValue<CardType>(
      card.card_type,
      ["leader", "character", "ex_character", "chakra", "summon"],
      `card ${mapKey}.card_type`,
    ),
    color: enumValue<Color>(card.color, ["", "red", "blue", "green"], `card ${mapKey}.color`),
    nameEn: requireString(card.name_en, `card ${mapKey}.name_en`),
    nameFr: requireString(card.name_fr, `card ${mapKey}.name_fr`),
    nameJa: requireString(card.name_ja, `card ${mapKey}.name_ja`),
    damage: nullableNumber(card.damage, `card ${mapKey}.damage`),
    power: nullableNumber(card.power, `card ${mapKey}.power`),
    health: nullableNumber(card.health, `card ${mapKey}.health`),
    life: nullableNumber(card.life, `card ${mapKey}.life`),
    traits: requireStringArray(card.traits, `card ${mapKey}.traits`),
    skills: card.skills.map((skill, index) =>
      normalizeSkill(skill, `card ${mapKey}.skills[${index}]`),
    ),
    support: normalizeSupport(card.support, `card ${mapKey}.support`),
    artist: requireString(card.artist, `card ${mapKey}.artist`),
    notForSale: requireBoolean(card.notForSale, `card ${mapKey}.notForSale`),
    image: requireString(card.image, `card ${mapKey}.image`),
    imageJa: requireString(card.image_ja, `card ${mapKey}.image_ja`),
  };
}

export function extractSimulatorCardsFromBundle(bundleSource: string): CardDefinition[] {
  const start = bundleSource.search(CARD_MAP_START);
  if (start < 0)
    throw new Error("No serialized Naruto card map was found in the JavaScript bundle.");

  const parsed = requireRecord(
    JSON5.parse(extractBalancedJsonObject(bundleSource, start)),
    "serialized card map",
  );
  const cards = Object.entries(parsed).map(([key, value]) => normalizeSimulatorCard(value, key));
  if (cards.length === 0) throw new Error("The serialized Naruto card map was empty.");
  return cards;
}

export function discoverNextChunkUrls(html: string, pageUrl: string): string[] {
  const $ = load(html);
  const origin = new URL(pageUrl).origin;
  const urls = new Set<string>();
  $("script[src]").each((_, script) => {
    const src = $(script).attr("src");
    if (!src) return;
    const url = new URL(src, pageUrl);
    if (url.origin === origin && url.pathname.startsWith("/_next/static/chunks/")) {
      urls.add(url.href);
    }
  });
  return [...urls];
}

async function checkedText(response: Response, label: string): Promise<string> {
  if (!response.ok) throw new Error(`${label} failed with HTTP ${response.status}.`);
  return response.text();
}

export async function scrapeNarutoCardGameSimulator(
  options: ScrapeOptions = {},
): Promise<SimulatorCommunitySource> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const fetchedAt = (options.now?.() ?? new Date()).toISOString();
  const pageHtml = await checkedText(
    await fetchImpl(NARUTO_CARD_GAME_SIMULATOR_COLLECTION_URL, {
      headers: { accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
    }),
    "Naruto Card Game Simulator collection request",
  );
  const chunkUrls = discoverNextChunkUrls(pageHtml, NARUTO_CARD_GAME_SIMULATOR_COLLECTION_URL);
  if (chunkUrls.length === 0)
    throw new Error("The collection page exposed no same-origin Next.js chunks.");

  const candidates: Array<{ url: string; cards: CardDefinition[] }> = [];
  for (const url of chunkUrls) {
    const source = await checkedText(await fetchImpl(url), `Next.js chunk request ${url}`);
    try {
      candidates.push({ url, cards: extractSimulatorCardsFromBundle(source) });
    } catch (error) {
      if (!(error instanceof Error) || !error.message.startsWith("No serialized Naruto card map")) {
        throw error;
      }
    }
  }
  if (candidates.length !== 1) {
    throw new Error(`Expected one card-data chunk, found ${candidates.length}.`);
  }

  const candidate = candidates[0]!;
  return {
    source: "naruto-card-game-simulator",
    sourceUrl: NARUTO_CARD_GAME_SIMULATOR_COLLECTION_URL,
    payloadUrl: candidate.url,
    fetchedAt,
    sha256: sha256(candidate.cards),
    cards: candidate.cards,
  };
}

export function extractExBurstCatalogEntries(html: string): ExBurstCatalogEntry[] {
  const $ = load(html);
  const entries = new Map<string, ExBurstCatalogEntry>();
  $('img.card-image[src*="/nrtb/cards/hd/"]').each((_, image) => {
    const rawUrl = $(image).attr("src");
    if (!rawUrl) return;
    const url = new URL(rawUrl, EXBURST_CARD_LIST_URL);
    const match = url.pathname.match(/\/nrtb\/cards\/hd\/([^/]+)\.webp$/i);
    if (!match?.[1]) return;
    const number = decodeURIComponent(match[1]);
    entries.set(number, {
      number,
      name: ($(image).attr("alt") ?? "").trim(),
      imageUrl: `${url.origin}${url.pathname}`,
    });
  });
  return [...entries.values()].sort((left, right) => left.number.localeCompare(right.number));
}

function normalizedFieldText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function extractExBurstCardDetail(html: string, detailUrl: string): ExBurstCardRecord {
  const $ = load(html);
  const title = $(".card-title").first().clone();
  title.find("button").remove();
  const name = normalizedFieldText(title.text());
  const metadata = new Map<string, string>();
  $(".card-title-meta-chip").each((_, chip) => {
    const label = normalizedFieldText($(chip).find(".card-title-meta-label").text());
    const value = normalizedFieldText($(chip).find(".card-title-meta-value").text());
    if (label) metadata.set(label, value);
  });
  const number = metadata.get("Card No.") ?? "";
  if (!number || !name)
    throw new Error(`ExBurst detail page ${detailUrl} is missing card identity.`);

  const fields: Record<string, string[]> = {};
  $(".info-field").each((_, field) => {
    const label = normalizedFieldText($(field).find(".info-label").first().text());
    const value = $(field).find(".info-value").first().clone();
    value.find("br").replaceWith("\n");
    const values = value.text().split("\n").map(normalizedFieldText).filter(Boolean);
    if (label && values.length > 0) fields[label] = values;
  });

  const rawImageUrl = $("img.card-image").first().attr("src") ?? "";
  const imageUrl = rawImageUrl ? new URL(rawImageUrl, detailUrl) : null;
  return {
    number,
    name,
    imageUrl: imageUrl ? `${imageUrl.origin}${imageUrl.pathname}` : "",
    detailUrl,
    rarity: nullableString(metadata.get("Rarity") ?? null, `${number}.rarity`),
    fields,
  };
}

async function defaultLaunchBrowser(): Promise<Browser> {
  const { chromium } = await import("playwright");
  return chromium.launch({ headless: true });
}

async function collectExBurstCatalog(
  page: Page,
): Promise<{ entries: ExBurstCatalogEntry[]; count: number }> {
  await page.goto(EXBURST_CARD_LIST_URL, { waitUntil: "domcontentloaded" });
  const scroller = page.locator(".virtua-list");
  const resultCount = page.locator(".filter-result-count");
  await scroller.waitFor({ state: "visible" });
  await resultCount.waitFor({ state: "visible" });
  const countMatch = (await resultCount.innerText()).match(/^(\d+) results$/);
  if (!countMatch?.[1]) throw new Error("ExBurst did not expose an exact result count.");
  const reportedCount = Number(countMatch[1]);
  const entries = new Map<string, ExBurstCatalogEntry>();

  for (let step = 0; step < 200 && entries.size < reportedCount; step += 1) {
    for (const entry of extractExBurstCatalogEntries(await scroller.innerHTML())) {
      entries.set(entry.number, entry);
    }
    const state = await scroller.evaluate((element) => {
      const next = Math.min(
        element.scrollTop + Math.max(element.clientHeight * 0.8, 200),
        element.scrollHeight,
      );
      const atEnd = next >= element.scrollHeight - element.clientHeight;
      element.scrollTop = next;
      element.dispatchEvent(new Event("scroll", { bubbles: true }));
      return { atEnd, next };
    });
    if (state.atEnd && entries.size >= reportedCount) break;
    await page.waitForTimeout(75);
  }

  if (entries.size !== reportedCount) {
    throw new Error(
      `ExBurst catalog traversal was incomplete: received ${entries.size} of ${reportedCount}.`,
    );
  }
  return {
    entries: [...entries.values()].sort((left, right) => left.number.localeCompare(right.number)),
    count: reportedCount,
  };
}

async function prepareContext(browser: Browser): Promise<BrowserContext> {
  const context = await browser.newContext({
    userAgent:
      "TheCardGoat-Naruto-Catalog/0.1 (+https://github.com/TheCardGoat/the-card-goat-online)",
  });
  await context.route(
    /google|googlesyndication|googletagmanager|nitropay|cloudflareinsights/i,
    (route) => route.abort(),
  );
  await context.route(/\.(?:woff2?|png|jpe?g|gif|webp)(?:\?.*)?$/i, (route) => route.abort());
  return context;
}

export async function scrapeExBurst(options: ScrapeOptions = {}): Promise<ExBurstCommunitySource> {
  const fetchedAt = (options.now?.() ?? new Date()).toISOString();
  const browser = await (options.launchBrowser ?? defaultLaunchBrowser)();
  try {
    const context = await prepareContext(browser);
    const page = await context.newPage();
    page.setDefaultTimeout(DEFAULT_TIMEOUT_MS);
    const catalog = await collectExBurstCatalog(page);
    const cards: ExBurstCardRecord[] = [];

    for (const entry of catalog.entries) {
      const detailUrl = `${EXBURST_CARD_DETAIL_BASE_URL}/${encodeURIComponent(entry.number)}`;
      await page.goto(detailUrl, { waitUntil: "domcontentloaded" });
      await page.locator(".card-title-meta-value").first().waitFor({ state: "visible" });
      const detail = extractExBurstCardDetail(await page.locator("main").innerHTML(), detailUrl);
      if (detail.number !== entry.number) {
        throw new Error(
          `ExBurst list/detail mismatch: expected ${entry.number}, received ${detail.number}.`,
        );
      }
      cards.push({ ...detail, imageUrl: entry.imageUrl || detail.imageUrl });
      await page.waitForTimeout(DETAIL_PAUSE_MS);
    }

    await context.close();
    return {
      source: "exburst",
      sourceUrl: EXBURST_CARD_LIST_URL,
      fetchedAt,
      sha256: sha256(cards),
      reportedCardCount: catalog.count,
      cards,
    };
  } finally {
    await browser.close();
  }
}

function numericField(card: ExBurstCardRecord, key: string): number | null {
  const value = card.fields[key]?.[0];
  if (value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizedType(value: string | undefined): CardType | null {
  const normalized = value?.trim().toLowerCase().replaceAll(" ", "_");
  return ["leader", "character", "ex_character", "chakra", "summon"].includes(normalized ?? "")
    ? (normalized as CardType)
    : null;
}

function searchableText(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function sourceEffectText(card: CardDefinition): string[] {
  return [
    ...card.skills.map((skill) => skill.text),
    ...(card.support ? [card.support.name, card.support.text] : []),
  ]
    .map(searchableText)
    .filter(Boolean);
}

function identityScore(card: CardDefinition, secondary: ExBurstCardRecord): number | null {
  if (searchableText(card.nameEn) !== searchableText(secondary.name)) return null;
  const secondaryType = normalizedType(secondary.fields.Type?.[0]);
  if (secondaryType !== null && secondaryType !== card.cardType) return null;

  let score = 2;
  const revealNumber = card.id.match(/^N-reveal-(\d+)$/)?.[1];
  if (revealNumber && secondary.number === `SAMPLE-${Number(revealNumber)}`) score += 20;
  if (card.power !== null && numericField(secondary, "POW") === card.power) score += 2;
  if (card.health !== null && numericField(secondary, "HP") === card.health) score += 2;
  if (card.damage !== null && numericField(secondary, "DMG") === card.damage) score += 2;

  const secondaryEffect = searchableText(secondary.fields.Effect?.join(" ") ?? "");
  for (const effect of sourceEffectText(card)) {
    if (effect.length >= 8 && secondaryEffect.includes(effect)) score += 3;
  }

  const secondaryTraits = searchableText(secondary.fields.Trait?.join(" ") ?? "");
  for (const trait of card.traits.map(searchableText).filter(Boolean)) {
    if (secondaryTraits.includes(trait)) score += 1;
  }
  return score;
}

function inferIdentityMatches(
  simulatorCards: readonly CardDefinition[],
  exBurstCards: readonly ExBurstCardRecord[],
): InferredIdentityMatch[] {
  const matches: InferredIdentityMatch[] = [];
  const usedNumbers = new Set<string>();

  for (const card of simulatorCards) {
    const candidates = exBurstCards
      .filter((secondary) => !usedNumbers.has(secondary.number))
      .map((secondary) => ({ secondary, score: identityScore(card, secondary) }))
      .filter(
        (candidate): candidate is { secondary: ExBurstCardRecord; score: number } =>
          candidate.score !== null,
      )
      .sort((left, right) => right.score - left.score);
    const best = candidates[0];
    if (!best || best.score < 6 || best.score === candidates[1]?.score) continue;
    matches.push({ simulatorId: card.id, exBurstNumber: best.secondary.number, score: best.score });
    usedNumbers.add(best.secondary.number);
  }
  return matches;
}

function conflictForMatch(
  card: CardDefinition,
  secondary: ExBurstCardRecord,
): CardSourceConflict | null {
  const fields: string[] = [];
  if (card.nameEn !== secondary.name) fields.push("name");
  if (secondary.rarity !== null && card.rarity !== secondary.rarity) fields.push("rarity");
  const secondaryType = normalizedType(secondary.fields.Type?.[0]);
  if (secondaryType !== null && card.cardType !== secondaryType) fields.push("cardType");
  if (numericField(secondary, "DMG") !== card.damage) fields.push("damage");
  if (numericField(secondary, "POW") !== card.power) fields.push("power");
  if (numericField(secondary, "HP") !== card.health) fields.push("health");
  return fields.length > 0
    ? { simulatorId: card.id, exBurstNumber: secondary.number, fields }
    : null;
}

export function reconcileSources(
  simulator: SimulatorCommunitySource,
  exBurst: ExBurstCommunitySource,
): CardSourceReconciliation {
  const exBurstByNumber = new Map(exBurst.cards.map((card) => [card.number, card]));
  const exactCards = simulator.cards.filter(
    (card) => card.number.length > 0 && exBurstByNumber.has(card.number),
  );
  const exactNumbers = new Set(exactCards.map((card) => card.number));
  const unmatchedSimulator = simulator.cards.filter((card) => !exactNumbers.has(card.number));
  const unmatchedExBurst = exBurst.cards.filter((card) => !exactNumbers.has(card.number));
  const inferredIdentityMatches = inferIdentityMatches(unmatchedSimulator, unmatchedExBurst);
  const inferredBySimulatorId = new Map(
    inferredIdentityMatches.map((match) => [match.simulatorId, match]),
  );
  const inferredNumbers = new Set(inferredIdentityMatches.map((match) => match.exBurstNumber));
  const conflicts = [
    ...exactCards.map((card) => conflictForMatch(card, exBurstByNumber.get(card.number)!)),
    ...inferredIdentityMatches.map((match) =>
      conflictForMatch(
        simulator.cards.find((card) => card.id === match.simulatorId)!,
        exBurstByNumber.get(match.exBurstNumber)!,
      ),
    ),
  ].filter((conflict): conflict is CardSourceConflict => conflict !== null);

  return {
    exactNumberMatches: exactCards.length,
    inferredIdentityMatches,
    simulatorOnly: unmatchedSimulator
      .filter((card) => !inferredBySimulatorId.has(card.id))
      .map((card) => card.number || card.id)
      .sort(),
    exBurstOnly: unmatchedExBurst
      .filter((card) => !inferredNumbers.has(card.number))
      .map((card) => card.number)
      .sort(),
    conflicts,
  };
}

export async function scrapeCommunityCardSources(
  options: ScrapeOptions = {},
): Promise<NarutoCommunityCardSnapshot> {
  const fetchedAt = (options.now?.() ?? new Date()).toISOString();
  const simulator = await scrapeNarutoCardGameSimulator(options);
  const exBurst = await scrapeExBurst(options);
  return {
    schemaVersion: 1,
    status: "provisional-community-cross-check",
    fetchedAt,
    sources: { narutoCardGameSimulator: simulator, exBurst },
    reconciliation: reconcileSources(simulator, exBurst),
    limitations: [
      "Both catalogs are unofficial community sources; neither establishes authoritative rules or card text.",
      "Printed text remains display evidence and must not generate executable engine behavior.",
      "Images are referenced by URL for source identification only and are not downloaded or shipped.",
    ],
  };
}

export async function writeSnapshot(
  snapshot: NarutoCommunityCardSnapshot,
  outputPath: string,
): Promise<void> {
  await mkdir(path.dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await rename(temporaryPath, outputPath);
}
