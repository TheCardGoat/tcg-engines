#!/usr/bin/env bun
/**
 * Fix Test File Imports
 *
 * Fixes test file imports to match the actual export names from card files.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Extract export name from card file
 */
function getExportName(content: string): string | null {
  const match = content.match(/export\s+const\s+(\w+)\s*:/);
  return match ? match[1] : null;
}

/**
 * Fix a test file
 */
function fixTestFile(testFilePath: string, cardFilePath: string): boolean {
  const testContent = readFileSync(testFilePath, "utf-8");
  const cardContent = readFileSync(cardFilePath, "utf-8");

  const cardExportName = getExportName(cardContent);
  if (!cardExportName) {
    console.warn(`  Warning: Could not find export name in ${cardFilePath}`);
    return false;
  }

  // Get the card filename without extension for import path
  const cardFileName = cardFilePath.split("/").pop()?.replace(".ts", "") || "";

  // Check if the test file already has correct import
  const expectedImport = `import { ${cardExportName} } from "./${cardFileName}";`;
  if (testContent.includes(expectedImport)) {
    // Still need to check if variable names inside match
    const importMatch = testContent.match(
      /import\s*\{\s*([^}]+)\s*\}\s*from\s*["']\.\/[^"']+["']/,
    );
    if (importMatch) {
      const importedName = importMatch[1].trim();
      if (importedName !== cardExportName) {
        // Need to replace variable names inside test
        return replaceVariableNames(
          testFilePath,
          testContent,
          importedName,
          cardExportName,
        );
      }

      // Check for case-insensitive mismatches in variable names
      // Find all identifier-like usages and see if any don't match case
      const allMatches = testContent.matchAll(/\b[a-z][a-zA-Z0-9]+\b/g);
      for (const match of allMatches) {
        const matchStr = match[0];
        if (
          matchStr.toLowerCase() === cardExportName.toLowerCase() &&
          matchStr !== cardExportName
        ) {
          // Found a case mismatch
          return replaceVariableNames(
            testFilePath,
            testContent,
            matchStr,
            cardExportName,
          );
        }
      }
    }
    return false; // Already correct
  }

  // Find the current import from the card file
  const currentImportMatch = testContent.match(
    /import\s*\{\s*[^}]+\s*\}\s*from\s*["']\.\/[^"']+["']/,
  );
  if (!currentImportMatch) {
    console.warn(`  Warning: Could not find card import in ${testFilePath}`);
    return false;
  }

  // Extract the old import name
  const oldImportNameMatch = testContent.match(
    /import\s*\{\s*([^}]+)\s*\}\s*from\s*["']\.\/[^"']+["']/,
  );
  const oldImportName = oldImportNameMatch ? oldImportNameMatch[1].trim() : "";

  // Replace with correct import
  let newTestContent = testContent.replace(
    /import\s*\{\s*[^}]+\s*\}\s*from\s*["']\.\/[^"']+["']/,
    expectedImport,
  );

  // Replace variable names inside the test content
  if (oldImportName && oldImportName !== cardExportName) {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${oldImportName}\\b`, "g");
    newTestContent = newTestContent.replace(regex, cardExportName);
  }

  // Also fix the describe block title if needed
  const cardNameMatch = cardContent.match(/name:\s*"([^"]+)"/);
  const cardVersionMatch = cardContent.match(/version:\s*"([^"]+)"/);
  if (cardNameMatch && cardVersionMatch) {
    const expectedDescribe = `describe("${cardNameMatch[1]} - ${cardVersionMatch[1]}", () => {`;
    if (!newTestContent.includes(expectedDescribe)) {
      // Fix describe block
      newTestContent = newTestContent.replace(
        /describe\("[^"]+", \(\) => \{/,
        expectedDescribe,
      );
    }
  }

  writeFileSync(testFilePath, newTestContent, "utf-8");
  console.log(`  ✓ Fixed ${testFilePath.split("/").pop()}`);
  return true;
}

/**
 * Replace variable names inside a test file
 */
function replaceVariableNames(
  testFilePath: string,
  testContent: string,
  oldName: string,
  newName: string,
): boolean {
  // Replace variable names with word boundaries
  const regex = new RegExp(`\\b${oldName}\\b`, "g");
  const newTestContent = testContent.replace(regex, newName);

  if (newTestContent === testContent) {
    return false; // No changes
  }

  writeFileSync(testFilePath, newTestContent, "utf-8");
  console.log(`  ✓ Fixed variables in ${testFilePath.split("/").pop()}`);
  return true;
}

/**
 * Main function
 */
function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");
  const cardsDir = join(baseDir, "src/cards/001");

  console.log("Fixing test file imports...\n");

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

      // Skip index files
      if (entry.name === "index.ts") {
        continue;
      }

      const cardPath = join(dirPath, entry.name);
      const testPath = join(dirPath, entry.name.replace(".ts", ".test.ts"));

      // Check if test file exists
      if (!existsSync(testPath)) {
        continue;
      }

      // Fix the test file
      if (fixTestFile(testPath, cardPath)) {
        fixedCount++;
      }
    }
  }

  console.log(`\nFixed ${fixedCount} test files`);
}

main();
