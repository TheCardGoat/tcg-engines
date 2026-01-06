#!/usr/bin/env bun

/**
 * Legacy Cards Migration Script
 *
 * Migrates cards from legacy-cards/ to the new cards/ format.
 * Usage: bun run scripts/migrate-legacy-cards.ts
 */

import { parse } from "node:csv-parse/sync";
import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import {
  type ConversionResult,
  convertLegacyCard,
  generateConversionReport,
  getConversionStatistics,
} from "../src/parser/legacy-card-converter";
import {
  createDirectoryStructure,
  writeCardToFile,
  writeIndexFile,
} from "../src/parser/migration-file-writer";
import {
  getValidationSummary,
  validateCard,
  validateConversionResults,
} from "../src/parser/migration-validator";

// Configuration
const LEGACY_CARDS_DIR = resolve(__dirname, "../src/legacy-cards/001");
const TARGET_CARDS_DIR = resolve(__dirname, "../src/cards/001");
const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE =
  process.argv.includes("--verbose") || process.argv.includes("-v");

/**
 * Main migration function
 */
async function main() {
  console.log("=== Lorcana Legacy Card Migration ===\n");

  // Step 1: Scan legacy cards directory
  console.log(
    `Scanning legacy cards from: ${relative(process.cwd(), LEGACY_CARDS_DIR)}`,
  );
  const legacyCards = await scanLegacyCards(LEGACY_CARDS_DIR);
  console.log(`Found ${legacyCards.length} legacy cards\n`);

  // Step 2: Convert cards
  console.log("Converting cards...");
  const results = convertCards(legacyCards);
  console.log(`Converted ${results.length} cards\n`);

  // Step 3: Validate cards
  console.log("Validating cards...");
  const validations = validateConversionResults(results);
  console.log(`Validated ${validations.length} cards\n`);

  // Step 4: Generate reports
  const stats = getConversionStatistics(results);
  console.log("\n=== Conversion Statistics ===");
  console.log(`Total: ${stats.total}`);
  console.log(`Successful: ${stats.successful}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`With warnings: ${stats.withWarnings}`);
  console.log(`Total warnings: ${stats.totalWarnings}`);
  console.log(`Total errors: ${stats.totalErrors}`);
  console.log("\nBy type:");
  console.log(`  Characters: ${stats.byType.character}`);
  console.log(`  Actions: ${stats.byType.action}`);
  console.log(`  Items: ${stats.byType.item}`);
  console.log(`  Songs: ${stats.byType.song}`);

  // Show detailed report if verbose
  if (VERBOSE) {
    console.log(generateConversionReport(results));
    console.log(getValidationSummary(validations));
  }

  // Step 5: Write files (unless dry run)
  if (DRY_RUN) {
    console.log("\n[DRY RUN] Files would be written to:");
    console.log(relative(process.cwd(), TARGET_CARDS_DIR));
  } else {
    console.log("\nWriting files...");
    await writeConvertedCards(results);
    console.log("Files written successfully");
  }

  // Exit with error code if any failures
  const hasFailures = stats.failed > 0;
  process.exit(hasFailures ? 1 : 0);
}

/**
 * Scan legacy cards directory
 */
async function scanLegacyCards(directory: string): Promise<any[]> {
  const cards: any[] = [];

  // Scan subdirectories
  const subdirs = ["characters", "actions", "items", "songs"];

  for (const subdir of subdirs) {
    const subdirPath = join(directory, subdir);

    try {
      const files = readdirSync(subdirPath).filter(
        (f) =>
          f.endsWith(".ts") &&
          !f.endsWith(".test.ts") &&
          !f.endsWith(".spec.ts"),
      );

      for (const file of files) {
        const filePath = join(subdirPath, file);
        try {
          // Dynamic import to load the legacy card
          const module = await import(filePath);
          const card = module[Object.keys(module)[0]]; // Get the exported card

          if (card && card.id) {
            cards.push(card);
          }
        } catch (error) {
          console.error(`Failed to load ${file}: ${error}`);
        }
      }
    } catch (error) {
      // Directory might not exist (e.g., songs/ in some sets)
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error(`Error scanning ${subdir}: ${error}`);
      }
    }
  }

  return cards;
}

/**
 * Convert cards
 */
function convertCards(legacyCards: any[]): ConversionResult[] {
  return legacyCards.map((card) => convertLegacyCard(card));
}

/**
 * Write converted cards to files
 */
async function writeConvertedCards(results: ConversionResult[]): Promise<void> {
  // Create directory structure
  createDirectoryStructure(TARGET_CARDS_DIR);

  // Group cards by type
  const byType: Record<string, ConversionResult[]> = {
    character: [],
    action: [],
    item: [],
    song: [],
  };

  for (const result of results) {
    if (result.errors.length > 0) {
      console.error(`Skipping ${result.card.name} due to errors`);
      continue;
    }

    const cardType = result.card.cardType;
    if (cardType in byType) {
      byType[cardType].push(result);
    }
  }

  // Write cards and generate index files
  for (const [type, typeResults] of Object.entries(byType)) {
    const subDir = `${type}s`;

    // Write individual card files
    for (const result of typeResults) {
      const filePath = writeCardToFile(result.card, TARGET_CARDS_DIR, DRY_RUN);
      if (VERBOSE) {
        console.log(`  Wrote: ${relative(process.cwd(), filePath)}`);
      }
    }

    // Write index file
    const cards = typeResults.map((r) => r.card);
    writeIndexFile(cards, TARGET_CARDS_DIR, subDir, DRY_RUN);
  }
}

/**
 * Run the migration
 */
main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
