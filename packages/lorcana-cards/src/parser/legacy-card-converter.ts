/**
 * Legacy Card Converter - Main Orchestration
 *
 * Orchestrates the full conversion of legacy cards to new format.
 * This is the main entry point for the conversion process.
 */

import type {
  ActionCard,
  CharacterCard,
  ItemCard,
  LocationCard,
} from "@tcg/lorcana-types";
import { convertLegacyAbilities } from "./legacy-ability-converter";
import type {
  LegacyActionCard,
  LegacyCard,
  LegacyCharacterCard,
  LegacyItemCard,
} from "./legacy-ability-types";
import { convertLegacyCard as convertLegacyMetadata } from "./legacy-metadata-converter";

/**
 * Conversion result
 */
export interface ConversionResult {
  /** Converted card */
  card: CharacterCard | ActionCard | ItemCard | LocationCard;
  /** Any warnings encountered during conversion */
  warnings: string[];
  /** Any errors encountered during conversion */
  errors: string[];
}

/**
 * Convert a legacy card to new format
 *
 * @param legacyCard - Legacy card object
 * @param franchise - Optional franchise (will be inferred if not provided)
 * @returns Conversion result with card and any warnings/errors
 */
export function convertLegacyCard(
  legacyCard: LegacyCard,
  franchise?: string,
): ConversionResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // Step 1: Convert metadata (card-level properties)
    const newCard = convertLegacyMetadata(legacyCard, franchise);

    // Step 2: Convert abilities
    if (legacyCard.abilities && legacyCard.abilities.length > 0) {
      const convertedAbilities = convertLegacyAbilities(
        legacyCard.abilities,
        legacyCard.id,
      );

      // Assign converted abilities to the card
      (
        newCard as CharacterCard | ActionCard | ItemCard | LocationCard
      ).abilities = convertedAbilities;
    }

    // Step 3: Validate the result
    const validationWarnings = validateConvertedCard(newCard);
    warnings.push(...validationWarnings);

    return {
      card: newCard,
      warnings,
      errors,
    };
  } catch (error) {
    errors.push(
      `Failed to convert card ${legacyCard.name}: ${error instanceof Error ? error.message : String(error)}`,
    );

    return {
      card: {} as CharacterCard | ActionCard | ItemCard | LocationCard,
      warnings,
      errors,
    };
  }
}

/**
 * Convert multiple legacy cards
 *
 * @param legacyCards - Array of legacy cards
 * @param franchise - Optional franchise for all cards
 * @returns Array of conversion results
 */
export function convertLegacyCards(
  legacyCards: LegacyCard[],
  franchise?: string,
): ConversionResult[] {
  return legacyCards.map((card) => convertLegacyCard(card, franchise));
}

/**
 * Validate a converted card
 */
function validateConvertedCard(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
): string[] {
  const warnings: string[] = [];

  // Check for required properties
  if (!card.id) {
    warnings.push("Missing card ID");
  }

  if (!card.name) {
    warnings.push("Missing card name");
  }

  if (!card.cardType) {
    warnings.push("Missing card type");
  }

  if (!card.inkType || card.inkType.length === 0) {
    warnings.push("Missing ink type");
  }

  if (!card.set) {
    warnings.push("Missing set");
  }

  if (card.cardNumber === undefined) {
    warnings.push("Missing card number");
  }

  if (card.cost === undefined) {
    warnings.push("Missing cost");
  }

  // Check character-specific properties
  if (card.cardType === "character") {
    const charCard = card as CharacterCard;
    if (charCard.strength === undefined) {
      warnings.push("Character missing strength");
    }
    if (charCard.willpower === undefined) {
      warnings.push("Character missing willpower");
    }
    if (charCard.lore === undefined) {
      warnings.push("Character missing lore");
    }
    if (!charCard.classifications || charCard.classifications.length === 0) {
      warnings.push("Character has no classifications");
    }
  }

  // Check for abilities
  if (!card.abilities || card.abilities.length === 0) {
    // This is only a warning if the card text suggests it should have abilities
    if (card.text && card.text.length > 50) {
      warnings.push(
        "Card has text but no converted abilities - may need manual review",
      );
    }
  }

  return warnings;
}

/**
 * Load legacy card from file path
 *
 * This is a placeholder for the actual implementation
 * which will use dynamic imports or file system access
 *
 * @param filePath - Path to legacy card file
 * @returns Legacy card object
 */
export async function loadLegacyCard(filePath: string): Promise<LegacyCard> {
  // TODO: Implement actual file loading
  // This will likely use dynamic import() or fs.readFile()
  throw new Error(`loadLegacyCard not yet implemented for: ${filePath}`);
}

/**
 * Batch convert legacy cards from a directory
 *
 * @param directory - Directory path containing legacy card files
 * @param franchise - Optional franchise for all cards
 * @returns Array of conversion results
 */
export async function convertLegacyCardsFromDirectory(
  directory: string,
  franchise?: string,
): Promise<ConversionResult[]> {
  // TODO: Implement directory scanning and batch conversion
  throw new Error(
    `convertLegacyCardsFromDirectory not yet implemented for: ${directory}`,
  );
}

/**
 * Generate conversion report
 *
 * @param results - Array of conversion results
 * @returns Formatted report string
 */
export function generateConversionReport(results: ConversionResult[]): string {
  const successCount = results.filter((r) => r.errors.length === 0).length;
  const failureCount = results.filter((r) => r.errors.length > 0).length;
  const warningCount = results.reduce((sum, r) => sum + r.warnings.length, 0);

  let report = `
=== Legacy Card Conversion Report ===

Total cards: ${results.length}
Successful: ${successCount}
Failed: ${failureCount}
Total warnings: ${warningCount}

`;

  if (failureCount > 0) {
    report += "\n=== Failed Conversions ===\n";
    results
      .filter((r) => r.errors.length > 0)
      .forEach((r) => {
        report += `\n${r.card.name || "Unknown"}:\n`;
        r.errors.forEach((e) => {
          report += `  - ERROR: ${e}\n`;
        });
      });
  }

  if (warningCount > 0) {
    report += "\n=== Warnings ===\n";
    results
      .filter((r) => r.warnings.length > 0)
      .forEach((r) => {
        report += `\n${r.card.name || "Unknown"}:\n`;
        r.warnings.forEach((w) => {
          report += `  - WARNING: ${w}\n`;
        });
      });
  }

  return report;
}

/**
 * Filter cards needing manual review
 *
 * @param results - Array of conversion results
 * @returns Cards that need manual review
 */
export function filterCardsNeedingManualReview(
  results: ConversionResult[],
): ConversionResult[] {
  return results.filter(
    (r) =>
      r.errors.length > 0 ||
      r.warnings.some(
        (w) => w.includes("manual review") || w.includes("unknown"),
      ),
  );
}

/**
 * Get conversion statistics
 *
 * @param results - Array of conversion results
 * @returns Statistics object
 */
export function getConversionStatistics(results: ConversionResult[]) {
  return {
    total: results.length,
    successful: results.filter((r) => r.errors.length === 0).length,
    failed: results.filter((r) => r.errors.length > 0).length,
    withWarnings: results.filter((r) => r.warnings.length > 0).length,
    totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
    totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
    byType: {
      character: results.filter((r) => r.card.cardType === "character").length,
      action: results.filter((r) => r.card.cardType === "action").length,
      item: results.filter((r) => r.card.cardType === "item").length,
      location: results.filter((r) => r.card.cardType === "location").length,
      // Songs are actions with actionSubtype: "song"
      song: results.filter(
        (r) =>
          r.card.cardType === "action" &&
          "actionSubtype" in r.card &&
          r.card.actionSubtype === "song",
      ).length,
    },
  };
}
