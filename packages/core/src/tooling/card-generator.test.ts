/**
 * Tests for CardGenerator abstract class
 */

import { describe, expect, test } from "bun:test";
import { CardGenerator } from "./card-generator";

interface TestCard {
  id: string;
  name: string;
  type: string;
}

// Test implementation of CardGenerator
class TestGenerator extends CardGenerator<TestCard> {
  protected generateContent(card: TestCard): string {
    return `export const ${this.generateVariableName(card.name)}: TestCard = {
  id: "${card.id}",
  name: "${card.name}",
  type: "${card.type}",
};`;
  }

  protected generateFileName(card: TestCard): string {
    return `${card.id}.ts`;
  }

  private generateVariableName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9]/g, "")
      .replace(/^(.)/, (c) => c.toLowerCase());
  }
}

describe("CardGenerator", () => {
  test("should generate content for a card", () => {
    const generator = new TestGenerator();
    const card: TestCard = {
      id: "test-001",
      name: "Test Card",
      type: "unit",
    };

    const content = generator.generate(card);

    expect(content).toContain("export const testCard");
    expect(content).toContain('id: "test-001"');
    expect(content).toContain('name: "Test Card"');
    expect(content).toContain('type: "unit"');
  });

  test("should generate multiple cards", () => {
    const generator = new TestGenerator();
    const cards: TestCard[] = [
      { id: "test-001", name: "Card One", type: "unit" },
      { id: "test-002", name: "Card Two", type: "spell" },
    ];

    const results = generator.generateBatch(cards);

    expect(results).toHaveLength(2);
    expect(results[0].content).toContain("Card One");
    expect(results[1].content).toContain("Card Two");
  });

  test("should generate file name", () => {
    const generator = new TestGenerator();
    const card: TestCard = {
      id: "test-001",
      name: "Test Card",
      type: "unit",
    };

    const result = generator.generateBatch([card])[0];
    expect(result.fileName).toBe("test-001.ts");
  });

  test("should handle special characters in names", () => {
    const generator = new TestGenerator();
    const card: TestCard = {
      id: "special-001",
      name: "Test's Card!",
      type: "unit",
    };

    const content = generator.generate(card);
    expect(content).toContain("export const testsCard");
  });

  test("should generate consistent output", () => {
    const generator = new TestGenerator();
    const card: TestCard = {
      id: "test-001",
      name: "Test Card",
      type: "unit",
    };

    const content1 = generator.generate(card);
    const content2 = generator.generate(card);

    expect(content1).toBe(content2);
  });
});
