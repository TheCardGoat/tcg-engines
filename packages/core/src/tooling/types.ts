/**
 * Core types for card tooling infrastructure
 *
 * These types provide the foundation for card parsing, validation,
 * and generation across all TCG engines.
 */

/**
 * Result of parsing card data
 *
 * Generic over the output type to support different card formats
 */
export type ParserResult<T> =
  | {
      success: true;
      data: T;
      warnings: string[];
    }
  | {
      success: false;
      errors: string[];
    };

/**
 * Result of validating a card
 *
 * Includes both errors (invalid) and warnings (valid but concerning)
 */
export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Options for card generator
 *
 * Controls output behavior for code generation
 */
export type GeneratorOptions = {
  /** Directory to output generated files */
  outputDir: string;
  /** Whether to format output with Biome */
  format?: boolean;
  /** Whether to overwrite existing files */
  overwrite?: boolean;
  /** Whether to run in dry-run mode (no file writes) */
  dryRun?: boolean;
};

/**
 * Result of generating a single file
 */
export type GeneratedFile = {
  fileName: string;
  content: string;
};
