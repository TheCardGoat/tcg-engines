/**
 * JSON Storage Module
 *
 * Handles saving and loading scraped card data to/from JSON files.
 */

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ScrapedCardData } from "../scraper/card-scraper";

const DATA_DIR = join(import.meta.dir, "../data/scraped");

/**
 * Saves scraped card data to a JSON file
 */
export async function saveScrapedDataToJson(
  cards: ScrapedCardData[],
  setCode: string,
): Promise<string> {
  // Ensure directory exists
  await mkdir(DATA_DIR, { recursive: true });

  const filename = `${setCode.toLowerCase()}.json`;
  const filepath = join(DATA_DIR, filename);

  // Format JSON with nice indentation
  const json = JSON.stringify(cards, null, 2);

  await writeFile(filepath, json, "utf-8");

  return filepath;
}

/**
 * Saves a single scraped card to a JSON file
 * If the file exists, it will update or append the card
 */
export async function saveScrapedCardToJson(
  card: ScrapedCardData,
  setCode: string,
): Promise<string> {
  // Load existing data if available
  let existingCards: ScrapedCardData[] = [];
  try {
    existingCards = await loadScrapedDataFromJson(setCode);
  } catch {
    // File doesn't exist yet, that's okay
  }

  // Find if card already exists
  const existingIndex = existingCards.findIndex(
    (c) => c.cardNumber === card.cardNumber,
  );

  if (existingIndex >= 0) {
    // Update existing card
    existingCards[existingIndex] = card;
  } else {
    // Add new card
    existingCards.push(card);
  }

  // Sort by card number
  existingCards.sort((a, b) => a.cardNumber.localeCompare(b.cardNumber));

  return await saveScrapedDataToJson(existingCards, setCode);
}

/**
 * Loads scraped card data from a JSON file
 */
export async function loadScrapedDataFromJson(
  setCode: string,
): Promise<ScrapedCardData[]> {
  const filename = `${setCode.toLowerCase()}.json`;
  const filepath = join(DATA_DIR, filename);

  const json = await readFile(filepath, "utf-8");
  return JSON.parse(json) as ScrapedCardData[];
}

/**
 * Gets all available set codes that have scraped data
 */
export async function getAvailableSetCodes(): Promise<string[]> {
  try {
    const files = await readdir(DATA_DIR);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", "").toUpperCase());
  } catch {
    // Directory doesn't exist yet
    return [];
  }
}

/**
 * Loads all available scraped data
 */
export async function loadAllScrapedData(): Promise<
  Map<string, ScrapedCardData[]>
> {
  const setCodes = await getAvailableSetCodes();
  const dataMap = new Map<string, ScrapedCardData[]>();

  for (const setCode of setCodes) {
    const cards = await loadScrapedDataFromJson(setCode);
    dataMap.set(setCode, cards);
  }

  return dataMap;
}

/**
 * Gets the file path for a set's JSON data
 */
export function getJsonFilePath(setCode: string): string {
  return join(DATA_DIR, `${setCode.toLowerCase()}.json`);
}
