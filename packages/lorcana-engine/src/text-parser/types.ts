// Type definitions for the Action Text Parser

import type { ResolutionAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { DynamicAmount } from "@lorcanito/lorcana-engine/abilities/amounts";
import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { Effect } from "@lorcanito/lorcana-engine/effects/effectTypes";

/**
 * Represents a parsed clause from card text
 * Each clause can contain one or more effects and may have dependencies on other clauses
 */
export interface ParsedClause {
  /** The original text of this clause */
  text: string;
  /** The type of clause this represents */
  type: "effect" | "condition" | "timing" | "modal";
  /** The effects contained within this clause */
  effects: ParsedEffect[];
  /** Dependencies on other clauses (referenced by their text or index) */
  dependencies?: string[];
}

/**
 * Represents a parsed effect extracted from card text
 * Contains all the information needed to generate the corresponding Effect object
 */
export interface ParsedEffect {
  /** The type of effect (matches Effect type from the engine) */
  type: string;
  /** The target for this effect, if applicable */
  target?: EffectTargets;
  /** The amount/value for this effect, if applicable */
  amount?: number | DynamicAmount;
  /** The duration for this effect, if applicable */
  duration?: string;
  /** Additional parameters specific to this effect type */
  parameters: Record<string, any>;
}

/**
 * Represents a pattern used to match and extract effects from text
 * Contains the regex pattern and a function to extract the effect data
 */
export interface EffectPattern {
  /** The regular expression pattern to match against text */
  pattern: RegExp;
  /** The type of effect this pattern generates */
  type: string;
  /** Function to extract effect data from regex match results */
  extractor: (match: RegExpMatchArray) => ParsedEffect;
}

/**
 * Configuration options for the text parser
 */
export interface ParserConfig {
  /** Whether to enable debug logging */
  debug?: boolean;
  /** Whether to throw errors on unknown patterns or continue parsing */
  strictMode?: boolean;
  /** Custom patterns to add to the parser */
  customPatterns?: Record<string, EffectPattern[]>;
}

/**
 * Configuration options for text normalization
 */
export interface NormalizationConfig {
  /** Whether to preserve original spacing patterns */
  preserveSpacing?: boolean;
  /** Whether to normalize case to lowercase */
  normalizeCase?: boolean;
  /** Whether to handle special game symbols */
  handleGameSymbols?: boolean;
}

/**
 * Result of parsing card text
 */
export interface ParseResult {
  /** The generated abilities */
  abilities: ResolutionAbility[];
  /** Any warnings generated during parsing */
  warnings: string[];
  /** Any errors encountered during parsing */
  errors: string[];
  /** The parsed clauses for debugging */
  clauses: ParsedClause[];
}
