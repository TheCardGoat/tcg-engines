/**
 * Gundam Card Converter - Main Entry Point
 *
 * This module provides a comprehensive system for converting Gundam card import data
 * into properly typed TypeScript card definitions with enhanced type safety and
 * game rule compliance.
 */

// ============================================================================
// SHARED TYPES AND UTILITIES
// ============================================================================

export * from "./shared";

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

// Conversion Engine
export * from "./conversion-engine/interfaces";
// File Organization
export * from "./file-organization/interfaces";

// Validation System
export * from "./validation/interfaces";

// ============================================================================
// MAIN CONVERTER INTERFACE
// ============================================================================

import type { GundamCard } from "../cards/definitions/improved-card-types";
import type { ExternalCardData } from "../cards/import-converter";
import type { ConversionEngine } from "./conversion-engine/interfaces";
import type { FileOrganizer } from "./file-organization/interfaces";
import type {
  BatchProcessingOptions,
  ConversionResult,
  ConverterConfig,
  GapAnalysisReport,
  SetConversionResult,
  ValidationResult,
} from "./shared/types";
import type { ValidationSystem } from "./validation/interfaces";

/**
 * Main interface for the complete Gundam Card Converter system
 *
 * This interface coordinates all components of the conversion pipeline:
 * Enhanced Types → Conversion Engine → File Organization
 */
export interface GundamCardConverter {
  /**
   * Conversion engine for transforming import data to typed definitions
   */
  readonly conversionEngine: ConversionEngine;

  /**
   * File organization system for structured output generation
   */
  readonly fileOrganizer: FileOrganizer;

  /**
   * Validation system for ensuring conversion quality
   */
  readonly validationSystem: ValidationSystem;

  /**
   * Converter configuration
   */
  readonly config: ConverterConfig;

  // ========================================================================
  // HIGH-LEVEL OPERATIONS
  // ========================================================================

  /**
   * Runs complete gap analysis and generates improvement recommendations
   */
  analyzeGaps(): Promise<ConversionResult<GapAnalysisReport>>;

  /**
   * Converts a single card from import data to typed definition
   */
  convertCard(
    importData: ExternalCardData,
  ): Promise<ConversionResult<GundamCard>>;

  /**
   * Converts a complete card set with validation and file generation
   */
  convertSet(
    setId: string,
    importData: ExternalCardData[],
  ): Promise<SetConversionResult>;

  /**
   * Processes all card sets in batch with comprehensive validation
   */
  convertAllSets(
    importData: Record<string, ExternalCardData[]>,
    options?: BatchProcessingOptions,
  ): Promise<ConversionResult<GundamCard>>;

  /**
   * Validates existing converted cards and generated files
   */
  validateExistingCards(
    cards: GundamCard[],
    filePaths: string[],
  ): Promise<ValidationResult>;

  /**
   * Runs incremental conversion for updated import data
   */
  runIncrementalUpdate(
    changedData: Record<string, ExternalCardData[]>,
    options?: BatchProcessingOptions,
  ): Promise<ConversionResult<GundamCard>>;

  // ========================================================================
  // UTILITY OPERATIONS
  // ========================================================================

  /**
   * Validates converter configuration
   */
  validateConfig(): ValidationResult;

  /**
   * Gets conversion statistics and metrics
   */
  getConversionMetrics(): Promise<ConversionMetrics>;

  /**
   * Exports conversion results in various formats
   */
  exportResults(
    results: ConversionResult<GundamCard>,
    format: "json" | "csv" | "html",
  ): Promise<ConversionResult<string>>;

  /**
   * Cleans up temporary files and resources
   */
  cleanup(): Promise<void>;
}

/**
 * Factory interface for creating converter instances
 */
export interface GundamCardConverterFactory {
  /**
   * Creates a new converter instance with the given configuration
   */
  create(config: ConverterConfig): Promise<GundamCardConverter>;

  /**
   * Creates a converter with default configuration
   */
  createDefault(): Promise<GundamCardConverter>;

  /**
   * Validates configuration before creating converter
   */
  validateConfig(config: ConverterConfig): ValidationResult;
}

/**
 * Conversion metrics and statistics
 */
export interface ConversionMetrics {
  readonly totalCards: number;
  readonly successfulConversions: number;
  readonly failedConversions: number;
  readonly conversionRate: number;
  readonly averageProcessingTime: number;
  readonly errorsByCategory: Record<string, number>;
  readonly warningsByCategory: Record<string, number>;
  readonly setStatistics: Record<string, SetMetrics>;
  readonly generatedFiles: number;
  readonly validationResults: {
    readonly passedValidation: number;
    readonly failedValidation: number;
    readonly validationRate: number;
  };
}

/**
 * Per-set conversion metrics
 */
export interface SetMetrics {
  readonly setId: string;
  readonly totalCards: number;
  readonly convertedCards: number;
  readonly errors: number;
  readonly warnings: number;
  readonly processingTime: number;
  readonly generatedFiles: string[];
}

// ============================================================================
// CONVENIENCE TYPES
// ============================================================================

/**
 * Options for high-level converter operations
 */
export interface ConverterOperationOptions {
  readonly validateInput?: boolean;
  readonly validateOutput?: boolean;
  readonly generateFiles?: boolean;
  readonly continueOnError?: boolean;
  readonly reportProgress?: boolean;
  readonly includeMetrics?: boolean;
}

/**
 * Result of high-level converter operations
 */
export interface ConverterOperationResult<T = GundamCard>
  extends ConversionResult<T> {
  readonly metrics?: ConversionMetrics;
  readonly generatedFiles?: string[];
  readonly validationResults?: ValidationResult;
  readonly processingTime?: number;
}
