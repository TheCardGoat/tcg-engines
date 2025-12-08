/**
 * Parser Types for Lorcana Ability Text Parser
 *
 * Defines the input/output types for the parser system.
 */

import type { Ability } from "@tcg/lorcana";

/**
 * Ability with original text preserved
 *
 * Extends the base Ability type with the original card text
 * and optional name for named abilities.
 */
export interface AbilityWithText {
  ability: Ability;
  /** Original card text for this ability */
  text: string;
  /**
   * Named ability prefix (ALL CAPS text before the effect)
   * e.g., "DARK KNOWLEDGE" from "DARK KNOWLEDGE Whenever this character quests..."
   */
  name?: string;
}

/**
 * Result of parsing a single ability text
 */
export interface ParseResult {
  /** Whether parsing succeeded */
  success: boolean;

  /** Parsed ability (if successful or partially successful) */
  ability?: AbilityWithText;

  /**
   * Non-fatal warnings encountered during parsing
   * e.g., "Unknown keyword", "Unrecognized condition"
   */
  warnings?: string[];

  /**
   * Fatal error message (if success is false)
   */
  error?: string;

  /**
   * Segments of text that could not be parsed
   * Useful for iterative improvement
   */
  unparsedSegments?: string[];
}

/**
 * Result of batch processing multiple ability texts
 */
export interface BatchParseResult {
  /** Total number of texts processed */
  total: number;

  /** Number of successful parses */
  successful: number;

  /** Number of failed parses */
  failed: number;

  /** Individual parse results */
  results: ParseResult[];
}

/**
 * Options for parsing behavior
 */
export interface ParserOptions {
  /**
   * Strict mode - fail on any warning
   * Default: false (lenient mode)
   */
  strict?: boolean;

  /**
   * Resolve {d} placeholders to 0
   * Default: false (preserve placeholders)
   */
  resolveNumbers?: boolean;
}

/**
 * Internal classification result
 * Used by the classifier to determine which parser to use
 */
export interface ClassificationResult {
  /** Classified ability type */
  type:
    | "keyword"
    | "triggered"
    | "activated"
    | "static"
    | "action"
    | "replacement"
    | "unknown";

  /** Confidence score (0-1) */
  confidence: number;

  /** Reasoning for the classification */
  reason?: string;
}
