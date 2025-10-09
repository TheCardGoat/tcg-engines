/**
 * Tests for CardValidator abstract class
 */

import { describe, expect, test } from "bun:test";
import { CardValidator } from "./card-validator";
import type { ValidationResult } from "./types";

interface TestCard {
  id: string;
  name: string;
  cost?: number;
}

// Test implementation of CardValidator
class TestValidator extends CardValidator<TestCard> {
  protected doValidate(card: TestCard): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!card.id || card.id.trim() === "") {
      errors.push("Card must have an id");
    }

    if (!card.name || card.name.trim() === "") {
      errors.push("Card must have a name");
    }

    if (card.name && card.name.length < 3) {
      warnings.push("Card name is very short");
    }

    if (card.cost !== undefined && card.cost < 0) {
      errors.push("Card cost cannot be negative");
    }

    if (card.cost === undefined) {
      warnings.push("Card has no cost defined");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

describe("CardValidator", () => {
  test("should validate valid card", () => {
    const validator = new TestValidator();
    const card: TestCard = {
      id: "test-001",
      name: "Test Card",
      cost: 3,
    };

    const result = validator.validate(card);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  test("should detect missing id", () => {
    const validator = new TestValidator();
    const card: TestCard = {
      id: "",
      name: "Test Card",
      cost: 3,
    };

    const result = validator.validate(card);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Card must have an id");
  });

  test("should detect missing name", () => {
    const validator = new TestValidator();
    const card: TestCard = {
      id: "test-001",
      name: "",
      cost: 3,
    };

    const result = validator.validate(card);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Card must have a name");
  });

  test("should warn about short name", () => {
    const validator = new TestValidator();
    const card: TestCard = {
      id: "test-001",
      name: "AB",
      cost: 3,
    };

    const result = validator.validate(card);

    expect(result.valid).toBe(true);
    expect(result.warnings).toContain("Card name is very short");
  });

  test("should detect negative cost", () => {
    const validator = new TestValidator();
    const card: TestCard = {
      id: "test-001",
      name: "Test Card",
      cost: -5,
    };

    const result = validator.validate(card);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Card cost cannot be negative");
  });

  test("should warn about missing cost", () => {
    const validator = new TestValidator();
    const card: TestCard = {
      id: "test-001",
      name: "Test Card",
    };

    const result = validator.validate(card);

    expect(result.valid).toBe(true);
    expect(result.warnings).toContain("Card has no cost defined");
  });

  test("should validate batch of cards", () => {
    const validator = new TestValidator();
    const cards: TestCard[] = [
      { id: "test-001", name: "Valid Card", cost: 3 },
      { id: "", name: "Invalid Card", cost: 2 },
      { id: "test-003", name: "Another Valid", cost: 1 },
    ];

    const results = validator.validateBatch(cards);

    expect(results).toHaveLength(3);
    expect(results[0].valid).toBe(true);
    expect(results[1].valid).toBe(false);
    expect(results[2].valid).toBe(true);
  });

  test("should handle multiple errors", () => {
    const validator = new TestValidator();
    const card: TestCard = {
      id: "",
      name: "",
      cost: -1,
    };

    const result = validator.validate(card);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
