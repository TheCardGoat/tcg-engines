#!/usr/bin/env bun
/**
 * Investigate a specific manual override entry
 *
 * Usage: bun run packages/lorcana-cards/scripts/investigate-specific-entry.ts "ABILITY NAME"
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
 * Calculate similarity (Levenshtein distance based)
 */
function levenshteinDistance(a: string, b: string): number {
  const tmp = [];
  let i, j;
  const alen = a.length;
  const blen = b.length;

  if (alen === 0) {
    return blen;
  }
  if (blen === 0) {
    return alen;
  }

  for (i = 0; i <= alen; i++) {
    tmp[i] = [i];
  }
  for (j = 0; j <= blen; j++) {
    tmp[0][j] = j;
  }

  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      tmp[i][j] = -1;
    }
  }

  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      let cost = 1;
      if (a[i - 1] === b[j - 1]) {
        cost = 0;
      }
      tmp[i][j] = Math.min(
        tmp[i - 1][j - 1] + cost,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j] + 1,
      );
    }
  }

  return tmp[alen][blen];
}

function findCharacterDifferences(str1: string, str2: string): void {
  const len = Math.max(str1.length, str2.length);
  let diffCount = 0;

  console.log("   --- Character Comparison ---");
  console.log(`   Key:  "${str1}"`);
  console.log(`   Card: "${str2}"`);

  for (let i = 0; i < len; i++) {
    const c1 = str1[i] || "";
    const c2 = str2[i] || "";

    if (c1 !== c2) {
      console.log(`   Mismatch at index ${i}: '${c1}' vs '${c2}'`);
      console.log(
        `   Context: "...${str1.substring(Math.max(0, i - 10), Math.min(str1.length, i + 10))}..."`,
      );
      diffCount++;
      if (diffCount > 5) {
        console.log("   (Stopping after 5 differences)");
        break;
      }
    }
  }
}

function main(): void {
  const query = process.argv[2];
  if (!query) {
    console.error(
      "Please provide a search term (ability name or text segment)",
    );
    process.exit(1);
  }

  console.log(`🔍 Investigating entry matching: "${query}"\n`);

  // 1. Find the manual override key
  const manualKeys = Object.keys(MANUAL_ENTRIES);
  const matchingKeys = manualKeys.filter((k) => k.includes(query));

  if (matchingKeys.length === 0) {
    console.log("❌ No manual override key found matching the query.");
    return;
  }

  console.log(`Found ${matchingKeys.length} matching keys.`);

  const cards = JSON.parse(
    fs.readFileSync(CANONICAL_CARDS_PATH, "utf-8"),
  ) as Record<string, CanonicalCard>;

  for (const key of matchingKeys) {
    console.log(`\n🔑 Key: "${key}"`);
    console.log(`   Length: ${key.length}`);

    // normalize key (just in case, though keys are supposed to be normalized patterns)
    // Actually keys ARE patterns.

    // 2. Search for similar cards
    let bestMatch: CanonicalCard | null = null;
    let minDistance = Number.POSITIVE_INFINITY;

    // First try to find by name if the query looks like an ability name
    // (This is heuristic)

    // Filter cards that might match
    const potentialCards = Object.values(cards).filter((card) => {
      if (!card.rulesText) return false;
      // Check if card contains the query
      if (card.rulesText.includes(query)) return true;

      // Also checks stripped parens
      const stripped = stripAllParentheses(card.rulesText);
      if (stripped.includes(query)) return true;

      return false;
    });

    console.log(
      `   Found ${potentialCards.length} cards containing the query string.`,
    );

    if (potentialCards.length === 0) {
      console.log("   Attempting fuzzy search on all cards...");
      // If no direct text match, check all cards for similarity to the KEY
      for (const card of Object.values(cards)) {
        if (!card.rulesText) continue;
        const stripped = stripAllParentheses(
          card.rulesText.replace(/\n/g, " "),
        );
        const pattern = normalizeToPattern(normalizeText(stripped));

        const dist = levenshteinDistance(key, pattern);
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = card;
        }
      }
    } else {
      // Evaluate potential cards
      for (const card of potentialCards) {
        if (!card.rulesText) continue;
        const stripped = stripAllParentheses(
          card.rulesText.replace(/\n/g, " "),
        );
        const pattern = normalizeToPattern(normalizeText(stripped));

        const dist = levenshteinDistance(key, pattern);
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = card;
        }
      }
    }

    if (bestMatch && bestMatch.rulesText) {
      console.log(`\n   🃏 Best potential card match: ${bestMatch.fullName}`);
      console.log(
        `      Card Text: ${bestMatch.rulesText.replace(/\n/g, " ")}`,
      );

      const cardText = bestMatch.rulesText.replace(/\n/g, " ");

      // Step-by-step normalization comparison
      console.log("\n   --- Normalization Steps ---");

      const step1 = stripAllParentheses(cardText);
      console.log(`   1. Strip Parens: "${step1}"`);

      const step2 = normalizeText(step1);
      console.log(`   2. Normalize WS: "${step2}"`);

      const step3 = normalizeToPattern(step2);
      console.log(`   3. To Pattern:   "${step3}"`);

      const match = step3 === key;
      console.log(`\n   MATCH: ${match ? "✅ YES" : "❌ NO"}`);

      if (!match) {
        findCharacterDifferences(key, step3);

        // Check individual lines as well
        console.log("\n   Checking individual lines:");
        const lines = bestMatch.rulesText.split("\n").filter((l) => l.trim());
        for (const line of lines) {
          const linePattern = normalizeToPattern(
            normalizeText(stripAllParentheses(line)),
          );
          if (key === linePattern) {
            console.log(`   ✅ Line matches key: "${line}"`);
          } else if (key.includes(linePattern) || linePattern.includes(key)) {
            console.log(`   ⚠️ Line partial match: "${linePattern}"`);
          }
        }
      }
    } else {
      console.log("   ❌ No card found reasonably close to this key.");
    }
  }
}

main();
