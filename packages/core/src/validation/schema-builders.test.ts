import { describe, expect, it } from "bun:test";
import { z } from "zod";
import {
  composeSchemas,
  createCardSchema,
  createOptionalSchema,
  createStrictSchema,
  extendSchema,
  mergeSchemas,
} from "./schema-builders";

describe("schema-builders", () => {
  describe("createCardSchema", () => {
    it("should create a basic card schema", () => {
      const schema = createCardSchema({
        id: z.string(),
        name: z.string(),
        type: z.string(),
      });

      const validCard = {
        id: "dragon-1",
        name: "Dragon",
        type: "creature",
      };

      const result = schema.safeParse(validCard);
      expect(result.success).toBe(true);
    });

    it("should validate required fields", () => {
      const schema = createCardSchema({
        id: z.string(),
        name: z.string(),
        type: z.string(),
      });

      const invalidCard = {
        id: "dragon-1",
        // Missing name
        type: "creature",
      };

      const result = schema.safeParse(invalidCard);
      expect(result.success).toBe(false);
    });

    it("should support optional fields", () => {
      const schema = createCardSchema({
        basePower: z.number().optional(),
        baseToughness: z.number().optional(),
        id: z.string(),
        name: z.string(),
        type: z.string(),
      });

      const cardWithOptional = {
        basePower: 5,
        baseToughness: 5,
        id: "dragon-1",
        name: "Dragon",
        type: "creature",
      };

      const cardWithoutOptional = {
        id: "bolt-1",
        name: "Lightning Bolt",
        type: "instant",
      };

      expect(schema.safeParse(cardWithOptional).success).toBe(true);
      expect(schema.safeParse(cardWithoutOptional).success).toBe(true);
    });
  });

  describe("extendSchema", () => {
    it("should extend base schema with additional fields", () => {
      const baseSchema = createCardSchema({
        id: z.string(),
        name: z.string(),
        type: z.string(),
      });

      const extendedSchema = extendSchema(baseSchema, {
        basePower: z.number(),
        baseToughness: z.number(),
      });

      const validCard = {
        basePower: 5,
        baseToughness: 5,
        id: "dragon-1",
        name: "Dragon",
        type: "creature",
      };

      const result = extendedSchema.safeParse(validCard);
      expect(result.success).toBe(true);
    });

    it("should require extended fields", () => {
      const baseSchema = createCardSchema({
        id: z.string(),
        name: z.string(),
      });

      const extendedSchema = extendSchema(baseSchema, {
        power: z.number(),
      });

      const cardWithoutPower = {
        id: "dragon-1",
        name: "Dragon",
      };

      const result = extendedSchema.safeParse(cardWithoutPower);
      expect(result.success).toBe(false);
    });
  });

  describe("mergeSchemas", () => {
    it("should merge two schemas", () => {
      const schema1 = createCardSchema({
        id: z.string(),
        name: z.string(),
      });

      const schema2 = createCardSchema({
        cost: z.number(),
        type: z.string(),
      });

      const merged = mergeSchemas(schema1, schema2);

      const validCard = {
        cost: 5,
        id: "dragon-1",
        name: "Dragon",
        type: "creature",
      };

      expect(merged.safeParse(validCard).success).toBe(true);
    });

    it("should merge multiple schemas", () => {
      const baseSchema = createCardSchema({
        id: z.string(),
        name: z.string(),
      });

      const typeSchema = createCardSchema({
        type: z.string(),
      });

      const statsSchema = createCardSchema({
        power: z.number(),
        toughness: z.number(),
      });

      const merged = mergeSchemas(baseSchema, typeSchema, statsSchema);

      const validCard = {
        id: "dragon-1",
        name: "Dragon",
        power: 5,
        toughness: 5,
        type: "creature",
      };

      expect(merged.safeParse(validCard).success).toBe(true);
    });
  });

  describe("composeSchemas", () => {
    it("should compose schemas with transformations", () => {
      const schema1 = z.object({
        name: z.string(),
      });

      const schema2 = z.object({
        type: z.string(),
      });

      const composed = composeSchemas([schema1, schema2]);

      const validData = {
        name: "Dragon",
        type: "creature",
      };

      expect(composed.safeParse(validData).success).toBe(true);
    });

    it("should validate all schemas in composition", () => {
      const schema1 = z.object({
        name: z.string().min(1),
      });

      const schema2 = z.object({
        type: z.string().min(1),
      });

      const composed = composeSchemas([schema1, schema2]);

      const invalidData = {
        name: "",
        type: "creature",
      };

      expect(composed.safeParse(invalidData).success).toBe(false);
    });
  });

  describe("createOptionalSchema", () => {
    it("should make all fields optional", () => {
      const requiredSchema = createCardSchema({
        id: z.string(),
        name: z.string(),
        type: z.string(),
      });

      const optionalSchema = createOptionalSchema(requiredSchema);

      const partialCard = {
        id: "dragon-1",
        // Missing name and type
      };

      expect(optionalSchema.safeParse(partialCard).success).toBe(true);
    });

    it("should still validate provided fields", () => {
      const requiredSchema = createCardSchema({
        id: z.string(),
        power: z.number(),
      });

      const optionalSchema = createOptionalSchema(requiredSchema);

      const invalidCard = {
        id: "dragon-1",
        power: "not-a-number", // Wrong type
      };

      expect(optionalSchema.safeParse(invalidCard).success).toBe(false);
    });
  });

  describe("createStrictSchema", () => {
    it("should not allow extra fields", () => {
      const schema = createStrictSchema({
        id: z.string(),
        name: z.string(),
      });

      const cardWithExtra = {
        extraField: "not allowed",
        id: "dragon-1",
        name: "Dragon",
      };

      const result = schema.safeParse(cardWithExtra);
      expect(result.success).toBe(false);
    });

    it("should allow defined fields", () => {
      const schema = createStrictSchema({
        id: z.string(),
        name: z.string(),
      });

      const validCard = {
        id: "dragon-1",
        name: "Dragon",
      };

      expect(schema.safeParse(validCard).success).toBe(true);
    });
  });

  describe("game-specific schemas", () => {
    it("should create Gundam card schema", () => {
      const gundamCardSchema = createCardSchema({
        cost: z.number().min(0),
        deployText: z.string().optional(),
        id: z.string(),
        name: z.string(),
        power: z.number().min(0).optional(),
        type: z.enum(["unit", "command", "character", "base"]),
      });

      const validGundamCard = {
        cost: 6,
        deployText: "【Deploy】Draw 2 cards",
        id: "gundam-1",
        name: "RX-78-2 Gundam",
        power: 7,
        type: "unit",
      };

      expect(gundamCardSchema.safeParse(validGundamCard).success).toBe(true);
    });

    it("should create Lorcana card schema", () => {
      const lorcanaCardSchema = createCardSchema({
        cost: z.number().min(0),
        id: z.string(),
        inkable: z.boolean(),
        lore: z.number().optional(),
        name: z.string(),
        strength: z.number().optional(),
        type: z.enum(["character", "action", "item", "location"]),
        willpower: z.number().optional(),
      });

      const validLorcanaCard = {
        cost: 5,
        id: "mickey-1",
        inkable: true,
        lore: 2,
        name: "Mickey Mouse - Brave Little Tailor",
        strength: 4,
        type: "character",
        willpower: 5,
      };

      expect(lorcanaCardSchema.safeParse(validLorcanaCard).success).toBe(true);
    });
  });

  describe("schema extension patterns", () => {
    it("should extend base card with game-specific fields", () => {
      const baseCardSchema = createCardSchema({
        id: z.string(),
        name: z.string(),
        type: z.string(),
      });

      const creatureSchema = extendSchema(baseCardSchema, {
        power: z.number().min(0),
        toughness: z.number().min(0),
      });

      const validCreature = {
        id: "dragon-1",
        name: "Dragon",
        power: 5,
        toughness: 5,
        type: "creature",
      };

      expect(creatureSchema.safeParse(validCreature).success).toBe(true);
    });

    it("should compose multiple feature schemas", () => {
      const baseSchema = createCardSchema({
        id: z.string(),
        name: z.string(),
      });

      const typeSchema = createCardSchema({
        type: z.enum(["creature", "instant", "sorcery"]),
      });

      const costSchema = createCardSchema({
        cost: z.number().min(0).max(20),
      });

      const fullSchema = composeSchemas([baseSchema, typeSchema, costSchema]);

      const validCard = {
        cost: 5,
        id: "dragon-1",
        name: "Dragon",
        type: "creature",
      };

      expect(fullSchema.safeParse(validCard).success).toBe(true);
    });
  });

  describe("validation error messages", () => {
    it("should provide meaningful error messages", () => {
      const schema = createCardSchema({
        id: z.string(),
        name: z.string().min(1, "Name cannot be empty"),
        power: z.number().min(0, "Power must be non-negative"),
      });

      const invalidCard = {
        id: "dragon-1",
        name: "",
        power: -1,
      };

      const result = schema.safeParse(invalidCard);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
