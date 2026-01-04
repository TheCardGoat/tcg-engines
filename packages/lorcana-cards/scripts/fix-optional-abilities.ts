#!/usr/bin/env bun
/**
 * Fix Optional Abilities
 *
 * Add id and text to ActionAbility with optional effects
 */

import { readFileSync, writeFileSync } from "node:fs";

// For each file, add id and text to ActionAbility with optional effect
const fixes = [
  {
    file: "src/cards/001/characters/113-maleficent-monstrous-dragon.ts",
    id: "b6l-1",
    text: "**MALEFICENT'S SCEPTER** You may banish chosen character.",
  },
  {
    file: "src/cards/001/characters/137-ariel-whoseit-collector.ts",
    id: "c6b-1",
    text: "**PRINCE'S CHARM** You may ready this character.",
  },
  {
    file: "src/cards/001/characters/173-captain-hook-captain-of-the-jolly-roger.ts",
    id: "c2l-1",
    text: "**CAPTAIN HOOK** You may return target character to their player's hand.",
  },
  {
    file: "src/cards/001/characters/193-tinker-bell-giant-fairy.ts",
    id: "c3s-1",
    text: "**FAIRY DUST** When you play this character, you may deal 1 damage to each opposing character.",
  },
  {
    file: "src/cards/001/characters/drFacilierAgentProvocateur.ts",
    id: "c3l-1",
    text: "**SLEIGHT OF HAND** When you play this character, you may return target character to their player's hand.",
  },
  {
    file: "src/cards/001/characters/princePhillipDragonSlayer.ts",
    id: "c7p-1",
    text: "**DRAGON SLAYER** When you play this character, you may banish chosen character.",
  },
  {
    file: "src/cards/001/items/166-coconut-basket.ts",
    id: "d2s-1",
    text: "**TREAT** You may remove up to 3 damage from chosen character.",
  },
];

function fixFile(filePath: string, id: string, text: string): boolean {
  const content = readFileSync(filePath, "utf-8");

  // Pattern: { type: "action",\n effect: { type: "optional", ...
  // Replace with: { type: "action",\n id: "...",\n text: "...",\n effect: { type: "optional", ...
  const pattern = /(\{\s*type: "action",)\s*(effect:\s*\{\s*type: "optional",)/;
  const replacement = `$1\n  id: "${id}",\n  text: "${text}",\n  $2`;

  const newContent = content.replace(pattern, replacement);

  if (newContent === content) return false;

  writeFileSync(filePath, newContent, "utf-8");
  return true;
}

let fixedCount = 0;
for (const fix of fixes) {
  try {
    if (fixFile(fix.file, fix.id, fix.text)) {
      fixedCount++;
      console.log(`✓ Fixed ${fix.file}`);
    }
  } catch (error) {
    console.error(`✗ Error fixing ${fix.file}: ${error}`);
  }
}

console.log(`\nFixed ${fixedCount} files`);
