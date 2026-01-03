#!/usr/bin/env bun
/**
 * Fix Index Files
 *
 * Regenerates index.ts files for all card directories.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Extract export name from card file
 */
function getExportName(content: string): string | null {
  const match = content.match(/export\s+const\s+([a-zA-Z0-9_$]+)\s*:/);
  return match ? match[1] : null;
}

/**
 * Fix an index file
 */
function fixIndexFile(dirPath: string): number {
  const entries = readdirSync(dirPath, { withFileTypes: true });

  // Get all card files (not tests, not index, starting with number)
  const cardFiles = entries
    .filter(
      (e) =>
        e.isFile() &&
        e.name.endsWith(".ts") &&
        e.name !== "index.ts" &&
        !e.name.endsWith(".test.ts") &&
        /^\d+/.test(e.name),
    )
    .map((e) => e.name)
    .sort();

  if (cardFiles.length === 0) {
    return 0;
  }

  // Generate exports
  const exports: string[] = [];
  for (const fileName of cardFiles) {
    const filePath = join(dirPath, fileName);
    const content = readFileSync(filePath, "utf-8");
    const exportName = getExportName(content);
    if (exportName) {
      const fileNameWithoutExt = fileName.replace(".ts", "");
      exports.push(`export { ${exportName} } from "./${fileNameWithoutExt}";`);
    }
  }

  // Write index file
  const indexPath = join(dirPath, "index.ts");
  const content = exports.join("\n") + "\n";
  writeFileSync(indexPath, content, "utf-8");

  return exports.length;
}

/**
 * Main function
 */
function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");
  const cardsDir = join(baseDir, "src/cards/001");

  console.log("Regenerating index files...\n");

  let totalExports = 0;
  const typeDirs = ["actions", "characters", "items", "songs"];

  for (const typeDir of typeDirs) {
    const dirPath = join(cardsDir, typeDir);
    try {
      const count = fixIndexFile(dirPath);
      console.log(`  ✓ ${typeDir}: ${count} exports`);
      totalExports += count;
    } catch {
      console.log(`  ⊘ ${typeDir}: directory not found`);
    }
  }

  console.log(`\nRegenerated ${totalExports} exports`);
}

main();
