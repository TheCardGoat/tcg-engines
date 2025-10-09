/**
 * Gundam Text Parser - extends core CardParser infrastructure
 *
 * Parses Gundam card text into structured ability definitions.
 * This class extends the core CardParser to provide Gundam-specific
 * parsing logic while integrating with the core tooling infrastructure.
 */

import type { ParserResult } from "@tcg/core/tooling";
import { CardParser } from "@tcg/core/tooling";
import {
  analyzeTextStructure,
  cleanCardText,
  parseGundamText as parseGundamTextLegacy,
} from "./parser";
import type { GundamParseResult, GundamParserConfig } from "./types";

/**
 * Gundam text parser that extends core CardParser infrastructure
 *
 * This parser transforms Gundam card text into structured ability definitions
 * using the core CardParser base class for consistency across engines.
 */
export class GundamTextParser extends CardParser<string, GundamParseResult> {
  private readonly config: GundamParserConfig;

  /**
   * Create a new Gundam text parser
   *
   * @param config - Optional parser configuration
   */
  constructor(config: GundamParserConfig = {}) {
    super();
    this.config = config;
  }

  /**
   * Parse Gundam card text into structured abilities
   *
   * @param input - Card text to parse
   * @returns Parser result with abilities or errors
   */
  protected doParse(input: string): ParserResult<GundamParseResult> {
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
