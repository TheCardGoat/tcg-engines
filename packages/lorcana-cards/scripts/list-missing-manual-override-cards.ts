#!/usr/bin/env bun
/**
 * List manual override entries that don't have matching cards in the dataset
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

function main(): void {
  console.log("🔍 Finding Missing Manual Override Cards\n");

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
      let fullText = card.rulesText.replace(/\n/g, " ");
      fullText = stripAllParentheses(fullText);
      const normalizedFull = normalizeText(fullText);
      const patternFull = normalizeToPattern(normalizedFull);

      if (patternFull in MANUAL_ENTRIES) {
        matchedKeys.add(patternFull);
        if (patternFull.includes("NOW IT'S A PARTY")) {
          console.log("✅ NOW IT'S A PARTY matched!");
        }
      } else {
        const lines = card.rulesText.split("\n").filter((l) => l.trim());
        for (const line of lines) {
          let lineText = line.trim();
          lineText = stripAllParentheses(lineText);
          const normalized = normalizeText(lineText);
          const pattern = normalizeToPattern(normalized);
          if (pattern in MANUAL_ENTRIES) {
            matchedKeys.add(pattern);
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

  if (unmatched.length === 0) {
    console.log("✅ All manual override entries have matching cards!");
    return;
  }

  console.log(
    "❌ Missing Cards (Manual Override Entries Without Matching Cards):\n",
  );
  console.log("=".repeat(80));
  console.log("");

  unmatched.forEach((key, index) => {
    // Extract ability name if present (first few words in ALL CAPS)
    const nameMatch = key.match(/^([A-Z][A-Z\s]+[A-Z])\s/);
    const abilityName = nameMatch ? nameMatch[1] : null;

    // Get first sentence or first 100 chars
    const preview = key.length > 150 ? key.substring(0, 150) + "..." : key;

    console.log(`${index + 1}. ${abilityName || "Unnamed Ability"}`);
    if (abilityName) {
      console.log(`   Text: ${preview}`);
    } else {
      console.log(`   ${preview}`);
    }
    console.log("");
  });

  console.log("=".repeat(80));
  console.log(
    `\nTotal missing: ${unmatched.length} out of ${manualKeys.length} manual override entries`,
  );
}

main();
