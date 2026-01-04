#!/usr/bin/env bun
/**
 * Fix Test Import Path Casing
 *
 * Fixes test file import paths to match actual filename casing.
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Fix a test file's import path casing
 */
function fixTestImportCasing(testFilePath: string): boolean {
  const testContent = readFileSync(testFilePath, "utf-8");

  // Find all import statements from relative paths
  const importRegex = /import\s*\{[^}]+\}\s*from\s*["']\.\/([^"']+)["']/g;
  let match;
  let modified = false;
  let newContent = testContent;

  while ((match = importRegex.exec(testContent)) !== null) {
    const fullPath = match[1];
    const importStatement = match[0];

    // Get the directory of the test file
    const testDir = dirname(testFilePath);

    // Try to find the actual file (case-insensitive check)
    const relativePath = fullPath;
    let actualPath = relativePath;

    // Check each segment
    const segments = relativePath.split("/");
    for (let i = 0; i < segments.length; i++) {
      // Check if there's a file matching this segment (case-insensitive)
      const checkPath = join(testDir, ...segments.slice(0, i + 1));
      try {
        const stats = statSync(checkPath);
        if (stats.isFile()) {
          actualPath = join(testDir, ...segments.slice(0, i + 1));
          break;
        }
      } catch {
        // Continue checking
      }
    }

    // Get the actual filename from the file system
    try {
      const actualFilePath = join(testDir, relativePath);
      if (!existsSync(actualFilePath)) {
        // Try case-insensitive lookup
        const dir = dirname(actualFilePath);
        const wantedBasename = basename(actualFilePath).toLowerCase();
        const files = readdirSync(dir);
        const actualFile = files.find(
          (f) => f.toLowerCase() === wantedBasename,
        );

        if (actualFile && actualFile !== basename(actualFilePath)) {
          // Found the actual file with different casing
          const correctedPath = join(dir, actualFile);
          const relativeCorrected = relativePath
            .split("/")
            .slice(0, -1)
            .concat(actualFile)
            .join("/");

          // Replace the import path
          const correctedImport = importStatement.replace(
            /from\s*["'][^"']+["']/,
            `from "./${correctedPath}"`,
          );
          newContent = newContent.replace(importStatement, correctedImport);
          modified = true;
        }
      }
    } catch {
      // Skip if can't access
    }
  }

  if (modified) {
    writeFileSync(testFilePath, newContent, "utf-8");
    console.log(`  ✓ Fixed ${basename(testFilePath)}`);
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
      continue; // Directory doesn't exist, skip
    }

    for (const entry of entries) {
      if (!(entry.isFile() && entry.name.endsWith(".test.ts"))) {
        continue;
      }

      const testPath = join(dirPath, entry.name);

      if (fixTestImportCasing(testPath)) {
        fixedCount++;
      }
    }
  }

  console.log(`\nFixed ${fixedCount} test files`);
}

main();
