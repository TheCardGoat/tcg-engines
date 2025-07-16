/**
 * Shared types and interfaces for the Gundam Card Converter system
 */

import type { GundamCard } from "../../cards/definitions/improved-card-types";
import type { ExternalCardData } from "../../cards/import-converter";

// ============================================================================
// CORE CONVERSION TYPES
// ============================================================================

/**
 * Result of any conversion operation
 */
export interface ConversionResult<T = GundamCard> {
  readonly success: T[];
  readonly errors: ConversionError[];
  readonly warnings: string[];
}

/**
 * Detailed conversion error information
 */
export interface ConversionError {
  readonly cardId: string;
  readonly severity: "error" | "warning" | "info";
  readonly category: ErrorCategory;
  readonly field?: string;
  readonly message: string;
  readonly suggestion?: string;
  readonly originalValue?: unknown;
}

/**
 * Categories of conversion errors
 */
export type ErrorCategory =
  | "parsing"
  | "validation"
  | "type-conversion"
  | "ability-extraction"
  | "file-generation"
  | "gap-analysis";

/**
 * Validation result for any validation operation
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: ConversionError[];
  readonly warnings: string[];
}

/**
 * Set-level conversion result
 */
export interface SetConversionResult extends ConversionResult<GundamCard> {
  readonly setId: string;
  readonly processedCount: number;
  readonly skippedCount: number;
}

// ============================================================================
// GAP ANALYSIS TYPES
// ============================================================================

/**
 * Analysis of import data structure and patterns
 */
export interface ImportDataAnalysis {
  readonly totalCards: number;
  readonly fieldUsage: Record<string, FieldUsageInfo>;
  readonly cardTypeDistribution: Record<string, number>;
  readonly setDistribution: Record<string, number>;
  readonly uniqueValues: Record<string, Set<string>>;
}

/**
 * Information about field usage patterns
 */
export interface FieldUsageInfo {
  readonly frequency: number;
  readonly percentage: number;
  readonly dataTypes: Set<string>;
  readonly sampleValues: unknown[];
  readonly nullCount: number;
  readonly emptyCount: number;
}

/**
 * Analysis of current type system
 */
export interface TypeSystemAnalysis {
  readonly definedTypes: string[];
  readonly missingFields: string[];
  readonly incompleteTypes: string[];
  readonly recommendations: TypeImprovement[];
}

/**
 * Analysis of game rules and mechanics
 */
export interface GameRulesAnalysis {
  readonly timingKeywords: string[];
  readonly keywordEffects: string[];
  readonly gameMechanics: string[];
  readonly missingImplementations: string[];
}

/**
 * Comprehensive gap analysis report
 */
export interface GapAnalysisReport {
  readonly importAnalysis: ImportDataAnalysis;
  readonly typeAnalysis: TypeSystemAnalysis;
  readonly rulesAnalysis: GameRulesAnalysis;
  readonly gaps: {
    readonly missingFields: FieldGap[];
    readonly missingAbilities: AbilityGap[];
    readonly missingEffects: EffectGap[];
    readonly typeImprovements: TypeImprovement[];
  };
  readonly recommendations: string[];
  readonly priority: "high" | "medium" | "low";
}

/**
 * Identified field gaps
 */
export interface FieldGap {
  readonly fieldName: string;
  readonly usage: FieldUsageInfo;
  readonly currentType?: string;
  readonly suggestedType: string;
  readonly impact: "critical" | "important" | "minor";
}

/**
 * Identified ability gaps
 */
export interface AbilityGap {
  readonly abilityName: string;
  readonly frequency: number;
  readonly currentImplementation?: string;
  readonly suggestedImplementation: string;
  readonly complexity: "simple" | "moderate" | "complex";
}

/**
 * Identified effect gaps
 */
export interface EffectGap {
  readonly effectName: string;
  readonly frequency: number;
  readonly currentImplementation?: string;
  readonly suggestedImplementation: string;
  readonly gameRuleReference?: string;
}

/**
 * Type system improvement recommendations
 */
export interface TypeImprovement {
  readonly typeName: string;
  readonly currentDefinition?: string;
  readonly suggestedDefinition: string;
  readonly reason: string;
  readonly breakingChange: boolean;
}

// ============================================================================
// FILE ORGANIZATION TYPES
// ============================================================================

/**
 * Generated file information
 */
export interface GeneratedFile {
  readonly path: string;
  readonly content: string;
  readonly type: "card-definition" | "index" | "types";
  readonly dependencies: string[];
}

/**
 * File generation options
 */
export interface FileGenerationOptions {
  readonly outputDirectory: string;
  readonly overwriteExisting: boolean;
  readonly createBackups: boolean;
  readonly validateOutput: boolean;
  readonly formatCode: boolean;
}

/**
 * Directory structure information
 */
export interface DirectoryStructure {
  readonly basePath: string;
  readonly setDirectories: string[];
  readonly indexFiles: string[];
  readonly cardFiles: string[];
}

// ============================================================================
// PROCESSING OPTIONS
// ============================================================================

/**
 * Options for batch processing
 */
export interface BatchProcessingOptions {
  readonly sets?: string[];
  readonly incremental: boolean;
  readonly parallel: boolean;
  readonly maxConcurrency?: number;
  readonly continueOnError: boolean;
  readonly reportProgress: boolean;
}

/**
 * Progress reporting information
 */
export interface ProcessingProgress {
  readonly currentSet: string;
  readonly currentCard: string;
  readonly processedCards: number;
  readonly totalCards: number;
  readonly errors: number;
  readonly warnings: number;
  readonly startTime: Date;
  readonly estimatedCompletion?: Date;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Configuration for the conversion system
 */
export interface ConverterConfig {
  readonly inputDirectory: string;
  readonly outputDirectory: string;
  readonly rulesFile: string;
  readonly currentTypesFile: string;
  readonly fileGeneration: FileGenerationOptions;
  readonly batchProcessing: BatchProcessingOptions;
  readonly validation: {
    readonly strict: boolean;
    readonly skipTypeCheck: boolean;
    readonly allowPartialConversion: boolean;
  };
}

/**
 * Card processing context
 */
export interface CardProcessingContext {
  readonly setId: string;
  readonly cardIndex: number;
  readonly totalCards: number;
  readonly importData: ExternalCardData;
  readonly processingOptions: BatchProcessingOptions;
}

/**
 * Utility type for branded strings
 */
export type Brand<T, B> = T & { readonly __brand: B };

/**
 * Branded types for type safety
 */
export type CardId = Brand<string, "CardId">;
export type SetId = Brand<string, "SetId">;
export type FilePath = Brand<string, "FilePath">;

/**
 * Type guard utilities
 */
export const isConversionError = (error: unknown): error is ConversionError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "cardId" in error &&
    "severity" in error &&
    "category" in error &&
    "message" in error
  );
};

export const isValidationResult = (
  result: unknown,
): result is ValidationResult => {
  return (
    typeof result === "object" &&
    result !== null &&
    "isValid" in result &&
    "errors" in result &&
    "warnings" in result
  );
};
