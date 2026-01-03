#!/usr/bin/env bun
/**
 * Fix Ability Definitions
 *
 * Adds missing `id` and `text` properties to ability definitions.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Fix abilities in a card file
 */
function fixAbilities(filePath: string): boolean {
  const content = readFileSync(filePath, "utf-8");
  let newContent = content;
  let fixed = false;

  // Find the abilities array
  const abilitiesMatch = content.match(/abilities:\s*\[([\s\S]*?)\]/);
  if (!abilitiesMatch) {
    return false;
  }

  const abilitiesBlock = abilitiesMatch[1];
  const cardIdMatch = content.match(/id:\s*"([^"]+)"/);
  const cardId = cardIdMatch ? cardIdMatch[1] : "unknown";
  const cardTextMatch = content.match(/text:\s*"([^"]+)"/);
  const cardText = cardTextMatch ? cardTextMatch[1] : "";

  // Find each ability object and check if it has id and text
  const abilityRegex = /\{\s*"type":\s*"([^"]+)"([^}]*)\}/g;
  let match;
  let index = 0;

  while ((match = abilityRegex.exec(abilitiesBlock)) !== null) {
    const abilityObj = match[0];
    const abilityType = match[1];
    const abilityRest = match[2];

    // Check if ability has id and text
    const hasId = abilityObj.includes('"id":');
    const hasText = abilityObj.includes('"text":');

    if (!(hasId && hasText)) {
      // Need to add id and/or text
      index++;

      // Build new ability object with id and text
      let newAbility = abilityObj;

      // Insert id after type
      if (!hasId) {
        const abilityId = `${cardId}-${index}`;
        newAbility = newAbility.replace(
          /("type":\s*"[^"]+")/,
          `$1,\n  "id": "${abilityId}"`,
        );
      }

      // Insert text after id (or type if no id)
      if (!hasText) {
        // Use the card's text as fallback, or generate a generic description
        const abilityText = cardText || `${abilityType} ability`;
        // Find where to insert (after id or after type)
        const insertAfter = hasId ? /("id":\s*"[^"]+")/ : /("type":\s*"[^"]+")/;
        newAbility = newAbility.replace(
          insertAfter,
          `$1,\n  "text": "${abilityText}"`,
        );
      }

      newContent = newContent.replace(abilityObj, newAbility);
      fixed = true;
    }
  }

  if (fixed) {
    writeFileSync(filePath, newContent, "utf-8");
  }

  return fixed;
}

/**
 * Main function
 */
function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");
  const cardsDir = join(baseDir, "src/cards/001");

  console.log("Fixing ability definitions...\n");

  let fixedCount = 0;
  const typeDirs = ["actions", "characters", "items", "songs"];

  for (const typeDir of typeDirs) {
    const dirPath = join(cardsDir, typeDir);
    let entries: any[];
    try {
      entries = readdirSync(dirPath, { withFileTypes: true });
    } catch {
      continue; // Directory doesn't exist, skip
    }

    for (const entry of entries) {
      if (
        !(entry.isFile() && entry.name.endsWith(".ts")) ||
        entry.name.startsWith(".")
      ) {
        continue;
      }

      // Skip index and test files
      if (entry.name === "index.ts" || entry.name.endsWith(".test.ts")) {
        continue;
      }

      const cardPath = join(dirPath, entry.name);

      // Fix the card file
      if (fixAbilities(cardPath)) {
        fixedCount++;
        console.log(`  ✓ Fixed ${entry.name}`);
      }
    }
  }

  console.log(`\nFixed ${fixedCount} card files`);
}

main();
