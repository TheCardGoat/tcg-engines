/**
 * Pattern Extraction Script
 * Analyzes card texts and extracts common patterns, variations, and structures
 */

import { allCardsText } from "./all-lorcana-texts";

export interface Pattern {
  template: string;
  frequency: number;
  examples: string[];
  category: PatternCategory;
}

export type PatternCategory =
  | "keyword"
  | "timing-trigger"
  | "damage"
  | "lore"
  | "stat-modification"
  | "card-advantage"
  | "discard"
  | "banish"
  | "bounce"
  | "exert"
  | "ready"
  | "quest-restriction"
  | "challenge"
  | "inkwell"
  | "deck-manipulation"
  | "song"
  | "location"
  | "conditional"
  | "named-synergy"
  | "cost-reduction"
  | "activated-ability"
  | "replacement-effect"
  | "shift"
  | "resist"
  | "boost"
  | "reveal"
  | "modal"
  | "compound"
  | "other";

export interface PatternAnalysis {
  totalTexts: number;
  totalPatterns: number;
  categoryCounts: Record<PatternCategory, number>;
  patterns: Pattern[];
  topPatterns: Pattern[];
}

/**
 * Normalizes text to extract pattern template
 * Replaces numbers with {d} placeholder
 */
function normalizeToPattern(text: string): string {
  return text.replace(/\d+/g, "{d}").replace(/\s+/g, " ").trim();
}

/**
 * Categorizes a pattern based on its content
 */
function categorizePattern(pattern: string): PatternCategory {
  const lower = pattern.toLowerCase();

  // Keywords (simple, usually single words or short phrases)
  if (
    /^(rush|ward|alert|vanish|evasive|support|reckless|bodyguard)$/i.test(
      pattern,
    )
  ) {
    return "keyword";
  }

  // Timing triggers
  if (
    lower.includes("when you play") ||
    lower.includes("whenever you play") ||
    lower.includes("at the start") ||
    lower.includes("at the end") ||
    lower.includes("during your turn") ||
    lower.includes("during an opponent")
  ) {
    return "timing-trigger";
  }

  // Damage patterns
  if (
    (lower.includes("deal") && lower.includes("damage")) ||
    lower.includes("damage counter")
  ) {
    return "damage";
  }

  // Healing patterns
  if (lower.includes("remove") && lower.includes("damage")) {
    return "damage";
  }

  // Lore patterns
  if (
    (lower.includes("gain") && lower.includes("lore")) ||
    (lower.includes("loses") && lower.includes("lore"))
  ) {
    return "lore";
  }

  // Stat modification
  if (
    /gets?\s+[+-]/.test(lower) ||
    /gains?\s+[+-]/.test(lower) ||
    lower.includes("{s}") ||
    lower.includes("{l}") ||
    lower.includes("{w}")
  ) {
    return "stat-modification";
  }

  // Card advantage
  if (lower.includes("draw") && lower.includes("card")) {
    return "card-advantage";
  }

  // Discard
  if (lower.includes("discard")) {
    return "discard";
  }

  // Banish
  if (lower.includes("banish")) {
    return "banish";
  }

  // Return to hand (bounce)
  if (lower.includes("return") && lower.includes("hand")) {
    return "bounce";
  }

  // Exert
  if (lower.includes("exert")) {
    return "exert";
  }

  // Ready
  if (lower.includes("ready")) {
    return "ready";
  }

  // Quest restrictions
  if (
    lower.includes("quest") &&
    (lower.includes("can't") || lower.includes("must"))
  ) {
    return "quest-restriction";
  }

  // Challenge
  if (lower.includes("challenge")) {
    return "challenge";
  }

  // Inkwell
  if (
    lower.includes("inkwell") ||
    (lower.includes("pay") && lower.includes("less"))
  ) {
    return "inkwell";
  }

  // Deck manipulation
  if (
    lower.includes("look at the top") ||
    lower.includes("reveal the top") ||
    lower.includes("search your deck") ||
    lower.includes("shuffle")
  ) {
    return "deck-manipulation";
  }

  // Song
  if (lower.includes("song") || lower.includes("sing")) {
    return "song";
  }

  // Location
  if (
    lower.includes("location") ||
    lower.includes("move") ||
    lower.includes("while here")
  ) {
    return "location";
  }

  // Conditional
  if (
    lower.startsWith("if ") ||
    lower.startsWith("while ") ||
    lower.includes("if you have") ||
    lower.includes("while you have")
  ) {
    return "conditional";
  }

  // Named synergy
  if (lower.includes("named") || lower.includes("characters named")) {
    return "named-synergy";
  }

  // Cost reduction
  if (lower.includes("pay") && lower.includes("less to play")) {
    return "cost-reduction";
  }

  // Activated ability
  if (lower.includes("{e}") || lower.includes("{i}")) {
    return "activated-ability";
  }

  // Shift
  if (lower.includes("shift")) {
    return "shift";
  }

  // Resist
  if (lower.includes("resist")) {
    return "resist";
  }

  // Boost
  if (lower.includes("boost")) {
    return "boost";
  }

  // Reveal
  if (lower.includes("reveal")) {
    return "reveal";
  }

  // Modal (choose one)
  if (lower.includes("choose one")) {
    return "modal";
  }

  // Replacement effects
  if (
    lower.includes("instead") ||
    (lower.includes("would") && lower.includes("don't"))
  ) {
    return "replacement-effect";
  }

  // Compound (multiple sentences with different effects)
  if (pattern.split(".").length > 2 || pattern.split("−").length > 2) {
    return "compound";
  }

  return "other";
}

/**
 * Extracts patterns from the card texts
 */
export function extractPatterns(
  texts: string[] = allCardsText,
): PatternAnalysis {
  const patternMap = new Map<string, Pattern>();

  // Process each text
  for (const text of texts) {
    const pattern = normalizeToPattern(text);

    if (patternMap.has(pattern)) {
      const existing = patternMap.get(pattern)!;
      existing.frequency++;
      if (existing.examples.length < 5 && !existing.examples.includes(text)) {
        existing.examples.push(text);
      }
    } else {
      patternMap.set(pattern, {
        template: pattern,
        frequency: 1,
        examples: [text],
        category: categorizePattern(pattern),
      });
    }
  }

  // Convert to array and sort by frequency
  const patterns = Array.from(patternMap.values()).sort(
    (a, b) => b.frequency - a.frequency,
  );

  // Calculate category counts
  const categoryCounts: Record<PatternCategory, number> = {
    keyword: 0,
    "timing-trigger": 0,
    damage: 0,
    lore: 0,
    "stat-modification": 0,
    "card-advantage": 0,
    discard: 0,
    banish: 0,
    bounce: 0,
    exert: 0,
    ready: 0,
    "quest-restriction": 0,
    challenge: 0,
    inkwell: 0,
    "deck-manipulation": 0,
    song: 0,
    location: 0,
    conditional: 0,
    "named-synergy": 0,
    "cost-reduction": 0,
    "activated-ability": 0,
    "replacement-effect": 0,
    shift: 0,
    resist: 0,
    boost: 0,
    reveal: 0,
    modal: 0,
    compound: 0,
    other: 0,
  };

  for (const pattern of patterns) {
    categoryCounts[pattern.category]++;
  }

  // Get top 50 most frequent patterns
  const topPatterns = patterns.slice(0, 50);

  return {
    totalTexts: texts.length,
    totalPatterns: patterns.length,
    categoryCounts,
    patterns,
    topPatterns,
  };
}

/**
 * Formats the analysis as a readable report
 */
export function formatPatternReport(analysis: PatternAnalysis): string {
  const lines: string[] = [];

  lines.push("# Lorcana Card Text Pattern Analysis");
  lines.push("");
  lines.push(`Generated on: ${new Date().toISOString()}`);
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push(`- **Total Unique Texts:** ${analysis.totalTexts}`);
  lines.push(`- **Total Unique Patterns:** ${analysis.totalPatterns}`);
  lines.push(
    `- **Pattern Categories:** ${Object.keys(analysis.categoryCounts).length}`,
  );
  lines.push("");

  lines.push("## Category Breakdown");
  lines.push("");

  // Sort categories by count
  const sortedCategories = Object.entries(analysis.categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 0);

  lines.push("| Category | Pattern Count | Percentage |");
  lines.push("|----------|---------------|------------|");

  for (const [category, count] of sortedCategories) {
    const percentage = ((count / analysis.totalPatterns) * 100).toFixed(1);
    lines.push(`| ${category} | ${count} | ${percentage}% |`);
  }
  lines.push("");

  lines.push("## Top 50 Most Frequent Patterns");
  lines.push("");

  for (let i = 0; i < analysis.topPatterns.length; i++) {
    const pattern = analysis.topPatterns[i];
    lines.push(`### ${i + 1}. ${pattern.template}`);
    lines.push("");
    lines.push(`- **Category:** ${pattern.category}`);
    lines.push(
      `- **Frequency:** ${pattern.frequency} occurrence${pattern.frequency > 1 ? "s" : ""}`,
    );
    lines.push("");
    lines.push("**Examples:**");
    for (const example of pattern.examples.slice(0, 3)) {
      lines.push(`- "${example}"`);
    }
    lines.push("");
  }

  lines.push("## Patterns by Category");
  lines.push("");

  for (const [category, count] of sortedCategories) {
    if (count === 0) continue;

    lines.push(`### ${category} (${count} patterns)`);
    lines.push("");

    const categoryPatterns = analysis.patterns
      .filter((p) => p.category === category)
      .slice(0, 10); // Show top 10 per category

    for (const pattern of categoryPatterns) {
      lines.push(`- **${pattern.template}** (${pattern.frequency}x)`);
      if (pattern.examples.length > 0) {
        lines.push(`  - Example: "${pattern.examples[0]}"`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Exports patterns as JSON
 */
export function exportPatternsJSON(analysis: PatternAnalysis): string {
  return JSON.stringify(analysis, null, 2);
}

/**
 * Exports patterns as TypeScript constants
 */
export function exportPatternsTypeScript(analysis: PatternAnalysis): string {
  const lines: string[] = [];

  lines.push("/**");
  lines.push(" * Auto-generated pattern definitions from Lorcana card texts");
  lines.push(` * Generated on: ${new Date().toISOString()}`);
  lines.push(` * Total patterns: ${analysis.totalPatterns}`);
  lines.push(" */");
  lines.push("");

  lines.push("export interface CardTextPattern {");
  lines.push("  template: string;");
  lines.push("  frequency: number;");
  lines.push("  examples: string[];");
  lines.push("  category: string;");
  lines.push("}");
  lines.push("");

  // Export by category
  for (const [category, count] of Object.entries(analysis.categoryCounts)) {
    if (count === 0) continue;

    const categoryPatterns = analysis.patterns.filter(
      (p) => p.category === category,
    );
    const safeName = category.replace(/-/g, "_").toUpperCase();

    lines.push(`export const ${safeName}_PATTERNS: CardTextPattern[] = [`);
    for (const pattern of categoryPatterns) {
      lines.push("  {");
      lines.push(`    template: ${JSON.stringify(pattern.template)},`);
      lines.push(`    frequency: ${pattern.frequency},`);
      lines.push(
        `    examples: ${JSON.stringify(pattern.examples.slice(0, 2))},`,
      );
      lines.push(`    category: ${JSON.stringify(pattern.category)},`);
      lines.push("  },");
    }
    lines.push("];");
    lines.push("");
  }

  lines.push("export const ALL_PATTERNS: CardTextPattern[] = [");
  for (const pattern of analysis.patterns) {
    lines.push("  {");
    lines.push(`    template: ${JSON.stringify(pattern.template)},`);
    lines.push(`    frequency: ${pattern.frequency},`);
    lines.push(
      `    examples: ${JSON.stringify(pattern.examples.slice(0, 2))},`,
    );
    lines.push(`    category: ${JSON.stringify(pattern.category)},`);
    lines.push("  },");
  }
  lines.push("];");
  lines.push("");

  return lines.join("\n");
}

// If run directly
if (require.main === module) {
  console.log("Extracting patterns from card texts...");
  const analysis = extractPatterns();

  console.log("\n=== Pattern Analysis Complete ===");
  console.log(`Total unique texts: ${analysis.totalTexts}`);
  console.log(`Total unique patterns: ${analysis.totalPatterns}`);
  console.log("\nTop 10 categories:");

  const sortedCategories = Object.entries(analysis.categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  for (const [category, count] of sortedCategories) {
    console.log(`  ${category}: ${count}`);
  }

  console.log("\nTop 10 most frequent patterns:");
  for (let i = 0; i < Math.min(10, analysis.topPatterns.length); i++) {
    const pattern = analysis.topPatterns[i];
    console.log(`  ${i + 1}. ${pattern.template} (${pattern.frequency}x)`);
  }

  console.log("\nUse index.ts to generate full reports.");
}
