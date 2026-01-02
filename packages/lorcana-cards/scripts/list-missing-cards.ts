import fs from "node:fs";
import path from "node:path";
import { parseAbilityText } from "../src/parser";
import { isParseableCard } from "./generators/parser-validator";
import { getAllCards, loadMergedInput } from "./parsers/input-parser";

const CARDS_DIR = path.resolve(__dirname, "../src/cards/001");

/**
 * Strip reminder text (parenthetical content) from ability text.
 */
function stripReminderText(text: string): string {
  return text
    .replace(/^\s*\([^)]*\)\s*/, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
}

async function main() {
  const input = loadMergedInput();
  const allCards = getAllCards(input);

  // Filter for Set 1
  const set1Cards = allCards.filter((c) => c.card_sets.includes("set1"));

  console.log("# Missing Set 1 Cards Diagnosis");
  console.log(`Total Set 1 Cards: ${set1Cards.length}`);

  const missingCards = [];

  for (const card of set1Cards) {
    // Logic from printings-generator/canonical-generator to get the ID is complex.
    // Instead, let's just use the card name and confirm if it parses.
    // If isParseableCard returns false, it wasn't generated (unless it's vanilla).

    const rulesText = card.rules_text;

    if (!rulesText) continue; // Vanilla cards are generated

    const abilityTexts = rulesText.split("\n").filter((t) => t.trim());
    let failed = false;
    const reasons = [];

    for (const text of abilityTexts) {
      const clean = stripReminderText(text);
      if (!clean) continue;
      const result = parseAbilityText(clean);

      if (!result.success) {
        failed = true;
        reasons.push(`Syntax Error: ${result.error}`);
      }
      // No strict checking besides success/error for diagnosing
    }

    if (failed) {
      console.log(`\n### ${card.name}`);
      console.log(`**Text**: ${rulesText.replace(/\n/g, " ")}`);
      reasons.forEach((r) => console.log(`- ${r}`));
      missingCards.push(card.name);
    }
  }

  console.log(`\n\nTotal Missing due to Parsing: ${missingCards.length}`);
}

main();
