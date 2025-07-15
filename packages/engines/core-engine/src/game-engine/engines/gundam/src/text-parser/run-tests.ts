#!/usr/bin/env node

/**
 * Test runner for the Gundam card text parser
 *
 * This script provides a simple way to run tests on the Gundam text parser
 * and verify its functionality with specific card examples.
 */

import st01Cards from "../cards/imports/st01.json";
import { parseGundamText, VERSION } from "./index";

// Helper function to clean HTML entities from card text
function cleanCardText(text: string): string {
  if (!text) return "";

  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<br>/g, "\n")
    .replace(/【(.+?)】/g, "【$1】\n") // Add newlines after timing markers
    .trim();
}

// Simple color formatting for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Header
console.log(
  `${colors.bright}${colors.cyan}==================================${colors.reset}`,
);
console.log(
  `${colors.bright}${colors.cyan}  GUNDAM CARD TEXT PARSER TESTS  ${colors.reset}`,
);
console.log(
  `${colors.bright}${colors.cyan}  Version: ${VERSION}${colors.reset}`,
);
console.log(
  `${colors.bright}${colors.cyan}==================================${colors.reset}\n`,
);

// Run tests on a few interesting card examples
console.log(
  `${colors.bright}Testing individual card examples:${colors.reset}\n`,
);

const testCases = [
  {
    name: "Gundam - Repair Keyword",
    code: "ST01-001",
    text: "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\n【During Pair】During your turn, all your Units get AP+1.",
  },
  {
    name: "Demi Trainer - Blocker Keyword",
    code: "ST01-008",
    text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  },
  {
    name: "Guntank - Deploy Effect",
    code: "ST01-004",
    text: "【Deploy】Choose 1 enemy Unit with 2 or less HP. Rest it.",
  },
  {
    name: "White Base - Multiple Abilities",
    code: "ST01-015",
    text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n【Activate･Main】【Once per Turn】②：Deploy 1 [Gundam]((White Base Team)･AP3･HP3) Unit token if you have no Units in play, deploy 1 [Guncannon]((White Base Team)･AP2･HP2) Unit token if you have only 1 Unit in play, or deploy 1 [Guntank]((White Base Team)･AP1･HP1) Unit token if you have 2 or more Units in play.",
  },
];

// Run individual test cases
testCases.forEach((testCase) => {
  console.log(
    `${colors.bright}${colors.blue}${testCase.code} - ${testCase.name}${colors.reset}`,
  );
  console.log(`${colors.dim}Text: ${testCase.text}${colors.reset}`);

  try {
    const result = parseGundamText(testCase.text);

    if (result.errors.length > 0) {
      console.log(
        `${colors.red}Errors: ${result.errors.join(", ")}${colors.reset}`,
      );
    } else {
      console.log(`${colors.green}✓ Parsed successfully${colors.reset}`);
      console.log(`  Generated ${result.abilities.length} abilities`);

      // Print each ability
      result.abilities.forEach((ability, idx) => {
        console.log(
          `  ${colors.cyan}Ability ${idx + 1}: ${ability.type}${colors.reset}`,
        );

        if (ability.timing) {
          console.log(`    Timing: ${ability.timing}`);
        }

        if (ability.keyword) {
          console.log(
            `    Keyword: ${ability.keyword}${ability.value ? " " + ability.value : ""}`,
          );
        }

        if (ability.effects) {
          console.log(`    Effects: ${ability.effects.length}`);
          ability.effects.forEach((effect, eIdx) => {
            console.log(`      ${eIdx + 1}. ${effect.type}`);
          });
        }
      });
    }

    if (result.warnings.length > 0) {
      console.log(
        `${colors.yellow}Warnings: ${result.warnings.join(", ")}${colors.reset}`,
      );
    }
  } catch (error) {
    console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
  }

  console.log(""); // Empty line between tests
});

// Run tests on the full ST01 card set
console.log(`${colors.bright}Testing all ST01 cards:${colors.reset}\n`);

// Filter out cards without effects
const cardsWithEffects = st01Cards.filter(
  (card) =>
    card.effect &&
    card.effect !== "-" &&
    !card.cardType.includes("TOKEN") &&
    !card.cardType.includes("RESOURCE"),
);

console.log(`Found ${cardsWithEffects.length} cards with effects`);

// Count by card type
const cardTypeCount: Record<string, number> = {};
cardsWithEffects.forEach((card) => {
  cardTypeCount[card.cardType] = (cardTypeCount[card.cardType] || 0) + 1;
});

console.log("Card types:");
Object.entries(cardTypeCount).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});

// Count cards by effect type
let repairCount = 0;
let blockerCount = 0;
let deployCount = 0;
let drawCount = 0;

// Process all cards and track results
const results = cardsWithEffects.map((card) => {
  const cleanedText = cleanCardText(card.effect);

  // Count specific effect types
  if (cleanedText.includes("<Repair")) repairCount++;
  if (cleanedText.includes("<Blocker")) blockerCount++;
  if (cleanedText.includes("【Deploy】")) deployCount++;
  if (cleanedText.includes("Draw")) drawCount++;

  try {
    const parseResult = parseGundamText(cleanedText);

    return {
      code: card.code,
      name: card.name,
      cardType: card.cardType,
      success: parseResult.errors.length === 0,
      abilityCount: parseResult.abilities.length,
      warnings: parseResult.warnings,
      errors: parseResult.errors,
    };
  } catch (error) {
    return {
      code: card.code,
      name: card.name,
      cardType: card.cardType,
      success: false,
      abilityCount: 0,
      warnings: [],
      errors: [error.message],
    };
  }
});

// Count successes and failures
const successCount = results.filter((r) => r.success).length;
const failureCount = results.filter((r) => !r.success).length;

// Summary
console.log("\nEffect counts:");
console.log(`  Repair: ${repairCount}`);
console.log(`  Blocker: ${blockerCount}`);
console.log(`  Deploy: ${deployCount}`);
console.log(`  Draw: ${drawCount}`);

// Final results
console.log(`\n${colors.bright}Final results:${colors.reset}`);
console.log(
  `${colors.green}${successCount}${colors.reset}/${results.length} cards parsed successfully`,
);

if (failureCount > 0) {
  console.log(`\n${colors.red}Cards with errors:${colors.reset}`);
  results
    .filter((r) => !r.success)
    .forEach((result) => {
      console.log(
        `${colors.red}${result.code} - ${result.name}: ${result.errors.join(", ")}${colors.reset}`,
      );
    });
}

// Exit with appropriate code
if (failureCount > 0) {
  process.exit(1);
} else {
  console.log(`\n${colors.green}All tests passed!${colors.reset}`);
  process.exit(0);
}
