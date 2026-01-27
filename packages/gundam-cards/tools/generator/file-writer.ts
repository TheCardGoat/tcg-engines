/**
 * File Writer Utilities
 *
 * Handles writing card definition files to disk.
 */

import type { CardDefinition } from "@tcg/gundam-types";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { generateCardFile, generateFilename } from "./card-generator";

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

  // Generate exports
  const exports = cards
    .map((card) => {
      const filename = generateFilename(card).replace(".ts", "");
      const variableName = generateVariableName(card.name);
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

function generateVariableName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}
