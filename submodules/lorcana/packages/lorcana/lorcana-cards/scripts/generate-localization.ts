#!/usr/bin/env bun
/**
 * Generate Localization Script
 *
 * Generates lightweight localization files from Ravensburger API data.
 * Output is keyed by shortId (gameCardId) to match the runtime (getLocalizedCard(shortId)).
 * Uses culture_invariant_id from aux KV for reliable cross-locale matching.
 * Validates that all locale cards have matching culture_invariant_id mappings.
 * Fails on validation mismatch (per specification).
 *
 * Usage:
 *   bun packages/lorcana-cards/scripts/generate-localization.ts
 */

import fs from "node:fs";
import path from "node:path";
import type { CardText } from "@tcg/lorcana-types";
import type { CardsAuxKv, RavensburgerInputJson, InputCard } from "./types";
import { normalizeCardTextContent, splitCardText } from "./utils/structured-card-text";
import { stripReminderText } from "./utils/reminder-text";

const INPUT_DIR = path.resolve(__dirname, "../data/inputs");
const OUTPUT_DIR = path.resolve(__dirname, "../src/data");
const AUX_KV_PATH = path.join(OUTPUT_DIR, "cards.aux.kv.json");
const VALIDATION_REPORT_PATH = path.join(OUTPUT_DIR, "cards.aux.validation-report.json");

// Locales to generate localization for (excluding 'en' which is canonical)
const LOCALES = ["de", "fr", "it"] as const;
type Locale = (typeof LOCALES)[number];

/**
 * Localized card data - only translatable fields
 */
export interface LocalizedCardData {
  /** Card name */
  name: string;

  /** Card version/subtitle */
  version: string;

  /** Rules text with symbols */
  rulesText: string;

  /** Structured rules text (CardText) */
  text: CardText;

  /** Flavor text */
  flavorText: string;

  /** Searchable keywords/franchises */
  searchableKeywords: string[];
}

/**
 * Localization data structure - keyed by shortId (gameCardId)
 */
export type LocalizationData = Record<string, LocalizedCardData>;

/**
 * Load CardsAuxKv from JSON
 */
function loadAuxKv(): CardsAuxKv {
  if (!fs.existsSync(AUX_KV_PATH)) {
    throw new Error(`cards.aux.kv.json not found at ${AUX_KV_PATH}. Run generate-cards:all first.`);
  }
  const content = fs.readFileSync(AUX_KV_PATH, "utf-8");
  return JSON.parse(content) as CardsAuxKv;
}

/**
 * Load Ravensburger input JSON for a locale
 */
function loadRavensburgerJson(locale?: string): RavensburgerInputJson {
  const filename = locale ? `ravensburger-input-${locale}.json` : "ravensburger-input.json";
  const filePath = path.join(INPUT_DIR, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData) as RavensburgerInputJson;
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
 * Recursively sort object keys for deterministic output
 */
function sortKeysDeep<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortKeysDeep) as unknown as T;
  }

  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortKeysDeep((obj as Record<string, unknown>)[key]);
  }
  return sorted as T;
}

/**
 * Extract all cards from Ravensburger data
 */
function getAllCards(data: RavensburgerInputJson): InputCard[] {
  return [
    ...(data.cards.characters || []),
    ...(data.cards.locations || []),
    ...(data.cards.items || []),
    ...(data.cards.actions || []),
  ];
}

/**
 * Build a localized card payload with normalized string rulesText and structured CardText.
 */
export function buildLocalizedCardData(card: InputCard, locale: Locale): LocalizedCardData {
  const rulesText = stripReminderText(
    normalizeCardTextContent(card.rules_text ?? "").trim(),
    locale,
  );

  return {
    name: card.name,
    version: card.subtitle || "",
    rulesText,
    text: splitCardText(rulesText),
    flavorText: card.flavor_text || "",
    searchableKeywords: card.searchable_keywords || [],
  };
}

/**
 * Generate localization data using culture_invariant_id mapping.
 * Returns localization keyed by shortId and validation results.
 */
function generateLocalizationWithCultureId(
  cards: InputCard[],
  auxKv: CardsAuxKv,
  locale: Locale,
): {
  localization: LocalizationData;
  errors: string[];
  warnings: string[];
  stats: {
    totalCards: number;
    mappedCards: number;
    missingCultureId: number;
    unknownCultureId: number;
  };
} {
  const localization: LocalizationData = {};
  const errors: string[] = [];
  const warnings: string[] = [];

  let missingCultureId = 0;
  let unknownCultureId = 0;
  let mappedCards = 0;

  // Track culture_invariant_id usage for duplicate detection
  const usedCultureIds = new Map<number, string[]>();

  for (const card of cards) {
    // Compute fullName once for this card
    const fullName = card.subtitle ? `${card.name} - ${card.subtitle}` : card.name;

    // Card must have culture_invariant_id for mapping
    if (card.culture_invariant_id == null) {
      missingCultureId++;
      warnings.push(`Card "${fullName}" missing culture_invariant_id`);
      continue;
    }

    // Look up shortId via culture_invariant_id
    const cultureIdStr = card.culture_invariant_id.toString();
    const shortId = auxKv.localizationShortIdByCultureInvariantId[cultureIdStr];

    if (!shortId) {
      unknownCultureId++;
      errors.push(
        `Unknown culture_invariant_id: ${card.culture_invariant_id} for card "${fullName}" (${locale})`,
      );
      continue;
    }

    // Check for duplicate culture_invariant_id usage
    const existing = usedCultureIds.get(card.culture_invariant_id) ?? [];
    existing.push(fullName);
    usedCultureIds.set(card.culture_invariant_id, existing);

    localization[shortId] = buildLocalizedCardData(card, locale);
    mappedCards++;
  }

  // Report duplicate culture_invariant_id in locale payload
  for (const [cultureId, names] of usedCultureIds) {
    if (names.length > 1) {
      errors.push(
        `Duplicate culture_invariant_id ${cultureId} in ${locale} payload: ${names.join(", ")}`,
      );
    }
  }

  return {
    localization,
    errors,
    warnings,
    stats: {
      totalCards: cards.length,
      mappedCards,
      missingCultureId,
      unknownCultureId,
    },
  };
}

/**
 * Validate localization against EN canonical cards using aux KV.
 * Checks:
 * - All EN cards with culture_invariant_id have locale entry
 * - No extra locale entries that don't exist in EN
 */
function validateLocalization(
  auxKv: CardsAuxKv,
  localization: LocalizationData,
  locale: string,
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missing: string[];
  extra: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Get all shortIds that should have localization (from culture_invariant_id mapping)
  const expectedShortIds = new Set(Object.values(auxKv.localizationShortIdByCultureInvariantId));
  const localizedShortIds = new Set(Object.keys(localization));

  // Find missing: expected but not in localization
  const missing: string[] = [];
  for (const shortId of expectedShortIds) {
    if (!localizedShortIds.has(shortId)) {
      missing.push(shortId);
    }
  }

  // Find extra: in localization but not expected
  const extra: string[] = [];
  for (const shortId of localizedShortIds) {
    if (!expectedShortIds.has(shortId)) {
      extra.push(shortId);
    }
  }

  if (missing.length > 0) {
    errors.push(`${missing.length} cards missing in ${locale} localization`);
    // Show first few examples
    for (const shortId of missing.slice(0, 3)) {
      const canonicalId = auxKv.canonicalIdByShortId[shortId];
      errors.push(`  - shortId ${shortId} (canonicalId: ${canonicalId})`);
    }
  }

  if (extra.length > 0) {
    errors.push(`${extra.length} extra cards in ${locale} localization not in EN mapping`);
    for (const shortId of extra.slice(0, 3)) {
      errors.push(`  - shortId ${shortId}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missing,
    extra,
  };
}

/**
 * Update the validation report with localization section
 */
function updateValidationReport(
  locale: Locale,
  result: {
    valid: boolean;
    errors: string[];
    warnings: string[];
    stats: {
      totalCards: number;
      mappedCards: number;
      missingCultureId: number;
      unknownCultureId: number;
    };
    missing: string[];
    extra: string[];
  },
): void {
  let report: {
    localization: {
      status: string;
      errors: string[];
      warnings: string[];
      counts: Record<string, number>;
      byLocale: Record<string, { status: string; errors: string[]; warnings: string[] }>;
    };
  };

  if (fs.existsSync(VALIDATION_REPORT_PATH)) {
    const content = fs.readFileSync(VALIDATION_REPORT_PATH, "utf-8");
    report = JSON.parse(content);
    // Ensure all required fields exist
    if (!report.localization) {
      report.localization = {
        status: "pass",
        errors: [],
        warnings: [],
        counts: {},
        byLocale: {},
      };
    }
    if (!report.localization.byLocale) {
      report.localization.byLocale = {};
    }
  } else {
    report = {
      localization: {
        status: "pass",
        errors: [],
        warnings: [],
        counts: {},
        byLocale: {},
      },
    };
  }

  // Update localization section
  report.localization.byLocale[locale] = {
    status: result.valid ? "pass" : "fail",
    errors: result.errors,
    warnings: result.warnings,
  };

  // Aggregate errors across all locales
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  for (const loc of Object.keys(report.localization.byLocale)) {
    const locData = report.localization.byLocale[loc];
    if (locData) {
      allErrors.push(...locData.errors);
      allWarnings.push(...locData.warnings);
    }
  }

  report.localization.errors = allErrors;
  report.localization.warnings = allWarnings;
  report.localization.status = allErrors.length > 0 ? "fail" : "pass";
  report.localization.counts = {
    ...result.stats,
    missing: result.missing.length,
    extra: result.extra.length,
  };

  writeJson("cards.aux.validation-report.json", sortKeysDeep(report));
}

/**
 * Generate localization for a single locale
 */
function generateLocaleLocalization(
  locale: Locale,
  auxKv: CardsAuxKv,
): {
  success: boolean;
  errors: string[];
  warnings: string[];
} {
  console.log(`\n📝 Generating ${locale.toUpperCase()} localization...`);

  // Load localized Ravensburger data
  const ravensburgerData = loadRavensburgerJson(locale);
  const cards = getAllCards(ravensburgerData);
  console.log(`  📊 ${cards.length} cards to process`);

  // Generate localization using culture_invariant_id
  const generation = generateLocalizationWithCultureId(cards, auxKv, locale);

  if (generation.warnings.length > 0) {
    for (const warning of generation.warnings.slice(0, 5)) {
      console.log(`  ⚠️ ${warning}`);
    }
    if (generation.warnings.length > 5) {
      console.log(`  ... and ${generation.warnings.length - 5} more warnings`);
    }
  }

  console.log(
    `  📊 Mapped: ${generation.stats.mappedCards}/${generation.stats.totalCards} (missing culture_id: ${generation.stats.missingCultureId}, unknown: ${generation.stats.unknownCultureId})`,
  );

  // Validate against EN canonical
  const validation = validateLocalization(auxKv, generation.localization, locale);

  // Show validation errors
  if (validation.errors.length > 0) {
    for (const error of validation.errors.slice(0, 5)) {
      console.log(`  ❌ ${error}`);
    }
    if (validation.errors.length > 5) {
      console.log(`  ... and ${validation.errors.length - 5} more errors`);
    }
  }

  // Treat unknown culture_invariant_id as warnings rather than errors
  // These are often promo/gift cards that don't have EN equivalents
  const hasHardErrors = validation.errors.length > 0;
  const allErrors = hasHardErrors ? validation.errors : [];
  const allWarnings = [...generation.warnings, ...validation.warnings, ...generation.errors];

  // Update validation report (even if failing)
  updateValidationReport(locale, {
    valid: !hasHardErrors,
    errors: allErrors,
    warnings: allWarnings,
    stats: generation.stats,
    missing: validation.missing,
    extra: validation.extra,
  });

  // Write localization file if no hard validation errors
  // (unknown culture_invariant_id is treated as a warning)
  if (!hasHardErrors) {
    writeJson(`localization-${locale}.json`, generation.localization);
    if (generation.errors.length > 0) {
      console.log(
        `  ⚠️ Localization written with ${generation.errors.length} warnings (unknown cards skipped)`,
      );
    } else {
      console.log(`  ✅ All cards matched and localization written`);
    }
    return { success: true, errors: [], warnings: allWarnings };
  } else {
    console.log(`  ❌ Validation failed - localization file NOT written`);
    return { success: false, errors: allErrors, warnings: allWarnings };
  }
}

/**
 * Generate all localization files
 */
async function generateAllLocalizations(): Promise<void> {
  console.log("🌍 Generating localization files...");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load aux KV (required for culture_invariant_id mapping)
  const auxKv = loadAuxKv();
  console.log(
    `  🔑 Loaded aux KV (${Object.keys(auxKv.localizationShortIdByCultureInvariantId).length} culture_invariant_id mappings)`,
  );

  // Check that input files exist
  for (const locale of LOCALES) {
    const inputFile = path.join(INPUT_DIR, `ravensburger-input-${locale}.json`);
    if (!fs.existsSync(inputFile)) {
      console.error(`\n❌ Missing input file: ${inputFile}`);
      console.error(`   Run 'bun scripts/fetch-inputs.ts' first to fetch all locales.`);
      process.exit(1);
    }
  }

  // Track results for all locales
  const results: Record<string, { success: boolean; errors: string[]; warnings: string[] }> = {};

  // Generate each locale
  for (const locale of LOCALES) {
    results[locale] = generateLocaleLocalization(locale, auxKv);
  }

  // Generate summary
  console.log("\n📊 Localization Summary:");
  let hasErrors = false;
  for (const locale of LOCALES) {
    const result = results[locale];
    const outputFile = path.join(OUTPUT_DIR, `localization-${locale}.json`);
    const exists = fs.existsSync(outputFile);

    if (result?.success && exists) {
      const stats = fs.statSync(outputFile);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`  ${locale.toUpperCase()}: ${sizeKB} KB ✅`);
    } else {
      console.log(`  ${locale.toUpperCase()}: FAILED ❌`);
      hasErrors = true;
    }

    if (result?.errors.length) {
      hasErrors = true;
    }
  }

  if (hasErrors) {
    throw new Error("Localization generation failed due to validation errors");
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    await generateAllLocalizations();
    console.log("\n🎉 Localization generation complete!");
  } catch (error) {
    console.error("\n❌ Error generating localization:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  void main();
}
