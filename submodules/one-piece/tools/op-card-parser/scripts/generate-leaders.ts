import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { OptcgApiScraper } from "../src/scrapers/optcg-api.ts";
import { normalize } from "../src/normalizer.ts";
import type { LeaderCard } from "../src/types/card.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "../output");

const scraper = new OptcgApiScraper();

console.log("Fetching set list...");
const sets = await scraper.scrapeSetList();
console.log(`Found ${sets.length} sets: ${sets.map((s) => s.id).join(", ")}\n`);

const leaders: LeaderCard[] = [];
const errors: { setId: string; cardId: string; error: string }[] = [];

for (const set of sets) {
  process.stdout.write(`Scraping ${set.id} (${set.name})... `);
  try {
    const rawCards = await scraper.scrapeCards(set.id);
    const setLeaders: LeaderCard[] = [];

    for (const raw of rawCards) {
      try {
        const card = normalize(raw);
        if (card.cardType === "leader") {
          setLeaders.push(card);
        }
      } catch (err) {
        errors.push({
          setId: set.id,
          cardId: raw.card_set_id,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    console.log(`${rawCards.length} cards, ${setLeaders.length} leaders`);
    leaders.push(...setLeaders);
  } catch (err) {
    console.log(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }
}

mkdirSync(OUTPUT_DIR, { recursive: true });

const outputPath = join(OUTPUT_DIR, "leaders.json");
writeFileSync(outputPath, JSON.stringify(leaders, null, 2));

console.log(`\n✓ ${leaders.length} leaders written to output/leaders.json`);

if (errors.length > 0) {
  const errorsPath = join(OUTPUT_DIR, "leaders-errors.json");
  writeFileSync(errorsPath, JSON.stringify(errors, null, 2));
  console.log(`⚠ ${errors.length} normalization errors written to output/leaders-errors.json`);
}

// Print a summary table
console.log("\nLeaders by set:");
const bySet = leaders.reduce<Record<string, LeaderCard[]>>((acc, card) => {
  (acc[card.setId] ??= []).push(card);
  return acc;
}, {});

for (const [setId, setLeaders] of Object.entries(bySet)) {
  console.log(`  ${setId}: ${setLeaders.map((c) => c.i18n.en.name).join(", ")}`);
}
