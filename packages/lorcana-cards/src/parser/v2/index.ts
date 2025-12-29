/**
 * Main entry point for the v2 Lorcana parser.
 * Provides a high-level API for parsing ability text into typed Ability objects.
 */

import { LorcanaAbilityParser } from "./grammar";
import { LorcanaLexer } from "./lexer";
import { logger } from "./logging";
import type { Ability } from "./types";
import { AbilityVisitor } from "./visitors";

export class LorcanaParserV2 {
  private lexer = LorcanaLexer;
  private parser = new LorcanaAbilityParser();
  private visitor = new AbilityVisitor();

  /**
   * Parse ability text into typed Ability objects.
   * Returns null if parsing fails.
   */
  parseAbility(text: string): Ability | null {
    logger.info("Parsing ability", { text });

    try {
      // Lexing
      const lexResult = this.lexer.tokenize(text);
      if (lexResult.errors.length > 0) {
        logger.error("Lexing failed", {
          text,
          errors: lexResult.errors,
        });
        return null;
      }

      // Parsing
      this.parser.input = lexResult.tokens;
      const cst = this.parser.ability();
      if (this.parser.errors.length > 0) {
        logger.error("Parsing failed", {
          text,
          errors: this.parser.errors,
        });
        return null;
      }

      // Visiting
      const ability = this.visitor.visit(cst) as Ability;
      logger.info("Successfully parsed ability", { ability });
      return ability;
    } catch (error) {
      logger.error("Unexpected error during parsing", {
        text,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Enable debug logging for troubleshooting.
   */
  enableDebugLogging(): void {
    logger.setLevel("debug");
  }

  /**
   * Disable debug logging.
   */
  disableDebugLogging(): void {
    logger.setLevel("info");
  }
}

export const parserV2 = new LorcanaParserV2();

export { logger } from "./logging";
// Re-export types and utilities
export type { Ability, Effect } from "./types";
