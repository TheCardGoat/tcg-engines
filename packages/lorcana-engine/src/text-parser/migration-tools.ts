// Migration tools for converting hand-coded abilities to parser-generated ones

import type { ResolutionAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { generateActionAbilitiesFromText, parseActionText } from "./parser";
import { CacheManager } from "./performance-optimizations";

/**
 * Migration result for a single card
 */
export interface CardMigrationResult {
  cardId: string;
  cardName: string;
  originalText: string;
  success: boolean;
  generatedAbilities: ResolutionAbility[];
  originalAbilities: ResolutionAbility[];
  warnings: string[];
  errors: string[];
  differences: string[];
  migrationRecommendation: "auto" | "manual" | "skip";
}

/**
 * Batch migration result
 */
export interface BatchMigrationResult {
  totalCards: number;
  successfulMigrations: number;
  failedMigrations: number;
  autoMigrationCandidates: number;
  manualMigrationCandidates: number;
  skipRecommendations: number;
  results: CardMigrationResult[];
  summary: {
    mostCommonErrors: string[];
    mostCommonWarnings: string[];
    performanceStats: {
      totalTime: number;
      averageTime: number;
    };
  };
}

/**
 * Migration configuration options
 */
export interface MigrationConfig {
  debug?: boolean;
  strictMode?: boolean;
  compareAbilities?: boolean;
  generateReport?: boolean;
  outputPath?: string;
}

/**
 * Migrates a single action card from hand-coded abilities to parser-generated ones
 */
export function migrateActionCard(
  card: LorcanitoActionCard,
  config: MigrationConfig = {},
): CardMigrationResult {
  const startTime = performance.now();

  const result: CardMigrationResult = {
    cardId: card.id,
    cardName: card.name,
    originalText: card.text,
    success: false,
    generatedAbilities: [],
    originalAbilities: (card.abilities || []) as ResolutionAbility[],
    warnings: [],
    errors: [],
    differences: [],
    migrationRecommendation: "skip",
  };

  try {
    // Parse the card text to generate new abilities
    const parseResult = parseActionText(card.text, {
      debug: config.debug,
      strictMode: config.strictMode,
    });

    result.generatedAbilities = parseResult.abilities;
    result.warnings = parseResult.warnings;
    result.errors = parseResult.errors;

    // Determine if migration was successful
    result.success =
      parseResult.errors.length === 0 && parseResult.abilities.length > 0;

    // Compare abilities if requested
    if (config.compareAbilities && result.success) {
      result.differences = compareAbilities(
        result.originalAbilities,
        result.generatedAbilities,
      );
    }

    // Determine migration recommendation
    result.migrationRecommendation = determineMigrationRecommendation(result);

    if (config.debug) {
      const duration = performance.now() - startTime;
      console.log(`Migrated "${card.name}" in ${duration.toFixed(2)}ms`);
      console.log(`- Generated ${result.generatedAbilities.length} abilities`);
      console.log(
        `- ${result.warnings.length} warnings, ${result.errors.length} errors`,
      );
      console.log(`- Recommendation: ${result.migrationRecommendation}`);
    }
  } catch (error) {
    result.errors.push(
      `Migration failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    result.migrationRecommendation = "manual";
  }

  return result;
}

/**
 * Migrates a batch of action cards
 */
export function migrateActionCardBatch(
  cards: LorcanitoActionCard[],
  config: MigrationConfig = {},
): BatchMigrationResult {
  const startTime = performance.now();

  console.log(`Starting migration of ${cards.length} action cards...`);

  // Clear caches for consistent results
  CacheManager.clearAllCaches();

  // Warm up caches with common patterns
  const commonTexts = cards.slice(0, 10).map((card) => card.text);
  CacheManager.warmUpCaches(commonTexts);

  const results: CardMigrationResult[] = [];
  let successCount = 0;
  let failCount = 0;
  let autoCount = 0;
  let manualCount = 0;
  let skipCount = 0;

  // Process each card
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    if (!card) {
      console.log(`Card at index ${i} is undefined, skipping`);
      continue;
    }

    if (config.debug && i % 10 === 0) {
      console.log(`Processing card ${i + 1}/${cards.length}: ${card.name}`);
    }

    const result = migrateActionCard(card, { ...config, debug: false });
    results.push(result);

    // Update counters
    if (result.success) successCount++;
    else failCount++;

    switch (result.migrationRecommendation) {
      case "auto":
        autoCount++;
        break;
      case "manual":
        manualCount++;
        break;
      case "skip":
        skipCount++;
        break;
    }

    // Clear caches periodically to manage memory
    if (i > 0 && i % 100 === 0) {
      CacheManager.clearAllCaches();
    }
  }

  const totalTime = performance.now() - startTime;
  const averageTime = totalTime / cards.length;

  // Analyze common issues
  const allErrors = results.flatMap((r) => r.errors);
  const allWarnings = results.flatMap((r) => r.warnings);

  const errorCounts = countOccurrences(allErrors);
  const warningCounts = countOccurrences(allWarnings);

  const batchResult: BatchMigrationResult = {
    totalCards: cards.length,
    successfulMigrations: successCount,
    failedMigrations: failCount,
    autoMigrationCandidates: autoCount,
    manualMigrationCandidates: manualCount,
    skipRecommendations: skipCount,
    results,
    summary: {
      mostCommonErrors: Object.entries(errorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([error]) => error),
      mostCommonWarnings: Object.entries(warningCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([warning]) => warning),
      performanceStats: {
        totalTime,
        averageTime,
      },
    },
  };

  console.log(`Migration completed in ${totalTime.toFixed(2)}ms`);
  console.log(
    `- Successful: ${successCount}/${cards.length} (${((successCount / cards.length) * 100).toFixed(1)}%)`,
  );
  console.log(`- Auto migration candidates: ${autoCount}`);
  console.log(`- Manual migration candidates: ${manualCount}`);
  console.log(`- Skip recommendations: ${skipCount}`);

  // Generate report if requested
  if (config.generateReport) {
    generateMigrationReport(batchResult, config.outputPath);
  }

  return batchResult;
}

/**
 * Compares original and generated abilities to identify differences
 */
function compareAbilities(
  original: ResolutionAbility[],
  generated: ResolutionAbility[],
): string[] {
  const differences: string[] = [];

  // Compare counts
  if (original.length !== generated.length) {
    differences.push(
      `Ability count differs: original ${original.length}, generated ${generated.length}`,
    );
  }

  // Compare each ability
  const maxLength = Math.max(original.length, generated.length);
  for (let i = 0; i < maxLength; i++) {
    const orig = original[i];
    const gen = generated[i];

    if (!orig && gen) {
      differences.push(
        `Generated ability ${i + 1} has no original counterpart`,
      );
      continue;
    }

    if (orig && !gen) {
      differences.push(
        `Original ability ${i + 1} has no generated counterpart`,
      );
      continue;
    }

    if (!(orig && gen)) continue;

    // Compare types
    if (orig.type !== gen.type) {
      differences.push(
        `Ability ${i + 1} type differs: original ${orig.type}, generated ${gen.type}`,
      );
    }

    // Compare effects if both are resolution abilities
    if (orig.type === "resolution" && gen.type === "resolution") {
      const origEffects = orig.effects || [];
      const genEffects = gen.effects || [];

      if (origEffects.length !== genEffects.length) {
        differences.push(
          `Ability ${i + 1} effect count differs: original ${origEffects.length}, generated ${genEffects.length}`,
        );
      }

      // Compare effect types
      for (
        let j = 0;
        j < Math.max(origEffects.length, genEffects.length);
        j++
      ) {
        const origEffect = origEffects[j];
        const genEffect = genEffects[j];

        if (origEffect?.type !== genEffect?.type) {
          differences.push(
            `Ability ${i + 1} effect ${j + 1} type differs: original ${origEffect?.type}, generated ${genEffect?.type}`,
          );
        }
      }
    }
  }

  return differences;
}

/**
 * Determines the migration recommendation based on the migration result
 */
function determineMigrationRecommendation(
  result: CardMigrationResult,
): "auto" | "manual" | "skip" {
  // Skip if parsing completely failed
  if (!result.success || result.generatedAbilities.length === 0) {
    return "skip";
  }

  // Skip if there are critical errors
  const hasCriticalErrors = result.errors.some(
    (error) =>
      error.includes("missing required") ||
      error.includes("invalid type") ||
      error.includes("parsing failed"),
  );

  if (hasCriticalErrors) {
    return "skip";
  }

  // Auto migration if:
  // - No errors
  // - Minimal warnings
  // - Ability counts match (if original abilities exist)
  const hasMinimalWarnings = result.warnings.length <= 2;
  const abilitiesCountMatch =
    result.originalAbilities.length === 0 ||
    result.originalAbilities.length === result.generatedAbilities.length;

  if (result.errors.length === 0 && hasMinimalWarnings && abilitiesCountMatch) {
    return "auto";
  }

  // Manual migration for everything else
  return "manual";
}

/**
 * Counts occurrences of items in an array
 */
function countOccurrences(items: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item] = (counts[item] || 0) + 1;
  }
  return counts;
}

/**
 * Generates a detailed migration report
 */
function generateMigrationReport(
  result: BatchMigrationResult,
  outputPath?: string,
): void {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalCards: result.totalCards,
      successRate: `${((result.successfulMigrations / result.totalCards) * 100).toFixed(1)}%`,
      recommendations: {
        auto: result.autoMigrationCandidates,
        manual: result.manualMigrationCandidates,
        skip: result.skipRecommendations,
      },
      performance: result.summary.performanceStats,
    },
    commonIssues: {
      errors: result.summary.mostCommonErrors,
      warnings: result.summary.mostCommonWarnings,
    },
    detailedResults: result.results.map((r) => ({
      cardId: r.cardId,
      cardName: r.cardName,
      success: r.success,
      recommendation: r.migrationRecommendation,
      errorCount: r.errors.length,
      warningCount: r.warnings.length,
      differenceCount: r.differences.length,
      errors: r.errors,
      warnings: r.warnings,
      differences: r.differences,
    })),
  };

  const reportJson = JSON.stringify(report, null, 2);

  if (outputPath) {
    // In a real implementation, you would write to file
    console.log(`Migration report would be written to: ${outputPath}`);
  }

  console.log("Migration Report Summary:");
  console.log(JSON.stringify(report.summary, null, 2));
}

/**
 * Creates a new action card with parser-generated abilities
 */
export function createMigratedActionCard(
  originalCard: LorcanitoActionCard,
  migrationResult: CardMigrationResult,
): LorcanitoActionCard {
  if (!migrationResult.success) {
    throw new Error(
      `Cannot create migrated card for ${originalCard.name}: migration was not successful`,
    );
  }

  return {
    ...originalCard,
    abilities: migrationResult.generatedAbilities,
    // Add a comment to indicate this was generated
    // Using a type assertion to add a custom property
    ...({ __generated: true } as any),
    __originalAbilities: originalCard.abilities as any,
  };
}

/**
 * Utility to find cards that need specific patterns
 */
export function findCardsNeedingPatterns(cards: LorcanitoActionCard[]): {
  cardText: string;
  cardNames: string[];
  frequency: number;
}[] {
  const textPatterns: Record<string, string[]> = {};

  // Collect all unique text patterns
  for (const card of cards) {
    const text = card.text.toLowerCase().trim();
    if (!textPatterns[text]) {
      textPatterns[text] = [];
    }
    textPatterns[text].push(card.name);
  }

  // Convert to array and sort by frequency
  return Object.entries(textPatterns)
    .map(([text, names]) => ({
      cardText: text,
      cardNames: names,
      frequency: names.length,
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

/**
 * Analyzes which cards would benefit most from parser migration
 */
export function analyzeMigrationCandidates(cards: LorcanitoActionCard[]): {
  highPriority: LorcanitoActionCard[];
  mediumPriority: LorcanitoActionCard[];
  lowPriority: LorcanitoActionCard[];
  analysis: {
    totalCards: number;
    cardsWithComplexText: number;
    cardsWithSimpleText: number;
    averageTextLength: number;
  };
} {
  const highPriority: LorcanitoActionCard[] = [];
  const mediumPriority: LorcanitoActionCard[] = [];
  const lowPriority: LorcanitoActionCard[] = [];

  let totalTextLength = 0;
  let complexTextCount = 0;

  for (const card of cards) {
    const textLength = card.text.length;
    totalTextLength += textLength;

    const hasComplexText =
      card.text.includes("Choose one:") ||
      card.text.includes("If ") ||
      card.text.includes("When ") ||
      card.text.includes("Whenever ") ||
      card.text.includes("At the end") ||
      card.text.includes("At the beginning");

    if (hasComplexText) {
      complexTextCount++;
    }

    // Prioritize based on text complexity and current ability structure
    const hasHandCodedAbilities = card.abilities && card.abilities.length > 0;
    const isComplex = hasComplexText || textLength > 50;

    if (isComplex && hasHandCodedAbilities) {
      highPriority.push(card);
    } else if (isComplex || hasHandCodedAbilities) {
      mediumPriority.push(card);
    } else {
      lowPriority.push(card);
    }
  }

  return {
    highPriority,
    mediumPriority,
    lowPriority,
    analysis: {
      totalCards: cards.length,
      cardsWithComplexText: complexTextCount,
      cardsWithSimpleText: cards.length - complexTextCount,
      averageTextLength: totalTextLength / cards.length,
    },
  };
}

/**
 * Note: Functions are already exported individually above
 */
