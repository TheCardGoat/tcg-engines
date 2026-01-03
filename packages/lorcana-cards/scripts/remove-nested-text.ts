#!/usr/bin/env bun
/**
 * Remove Text from Nested Effects
 */

import { readFileSync, writeFileSync } from "node:fs";

const fixes = [
  { file: "src/cards/001/actions/100-vicious-betrayal.ts", line: 32 },
  { file: "src/cards/001/actions/161-develop-your-brain.ts", line: 35 },
  {
    file: "src/cards/001/characters/157-robin-hood-unrivaled-archer.ts",
    line: 35,
  },
  {
    file: "src/cards/001/characters/194-tinker-bell-tiny-tactician.ts",
    line: 37,
  },
  { file: "src/cards/001/items/067-ursula-cauldron.ts", line: 35 },
  { file: "src/cards/001/items/201-beast-mirror.ts", line: 32 },
  { file: "src/cards/001/characters/stichtCarefreeSurfer.ts", line: 35 },
];

function removeTextFromLine(filePath: string, lineNum: number): boolean {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  if (lineNum > lines.length) return false;

  const line = lines[lineNum - 1];
  if (!line.includes("text:")) return false;

  // Remove the line
  lines.splice(lineNum - 1, 1);

  writeFileSync(filePath, lines.join("\n"), "utf-8");
  return true;
}

let fixedCount = 0;
for (const fix of fixes) {
  try {
    if (removeTextFromLine(fix.file, fix.line)) {
      fixedCount++;
      console.log(`✓ Removed text from ${fix.file}:${fix.line}`);
    }
  } catch (error) {
    console.error(`✗ Error fixing ${fix.file}: ${error}`);
  }
}

console.log(`\nFixed ${fixedCount} files`);
