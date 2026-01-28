/**
 * File Writer Utilities
 *
 * Handles writing card definition files to disk.
 */

import type { CardDefinition } from "@tcg/gundam-types";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import {
  generateCardFile,
  generateFilename,
  generateVariableName,
} from "./card-generator";

/**
 * Saves a card definition to a TypeScript file
 */
export async function saveCardFile(
  card: CardDefinition,
  baseDir = "src/cards/sets",
): Promise<string> {
  const setDir = join(baseDir, card.setCode.toLowerCase());
  const filename = generateFilename(card);
  const filepath = join(setDir, filename);

  // Ensure directory exists
  await mkdir(setDir, { recursive: true });

  // Generate file content
  const content = generateCardFile(card);

  // Write file
  await writeFile(filepath, content, "utf-8");

  console.log(`💾 Saved: ${filepath}`);

  return filepath;
}

/**
 * Generates an index file for a set
 */
export async function generateSetIndex(
  setCode: string,
  cards: CardDefinition[],
  baseDir = "src/cards/sets",
): Promise<void> {
  const setDir = join(baseDir, setCode.toLowerCase());
  const indexPath = join(setDir, "index.ts");

  // First pass: Count occurrences of each variable name to detect conflicts
  const nameCounts = new Map<string, number>();
  for (const card of cards) {
    const variableName = generateVariableName(card.name);
    nameCounts.set(variableName, (nameCounts.get(variableName) || 0) + 1);
  }

  // Generate exports
  const exports = cards
    .map((card) => {
      const filename = generateFilename(card).replace(".ts", "");
      let variableName = generateVariableName(card.name);
      const originalVarName = variableName;

      // If name is used multiple times, append card number to ensure uniqueness
      if ((nameCounts.get(variableName) || 0) > 1) {
        // e.g. Zaku_ST03_008
        variableName = `${variableName}_${card.cardNumber.replace(/-/g, "_")}`;
        return `export { ${originalVarName} as ${variableName} } from "./${filename}";`;
      }

      return `export { ${variableName} } from "./${filename}";`;
    })
    .join("\n");

  const content = `/**
 * ${setCode} Card Definitions
 * 
 * Auto-generated card exports for set ${setCode}.
 */

${exports}
`;

  await writeFile(indexPath, content, "utf-8");
  console.log(`📝 Generated index: ${indexPath}`);
}

/**
 * Generates the master index file
 */
export async function generateMasterIndex(
  setCodes: string[],
  baseDir = "src/cards",
): Promise<void> {
  const indexPath = join(baseDir, "index.ts");

  const exports = setCodes
    .map((setCode) => `export * from "./sets/${setCode.toLowerCase()}";`)
    .join("\n");

  const content = `/**
 * Gundam Card Definitions
 * 
 * Central export for all card definitions.
 */

export * from "./card-types";
${exports}
`;

  await writeFile(indexPath, content, "utf-8");
  console.log(`📝 Generated master index: ${indexPath}`);
}
