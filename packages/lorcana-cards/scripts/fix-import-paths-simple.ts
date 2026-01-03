#!/usr/bin/env bun
/**
 * Fix Test Import Path Casing (Simple)
 *
 * Fixes test file import paths by reading actual directory entries.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Fix a test file's import paths
 */
function fixTestFile(
  testFilePath: string,
  actualCardFileName: string,
): boolean {
  const testContent = readFileSync(testFilePath, "utf-8");

  // Extract the card number from the filename (e.g., "063" from "063-freeze.test.ts")
  const cardNumber = actualCardFileName.match(/^(\d+)-/)?.[1] || "";
  if (!cardNumber) return false;

  // Get the actual base filename without extension
  const baseName = actualCardFileName.replace(".test", "").replace(".ts", "");

  // Build the correct import path
  const correctImport = `from "./${baseName}"`;

  // Check if the test file already has the correct import
  if (testContent.includes(correctImport)) {
    return false;
  }

  // Find and replace any import with this card number
  const importRegex = new RegExp(
    `from\\s*["']\\./${cardNumber}-[^"']+["']`,
    "g",
  );
  const newContent = testContent.replace(importRegex, correctImport);

  if (newContent !== testContent) {
    writeFileSync(testFilePath, newContent, "utf-8");
    return true;
  }

  return false;
}

/**
 * Main function
 */
function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");
  const cardsDir = join(baseDir, "src/cards/001");

  console.log("Fixing test import path casing...\n");

  let fixedCount = 0;
  const typeDirs = ["actions", "characters", "items", "songs"];

  for (const typeDir of typeDirs) {
    const dirPath = join(cardsDir, typeDir);
    let entries: any[];
    try {
      entries = readdirSync(dirPath, { withFileTypes: true });
    } catch {
      continue;
    }

    // Get actual card files (not tests, not index)
    const cardFiles = entries
      .filter(
        (e) =>
          e.isFile() &&
          e.name.endsWith(".ts") &&
          e.name !== "index.ts" &&
          !e.name.endsWith(".test.ts"),
      )
      .map((e) => e.name.replace(".ts", ""));

    // Check for corresponding test files
    for (const cardFile of cardFiles) {
      const testPath = join(dirPath, `${cardFile}.test.ts`);

      if (!readdirSync(dirPath).includes(`${cardFile}.test.ts`)) {
        continue;
      }

      if (fixTestFile(testPath, cardFile)) {
        fixedCount++;
        console.log(`  ✓ Fixed ${cardFile}.test.ts`);
      }
    }
  }

  console.log(`\nFixed ${fixedCount} test files`);
}

main();
