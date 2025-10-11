/**
 * Gundam Text Parser - extends core CardParser infrastructure
 *
 * Parses Gundam card text into structured ability definitions.
 * This class extends the core CardParser to provide Gundam-specific
 * parsing logic while integrating with the core tooling infrastructure.
 */

// TODO: Implement @tcg/core/tooling module
// import type { ParserResult } from "@tcg/core/tooling";
// import { CardParser } from "@tcg/core/tooling";
import {
  analyzeTextStructure,
  cleanCardText,
  parseGundamText as parseGundamTextLegacy,
} from "./parser";
import type { GundamParseResult, GundamParserConfig } from "./types";

/**
 * Parser result type (temporary until @tcg/core/tooling is implemented)
 */
type ParserResult<T> =
  | {
      success: true;
      data: T;
      warnings?: string[];
    }
  | {
      success: false;
      errors: string[];
    };

/**
 * Gundam text parser that provides Gundam-specific parsing
 *
 * This parser transforms Gundam card text into structured ability definitions.
 * TODO: Extend core CardParser when @tcg/core/tooling is implemented
 */
export class GundamTextParser {
  private readonly config: GundamParserConfig;

  /**
   * Create a new Gundam text parser
   *
   * @param config - Optional parser configuration
   */
  constructor(config: GundamParserConfig = {}) {
    this.config = config;
  }

  /**
   * Parse Gundam card text into structured abilities
   *
   * @param input - Card text to parse
   * @returns Parser result with abilities or errors
   */
  public parse(input: string): ParserResult<GundamParseResult> {
    const result = parseGundamTextLegacy(input, this.config);

    // Convert GundamParseResult to ParserResult format
    if (result.errors.length > 0) {
      return {
        success: false,
        errors: result.errors,
      };
    }

    return {
      success: true,
      data: result,
      warnings: result.warnings,
    };
  }

  /**
   * Parse multiple card texts in batch
   *
   * @param inputs - Array of card texts to parse
   * @returns Array of parser results
   */
  public parseBatch(inputs: string[]): ParserResult<GundamParseResult>[] {
    return inputs.map((input) => this.parse(input));
  }

  /**
   * Parse multiple texts and return only successful results
   *
   * @param inputs - Array of card texts to parse
   * @returns Array of successful parse results
   */
  public parseSuccessful(inputs: string[]): GundamParseResult[] {
    const results = this.parseBatch(inputs);
    return results
      .filter((r): r is Extract<typeof r, { success: true }> => r.success)
      .map((r) => r.data);
  }

  /**
   * Analyze card text structure without generating abilities
   *
   * Useful for understanding text complexity and patterns.
   *
   * @param text - Card text to analyze
   * @returns Text structure analysis
   */
  public analyzeText(text: string) {
    const cleanedText = cleanCardText(text);
    return analyzeTextStructure(cleanedText);
  }

  /**
   * Clean and normalize card text
   *
   * @param text - Raw card text
   * @returns Cleaned text
   */
  public cleanText(text: string): string {
    return cleanCardText(text);
  }
}

/**
 * Create a new Gundam text parser instance
 *
 * @param config - Optional parser configuration
 * @returns Parser instance
 */
export function createGundamTextParser(
  config: GundamParserConfig = {},
): GundamTextParser {
  return new GundamTextParser(config);
}
