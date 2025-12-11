#!/usr/bin/env bun
/**
 * Analyze which manual override entries don't have matching cards
 * and identify potential matches with formatting differences
 */

import fs from "node:fs";
import path from "node:path";
import { MANUAL_ENTRIES } from "../src/parser/manual-overrides";
import { normalizeToPattern } from "../src/parser/numeric-extractor";
import { normalizeText } from "../src/parser/preprocessor";
import { hasManualOverride } from "./generators/parser-validator";
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
  console.log("🔍 Analyzing Unmatched Manual Override Entries\n");

  const cards = JSON.parse(
    fs.readFileSync(CANONICAL_CARDS_PATH, "utf-8"),
  ) as Record<string, CanonicalCard>;
  const manualKeys = Object.keys(MANUAL_ENTRIES);

  // Find which keys are matched
  const matchedKeys = new Set<string>();
  for (const card of Object.values(cards)) {
    if (!card.rulesText) continue;
    if (hasManualOverride(card)) {
      // Find which key matched
      const normalizedFull = normalizeText(card.rulesText.replace(/\n/g, " "));
      const patternFull = normalizeToPattern(normalizedFull);

      const strippedFull = stripAllParentheses(
        card.rulesText.replace(/\n/g, " "),
      );
      const patternStrippedFull = normalizeToPattern(
        normalizeText(strippedFull),
      );

      if (
        patternFull in MANUAL_ENTRIES ||
        patternStrippedFull in MANUAL_ENTRIES
      ) {
        matchedKeys.add(
          patternFull in MANUAL_ENTRIES ? patternFull : patternStrippedFull,
        );
      } else {
        const lines = card.rulesText.split("\n").filter((l) => l.trim());
        for (const line of lines) {
          const normalized = normalizeText(line.trim());
          const pattern = normalizeToPattern(normalized);
          // Also check stripped version
          const stripped = stripAllParentheses(line.trim());
          const patternStripped = normalizeToPattern(normalizeText(stripped));

          if (pattern in MANUAL_ENTRIES || patternStripped in MANUAL_ENTRIES) {
            matchedKeys.add(
              pattern in MANUAL_ENTRIES ? pattern : patternStripped,
            );
          }
        }
      }
    }
  }

  const unmatched = manualKeys.filter((k) => !matchedKeys.has(k));
  console.log("📊 Summary:");
  console.log(`  Total manual override keys: ${manualKeys.length}`);
  console.log(`  Matched keys: ${matchedKeys.size}`);
  console.log(`  Unmatched keys: ${unmatched.length}\n`);

  // For each unmatched key, try to find similar cards
  console.log("🔎 Analyzing unmatched keys for potential matches...\n");

  const potentialMatches: Array<{
    key: string;
    card: CanonicalCard;
    similarity: number;
    reason: string;
  }> = [];

  for (const key of unmatched.slice(0, 20)) {
    // Extract first few words to search for
    const keyWords = key.split(/\s+/).slice(0, 5).join(" ");
    const keyWithoutParens = stripAllParentheses(key);
    const keyPattern = normalizeToPattern(normalizeText(keyWithoutParens));

    let bestMatch: {
      card: CanonicalCard;
      similarity: number;
      reason: string;
    } | null = null;

    for (const card of Object.values(cards)) {
      if (!card.rulesText) continue;

      // Check full text
      const normalizedFull = normalizeText(card.rulesText.replace(/\n/g, " "));
      const patternFull = normalizeToPattern(normalizedFull);
      const fullWithoutParens = stripAllParentheses(normalizedFull);
      const patternFullNoParens = normalizeToPattern(
        normalizeText(fullWithoutParens),
      );

      if (patternFullNoParens === keyPattern) {
        const similarity = 1.0;
        if (!bestMatch || similarity > bestMatch.similarity) {
          bestMatch = {
            card,
            similarity,
            reason: "Matches when parentheses are stripped",
          };
        }
      } else {
        const similarity = calculateSimilarity(key, normalizedFull);
        if (
          similarity > 0.5 &&
          (!bestMatch || similarity > bestMatch.similarity)
        ) {
          bestMatch = {
            card,
            similarity,
            reason: `High similarity (${(similarity * 100).toFixed(1)}%)`,
          };
        }
      }

      // Check individual lines
      const lines = card.rulesText.split("\n").filter((l) => l.trim());
      for (const line of lines) {
        const normalized = normalizeText(line.trim());
        const pattern = normalizeToPattern(normalized);
        const lineWithoutParens = stripAllParentheses(normalized);
        const patternNoParens = normalizeToPattern(
          normalizeText(lineWithoutParens),
        );

        if (patternNoParens === keyPattern) {
          const similarity = 1.0;
          if (!bestMatch || similarity > bestMatch.similarity) {
            bestMatch = {
              card,
              similarity,
              reason: "Line matches when parentheses are stripped",
            };
          }
        } else {
          const similarity = calculateSimilarity(key, normalized);
          if (
            similarity > 0.6 &&
            (!bestMatch || similarity > bestMatch.similarity)
          ) {
            bestMatch = {
              card,
              similarity,
              reason: `Line has high similarity (${(similarity * 100).toFixed(1)}%)`,
            };
          }
        }
      }
    }

    if (bestMatch && bestMatch.similarity > 0.5) {
      potentialMatches.push({
        key,
        ...bestMatch,
      });
    }
  }

  if (potentialMatches.length > 0) {
    console.log(`✅ Found ${potentialMatches.length} potential matches:\n`);
    potentialMatches.forEach((match, i) => {
      console.log(`${i + 1}. ${match.card.fullName}`);
      console.log(`   Reason: ${match.reason}`);
      console.log(`   Key: ${match.key.substring(0, 100)}...`);
      console.log(
        `   Card text: ${match.card.rulesText?.substring(0, 100)}...`,
      );
      console.log("");
    });
  } else {
    console.log("❌ No potential matches found in first 20 unmatched keys.");
    console.log(
      "   This suggests these entries don't have corresponding cards in the dataset.\n",
    );
  }

  // Show some unmatched keys that might not have cards
  console.log("📝 Sample unmatched keys (likely no corresponding cards):\n");
  unmatched.slice(0, 10).forEach((key, i) => {
    console.log(`${i + 1}. ${key.substring(0, 120)}...`);
  });
}

main();
