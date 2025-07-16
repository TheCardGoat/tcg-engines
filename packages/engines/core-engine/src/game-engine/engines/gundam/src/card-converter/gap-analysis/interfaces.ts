/**
 * Interfaces for the Gap Analysis component
 */

import type { ExternalCardData } from "../../cards/import-converter";
import type {
  ConversionResult,
  FieldUsageInfo,
  GameRulesAnalysis,
  GapAnalysisReport,
  ImportDataAnalysis,
  TypeSystemAnalysis,
} from "../shared/types";

// ============================================================================
// CORE GAP ANALYZER INTERFACE
// ============================================================================

/**
 * Main interface for gap analysis functionality
 */
export interface GapAnalyzer {
  /**
   * Analyzes import data structure and patterns
   */
  analyzeImportData(importFiles: string[]): Promise<ImportDataAnalysis>;

  /**
   * Analyzes current type system for gaps and improvements
   */
  analyzeCurrentTypes(typesFile: string): Promise<TypeSystemAnalysis>;

  /**
   * Analyzes game rules to identify missing mechanics
   */
  analyzeGameRules(rulesFile: string): Promise<GameRulesAnalysis>;

  /**
   * Generates comprehensive gap analysis report
   */
  generateGapReport(): Promise<GapAnalysisReport>;

  /**
   * Validates analysis results
   */
  validateAnalysis(): Promise<ConversionResult<GapAnalysisReport>>;
}

// ============================================================================
// SPECIALIZED ANALYZER INTERFACES
// ============================================================================

/**
 * Interface for analyzing import data
 */
export interface ImportDataAnalyzer {
  /**
   * Scans JSON files and catalogs field usage patterns
   */
  scanImportFiles(filePaths: string[]): Promise<ImportDataAnalysis>;

  /**
   * Analyzes field frequency and data type patterns
   */
  analyzeFieldUsage(cards: ExternalCardData[]): FieldUsageInfo[];

  /**
   * Detects data type patterns for each field
   */
  detectDataTypes(fieldValues: unknown[]): Set<string>;

  /**
   * Identifies unique values and patterns
   */
  catalogUniqueValues(cards: ExternalCardData[]): Record<string, Set<string>>;
}

/**
 * Interface for analyzing current type system
 */
export interface TypeSystemAnalyzer {
  /**
   * Parses existing type definitions
   */
  parseTypeDefinitions(typesFile: string): Promise<TypeSystemAnalysis>;

  /**
   * Extracts current type definitions using AST parsing
   */
  extractCurrentTypes(sourceCode: string): string[];

  /**
   * Identifies gaps in current type system
   */
  identifyTypeGaps(importAnalysis: ImportDataAnalysis): string[];

  /**
   * Generates type improvement recommendations
   */
  generateTypeRecommendations(
    gaps: string[],
  ): TypeSystemAnalysis["recommendations"];
}

/**
 * Interface for analyzing game rules
 */
export interface GameRulesAnalyzer {
  /**
   * Parses RULES.md and extracts game mechanics
   */
  parseGameRules(rulesFile: string): Promise<GameRulesAnalysis>;

  /**
   * Extracts timing keywords from rules text
   */
  extractTimingKeywords(rulesText: string): string[];

  /**
   * Extracts keyword effects from rules text
   */
  extractKeywordEffects(rulesText: string): string[];

  /**
   * Identifies game mechanics that need type representation
   */
  identifyGameMechanics(rulesText: string): string[];

  /**
   * Finds missing implementations in current type system
   */
  findMissingImplementations(
    mechanics: string[],
    currentTypes: string[],
  ): string[];
}

/**
 * Interface for generating gap analysis reports
 */
export interface GapAnalysisReportGenerator {
  /**
   * Combines all analysis results into comprehensive report
   */
  generateReport(
    importAnalysis: ImportDataAnalysis,
    typeAnalysis: TypeSystemAnalysis,
    rulesAnalysis: GameRulesAnalysis,
  ): GapAnalysisReport;

  /**
   * Prioritizes gaps by impact and frequency
   */
  prioritizeGaps(report: GapAnalysisReport): GapAnalysisReport;

  /**
   * Generates actionable recommendations
   */
  generateRecommendations(report: GapAnalysisReport): string[];

  /**
   * Validates report completeness and accuracy
   */
  validateReport(
    report: GapAnalysisReport,
  ): ConversionResult<GapAnalysisReport>;
}

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

/**
 * Configuration for gap analysis
 */
export interface GapAnalysisConfig {
  readonly importDirectory: string;
  readonly typesFile: string;
  readonly rulesFile: string;
  readonly outputFile?: string;
  readonly includeDetailedAnalysis: boolean;
  readonly generateRecommendations: boolean;
  readonly validateResults: boolean;
}

/**
 * Options for import data analysis
 */
export interface ImportAnalysisOptions {
  readonly includePromotionalCards: boolean;
  readonly includeTokenCards: boolean;
  readonly minFieldUsageThreshold: number;
  readonly sampleSize?: number;
}

/**
 * Options for type system analysis
 */
export interface TypeAnalysisOptions {
  readonly includePrivateTypes: boolean;
  readonly analyzeImports: boolean;
  readonly checkTypeUsage: boolean;
  readonly generateMigrationPlan: boolean;
}

/**
 * Options for rules analysis
 */
export interface RulesAnalysisOptions {
  readonly includeExamples: boolean;
  readonly extractPatterns: boolean;
  readonly crossReferenceTypes: boolean;
  readonly generateImplementationSuggestions: boolean;
}
