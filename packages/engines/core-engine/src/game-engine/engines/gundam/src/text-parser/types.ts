// ResolutionAbility import - to be updated when core types are available
type ResolutionAbility = any; // Placeholder type

/**
 * Represents a parsed clause from Gundam card text
 */
export interface ParsedClause {
  /** The original text of this clause */
  text: string;
  /** The type of clause this represents */
  type: "effect" | "condition" | "timing" | "modal" | "keyword" | "rule";
  /** The effects contained within this clause */
  effects: ParsedEffect[];
  /** Dependencies on other clauses (referenced by their text or index) */
  dependencies?: string[];
  /** Timing type for timing clauses (e.g. "deploy", "burst", "when-paired") */
  timingType?: string;
}

/**
 * Represents a parsed effect from Gundam card text
 */
export interface ParsedEffect {
  /** The type of effect (damage, destroy, repair, etc.) */
  type: string;
  /** The target for this effect, if applicable */
  target?: GundamEffectTarget;
  /** The amount/value for this effect, if applicable */
  amount?: number | DynamicAmount;
  /** The duration for this effect, if applicable */
  duration?: string;
  /** Additional parameters specific to this effect type */
  parameters: Record<string, any>;
}

/**
 * Dynamic amount for variable effects
 */
export interface DynamicAmount {
  /** Whether this is a dynamic amount */
  dynamic: true;
  /** Type of dynamic calculation */
  type: "count" | "variable" | "cost" | "power";
  /** Filters to apply when counting */
  filters?: GundamTargetFilter[];
  /** Variable name (e.g., "X") */
  variable?: string;
}

/**
 * Gundam-specific effect targets
 */
export interface GundamEffectTarget {
  /** Type of target */
  type: "unit" | "player" | "pile" | "zone";
  /** Target value/identifier */
  value: string | number | "self" | "opponent" | "all";
  /** Filters to apply to the target */
  filters: GundamTargetFilter[];
  /** Zone where the target resides */
  zone?: "battlefield" | "hand" | "deck" | "discard" | "g_zone";
  /** Whether this targets multiple objects */
  isMultiple?: boolean;
}

/**
 * Filter for targeting in Gundam
 */
export interface GundamTargetFilter {
  /** Type of filter */
  filter:
    | "owner"
    | "type"
    | "cost"
    | "power"
    | "name"
    | "keyword"
    | "color"
    | "level";
  /** Value to filter by */
  value: string | number | string[];
  /** Comparison operator for numeric filters */
  operator?: "eq" | "gt" | "gte" | "lt" | "lte" | "ne";
}

/**
 * Pattern for matching effect text
 */
export interface EffectPattern {
  /** The regular expression pattern to match against text */
  pattern: RegExp;
  /** The type of effect this pattern generates */
  type: string;
  /** Function to extract effect data from regex match results */
  extractor: (match: RegExpMatchArray) => ParsedEffect;
  /** Priority for pattern matching (higher = checked first) */
  priority?: number;
}

/**
 * Configuration for the Gundam parser
 */
export interface GundamParserConfig {
  /** Whether to enable debug logging */
  debug?: boolean;
  /** Whether to throw errors on unknown patterns or continue parsing */
  strictMode?: boolean;
  /** Custom patterns to add to the parser */
  customPatterns?: Record<string, EffectPattern[]>;
  /** Whether to handle keyword effects */
  handleKeywords?: boolean;
}

/**
 * Configuration for text normalization
 */
export interface NormalizationConfig {
  /** Whether to preserve original spacing patterns */
  preserveSpacing?: boolean;
  /** Whether to normalize case to lowercase */
  normalizeCase?: boolean;
  /** Whether to handle special game symbols like <Repair> */
  handleKeywords?: boolean;
}

/**
 * Result of parsing Gundam card text
 */
export interface GundamParseResult {
  /** The generated abilities */
  abilities: ResolutionAbility[];
  /** Any warnings generated during parsing */
  warnings: string[];
  /** Any errors encountered during parsing */
  errors: string[];
  /** The parsed clauses for debugging */
  clauses: ParsedClause[];
}

/**
 * Keyword effects in Gundam
 */
export type GundamKeyword =
  | "Repair"
  | "Breach"
  | "Support"
  | "Blocker"
  | "Rush"
  | "Pierce"
  | "Intercept"
  | "Stealth";

/**
 * Keyword effect with parameters
 */
export interface KeywordEffect {
  /** The keyword name */
  keyword: GundamKeyword;
  /** Optional value/amount for the keyword */
  value?: number;
  /** Optional conditions for the keyword */
  conditions?: string[];
}
