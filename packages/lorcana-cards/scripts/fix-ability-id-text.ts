#!/usr/bin/env bun
/**
 * Fix Missing Ability id and text
 *
 * Adds missing id and text fields to action abilities.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const filesToFix = [
  "src/cards/001/actions/130-dragon-fire.ts",
  "src/cards/001/actions/197-fire-the-cannons.ts",
  "src/cards/001/actions/200-smash.ts",
  "src/cards/001/actions/controlYourTemper.ts",
  "src/cards/001/actions/healingGlow.ts",
  "src/cards/001/characters/cinderellaGentleAndKind.ts",
  "src/cards/001/characters/rapunzelGiftedWithHealing.ts",
  "src/cards/001/items/dingleHopper.ts",
  "src/cards/001/songs/198-grab-your-sword.ts",
  "src/cards/001/songs/hakunaMatata.ts",
];

function fixFile(filePath: string): boolean {
  const content = readFileSync(filePath, "utf-8");

  // Extract card id and text
  const idMatch = content.match(/id: "([^"]+)"/);
  const textMatch = content.match(/text: "([^"]+)"/);

  if (!(idMatch && textMatch)) {
    console.warn(`  Warning: Could not extract id or text from ${filePath}`);
    return false;
  }

  const cardId = idMatch[1];
  const cardText = textMatch[1];

  // Pattern to match action abilities without id and text
  const pattern = /(\s+{\s+type: "action",)\s+(effect: \{[^}]+\},)/s;

  const replacement = `$1\n  id: "${cardId}-1",\n  text: "${cardText}",\n  $2`;

  const newContent = content.replace(pattern, replacement);

  if (newContent === content) {
    return false; // No changes
  }

  writeFileSync(filePath, newContent, "utf-8");
  return true;
}

function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");

  console.log("Adding missing id and text to action abilities...\n");

  let fixedCount = 0;
  for (const file of filesToFix) {
    const filePath = join(baseDir, file);
    try {
      if (fixFile(filePath)) {
        fixedCount++;
        console.log(`  ✓ Fixed ${file}`);
      }
    } catch (error) {
      console.error(`  ✗ Error fixing ${file}: ${error}`);
    }
  }

  console.log(`\nFixed ${fixedCount} files`);
}

main();
