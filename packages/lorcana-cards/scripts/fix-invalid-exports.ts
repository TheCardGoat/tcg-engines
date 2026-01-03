#!/usr/bin/env bun
/**
 * Fix Invalid Export Names
 *
 * Fixes export names that contain invalid JavaScript identifier characters.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Convert a string to PascalCase, removing special characters
 */
function toPascalCase(str: string): string {
  return (
    str
      .toLowerCase()
      // Remove special characters first
      .replace(/[^\w\s-]/g, "")
      .split(/[\s-]+/)
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")
  );
}

/**
 * Generate correct export name from card name and version
 */
function generateCorrectExportName(content: string): string | null {
  const nameMatch = content.match(/name:\s*"([^"]+)"/);
  const versionMatch = content.match(/version:\s*"([^"]+)"/);

  if (!(nameMatch && versionMatch)) {
    return null;
  }

  const name = nameMatch[1];
  const version = versionMatch[1];

  return toPascalCase(name) + toPascalCase(version);
}

/**
 * Fix a single card file
 */
function fixCardFile(filePath: string): boolean {
  const content = readFileSync(filePath, "utf-8");

  // Find the current export (with possible invalid characters)
  const exportMatch = content.match(/export\s+const\s+([\w!]+)\s*:/);

  if (!exportMatch) {
    return false;
  }

  const currentExport = exportMatch[1];

  // Check if it has invalid characters
  if (/^[\w]+$/.test(currentExport)) {
    return false; // Already valid
  }

  // Generate correct export name
  const correctExport = generateCorrectExportName(content);

  if (!correctExport) {
    console.warn(`  ⚠ Could not generate export name for ${filePath}`);
    return false;
  }

  // Replace the export name
  const newContent = content.replace(
    new RegExp(`export const ${escapeRegExp(currentExport)}:`, "g"),
    `export const ${correctExport}:`,
  );

  writeFileSync(filePath, newContent, "utf-8");
  console.log(`  ✓ Fixed: ${currentExport} -> ${correctExport}`);
  return true;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Main function
 */
function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");
  const cardsDir = join(baseDir, "src/cards/001");

  console.log("Fixing invalid export names...\n");

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

      if (fixCardFile(cardPath)) {
        fixedCount++;
      }
    }
  }

  console.log(`\nFixed ${fixedCount} card files`);
}

main();
