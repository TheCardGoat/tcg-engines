/**
 * Card Parser Extension Example
 *
 * Demonstrates how to extend CardParser for game-specific parsing
 * Run with: bun run packages/core/docs/examples/card-parser-extension.ts
 */

import {
  CardParser,
  generateVariableName,
  type ParserResult,
  toKebabCase,
} from "../../src/tooling";

// =============================================================================
// Example Card Type
// =============================================================================

type GameCard = {
  id: string;
  name: string;
  type: "creature" | "spell" | "artifact";
  cost: number;
  text: string;
  // Creature-specific
  power?: number;
  toughness?: number;
  // Spell-specific
  instant?: boolean;
};

// =============================================================================
// Example 1: Simple Text Parser
// =============================================================================

/**
 * Parses cards from simple text format:
 * ```
 * Name
 * Type
 * Cost
 * Card Text
 * ```
 */
class SimpleTextParser extends CardParser<string, GameCard> {
  protected doParse(text: string): ParserResult<GameCard> {
    const lines = text.split("\n").map((line) => line.trim());

    if (lines.length < 4) {
      return {
        success: false,
        errors: ["Invalid format. Expected 4 lines: Name, Type, Cost, Text"],
      };
    }

    const [name, type, costStr, cardText] = lines;

    // Validate name
    if (!name || name.length === 0) {
      return {
        success: false,
        errors: ["Card name is required"],
      };
    }

    // Validate type
    if (!["creature", "spell", "artifact"].includes(type)) {
      return {
        success: false,
        errors: [`Invalid card type: ${type}`],
      };
    }

    // Parse cost
    const cost = Number.parseInt(costStr, 10);
    if (Number.isNaN(cost)) {
      return {
        success: false,
        errors: [`Invalid cost: ${costStr}`],
      };
    }

    // Build base card
    const card: GameCard = {
      id: toKebabCase(name),
      name,
      type: type as GameCard["type"],
      cost,
      text: cardText || "",
    };

    // Parse type-specific properties
    const warnings: string[] = [];

    if (type === "creature") {
      // Look for power/toughness in text (e.g., "2/3")
      const statsMatch = cardText.match(/(\d+)\/(\d+)/);
      if (statsMatch) {
        card.power = Number.parseInt(statsMatch[1], 10);
        card.toughness = Number.parseInt(statsMatch[2], 10);
      } else {
        warnings.push("Creature is missing power/toughness stats");
      }
    }

    if (type === "spell") {
      card.instant = cardText.toLowerCase().includes("instant");
    }

    return {
      success: true,
      data: card,
      warnings,
    };
  }
}

// =============================================================================
// Example 2: CSV Parser
// =============================================================================

/**
 * Parses cards from CSV format:
 * ```
 * Name,Type,Cost,Text,Power,Toughness
 * ```
 */
class CSVParser extends CardParser<string, GameCard> {
  protected doParse(csvLine: string): ParserResult<GameCard> {
    // Simple CSV parsing (doesn't handle quoted commas)
    const parts = csvLine.split(",").map((p) => p.trim());

    if (parts.length < 4) {
      return {
        success: false,
        errors: ["Invalid CSV format. Expected at least 4 columns"],
      };
    }

    const [name, type, costStr, text, powerStr, toughnessStr] = parts;

    const cost = Number.parseInt(costStr, 10);
    if (Number.isNaN(cost) || cost < 0) {
      return {
        success: false,
        errors: [`Invalid cost: ${costStr}`],
      };
    }

    const card: GameCard = {
      id: toKebabCase(name),
      name,
      type: type as GameCard["type"],
      cost,
      text: text || "",
    };

    // Parse optional power/toughness
    if (powerStr && toughnessStr) {
      const power = Number.parseInt(powerStr, 10);
      const toughness = Number.parseInt(toughnessStr, 10);

      if (!(Number.isNaN(power) || Number.isNaN(toughness))) {
        card.power = power;
        card.toughness = toughness;
      }
    }

    return {
      success: true,
      data: card,
      warnings: [],
    };
  }
}

// =============================================================================
// Example 3: JSON Parser
// =============================================================================

/**
 * Parses cards from JSON objects
 */
class JSONCardParser extends CardParser<unknown, GameCard> {
  protected doParse(input: unknown): ParserResult<GameCard> {
    // Type guard
    if (!this.isValidCardObject(input)) {
      return {
        success: false,
        errors: ["Invalid card object structure"],
      };
    }

    const { name, type, cost, text, power, toughness, instant } = input;

    // Validate required fields
    if (typeof cost !== "number" || cost < 0) {
      return {
        success: false,
        errors: ["Cost must be a non-negative number"],
      };
    }

    const card: GameCard = {
      id: toKebabCase(name),
      name,
      type,
      cost,
      text: text || "",
    };

    // Add optional fields
    if (power !== undefined) card.power = power;
    if (toughness !== undefined) card.toughness = toughness;
    if (instant !== undefined) card.instant = instant;

    return {
      success: true,
      data: card,
      warnings: [],
    };
  }

  private isValidCardObject(obj: unknown): obj is {
    name: string;
    type: "creature" | "spell" | "artifact";
    cost: number;
    text?: string;
    power?: number;
    toughness?: number;
    instant?: boolean;
  } {
    if (typeof obj !== "object" || obj === null) return false;

    const record = obj as Record<string, unknown>;

    return (
      typeof record.name === "string" &&
      (record.type === "creature" ||
        record.type === "spell" ||
        record.type === "artifact") &&
      typeof record.cost === "number"
    );
  }
}

// =============================================================================
// Example 4: Advanced Parser with Validation
// =============================================================================

/**
 * Parser with comprehensive validation and helpful error messages
 */
class ValidatingParser extends CardParser<string, GameCard> {
  protected doParse(text: string): ParserResult<GameCard> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const lines = text.split("\n").map((line) => line.trim());

    // Validate line count
    if (lines.length < 4) {
      return {
        success: false,
        errors: [
          "Invalid format. Expected format:",
          "  Line 1: Card name",
          "  Line 2: Card type (creature/spell/artifact)",
          "  Line 3: Mana cost (number)",
          "  Line 4: Card text (with optional P/T for creatures)",
        ],
      };
    }

    const [name, type, costStr, cardText] = lines;

    // Validate name
    if (!name || name.trim().length === 0) {
      errors.push("Card name is required and cannot be empty");
    } else if (name.length > 50) {
      errors.push(`Card name is too long (${name.length} chars, max 50)`);
    } else if (!/^[A-Z]/.test(name)) {
      warnings.push("Card name should start with a capital letter");
    }

    // Validate type
    const validTypes = ["creature", "spell", "artifact"];
    if (!validTypes.includes(type)) {
      errors.push(
        `Invalid card type: "${type}". Must be one of: ${validTypes.join(", ")}`,
      );
    }

    // Validate cost
    const cost = Number.parseInt(costStr, 10);
    if (Number.isNaN(cost)) {
      errors.push(`Invalid cost: "${costStr}". Must be a number`);
    } else if (cost < 0) {
      errors.push(`Cost cannot be negative: ${cost}`);
    } else if (cost > 10) {
      warnings.push(`Very high cost: ${cost}. Is this intentional?`);
    }

    // Validate card text
    if (!cardText || cardText.trim().length === 0) {
      warnings.push("Card has no text");
    } else if (cardText.length > 200) {
      warnings.push(`Card text is very long (${cardText.length} chars)`);
    }

    // Return early if there are errors
    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Build card
    const card: GameCard = {
      id: toKebabCase(name),
      name,
      type: type as GameCard["type"],
      cost,
      text: cardText,
    };

    // Type-specific validation
    if (type === "creature") {
      const statsMatch = cardText.match(/(\d+)\/(\d+)/);
      if (statsMatch) {
        const power = Number.parseInt(statsMatch[1], 10);
        const toughness = Number.parseInt(statsMatch[2], 10);

        if (power < 0 || toughness < 0) {
          errors.push("Power and toughness cannot be negative");
        } else {
          card.power = power;
          card.toughness = toughness;

          if (power > 20 || toughness > 20) {
            warnings.push("Very high power/toughness stats");
          }
        }
      } else {
        errors.push("Creature must have power/toughness stats (format: P/T)");
      }
    }

    // Return errors if found during type-specific validation
    if (errors.length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      data: card,
      warnings,
    };
  }
}

// =============================================================================
// Usage Examples
// =============================================================================

function main() {
  console.log("=== Card Parser Extension Examples ===\n");

  // Example 1: Simple Text Parser
  console.log("--- Example 1: Simple Text Parser ---");
  const textParser = new SimpleTextParser();

  const textCard = `Dragon
creature
5
Flying. 4/4`;

  const textResult = textParser.parse(textCard);
  if (textResult.success) {
    console.log("Parsed:", textResult.data);
    if (textResult.warnings.length > 0) {
      console.log("Warnings:", textResult.warnings);
    }
  } else {
    console.error("Errors:", textResult.errors);
  }

  // Example 2: CSV Parser
  console.log("\n--- Example 2: CSV Parser ---");
  const csvParser = new CSVParser();

  const csvCards = [
    "Fireball,spell,3,Deal 3 damage to any target",
    "Giant,creature,4,Reach. 3/3,3,3",
    "Invalid,spell", // This will fail
  ];

  const csvResults = csvParser.parseBatch(csvCards);
  csvResults.forEach((result, index) => {
    console.log(`\nCard ${index + 1}:`);
    if (result.success) {
      console.log("  Success:", result.data.name);
    } else {
      console.log("  Failed:", result.errors);
    }
  });

  // Get only successful results
  const successfulCards = csvParser.parseSuccessful(csvCards);
  console.log(`\nSuccessfully parsed ${successfulCards.length} cards`);

  // Example 3: JSON Parser
  console.log("\n--- Example 3: JSON Parser ---");
  const jsonParser = new JSONCardParser();

  const jsonCard = {
    name: "Lightning Bolt",
    type: "spell",
    cost: 1,
    text: "Deal 3 damage to any target",
    instant: true,
  };

  const jsonResult = jsonParser.parse(jsonCard);
  if (jsonResult.success) {
    console.log("Parsed JSON card:", jsonResult.data);
  }

  // Example 4: Validating Parser
  console.log("\n--- Example 4: Validating Parser ---");
  const validator = new ValidatingParser();

  const invalidCard = `dragon
creature
-5
Invalid stats`;

  const validateResult = validator.parse(invalidCard);
  console.log("\nValidation result:");
  if (validateResult.success) {
    console.log("Success:", validateResult.data);
    console.log("Warnings:", validateResult.warnings);
  } else {
    console.log("Errors:");
    for (const error of validateResult.errors) {
      console.log(`  - ${error}`);
    }
  }

  console.log("\n=== All examples completed ===");
}

// Run if executed directly
if (import.meta.main) {
  main();
}

export { SimpleTextParser, CSVParser, JSONCardParser, ValidatingParser };
