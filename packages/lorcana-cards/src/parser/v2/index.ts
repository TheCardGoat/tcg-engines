/**
 * Main entry point for the v2 Lorcana parser.
 * Provides a high-level API for parsing ability text into typed Ability objects.
 */

import { parseAtomicEffect } from "./effects/atomic";
import { parseCompositeEffect } from "./effects/composite";
import { LorcanaAbilityParser } from "./grammar";
import { LorcanaLexer } from "./lexer";
import { logger } from "./logging";
import { parseTrigger } from "./trigger-parser";
import type { Ability, Effect } from "./types";
import { AbilityVisitor } from "./visitors";

export class LorcanaParserV2 {
  private lexer = LorcanaLexer;
  private parser = new LorcanaAbilityParser();
  private visitor = new AbilityVisitor();

  /**
   * Parse ability text into typed Ability objects.
   * Uses a hybrid approach:
   * 1. Try Chevrotain grammar-based parsing first
   * 2. Fall back to text-based (regex) parsers if grammar fails
   * Returns null if parsing fails completely.
   */
  parseAbility(text: string): Ability | null {
    logger.info("Parsing ability", { text });

    if (!text || text.trim().length === 0) {
      return null;
    }

    const trimmedText = text.trim();

    // Try grammar-based parsing first
    const grammarResult = this.tryGrammarParsing(trimmedText);
    if (grammarResult) {
      return grammarResult;
    }

    // Fall back to text-based parsing
    const textResult = this.tryTextBasedParsing(trimmedText);
    if (textResult) {
      return textResult;
    }

    logger.debug("All parsing methods failed", { text });
    return null;
  }

  /**
   * Try parsing with Chevrotain grammar.
   */
  private tryGrammarParsing(text: string): Ability | null {
    try {
      // Lexing
      const lexResult = this.lexer.tokenize(text);
      if (lexResult.errors.length > 0) {
        logger.debug("Lexing failed, trying text-based parsing", {
          text,
          errors: lexResult.errors,
        });
        return null;
      }

      // Parsing
      this.parser.input = lexResult.tokens;
      const cst = this.parser.ability();
      if (this.parser.errors.length > 0) {
        logger.debug("Grammar parsing failed, trying text-based parsing", {
          text,
          errors: this.parser.errors,
        });
        return null;
      }

      // Visiting
      const ability = this.visitor.visit(cst) as Ability;
      logger.info("Successfully parsed ability via grammar", { ability });
      return ability;
    } catch (error) {
      logger.debug("Grammar parsing threw error, trying text-based parsing", {
        text,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Try parsing with text-based (regex) parsers.
   * These are more flexible and cover many common patterns.
   */
  private tryTextBasedParsing(text: string): Ability | null {
    // Check if this is a triggered ability and extract effect text
    const effectText = this.extractEffectTextFromTrigger(text);

    // Try composite effect parsing (sequences, choices, conditionals, etc.)
    const compositeEffect = parseCompositeEffect(effectText);
    if (compositeEffect) {
      logger.info("Parsed ability via composite effect parser", {
        effect: compositeEffect,
      });
      return this.wrapEffectAsAbility(compositeEffect, text);
    }

    // Try atomic effect parsing (draw, damage, lore, etc.)
    const atomicEffect = parseAtomicEffect(effectText);
    if (atomicEffect) {
      logger.info("Parsed ability via atomic effect parser", {
        effect: atomicEffect,
      });
      return this.wrapEffectAsAbility(atomicEffect, text);
    }

    return null;
  }

  /**
   * Extract effect text from a triggered ability.
   * For example: "Whenever you play a card, draw a card" → "draw a card"
   * Also handles named abilities: "NAME Whenever you play a card, draw a card" → "draw a card"
   */
  private extractEffectTextFromTrigger(text: string): string {
    // Try direct trigger pattern first (no name prefix)
    // Pattern: (When|Whenever|At ...), effect
    const triggerMatch = text.match(
      /^(?:(When|Whenever|At the (?:start|end) of|The first time) .+?|Once per turn, (?:when|whenever) .+?|During your turn, (?:when|whenever) .+?),\s*(.+)$/is,
    );
    if (triggerMatch) {
      return triggerMatch[2];
    }

    // Try to match named ability pattern
    // Pattern: NAME[space]+TRIGGER[phrase]+,[space]+effect
    // Where NAME is all caps until we hit a trigger word
    const namedAbilityMatch = text.match(
      /^[A-Z][A-Z\s]*(?:\s+[A-Z][A-Z\s]*)*\s+(?:(When|Whenever|At the (?:start|end) of|The first time) .+?|Once per turn, (?:when|whenever) .+?|During your turn, (?:when|whenever) .+?),\s*(.+)$/is,
    );
    if (namedAbilityMatch) {
      return namedAbilityMatch[3];
    }

    // If no match, return original text (not a triggered ability)
    return text;
  }

  /**
   * Wrap a parsed effect as an Ability object.
   * Extracts trigger information for triggered abilities.
   * Note: Uses type assertions because the parser produces intermediate
   * representations that don't fully match the strict Ability types from
   * @tcg/lorcana-types. These will be further processed by consuming code.
   */
  private wrapEffectAsAbility(effect: Effect, originalText: string): Ability {
    // Check for triggered abilities first (when/whenever/at)
    if (
      originalText.toLowerCase().startsWith("when ") ||
      originalText.toLowerCase().startsWith("whenever ") ||
      originalText.toLowerCase().startsWith("at the start of ") ||
      originalText.toLowerCase().startsWith("at the end of ") ||
      originalText.toLowerCase().startsWith("the first time ") ||
      /^Once per turn,\s+(?:when|whenever)\s+/i.test(originalText) ||
      /^During your turn,\s+(?:when|whenever)\s+/i.test(originalText)
    ) {
      // Try to parse trigger metadata
      const trigger = parseTrigger(originalText);

      if (trigger) {
        // Successfully parsed trigger - create proper triggered ability
        return {
          type: "triggered",
          trigger,
          effect,
        } as unknown as Ability;
      }

      // Failed to parse trigger - fall back to basic triggered ability
      // This maintains backward compatibility while we improve trigger parsing
      logger.debug("Failed to parse trigger metadata", { text: originalText });
      return {
        type: "triggered",
        effect,
      } as unknown as Ability;
    }

    // Detect activated abilities by cost separator patterns
    // - Em dash "—" is the primary indicator (e.g., "⟳ — Draw a card")
    // - Hyphen "-" only counts when preceded by cost symbol "⟳" (not for negative numbers)
    const hasEmDash = originalText.includes("—");
    const hasCostSeparator = originalText.includes("⟳ -");
    if (originalText.includes("⟳") || hasEmDash || hasCostSeparator) {
      return {
        type: "activated",
        effect,
      } as unknown as Ability;
    }

    if (
      originalText.toLowerCase().startsWith("while ") ||
      /your\s+characters?\s+.*?get/i.test(originalText)
    ) {
      return {
        type: "static",
        effect,
      } as unknown as Ability;
    }

    // Default to action ability
    return {
      type: "action",
      effect,
    } as unknown as Ability;
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
