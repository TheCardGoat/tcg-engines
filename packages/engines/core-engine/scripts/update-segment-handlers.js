#!/usr/bin/env node

/**
 * Script to update segment handlers to use coreOps.getCtx() instead of directly accessing ctx
 *
 * Usage:
 * node scripts/update-segment-handlers.js <directory>
 *
 * Example:
 * node scripts/update-segment-handlers.js src/game-engine/engines
 */

const fs = require("fs");
const path = require("path");

// Directory to search
const targetDir = process.argv[2] || "src/game-engine/engines";

// Regular expressions for segment handlers
const segmentHandlerRe =
  /(onBegin|onEnd|endIf):\s*\(\{\s*G,\s*ctx,\s*coreOps\s*\}\)\s*=>/g;
const segmentBodyRe =
  /(onBegin|onEnd|endIf):\s*\(\{\s*G,\s*ctx,\s*coreOps\s*\}\)\s*=>\s*\{/g;

function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Check if the file contains segment handlers using old pattern
  if (segmentHandlerRe.test(content)) {
    // 1. Update arrow function signature
    content = content.replace(segmentHandlerRe, "$1: ({ G, coreOps }) =>");
    modified = true;

    // 2. Add getCtx() call in function bodies
    content = content.replace(
      segmentBodyRe,
      "$1: ({ G, coreOps }) => {\n      const ctx = coreOps.getCtx();\n",
    );
    modified = true;

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
      return 1;
    }
  }

  return 0;
}

function walkDirectory(dir) {
  let updatedFiles = 0;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      updatedFiles += walkDirectory(filePath);
    } else if (
      stat.isFile() &&
      filePath.endsWith(".ts") &&
      filePath.includes("segment")
    ) {
      updatedFiles += processFile(filePath);
    }
  }

  return updatedFiles;
}

const updatedFiles = walkDirectory(targetDir);
console.log(`Updated ${updatedFiles} files.`);
