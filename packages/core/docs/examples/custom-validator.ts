/**
 * Custom Validator Examples
 *
 * Demonstrates how to use ValidatorBuilder for runtime validation
 * Run with: bun run packages/core/docs/examples/custom-validator.ts
 */

import {
  createValidator,
  type Validator,
  ValidatorBuilder,
} from "../../src/validation";

// =============================================================================
// Example Card Type
// =============================================================================

type GameCard = {
  name: string;
  type: "creature" | "spell" | "artifact";
  cost: number;
  rarity: "common" | "rare" | "mythic";
  text: string;
  // Creature-specific
  power?: number;
  toughness?: number;
  // Spell-specific
  instant?: boolean;
};

// =============================================================================
// Example 1: Basic Validation
// =============================================================================

function example1_basicValidation() {
  console.log("=== Example 1: Basic Validation ===\n");

  const validator = new ValidatorBuilder<GameCard>()
    .required("name", "Card name is required")
    .type("name", "string", "Name must be a string")
    .min("name", 1, "Name must not be empty")
    .max("name", 50, "Name must be at most 50 characters")
    .required("cost", "Cost is required")
    .type("cost", "number", "Cost must be a number")
    .min("cost", 0, "Cost cannot be negative")
    .max("cost", 10, "Cost cannot exceed 10")
    .build();

  // Valid card
  const validCard: GameCard = {
    name: "Dragon",
    type: "creature",
    cost: 5,
    rarity: "rare",
    text: "Flying",
    power: 4,
    toughness: 4,
  };

  const result1 = validator.validate(validCard);
  console.log("Valid card:", result1.success); // true

  // Invalid card (empty name, negative cost)
  const invalidCard = {
    name: "",
    type: "creature",
    cost: -1,
    rarity: "rare",
    text: "Test",
  } as GameCard;

  const result2 = validator.validate(invalidCard);
  console.log("\nInvalid card:", result2.success); // false
  if (!result2.success) {
    console.log("Errors:");
    for (const error of result2.errors) {
      console.log(`  - ${error}`);
    }
  }
}

// =============================================================================
// Example 2: Custom Validation Rules
// =============================================================================

function example2_customRules() {
  console.log("\n=== Example 2: Custom Validation Rules ===\n");

  const validator = new ValidatorBuilder<GameCard>()
    .required("name", "Name is required")
    .custom(
      "name",
      (name) => /^[A-Z]/.test(name),
      "Name must start with a capital letter",
    )
    .custom("cost", (cost) => cost % 1 === 0, "Cost must be a whole number")
    .custom(
      "text",
      (text) => text.length <= 200,
      "Card text must be at most 200 characters",
    )
    .build();

  // Test various cards
  const testCases = [
    {
      card: {
        name: "Dragon",
        type: "creature" as const,
        cost: 5,
        rarity: "rare" as const,
        text: "Flying",
      },
      description: "Valid card",
    },
    {
      card: {
        name: "dragon",
        type: "creature" as const,
        cost: 5,
        rarity: "rare" as const,
        text: "Flying",
      },
      description: "Name doesn't start with capital",
    },
    {
      card: {
        name: "Fireball",
        type: "spell" as const,
        cost: 3.5,
        rarity: "common" as const,
        text: "Deal damage",
      },
      description: "Cost is not a whole number",
    },
  ];

  for (const testCase of testCases) {
    console.log(`\nTest: ${testCase.description}`);
    const result = validator.validate(testCase.card);
    if (result.success) {
      console.log("  ✓ Valid");
    } else {
      console.log("  ✗ Invalid");
      for (const error of result.errors) {
        console.log(`    - ${error}`);
      }
    }
  }
}

// =============================================================================
// Example 3: Type-Specific Validation
// =============================================================================

function example3_typeSpecificValidation() {
  console.log("\n=== Example 3: Type-Specific Validation ===\n");

  // Base validator for all cards
  function createBaseValidator() {
    return new ValidatorBuilder<GameCard>()
      .required("name", "Name is required")
      .type("name", "string", "Name must be a string")
      .min("name", 1, "Name must not be empty")
      .required("cost", "Cost is required")
      .type("cost", "number", "Cost must be a number")
      .min("cost", 0, "Cost must be non-negative");
  }

  // Creature validator
  const creatureValidator = createBaseValidator()
    .custom(
      "power",
      (power) => power !== undefined && power >= 0,
      "Creatures must have non-negative power",
    )
    .custom(
      "toughness",
      (toughness) => toughness !== undefined && toughness >= 0,
      "Creatures must have non-negative toughness",
    )
    .build();

  // Spell validator
  const spellValidator = createBaseValidator()
    .type("instant", "boolean", "Instant must be a boolean")
    .build();

  // Validate creature
  const creature: GameCard = {
    name: "Dragon",
    type: "creature",
    cost: 5,
    rarity: "rare",
    text: "Flying",
    power: 4,
    toughness: 4,
  };

  console.log("Validating creature:");
  const creatureResult = creatureValidator.validate(creature);
  console.log("  Valid:", creatureResult.success);

  // Validate spell
  const spell: GameCard = {
    name: "Fireball",
    type: "spell",
    cost: 3,
    rarity: "common",
    text: "Deal 3 damage",
    instant: true,
  };

  console.log("\nValidating spell:");
  const spellResult = spellValidator.validate(spell);
  console.log("  Valid:", spellResult.success);

  // Invalid creature (missing power/toughness)
  const invalidCreature = {
    name: "Goblin",
    type: "creature",
    cost: 1,
    rarity: "common",
    text: "Weak",
  } as GameCard;

  console.log("\nValidating invalid creature:");
  const invalidResult = creatureValidator.validate(invalidCreature);
  console.log("  Valid:", invalidResult.success);
  if (!invalidResult.success) {
    console.log("  Errors:");
    for (const error of invalidResult.errors) {
      console.log(`    - ${error}`);
    }
  }
}

// =============================================================================
// Example 4: Functional Style
// =============================================================================

function example4_functionalStyle() {
  console.log("\n=== Example 4: Functional Style ===\n");

  const cardValidator = createValidator<GameCard>(
    (builder) =>
      builder
        .required("name", "Name is required")
        .min("name", 1, "Name must not be empty")
        .max("name", 50, "Name too long")
        .required("cost", "Cost is required")
        .min("cost", 0, "Cost must be non-negative")
        .max("cost", 10, "Cost too high")
        .custom(
          "rarity",
          (rarity) => ["common", "rare", "mythic"].includes(rarity),
          "Invalid rarity",
        ),
    { abortEarly: true }, // Stop at first error
  );

  const card: GameCard = {
    name: "",
    type: "creature",
    cost: -1,
    rarity: "rare",
    text: "Test",
  };

  const result = cardValidator.validate(card);
  console.log("Valid:", result.success);
  if (!result.success) {
    console.log("First error:", result.errors[0]); // Only one error due to abortEarly
  }
}

// =============================================================================
// Example 5: Reusable Validator Library
// =============================================================================

function example5_reusableValidators() {
  console.log("\n=== Example 5: Reusable Validator Library ===\n");

  // Create a library of reusable validators
  const validators = {
    card: createValidator<GameCard>((builder) =>
      builder
        .required("name", "Name is required")
        .type("name", "string", "Name must be a string")
        .min("name", 1, "Name cannot be empty")
        .max("name", 50, "Name too long")
        .required("cost", "Cost is required")
        .type("cost", "number", "Cost must be a number")
        .min("cost", 0, "Cost cannot be negative")
        .max("cost", 10, "Cost cannot exceed 10"),
    ),

    creature: createValidator<GameCard>((builder) =>
      builder
        .required("power", "Creatures must have power")
        .type("power", "number", "Power must be a number")
        .min("power", 0, "Power cannot be negative")
        .required("toughness", "Creatures must have toughness")
        .type("toughness", "number", "Toughness must be a number")
        .min("toughness", 0, "Toughness cannot be negative"),
    ),

    spell: createValidator<GameCard>((builder) =>
      builder
        .required("instant", "Spells must specify if instant")
        .type("instant", "boolean", "Instant must be boolean"),
    ),
  };

  // Validate with appropriate validator
  function validateCard(card: GameCard) {
    // Base validation
    let result = validators.card.validate(card);
    if (!result.success) {
      return result;
    }

    // Type-specific validation
    if (card.type === "creature") {
      result = validators.creature.validate(card);
    } else if (card.type === "spell") {
      result = validators.spell.validate(card);
    }

    return result;
  }

  // Test cards
  const cards: GameCard[] = [
    {
      name: "Dragon",
      type: "creature",
      cost: 5,
      rarity: "rare",
      text: "Flying",
      power: 4,
      toughness: 4,
    },
    {
      name: "Fireball",
      type: "spell",
      cost: 3,
      rarity: "common",
      text: "Deal damage",
      instant: true,
    },
    {
      name: "Invalid",
      type: "creature",
      cost: 5,
      rarity: "rare",
      text: "Missing stats",
    } as GameCard,
  ];

  for (const card of cards) {
    console.log(`\nValidating: ${card.name}`);
    const result = validateCard(card);
    if (result.success) {
      console.log("  ✓ Valid");
    } else {
      console.log("  ✗ Invalid");
      for (const error of result.errors) {
        console.log(`    - ${error}`);
      }
    }
  }
}

// =============================================================================
// Example 6: Validation with Business Logic
// =============================================================================

function example6_businessLogicValidation() {
  console.log("\n=== Example 6: Business Logic Validation ===\n");

  // Validator with game-specific business rules
  const validator = new ValidatorBuilder<GameCard>()
    .required("name", "Name is required")
    .required("cost", "Cost is required")
    .custom(
      "cost",
      (cost, card) => {
        // Cost limits by rarity
        const maxCostByRarity = {
          common: 5,
          rare: 8,
          mythic: 10,
        };
        return cost <= maxCostByRarity[(card as GameCard).rarity];
      },
      "Cost exceeds maximum for rarity",
    )
    .custom(
      "power",
      (power, card) => {
        const gameCard = card as GameCard;
        if (gameCard.type !== "creature") return true;
        if (power === undefined) return true;

        // Power-to-cost ratio validation
        const ratio = power / gameCard.cost;
        return ratio <= 2; // Max 2 power per mana
      },
      "Power-to-cost ratio too high",
    )
    .build();

  const cards = [
    {
      name: "Goblin",
      type: "creature" as const,
      cost: 1,
      rarity: "common" as const,
      text: "Weak",
      power: 2,
      toughness: 1,
    },
    {
      name: "Dragon",
      type: "creature" as const,
      cost: 2,
      rarity: "common" as const,
      text: "Too strong for cost",
      power: 10,
      toughness: 10,
    },
    {
      name: "Expensive Common",
      type: "spell" as const,
      cost: 7,
      rarity: "common" as const,
      text: "Too expensive for common",
    },
  ];

  for (const card of cards) {
    console.log(`\nValidating: ${card.name}`);
    const result = validator.validate(card);
    if (result.success) {
      console.log("  ✓ Valid");
    } else {
      console.log("  ✗ Invalid");
      for (const error of result.errors) {
        console.log(`    - ${error}`);
      }
    }
  }
}

// =============================================================================
// Run all examples
// =============================================================================

function main() {
  console.log("==============================================");
  console.log("  Custom Validator Examples");
  console.log("==============================================\n");

  example1_basicValidation();
  example2_customRules();
  example3_typeSpecificValidation();
  example4_functionalStyle();
  example5_reusableValidators();
  example6_businessLogicValidation();

  console.log("\n==============================================");
  console.log("  All examples completed!");
  console.log("==============================================\n");
}

// Run if executed directly
if (import.meta.main) {
  main();
}

export {
  example1_basicValidation,
  example2_customRules,
  example3_typeSpecificValidation,
  example4_functionalStyle,
  example5_reusableValidators,
  example6_businessLogicValidation,
};
