#!/usr/bin/env bun
/**
 * Fix Ability Structure
 *
 * Move id/text from OptionalEffect to parent ActionAbility
 * Remove id/text from nested effects
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const filesToFix = [
  "src/cards/001/characters/051-mickey-mouse-wayward-sorcerer.ts",
  "src/cards/001/characters/113-maleficent-monstrous-dragon.ts",
  "src/cards/001/characters/137-ariel-whoseit-collector.ts",
  "src/cards/001/characters/173-captain-hook-captain-of-the-jolly-roger.ts",
  "src/cards/001/characters/193-tinker-bell-giant-fairy.ts",
  "src/cards/001/characters/drFacilierAgentProvocateur.ts",
  "src/cards/001/characters/princePhillipDragonSlayer.ts",
  "src/cards/001/items/166-coconut-basket.ts",
  "src/cards/001/actions/100-vicious-betrayal.ts",
  "src/cards/001/actions/161-develop-your-brain.ts",
  "src/cards/001/characters/157-robin-hood-unrivaled-archer.ts",
  "src/cards/001/characters/194-tinker-bell-tiny-tactician.ts",
  "src/cards/001/items/067-ursula-cauldron.ts",
  "src/cards/001/items/201-beast-mirror.ts",
  "src/cards/001/characters/stichtCarefreeSurfer.ts",
];

function fixFile(filePath: string): boolean {
  let content = readFileSync(filePath, "utf-8");
  const original = content;

  // Extract card id and text
  const idMatch = content.match(/^export const \w+: \w+ = \{\s*id: "([^"]+)"/m);
  const textMatch = content.match(/text: "([^"]+)"/);

  if (!idMatch) {
    console.warn(`  Warning: Could not extract id from ${filePath}`);
    return false;
  }

  const cardId = idMatch[1];
  const cardText = textMatch ? textMatch[1] : "";

  // Fix 1: Remove id/text from OptionalEffect and move to parent ActionAbility
  // Pattern: { type: "action", effect: { type: "optional", id: "...", text: "...", effect: { ... }, chooser: "..." } }
  content = content.replace(
    /(\{\s*type: "action",)\s*(effect:\s*\{\s*type: "optional",)\s*id: "[^"]*",\s*text: "[^"]*",\s*(effect: \{[^}]+\},\s*chooser: "[^"]*")/gs,
    `$1\n  id: "${cardId}-1",\n  text: "${cardText}",\n  $2\n  $3`,
  );

  // Fix 2: Remove id/text from nested effects (not in optional)
  // Remove "id": "..." from effects
  content = content.replace(/,\s*id: "[^"]*",?\s*(?=\n\s*}|,)/g, ",");
  // Remove "text": "..." from effects
  content = content.replace(/,\s*text: "[^"]*",?\s*(?=\n\s*}|,)/g, ",");

  // Clean up trailing commas
  content = content.replace(/,\s*}/g, "}");
  content = content.replace(/,\s*,/g, ",");

  if (content !== original) {
    writeFileSync(filePath, content, "utf-8");
    return true;
  }
  return false;
}

function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");

  console.log("Fixing ability structure...\n");

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
