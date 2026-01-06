/**
 * Migration Validator
 *
 * Validates converted cards for correctness and completeness.
 */

import type {
  ActionCard,
  CharacterCard,
  ItemCard,
  LocationCard,
} from "@tcg/lorcana-types";
import type { ConversionResult } from "./legacy-card-converter";

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
}

/**
 * Validate a converted card
 *
 * @param card - Converted card to validate
 * @returns Validation result
 */
export function validateCard(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required properties
  errors.push(...validateRequiredProperties(card));

  // Validate type-specific properties
  errors.push(...validateTypeSpecificProperties(card));

  // Validate abilities
  errors.push(...validateAbilities(card));

  // Validate external IDs
  warnings.push(...validateExternalIds(card));

  // Validate classifications (for characters)
  warnings.push(...validateClassifications(card));

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate required properties
 */
function validateRequiredProperties(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
): string[] {
  const errors: string[] = [];
  const requiredProps = [
    "id",
    "cardType",
    "name",
    "inkType",
    "set",
    "text",
    "cost",
    "cardNumber",
    "inkable",
  ];

  for (const prop of requiredProps) {
    if (!(prop in card) || card[prop as keyof typeof card] === undefined) {
      errors.push(`Missing required property: ${prop}`);
    }
  }

  // Validate property types
  if (card.id && typeof card.id !== "string") {
    errors.push("id must be a string");
  }

  if (card.cardType && typeof card.cardType !== "string") {
    errors.push("cardType must be a string");
  }

  if (card.cost && typeof card.cost !== "number") {
    errors.push("cost must be a number");
  }

  if (card.cardNumber && typeof card.cardNumber !== "number") {
    errors.push("cardNumber must be a number");
  }

  return errors;
}

/**
 * Validate type-specific properties
 */
function validateTypeSpecificProperties(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
): string[] {
  const errors: string[] = [];

  if (card.cardType === "character") {
    const charCard = card as CharacterCard;

    if (!charCard.strength || typeof charCard.strength !== "number") {
      errors.push("Character must have a numeric strength");
    }

    if (!charCard.willpower || typeof charCard.willpower !== "number") {
      errors.push("Character must have a numeric willpower");
    }

    if (!charCard.lore || typeof charCard.lore !== "number") {
      errors.push("Character must have a numeric lore");
    }

    if (!charCard.classifications || charCard.classifications.length === 0) {
      errors.push("Character must have at least one classification");
    }
  }

  return errors;
}

/**
 * Validate abilities
 */
function validateAbilities(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
): string[] {
  const errors: string[] = [];

  if (!card.abilities || card.abilities.length === 0) {
    // Only a warning if card has substantial text
    if (card.text && card.text.length > 50) {
      // No abilities on card with text - may indicate incomplete conversion
    }
    return errors;
  }

  // Validate each ability
  for (let i = 0; i < card.abilities.length; i++) {
    const ability = card.abilities[i];
    const prefix = `Ability ${i + 1}:`;
    // Capture the type early to avoid narrowing issues
    const abilityType = ability.type;

    // Check for required properties
    if (!abilityType) {
      errors.push(`${prefix} Missing type`);
    }

    // Check for valid types
    const validTypes = [
      "keyword",
      "triggered",
      "activated",
      "static",
      "action",
    ];
    if (abilityType && !validTypes.includes(abilityType)) {
      errors.push(`${prefix} Invalid type: ${abilityType}`);
    }

    // Type-specific validation
    if (abilityType === "keyword") {
      if (!("keyword" in ability)) {
        errors.push(`${prefix} Keyword ability missing 'keyword' property`);
      }
    }

    if (abilityType === "triggered") {
      if (!("trigger" in ability)) {
        errors.push(`${prefix} Triggered ability missing 'trigger' property`);
      }
      if (!("effect" in ability)) {
        errors.push(`${prefix} Triggered ability missing 'effect' property`);
      }
    }

    if (abilityType === "activated") {
      if (!("cost" in ability)) {
        errors.push(`${prefix} Activated ability missing 'cost' property`);
      }
      if (!("effect" in ability)) {
        errors.push(`${prefix} Activated ability missing 'effect' property`);
      }
    }

    // Check action/static abilities
    if (abilityType === "action" || abilityType === "static") {
      if (!("effect" in ability)) {
        const typeLabel = abilityType === "action" ? "action" : "static";
        errors.push(`${prefix} ${typeLabel} ability missing 'effect' property`);
      }
    }
  }

  return errors;
}

/**
 * Validate external IDs
 */
function validateExternalIds(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
): string[] {
  const warnings: string[] = [];

  if (!card.externalIds) {
    warnings.push("Missing externalIds");
    return warnings;
  }

  if (!card.externalIds.ravensburger || card.externalIds.ravensburger === "") {
    warnings.push("Missing or empty Ravensburger ID");
  }

  return warnings;
}

/**
 * Validate classifications
 */
function validateClassifications(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
): string[] {
  const warnings: string[] = [];

  if (card.cardType !== "character") {
    return warnings;
  }

  const charCard = card as CharacterCard;

  // Check for valid classifications
  const validClassifications = [
    "Storyborn",
    "Dreamborn",
    "Floodborn",
    "Hero",
    "Villain",
    "Queen",
    "King",
    "Prince",
    "Princess",
    "Mentor",
    "Ally",
    "Titan",
    "Broom",
    "Musketeer",
    "Seven Dwarfs",
    "Inkworthy",
  ];

  for (const classification of charCard.classifications ?? []) {
    if (!validClassifications.includes(classification)) {
      warnings.push(`Unknown classification: ${classification}`);
    }
  }

  return warnings;
}

/**
 * Validate all conversion results
 *
 * @param results - Array of conversion results
 * @returns Array of validation results
 */
export function validateConversionResults(
  results: ConversionResult[],
): ValidationResult[] {
  return results.map((result) => validateCard(result.card));
}

/**
 * Get overall validation summary
 *
 * @param validations - Array of validation results
 * @returns Summary string
 */
export function getValidationSummary(validations: ValidationResult[]): string {
  const valid = validations.filter((v) => v.valid).length;
  const invalid = validations.filter((v) => !v.valid).length;
  const totalErrors = validations.reduce((sum, v) => sum + v.errors.length, 0);
  const totalWarnings = validations.reduce(
    (sum, v) => sum + v.warnings.length,
    0,
  );

  let summary = `
=== Validation Summary ===

Total cards: ${validations.length}
Valid: ${valid}
Invalid: ${invalid}
Total errors: ${totalErrors}
Total warnings: ${totalWarnings}
`;

  if (invalid > 0) {
    summary += "\n=== Invalid Cards ===\n";
    validations
      .filter((v) => !v.valid)
      .forEach((v, i) => {
        summary += `\nCard ${i + 1}:\n`;
        v.errors.forEach((e) => {
          summary += `  - ${e}\n`;
        });
      });
  }

  if (totalWarnings > 0) {
    summary += "\n=== Cards with Warnings ===\n";
    validations
      .filter((v) => v.warnings.length > 0)
      .forEach((v, i) => {
        summary += `\nCard ${i + 1}:\n`;
        v.warnings.forEach((w) => {
          summary += `  - ${w}\n`;
        });
      });
  }

  return summary;
}
