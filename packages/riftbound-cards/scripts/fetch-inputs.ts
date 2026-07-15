#!/usr/bin/env bun
/**
 * Fetch Inputs Script
 *
 * Fetches card data from the Riftcodex API and saves to data/inputs/:
 * - Riftcodex API: Card data with stats, images, text
 *
 * Usage:
 *   bun packages/riftbound-cards/scripts/fetch-inputs.ts
 */

import fs from "node:fs";
import path from "node:path";
import type { RiftcodexApiResponse, RiftcodexInputCard } from "./types";

const OUTPUT_DIR = path.resolve(__dirname, "../data/inputs");
const RIFTCODEX_API_URL = "https://api.riftcodex.com/cards";
const PAGE_SIZE = 100;

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
async function fetchWithRetry(
  url: string,
  retries = 3,
  delay = 1000,
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });
      if (response.ok) {
        return response;
      }
      if (response.status === 429) {
        // Rate limited, wait longer
        console.log(`  ⏳ Rate limited, waiting ${delay * 2}ms...`);
        await new Promise((r) => setTimeout(r, delay * 2));
        continue;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`  ⚠️ Retry ${i + 1}/${retries} after error...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

/**
 * Fetch all cards from Riftcodex API with pagination
 */
async function fetchRiftcodex(): Promise<void> {
  console.log("\n📦 Fetching Riftcodex cards...");
  console.log(`  URL: ${RIFTCODEX_API_URL}`);

  const allCards: RiftcodexInputCard[] = [];
  let currentPage = 1;
  let totalPages = 1;

  // Fetch first page to get total count
  const firstUrl = `${RIFTCODEX_API_URL}?page=1&size=${PAGE_SIZE}`;
  console.log("  Fetching page 1...");

  const firstResponse = await fetchWithRetry(firstUrl);
  const firstData = (await firstResponse.json()) as RiftcodexApiResponse;

  allCards.push(...firstData.items);
  totalPages = firstData.pages;

  console.log(
    `  📊 Found ${firstData.total} total cards across ${totalPages} pages`,
  );

  // Fetch remaining pages
  for (currentPage = 2; currentPage <= totalPages; currentPage++) {
    const url = `${RIFTCODEX_API_URL}?page=${currentPage}&size=${PAGE_SIZE}`;
    console.log(`  Fetching page ${currentPage}/${totalPages}...`);

    try {
      const response = await fetchWithRetry(url);
      const data = (await response.json()) as RiftcodexApiResponse;
      allCards.push(...data.items);

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 200));
    } catch (error) {
      console.error(`  ❌ Failed to fetch page ${currentPage}:`, error);
    }
  }

  writeJson("riftcodex-input.json", allCards);
  console.log(`  📊 ${allCards.length} total cards saved`);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("🔄 Fetching card data from Riftcodex API...");

  ensureOutputDir();

  try {
    await fetchRiftcodex();
    console.log("\n🎉 Done fetching inputs!");
  } catch (error) {
    console.error("\n❌ Error fetching inputs:", error);
    process.exit(1);
  }
}

// Run the script
main();
