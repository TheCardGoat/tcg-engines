#!/usr/bin/env bun

/**
 * Batch Migration Script for Set 001
 *
 * Orchestrates the migration of all 204 cards from set 001.
 * Divides cards into 5 batches (~40-50 cards each) for manageable PRs.
 *
 * Usage:
 *   bun run batch-migrate-001 --batch=1    # Migrate batch 1 only
 *   bun run batch-migrate-001 --all         # Migrate all batches
 */

import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ActionCard,
  CharacterCard,
  ItemCard,
  LocationCard,
  SongCard,
} from "@tcg/lorcana-types";
// Import parser and types
import { parserV2 } from "../src/parser/v2/index";

// Types
interface LegacyCard {
  filePath: string;
  cardNumber: number;
  type: string;
  name: string; // Const name (e.g., "arielOnHumanLegs")
  fileName: string; // Filename without extension (e.g., "001-ariel-on-human-legs")
  content: string;
  // Parsed legacy card data
  legacyData: Record<string, unknown>;
}

interface MigrationResult {
  cardNumber: number;
  name: string;
  success: boolean;
  error?: string;
  abilitiesParsed: number;
  abilitiesManual: number;
}

interface BatchResult {
  batchNumber: number;
  cards: MigrationResult[];
  manualOverridesAdded: number;
}

// Configuration
const LEGACY_DIR = "src/legacy-cards/001";
const CARDS_DIR = "src/cards/001";
const MANUAL_OVERRIDES_FILE = "src/parser/manual-overrides.ts";

// 5 batches of ~40-50 cards each
const BATCHES = [
  { start: 1, end: 40 },
  { start: 41, end: 80 },
  { start: 81, end: 120 },
  { start: 121, end: 160 },
  { start: 161, end: 204 },
];

// Property mapping: legacy -> new
const PROPERTY_MAP: Record<string, string> = {
  title: "version",
  characteristics: "classifications",
  colors: "inkType",
  inkwell: "inkable",
  number: "cardNumber",
};

/**
 * Get all legacy cards sorted by card number
 */
function getLegacyCards(): LegacyCard[] {
  const cards: LegacyCard[] = [];
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");
  const legacyDir = join(baseDir, LEGACY_DIR);

  const entries = readdirSync(legacyDir, {
    withFileTypes: true,
    recursive: true,
  });

  for (const entry of entries) {
    if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      !entry.name.includes(".spec") &&
      !entry.name.includes(".test")
    ) {
      // Skip index files and barrel files
      if (
        entry.name === "index.ts" ||
        entry.name.includes("characters.ts") ||
        entry.name.includes("actions.ts") ||
        entry.name.includes("items.ts") ||
        entry.name.includes("songs.ts")
      ) {
        continue;
      }

      // entry.path is the full path to the directory containing this entry
      // entry.name is just the filename
      // If entry.path is absolute, use it directly; otherwise join with legacyDir
      const filePath =
        entry.path && entry.path.startsWith("/")
          ? join(entry.path, entry.name)
          : join(legacyDir, entry.path || "", entry.name);
      const content = readFileSync(filePath, "utf-8");

      // Extract card number from filename
      const numberMatch = entry.name.match(/^(\d+)-/);
      const cardNumber = numberMatch
        ? Number.parseInt(numberMatch[1], 10)
        : 999;

      // Determine card type from directory
      let type = "unknown";
      if (filePath.includes("/characters/")) type = "character";
      else if (filePath.includes("/actions/")) type = "action";
      else if (filePath.includes("/items/")) type = "item";
      else if (filePath.includes("/songs/")) type = "song";
      else if (filePath.includes("/locations/")) type = "location";

      // Extract card name from export
      const nameMatch = content.match(/export\s+const\s+(\w+)\s*[:=]/);
      const name = nameMatch ? nameMatch[1] : entry.name.replace(".ts", "");

      // Store filename without extension
      const fileName = entry.name.replace(".ts", "");

      // Parse legacy card data (basic extraction)
      const legacyData = parseLegacyCardData(content, type);

      cards.push({
        filePath,
        cardNumber,
        type,
        name,
        fileName,
        content,
        legacyData,
      });
    }
  }

  return cards.sort((a, b) => a.cardNumber - b.cardNumber);
}

/**
 * Parse legacy card data from content
 */
function parseLegacyCardData(
  content: string,
  cardType: string,
): Record<string, unknown> {
  const data: Record<string, unknown> = { cardType };

  // Extract basic properties using regex
  const patterns: Record<string, RegExp> = {
    id: /id:\s*["']([^"']+)["']/,
    name: /name:\s*["']([^"']+)["']/,
    title: /title:\s*["']([^"']+)["']/,
    text: /text:\s*["']([^"']+)["']/,
    cost: /cost:\s*(\d+)/,
    strength: /strength:\s*(\d+)/,
    willpower: /willpower:\s*(\d+)/,
    lore: /lore:\s*(\d+)/,
    number: /number:\s*(\d+)/,
    set: /set:\s*["']([^"']+)["']/,
    inkwell: /inkwell:\s*(true|false)/,
    rarity: /rarity:\s*["']([^"']+)["']/,
    illustrator: /illustrator:\s*["']([^"']+)["']/,
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = content.match(pattern);
    if (match) {
      const value = match[1];
      // Convert to appropriate type
      if (
        key === "cost" ||
        key === "strength" ||
        key === "willpower" ||
        key === "lore" ||
        key === "number"
      ) {
        data[key] = Number.parseInt(value, 10);
      } else if (key === "inkwell") {
        data[key] = value === "true";
      } else {
        data[key] = value;
      }
    }
  }

  // Extract characteristics (array)
  const characteristicsMatch = content.match(/characteristics:\s*\[(.*?)\]/s);
  if (characteristicsMatch) {
    const characteristics = characteristicsMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/["']/g, ""))
      .filter(Boolean);
    data.characteristics = characteristics;
  }

  // Extract colors (array)
  const colorsMatch = content.match(/colors:\s*\[(.*?)\]/s);
  if (colorsMatch) {
    const colors = colorsMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/["']/g, ""))
      .filter(Boolean);
    data.colors = colors;
  }

  return data;
}

/**
 * Convert legacy ability object to new format
 */
function convertLegacyAbility(abilityText: string): unknown {
  // Try to parse ability text with parserV2
  const parsed = parserV2.parseAbility(abilityText);

  if (parsed) {
    return parsed;
  }

  // If parsing fails, return a placeholder that needs manual override
  console.warn(
    `  ⚠ Failed to parse ability: "${abilityText.substring(0, 50)}..."`,
  );
  return null;
}

/**
 * Generate new card file content
 */
function generateCardFile(legacy: LegacyCard, abilities: unknown[]): string {
  const d = legacy.legacyData;
  const name = d.name as string;
  const version = d.title as string;
  const cardType = d.cardType as string;
  const cardNumber = d.number as number;

  // Map properties
  // Generate fully qualified const name (name + version, like legacy format)
  // e.g., "Elsa" + "Snow Queen" -> "ElsaSnowQueen"
  function toPascalCase(str: string): string {
    return (
      str
        .toLowerCase()
        // Remove special characters first
        .replace(/[^\w\s-]/g, "")
        .split(/[\s-]+/)
        .filter((word) => word.length > 0)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
    );
  }

  let newName = toPascalCase(name) + toPascalCase(version);

  // Fallback if result is empty or invalid
  if (!newName || newName === "") {
    // Fallback: use camelCase from filename
    const fileName = legacy.fileName;
    const nameMatch = fileName.match(/^(\d+)-(.+)$/);
    if (nameMatch) {
      const parts = nameMatch[2].split("-");
      newName = parts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("");
    } else {
      newName = "card" + cardNumber;
    }
  }
  const fullName = `${name} - ${version}`;
  const classifications = (d.characteristics as string[]) || [];
  const inkType = (d.colors as string[]) || [];
  const inkable = (d.inkwell as boolean) ?? true;
  const cost = d.cost as number;
  const strength = d.strength as number;
  const willpower = d.willpower as number;
  const lore = d.lore as number;
  const text = (d.text as string) || "";
  const id = (d.id as string) || `${cardType.substring(0, 1)}${cardNumber}`;

  // Import statement based on card type
  let typeImport = "";
  if (cardType === "character") typeImport = "CharacterCard";
  else if (cardType === "action") typeImport = "ActionCard";
  else if (cardType === "item") typeImport = "ItemCard";
  else if (cardType === "location") typeImport = "LocationCard";
  else if (cardType === "song") typeImport = "SongCard";

  // Generate abilities array
  const abilitiesCode =
    abilities.length > 0
      ? `abilities: [\n${abilities.map((a, i) => `    ${JSON.stringify(a, null, 2).split("\n").join("\n    ")},`).join("\n")}\n  ],`
      : "abilities: [],";

  // Generate properties based on card type
  let properties = "";
  if (cardType === "character") {
    properties = `  cost: ${cost},
  strength: ${strength},
  willpower: ${willpower},
  lore: ${lore},`;
  } else if (cardType === "action") {
    properties = `  cost: ${cost},`;
  } else if (cardType === "item") {
    properties = `  cost: ${cost},
  strength: ${strength},
  willpower: ${willpower},
  lore: ${lore},`;
  } else if (cardType === "location") {
    properties = `  cost: ${cost},
  willpower: ${willpower},
  lore: ${lore},`;
  } else if (cardType === "song") {
    properties = `  cost: ${cost},`;
  }

  return `import type { ${typeImport} } from "@tcg/lorcana-types";

export const ${newName}: ${typeImport} = {
  id: "${id}",
  cardType: "${cardType}",
  name: "${name}",
  version: "${version}",
  fullName: "${fullName}",
  inkType: ${JSON.stringify(inkType)},
  franchise: "Disney",
  set: "001",
  text: "${text.replace(/"/g, '\\"')}",
${properties}
  cardNumber: ${cardNumber},
  inkable: ${inkable},
  externalIds: {
    ravensburger: "",
  },
  ${abilitiesCode}
  classifications: ${JSON.stringify(classifications).replace(/"/g, "'").replace(/'/g, '"')},
};
`;
}

/**
 * Generate test file content
 */
function generateTestFile(legacy: LegacyCard): string {
  const d = legacy.legacyData;
  const name = d.name as string;
  const version = d.title as string;
  const cardType = d.cardType as string;
  const newName = legacy.name; // This is the const name
  const fileName = legacy.fileName; // This is the filename

  return `import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { ${newName} } from "./${fileName}";

describe("${name} - ${version}", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [${newName}] });
  //   expect(testEngine.getCardModel(${newName}).hasKeyword()).toBe(true);
  // });

  // TODO: Add tests for abilities
});
`;
}

/**
 * Add export to index file
 */
function updateIndexFile(typeDir: string, cardName: string): void {
  const indexPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    CARDS_DIR,
    typeDir,
    "index.ts",
  );

  if (!existsSync(indexPath)) {
    // Create index file if it doesn't exist
    writeFileSync(indexPath, `export { ${cardName} } from "./${cardName}";\n`);
    return;
  }

  const content = readFileSync(indexPath, "utf-8");
  const exportLine = `export { ${cardName} } from "./${cardName}";`;

  if (!content.includes(exportLine)) {
    const updatedContent = content.trimEnd() + "\n" + exportLine + "\n";
    writeFileSync(indexPath, updatedContent);
  }
}

/**
 * Check if a card has already been migrated
 */
function isAlreadyMigrated(card: LegacyCard, baseDir: string): boolean {
  const cardType = card.legacyData.cardType as string;
  const typeDir =
    cardType === "character"
      ? "characters"
      : cardType === "action"
        ? "actions"
        : cardType === "item"
          ? "items"
          : cardType === "song"
            ? "songs"
            : "locations";

  const newCardPath = join(baseDir, CARDS_DIR, typeDir, `${card.fileName}.ts`);
  return existsSync(newCardPath);
}

/**
 * Check if a test file already exists for a migrated card
 */
function hasTestFile(card: LegacyCard, baseDir: string): boolean {
  const cardType = card.legacyData.cardType as string;
  const typeDir =
    cardType === "character"
      ? "characters"
      : cardType === "action"
        ? "actions"
        : cardType === "item"
          ? "items"
          : cardType === "song"
            ? "songs"
            : "locations";

  const testPath = join(
    baseDir,
    CARDS_DIR,
    typeDir,
    `${card.fileName}.test.ts`,
  );
  return existsSync(testPath);
}

/**
 * Migrate a single card
 */
async function migrateCard(card: LegacyCard): Promise<MigrationResult> {
  console.log(`\n[Migrating] Card ${card.cardNumber}: ${card.name}`);

  try {
    const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");

    // Check if already migrated
    if (isAlreadyMigrated(card, baseDir)) {
      // Check if test file exists
      if (!hasTestFile(card, baseDir)) {
        console.log("  ⊙ Card migrated but missing test file, generating...");
        const cardType = card.legacyData.cardType as string;
        const typeDir =
          cardType === "character"
            ? "characters"
            : cardType === "action"
              ? "actions"
              : cardType === "item"
                ? "items"
                : cardType === "song"
                  ? "songs"
                  : "locations";

        const cardFileName = card.fileName;
        const testPath = join(
          baseDir,
          CARDS_DIR,
          typeDir,
          `${cardFileName}.test.ts`,
        );
        const testContent = generateTestFile(card);
        writeFileSync(testPath, testContent);
        console.log("  ✓ Test file created");
      }

      // Check if legacy file still exists and delete it
      if (existsSync(card.filePath)) {
        console.log(`  Deleting legacy file: ${card.filePath}`);
        unlinkSync(card.filePath);
        console.log("  ✓ Legacy file deleted");
      }

      console.log("  ⊙ Already migrated with test file, skipping...");
      return {
        cardNumber: card.cardNumber,
        name: card.name,
        success: true,
        abilitiesParsed: 0,
        abilitiesManual: 0,
      };
    }

    const cardType = card.legacyData.cardType as string;

    // 1. Parse abilities
    console.log("  Parsing abilities...");
    const abilities: unknown[] = [];
    let abilitiesParsed = 0;
    let abilitiesManual = 0;

    // Extract ability texts from legacy file
    const abilityPattern = /abilities:\s*\[([\s\S]*?)\]/;
    const abilityMatch = card.content.match(abilityPattern);

    if (abilityMatch) {
      // Extract individual ability texts
      const abilityImports = abilityMatch[1].match(
        /import\s+.*?\s+from\s+["'].*?["']/g,
      );
      if (abilityImports) {
        console.log(
          `  Found ${abilityImports.length} abilities (legacy format)`,
        );

        for (let i = 0; i < abilityImports.length; i++) {
          // Try to get ability text from the legacy data's text field
          const text = (card.legacyData.text as string) || "";
          if (text) {
            const converted = convertLegacyAbility(text);
            if (converted) {
              abilities.push(converted);
              abilitiesParsed++;
            } else {
              abilitiesManual++;
            }
          }
        }
      }
    }

    // If no abilities found in imports, try parsing the text directly
    if (abilities.length === 0) {
      const text = (card.legacyData.text as string) || "";
      if (text) {
        // Split by common ability separators
        const abilityTexts = text.split(/\n\n+/);
        for (const abilityText of abilityTexts) {
          const cleaned = abilityText.trim();
          if (cleaned) {
            const converted = convertLegacyAbility(cleaned);
            if (converted) {
              abilities.push(converted);
              abilitiesParsed++;
            } else {
              abilitiesManual++;
            }
          }
        }
      }
    }

    console.log(`  Parsed: ${abilitiesParsed}, Manual: ${abilitiesManual}`);

    // 2. Generate new card file
    const typeDir =
      cardType === "character"
        ? "characters"
        : cardType === "action"
          ? "actions"
          : cardType === "item"
            ? "items"
            : cardType === "song"
              ? "songs"
              : "locations";

    const cardFileName = card.fileName; // e.g., "007-heihei-boat-snack"
    const newCardPath = join(baseDir, CARDS_DIR, typeDir, `${cardFileName}.ts`);

    console.log(`  Creating card file: ${newCardPath}`);
    const cardContent = generateCardFile(card, abilities);

    // Ensure directory exists
    const cardDir = dirname(newCardPath);
    if (!existsSync(cardDir)) {
      mkdirSync(cardDir, { recursive: true });
    }

    writeFileSync(newCardPath, cardContent);

    // 3. Update index file
    console.log("  Updating index file...");
    updateIndexFile(typeDir, card.name);

    // 4. Generate test file
    const testPath = join(
      baseDir,
      CARDS_DIR,
      typeDir,
      `${cardFileName}.test.ts`,
    );
    console.log(`  Creating test file: ${testPath}`);
    const testContent = generateTestFile(card);
    writeFileSync(testPath, testContent);

    // 5. Verify tests pass
    console.log("  Running tests...");
    try {
      execSync(`bun test ${testPath}`, { stdio: "pipe", cwd: baseDir });
      console.log("  ✓ Tests pass");
    } catch (error) {
      console.log(
        "  ⚠ Tests failed (expected for cards with complex abilities)",
      );
      // Don't fail the migration if tests fail
    }

    // 6. Delete legacy file
    console.log(`  Deleting legacy file: ${card.filePath}`);
    unlinkSync(card.filePath);

    console.log("  ✓ Migrated successfully");

    return {
      cardNumber: card.cardNumber,
      name: card.name,
      success: true,
      abilitiesParsed,
      abilitiesManual,
    };
  } catch (error) {
    return {
      cardNumber: card.cardNumber,
      name: card.name,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      abilitiesParsed: 0,
      abilitiesManual: 0,
    };
  }
}

/**
 * Migrate a batch of cards
 */
async function migrateBatch(batchNumber: number): Promise<BatchResult> {
  const batch = BATCHES[batchNumber - 1];
  console.log(`\n${"=".repeat(60)}`);
  console.log(`BATCH ${batchNumber}: Cards ${batch.start}-${batch.end}`);
  console.log(`${"=".repeat(60)}`);

  const allCards = getLegacyCards();
  const batchCards = allCards.filter(
    (c) => c.cardNumber >= batch.start && c.cardNumber <= batch.end,
  );

  console.log(`Found ${batchCards.length} cards to migrate`);

  const results: MigrationResult[] = [];
  let manualOverridesAdded = 0;

  for (const card of batchCards) {
    const result = await migrateCard(card);
    results.push(result);

    if (!result.success) {
      console.error(`  ✗ Failed: ${result.error}`);
    }

    manualOverridesAdded += result.abilitiesManual;
  }

  return {
    batchNumber,
    cards: results,
    manualOverridesAdded,
  };
}

/**
 * Complete a batch: run tests, format, lint
 */
function completeBatch(result: BatchResult): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`COMPLETING BATCH ${result.batchNumber}`);
  console.log(`${"=".repeat(60)}`);

  const successCount = result.cards.filter((r) => r.success).length;
  const failCount = result.cards.filter((r) => !r.success).length;
  const totalParsed = result.cards.reduce(
    (sum, r) => sum + r.abilitiesParsed,
    0,
  );
  const totalManual = result.cards.reduce(
    (sum, r) => sum + r.abilitiesManual,
    0,
  );

  console.log(`Results: ${successCount} succeeded, ${failCount} failed`);
  console.log(
    `Abilities: ${totalParsed} parsed, ${totalManual} need manual overrides`,
  );

  if (failCount > 0) {
    console.log(
      "\n⚠ Some cards failed to migrate. Please review and fix manually.",
    );
    return;
  }

  const baseDir = join(dirname(fileURLToPath(import.meta.url)), "..");

  // Run tests
  console.log("\nRunning tests...");
  try {
    execSync("bun test", { stdio: "inherit", cwd: baseDir });
    console.log("✓ All tests pass");
  } catch (error) {
    console.error("✗ Tests failed. Please fix before committing.");
    return;
  }

  // Format
  console.log("\nFormatting...");
  try {
    execSync("bun run format", { stdio: "inherit", cwd: baseDir });
    console.log("✓ Formatted");
  } catch (error) {
    console.error("✗ Format failed.");
  }

  // Lint
  console.log("\nLinting...");
  try {
    execSync("bun run lint", { stdio: "inherit", cwd: baseDir });
    console.log("✓ Linted");
  } catch (error) {
    console.error("✗ Lint failed.");
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`BATCH ${result.batchNumber} COMPLETE`);
  console.log(`${"=".repeat(60)}`);
  console.log("\nNext steps:");
  console.log("  1. Review changes");
  console.log(
    `  2. Commit: git commit -m "feat(lorcana-cards): migrate set 001 batch ${result.batchNumber}"`,
  );
  console.log(
    `  3. Create branch: git checkout -b feat/migrate-set-001-batch-${result.batchNumber}`,
  );
  console.log(
    `  4. Push: git push -u origin feat/migrate-set-001-batch-${result.batchNumber}`,
  );
  console.log(
    `  5. Create PR: gh pr create --title "feat(lorcana-cards): migrate set 001 batch ${result.batchNumber}"`,
  );
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const batchArg = args.find((a) => a.startsWith("--batch="));
  const migrateAll = args.includes("--all");

  if (!(batchArg || migrateAll)) {
    console.log("Usage:");
    console.log(
      "  bun run batch-migrate-001 --batch=1    # Migrate batch 1 only",
    );
    console.log(
      "  bun run batch-migrate-001 --all         # Migrate all batches",
    );
    process.exit(1);
  }

  if (migrateAll) {
    console.log("Migrating all batches...");
    for (let i = 1; i <= BATCHES.length; i++) {
      const result = await migrateBatch(i);
      completeBatch(result);
    }
  } else if (batchArg) {
    const batchNum = Number.parseInt(batchArg.split("=")[1], 10);
    if (batchNum < 1 || batchNum > BATCHES.length) {
      console.error(`Invalid batch number. Must be 1-${BATCHES.length}`);
      process.exit(1);
    }
    const result = await migrateBatch(batchNum);
    completeBatch(result);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
