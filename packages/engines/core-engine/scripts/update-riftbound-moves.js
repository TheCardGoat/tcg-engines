#!/usr/bin/env node

/**
 * Script to update Riftbound engine moves to use coreOps.getCtx() instead of directly accessing ctx
 */

const fs = require("fs");
const path = require("path");

const targetFile = "src/game-engine/engines/riftbound/src/moves/moves.ts";

// Regular expressions
const importAdditionRe = /getCurrentTurnPlayer,\s*getCurrentPriorityPlayer/;
const fnParamsRe = /\{\s*G,\s*ctx,\s*playerID,\s*coreOps\s*\}/g;
const ctxUsageRe = /ctx\.(turnPlayerPos|priorityPlayerPos|playerOrder)/g;
const getCurrentPlayerRe = /(get[^(]*Player\()(ctx)(\))/g;

function processFile() {
  console.log(`Processing ${targetFile}...`);
  let content = fs.readFileSync(targetFile, "utf8");

  // 1. Update function parameters
  content = content.replace(fnParamsRe, "{ G, playerID, coreOps }");

  // 2. Add getCtx in each move function
  const moveStarts = [];
  const moveStartRe =
    /export const ([^:]+):\s*RiftboundMove\s*=\s*\(\s*\{\s*G,\s*playerID,\s*coreOps\s*\}\s*[,)]/g;

  let match;
  while ((match = moveStartRe.exec(content)) !== null) {
    moveStarts.push({
      name: match[1],
      index: match.index + match[0].length,
    });
  }

  // Insert ctx = coreOps.getCtx() in reverse order to not invalidate positions
  for (let i = moveStarts.length - 1; i >= 0; i--) {
    const pos = moveStarts[i].index;
    // Find the position after the parameters where we can insert the ctx code
    const afterParams = content.indexOf("=>", pos);

    if (afterParams > pos) {
      // Find where to insert the ctx code (after the first { if it's a block function)
      const blockStart = content.indexOf("{", afterParams);

      if (blockStart > afterParams) {
        content =
          content.substring(0, blockStart + 1) +
          "\n  const ctx = coreOps.getCtx();\n  " +
          content.substring(blockStart + 1);
      }
    }
  }

  // 3. Fix getCurrentTurnPlayer and getCurrentPriorityPlayer calls
  content = content.replace(getCurrentPlayerRe, "$1coreOps.getCtx()$3");

  fs.writeFileSync(targetFile, content);
  console.log(`Updated ${targetFile}`);
}

processFile();
