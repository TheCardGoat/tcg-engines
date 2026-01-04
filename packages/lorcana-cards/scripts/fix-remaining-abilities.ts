#!/usr/bin/env bun
/**
 * Fix Remaining Abilities
 *
 * 1. Add id and text to abilities with optional effects
 * 2. Remove text property from nested effects
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const optionalEffectFiles = [
  "src/cards/001/characters/051-mickey-mouse-wayward-sorcerer.ts",
  "src/cards/001/characters/113-maleficent-monstrous-dragon.ts",
  "src/cards/001/characters/137-ariel-whoseit-collector.ts",
  "src/cards/001/characters/173-captain-hook-captain-of-the-jolly-roger.ts",
  "src/cards/001/characters/193-tinker-bell-giant-fairy.ts",
  "src/cards/001/characters/drFacilierAgentProvocateur.ts",
  "src/cards/001/characters/princePhillipDragonSlayer.ts",
  "src/cards/001/items/166-coconut-basket.ts",
];

const textOnEffectFiles = [
  "src/cards/001/actions/100-vicious-betrayal.ts",
  "src/cards/001/actions/161-develop-your-brain.ts",
  "src/cards/001/characters/157-robin-hood-unrivaled-archer.ts",
  "src/cards/001/characters/194-tinker-bell-tiny-tactician.ts",
  "src/cards/001/items/067-ursula-cauldron.ts",
  "src/cards/001/items/201-beast-mirror.ts",
];

function fixOptionalEffectFile(filePath: string): boolean {
  const content = readFileSync(filePath, "utf-8");

  // Extract card id and text
  const idMatch = content.match(/id: "([^"]+)"/);
  const cardTextMatch = content.match(/text: "([^"]+)"/);

  if (!(idMatch && cardTextMatch)) {
    console.warn(`  Warning: Could not extract id or text from ${filePath}`);
    return false;
  }

  const cardId = idMatch[1];
  const cardText = cardTextMatch[1];

  // Find action abilities with optional effect but missing id/text
  // Pattern: { type: "action", effect: { type: "optional", ...} }
  const pattern = /(\{\s*type: "action",\s*effect:\s*\{\s*type: "optional",)/g;

  const replacement = `$1\n  id: "${cardId}-1",\n  text: "${cardText}",`;

  const newContent = content.replace(pattern, replacement);

  if (newContent === content) {
    return false;
  }

  writeFileSync(filePath, newContent, "utf-8");
  return true;
}

function removeTextFromEffects(filePath: string): boolean {
  const content = readFileSync(filePath, "utf-8");

  // Remove text property from nested effects
  // This looks for "text": "..." inside effect objects
  const pattern = /,\s*"text":\s*"[^"]*",?\s*(?=\n\s*}|,)/g;

  const newContent = content.replace(pattern, "");

  if (newContent === content) {
    return false;
  }

  writeFileSync(filePath, newContent, "utf-8");
  return true;
}

function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");

  console.log("Fixing optional effect abilities...\n");

  let fixedCount = 0;
  for (const file of optionalEffectFiles) {
    const filePath = join(baseDir, file);
    try {
      if (fixOptionalEffectFile(filePath)) {
        fixedCount++;
        console.log(`  ✓ Fixed id/text in ${file}`);
      }
    } catch (error) {
      console.error(`  ✗ Error fixing ${file}: ${error}`);
    }
  }

  console.log("\nFixing text on effects...\n");

  for (const file of textOnEffectFiles) {
    const filePath = join(baseDir, file);
    try {
      if (removeTextFromEffects(filePath)) {
        fixedCount++;
        console.log(`  ✓ Removed text from effects in ${file}`);
      }
    } catch (error) {
      console.error(`  ✗ Error fixing ${file}: ${error}`);
    }
  }

  console.log(`\nFixed ${fixedCount} files`);
}

main();
