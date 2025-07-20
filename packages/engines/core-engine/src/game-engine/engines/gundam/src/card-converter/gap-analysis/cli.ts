#!/usr/bin/env bun

/**
 * CLI tool for running gap analysis on Gundam card data
 */

import { logger } from "~/shared/logger";
import { GapAnalyzer } from "./gap-analyzer";

async function main() {
  const analyzer = new GapAnalyzer();

  logger.log("🔍 Starting Gundam Card Gap Analysis...\n");

  try {
    // Define file paths
    const importFiles = [
      "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/imports/st01.json",
      "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/imports/st02.json",
      "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/imports/st03.json",
      "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/imports/st04.json",
      "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/imports/gd01.json",
    ];

    const typesFile =
      "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/definitions/improved-card-types.ts";
    const rulesFile =
      "packages/engines/core-engine/src/game-engine/engines/gundam/RULES.md";

    // Run complete analysis
    const report = await analyzer.runCompleteAnalysis(
      importFiles,
      typesFile,
      rulesFile,
    );

    // Display results
    logger.log("📊 Gap Analysis Results");
    logger.log("========================\n");

    logger.log("📥 Import Data Analysis:");
    logger.log(`  • Total cards analyzed: ${report.importAnalysis.totalCards}`);
    logger.log(
      `  • Unique fields found: ${Object.keys(report.importAnalysis.fieldUsage).length}`,
    );
    logger.log(
      `  • Card types: ${Object.keys(report.importAnalysis.cardTypeDistribution).join(", ")}`,
    );
    logger.log(
      `  • Sets: ${Object.keys(report.importAnalysis.setDistribution).join(", ")}\n`,
    );

    logger.log("🔧 Type System Analysis:");
    logger.log(
      `  • Defined types found: ${report.typeAnalysis.definedTypes.length}`,
    );
    logger.log(
      `  • Missing fields identified: ${report.typeAnalysis.missingFields.length}`,
    );
    logger.log(
      `  • Incomplete types: ${report.typeAnalysis.incompleteTypes.length}\n`,
    );

    logger.log("📋 Game Rules Analysis:");
    logger.log(
      `  • Timing keywords: ${report.rulesAnalysis.timingKeywords.length}`,
    );
    logger.log(
      `  • Keyword effects: ${report.rulesAnalysis.keywordEffects.length}`,
    );
    logger.log(
      `  • Game mechanics: ${report.rulesAnalysis.gameMechanics.length}`,
    );
    logger.log(
      `  • Missing implementations: ${report.rulesAnalysis.missingImplementations.length}\n`,
    );

    logger.log("🚨 Identified Gaps:");
    logger.log(`  • Missing fields: ${report.gaps.missingFields.length}`);
    logger.log(`  • Missing abilities: ${report.gaps.missingAbilities.length}`);
    logger.log(`  • Missing effects: ${report.gaps.missingEffects.length}`);
    logger.log(
      `  • Type improvements needed: ${report.gaps.typeImprovements.length}\n`,
    );

    logger.log(`⚡ Overall Priority: ${report.priority.toUpperCase()}\n`);

    logger.log("💡 Top Recommendations:");
    report.recommendations.slice(0, 5).forEach((rec, index) => {
      logger.log(`  ${index + 1}. ${rec}`);
    });

    if (report.recommendations.length > 5) {
      logger.log(
        `  ... and ${report.recommendations.length - 5} more recommendations\n`,
      );
    }

    // Show some detailed examples
    logger.log("\n📋 Critical Missing Fields:");
    const criticalFields = report.gaps.missingFields
      .filter((f) => f.impact === "critical")
      .slice(0, 5);

    for (const field of criticalFields) {
      logger.log(
        `  • ${field.fieldName} (used in ${field.usage.percentage}% of cards)`,
      );
    }

    logger.log("\n🎯 High-Frequency Timing Keywords:");
    report.rulesAnalysis.timingKeywords.slice(0, 8).forEach((keyword) => {
      logger.log(`  • 【${keyword}】`);
    });

    logger.log("\n✨ Keyword Effects Found:");
    for (const effect of report.rulesAnalysis.keywordEffects) {
      logger.log(`  • <${effect}>`);
    }

    logger.log("\n✅ Gap analysis completed successfully!");
  } catch (error) {
    logger.error("❌ Error during gap analysis:", error);
    process.exit(1);
  }
}

// Run the CLI if this file is executed directly
if (import.meta.main) {
  main();
}
