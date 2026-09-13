import { createHash } from "node:crypto";
import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";
import type { GrandArchiveRawSnapshot } from "@tcg/grand-archive-types";

export const GATCG_INDEX_API_URL = "https://api.gatcg.com/cards/search";
export const GATCG_OPENAPI_URL = "https://api.gatcg.com/openapi.json";
const PAGE_SIZE = 50;

export class GrandArchiveScrapeError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "GrandArchiveScrapeError";
  }
}
interface SearchPage {
  readonly data: readonly unknown[];
  readonly total_pages: number;
}
function isSearchPage(value: unknown): value is SearchPage {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data) &&
    Number.isInteger((value as { total_pages?: unknown }).total_pages)
  );
}
async function fetchPage(fetchImpl: typeof fetch, page: number): Promise<SearchPage> {
  const response = await fetchImpl(`${GATCG_INDEX_API_URL}?page=${page}&page_size=${PAGE_SIZE}`, {
    headers: { accept: "application/json" },
  });
  if (!response.ok)
    throw new GrandArchiveScrapeError(
      `Grand Archive Index page ${page} failed with HTTP ${response.status}.`,
    );
  const value: unknown = await response.json();
  if (!isSearchPage(value))
    throw new GrandArchiveScrapeError(`Grand Archive Index page ${page} had an unexpected shape.`);
  return value;
}
export async function scrapeGrandArchiveIndex(
  fetchImpl: typeof fetch = fetch,
): Promise<GrandArchiveRawSnapshot> {
  const first = await fetchPage(fetchImpl, 1);
  const cards: unknown[] = [...first.data];
  for (let page = 2; page <= first.total_pages; page += 1)
    cards.push(...(await fetchPage(fetchImpl, page)).data);
  const payload = { cards };
  const fetchedAt = new Date().toISOString();
  return {
    schemaVersion: 1,
    source: "gatcg-index-api",
    sourceUrl: GATCG_INDEX_API_URL,
    openApiUrl: GATCG_OPENAPI_URL,
    fetchedAt,
    sha256: createHash("sha256").update(JSON.stringify(payload)).digest("hex"),
    payload,
  };
}
export async function writeRawSnapshot(
  snapshot: GrandArchiveRawSnapshot,
  outputRoot = path.resolve("tools/catalog/snapshots"),
): Promise<string> {
  const target = path.join(
    outputRoot,
    `gatcg-index-${snapshot.fetchedAt.replaceAll(":", "-")}.json.gz`,
  );
  const temporary = `${target}.tmp`;
  await mkdir(outputRoot, { recursive: true });
  await writeFile(temporary, gzipSync(`${JSON.stringify(snapshot, null, 2)}\n`));
  await rename(temporary, target);
  return target;
}
