#!/usr/bin/env node

/**
 * Script to update move implementations to use coreOps.getCtx() instead of directly accessing ctx
 *
 * Usage:
 * node scripts/update-move-pattern.js <directory>
 *
 * Example:
 * node scripts/update-move-pattern.js src/game-engine/engines/lorcana/src/moves
 */

const fs = require("fs");
const path = require("path");

// Directory to search
const targetDir =
  process.argv[2] || "src/game-engine/engines/lorcana/src/moves";

// Regular expressions
const importRe = /import\s+{\s*toLorcanaCoreOps\s*}/;
const fnParamsRe = /{\s*G,\s*ctx,\s*coreOps,\s*playerID\s*}/;
const coreOpsAsRe =
  /const\s+lorcanaOps\s*=\s*coreOps\s+as\s+LorcanaCoreOperations/;

function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Check if the file contains the old pattern
  if (fnParamsRe.test(content)) {
    // 1. Ensure toLorcanaCoreOps is imported
    if (!importRe.test(content)) {
      content = content.replace(
        /import.*?from\s+["']\.\/types["'];/,
        (match) => `${match}\nimport { toLorcanaCoreOps } from "./types";`,
      );
      modified = true;
    }

    // 2. Update function parameters by removing ctx
    content = content.replace(fnParamsRe, "{ G, coreOps, playerID }");
    modified = true;

    // 3. Update coreOps as LorcanaCoreOperations to toLorcanaCoreOps
    if (coreOpsAsRe.test(content)) {
      content = content.replace(
        coreOpsAsRe,
        "const lorcanaOps = toLorcanaCoreOps(coreOps)",
      );
      modified = true;
    }

    // 4. Add getCtx call
    if (modified && !content.includes("const ctx = lorcanaOps.getCtx()")) {
      content = content.replace(
        /const\s+lorcanaOps\s*=\s*toLorcanaCoreOps\(coreOps\);/,
        "const lorcanaOps = toLorcanaCoreOps(coreOps);\n    // Use getCtx instead of directly accessing ctx\n    const ctx = lorcanaOps.getCtx();",
      );
    }

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
    } else if (stat.isFile() && filePath.endsWith(".ts")) {
      updatedFiles += processFile(filePath);
    }
  }

  return updatedFiles;
}

const updatedFiles = walkDirectory(targetDir);
console.log(`Updated ${updatedFiles} files.`);
