#!/usr/bin/env bun
/**
 * Unified orchestrator for card text generation and pattern extraction
 *
 * Usage:
 *   bun run index.ts [command] [options]
 *
 * Commands:
 *   generate       Generate the card texts file
 *   extract        Extract patterns from card texts
 *   all            Generate texts and extract patterns (default)
 *   report         Generate pattern analysis report
 *   export-json    Export patterns as JSON
 *   export-ts      Export patterns as TypeScript
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import {
  exportPatternsJSON,
  exportPatternsTypeScript,
  extractPatterns,
  formatPatternReport,
  type PatternAnalysis,
} from "./extract-patterns";

// Import the generate function from generate.ts
// Note: Assuming generate.ts exports a function we can call
async function generateCardTexts(): Promise<void> {
  console.log("📝 Generating card texts...");

  try {
    // Execute the generate.ts script
    const { spawnSync } = await import("child_process");
    const result = spawnSync("bun", ["run", join(__dirname, "generate.ts")], {
      stdio: "inherit",
      cwd: __dirname,
    });

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      throw new Error(`Generate script exited with code ${result.status}`);
    }

    console.log("✅ Card texts generated successfully\n");
  } catch (error) {
    console.error("❌ Error generating card texts:", error);
    throw error;
  }
}

async function extractAndAnalyzePatterns(): Promise<PatternAnalysis> {
  console.log("🔍 Extracting patterns from card texts...");

  try {
    const analysis = extractPatterns();

    console.log("✅ Pattern extraction complete");
    console.log(`   - Total unique texts: ${analysis.totalTexts}`);
    console.log(`   - Total unique patterns: ${analysis.totalPatterns}`);
    console.log(
      `   - Categories: ${Object.keys(analysis.categoryCounts).length}\n`,
    );

    return analysis;
  } catch (error) {
    console.error("❌ Error extracting patterns:", error);
    throw error;
  }
}

async function generateReport(
  analysis: PatternAnalysis,
  outputDir: string,
): Promise<void> {
  console.log("📊 Generating pattern analysis report...");

  try {
    const report = formatPatternReport(analysis);
    const reportPath = join(outputDir, "pattern-analysis-report.md");

    writeFileSync(reportPath, report, "utf-8");
    console.log(`✅ Report saved to: ${reportPath}\n`);
  } catch (error) {
    console.error("❌ Error generating report:", error);
    throw error;
  }
}

async function exportJSON(
  analysis: PatternAnalysis,
  outputDir: string,
): Promise<void> {
  console.log("💾 Exporting patterns as JSON...");

  try {
    const json = exportPatternsJSON(analysis);
    const jsonPath = join(outputDir, "patterns.json");

    writeFileSync(jsonPath, json, "utf-8");
    console.log(`✅ JSON saved to: ${jsonPath}\n`);
  } catch (error) {
    console.error("❌ Error exporting JSON:", error);
    throw error;
  }
}

async function exportTypeScript(
  analysis: PatternAnalysis,
  outputDir: string,
): Promise<void> {
  console.log("📦 Exporting patterns as TypeScript...");

  try {
    const ts = exportPatternsTypeScript(analysis);
    const tsPath = join(outputDir, "patterns.generated.ts");

    writeFileSync(tsPath, ts, "utf-8");
    console.log(`✅ TypeScript saved to: ${tsPath}\n`);
  } catch (error) {
    console.error("❌ Error exporting TypeScript:", error);
    throw error;
  }
}

function printTopPatterns(analysis: PatternAnalysis, count = 10): void {
  console.log(`\n📈 Top ${count} Most Frequent Patterns:\n`);

  for (let i = 0; i < Math.min(count, analysis.topPatterns.length); i++) {
    const pattern = analysis.topPatterns[i];
    console.log(`${i + 1}. [${pattern.category}] ${pattern.template}`);
    console.log(`   Frequency: ${pattern.frequency}x`);
    if (pattern.examples.length > 0) {
      console.log(`   Example: "${pattern.examples[0]}"`);
    }
    console.log();
  }
}

function printCategorySummary(analysis: PatternAnalysis): void {
  console.log("\n📊 Category Summary:\n");

  const sortedCategories = Object.entries(analysis.categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 0)
    .slice(0, 15);

  for (const [category, count] of sortedCategories) {
    const percentage = ((count / analysis.totalPatterns) * 100).toFixed(1);
    console.log(
      `  ${category.padEnd(25)} ${count.toString().padStart(4)} (${percentage}%)`,
    );
  }
  console.log();
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] || "all";
  const outputDir = join(__dirname, "output");

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log("🎮 Lorcana Card Text Pattern Analyzer");
  console.log("=====================================\n");

  try {
    let analysis: PatternAnalysis | null = null;

    switch (command) {
      case "generate":
        await generateCardTexts();
        break;

      case "extract":
        analysis = await extractAndAnalyzePatterns();
        printCategorySummary(analysis);
        printTopPatterns(analysis, 10);
        break;

      case "report":
        analysis = await extractAndAnalyzePatterns();
        await generateReport(analysis, outputDir);
        printCategorySummary(analysis);
        printTopPatterns(analysis, 10);
        break;

      case "export-json":
        analysis = await extractAndAnalyzePatterns();
        await exportJSON(analysis, outputDir);
        break;

      case "export-ts":
        analysis = await extractAndAnalyzePatterns();
        await exportTypeScript(analysis, outputDir);
        break;

      case "all":
      default:
        // Generate card texts first
        await generateCardTexts();

        // Extract patterns
        analysis = await extractAndAnalyzePatterns();

        // Generate all outputs
        await generateReport(analysis, outputDir);
        await exportJSON(analysis, outputDir);
        await exportTypeScript(analysis, outputDir);

        // Print summaries
        printCategorySummary(analysis);
        printTopPatterns(analysis, 15);

        console.log("✨ All tasks completed successfully!");
        console.log(`📁 Output files saved to: ${outputDir}\n`);
        break;
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
}

export { main };
