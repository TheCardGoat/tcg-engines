#!/usr/bin/env node

/**
 * Script to fix ctx references in segment handlers
 *
 * This script:
 * 1. Finds all segment handler files with ctx.XXX references
 * 2. Properly injects the ctx = coreOps.getCtx() at the beginning of each handler
 * 3. Ensures all ctx references are using the locally declared ctx variable
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Engines to process
const engines = [
  "src/game-engine/engines/alpha-clash/src/game-definition/segments",
  "src/game-engine/engines/grand-archive/src/game-definition/segments",
  "src/game-engine/engines/gundam/src/game-definition/segments",
  "src/game-engine/engines/lorcana/src/game-definition/segments",
  "src/game-engine/engines/one-piece/src/game-definition/segments",
];

// Regex patterns
const segmentHandlerRegex =
  /(onBegin|onEnd|endIf):\s*\(\{\s*G,\s*coreOps\s*\}\)\s*=>\s*\{/g;
const ctxReferenceRegex = /ctx\.\w+/g;

function processFile(filePath) {
  console.log(`Processing ${filePath}`);

  try {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // 1. First check if this file contains any ctx references
    const ctxRefs = content.match(ctxReferenceRegex);
    if (!ctxRefs) {
      console.log(`  No ctx references found in ${filePath}`);
      return false;
    }

    // 2. Insert ctx declaration in each handler
    let match;
    const insertPoints = [];

    // Find all handler function bodies
    while ((match = segmentHandlerRegex.exec(content)) !== null) {
      const insertPoint = match.index + match[0].length;
      insertPoints.push(insertPoint);
    }

    // Insert the ctx declarations in reverse order to not invalidate indices
    for (let i = insertPoints.length - 1; i >= 0; i--) {
      const pos = insertPoints[i];
      content =
        content.substring(0, pos) +
        "\n      const ctx = coreOps.getCtx();\n      " +
        content.substring(pos);
    }

    // 3. Check if we made changes
    if (insertPoints.length > 0) {
      modified = true;
      fs.writeFileSync(filePath, content);
      console.log(
        `  Updated ${filePath} with ${insertPoints.length} ctx declarations`,
      );
    }

    return modified;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

function processDirectory(dirPath) {
  let filesUpdated = 0;

  // Read all files in the directory
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Recursively process subdirectories
      filesUpdated += processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      // Process TypeScript files
      if (processFile(fullPath)) {
        filesUpdated++;
      }
    }
  }

  return filesUpdated;
}

// Main execution
let totalFilesUpdated = 0;

for (const enginePath of engines) {
  console.log(`Processing engine: ${enginePath}`);
  totalFilesUpdated += processDirectory(enginePath);
}

console.log(`Total files updated: ${totalFilesUpdated}`);
