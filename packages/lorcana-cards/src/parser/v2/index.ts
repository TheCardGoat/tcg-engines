/**
 * Main entry point for the v2 Lorcana parser.
 * Provides a high-level API for parsing ability text into typed Ability objects.
 */

import { parseAtomicEffect } from "./effects/atomic";
import { parseCompositeEffect } from "./effects/composite";
import { LorcanaAbilityParser } from "./grammar";
import { parseKeywordAbility } from "./keyword-ability-parser";
import { LorcanaLexer } from "./lexer";
import { logger } from "./logging";
import { MANUAL_ENTRIES } from "./manual-overrides";
import { parseTrigger } from "./trigger-parser";
import type { Ability, Effect } from "./types";
import { AbilityVisitor } from "./visitors";

interface ParseAbilityOptions {
  cardName?: string;
}

export class LorcanaParserV2 {
  private lexer = LorcanaLexer;
  private parser = new LorcanaAbilityParser();
  private visitor = new AbilityVisitor();

  /**
   * Parse ability text into typed Ability objects.
   * Uses a hybrid approach:
   * 1. Check manual overrides first (if text is in MANUAL_ENTRIES)
   * 2. Check for keyword abilities (standalone keywords like "Rush", "Ward")
   * 3. Try Chevrotain grammar-based parsing
   * 4. Fall back to text-based (regex) parsers if grammar fails
   * Returns null if parsing fails completely.
   */
  parseAbility(text: string, options?: ParseAbilityOptions): Ability | null {
    logger.info("Parsing ability", { text });

    if (!text || text.trim().length === 0) {
      return null;
    }

    const trimmedText = text.trim();

    // Check manual overrides first
    if (trimmedText in MANUAL_ENTRIES) {
      logger.info("Using manual override entry", { text: trimmedText });
      const entry = MANUAL_ENTRIES[trimmedText];
      // Handle both single entries and arrays of entries
      const abilityEntry = Array.isArray(entry) ? entry[0] : entry;
      return abilityEntry.ability as unknown as Ability;
    }

    // Try keyword abilities (standalone keywords like "Rush", "Ward", "Evasive")
    const keywordAbility = parseKeywordAbility(trimmedText);
    if (keywordAbility) {
      logger.info("Parsed keyword ability", {
        keyword: keywordAbility.keyword,
      });
      return keywordAbility as unknown as Ability;
    }

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
          errors: lexResult.errors,
          text,
        });
        return null;
      }

      // Parsing
      this.parser.input = lexResult.tokens;
      const cst = this.parser.ability();
      if (this.parser.errors.length > 0) {
        logger.debug("Grammar parsing failed, trying text-based parsing", {
          errors: this.parser.errors,
          text,
        });
        return null;
      }

      // Visiting
      const ability = this.visitor.visit(cst) as Ability;
      logger.info("Successfully parsed ability via grammar", { ability });
      return ability;
    } catch (error) {
      logger.debug("Grammar parsing threw error, trying text-based parsing", {
        error: error instanceof Error ? error.message : String(error),
        text,
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
      // The effect text is the last capture group (could be index 2 or 3 depending on which alternative matched)
      // NamedAbilityMatch[2] is the effect when the first alternative matches
      // NamedAbilityMatch[3] would be the effect for other alternatives
      return namedAbilityMatch[2] || "";
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
    // Extract ability name if present (e.g., "NAME Whenever X, do Y")
    // Allow common punctuation in names like "IT WORKS!", "FINE PRINT"
    // Also handle restriction prefixes: "NAME Once per turn, when X, do Y"

    // Try triggered ability name pattern first (with "When|Whenever")
    let nameMatch = originalText.match(
      /^([A-Z][A-Z\s!?'-]+)\s+(?:Once per turn,\s*)?(?:During your turn,\s*)?(When|Whenever)/i,
    );
    let name = nameMatch ? nameMatch[1].trim() : undefined;

    // Try static ability name pattern (with "This character/item can't/cannot/enters")
    if (!name) {
      nameMatch = originalText.match(
        /^([A-Z][A-Z\s!?'-]+)\s+(?:This character|This item)\s+(?:can'?t|cannot|enters)/i,
      );
      name = nameMatch ? nameMatch[1].trim() : undefined;
    }

    // Try location/static effect name pattern (with "Characters gain/get while here")
    if (!name) {
      nameMatch = originalText.match(/^([A-Z][A-Z\s!?'-]+)\s+Characters\s+(?:gain|get)/i);
      // Exclude common words that are not ability names
      const invalidNames = ["Your", "Their", "Opponent's", "All"];
      const extractedName = nameMatch ? nameMatch[1].trim() : undefined;
      if (extractedName && !invalidNames.includes(extractedName)) {
        name = extractedName;
      }
    }

    // Try special ability grant name pattern (with "This character can challenge")
    if (!name) {
      nameMatch = originalText.match(/^([A-Z][A-Z\s!?'-]+)\s+This character\s+can challenge/i);
      name = nameMatch ? nameMatch[1].trim() : undefined;
    }

    // Check for triggered abilities first (when/whenever/at)
    const isTriggered =
      originalText.toLowerCase().startsWith("when ") ||
      originalText.toLowerCase().startsWith("whenever ") ||
      originalText.toLowerCase().startsWith("at the start of ") ||
      originalText.toLowerCase().startsWith("at the end of ") ||
      originalText.toLowerCase().startsWith("the first time ") ||
      /^Once per turn,\s+(?:when|whenever)\s+/i.test(originalText) ||
      /^During your turn,\s+(?:when|whenever)\s+/i.test(originalText) ||
      // Named abilities: "NAME Whenever X, do Y"
      // Named abilities with restriction: "NAME Once per turn, when X, do Y"
      (name &&
        (/^(When|Whenever)/i.test(originalText.substring(name.length).trim()) ||
          /^Once per turn,\s+(?:when|whenever)/i.test(originalText.substring(name.length).trim()) ||
          /^During your turn,\s+(?:when|whenever)/i.test(
            originalText.substring(name.length).trim(),
          )));

    if (isTriggered) {
      // Try to parse trigger metadata
      const trigger = parseTrigger(originalText);

      if (trigger) {
        // Successfully parsed trigger - create proper triggered ability
        return {
          effect,
          name,
          trigger,
          type: "triggered",
        } as unknown as Ability;
      }

      // Failed to parse trigger - create triggered ability with a valid default trigger
      // Use a generic "when you play this" trigger as a placeholder
      logger.debug("Failed to parse trigger metadata", { text: originalText });
      return {
        effect,
        name,
        trigger: {
          event: "play",
          on: "SELF",
          timing: "when",
        },
        type: "triggered",
      } as unknown as Ability;
    }

    // Detect activated abilities by cost separator patterns
    // - Em dash "—" is the primary indicator (e.g., "Draw a card — Gain 1 lore")
    // - Cost symbol followed by separator: "⟳ —" or "⟳ -" (not negative numbers in effects)
    const hasEmDashSeparator = /—/.test(originalText);
    const hasCostWithSeparator = /⟳\s+[—-]/.test(originalText);
    // Also check for standalone cost symbol at start (edge case for unusual formatting)
    const hasStandaloneCost = /^\s*⟳\s+/i.test(originalText);

    if (hasEmDashSeparator || hasCostWithSeparator || hasStandaloneCost) {
      return {
        cost: { exert: true },
        effect,
        type: "activated",
      } as unknown as Ability;
    }

    // Check for static abilities (these typically don't have a specific trigger)
    // Static ability patterns:
    // - "Your characters gain/get..." (global buffs)
    // - "Each player/opponent can't/cannot..." (global restrictions)
    // - "This character can't..." (restrictions without "while" condition)
    // - "This character can challenge..." (special ability grants)
    // - "enters play exerted" (enters effects)
    //
    // Note: "Each player/opponent" followed by action verbs (draw, discard, lose, gain) are
    // Action abilities, not static abilities. They are one-time effects when played.
    const isStatic =
      /^(?:While |Your characters |Your items |This character can'?t |This character cannot |This item can'?t |This item cannot |[A-Z][A-Z\s!?'-]+\s+(?:This character|This item|This character can'?t|This item can'?t|This character cannot|This item cannot))|(?:enters? play exerted)/i.test(
        originalText,
      ) ||
      /(?:Each player|Each opponent)\s+(?:can'?t|cannot|can)\s+/i.test(originalText) ||
      /characters?\s+(?:gain|get)\s+/i.test(originalText) ||
      /items?\s+(?:gain|get)\s+/i.test(originalText) ||
      /This character can challenge ready characters/i.test(originalText);

    if (isStatic) {
      const staticAbility: Record<string, unknown> = {
        effect,
        type: "static",
      };
      if (name) {
        staticAbility.name = name;
      }
      return staticAbility as unknown as Ability;
    }

    // Default to action ability
    return {
      effect,
      type: "action",
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
export type { MultiParseResult } from "./parser";
export { parseAbilityText, parseAbilityTextMulti, parseAbilityTexts } from "./parser";
// Re-export types and utilities
export type { Ability, AbilityWithText, Effect, ParseResult } from "./types";
