import fs from "node:fs";
import path from "node:path";
import { MANUAL_ENTRIES } from "../src/parser/manual-overrides";
import { normalizeToPattern } from "../src/parser/numeric-extractor";
import { normalizeText } from "../src/parser/preprocessor";
import { hasManualOverride } from "./generators/parser-validator";
import type { CanonicalCard } from "./types";

const CANONICAL_CARDS_PATH = path.resolve(
  process.cwd(),
  "packages/lorcana-cards/src/data/canonical-cards.json",
);

function stripAllParentheses(text: string): string {
  return text
    .replace(/\([^)]*\)/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function debug() {
  const cards = JSON.parse(
    fs.readFileSync(CANONICAL_CARDS_PATH, "utf-8"),
  ) as Record<string, CanonicalCard>;

  const targetCardName = "Tramp - Street-Smart Dog";
  const card = Object.values(cards).find((c) => c.fullName === targetCardName);

  if (!card) {
    console.error("Card not found");
    return;
  }

  console.log(`Checking card: ${card.fullName}`);

  let fullText = card.rulesText || "";
  console.log("Original Text:", JSON.stringify(fullText));

  fullText = fullText.replace(/\n/g, " ");
  const stripped = stripAllParentheses(fullText);
  const normalized = normalizeText(stripped);
  const pattern = normalizeToPattern(normalized);

  console.log("Generated Pattern:", JSON.stringify(pattern));

  const key = Object.keys(MANUAL_ENTRIES).find((k) =>
    k.includes("NOW IT'S A PARTY"),
  );

  if (!key) {
    console.error("Key not found in MANUAL_ENTRIES");
    return;
  }

  console.log("Map Key:          ", JSON.stringify(key));
  console.log("Match?", pattern === key);

  console.log("Match?", pattern === key);
  console.log("Is key in MANUAL_ENTRIES?", key in MANUAL_ENTRIES);
  console.log("Is pattern in MANUAL_ENTRIES?", pattern in MANUAL_ENTRIES);

  const hasOverride = hasManualOverride(card);
  console.log("hasManualOverride(card)?", hasOverride);

  if (pattern !== key) {
    console.log("Is pattern NFC?", pattern.normalize("NFC") === pattern);
    console.log("Is key NFC?", key.normalize("NFC") === key);
    console.log(
      "Normalization forms:",
      pattern.normalize("NFC") === key.normalize("NFC")
        ? "Match in NFC"
        : "Mismatch even in NFC",
    );
    console.log("Lengths:", pattern.length, key.length);
    for (let i = 0; i < Math.max(pattern.length, key.length); i++) {
      if (pattern[i] !== key[i]) {
        console.log(
          `Mismatch at ${i}: '${pattern.charCodeAt(i)}' vs '${key.charCodeAt(i)}'`,
        );
        console.log(`Chars: '${pattern[i]}' vs '${key[i]}'`);
        break;
      }
    }
  }
}

debug();
