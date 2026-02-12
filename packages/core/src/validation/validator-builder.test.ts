import { describe, expect, it } from "bun:test";
import { ValidatorBuilder } from "./validator-builder";

describe("ValidatorBuilder", () => {
  describe("required validation", () => {
    it("should validate required fields", () => {
      const validator = new ValidatorBuilder<{ name: string }>()
        .required("name", "Name is required")
        .build();

      const validResult = validator.validate({ name: "Test" });
      expect(validResult.success).toBe(true);
      if (validResult.success) {
        expect(validResult.data).toEqual({ name: "Test" });
      }

      const invalidResult = validator.validate({ name: "" });
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.errors).toContain("Name is required");
      }
    });

    it("should validate multiple required fields", () => {
      const validator = new ValidatorBuilder<{ name: string; type: string }>()
        .required("name", "Name is required")
        .required("type", "Type is required")
        .build();

      const validResult = validator.validate({
        name: "Test",
        type: "creature",
      });
      expect(validResult.success).toBe(true);

      const invalidResult = validator.validate({ name: "", type: "" });
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.errors).toHaveLength(2);
      }
    });
  });

  describe("type validation", () => {
    it("should validate string types", () => {
      const validator = new ValidatorBuilder<{ name: string }>()
        .type("name", "string", "Name must be a string")
        .build();

      const validResult = validator.validate({ name: "Test" });
      expect(validResult.success).toBe(true);

      const invalidResult = validator.validate({ name: 123 as any });
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.errors).toContain("Name must be a string");
      }
    });

    it("should validate number types", () => {
      const validator = new ValidatorBuilder<{ power: number }>()
        .type("power", "number", "Power must be a number")
        .build();

      const validResult = validator.validate({ power: 5 });
      expect(validResult.success).toBe(true);

      const invalidResult = validator.validate({ power: "5" as any });
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.errors).toContain("Power must be a number");
      }
    });

    it("should validate boolean types", () => {
      const validator = new ValidatorBuilder<{ enabled: boolean }>()
        .type("enabled", "boolean", "Enabled must be a boolean")
        .build();

      const validResult = validator.validate({ enabled: true });
      expect(validResult.success).toBe(true);

      const invalidResult = validator.validate({ enabled: "true" as any });
      expect(invalidResult.success).toBe(false);
    });
  });

  describe("min/max validation", () => {
    it("should validate minimum values for numbers", () => {
      const validator = new ValidatorBuilder<{ power: number }>()
        .min("power", 0, "Power must be at least 0")
        .build();

      const validResult = validator.validate({ power: 5 });
      expect(validResult.success).toBe(true);

      const invalidResult = validator.validate({ power: -1 });
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.errors).toContain("Power must be at least 0");
      }
    });

    it("should validate maximum values for numbers", () => {
      const validator = new ValidatorBuilder<{ power: number }>()
        .max("power", 10, "Power must be at most 10")
        .build();

      const validResult = validator.validate({ power: 5 });
      expect(validResult.success).toBe(true);

      const invalidResult = validator.validate({ power: 15 });
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.errors).toContain("Power must be at most 10");
      }
    });

    it("should validate min and max together", () => {
      const validator = new ValidatorBuilder<{ power: number }>()
        .min("power", 0, "Power must be at least 0")
        .max("power", 10, "Power must be at most 10")
        .build();

      expect(validator.validate({ power: 5 }).success).toBe(true);
      expect(validator.validate({ power: 0 }).success).toBe(true);
      expect(validator.validate({ power: 10 }).success).toBe(true);
      expect(validator.validate({ power: -1 }).success).toBe(false);
      expect(validator.validate({ power: 11 }).success).toBe(false);
    });

    it("should validate string length with min", () => {
      const validator = new ValidatorBuilder<{ name: string }>()
        .min("name", 3, "Name must be at least 3 characters")
        .build();

      expect(validator.validate({ name: "Test" }).success).toBe(true);
      expect(validator.validate({ name: "Hi" }).success).toBe(false);
    });

    it("should validate string length with max", () => {
      const validator = new ValidatorBuilder<{ name: string }>()
        .max("name", 10, "Name must be at most 10 characters")
        .build();

      expect(validator.validate({ name: "Short" }).success).toBe(true);
      expect(validator.validate({ name: "Very Long Name" }).success).toBe(false);
    });
  });

  describe("custom validation", () => {
    it("should support custom validation functions", () => {
      const validator = new ValidatorBuilder<{ email: string }>()
        .custom(
          "email",
          (value) => typeof value === "string" && value.includes("@"),
          "Email must contain @",
        )
        .build();

      const validResult = validator.validate({ email: "test@example.com" });
      expect(validResult.success).toBe(true);

      const invalidResult = validator.validate({ email: "invalid-email" });
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.errors).toContain("Email must contain @");
      }
    });

    it("should support multiple custom validators on the same field", () => {
      const validator = new ValidatorBuilder<{ password: string }>()
        .custom(
          "password",
          (value) => typeof value === "string" && value.length >= 8,
          "Password must be at least 8 characters",
        )
        .custom(
          "password",
          (value) => typeof value === "string" && /[A-Z]/.test(value),
          "Password must contain an uppercase letter",
        )
        .build();

      expect(validator.validate({ password: "Password1" }).success).toBe(true);
      expect(validator.validate({ password: "short" }).success).toBe(false);
      expect(validator.validate({ password: "lowercase1" }).success).toBe(false);
    });
  });

  describe("fluent API", () => {
    it("should chain multiple validations", () => {
      const validator = new ValidatorBuilder<{
        name: string;
        power: number;
        type: string;
      }>()
        .required("name", "Name is required")
        .type("name", "string", "Name must be a string")
        .min("name", 1, "Name must not be empty")
        .max("name", 50, "Name must be at most 50 characters")
        .required("power", "Power is required")
        .type("power", "number", "Power must be a number")
        .min("power", 0, "Power must be non-negative")
        .max("power", 100, "Power must be at most 100")
        .required("type", "Type is required")
        .build();

      const validResult = validator.validate({
        name: "Dragon",
        power: 50,
        type: "creature",
      });
      expect(validResult.success).toBe(true);

      const invalidResult = validator.validate({
        name: "",
        power: 150,
        type: "",
      });
      expect(invalidResult.success).toBe(false);
    });
  });

  describe("error collection", () => {
    it("should collect all validation errors", () => {
      const validator = new ValidatorBuilder<{
        name: string;
        power: number;
        type: string;
      }>()
        .required("name", "Name is required")
        .required("power", "Power is required")
        .required("type", "Type is required")
        .build();

      const result = validator.validate({
        name: "",
        power: 0,
        type: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it("should stop at first error when configured", () => {
      const validator = new ValidatorBuilder<{
        name: string;
        power: number;
      }>({ abortEarly: true })
        .required("name", "Name is required")
        .required("power", "Power is required")
        .build();

      const result = validator.validate({
        name: "",
        power: 0,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        // With abortEarly, should only have one error
        expect(result.errors).toHaveLength(1);
      }
    });
  });

  describe("complex object validation", () => {
    it("should validate nested object structures", () => {
      interface Card {
        name: string;
        metadata: {
          version: number;
          category: string;
        };
      }

      const validator = new ValidatorBuilder<Card>()
        .required("name", "Name is required")
        .custom(
          "metadata",
          (value) => typeof value === "object" && value !== null,
          "Metadata is required",
        )
        .build();

      const validResult = validator.validate({
        metadata: { category: "creature", version: 1 },
        name: "Dragon",
      });
      expect(validResult.success).toBe(true);
    });

    it("should validate arrays", () => {
      interface Card {
        abilities: string[];
      }

      const validator = new ValidatorBuilder<Card>()
        .custom(
          "abilities",
          (value) => Array.isArray(value) && value.length > 0,
          "Must have at least one ability",
        )
        .build();

      expect(
        validator.validate({
          abilities: ["Flying", "Haste"],
        }).success,
      ).toBe(true);

      expect(
        validator.validate({
          abilities: [],
        }).success,
      ).toBe(false);
    });
  });

  describe("reusability", () => {
    it("should allow reusing validators", () => {
      const cardValidator = new ValidatorBuilder<{
        name: string;
        type: string;
      }>()
        .required("name", "Name is required")
        .required("type", "Type is required")
        .build();

      const card1 = { name: "Dragon", type: "creature" };
      const card2 = { name: "Bolt", type: "instant" };
      const card3 = { name: "", type: "" };

      expect(cardValidator.validate(card1).success).toBe(true);
      expect(cardValidator.validate(card2).success).toBe(true);
      expect(cardValidator.validate(card3).success).toBe(false);
    });
  });

  describe("performance", () => {
    it("should validate efficiently", () => {
      const validator = new ValidatorBuilder<{
        name: string;
        power: number;
        type: string;
      }>()
        .required("name", "Name is required")
        .type("name", "string", "Name must be a string")
        .required("power", "Power is required")
        .type("power", "number", "Power must be a number")
        .min("power", 0, "Power must be non-negative")
        .required("type", "Type is required")
        .build();

      const card = { name: "Dragon", power: 5, type: "creature" };

      const startTime = performance.now();
      for (let i = 0; i < 10_000; i++) {
        validator.validate(card);
      }
      const endTime = performance.now();

      // Should complete in reasonable time (< 1000ms for 10k validations, higher threshold for CI parallel execution)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
