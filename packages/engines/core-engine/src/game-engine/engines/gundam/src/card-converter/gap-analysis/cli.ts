#!/usr/bin/env bun

/**
 * CLI tool for running gap analysis on Gundam card data
 */

import { GapAnalyzer } from "./gap-analyzer";

async function main() {
  const analyzer = new GapAnalyzer();

  console.log("🔍 Starting Gundam Card Gap Analysis...\n");

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
    console.log("📊 Gap Analysis Results");
    console.log("========================\n");

    console.log("📥 Import Data Analysis:");
    console.log(
      `  • Total cards analyzed: ${report.importAnalysis.totalCards}`,
    );
    console.log(
      `  • Unique fields found: ${Object.keys(report.importAnalysis.fieldUsage).length}`,
    );
    console.log(
      `  • Card types: ${Object.keys(report.importAnalysis.cardTypeDistribution).join(", ")}`,
    );
    console.log(
      `  • Sets: ${Object.keys(report.importAnalysis.setDistribution).join(", ")}\n`,
    );

    console.log("🔧 Type System Analysis:");
    console.log(
      `  • Defined types found: ${report.typeAnalysis.definedTypes.length}`,
    );
    console.log(
      `  • Missing fields identified: ${report.typeAnalysis.missingFields.length}`,
    );
    console.log(
      `  • Incomplete types: ${report.typeAnalysis.incompleteTypes.length}\n`,
    );

    console.log("📋 Game Rules Analysis:");
    console.log(
      `  • Timing keywords: ${report.rulesAnalysis.timingKeywords.length}`,
    );
    console.log(
      `  • Keyword effects: ${report.rulesAnalysis.keywordEffects.length}`,
    );
    console.log(
      `  • Game mechanics: ${report.rulesAnalysis.gameMechanics.length}`,
    );
    console.log(
      `  • Missing implementations: ${report.rulesAnalysis.missingImplementations.length}\n`,
    );

    console.log("🚨 Identified Gaps:");
    console.log(`  • Missing fields: ${report.gaps.missingFields.length}`);
    console.log(
      `  • Missing abilities: ${report.gaps.missingAbilities.length}`,
    );
    console.log(`  • Missing effects: ${report.gaps.missingEffects.length}`);
    console.log(
      `  • Type improvements needed: ${report.gaps.typeImprovements.length}\n`,
    );

    console.log(`⚡ Overall Priority: ${report.priority.toUpperCase()}\n`);

    console.log("💡 Top Recommendations:");
    report.recommendations.slice(0, 5).forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });

    if (report.recommendations.length > 5) {
      console.log(
        `  ... and ${report.recommendations.length - 5} more recommendations\n`,
      );
    }

    // Show some detailed examples
    console.log("\n📋 Critical Missing Fields:");
    const criticalFields = report.gaps.missingFields
      .filter((f) => f.impact === "critical")
      .slice(0, 5);

    criticalFields.forEach((field) => {
      console.log(
        `  • ${field.fieldName} (used in ${field.usage.percentage}% of cards)`,
      );
    });

    console.log("\n🎯 High-Frequency Timing Keywords:");
    report.rulesAnalysis.timingKeywords.slice(0, 8).forEach((keyword) => {
      console.log(`  • 【${keyword}】`);
    });

    console.log("\n✨ Keyword Effects Found:");
    report.rulesAnalysis.keywordEffects.forEach((effect) => {
      console.log(`  • <${effect}>`);
    });

    console.log("\n✅ Gap analysis completed successfully!");
  } catch (error) {
    console.error("❌ Error during gap analysis:", error);
    process.exit(1);
  }
}

// Run the CLI if this file is executed directly
if (import.meta.main) {
  main();
}
