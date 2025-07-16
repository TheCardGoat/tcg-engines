/**
 * Interfaces for the Conversion Engine component
 */

import type {
  AbilityTarget,
  CardAbility,
  GameEffect,
  GundamCard,
} from "../../cards/definitions/improved-card-types";
import type { ExternalCardData } from "../../cards/import-converter";
import type {
  BatchProcessingOptions,
  CardProcessingContext,
  ConversionResult,
  SetConversionResult,
  ValidationResult,
} from "../shared/types";

// ============================================================================
// CORE CONVERSION ENGINE INTERFACE
// ============================================================================

/**
 * Main interface for card conversion functionality
 */
export interface ConversionEngine {
  /**
   * Converts a single card from import data to typed definition
   */
  convertCard(
    importData: ExternalCardData,
  ): Promise<ConversionResult<GundamCard>>;

  /**
   * Converts a complete card set
   */
  convertSet(setData: ExternalCardData[]): Promise<SetConversionResult>;

  /**
   * Validates converted card against enhanced type system
   */
  validateConversion(card: GundamCard): Promise<ValidationResult>;

  /**
   * Processes multiple sets in batch
   */
  batchProcess(
    importData: Record<string, ExternalCardData[]>,
    options: BatchProcessingOptions,
  ): Promise<ConversionResult<GundamCard>>;
}

// ============================================================================
// FIELD PARSER INTERFACES
// ============================================================================

/**
 * Base interface for all field parsers
 */
export interface FieldParser<T = unknown> {
  /**
   * Parses a field value from import data
   */
  parse(value: unknown, context: CardProcessingContext): ConversionResult<T>;

  /**
   * Validates parsed value
   */
  validate(value: T, context: CardProcessingContext): ValidationResult;

  /**
   * Gets the field name this parser handles
   */
  getFieldName(): string;
}

/**
 * Parser for basic card properties (name, cost, level, etc.)
 */
export interface BasicFieldParser extends FieldParser {
  /**
   * Parses standard card properties with type conversion
   */
  parseBasicFields(
    importData: ExternalCardData,
  ): ConversionResult<Partial<GundamCard>>;

  /**
   * Handles type conversion for numeric fields
   */
  parseNumericField(value: string, fieldName: string): ConversionResult<number>;

  /**
   * Handles enum conversion for categorical fields
   */
  parseEnumField<T extends string>(
    value: string,
    validValues: readonly T[],
    fieldName: string,
  ): ConversionResult<T>;
}

/**
 * Parser for ability text extraction and structuring
 */
export interface AbilityTextParser extends FieldParser<CardAbility[]> {
  /**
   * Extracts structured abilities from HTML effect text
   */
  extractAbilities(effectText: string): ConversionResult<CardAbility[]>;

  /**
   * Decodes HTML entities and normalizes text
   */
  normalizeText(htmlText: string): string;

  /**
   * Identifies timing keywords in effect text
   */
  parseTimingKeywords(text: string): string[];

  /**
   * Extracts ability structures from normalized text
   */
  parseAbilityStructures(text: string): ConversionResult<CardAbility[]>;
}

/**
 * Parser for trait notation (parentheses format)
 */
export interface TraitParser extends FieldParser<string[]> {
  /**
   * Handles parenthetical trait notation
   */
  parseTraits(traitString: string): ConversionResult<string[]>;

  /**
   * Normalizes trait names to standard format
   */
  normalizeTraitName(trait: string): string;

  /**
   * Validates trait against known trait list
   */
  validateTrait(trait: string): boolean;
}

/**
 * Parser for zone combinations (Space/Earth)
 */
export interface ZoneParser extends FieldParser<string[]> {
  /**
   * Handles space/earth zone combinations
   */
  parseZones(zoneString: string): ConversionResult<string[]>;

  /**
   * Validates zone combinations
   */
  validateZoneCombination(zones: string[]): ValidationResult;
}

/**
 * Parser for link requirements (bracket notation)
 */
export interface LinkRequirementParser extends FieldParser<string[]> {
  /**
   * Extracts pilot names from bracket notation
   */
  parseLinkRequirements(linkString: string): ConversionResult<string[]>;

  /**
   * Handles complex link requirements
   */
  parseComplexLinks(linkString: string): ConversionResult<string[]>;

  /**
   * Validates link requirement format
   */
  validateLinkFormat(linkString: string): ValidationResult;
}

// ============================================================================
// ABILITY EXTRACTION INTERFACES
// ============================================================================

/**
 * Interface for coordinating ability extraction
 */
export interface AbilityExtractor {
  /**
   * Coordinates all parsing components to extract abilities
   */
  extractAbilities(
    effectText: string,
    context: CardProcessingContext,
  ): ConversionResult<CardAbility[]>;

  /**
   * Extracts targets with condition parsing
   */
  extractTargets(abilityText: string): ConversionResult<AbilityTarget[]>;

  /**
   * Extracts effect values and applies proper typing
   */
  extractEffectValues(effectText: string): ConversionResult<GameEffect[]>;

  /**
   * Handles special ability patterns
   */
  handleSpecialPatterns(text: string): ConversionResult<CardAbility[]>;
}

/**
 * Interface for target extraction
 */
export interface TargetExtractor {
  /**
   * Extracts target specifications from ability text
   */
  extractTargets(text: string): ConversionResult<AbilityTarget[]>;

  /**
   * Parses target filters and conditions
   */
  parseTargetFilters(text: string): ConversionResult<AbilityTarget["filters"]>;

  /**
   * Validates target specifications
   */
  validateTargets(targets: AbilityTarget[]): ValidationResult;
}

/**
 * Interface for effect extraction
 */
export interface EffectExtractor {
  /**
   * Extracts game effects from ability text
   */
  extractEffects(text: string): ConversionResult<GameEffect[]>;

  /**
   * Parses numerical values and modifiers
   */
  parseEffectValues(text: string): ConversionResult<Record<string, number>>;

  /**
   * Handles conditional effects
   */
  parseConditionalEffects(text: string): ConversionResult<GameEffect[]>;
}

// ============================================================================
// CONVERSION ORCHESTRATION INTERFACES
// ============================================================================

/**
 * Interface for orchestrating the complete conversion process
 */
export interface ConversionOrchestrator {
  /**
   * Coordinates all parsers to create final card objects
   */
  orchestrateConversion(
    importData: ExternalCardData,
  ): Promise<ConversionResult<GundamCard>>;

  /**
   * Tracks conversion results and aggregates errors
   */
  trackConversionResults(
    results: ConversionResult<unknown>[],
  ): ConversionResult<GundamCard>;

  /**
   * Handles conversion errors and recovery
   */
  handleConversionErrors(
    errors: unknown[],
    context: CardProcessingContext,
  ): ConversionResult<GundamCard>;
}

/**
 * Interface for batch processing coordination
 */
export interface BatchProcessor {
  /**
   * Processes multiple card sets efficiently
   */
  processBatch(
    importData: Record<string, ExternalCardData[]>,
    options: BatchProcessingOptions,
  ): Promise<ConversionResult<GundamCard>>;

  /**
   * Handles parallel processing with concurrency control
   */
  processParallel(
    tasks: (() => Promise<ConversionResult<GundamCard>>)[],
    maxConcurrency: number,
  ): Promise<ConversionResult<GundamCard>>;

  /**
   * Reports progress during batch processing
   */
  reportProgress(current: number, total: number, context: string): void;
}

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

/**
 * Configuration for conversion engine
 */
export interface ConversionEngineConfig {
  readonly parsers: {
    readonly enableAbilityExtraction: boolean;
    readonly enableTargetParsing: boolean;
    readonly enableEffectParsing: boolean;
    readonly strictValidation: boolean;
  };
  readonly processing: {
    readonly continueOnError: boolean;
    readonly maxRetries: number;
    readonly timeoutMs: number;
  };
  readonly output: {
    readonly includeDebugInfo: boolean;
    readonly preserveOriginalText: boolean;
    readonly generateComments: boolean;
  };
}

/**
 * Options for ability extraction
 */
export interface AbilityExtractionOptions {
  readonly extractKeywords: boolean;
  readonly extractTiming: boolean;
  readonly extractTargets: boolean;
  readonly extractEffects: boolean;
  readonly handleComplexAbilities: boolean;
  readonly markUnimplemented: boolean;
}

/**
 * Options for field parsing
 */
export interface FieldParsingOptions {
  readonly strictTypeChecking: boolean;
  readonly allowPartialParsing: boolean;
  readonly useDefaultValues: boolean;
  readonly validateEnums: boolean;
  readonly normalizeText: boolean;
}
