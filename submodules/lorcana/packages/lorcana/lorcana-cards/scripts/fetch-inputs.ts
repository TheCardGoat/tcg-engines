#!/usr/bin/env bun
/**
 * Fetch Inputs Script
 *
 * Fetches card data from external APIs and saves to data/inputs/:
 * - Ravensburger API: Official card catalog (stats, images, variants)
 * - Lorcast API: Card text with symbols ({S}, {I}, {D})
 *
 * Usage:
 *   bun packages/lorcana-cards/scripts/fetch-inputs.ts
 */

import fs from "node:fs";
import path from "node:path";

const OUTPUT_DIR = path.resolve(__dirname, "../data/inputs");
const RAVENSBURGER_BASE_URL = "https://api.lorcana.ravensburger.com/v3/catalog";
const LORCAST_SETS_URL = "https://api.lorcast.com/v0/sets";

// Supported locales for Ravensburger API
const SUPPORTED_LOCALES = ["en", "de", "fr", "it"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

interface LorcastSet {
  id: string;
  code: string;
  name: string;
}

interface LorcastSetsResponse {
  results: LorcastSet[];
}

/**
 * Ensure output directory exists
 */
function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Write JSON file with pretty formatting
 */
function writeJson(filename: string, data: unknown): void {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`  ✅ ${filename}`);
}

/**
 * Fetch with retry logic
 */
async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      if (response.status === 429) {
        // Rate limited, wait longer
        console.log(`  ⏳ Rate limited, waiting ${delay * 2}ms...`);
        await new Promise((r) => setTimeout(r, delay * 2));
        continue;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${url}`);
    } catch (error) {
      if (i === retries - 1) {
        const msg = error instanceof Error ? error.message : String(error);
        throw new Error(`${msg} (URL: ${url})`);
      }
      console.log(`  ⚠️ Retry ${i + 1}/${retries} after error...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

/**
 * Fetch Ravensburger card catalog for a specific locale
 */
async function fetchRavensburgerLocale(locale: SupportedLocale): Promise<void> {
  const url = `${RAVENSBURGER_BASE_URL}/${locale}`;
  console.log(`\n📦 Fetching Ravensburger catalog (${locale.toUpperCase()})...`);
  console.log(`  URL: ${url}`);

  const response = await fetchWithRetry(url);
  const data = await response.json();

  // Save with locale suffix (en is the primary/default)
  const filename =
    locale === "en" ? "ravensburger-input.json" : `ravensburger-input-${locale}.json`;
  writeJson(filename, data);

  // Count cards
  const cards = data.cards || {};
  const total =
    (cards.characters?.length || 0) +
    (cards.locations?.length || 0) +
    (cards.items?.length || 0) +
    (cards.actions?.length || 0);
  console.log(`  📊 ${total} cards, ${data.card_sets?.length || 0} sets`);
}

/**
 * Fetch Ravensburger card catalog for all supported locales
 */
async function fetchRavensburger(): Promise<void> {
  console.log("\n🌍 Fetching Ravensburger catalogs for all locales...");

  // Fetch all locales sequentially to avoid rate limiting
  for (const locale of SUPPORTED_LOCALES) {
    await fetchRavensburgerLocale(locale);
    // Small delay between locales
    if (locale !== SUPPORTED_LOCALES[SUPPORTED_LOCALES.length - 1]) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`\n✅ Fetched all ${SUPPORTED_LOCALES.length} locales`);
}

/**
 * Fetch all cards from Lorcast API (all sets)
 */
async function fetchLorcast(): Promise<void> {
  console.log("\n📖 Fetching Lorcast cards...");

  // First, get all sets
  console.log(`  Fetching sets from ${LORCAST_SETS_URL}...`);
  const setsResponse = await fetchWithRetry(LORCAST_SETS_URL);
  const setsData = (await setsResponse.json()) as LorcastSetsResponse;
  const sets = setsData.results || [];
  console.log(`  Found ${sets.length} sets`);

  // Fetch cards from each set (fail-fast: no partial success if any set API fails)
  const allCards: unknown[] = [];

  for (const set of sets) {
    const url = `https://api.lorcast.com/v0/sets/${set.id}/cards`;
    console.log(`  Fetching ${set.name} (${set.code})...`);

    const response = await fetchWithRetry(url);
    const cards = (await response.json()) as unknown[];
    allCards.push(...cards);
    console.log(`    → ${cards.length} cards`);

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200));
  }

  writeJson("lorcast-input.json", allCards);
  console.log(`  📊 ${allCards.length} total cards`);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("🔄 Fetching card data from APIs...");

  ensureOutputDir();

  try {
    await Promise.all([fetchRavensburger(), fetchLorcast()]);
    console.log("\n🎉 Done fetching inputs!");
  } catch (error) {
    console.error("\n❌ Error fetching inputs:", error);
    process.exit(1);
  }
}

// Run the script
main();
