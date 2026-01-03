#!/usr/bin/env bun
/**
 * Fix Test File Bun Imports
 *
 * Fixes corrupted bun:test imports in test files.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CORRECT_IMPORT = 'import { describe, expect, it } from "bun:test";';

/**
 * Fix a test file's bun:test import
 */
function fixTestFile(testFilePath: string): boolean {
  const testContent = readFileSync(testFilePath, "utf-8");

  // Check if the import is already correct
  if (testContent.includes(CORRECT_IMPORT)) {
    return false;
  }

  // Check if the import is corrupted (contains something other than describe, expect, it)
  const importMatch = testContent.match(
    /import\s*\{[^}]+\}\s*from\s*["']bun:test["']/,
  );
  if (!importMatch) {
    return false; // No bun:test import found
  }

  const importStatement = importMatch[0];
  // Check if it contains only valid imports (check the import statement itself, not the whole file)
  const validImports = [
    "describe",
    "expect",
    "it",
    "beforeEach",
    "afterEach",
    "test",
  ];
  const hasValidImports = validImports.some((v) => importStatement.includes(v));

  // Extract what's inside the { }
  const contentMatch = importStatement.match(/\{\s*([^}]+)\s*\}/);
  const importedItems = contentMatch
    ? contentMatch[1].split(",").map((s) => s.trim())
    : [];

  // Check if all imported items are valid
  const allValid = importedItems.every((item) => validImports.includes(item));

  if (allValid && importedItems.length > 0) {
    // Already has valid imports, skip
    return false;
  }

  // Replace the corrupted import with the correct one
  const newContent = testContent.replace(
    /import\s*\{[^}]+\}\s*from\s*["']bun:test["']/,
    CORRECT_IMPORT,
  );

  writeFileSync(testFilePath, newContent, "utf-8");
  return true;
}

/**
 * Main function
 */
function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");
  const cardsDir = join(baseDir, "src/cards/001");

  console.log("Fixing test file bun:test imports...\n");

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
      if (!(entry.isFile() && entry.name.endsWith(".test.ts"))) {
        continue;
      }

      const testPath = join(dirPath, entry.name);

      // Fix the test file
      if (fixTestFile(testPath)) {
        fixedCount++;
        console.log(`  ✓ Fixed ${entry.name}`);
      }
    }
  }

  console.log(`\nFixed ${fixedCount} test files`);
}

main();
