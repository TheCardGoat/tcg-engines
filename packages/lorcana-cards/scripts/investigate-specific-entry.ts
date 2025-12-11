#!/usr/bin/env bun
/**
 * Investigate a specific manual override entry
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

function stripAllParentheses(text: string): string {
  return text
    .replace(/\([^)]*\)/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function main(): void {
  const query = process.argv[2];
  if (!query) {
    console.error("Please provide a search term (ability name or text segment)");
    process.exit(1);
  }

  console.log(`🔍 Investigating entry matching "${query}"...\n`);

  if (!fs.existsSync(CANONICAL_CARDS_PATH)) {
    console.error("❌ Canonical cards file not found. Please run generation first.");
    process.exit(1);
  }

  const cards = JSON.parse(
    fs.readFileSync(CANONICAL_CARDS_PATH, "utf-8"),
  ) as Record<string, CanonicalCard>;

  // 1. Find the manual override key
  const manualKeys = Object.keys(MANUAL_ENTRIES);
  const matchingKey = manualKeys.find((k) => k.includes(query));

  if (matchingKey) {
    console.log("📝 Found Manual Override Key:");
    console.log(matchingKey);
    console.log("");
  } else {
    console.log("❌ No manual override key found containing the query.");
    console.log("   Searching for potential cards anyway...\n");
  }

  // 2. Find matching cards
  const matchingCards = Object.values(cards).filter((card) => {
    return card.rulesText && card.rulesText.includes(query);
  });

  if (matchingCards.length === 0) {
    console.log("❌ No cards found in dataset containing the query.");
    return;
  }

  console.log(`📚 Found ${matchingCards.length} cards containing "${query}":\n`);

  for (const card of matchingCards) {
    if (!card.rulesText) continue;

    console.log(`🃏 Card: ${card.fullName}`);
    console.log(`   Text: ${card.rulesText.replace(/\n/g, " ")}`);

    const normalizedFull = normalizeText(card.rulesText.replace(/\n/g, " "));
    const strippedFull = stripAllParentheses(normalizedFull);
    const patternFull = normalizeToPattern(strippedFull);

    console.log(`   Pattern (Full): ${patternFull}`);

    if (matchingKey) {
      if (patternFull === matchingKey) {
        console.log("   ✅ MATCHES KEY EXACTLY (Full Text)");
      } else {
        console.log("   ❌ DOES NOT MATCH KEY (Full Text)");
        // Find diff
        findDifference(patternFull, matchingKey);
      }
    }

    // Check lines
    const lines = card.rulesText.split("\n").filter(l => l.trim());
    console.log(`   Checking ${lines.length} lines:`);
    for (const line of lines) {
       const normalizedLine = normalizeText(line.trim());
       const strippedLine = stripAllParentheses(normalizedLine);
       const patternLine = normalizeToPattern(strippedLine);

       console.log(`     Line Pattern: ${patternLine}`);
       if (matchingKey && patternLine === matchingKey) {
         console.log("     ✅ MATCHES KEY EXACTLY (Line)");
       } else if (matchingKey) {
         // Check if key is contained in line or vice versa
         // or if they are similar
       }

       if (patternLine in MANUAL_ENTRIES) {
           console.log(`     ✅ FOUND IN MANUAL_ENTRIES (as: "${patternLine.substring(0, 30)}...")`);
       }
    }
    console.log("");
  }
}

function findDifference(str1: string, str2: string): void {
  const len = Math.max(str1.length, str2.length);
  for (let i = 0; i < len; i++) {
    if (str1[i] !== str2[i]) {
      console.log(`   ⚠️  Difference at char ${i}:`);
      console.log(`      Card: "...${str1.substring(Math.max(0, i-10), i)}[${str1[i] || 'EOF'}]${str1.substring(i+1, i+11)}..."`);
      console.log(`      Key:  "...${str2.substring(Math.max(0, i-10), i)}[${str2[i] || 'EOF'}]${str2.substring(i+1, i+11)}..."`);
      return;
    }
  }
}

main();
