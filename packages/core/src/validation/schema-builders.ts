/**
 * Zod schema composition utilities for building complex validation schemas
 *
 * Provides helper functions for composing, extending, and merging Zod schemas
 * in a type-safe and reusable way.
 */

import { type ZodObject, type ZodRawShape, z } from "zod";

/**
 * Creates a card schema from a shape object
 *
 * This is a thin wrapper around z.object() that provides better semantics
 * for card-related schemas and can be extended with additional features.
 *
 * @param shape - The shape of the schema
 * @returns A Zod object schema
 *
 * @example
 * ```typescript
 * const cardSchema = createCardSchema({
 *   id: z.string(),
 *   name: z.string(),
 *   type: z.string(),
 *   basePower: z.number().optional(),
 * });
 *
 * type Card = z.infer<typeof cardSchema>;
 * ```
 */
export function createCardSchema<T extends ZodRawShape>(shape: T): ZodObject<T> {
  return z.object(shape);
}

/**
 * Extends a base schema with additional fields
 *
 * Creates a new schema that includes all fields from the base schema
 * plus the new fields from the extension.
 *
 * @param baseSchema - The base schema to extend
 * @param extension - Additional fields to add
 * @returns A new schema with combined fields
 *
 * @example
 * ```typescript
 * const baseCardSchema = createCardSchema({
 *   id: z.string(),
 *   name: z.string(),
 * });
 *
 * const creatureSchema = extendSchema(baseCardSchema, {
 *   power: z.number(),
 *   toughness: z.number(),
 * });
 * ```
 */
export function extendSchema<T extends ZodRawShape, E extends ZodRawShape>(
  baseSchema: ZodObject<T>,
  extension: E,
): any {
  return baseSchema.extend(extension);
}

/**
 * Merges multiple schemas into one
 *
 * Combines all fields from all provided schemas into a single schema.
 * Later schemas can override fields from earlier schemas.
 *
 * @param schemas - Schemas to merge (at least 2)
 * @returns A new schema with all fields merged
 *
 * @example
 * ```typescript
 * const baseSchema = createCardSchema({ id: z.string() });
 * const typeSchema = createCardSchema({ type: z.string() });
 * const statsSchema = createCardSchema({ power: z.number() });
 *
 * const fullSchema = mergeSchemas(baseSchema, typeSchema, statsSchema);
 * ```
 */
export function mergeSchemas<T extends ZodRawShape, U extends ZodRawShape>(
  schema1: ZodObject<T>,
  schema2: ZodObject<U>,
): any;

export function mergeSchemas<T extends ZodRawShape, U extends ZodRawShape, V extends ZodRawShape>(
  schema1: ZodObject<T>,
  schema2: ZodObject<U>,
  schema3: ZodObject<V>,
): any;

export function mergeSchemas<
  T extends ZodRawShape,
  U extends ZodRawShape,
  V extends ZodRawShape,
  W extends ZodRawShape,
>(schema1: ZodObject<T>, schema2: ZodObject<U>, schema3: ZodObject<V>, schema4: ZodObject<W>): any;

export function mergeSchemas(...schemas: ZodObject<ZodRawShape>[]): any {
  if (schemas.length < 2) {
    throw new Error("mergeSchemas requires at least 2 schemas");
  }

  return schemas.reduce((acc, schema) => acc.extend(schema.shape));
}

/**
 * Composes multiple schemas by intersecting them
 *
 * Creates a schema that validates against all provided schemas.
 * This is useful when you want to ensure data matches multiple independent schemas.
 *
 * @param schemas - Array of schemas to compose
 * @returns A composed schema
 *
 * @example
 * ```typescript
 * const hasId = z.object({ id: z.string() });
 * const hasName = z.object({ name: z.string() });
 * const hasType = z.object({ type: z.string() });
 *
 * const fullSchema = composeSchemas([hasId, hasName, hasType]);
 * ```
 */
export function composeSchemas(schemas: z.ZodType[]): any {
  if (schemas.length === 0) {
    throw new Error("composeSchemas requires at least 1 schema");
  }

  if (schemas.length === 1) {
    return schemas[0];
  }

  // Use extend for object schemas
  return schemas.reduce((acc: any, schema: any): any => {
    if (acc instanceof z.ZodObject && schema instanceof z.ZodObject) {
      return acc.extend(schema.shape) as any;
    }
    return z.intersection(acc, schema);
  }) as any;
}

/**
 * Makes all fields in a schema optional
 *
 * Creates a new schema where all fields from the original schema
 * are optional. Useful for partial updates or patch operations.
 *
 * @param schema - The schema to make optional
 * @returns A schema with all fields optional
 *
 * @example
 * ```typescript
 * const requiredSchema = createCardSchema({
 *   id: z.string(),
 *   name: z.string(),
 *   type: z.string(),
 * });
 *
 * const optionalSchema = createOptionalSchema(requiredSchema);
 * // Now id, name, and type are all optional
 * ```
 */
export function createOptionalSchema<T extends ZodRawShape>(schema: ZodObject<T>): any {
  return schema.partial();
}

/**
 * Creates a strict schema that doesn't allow extra fields
 *
 * By default, Zod schemas allow extra fields. This function creates
 * a schema that will reject objects with fields not defined in the schema.
 *
 * @param shape - The shape of the schema
 * @returns A strict schema
 *
 * @example
 * ```typescript
 * const schema = createStrictSchema({
 *   id: z.string(),
 *   name: z.string(),
 * });
 *
 * // This will fail because of the extra field
 * schema.parse({ id: "1", name: "Card", extra: "not allowed" });
 * ```
 */
export function createStrictSchema<T extends ZodRawShape>(shape: T): any {
  return z.strictObject(shape);
}

/**
 * Creates a schema for validating arrays of items
 *
 * @param itemSchema - Schema for individual items
 * @param options - Optional constraints (min, max length)
 * @returns A schema for validating arrays
 *
 * @example
 * ```typescript
 * const cardSchema = createCardSchema({
 *   id: z.string(),
 *   name: z.string(),
 * });
 *
 * const deckSchema = createArraySchema(cardSchema, { min: 40, max: 60 });
 * ```
 */
export function createArraySchema<T extends z.ZodType>(
  itemSchema: T,
  options?: { min?: number; max?: number },
): any {
  let arraySchema = z.array(itemSchema);

  if (options?.min !== undefined) {
    arraySchema = arraySchema.min(options.min);
  }

  if (options?.max !== undefined) {
    arraySchema = arraySchema.max(options.max);
  }

  return arraySchema;
}

/**
 * Creates a discriminated union schema
 *
 * Useful for validating objects that have different shapes based on a discriminator field.
 *
 * @param discriminator - The field that determines which schema to use
 * @param schemas - Map of discriminator values to schemas
 * @returns A discriminated union schema
 *
 * @example
 * ```typescript
 * const cardSchema = createDiscriminatedUnion("type", [
 *   z.object({ type: z.literal("creature"), power: z.number() }),
 *   z.object({ type: z.literal("instant"), damage: z.number() }),
 * ]);
 * ```
 */
export function createDiscriminatedUnion<K extends string>(
  discriminator: K,
  schemas: [ZodObject<any>, ZodObject<any>, ...ZodObject<any>[]],
): any {
  return z.discriminatedUnion(discriminator, schemas as any);
}

/**
 * Creates a record schema for dynamic key-value mappings
 *
 * @param keySchema - Schema for the keys
 * @param valueSchema - Schema for the values
 * @returns A record schema
 *
 * @example
 * ```typescript
 * // Map of player IDs to scores
 * const scoresSchema = createRecordSchema(z.string(), z.number());
 * ```
 */
export function createRecordSchema(
  keySchema: z.ZodString | z.ZodNumber,
  valueSchema: z.ZodType,
): any {
  return z.record(keySchema, valueSchema);
}

/**
 * Creates a schema with custom refinements and error messages
 *
 * @param baseSchema - The base schema to refine
 * @param refinement - Refinement function
 * @param message - Error message if refinement fails
 * @returns A refined schema
 *
 * @example
 * ```typescript
 * const powerSchema = z.number();
 * const positivePowerSchema = createRefinedSchema(
 *   powerSchema,
 *   (val) => val > 0,
 *   "Power must be positive"
 * );
 * ```
 */
export function createRefinedSchema<T extends z.ZodTypeAny>(
  baseSchema: T,
  refinement: (val: z.infer<T>) => boolean,
  message: string,
): any {
  return baseSchema.refine(refinement, { error: message });
}

/**
 * Creates a schema with multiple refinements
 *
 * @param baseSchema - The base schema to refine
 * @param refinements - Array of refinements with messages
 * @returns A refined schema
 *
 * @example
 * ```typescript
 * const passwordSchema = createMultiRefinedSchema(z.string(), [
 *   { check: (val) => val.length >= 8, message: "Must be at least 8 characters" },
 *   { check: (val) => /[A-Z]/.test(val), message: "Must contain uppercase" },
 *   { check: (val) => /[0-9]/.test(val), message: "Must contain number" },
 * ]);
 * ```
 */
export function createMultiRefinedSchema<T extends z.ZodTypeAny>(
  baseSchema: T,
  refinements: {
    check: (val: z.infer<T>) => boolean;
    message: string;
  }[],
): any {
  let schema: any = baseSchema;

  for (const { check, message } of refinements) {
    schema = schema.refine(check, { error: message });
  }

  return schema;
}
