#!/usr/bin/env node

import fs from "fs";
import path from "path";

// List of files that need to be fixed
const filesToFix = [
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/027-first-aid.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/028-look-at-this-family.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/029-lost-in-the-woods.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/030-sign-the-scroll.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/060-poor-unfortunate-souls.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/061-second-star-to-the-right.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/063-ursulas-plan.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/093-dodge.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/094-make-the-potion.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/095-under-the-sea.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/096-ursulas-trickery.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/097-we-dont-talk-about-bruno.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/128-a-pirates-life.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/129-be-king-undisputed.ts",
  "src/game-engine/engines/lorcana/src/cards/definitions/004/actions/130-brawl.ts",
];

console.log(`Processing ${filesToFix.length} files...`);

// Function to read a file and extract the text property
function extractTextFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const textMatch = content.match(/text:\s*"([^"]*(?:\\.[^"]*)*)"/);
    if (textMatch) {
      return textMatch[1].replace(/\\"/g, '"'); // Unescape quotes
    }
    return null;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// Process each file
for (const file of filesToFix) {
  const fullPath = path.join(
    "/Users/wazar/projects/the-card-goat/tcg-engines/packages/engines/core-engine",
    file,
  );
  const text = extractTextFromFile(fullPath);

  if (text) {
    console.log(`File: ${file}`);
    console.log(`Text: ${text}`);
    console.log("---");
  }
}
