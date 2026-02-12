/**
 * Script to generate placeholder parser tests for all card texts.
 * Each test is skipped by default and tests the parseEffect function.
 *
 * Run with: bun run src/scripts/generate-parser-tests.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { all001Cards } from "../cards/001";
import { all002Cards } from "../cards/002";
import { all003Cards } from "../cards/003";
import { all004Cards } from "../cards/004";
import { all005Cards } from "../cards/005";
import { all006Cards } from "../cards/006";
import { all007Cards } from "../cards/007";
import { all008Cards } from "../cards/008";
import { all009Cards } from "../cards/009";
import { all010Cards } from "../cards/010";

interface Card {
  id: string;
  name: string;
  version?: string;
  fullName?: string;
  text?: string;
  cardNumber: number;
  set: string;
}

const setData: { setNumber: string; cards: Card[] }[] = [
  { cards: all001Cards as Card[], setNumber: "001" },
  { cards: all002Cards as Card[], setNumber: "002" },
  { cards: all003Cards as Card[], setNumber: "003" },
  { cards: all004Cards as Card[], setNumber: "004" },
  { cards: all005Cards as Card[], setNumber: "005" },
  { cards: all006Cards as Card[], setNumber: "006" },
  { cards: all007Cards as Card[], setNumber: "007" },
  { cards: all008Cards as Card[], setNumber: "008" },
  { cards: all009Cards as Card[], setNumber: "009" },
  { cards: all010Cards as Card[], setNumber: "010" },
];

function escapeString(str: string): string {
  return str
    .replace(/\\/g, String.raw`\\`)
    .replace(/"/g, String.raw`\"`)
    .replace(/\n/g, String.raw`\n`)
    .replace(/\r/g, String.raw`\r`)
    .replace(/\t/g, String.raw`\t`);
}

function getCardDisplayName(card: Card): string {
  if (card.fullName) {
    return card.fullName;
  }
  if (card.version) {
    return `${card.name} - ${card.version}`;
  }
  return card.name;
}

function generateTestFile(setNumber: string, cards: Card[]): string {
  const cardsWithText = cards.filter((card) => card.text && card.text.trim());

  const sortedCards = cardsWithText.toSorted((a, b) => a.cardNumber - b.cardNumber);

  const testCases = sortedCards.map((card) => {
    const displayName = getCardDisplayName(card);
    const escapedText = escapeString(card.text || "");

    return `  it.skip("${escapeString(displayName)}: should parse card text", () => {
    const text = "${escapedText}";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });`;
  });

  return `import { describe, expect, it } from "bun:test";
import { parseAbilityTextMulti } from "../../parser";

describe("Set ${setNumber} Card Text Parser Tests", () => {
${testCases.join("\n\n")}
});
`;
}

function main() {
  const outputDir = path.resolve(
    import.meta.dir,
    "../parser/v2/__tests__/card-texts",
  );

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalCards = 0;
  let totalCardsWithText = 0;

  for (const { setNumber, cards } of setData) {
    const cardsWithText = cards.filter((card) => card.text && card.text.trim());
    totalCards += cards.length;
    totalCardsWithText += cardsWithText.length;

    const content = generateTestFile(setNumber, cards);
    const outputPath = path.join(outputDir, `set-${setNumber}.test.ts`);

    fs.writeFileSync(outputPath, content, "utf8");
    console.log(
      `Generated ${outputPath} with ${cardsWithText.length} test cases`,
    );
  }

  console.log("\n--- Summary ---");
  console.log(`Total cards processed: ${totalCards}`);
  console.log(`Cards with text (tests generated): ${totalCardsWithText}`);
  console.log(
    `Cards without text (skipped): ${totalCards - totalCardsWithText}`,
  );
}

main();
