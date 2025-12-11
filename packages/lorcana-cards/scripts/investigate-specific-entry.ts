#!/usr/bin/env bun
/**
 * Investigate a specific manual override entry to find why it doesn't match
 *
 * Usage:
 *   bun run packages/lorcana-cards/scripts/investigate-specific-entry.ts "NOW IT'S A PARTY"
 */

import fs from "node:fs";
import path from "node:path";
import { MANUAL_ENTRIES } from "../src/parser/manual-overrides";
import { normalizeToPattern } from "../src/parser/numeric-extractor";
import { normalizeText } from "../src/parser/preprocessor";
import type { CanonicalCard } from "./types";

const CANONICAL_CARDS_PATH = path.resolve(
  __dirname,
  "../src/data/canonical-cards.json",
);

/**
 * Strip all parenthetical content (reminder text) from text
 */
function stripAllParentheses(text: string): string {
  return text
    .replace(/\([^)]*\)/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Normalize punctuation for matching
 */
function normalizePunctuation(text: string): string {
  return text
    .replace(/[—–−]/g, "-") // Normalize dashes
    .replace(/[""]/g, '"') // Normalize quotes
    .replace(/['']/g, "'"); // Normalize apostrophes
}

/**
 * Find character-by-character differences between two strings
 */
function findDifferences(str1: string, str2: string): void {
  const len = Math.max(str1.length, str2.length);
  let foundDiff = false;

  for (let i = 0; i < len; i++) {
    if (str1[i] !== str2[i]) {
      if (!foundDiff) {
        console.log("\n🔍 Character Differences:");
        foundDiff = true;
      }
      const start = Math.max(0, i - 20);
      const end = Math.min(len, i + 20);
      console.log(`  Position ${i}:`);
      console.log(`    Card: "${str1.substring(start, end)}"`);
      console.log(`    Key:  "${str2.substring(start, end)}"`);
      console.log(
        `    Diff: "${str1[i] || "(missing)"}" vs "${str2[i] || "(missing)"}"`,
      );
      break;
    }
  }

  if (!foundDiff && str1.length !== str2.length) {
    console.log(`\n⚠️  Length difference: ${str1.length} vs ${str2.length}`);
  }
}

function investigateEntry(searchTerm: string): void {
  console.log(`🔍 Investigating: "${searchTerm}"\n`);

  const cards = JSON.parse(
    fs.readFileSync(CANONICAL_CARDS_PATH, "utf-8"),
  ) as Record<string, CanonicalCard>;
  const manualKeys = Object.keys(MANUAL_ENTRIES);

  // Find the manual override key
  const matchingKey = manualKeys.find((k) =>
    k.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!matchingKey) {
    console.log(`❌ No manual override key found containing "${searchTerm}"`);
    console.log("\nAvailable keys (first 10):");
    manualKeys.slice(0, 10).forEach((k, i) => {
      const name = k.match(/^([A-Z][A-Z\s]+[A-Z])\s/)?.[1] || "Unnamed";
      console.log(`  ${i + 1}. ${name}`);
    });
    return;
  }

  console.log("📝 Manual Override Key:");
  console.log(`   ${matchingKey}\n`);

  // Search for similar cards
  const searchWords = searchTerm.split(/\s+/).filter((w) => w.length > 2);
  const potentialMatches: Array<{
    card: CanonicalCard;
    similarity: number;
    reason: string;
  }> = [];

  for (const card of Object.values(cards)) {
    if (!card.rulesText) continue;

    // Check if card contains any search words
    const containsSearch = searchWords.some((word) =>
      card.rulesText.toLowerCase().includes(word.toLowerCase()),
    );

    if (containsSearch) {
      // Calculate similarity
      const cardText = card.rulesText.toLowerCase();
      const keyText = matchingKey.toLowerCase();
      const commonWords = searchWords.filter((w) =>
        cardText.includes(w.toLowerCase()),
      );
      const similarity = commonWords.length / searchWords.length;

      if (similarity > 0.3) {
        potentialMatches.push({
          card,
          similarity,
          reason: `Contains ${commonWords.length}/${searchWords.length} search words`,
        });
      }
    }
  }

  if (potentialMatches.length === 0) {
    console.log("❌ No potential matching cards found in dataset");
    console.log(
      "\n💡 This suggests the card may not be in the current dataset.",
    );
    return;
  }

  // Sort by similarity
  potentialMatches.sort((a, b) => b.similarity - a.similarity);

  console.log(`✅ Found ${potentialMatches.length} potential matches:\n`);

  for (const match of potentialMatches.slice(0, 5)) {
    console.log(`📄 ${match.card.fullName}`);
    console.log(`   Similarity: ${(match.similarity * 100).toFixed(1)}%`);
    console.log(`   Reason: ${match.reason}`);
    console.log(
      `   Card text: ${match.card.rulesText?.substring(0, 120)}...\n`,
    );

    // Normalize and compare
    let cardText = match.card.rulesText.replace(/\n/g, " ");
    cardText = stripAllParentheses(cardText);
    cardText = normalizePunctuation(cardText);
    const normalizedCard = normalizeText(cardText);
    const cardPattern = normalizeToPattern(normalizedCard);

    let keyText = matchingKey;
    keyText = normalizePunctuation(keyText);
    const normalizedKey = normalizeText(keyText);
    const keyPattern = normalizeToPattern(normalizedKey);

    console.log("   Normalized comparison:");
    console.log(`   Card pattern: ${cardPattern.substring(0, 120)}...`);
    console.log(`   Key pattern:  ${keyPattern.substring(0, 120)}...`);
    console.log(
      `   Match: ${cardPattern === keyPattern ? "✅ YES" : "❌ NO"}\n`,
    );

    if (cardPattern !== keyPattern) {
      findDifferences(cardPattern, keyPattern);
    }

    // Also check individual lines
    const lines = match.card.rulesText.split("\n").filter((l) => l.trim());
    console.log(`   Checking ${lines.length} individual ability line(s):`);
    for (let i = 0; i < lines.length; i++) {
      let lineText = lines[i].trim();
      lineText = stripAllParentheses(lineText);
      lineText = normalizePunctuation(lineText);
      const normalizedLine = normalizeText(lineText);
      const linePattern = normalizeToPattern(normalizedLine);

      if (linePattern === keyPattern) {
        console.log(`     ✅ Line ${i + 1} matches!`);
      } else {
        const lineSimilarity = calculateSimilarity(linePattern, keyPattern);
        if (lineSimilarity > 0.7) {
          console.log(
            `     ⚠️  Line ${i + 1} similar (${(lineSimilarity * 100).toFixed(1)}%) but doesn't match`,
          );
        }
      }
    }
    console.log("");
  }
}

/**
 * Calculate similarity between two strings (simple word overlap)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}

function main(): void {
  const searchTerm = process.argv[2];

  if (!searchTerm) {
    console.log("Usage: bun run investigate-specific-entry.ts <search-term>");
    console.log("");
    console.log("Examples:");
    console.log('  bun run investigate-specific-entry.ts "NOW IT\'S A PARTY"');
    console.log('  bun run investigate-specific-entry.ts "STICK WITH ME"');
    console.log(
      '  bun run investigate-specific-entry.ts "DISPEL THE ENTANGLEMENT"',
    );
    process.exit(1);
  }

  investigateEntry(searchTerm);
}

main();
