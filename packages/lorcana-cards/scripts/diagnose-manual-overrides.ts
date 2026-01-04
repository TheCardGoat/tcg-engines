#!/usr/bin/env bun
/**
 * Diagnostic Script for Manual Override Matching
 *
 * Analyzes why manual override entries aren't being detected.
 * The issue: Manual override keys use {d} placeholders, but card text has actual numbers.
 *
 * Usage:
 *   bun packages/lorcana-cards/scripts/diagnose-manual-overrides.ts
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

interface MatchResult {
  card: CanonicalCard;
  originalText: string;
  normalizedText: string;
  patternText: string;
  matched: boolean;
  matchedKey?: string;
}

function loadCanonicalCards(): Record<string, CanonicalCard> {
  if (!fs.existsSync(CANONICAL_CARDS_PATH)) {
    console.error(
      `❌ Error: ${CANONICAL_CARDS_PATH} not found. Run generate-cards.ts first.`,
    );
    process.exit(1);
  }

  const rawData = fs.readFileSync(CANONICAL_CARDS_PATH, "utf-8");
  return JSON.parse(rawData) as Record<string, CanonicalCard>;
}

function checkManualOverrideMatch(card: CanonicalCard): MatchResult {
  if (!card.rulesText) {
    return {
      card,
      originalText: "",
      normalizedText: "",
      patternText: "",
      matched: false,
    };
  }

  // Use the actual hasManualOverride function to match what generation uses
  const matched = hasManualOverride(card);

  // Also compute pattern for display purposes
  const textWithSpaces = card.rulesText.replace(/\n/g, " ");
  const normalizedText = normalizeText(textWithSpaces);
  const patternText = normalizeToPattern(normalizedText);

  // Find the matching key if any
  let matchedKey: string | undefined;
  if (matched) {
    // Check full text
    if (patternText in MANUAL_ENTRIES) {
      matchedKey = patternText;
    } else {
      // Check individual lines
      const abilityLines = card.rulesText
        .split("\n")
        .filter((line) => line.trim());
      for (const line of abilityLines) {
        const normalizedLine = normalizeText(line.trim());
        const patternLine = normalizeToPattern(normalizedLine);
        if (patternLine in MANUAL_ENTRIES) {
          matchedKey = patternLine;
          break;
        }
      }
    }
  }

  return {
    card,
    originalText: card.rulesText,
    normalizedText,
    patternText,
    matched,
    matchedKey,
  };
}

function main(): void {
  console.log("🔍 Diagnosing Manual Override Matching Issues\n");

  console.log("📚 Loading canonical cards...");
  const canonicalCards = loadCanonicalCards();
  const totalCards = Object.keys(canonicalCards).length;
  console.log(`  Found ${totalCards} canonical cards\n`);

  console.log("🔎 Checking manual override matches...");
  const results: MatchResult[] = [];

  for (const card of Object.values(canonicalCards)) {
    if (card.rulesText) {
      results.push(checkManualOverrideMatch(card));
    }
  }

  const matches = results.filter((r) => r.matched);
  const nonMatches = results.filter((r) => !r.matched && r.originalText);

  console.log("\n📊 Results:");
  console.log(`  Total cards with rules text: ${results.length}`);
  console.log(`  ✅ Matches found: ${matches.length}`);
  console.log(`  ❌ Non-matches: ${nonMatches.length}`);
  console.log(
    `  📝 Total manual override entries: ${Object.keys(MANUAL_ENTRIES).length}`,
  );

  // Show examples of matches
  if (matches.length > 0) {
    console.log("\n✅ Example Matches (showing first 5):");
    matches.slice(0, 5).forEach((result, i) => {
      console.log(`\n  ${i + 1}. ${result.card.fullName}`);
      console.log(
        `     Original: "${result.originalText.substring(0, 80)}..."`,
      );
      console.log(`     Pattern:  "${result.patternText.substring(0, 80)}..."`);
    });
  }

  // Show examples of non-matches that should match
  if (nonMatches.length > 0) {
    console.log("\n❌ Example Non-Matches (showing first 10):");
    nonMatches.slice(0, 10).forEach((result, i) => {
      console.log(`\n  ${i + 1}. ${result.card.fullName}`);
      console.log(
        `     Original: "${result.originalText.substring(0, 80)}..."`,
      );
      console.log(`     Pattern:  "${result.patternText.substring(0, 80)}..."`);

      // Check if pattern exists in MANUAL_ENTRIES
      const existsInManual = result.patternText in MANUAL_ENTRIES;
      if (existsInManual) {
        console.log(
          `     ⚠️  Pattern EXISTS in MANUAL_ENTRIES but wasn't matched!`,
        );
      } else {
        // Find closest match
        const manualKeys = Object.keys(MANUAL_ENTRIES);
        const similarKeys = manualKeys.filter((key) => {
          // Simple similarity check: same length or similar words
          const words1 = result.patternText.split(/\s+/);
          const words2 = key.split(/\s+/);
          const commonWords = words1.filter((w) => words2.includes(w));
          return (
            commonWords.length >= Math.min(words1.length, words2.length) * 0.5
          );
        });

        if (similarKeys.length > 0) {
          console.log("     💡 Similar manual entry found:");
          console.log(`        "${similarKeys[0].substring(0, 80)}..."`);
        }
      }
    });
  }

  // Summary
  console.log("\n📈 Summary:");
  console.log(
    `  Match rate: ${((matches.length / results.length) * 100).toFixed(1)}%`,
  );
  console.log(
    `  Expected matches: ~${Object.keys(MANUAL_ENTRIES).length} (if all manual entries have corresponding cards)`,
  );

  if (matches.length < Object.keys(MANUAL_ENTRIES).length) {
    console.log(
      `\n⚠️  Warning: Only ${matches.length} out of ${Object.keys(MANUAL_ENTRIES).length} manual entries matched.`,
    );
    console.log(
      "   This suggests the normalization fix should help increase matches.",
    );
  }
}

main();
