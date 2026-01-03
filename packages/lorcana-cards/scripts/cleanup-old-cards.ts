#!/usr/bin/env bun
/**
 * Cleanup Old Card Files
 *
 * Deletes old card files without number prefix (duplicates).
 */

import { readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Main function
 */
function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");
  const cardsDir = join(baseDir, "src/cards/001");

  console.log("Cleaning up old card files (without number prefix)...\n");

  let deletedCount = 0;
  const typeDirs = ["actions", "characters", "items", "songs"];

  for (const typeDir of typeDirs) {
    const dirPath = join(cardsDir, typeDir);
    let entries: any[];
    try {
      entries = readdirSync(dirPath, { withFileTypes: true });
    } catch {
      continue;
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

      // Check if filename starts with a number (e.g., "001-")
      const hasNumberPrefix = /^\d+-.+\.ts$/.test(entry.name);

      if (!hasNumberPrefix) {
        // This is an old file, check if there's a numbered version
        // Try to find the corresponding numbered file
        const baseName = entry.name; // e.g., "arielOnHumanLegs.ts"

        // For each file in directory, check if it matches the pattern
        const allFiles = readdirSync(dirPath).filter(
          (f) =>
            f.endsWith(".ts") && f !== "index.ts" && !f.endsWith(".test.ts"),
        );
        const hasNumberedVersion = allFiles.some((f) => {
          const match = f.match(/^(\d+)-(.+)\.ts$/);
          if (match) {
            const numberedBaseName = match[2];
            return numberedBaseName.toLowerCase() === baseName.toLowerCase();
          }
          return false;
        });

        if (hasNumberedVersion) {
          // Delete the old file
          const filePath = join(dirPath, entry.name);
          unlinkSync(filePath);
          console.log(`  ✓ Deleted ${entry.name}`);
          deletedCount++;
        }
      }
    }
  }

  console.log(`\nDeleted ${deletedCount} old card files`);
  console.log("\nNow run: bun run scripts/fix-index-files.ts");
}

main();
