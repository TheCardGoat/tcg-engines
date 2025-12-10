#!/usr/bin/env bun
/**
 * Analyze Complex Card Texts
 *
 * Analyzes all Lorcana card texts to identify which ones are too complex
 * to parse generically and should be added to MANUAL_ENTRIES.
 *
 * Complexity indicators:
 * - Length (>200 characters)
 * - Multiple nested conditions ("if X, if Y, then Z")
 * - Complex choice effects ("Choose one: X or Y or Z")
 * - Multiple sequential effects with complex dependencies
 * - References to other cards by name
 * - Complex state tracking ("for each X you have in play")
 * - Multiple ability names (ALL CAPS prefixes)
 *
 * Usage:
 *   bun packages/lorcana-cards/scripts/analyze-complex-texts.ts
 *
 * Output:
 *   Prints a list of texts that should be considered for manual override,
 *   formatted as TypeScript code that can be copied into manual-overrides.ts
 */

import { allCardsText } from "../../../.claude/skills/lorcana-rules/references/all-cards-text/all-lorcana-texts";
import { parseAbilityText } from "../src/parser/parser";
import { normalizeText } from "../src/parser/preprocessor";

interface ComplexityScore {
  text: string;
  normalizedText: string;
  score: number;
  reasons: string[];
  parseResult?: {
    success: boolean;
    hasWarnings: boolean;
    error?: string;
  };
}

/**
 * Calculate complexity score for a text
 */
function calculateComplexity(text: string): ComplexityScore {
  const normalizedText = normalizeText(text) || text;
  const reasons: string[] = [];
  let score = 0;

  // Length check
  if (text.length > 200) {
    score += 3;
    reasons.push(`Long text (${text.length} chars)`);
  } else if (text.length > 150) {
    score += 2;
    reasons.push(`Moderately long text (${text.length} chars)`);
  } else if (text.length > 100) {
    score += 1;
    reasons.push(`Somewhat long text (${text.length} chars)`);
  }

  // Multiple nested conditions
  const ifCount = (text.match(/\bif\b/gi) || []).length;
  if (ifCount > 2) {
    score += 3;
    reasons.push(`Multiple nested conditions (${ifCount} "if" statements)`);
  } else if (ifCount > 1) {
    score += 2;
    reasons.push(`Nested conditions (${ifCount} "if" statements)`);
  }

  // Complex choice effects
  const choiceMatch = text.match(/choose\s+one:?\s*(.+)/i);
  if (choiceMatch) {
    const choices = choiceMatch[1].split(/\s+or\s+/i).length;
    if (choices > 2) {
      score += 3;
      reasons.push(`Complex choice effect (${choices} options)`);
    } else {
      score += 1;
      reasons.push(`Choice effect (${choices} options)`);
    }
  }

  // Multiple sequential effects (count periods/sentences)
  const sentenceCount = text
    .split(/[.!]\s+/)
    .filter((s) => s.trim().length > 0).length;
  if (sentenceCount > 3) {
    score += 2;
    reasons.push(`Multiple sequential effects (${sentenceCount} sentences)`);
  } else if (sentenceCount > 2) {
    score += 1;
    reasons.push(`Several effects (${sentenceCount} sentences)`);
  }

  // References to other cards by name (proper nouns in quotes or ALL CAPS)
  const cardNameMatches =
    text.match(/named\s+["']?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)["']?/gi) || [];
  if (cardNameMatches.length > 1) {
    score += 2;
    reasons.push(
      `Multiple card name references (${cardNameMatches.length} names)`,
    );
  } else if (cardNameMatches.length > 0) {
    score += 1;
    reasons.push("Card name reference");
  }

  // Complex state tracking
  const forEachMatches =
    text.match(/for\s+each\s+[^,]+(?:,\s*for\s+each\s+[^,]+)*/gi) || [];
  if (forEachMatches.length > 1) {
    score += 2;
    reasons.push(`Multiple "for each" clauses (${forEachMatches.length})`);
  } else if (forEachMatches.length > 0) {
    score += 1;
    reasons.push(`"For each" state tracking`);
  }

  // Multiple ability names (ALL CAPS prefixes)
  const abilityNameMatches = text.match(/^([A-Z][A-Z\s]+[A-Z])\s+/);
  if (abilityNameMatches) {
    const abilityName = abilityNameMatches[1];
    const remainingText = text.substring(abilityName.length).trim();
    // Check if there are multiple ability names in the text
    const additionalNames = remainingText.match(/\b([A-Z][A-Z\s]{3,}[A-Z])\b/g);
    if (additionalNames && additionalNames.length > 0) {
      score += 2;
      reasons.push(
        `Multiple ability names (${additionalNames.length + 1} total)`,
      );
    } else {
      score += 0.5;
      reasons.push("Named ability");
    }
  }

  // Try to parse and check for failures/warnings
  let parseResult: ComplexityScore["parseResult"];
  try {
    const result = parseAbilityText(normalizedText);
    parseResult = {
      success: result.success,
      hasWarnings: (result.warnings?.length || 0) > 0,
      error: result.error,
    };

    if (!result.success) {
      score += 3;
      reasons.push(`Parser failed: ${result.error || "unknown error"}`);
    } else if (result.warnings && result.warnings.length > 0) {
      score += 2;
      reasons.push(
        `Parser warnings (${result.warnings.length}): ${result.warnings.join(", ")}`,
      );
    }
  } catch (error) {
    score += 3;
    reasons.push(`Parser threw error: ${error}`);
    parseResult = {
      success: false,
      hasWarnings: false,
      error: String(error),
    };
  }

  return {
    text,
    normalizedText,
    score,
    reasons,
    parseResult,
  };
}

/**
 * Format a text as a TypeScript string literal (with proper escaping)
 */
function formatTextForTypeScript(text: string): string {
  return JSON.stringify(text);
}

/**
 * Generate TypeScript code for manual entries
 */
function generateManualEntriesCode(complexTexts: ComplexityScore[]): string {
  const lines: string[] = [];
  lines.push("// Manual entries for complex texts");
  lines.push(
    "// Copy these into packages/lorcana-cards/src/parser/manual-overrides.ts",
  );
  lines.push("");
  lines.push(
    "export const MANUAL_ENTRIES: Record<string, AbilityWithText> = {",
  );

  for (const { normalizedText, score, reasons } of complexTexts) {
    lines.push(`  // Score: ${score.toFixed(1)} - ${reasons.join(", ")}`);
    lines.push(`  ${formatTextForTypeScript(normalizedText)}: {`);
    lines.push(`    text: ${formatTextForTypeScript(normalizedText)},`);
    lines.push("    // TODO: Add manual ability structure here");
    lines.push("    ability: {");
    lines.push(
      `      type: "static", // TODO: Update based on actual ability type`,
    );
    lines.push("      // ... add ability structure");
    lines.push("    },");
    lines.push("  },");
    lines.push("");
  }

  lines.push("};");
  return lines.join("\n");
}

/**
 * Main function
 */
function main(): void {
  console.log("🔍 Analyzing card texts for complexity...\n");

  // Calculate complexity for all texts
  const scores = allCardsText.map(calculateComplexity);

  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score);

  // Filter to texts with score >= 3 (complex enough to consider manual override)
  const complexTexts = scores.filter((s) => s.score >= 3);

  console.log(
    `Found ${complexTexts.length} complex texts (score >= 3) out of ${scores.length} total\n`,
  );

  // Show top 20 most complex
  console.log("Top 20 most complex texts:\n");
  for (let i = 0; i < Math.min(20, complexTexts.length); i++) {
    const item = complexTexts[i];
    console.log(`${i + 1}. Score: ${item.score.toFixed(1)}`);
    console.log(
      `   Text: ${item.text.substring(0, 100)}${item.text.length > 100 ? "..." : ""}`,
    );
    console.log(`   Reasons: ${item.reasons.join(", ")}`);
    if (item.parseResult) {
      console.log(
        `   Parse: ${item.parseResult.success ? "✓" : "✗"} ${item.parseResult.hasWarnings ? "(warnings)" : ""}`,
      );
      if (item.parseResult.error) {
        console.log(`   Error: ${item.parseResult.error.substring(0, 80)}...`);
      }
    }
    console.log("");
  }

  // Generate TypeScript code for manual entries
  console.log("\n" + "=".repeat(80));
  console.log("TypeScript code for manual-overrides.ts:");
  console.log("=".repeat(80) + "\n");
  console.log(generateManualEntriesCode(complexTexts.slice(0, 50))); // Top 50

  // Statistics
  console.log("\n" + "=".repeat(80));
  console.log("Statistics:");
  console.log("=".repeat(80));
  console.log(`Total texts analyzed: ${scores.length}`);
  console.log(`Complex texts (score >= 3): ${complexTexts.length}`);
  console.log(
    `Failed to parse: ${scores.filter((s) => s.parseResult && !s.parseResult.success).length}`,
  );
  console.log(
    `Parse with warnings: ${scores.filter((s) => s.parseResult && s.parseResult.hasWarnings).length}`,
  );
  console.log(
    `Average complexity score: ${(scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(2)}`,
  );
}

// Run the script
main();
