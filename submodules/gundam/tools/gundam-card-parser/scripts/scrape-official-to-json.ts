import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { OfficialSiteScraper } from "../src/scrapers/official-site.ts";
import type { RawGundamCard, RawSet } from "../src/types/scraper.ts";
import { RateLimiter } from "../src/utils/rate-limiter.ts";
import { REPO_ROOT } from "./_helpers.ts";

const DATA_DIR = join(REPO_ROOT, "tools/gundam-card-parser/data/scraped");
const DEFAULT_RPS = 4;

function usage(): never {
  console.error(
    [
      "Usage: node --experimental-strip-types tools/gundam-card-parser/scripts/scrape-official-to-json.ts [set...]",
      "",
      "Examples:",
      "  ... scrape-official-to-json.ts",
      "  ... scrape-official-to-json.ts gd03 st07",
      "  ... scrape-official-to-json.ts 616103",
    ].join("\n"),
  );
  process.exit(1);
}

function sortCards(cards: RawGundamCard[]): RawGundamCard[] {
  return [...cards].sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
}

function filenameForSet(set: RawSet): string {
  return `${set.id.toLowerCase()}.json`;
}

const requested = process.argv
  .slice(2)
  .filter((arg) => arg !== "--")
  .map((arg) => arg.toLowerCase());
if (requested.includes("-h") || requested.includes("--help")) usage();

const scraper = new OfficialSiteScraper(
  new RateLimiter(Number(process.env["GUNDAM_SCRAPER_RPS"] ?? DEFAULT_RPS)),
);
const sets = await scraper.scrapeSetList();
const selected =
  requested.length === 0
    ? sets
    : sets.filter(
        (set) =>
          requested.includes(set.id.toLowerCase()) || requested.includes(set.packageId ?? ""),
      );

const missing = requested.filter(
  (arg) => !sets.some((set) => set.id.toLowerCase() === arg || set.packageId === arg),
);
if (missing.length > 0) {
  console.error(`Unknown set(s): ${missing.join(", ")}`);
  console.error(
    `Known sets: ${sets.map((s) => `${s.id}${s.packageId ? `(${s.packageId})` : ""}`).join(", ")}`,
  );
  process.exit(1);
}

mkdirSync(DATA_DIR, { recursive: true });

const manifest: Array<{ id: string; name: string; packageId?: string; count: number }> = [];

for (const set of selected) {
  console.log(`Scraping ${set.id} (${set.name})...`);
  const cards = sortCards(await scraper.scrapeCards(set.id));
  writeFileSync(join(DATA_DIR, filenameForSet(set)), JSON.stringify(cards, null, 2) + "\n");
  manifest.push({
    id: set.id,
    name: set.name,
    ...(set.packageId && { packageId: set.packageId }),
    count: cards.length,
  });
}

writeFileSync(
  join(DATA_DIR, "manifest.json"),
  JSON.stringify(
    {
      source: scraper.source,
      scrapedAt: new Date().toISOString(),
      sets: manifest,
    },
    null,
    2,
  ) + "\n",
);

console.log(`Wrote ${manifest.length} scraped set file(s) to ${DATA_DIR}`);
