#!/usr/bin/env bun

import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const ROOT_DIR = path.resolve(
  process.cwd(),
  "packages/engines/core-engine/src/game-engine/engines/gundam/src",
);
const DEFINITIONS_DIR = path.join(ROOT_DIR, "cards/definitions");
const CARDS_INDEX_PATH = path.join(DEFINITIONS_DIR, "cards.ts");

async function main() {
  try {
    console.log("🔄 Updating main cards index file...");

    // Get all set directories
    const dirs = await readdir(DEFINITIONS_DIR, { withFileTypes: true });
    const setDirs = dirs
      .filter((dir) => dir.isDirectory() && /^[A-Z0-9]+$/.test(dir.name))
      .map((dir) => dir.name)
      .sort();

    if (setDirs.length === 0) {
      console.log("❌ No set directories found");
      process.exit(1);
    }

    console.log(
      `📂 Found ${setDirs.length} set directories: ${setDirs.join(", ")}`,
    );

    // Generate the index file content
    let indexContent =
      "// Gundam Card Game Cards\n// Auto-generated by update-index.ts\n\n";

    // Add imports for each set
    for (const setDir of setDirs) {
      indexContent += `// ${setDir} Cards\n`;
      indexContent += `export * from "./${setDir}";\n\n`;
    }

    // Add general imports and types
    indexContent += `// Card Types\nexport * from "./cardTypes";\n`;

    // Write the index file
    await writeFile(CARDS_INDEX_PATH, indexContent, "utf-8");

    console.log(`✅ Successfully updated ${CARDS_INDEX_PATH}`);
  } catch (error) {
    console.error("❌ Error updating index file:", error);
    process.exit(1);
  }
}

// Run the script
main();
