// Test data extractor for action cards from set 008

import type {
  LorcanitoActionCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

/**
 * Interface for test case data extracted from action cards
 */
export interface ActionCardTestCase {
  /** The card name */
  cardName: string;
  /** The card text to parse */
  text: string;
  /** The expected abilities from the hand-coded implementation */
  expectedAbilities: ResolutionAbility[];
  /** The card's cost */
  cost: number;
  /** The card's colors */
  colors: string[];
  /** The card's rarity */
  rarity: string;
  /** The card's set number */
  number: number;
  /** Additional notes about the card or expected parsing behavior */
  notes?: string;
  /** Whether this card has a missing test case flag */
  missingTestCase?: boolean;
}

/**
 * Extracts all action cards from set 008 and creates test case data
 */
export async function extractSet008ActionCards(): Promise<
  ActionCardTestCase[]
> {
  const testCases: ActionCardTestCase[] = [];
  const set008ActionsPath = join(__dirname, "../../../cards/008/actions");

  try {
    // Get all color directories
    const colorDirs = await readdir(set008ActionsPath, { withFileTypes: true });

    for (const colorDir of colorDirs) {
      if (colorDir.isDirectory() && colorDir.name !== "__tests__") {
        const colorPath = join(set008ActionsPath, colorDir.name);
        const files = await readdir(colorPath);

        // Process TypeScript files (not test files)
        const cardFiles = files.filter(
          (file) => file.endsWith(".ts") && !file.endsWith(".test.ts"),
        );

        for (const cardFile of cardFiles) {
          const cardPath = join(colorPath, cardFile);
          const testCase = await extractCardTestCase(cardPath);
          if (testCase) {
            testCases.push(testCase);
          }
        }
      }
    }

    return testCases.sort((a, b) => a.number - b.number);
  } catch (error) {
    console.error("Error extracting action cards:", error);
    return [];
  }
}

/**
 * Extracts test case data from a single card file
 */
async function extractCardTestCase(
  cardPath: string,
): Promise<ActionCardTestCase | null> {
  try {
    const fileContent = await readFile(cardPath, "utf-8");

    // Extract the exported card object using regex
    const exportMatch = fileContent.match(
      /export const (\w+): LorcanitoActionCard = ({[\s\S]*?});/,
    );
    if (!exportMatch) {
      console.warn(`Could not find card export in ${cardPath}`);
      return null;
    }

    const cardObjectStr = exportMatch[2];

    // Extract key properties using regex patterns
    if (!cardObjectStr) {
      console.warn(`Card object string is undefined for ${cardPath}`);
      return null;
    }

    const nameMatch = cardObjectStr.match(/name:\s*["']([^"']+)["']/);
    const textMatch = cardObjectStr.match(/text:\s*["']([^"']+)["']/);
    const costMatch = cardObjectStr.match(/cost:\s*(\d+)/);
    const colorsMatch = cardObjectStr.match(/colors:\s*\[([^\]]+)\]/);
    const rarityMatch = cardObjectStr.match(/rarity:\s*["']([^"']+)["']/);
    const numberMatch = cardObjectStr.match(/number:\s*(\d+)/);
    const missingTestMatch = cardObjectStr.match(/missingTestCase:\s*true/);
    const abilitiesMatch = cardObjectStr.match(/abilities:\s*(\[[\s\S]*?\])/);

    if (!(nameMatch && textMatch)) {
      console.warn(`Could not extract required fields from ${cardPath}`);
      return null;
    }

    const cardName = nameMatch[1];
    const text = textMatch[1];
    const cost = costMatch ? Number.parseInt(costMatch[1] || "0") : 0;
    const colors =
      colorsMatch && colorsMatch[1]
        ? colorsMatch[1].split(",").map((c) => c.trim().replace(/["']/g, ""))
        : [];
    const rarity = rarityMatch ? rarityMatch[1] : "common";
    const number = numberMatch ? Number.parseInt(numberMatch[1] || "0") : 0;
    const missingTestCase = !!missingTestMatch;

    // For now, we'll extract abilities as a string representation
    // In a real implementation, we'd need to evaluate the actual objects
    const abilitiesStr = abilitiesMatch ? abilitiesMatch[1] : "[]";

    // Ensure required string fields have default values
    const testCase: ActionCardTestCase = {
      cardName: cardName || "Unknown Card",
      text: text || "",
      expectedAbilities: [], // Will be populated by actual card evaluation
      cost,
      colors,
      rarity: rarity || "common",
      number,
      missingTestCase,
      notes: missingTestCase ? "Card marked as missing test case" : undefined,
    };

    return testCase;
  } catch (error) {
    console.error(`Error processing card file ${cardPath}:`, error);
    return null;
  }
}

/**
 * Loads actual card objects by importing them dynamically
 */
export async function loadActualCardData(
  testCases: ActionCardTestCase[],
): Promise<ActionCardTestCase[]> {
  const enhancedTestCases: ActionCardTestCase[] = [];

  for (const testCase of testCases) {
    try {
      // Try to dynamically import the card
      const cardModule = await import(
        `../../../cards/008/actions/${getCardPath(testCase)}`
      );
      const cardObject = Object.values(cardModule)[0] as LorcanitoActionCard;

      if (cardObject && cardObject.abilities) {
        enhancedTestCases.push({
          ...testCase,
          expectedAbilities: cardObject.abilities as ResolutionAbility[],
        });
      } else {
        enhancedTestCases.push(testCase);
      }
    } catch (error) {
      console.warn(`Could not load card data for ${testCase.cardName}:`, error);
      enhancedTestCases.push(testCase);
    }
  }

  return enhancedTestCases;
}

/**
 * Determines the file path for a card based on its properties
 */
function getCardPath(testCase: ActionCardTestCase): string {
  // This is a simplified approach - in reality we'd need to map colors to directories
  const primaryColor = testCase.colors[0] || "amber";
  const fileName = testCase.cardName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");

  return `${primaryColor}/${testCase.number.toString().padStart(3, "0")}-${fileName}`;
}

/**
 * Saves test cases to a JSON file for easy loading in tests
 */
export async function saveTestCasesToFile(
  testCases: ActionCardTestCase[],
  filePath: string,
): Promise<void> {
  const fs = await import("fs/promises");
  const serializedData = JSON.stringify(testCases, null, 2);
  await fs.writeFile(filePath, serializedData, "utf-8");
}

/**
 * Loads test cases from a JSON file
 */
export async function loadTestCasesFromFile(
  filePath: string,
): Promise<ActionCardTestCase[]> {
  try {
    const fs = await import("fs/promises");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading test cases from ${filePath}:`, error);
    return [];
  }
}
