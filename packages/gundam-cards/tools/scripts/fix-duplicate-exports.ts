#!/usr/bin/env bun
/**
 * Script to fix duplicate card export names by adding card numbers
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CARDS_DIR = join(import.meta.dir, "../../src/cards/sets");

async function getSetDirs(): Promise<string[]> {
  const entries = await readdir(CARDS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(CARDS_DIR, entry.name));
}

async function processSet(setDir: string) {
  console.log(`\n📁 Processing ${setDir.split("/").pop()}...`);

  const indexPath = join(setDir, "index.ts");
  const indexContent = await readFile(indexPath, "utf-8");

  // Find all exports
  const exportPattern = /export \{ (\w+) \} from "\.\/(\d+-[\w-]+)";/g;
  const exports: Array<{ name: string; file: string; line: string }> = [];

  for (const match of indexContent.matchAll(exportPattern)) {
    exports.push({
      name: match[1],
      file: match[2],
      line: match[0],
    });
  }

  // Find duplicates
  const nameCounts = new Map<string, number>();
  for (const exp of exports) {
    nameCounts.set(exp.name, (nameCounts.get(exp.name) || 0) + 1);
  }

  const duplicates = Array.from(nameCounts.entries())
    .filter(([_, count]) => count > 1)
    .map(([name]) => name);

  if (duplicates.length === 0) {
    console.log("  ✓ No duplicates found");
    return;
  }

  console.log(
    `  Found ${duplicates.length} duplicate names: ${duplicates.join(", ")}`,
  );

  // Fix card definition files
  let updatedIndex = indexContent;

  for (const dup of duplicates) {
    const dupExports = exports.filter((e) => e.name === dup);

    for (const exp of dupExports) {
      const cardFilePath = join(setDir, `${exp.file}.ts`);
      const cardContent = await readFile(cardFilePath, "utf-8");

      // Extract card number from ID
      const idMatch = cardContent.match(/id: "([^"]+)"/);
      if (!idMatch) {
        console.log(`  ⚠️  Could not find ID in ${exp.file}`);
        continue;
      }

      const cardId = idMatch[1].toUpperCase().replace(/-/g, "_");
      const newName = `${exp.name}_${cardId}`;

      // Update card file
      const updatedCard = cardContent.replace(
        `export const ${exp.name}:`,
        `export const ${newName}:`,
      );
      await writeFile(cardFilePath, updatedCard, "utf-8");

      // Update index
      updatedIndex = updatedIndex.replace(
        exp.line,
        `export { ${newName} } from "./${exp.file}";`,
      );

      console.log(`  ✓ Renamed ${exp.name} → ${newName}`);
    }
  }

  await writeFile(indexPath, updatedIndex, "utf-8");
}

async function main() {
  console.log("🔍 Finding duplicate card exports...");

  const setDirs = await getSetDirs();

  for (const setDir of setDirs) {
    await processSet(setDir);
  }

  console.log("\n✨ Done!");
}

main();
