/**
 * Validator builder for creating fluent validation rules
 *
 * Provides a chainable API for building complex validation logic
 * without external dependencies like Zod, useful for runtime validation.
 */

/**
 * Validation rule function type
 */
type ValidationRule<T> = (value: T) => boolean;

/**
 * Validation error with field and message
 */
interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result - success with data or failure with errors
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

/**
 * Validator function type
 */
export interface Validator<T> {
  validate: (data: T) => ValidationResult<T>;
}

/**
 * Options for validator builder
 */
interface ValidatorBuilderOptions {
  /**
   * If true, stops validation at the first error
   * If false, collects all errors
   */
  abortEarly?: boolean;
}

/**
 * Internal validation rule with metadata
 */
interface ValidationRuleWithMetadata<T> {
  field: keyof T;
  rule: ValidationRule<unknown>;
  message: string;
}

/**
 * ValidatorBuilder provides a fluent API for building validation rules
 *
 * @template T - The type of object to validate
 *
 * @example
 * ```typescript
 * const validator = new ValidatorBuilder<{ name: string; power: number }>()
 *   .required("name", "Name is required")
 *   .type("name", "string", "Name must be a string")
 *   .min("name", 1, "Name must not be empty")
 *   .required("power", "Power is required")
 *   .type("power", "number", "Power must be a number")
 *   .min("power", 0, "Power must be non-negative")
 *   .build();
 *
 * const result = validator.validate({ name: "Dragon", power: 5 });
 * if (result.success) {
 *   console.log("Valid:", result.data);
 * } else {
 *   console.error("Errors:", result.errors);
 * }
 * ```
 */
export class ValidatorBuilder<T extends Record<string, unknown>> {
  private rules: ValidationRuleWithMetadata<T>[] = [];
  private options: ValidatorBuilderOptions;

  constructor(options: ValidatorBuilderOptions = {}) {
    this.options = {
      abortEarly: false,
      ...options,
    };
  }

  /**
   * Validates that a field is required (not empty/null/undefined)
   *
   * @param field - The field to validate
   * @param message - Error message if validation fails
   * @returns This builder instance for chaining
   */
  required<K extends keyof T>(field: K, message: string): this {
    this.rules.push({
      field,
      rule: (value: unknown) => {
        if (typeof value === "string") {
          return value.trim().length > 0;
        }
        if (typeof value === "number") {
          return true; // Numbers are always considered "present"
        }
        return value !== null && value !== undefined;
      },
      message,
    });
    return this;
  }

  /**
   * Validates that a field is of a specific type
   *
   * @param field - The field to validate
   * @param expectedType - The expected type ("string", "number", "boolean", "object")
   * @param message - Error message if validation fails
   * @returns This builder instance for chaining
   */
  type<K extends keyof T>(
    field: K,
    expectedType: "string" | "number" | "boolean" | "object",
    message: string,
  ): this {
    this.rules.push({
      field,
      rule: (value: unknown) => typeof value === expectedType,
      message,
    });
    return this;
  }

  /**
   * Validates that a numeric field or string length is at least a minimum value
   *
   * @param field - The field to validate
   * @param minValue - The minimum value (for numbers) or length (for strings)
   * @param message - Error message if validation fails
   * @returns This builder instance for chaining
   */
  min<K extends keyof T>(field: K, minValue: number, message: string): this {
    this.rules.push({
      field,
      rule: (value: unknown) => {
        if (typeof value === "number") {
          return value >= minValue;
        }
        if (typeof value === "string") {
          return value.length >= minValue;
        }
        return false;
      },
      message,
    });
    return this;
  }

  /**
   * Validates that a numeric field or string length is at most a maximum value
   *
   * @param field - The field to validate
   * @param maxValue - The maximum value (for numbers) or length (for strings)
   * @param message - Error message if validation fails
   * @returns This builder instance for chaining
   */
  max<K extends keyof T>(field: K, maxValue: number, message: string): this {
    this.rules.push({
      field,
      rule: (value: unknown) => {
        if (typeof value === "number") {
          return value <= maxValue;
        }
        if (typeof value === "string") {
          return value.length <= maxValue;
        }
        return false;
      },
      message,
    });
    return this;
  }

  /**
   * Adds a custom validation rule
   *
   * @param field - The field to validate
   * @param rule - Custom validation function that returns true if valid
   * @param message - Error message if validation fails
   * @returns This builder instance for chaining
   */
  custom<K extends keyof T>(
    field: K,
    rule: (value: T[K]) => boolean,
    message: string,
  ): this {
    this.rules.push({
      field,
      rule: rule as ValidationRule<unknown>,
      message,
    });
    return this;
  }

  /**
   * Builds the validator from the accumulated rules
   *
   * @returns A validator object with a validate method
   */
  build(): Validator<T> {
    const rules = [...this.rules];
    const abortEarly = this.options.abortEarly;

    return {
      validate: (data: T): ValidationResult<T> => {
        const errors: string[] = [];

        for (const rule of rules) {
          const fieldValue = data[rule.field];
          const isValid = rule.rule(fieldValue);

          if (!isValid) {
            errors.push(rule.message);

            if (abortEarly) {
              return {
                success: false,
                errors,
              };
            }
          }
        }

        if (errors.length > 0) {
          return {
            success: false,
            errors,
          };
        }

        return {
          success: true,
          data,
        };
      },
    };
  }
}

/**
 * Helper function to create a validator with a more functional style
 *
 * @template T - The type of object to validate
 * @param builderFn - Function that receives a builder and returns it with rules applied
 * @returns A validator object
 *
 * @example
 * ```typescript
 * const validator = createValidator<{ name: string; power: number }>(builder =>
 *   builder
 *     .required("name", "Name is required")
 *     .min("power", 0, "Power must be non-negative")
 * );
 * ```
 */
export function createValidator<T extends Record<string, unknown>>(
  builderFn: (builder: ValidatorBuilder<T>) => ValidatorBuilder<T>,
  options?: ValidatorBuilderOptions,
): Validator<T> {
  const builder = new ValidatorBuilder<T>(options);
  return builderFn(builder).build();
}
