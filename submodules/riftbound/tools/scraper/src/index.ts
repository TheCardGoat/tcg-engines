import { createHash } from "node:crypto";
import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { RiftboundRawSnapshot } from "@tcg/riftbound-types";

export const RIOT_CARD_GALLERY_BASE_URL = "https://playriftbound.com";
export const RIOT_CONTENT_API_PATH = "/riftbound/content/v1/contents";

const NEXT_DATA_PATTERN =
  /<script\s+id=["']__NEXT_DATA__["']\s+type=["']application\/json["']>([\s\S]*?)<\/script>/gi;
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_ATTEMPTS = 3;
const MAX_RETRY_DELAY_MS = 5_000;

type JsonRecord = Record<string, unknown>;

export class RiftboundScrapeError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "RiftboundScrapeError";
  }
}

export class RiotContentApiError extends RiftboundScrapeError {
  constructor(
    message: string,
    readonly status?: number,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "RiotContentApiError";
  }
}

export interface ScrapeOptions {
  fetchImpl?: typeof fetch;
  now?: () => Date;
}

export interface RiotContentApiOptions extends ScrapeOptions {
  apiKey: string;
  region?: string;
  locale?: string;
  timeoutMs?: number;
  maxAttempts?: number;
  sleep?: (milliseconds: number) => Promise<void>;
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireRecord(value: unknown, pathLabel: string): JsonRecord {
  if (!isRecord(value)) {
    throw new RiftboundScrapeError(`${pathLabel} must be an object.`);
  }
  return value;
}

function requireArray(value: unknown, pathLabel: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new RiftboundScrapeError(`${pathLabel} must be an array.`);
  }
  return value;
}

function requireNumber(value: unknown, pathLabel: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new RiftboundScrapeError(`${pathLabel} must be a finite number.`);
  }
  return value;
}

function normalizeLocale(locale: string): string {
  try {
    return Intl.getCanonicalLocales(locale.replaceAll("_", "-"))[0] ?? locale;
  } catch (error) {
    throw new RiftboundScrapeError(`Unsupported locale: ${locale}`, { cause: error });
  }
}

function galleryPathLocale(locale: string): string {
  return normalizeLocale(locale).toLowerCase();
}

function sha256ForPayload(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function extractSingleNextDataJson(html: string): unknown {
  const matches = [...html.matchAll(NEXT_DATA_PATTERN)];
  if (matches.length !== 1) {
    throw new RiftboundScrapeError(
      `Expected exactly one __NEXT_DATA__ script, received ${matches.length}.`,
    );
  }

  try {
    return JSON.parse(matches[0]?.[1] ?? "");
  } catch (error) {
    throw new RiftboundScrapeError("The __NEXT_DATA__ script did not contain valid JSON.", {
      cause: error,
    });
  }
}

export function extractGalleryPayloadFromHtml(html: string): unknown {
  const nextData = requireRecord(extractSingleNextDataJson(html), "__NEXT_DATA__");
  const props = requireRecord(nextData.props, "__NEXT_DATA__.props");
  const pageProps = requireRecord(props.pageProps, "__NEXT_DATA__.props.pageProps");
  const page = requireRecord(pageProps.page, "__NEXT_DATA__.props.pageProps.page");
  const blades = requireArray(page.blades, "__NEXT_DATA__.props.pageProps.page.blades");
  const galleryBlades = blades.filter(
    (blade) => isRecord(blade) && blade.type === "riftboundCardGallery",
  );
  if (galleryBlades.length !== 1) {
    throw new RiftboundScrapeError(
      `Expected exactly one riftboundCardGallery blade, received ${galleryBlades.length}.`,
    );
  }

  const gallery = requireRecord(galleryBlades[0], "riftboundCardGallery");
  const setsContainer = requireRecord(gallery.sets, "riftboundCardGallery.sets");
  const cardsContainer = requireRecord(gallery.cards, "riftboundCardGallery.cards");
  const sets = requireArray(setsContainer.items, "riftboundCardGallery.sets.items");
  const cards = requireArray(cardsContainer.items, "riftboundCardGallery.cards.items");
  const asyncData = requireRecord(cardsContainer.async, "riftboundCardGallery.cards.async");
  const linkData = requireRecord(asyncData.linkdata, "riftboundCardGallery.cards.async.linkdata");
  const metadata = isRecord(asyncData.metadata) ? asyncData.metadata : undefined;
  const reportedTotal = requireNumber(
    metadata?.totalItems ?? linkData.totalItems,
    "riftboundCardGallery.cards.async.metadata.totalItems",
  );

  if (cards.length === 0) {
    throw new RiftboundScrapeError("The official Card Gallery returned no cards.");
  }
  if (cards.length > reportedTotal) {
    throw new RiftboundScrapeError(
      `Card Gallery payload embeds ${cards.length} cards but reports only ${reportedTotal}.`,
    );
  }
  assertGalleryBaseNumbersCovered(sets, cards);

  return { sets, cards, reportedTotal };
}

function galleryCardSetId(card: JsonRecord): string | undefined {
  const set = card.set;
  if (!isRecord(set)) return undefined;
  const value = set.value;
  if (!isRecord(value)) return undefined;
  const id = value.id;
  return typeof id === "string" ? id : undefined;
}

/**
 * The gallery smart list's totalItems counts records the site never publishes
 * (it has exceeded the embedded payload by the same handful across every
 * locale), so an equality check against it can never hold. Completeness is
 * proven structurally instead: every declared set must embed its full base
 * collector number range 1..collectorNumberMax. Alternate printings beyond the
 * base range are optional by definition.
 */
function assertGalleryBaseNumbersCovered(
  sets: readonly unknown[],
  cards: readonly unknown[],
): void {
  const embedded = new Map<string, Set<number>>();
  for (const card of cards) {
    if (!isRecord(card)) continue;
    const setId = galleryCardSetId(card);
    const collectorNumber = card.collectorNumber;
    if (setId === undefined) continue;
    if (typeof collectorNumber !== "number" || !Number.isInteger(collectorNumber)) continue;
    let numbers = embedded.get(setId);
    if (!numbers) embedded.set(setId, (numbers = new Set<number>()));
    numbers.add(collectorNumber);
  }
  for (const set of sets) {
    if (!isRecord(set)) continue;
    const setId = set.id;
    const collectorNumberMax = set.collectorNumberMax;
    if (typeof setId !== "string") continue;
    if (
      typeof collectorNumberMax !== "number" ||
      !Number.isInteger(collectorNumberMax) ||
      collectorNumberMax < 1
    ) {
      continue;
    }
    const numbers = embedded.get(setId);
    const missing: number[] = [];
    for (let n = 1; n <= collectorNumberMax; n += 1) {
      if (!numbers?.has(n)) missing.push(n);
    }
    if (missing.length > 0) {
      throw new RiftboundScrapeError(
        `Card Gallery payload is incomplete: set ${setId} is missing base collector numbers ${missing.join(", ")}.`,
      );
    }
  }
}

export async function scrapeRiotCardGallery(
  locale = "en-US",
  options: ScrapeOptions = {},
): Promise<RiftboundRawSnapshot> {
  const canonicalLocale = normalizeLocale(locale);
  const sourceUrl = `${RIOT_CARD_GALLERY_BASE_URL}/${galleryPathLocale(canonicalLocale)}/card-gallery/`;
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(sourceUrl, {
    headers: { accept: "text/html,application/xhtml+xml" },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new RiftboundScrapeError(
      `Official Card Gallery request failed with HTTP ${response.status}.`,
    );
  }

  const payload = extractGalleryPayloadFromHtml(await response.text());
  return {
    schemaVersion: 1,
    source: "riot-card-gallery",
    sourceUrl,
    locale: canonicalLocale,
    fetchedAt: (options.now?.() ?? new Date()).toISOString(),
    sha256: sha256ForPayload(payload),
    payload,
  };
}

function retryDelayMilliseconds(response: Response, attempt: number): number {
  const retryAfter = response.headers.get("retry-after");
  const seconds = retryAfter === null ? Number.NaN : Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(seconds * 1_000, MAX_RETRY_DELAY_MS);
  }
  return Math.min(250 * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS);
}

function defaultSleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function safeRegion(region: string): string {
  const normalized = region.trim().toLowerCase();
  if (!/^[a-z]+$/.test(normalized)) {
    throw new RiftboundScrapeError(`Invalid Riot API region: ${region}`);
  }
  return normalized;
}

export async function scrapeRiotContentApi(
  options: RiotContentApiOptions,
): Promise<RiftboundRawSnapshot> {
  if (options.apiKey.trim().length === 0) {
    throw new RiotContentApiError("RIOT_API_KEY is required for the Riot content API.");
  }

  const region = safeRegion(options.region ?? "europe");
  const locale = options.locale?.trim() || "en";
  const sourceUrl = `https://${region}.api.riotgames.com${RIOT_CONTENT_API_PATH}?locale=${encodeURIComponent(locale)}`;
  const fetchImpl = options.fetchImpl ?? fetch;
  const sleep = options.sleep ?? defaultSleep;
  const maxAttempts = Math.max(1, Math.min(options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS, 5));
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(sourceUrl, {
        headers: {
          accept: "application/json",
          "X-Riot-Token": options.apiKey,
        },
        signal: controller.signal,
      });

      if ((response.status === 429 || response.status >= 500) && attempt < maxAttempts) {
        await sleep(retryDelayMilliseconds(response, attempt));
        continue;
      }
      if (!response.ok) {
        throw new RiotContentApiError(
          `Riot content API request failed with HTTP ${response.status}.`,
          response.status,
        );
      }

      let payload: unknown;
      try {
        payload = await response.json();
      } catch (error) {
        throw new RiotContentApiError("Riot content API returned malformed JSON.", 200, {
          cause: error,
        });
      }
      const sourceVersion =
        isRecord(payload) && typeof payload.version === "string" ? payload.version : undefined;

      return {
        schemaVersion: 1,
        source: "riot-content-api",
        sourceUrl,
        locale: normalizeLocale(locale),
        fetchedAt: (options.now?.() ?? new Date()).toISOString(),
        ...(sourceVersion ? { sourceVersion } : {}),
        sha256: sha256ForPayload(payload),
        payload,
      };
    } catch (error) {
      if (error instanceof RiotContentApiError) throw error;
      if (attempt < maxAttempts && error instanceof TypeError) {
        await sleep(Math.min(250 * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS));
        continue;
      }
      const timedOut = controller.signal.aborted;
      throw new RiotContentApiError(
        timedOut ? "Riot content API request timed out." : "Riot content API request failed.",
        undefined,
        { cause: error },
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new RiotContentApiError("Riot content API request exhausted its retry budget.");
}

export async function writeRawSnapshot(
  snapshot: RiftboundRawSnapshot,
  outputRoot = path.resolve(".cache/raw"),
): Promise<string> {
  const directory = path.join(outputRoot, snapshot.source, snapshot.locale);
  const filename = `${snapshot.fetchedAt.replaceAll(":", "-")}.json`;
  const target = path.join(directory, filename);
  const temporary = `${target}.tmp`;
  await mkdir(directory, { recursive: true });
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await rename(temporary, target);
  return target;
}
