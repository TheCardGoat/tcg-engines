#!/usr/bin/env bun
/**
 * Categorize Text Script
 *
 * Processes card data from data/inputs/ and categorizes all unique plain text
 * abilities into logical groups for parser development and documentation.
 *
 * Usage:
 *   bun packages/riftbound-cards/scripts/categorize-text.ts
 *
 * Output:
 *   data/outputs/plain-text-categories.json
 */

import fs from "node:fs";
import path from "node:path";
import type { RiftcodexInputCard } from "./types";

// ============================================================================
// Configuration
// ============================================================================

const INPUT_FILE = path.resolve(
  __dirname,
  "../data/inputs/riftcodex-input.json",
);
const OUTPUT_DIR = path.resolve(__dirname, "../data/outputs");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "plain-text-categories.json");

// ============================================================================
// Types
// ============================================================================

/** Category definition with name and matching pattern */
interface CategoryDefinition {
  /** Display name for the category */
  name: string;
  /** Regex pattern to match against plain text */
  pattern: RegExp;
  /** Optional filter function for more complex matching */
  filter?: (text: string) => boolean;
}

/** Category groups organized by type */
interface CategoryGroups {
  [groupName: string]: CategoryDefinition[];
}

/** Output structure for categorized text */
interface CategorizedOutput {
  /** Metadata about the categorization */
  meta: {
    /** When the categorization was generated */
    generatedAt: string;
    /** Source file used */
    sourceFile: string;
    /** Total unique texts found */
    totalUniqueTexts: number;
    /** Total cards processed */
    totalCards: number;
  };
  /** Count of texts in each category */
  categoryCounts: Record<string, number>;
  /** Texts organized by category */
  categories: Record<string, string[]>;
}

// ============================================================================
// Category Definitions
// ============================================================================

/**
 * All category definitions organized by group.
 * Each category has a pattern that matches against the plain text.
 * Categories are not mutually exclusive - a text can match multiple categories.
 */
const CATEGORY_GROUPS: CategoryGroups = {
  // Keywords - Game mechanics represented as bracketed terms
  keyword: [
    { name: "assault", pattern: /\[assault\s*\d*\]/i },
    { name: "shield", pattern: /\[shield\s*\d*\]/i },
    { name: "tank", pattern: /\[tank\]/i },
    { name: "deflect", pattern: /\[deflect\s*\d*\]/i },
    { name: "ganking", pattern: /\[ganking\]/i },
    { name: "hidden", pattern: /\[hidden\]/i },
    { name: "vision", pattern: /\[vision\]/i },
    { name: "deathknell", pattern: /\[deathknell\]/i },
    { name: "accelerate", pattern: /\[accelerate\]/i },
    { name: "legion", pattern: /\[legion\]/i },
    { name: "weaponmaster", pattern: /\[weaponmaster\]/i },
    { name: "quick-draw", pattern: /\[quick-draw\]/i },
    { name: "unique", pattern: /\[unique\]/i },
    { name: "temporary", pattern: /\[temporary\]/i },
    { name: "equip", pattern: /\[equip\]/i },
    { name: "repeat", pattern: /\[repeat\]/i },
  ],

  // Spell types - How spells can be played
  spell: [
    { name: "action", pattern: /\[action\]/i },
    {
      name: "reaction",
      pattern: /\[reaction\]/i,
      filter: (text) => !/:rb_exhaust:.*\[reaction\]/i.test(text),
    },
  ],

  // Triggered abilities - "When X happens" effects
  trigger: [
    { name: "when-played", pattern: /when (you )?play (me|this)/i },
    { name: "when-attack", pattern: /when i attack/i },
    { name: "when-defend", pattern: /when i defend|when you defend/i },
    { name: "when-conquer", pattern: /when (i |you )?conquer/i },
    { name: "when-hold", pattern: /when (i |you )?hold/i },
    { name: "when-move", pattern: /when (i |a unit )?move/i },
    { name: "when-die", pattern: /when .*(die|dies|killed)/i },
    { name: "when-buff", pattern: /when .*(buff|buffed)/i },
    { name: "when-discard", pattern: /when .*(discard)/i },
    { name: "when-spell", pattern: /when you (play a |choose).*(spell|card)/i },
    { name: "at-start", pattern: /at (the )?start of/i },
    { name: "at-end", pattern: /at (the )?end of/i },
  ],

  // Activated abilities - Costs you pay to activate
  activated: [
    {
      name: "exhaust",
      pattern: /:rb_exhaust:/i,
      filter: (text) => !text.startsWith("["),
    },
    { name: "resource-add", pattern: /\[add\]/i },
  ],

  // Effects - What abilities do
  effect: [
    { name: "damage", pattern: /deal \d+ (to|damage)/i },
    { name: "draw", pattern: /draw \d+/i },
    { name: "buff", pattern: /buff (a |me|another|friendly|two|up to)/i },
    { name: "stun", pattern: /stun (a |an |enemy)/i },
    { name: "kill", pattern: /kill (a |an |all |this|me|friendly|enemy)/i },
    { name: "return-hand", pattern: /return .* (to|from) .*(hand|owner)/i },
    { name: "recall", pattern: /recall/i },
    { name: "move", pattern: /move (a |an |me|friendly|enemy|any|up to)/i },
    {
      name: "ready",
      pattern: /ready (a |me|another|your|friendly|it|two|\d)/i,
    },
    { name: "channel", pattern: /channel \d+ rune/i },
    {
      name: "token",
      pattern: /play a \d+ :rb_might: .* token|gold gear token/i,
    },
    { name: "counter", pattern: /counter (a |an |the )?spell/i },
    { name: "control", pattern: /take control|gain control/i },
  ],

  // Static abilities - Continuous effects
  static: [
    {
      name: "might-modifier",
      pattern: /(have|has|get|gets) \+\d+ :rb_might:|my might is increased/i,
    },
    { name: "cost-reduction", pattern: /cost.*(less|reduced)/i },
    {
      name: "keyword-grant",
      pattern: /(have|has) \[/i,
      filter: (text) => !/when/i.test(text.split(".")[0]),
    },
    { name: "restriction", pattern: /can't (be |move|score|play)/i },
    { name: "enter-ready", pattern: /enter ready/i },
  ],

  // Costs - Additional costs to play cards
  cost: [{ name: "additional", pattern: /additional cost/i }],

  // Location references
  location: [
    { name: "battlefield", pattern: /battlefield/i },
    { name: "base", pattern: /base/i },
  ],

  // Tribal synergies - Card type references
  tribal: [
    { name: "mech", pattern: /mech/i },
    { name: "dragon", pattern: /dragon/i },
    { name: "poro", pattern: /poro/i },
    { name: "sand-soldier", pattern: /sand soldier/i },
    { name: "recruit", pattern: /recruit/i },
  ],

  // Special mechanics
  special: [
    { name: "mighty", pattern: /\[mighty\]|mighty unit/i },
    { name: "win-condition", pattern: /win the game|victory score/i },
    { name: "extra-turn", pattern: /take a turn after/i },
  ],
};

// ============================================================================
// Functions
// ============================================================================

/**
 * Ensure output directory exists
 */
function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Read and parse the input JSON file
 */
function readInputFile(): RiftcodexInputCard[] {
  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(
      `Input file not found: ${INPUT_FILE}\nRun 'bun run fetch' first.`,
    );
  }

  const content = fs.readFileSync(INPUT_FILE, "utf-8");
  return JSON.parse(content) as RiftcodexInputCard[];
}

/**
 * Extract unique plain texts from cards
 */
function extractUniquePlainTexts(cards: RiftcodexInputCard[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const card of cards) {
    const plainText = card.text?.plain;
    if (plainText && !seen.has(plainText)) {
      seen.add(plainText);
      result.push(plainText);
    }
  }

  return result;
}

/**
 * Check if a text matches a category definition
 */
function matchesCategory(text: string, category: CategoryDefinition): boolean {
  const patternMatches = category.pattern.test(text);
  if (!patternMatches) return false;

  if (category.filter) {
    return category.filter(text);
  }

  return true;
}

/**
 * Categorize all plain texts
 */
function categorizeTexts(plainTexts: string[]): Record<string, string[]> {
  const categories: Record<string, string[]> = {};

  // Initialize all categories
  for (const [groupName, definitions] of Object.entries(CATEGORY_GROUPS)) {
    for (const def of definitions) {
      const categoryKey = `${groupName}:${def.name}`;
      categories[categoryKey] = [];
    }
  }

  // Categorize each text
  for (const text of plainTexts) {
    for (const [groupName, definitions] of Object.entries(CATEGORY_GROUPS)) {
      for (const def of definitions) {
        if (matchesCategory(text, def)) {
          const categoryKey = `${groupName}:${def.name}`;
          categories[categoryKey].push(text);
        }
      }
    }
  }

  // Remove empty categories and sort texts within each category
  const result: Record<string, string[]> = {};
  for (const [key, texts] of Object.entries(categories)) {
    if (texts.length > 0) {
      result[key] = texts.sort();
    }
  }

  return result;
}

/**
 * Generate category counts from categorized texts
 */
function generateCategoryCounts(
  categories: Record<string, string[]>,
): Record<string, number> {
  const counts: Record<string, number> = {};

  // Sort by count descending
  const entries = Object.entries(categories).sort(
    (a, b) => b[1].length - a[1].length,
  );

  for (const [key, texts] of entries) {
    counts[key] = texts.length;
  }

  return counts;
}

/**
 * Write the categorized output to file
 */
function writeOutput(output: CategorizedOutput): void {
  ensureOutputDir();
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");
}

/**
 * Print summary to console
 */
function printSummary(output: CategorizedOutput): void {
  console.log("\n📊 Categorization Summary");
  console.log("─".repeat(50));
  console.log(`  Total cards processed: ${output.meta.totalCards}`);
  console.log(`  Unique plain texts: ${output.meta.totalUniqueTexts}`);
  console.log(
    `  Categories with matches: ${Object.keys(output.categories).length}`,
  );
  console.log("");

  // Group counts by category group
  const groups: Record<string, { name: string; count: number }[]> = {};

  for (const [key, count] of Object.entries(output.categoryCounts)) {
    const [group, name] = key.split(":");
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push({ name, count });
  }

  // Print by group
  for (const [group, items] of Object.entries(groups)) {
    const total = items.reduce((sum, item) => sum + item.count, 0);
    console.log(`  ${group.toUpperCase()} (${total} total matches)`);
    for (const item of items.sort((a, b) => b.count - a.count).slice(0, 5)) {
      console.log(`    ${item.name}: ${item.count}`);
    }
    if (items.length > 5) {
      console.log(`    ... and ${items.length - 5} more`);
    }
    console.log("");
  }
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  console.log("🔄 Categorizing card text...");

  try {
    // Read input
    console.log(`\n📖 Reading ${INPUT_FILE}...`);
    const cards = readInputFile();
    console.log(`  ✅ Loaded ${cards.length} cards`);

    // Extract unique texts
    console.log("\n🔍 Extracting unique plain texts...");
    const plainTexts = extractUniquePlainTexts(cards);
    console.log(`  ✅ Found ${plainTexts.length} unique texts`);

    // Categorize
    console.log("\n📁 Categorizing texts...");
    const categories = categorizeTexts(plainTexts);
    const categoryCounts = generateCategoryCounts(categories);
    console.log(`  ✅ Matched ${Object.keys(categories).length} categories`);

    // Build output
    const output: CategorizedOutput = {
      meta: {
        generatedAt: new Date().toISOString(),
        sourceFile: "riftcodex-input.json",
        totalUniqueTexts: plainTexts.length,
        totalCards: cards.length,
      },
      categoryCounts,
      categories,
    };

    // Write output
    console.log(`\n💾 Writing to ${OUTPUT_FILE}...`);
    writeOutput(output);
    console.log("  ✅ Done!");

    // Print summary
    printSummary(output);

    console.log("🎉 Categorization complete!");
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

// Run the script
main();
