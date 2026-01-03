#!/usr/bin/env bun
/**
 * Parser Coverage Validation Script
 *
 * Tests the v2 parser against all legacy cards in a set to measure coverage.
 *
 * Usage:
 *   bun run validate-parser              # Run validation
 *   bun run validate-parser --verbose    # Detailed output
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parserV2 } from "../src/parser/v2/index.js";

// Types for validation results
interface ParseResult {
  cardId: string;
  cardName: string;
  abilityText: string;
  parseSuccess: boolean;
  parseMethod: "manual" | "keyword" | "grammar" | "text-based" | "failed";
  parsedAbility?: unknown;
  error?: string;
}

interface CoverageReport {
  runDate: string;
  set: string;
  totalCards: number;
  totalAbilities: number;
  successfullyParsed: number;
  manualOverrides: number;
  grammarParsed: number;
  textBasedParsed: number;
  failedParses: number;
  coveragePercentage: number;
  results: ParseResult[];
  failurePatterns: Record<string, number>;
}

// Configuration
const VERBOSE = process.argv.includes("--verbose");

/**
 * Get the absolute path to the legacy cards directory
 */
function getLegacyDir(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, "../src/legacy-cards/001");
}

/**
 * Recursively get all TypeScript files (excluding tests)
 */
function getTsFiles(dir: string, baseDir: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getTsFiles(fullPath, baseDir));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".spec.ts") &&
      !entry.name.endsWith(".test.ts") &&
      entry.name !== "index.ts" &&
      !entry.name.includes("characters.ts") &&
      !entry.name.includes("actions.ts") &&
      !entry.name.includes("items.ts") &&
      !entry.name.includes("songs.ts")
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract ability texts from a legacy card file
 */
function extractAbilityTexts(filePath: string): string[] {
  try {
    const content = readFileSync(filePath, "utf-8");
    const abilityTexts: string[] = [];

    // Extract the text property
    const textMatch = content.match(/text:\s*["']((?:[^"']|\\')*)["']/);
    if (textMatch) {
      const cardText = textMatch[1].replace(/\\'/g, "'");
      // Split by ability name patterns (all caps followed by ability text)
      // e.g., "**ABILITY NAME** effect text" or just individual sentences
      const parts = cardText.split(/\*\*[A-Z][A-Z\s!?']+\\*\*\s*/);
      for (const part of parts) {
        const trimmed = part.trim();
        // Filter out empty strings and very short strings
        if (trimmed && trimmed.length > 15) {
          abilityTexts.push(trimmed);
        }
      }
    }

    // Also look for individual text strings in abilities array
    const abilityStringMatches = content.match(
      /text:\s*["']((?:[^"']|\\'){20,})["']/g,
    );
    if (abilityStringMatches) {
      for (const match of abilityStringMatches) {
        const textMatch = match.match(/text:\s*["']((?:[^"']|\\')*)["']/);
        if (textMatch) {
          const text = textMatch[1].replace(/\\'/g, "'");
          if (!abilityTexts.includes(text) && text.length > 15) {
            abilityTexts.push(text);
          }
        }
      }
    }

    return abilityTexts;
  } catch (error) {
    if (VERBOSE) {
      console.warn(`Warning: Could not read ${filePath}:`, error);
    }
    return [];
  }
}

/**
 * Get card name from file path
 */
function getCardName(filePath: string, baseDir: string): string {
  const fileName = filePath.split("/").pop() || "";
  const withoutExt = fileName.replace(/\.ts$/, "");
  return withoutExt;
}

/**
 * Parse ability and determine which method succeeded
 */
function determineParseMethod(
  text: string,
): "manual" | "keyword" | "grammar" | "text-based" | "failed" {
  const trimmed = text.trim();

  // Check for keyword patterns
  const keywordPattern =
    /^(?:Rush|Ward|Evasive|Support|Bodyguard|Singer\s+\d+|Shift\s+\d+|Reckless|Challenger\s+\+\d+|Resist\s+\+\d+|Vanish\s+\d+|Alert)$/i;
  if (keywordPattern.test(trimmed)) {
    return "keyword";
  }

  // Try grammar parsing (triggered, activated, static patterns)
  const grammarPatterns = [
    /^(When|Whenever|At the (?:start|end) of|The first time)/i,
    /—/, // Activated abilities
    /^(?:While |Your characters |This character can'?t |This item)/i, // Static
  ];
  if (grammarPatterns.some((pattern) => pattern.test(trimmed))) {
    return "grammar";
  }

  // Text-based patterns (action effects, etc.)
  const textBasedPatterns = [
    /^(?:Draw|Discard|Deal|Gain|Lose|Banish|Return|Look at|Shuffle|Reveal|Exert|Ready|Move|Put|Choose)/i,
  ];
  if (textBasedPatterns.some((pattern) => pattern.test(trimmed))) {
    return "text-based";
  }

  return "failed";
}

/**
 * Categorize parse failures by pattern
 */
function categorizeFailure(text: string): string {
  const trimmed = text.trim();

  // Complex triggered abilities
  if (/\.\s*Then,/.test(trimmed)) return "Multi-step triggered";
  if (/\.\s*If you do,/.test(trimmed)) return "Conditional follow-up";

  // Complex targeting
  if (/chosen opposing character/.test(trimmed)) return "Complex targeting";
  if (/for each/i.test(trimmed)) return "For-each effects";

  // Complex conditions
  if (/If you have/i.test(trimmed)) return "Conditional (has cards)";
  if (/While you have/i.test(trimmed)) return "Static conditional";

  // Multi-ability cards
  if (/ {2,}/.test(trimmed)) return "Multiple abilities";

  // Cost reduction
  if (/pay \{d\} \{I\} less/i.test(trimmed)) return "Cost reduction";

  // Named cards
  if (/named [A-Z]/i.test(trimmed)) return "Named card reference";

  // Discard until
  if (/discard until they have/i.test(trimmed)) return "Discard until";

  return "Other";
}

/**
 * Run validation on all legacy cards
 */
function runValidation(): CoverageReport {
  const legacyDir = getLegacyDir();
  console.log(`Reading legacy cards from: ${legacyDir}`);

  const files = getTsFiles(legacyDir, legacyDir);
  console.log(`Found ${files.length} card files\n`);

  const results: ParseResult[] = [];
  const failurePatterns: Record<string, number> = {};

  let totalAbilities = 0;
  let successfullyParsed = 0;
  let grammarParsed = 0;
  let textBasedParsed = 0;
  let failedParses = 0;

  for (const filePath of files) {
    const cardName = getCardName(filePath, legacyDir);
    const abilityTexts = extractAbilityTexts(filePath);

    if (abilityTexts.length === 0) {
      continue;
    }

    if (VERBOSE) {
      console.log(`\nProcessing: ${cardName}`);
      console.log(`Abilities: ${abilityTexts.length}`);
    }

    for (const abilityText of abilityTexts) {
      totalAbilities++;

      if (VERBOSE) {
        console.log(`  Testing: "${abilityText.substring(0, 60)}..."`);
      }

      // Parse ability with parser
      const parsed = parserV2.parseAbility(abilityText);

      // Determine parse method
      let parseMethod:
        | "manual"
        | "keyword"
        | "grammar"
        | "text-based"
        | "failed";
      if (parsed) {
        parseMethod = determineParseMethod(abilityText);
        if (parseMethod === "keyword") {
          successfullyParsed++;
        } else if (parseMethod === "grammar") {
          grammarParsed++;
          successfullyParsed++;
        } else if (parseMethod === "text-based") {
          textBasedParsed++;
          successfullyParsed++;
        }
      } else {
        parseMethod = "failed";
        failedParses++;

        // Categorize failure pattern
        const pattern = categorizeFailure(abilityText);
        failurePatterns[pattern] = (failurePatterns[pattern] || 0) + 1;
      }

      results.push({
        cardId: cardName,
        cardName,
        abilityText,
        parseSuccess: !!parsed,
        parseMethod,
        parsedAbility: parsed,
        error: parsed ? undefined : "Failed to parse",
      });
    }
  }

  return {
    runDate: new Date().toISOString(),
    set: "001",
    totalCards: files.length,
    totalAbilities,
    successfullyParsed,
    manualOverrides: 0,
    grammarParsed,
    textBasedParsed,
    failedParses,
    coveragePercentage:
      totalAbilities > 0 ? (successfullyParsed / totalAbilities) * 100 : 0,
    results,
    failurePatterns,
  };
}

/**
 * Print summary report
 */
function printSummary(report: CoverageReport): void {
  console.log("\n" + "=".repeat(60));
  console.log("PARSER COVERAGE REPORT");
  console.log("=".repeat(60));
  console.log(`Set: ${report.set}`);
  console.log(`Run Date: ${report.runDate}`);
  console.log("");
  console.log(`Total Cards: ${report.totalCards}`);
  console.log(`Total Abilities: ${report.totalAbilities}`);
  console.log("");
  console.log("Parse Results:");
  console.log(
    `  Successfully Parsed: ${report.successfullyParsed}/${report.totalAbilities} (${report.coveragePercentage.toFixed(1)}%)`,
  );
  console.log(`    - Grammar-based: ${report.grammarParsed}`);
  console.log(`    - Text-based: ${report.textBasedParsed}`);
  console.log(
    `    - Keywords: ${report.successfullyParsed - report.grammarParsed - report.textBasedParsed}`,
  );
  console.log(
    `  Failed Parses: ${report.failedParses}/${report.totalAbilities}`,
  );
  console.log("");

  if (Object.keys(report.failurePatterns).length > 0) {
    console.log("Failure Patterns:");
    const sortedPatterns = Object.entries(report.failurePatterns).sort(
      (a, b) => b[1] - a[1],
    );
    for (const [pattern, count] of sortedPatterns) {
      console.log(`  - ${pattern}: ${count}`);
    }
    console.log("");
  }

  console.log("=".repeat(60));

  if (report.failedParses > 0) {
    console.log("\nFailed Parses:");
    const failures = report.results.filter((r) => !r.parseSuccess);
    for (const failure of failures.slice(0, 10)) {
      console.log(`\n  [${failure.cardName}]`);
      console.log(`  Text: "${failure.abilityText.substring(0, 100)}..."`);
    }
    if (failures.length > 10) {
      console.log(
        `\n  ... and ${failures.length - 10} more (see report file for details)`,
      );
    }
  }

  const outputPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "validation-report-001.json",
  );
  console.log("\nReport saved to:", outputPath);
}

/**
 * Main function
 */
function main() {
  console.log("Parser Coverage Validation Script");
  console.log("==============================\n");

  const report = runValidation();
  printSummary(report);

  // Write report to file
  const outputPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "validation-report-001.json",
  );
  writeFileSync(outputPath, JSON.stringify(report, null, 2));

  console.log("\n✓ Validation complete");

  // Exit with error code if coverage is below threshold
  const THRESHOLD = 80; // 80% coverage target
  if (report.coveragePercentage < THRESHOLD) {
    console.warn(
      `\n⚠ Coverage (${report.coveragePercentage.toFixed(1)}%) is below threshold (${THRESHOLD}%)`,
    );
    process.exit(1);
  }
}

main();
