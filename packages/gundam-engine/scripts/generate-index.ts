#!/usr/bin/env bun

/**
 * Generate Index Files CLI
 * 
 * Usage: bun run scripts/generate-index.ts
 */

import { readdir } from "fs/promises";
import { join } from "path";
import { generateMasterIndex } from "../tools/generator/file-writer";

async function main() {
  console.log("📝 Generating index files...\n");
  
  const setsDir = "packages/gundam-engine/src/cards/sets";
  
  try {
    // Get all set directories
    const entries = await readdir(setsDir, { withFileTypes: true });
    const setCodes = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name.toUpperCase());
    
    if (setCodes.length === 0) {
      console.log("⚠️  No sets found");
      return;
    }
    
    console.log(`Found ${setCodes.length} sets: ${setCodes.join(", ")}\n`);
    
    // Generate master index
    await generateMasterIndex(setCodes);
    
    console.log("\n✅ Index generation complete!");
  } catch (error) {
    console.error("❌ Error generating indexes:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}

