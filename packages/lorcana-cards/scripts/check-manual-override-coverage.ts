#!/usr/bin/env bun
/**
 * Check which manual override keys have matching cards
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

function stripAllParentheses(text: string): string {
  return text
    .replace(/\([^)]*\)/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function main(): void {
  const cards = JSON.parse(
    fs.readFileSync(CANONICAL_CARDS_PATH, "utf-8"),
  ) as Record<string, CanonicalCard>;
  const manualKeys = Object.keys(MANUAL_ENTRIES);

  const matchedKeys = new Set<string>();
  const cardsWithOverrides: string[] = [];

  for (const card of Object.values(cards)) {
    if (!card.rulesText) continue;
    if (hasManualOverride(card)) {
      cardsWithOverrides.push(card.fullName);
      // Find which key matched
      const fullText = stripAllParentheses(card.rulesText.replace(/\n/g, " "));
      const normalizedFull = normalizeText(fullText);
      const patternFull = normalizeToPattern(normalizedFull);
      if (patternFull in MANUAL_ENTRIES) {
        matchedKeys.add(patternFull);
      } else {
        const lines = card.rulesText.split("\n").filter((l) => l.trim());
        for (const line of lines) {
          const stripped = stripAllParentheses(line.trim());
          const normalized = normalizeText(stripped);
          const pattern = normalizeToPattern(normalized);
          if (pattern in MANUAL_ENTRIES) {
            matchedKeys.add(pattern);
          }
        }
      }
    }
  }

  console.log(`Cards with manual overrides: ${cardsWithOverrides.length}`);
  console.log(`Unique manual override keys matched: ${matchedKeys.size}`);
  console.log(`Total manual override keys: ${manualKeys.length}`);
  console.log(
    `Unmatched keys: ${manualKeys.length - matchedKeys.size}`,
  );

  const unmatched = manualKeys.filter((k) => !matchedKeys.has(k));
  console.log(`\nFirst 10 unmatched keys:`);
  unmatched.slice(0, 10).forEach((k, i) => {
    console.log(`${i + 1}. ${k.substring(0, 100)}...`);
  });
}

main();

