/**
 * Abstract base class for card text parsers
 *
 * Provides infrastructure for parsing card data from various formats
 * (text, HTML, JSON) into structured card definitions.
 *
 * Game engines should extend this class to implement game-specific parsing logic.
 *
 * @example
 * ```typescript
 * class GundamTextParser extends CardParser<string, GundamCard> {
 *   protected doParse(text: string): ParserResult<GundamCard> {
 *     // Game-specific parsing logic
 *     return { success: true, data: parsedCard, warnings: [] };
 *   }
 * }
 * ```
 */

import type { ParserResult } from "./types";

/**
 * Abstract card parser
 *
 * @template TInput - Input format (e.g., string, object, HTML)
 * @template TOutput - Output card type
 */
export abstract class CardParser<TInput, TOutput> {
  /**
   * Parse a single input into a card
   *
   * @param input - Input data to parse
   * @returns Parser result with card data or errors
   */
  public parse(input: TInput): ParserResult<TOutput> {
    try {
      return this.doParse(input);
    } catch (error) {
      return {
        success: false,
        errors: [
          error instanceof Error
            ? error.message
            : "Unknown parsing error occurred",
        ],
      };
    }
  }

  /**
   * Parse multiple inputs in batch
   *
   * @param inputs - Array of inputs to parse
   * @returns Array of parser results
   */
  public parseBatch(inputs: TInput[]): ParserResult<TOutput>[] {
    return inputs.map((input) => this.parse(input));
  }

  /**
   * Parse and filter only successful results
   *
   * @param inputs - Array of inputs to parse
   * @returns Array of successfully parsed cards
   */
  public parseSuccessful(inputs: TInput[]): TOutput[] {
    const results = this.parseBatch(inputs);
    return results
      .filter(
        (result): result is Extract<ParserResult<TOutput>, { success: true }> =>
          result.success,
      )
      .map((result) => result.data);
  }

  /**
   * Actual parsing implementation (to be overridden by subclasses)
   *
   * @param input - Input data to parse
   * @returns Parser result
   */
  protected abstract doParse(input: TInput): ParserResult<TOutput>;
}
