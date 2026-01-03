#!/usr/bin/env bun
/**
 * Fix Type Errors in Migrated Cards
 *
 * Fixes the following issues:
 * 1. Title-case classifications (e.g., "hero" -> "Hero")
 * 2. Remove classifications from ActionCards (they don't have this property)
 * 3. Fix test file import names to match card export names
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Valid classifications (title-cased)
const VALID_CLASSIFICATIONS: ReadonlySet<string> = new Set([
  "Alien",
  "Ally",
  "Broom",
  "Captain",
  "Deity",
  "Detective",
  "Dragon",
  "Dreamborn",
  "Entangled",
  "Fairy",
  "Floodborn",
  "Gargoyle",
  "Hero",
  "Hunny",
  "Hyena",
  "Illusion",
  "Inventor",
  "King",
  "Knight",
  "Madrigal",
  "Mentor",
  "Musketeer",
  "Pirate",
  "Prince",
  "Princess",
  "Puppy",
  "Queen",
  "Racer",
  "Robot",
  "Seven Dwarfs",
  "Sorcerer",
  "Storyborn",
  "Tigger",
  "Titan",
  "Villain",
  "Whisper",
]);

/**
 * Title-case a classification string
 */
function titleCaseClassification(str: string): string {
  const lower = str.toLowerCase();
  // Check for special cases that need exact matching
  if (lower === "seven dwarfs") return "Seven Dwarfs";

  // Capitalize first letter
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Fix classifications array - title-case each one
 */
function fixClassifications(classifications: string[]): string[] {
  return classifications.map(titleCaseClassification);
}

/**
 * Fix a card file
 */
function fixCardFile(filePath: string): { fixed: boolean; issues: string[] } {
  const content = readFileSync(filePath, "utf-8");
  const issues: string[] = [];
  let fixed = false;
  let newContent = content;

  // 1. Check if this is an ActionCard with classifications
  const isActionCard =
    content.includes('cardType: "action"') ||
    content.includes("cardType: 'action'");
  const hasClassifications = content.includes("classifications:");

  if (isActionCard && hasClassifications) {
    // Remove the classifications line from ActionCards
    newContent = newContent.replace(/,\s*classifications:\s*\[[^\]]*\]/g, "");
    newContent = newContent.replace(/classifications:\s*\[[^\]]*\],?\s*/g, "");
    issues.push("Removed classifications from ActionCard");
    fixed = true;
  }

  // 2. Fix classification casing
  const classificationsMatch = content.match(/classifications:\s*(\[[^\]]*\])/);
  if (classificationsMatch && !isActionCard) {
    try {
      const classificationsArray = JSON.parse(classificationsMatch[1]);
      if (Array.isArray(classificationsArray)) {
        const fixedArray = fixClassifications(classificationsArray);
        const fixedString = JSON.stringify(fixedArray);
        if (classificationsMatch[1] !== fixedString) {
          newContent = newContent.replace(
            /classifications:\s*\[[^\]]*\]/,
            `classifications: ${fixedString}`,
          );
          issues.push(
            `Fixed classifications: ${JSON.stringify(classificationsArray)} -> ${JSON.stringify(fixedArray)}`,
          );
          fixed = true;
        }
      }
    } catch (e) {
      // Invalid JSON, skip
    }
  }

  // 3. Fix abilities missing id and text
  // Check for abilities array with objects missing id or text
  const abilitiesMatch = content.match(/abilities:\s*\[([\s\S]*?)\]/);
  if (abilitiesMatch) {
    const abilitiesBlock = abilitiesMatch[1];
    const newAbilitiesBlock = abilitiesBlock;

    // Find each ability object and check if it has id and text
    const abilityRegex = /\{\s*"type":\s*"([^"]+)"[^}]*\}/g;
    let match;
    const abilitiesChanged = false;

    while ((match = abilityRegex.exec(abilitiesBlock)) !== null) {
      const abilityObj = match[0];
      // Check if ability has id and text
      const hasId = abilityObj.includes('"id":');
      const hasText = abilityObj.includes('"text":');

      if (!(hasId && hasText)) {
        // This is a more complex fix - we'd need to extract the ability info
        // For now, just note it
        issues.push(
          `Ability missing ${hasId ? "" : "id"} ${hasText ? "" : "text"}`,
        );
      }
    }

    if (abilitiesChanged) {
      newContent = newContent.replace(
        /abilities:\s*\[[\s\S]*?\]/,
        `abilities:\s[${newAbilitiesBlock}]`,
      );
      fixed = true;
    }
  }

  if (fixed) {
    writeFileSync(filePath, newContent, "utf-8");
  }

  return { fixed, issues };
}

/**
 * Extract export name from card file
 */
function getExportName(content: string): string | null {
  const match = content.match(/export\s+const\s+(\w+)\s*:/);
  return match ? match[1] : null;
}

/**
 * Fix test file import to match card export name
 */
function fixTestFile(testFilePath: string, cardFilePath: string): boolean {
  const testContent = readFileSync(testFilePath, "utf-8");
  const cardContent = readFileSync(cardFilePath, "utf-8");

  const cardExportName = getExportName(cardContent);
  if (!cardExportName) {
    return false;
  }

  // Check if the import uses the wrong name
  const importMatch = testContent.match(
    /import\s+\{\s*(\w+)\s*\}\s+from\s+["']\.\/[^"']+["']/,
  );
  if (!importMatch) {
    return false;
  }

  const currentImport = importMatch[1];
  if (currentImport === cardExportName) {
    return false; // Already correct
  }

  // Fix the import
  const newTestContent = testContent.replace(
    /import\s+\{\s*\w+\s*\}\s+from\s+["']\.\/[^"']+["']/,
    `import { ${cardExportName} } from "${importMatch[0].match(/from\s+["']([^"']+)["']/)?.[1]}"`, // Keep the from path
  );

  // More precise replacement
  const betterReplacement = testContent.replace(
    new RegExp(
      `import\\s+\\{\\s*${currentImport}\\s*\\}\\s+from\\s+["']\\.\\/[^"']+["']`,
    ),
    `import { ${cardExportName} } ${testContent.match(/from\s+["'].+?["']/)?.[0]}`,
  );

  // Actually, let's just use a simpler approach
  const simpleReplacement = testContent.replace(
    /import\s*\{[^}]*\}\s*from\s*["'][^"']+["']/,
    `import { ${cardExportName} } ${testContent.match(/from\s*["'][^"']+["']/)?.[0] || `from "./${cardFilePath.split("/").pop()?.replace(".ts", "")}"`}`,
  );

  writeFileSync(testFilePath, simpleReplacement, "utf-8");
  console.log(`  Fixed import: ${currentImport} -> ${cardExportName}`);
  return true;
}

/**
 * Main function
 */
function main() {
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");
  const cardsDir = join(baseDir, "src/cards/001");

  console.log("Scanning for card files to fix...");
  console.log(`Cards directory: ${cardsDir}\n`);

  let cardsFixed = 0;
  let testsFixed = 0;
  const typeDirs = ["actions", "characters", "items", "locations", "songs"];

  for (const typeDir of typeDirs) {
    const dirPath = join(cardsDir, typeDir);
    let entries: any[];
    try {
      entries = readdirSync(dirPath, { withFileTypes: true });
    } catch {
      continue; // Directory doesn't exist, skip
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

      const cardPath = join(dirPath, entry.name);
      const testPath = join(dirPath, entry.name.replace(".ts", ".test.ts"));

      // Fix card file
      const { fixed, issues } = fixCardFile(cardPath);
      if (fixed) {
        cardsFixed++;
        console.log(`✓ Fixed ${entry.name}:`);
        for (const issue of issues) {
          console.log(`  - ${issue}`);
        }
      }

      // Fix test file if it exists
      if (
        readdirSync(dirPath).includes(entry.name.replace(".ts", ".test.ts"))
      ) {
        if (fixTestFile(testPath, cardPath)) {
          testsFixed++;
        }
      }
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Card files fixed: ${cardsFixed}`);
  console.log(`Test files fixed: ${testsFixed}`);
}

main();
