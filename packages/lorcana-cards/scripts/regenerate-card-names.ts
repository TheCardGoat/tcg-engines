#!/usr/bin/env bun
/**
 * Regenerate Card Files with Fully Qualified Export Names
 *
 * Regenerates all card files to use fully qualified export names
 * (card name + version) to avoid duplicate identifier issues.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface CardInfo {
  filePath: string;
  content: string;
  name: string;
  version: string;
  oldExportName: string;
  newExportName: string;
}

/**
 * Convert a string to PascalCase
 * Removes special characters like !, ?, etc.
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
 * Generate fully qualified export name
 */
function generateExportName(name: string, version: string): string {
  return toPascalCase(name) + toPascalCase(version);
}

/**
 * Parse card file and extract info
 */
function parseCardFile(filePath: string): CardInfo | null {
  const content = readFileSync(filePath, "utf-8");

  // Extract name
  const nameMatch = content.match(/name:\s*"([^"]+)"/);
  const name = nameMatch ? nameMatch[1] : "";

  // Extract version (may not exist)
  const versionMatch = content.match(/version:\s*"([^"]+)"/);
  const version = versionMatch ? versionMatch[1] : "";

  // Extract old export name (may contain special characters like apostrophe)
  // Try matching valid identifiers first
  let oldExportName = "";
  const exportMatch = content.match(/export\s+const\s+([a-zA-Z0-9_$]+)\s*:/);
  if (exportMatch) {
    oldExportName = exportMatch[1];
  } else {
    // For invalid identifiers (with special chars), find the line and extract manually
    const lines = content.split("\n");
    for (const line of lines) {
      if (line.trim().startsWith("export const")) {
        // Extract what's between "export const " and ":"
        const constMatch = line.match(/export\s+const\s+([^:]+)\s*:/);
        if (constMatch) {
          oldExportName = constMatch[1].trim();
          break;
        }
      }
    }
  }

  if (!(name && oldExportName)) {
    return null;
  }

  // If no version, use name only for export
  const newExportName = version
    ? generateExportName(name, version)
    : toPascalCase(name);

  return {
    filePath,
    content,
    name,
    version: version || "(no version)",
    oldExportName,
    newExportName,
  };
}

/**
 * Regenerate a card file with new export name
 */
function regenerateCardFile(card: CardInfo): boolean {
  if (card.oldExportName === card.newExportName) {
    return false; // No change needed
  }

  // Replace the export name
  const newContent = card.content.replace(
    new RegExp(`export const ${card.oldExportName}:`, "g"),
    `export const ${card.newExportName}:`,
  );

  writeFileSync(card.filePath, newContent, "utf-8");
  return true;
}

/**
 * Regenerate all card files
 */
function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");
  const cardsDir = join(baseDir, "src/cards/001");

  console.log("Regenerating card files with fully qualified export names...\n");

  let regeneratedCount = 0;
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
      const cardInfo = parseCardFile(cardPath);

      if (!cardInfo) {
        console.warn(`  ⚠ Could not parse ${entry.name}`);
        continue;
      }

      if (regenerateCardFile(cardInfo)) {
        regeneratedCount++;
        console.log(
          `  ✓ ${entry.name}: ${cardInfo.oldExportName} -> ${cardInfo.newExportName}`,
        );
      }
    }
  }

  console.log(`\nRegenerated ${regeneratedCount} card files`);
  console.log("\nNext steps:");
  console.log(
    "  1. Regenerate index files: bun run scripts/fix-index-files.ts",
  );
  console.log("  2. Update test imports: bun run scripts/fix-test-imports.ts");
  console.log("  3. Run type check: bun run check-types");
}

main();
