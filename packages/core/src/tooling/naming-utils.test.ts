/**
 * Tests for naming utilities
 */

import { describe, expect, test } from "bun:test";
import {
  generateVariableName,
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
} from "./naming-utils";

describe("Naming Utils", () => {
  describe("generateVariableName", () => {
    test("should generate valid variable name from simple string", () => {
      expect(generateVariableName("Test Card")).toBe("testCard");
    });

    test("should remove special characters", () => {
      expect(generateVariableName("Test's Card!")).toBe("testsCard");
    });

    test("should handle multiple words", () => {
      expect(generateVariableName("My Test Card Name")).toBe("myTestCardName");
    });

    test("should handle numbers", () => {
      expect(generateVariableName("Card 123")).toBe("card123");
    });

    test("should handle leading numbers by prefixing", () => {
      expect(generateVariableName("123 Card")).toBe("card123");
    });

    test("should handle all caps", () => {
      expect(generateVariableName("TEST CARD")).toBe("testCard");
    });

    test("should handle mixed case", () => {
      expect(generateVariableName("TeSt CaRd")).toBe("testCard");
    });

    test("should handle hyphenated names", () => {
      expect(generateVariableName("test-card-name")).toBe("testCardName");
    });
  });

  describe("toKebabCase", () => {
    test("should convert to kebab case", () => {
      expect(toKebabCase("Test Card")).toBe("test-card");
    });

    test("should handle PascalCase", () => {
      expect(toKebabCase("TestCard")).toBe("test-card");
    });

    test("should handle camelCase", () => {
      expect(toKebabCase("testCard")).toBe("test-card");
    });

    test("should handle multiple words", () => {
      expect(toKebabCase("My Test Card Name")).toBe("my-test-card-name");
    });

    test("should remove special characters", () => {
      expect(toKebabCase("Test's Card!")).toBe("tests-card");
    });

    test("should handle numbers", () => {
      expect(toKebabCase("Card 123")).toBe("card-123");
    });

    test("should collapse multiple hyphens", () => {
      expect(toKebabCase("test---card")).toBe("test-card");
    });

    test("should handle already kebab case", () => {
      expect(toKebabCase("test-card")).toBe("test-card");
    });
  });

  describe("toPascalCase", () => {
    test("should convert to PascalCase", () => {
      expect(toPascalCase("test card")).toBe("TestCard");
    });

    test("should handle kebab-case", () => {
      expect(toPascalCase("test-card")).toBe("TestCard");
    });

    test("should handle camelCase", () => {
      expect(toPascalCase("testCard")).toBe("TestCard");
    });

    test("should handle snake_case", () => {
      expect(toPascalCase("test_card")).toBe("TestCard");
    });

    test("should handle multiple words", () => {
      expect(toPascalCase("my test card name")).toBe("MyTestCardName");
    });

    test("should remove special characters", () => {
      expect(toPascalCase("test's card!")).toBe("TestsCard");
    });

    test("should handle numbers", () => {
      expect(toPascalCase("card 123")).toBe("Card123");
    });

    test("should handle already PascalCase", () => {
      expect(toPascalCase("TestCard")).toBe("TestCard");
    });
  });

  describe("toCamelCase", () => {
    test("should convert to camelCase", () => {
      expect(toCamelCase("Test Card")).toBe("testCard");
    });

    test("should handle kebab-case", () => {
      expect(toCamelCase("test-card")).toBe("testCard");
    });

    test("should handle PascalCase", () => {
      expect(toCamelCase("TestCard")).toBe("testCard");
    });

    test("should handle snake_case", () => {
      expect(toCamelCase("test_card")).toBe("testCard");
    });

    test("should handle multiple words", () => {
      expect(toCamelCase("my test card name")).toBe("myTestCardName");
    });

    test("should remove special characters", () => {
      expect(toCamelCase("test's card!")).toBe("testsCard");
    });

    test("should handle numbers", () => {
      expect(toCamelCase("card 123")).toBe("card123");
    });

    test("should handle already camelCase", () => {
      expect(toCamelCase("testCard")).toBe("testCard");
    });
  });

  describe("toSnakeCase", () => {
    test("should convert to snake_case", () => {
      expect(toSnakeCase("Test Card")).toBe("test_card");
    });

    test("should handle PascalCase", () => {
      expect(toSnakeCase("TestCard")).toBe("test_card");
    });

    test("should handle camelCase", () => {
      expect(toSnakeCase("testCard")).toBe("test_card");
    });

    test("should handle kebab-case", () => {
      expect(toSnakeCase("test-card")).toBe("test_card");
    });

    test("should handle multiple words", () => {
      expect(toSnakeCase("my test card name")).toBe("my_test_card_name");
    });

    test("should remove special characters", () => {
      expect(toSnakeCase("test's card!")).toBe("tests_card");
    });

    test("should handle numbers", () => {
      expect(toSnakeCase("card 123")).toBe("card_123");
    });

    test("should collapse multiple underscores", () => {
      expect(toSnakeCase("test___card")).toBe("test_card");
    });

    test("should handle already snake_case", () => {
      expect(toSnakeCase("test_card")).toBe("test_card");
    });
  });
});
