/**
 * Interfaces for the Validation System component
 */

import type { GundamCard } from "../../cards/definitions/improved-card-types";
import type {
  ConversionError,
  ConversionResult,
  SetConversionResult,
  ValidationResult,
} from "../shared/types";

// ============================================================================
// CORE VALIDATION SYSTEM INTERFACE
// ============================================================================

/**
 * Main interface for validation functionality
 */
export interface ValidationSystem {
  /**
   * Validates a single converted card
   */
  validateCard(card: GundamCard): Promise<ValidationResult>;

  /**
   * Validates a complete card set
   */
  validateSet(cards: GundamCard[]): Promise<ValidationResult>;

  /**
   * Validates cross-card relationships and references
   */
  validateCrossReferences(cards: GundamCard[]): Promise<ValidationResult>;

  /**
   * Validates TypeScript compilation of generated files
   */
  validateTypeScriptCompilation(filePaths: string[]): Promise<ValidationResult>;

  /**
   * Runs comprehensive validation suite
   */
  runFullValidation(
    cards: GundamCard[],
    filePaths: string[],
  ): Promise<ConversionResult<ValidationReport>>;
}

// ============================================================================
// VALIDATION RULE INTERFACES
// ============================================================================

/**
 * Base interface for all validation rules
 */
export interface ValidationRule {
  /**
   * Unique identifier for the rule
   */
  readonly id: string;

  /**
   * Human-readable name of the rule
   */
  readonly name: string;

  /**
   * Description of what the rule validates
   */
  readonly description: string;

  /**
   * Severity level of rule violations
   */
  readonly severity: "error" | "warning" | "info";

  /**
   * Validates a card against this rule
   */
  validate(card: GundamCard): ValidationResult;

  /**
   * Checks if this rule applies to the given card
   */
  appliesTo(card: GundamCard): boolean;
}

/**
 * Interface for card-level validation rules
 */
export interface CardValidator {
  /**
   * Collection of validation rules
   */
  readonly rules: ValidationRule[];

  /**
   * Validates a card against all applicable rules
   */
  validateCard(card: GundamCard): ValidationResult;

  /**
   * Adds a new validation rule
   */
  addRule(rule: ValidationRule): void;

  /**
   * Removes a validation rule by ID
   */
  removeRule(ruleId: string): boolean;

  /**
   * Gets all rules that apply to a specific card
   */
  getApplicableRules(card: GundamCard): ValidationRule[];
}

/**
 * Interface for set-level validation
 */
export interface SetValidator {
  /**
   * Validates consistency across all cards in a set
   */
  validateSet(cards: GundamCard[]): ValidationResult;

  /**
   * Validates card numbering and uniqueness
   */
  validateCardNumbering(cards: GundamCard[]): ValidationResult;

  /**
   * Validates set-specific rules and constraints
   */
  validateSetConstraints(cards: GundamCard[]): ValidationResult;

  /**
   * Validates cross-card references (link requirements, etc.)
   */
  validateCrossReferences(cards: GundamCard[]): ValidationResult;
}

// ============================================================================
// SPECIFIC VALIDATION RULE INTERFACES
// ============================================================================

/**
 * Interface for required field validation
 */
export interface RequiredFieldValidator extends ValidationRule {
  /**
   * List of required fields for each card type
   */
  readonly requiredFields: Record<string, string[]>;

  /**
   * Validates that all required fields are present
   */
  validateRequiredFields(card: GundamCard): ValidationResult;

  /**
   * Checks if a field value is considered valid (not null/empty)
   */
  isValidFieldValue(value: unknown): boolean;
}

/**
 * Interface for type consistency validation
 */
export interface TypeConsistencyValidator extends ValidationRule {
  /**
   * Validates that field types match expected types
   */
  validateFieldTypes(card: GundamCard): ValidationResult;

  /**
   * Validates enum values are within allowed ranges
   */
  validateEnumValues(card: GundamCard): ValidationResult;

  /**
   * Validates numeric ranges and constraints
   */
  validateNumericConstraints(card: GundamCard): ValidationResult;
}

/**
 * Interface for game rule compliance validation
 */
export interface GameRuleValidator extends ValidationRule {
  /**
   * Validates card follows game rules from RULES.md
   */
  validateGameRuleCompliance(card: GundamCard): ValidationResult;

  /**
   * Validates ability timing and activation rules
   */
  validateAbilityRules(card: GundamCard): ValidationResult;

  /**
   * Validates keyword effect usage
   */
  validateKeywordEffects(card: GundamCard): ValidationResult;

  /**
   * Validates card type specific rules
   */
  validateCardTypeRules(card: GundamCard): ValidationResult;
}

/**
 * Interface for ability validation
 */
export interface AbilityValidator extends ValidationRule {
  /**
   * Validates ability structure and completeness
   */
  validateAbilityStructure(card: GundamCard): ValidationResult;

  /**
   * Validates ability targets and effects
   */
  validateAbilityTargets(card: GundamCard): ValidationResult;

  /**
   * Validates ability timing and restrictions
   */
  validateAbilityTiming(card: GundamCard): ValidationResult;

  /**
   * Validates ability cost and activation requirements
   */
  validateAbilityCosts(card: GundamCard): ValidationResult;
}

// ============================================================================
// ERROR HANDLING INTERFACES
// ============================================================================

/**
 * Interface for error categorization and handling
 */
export interface ErrorHandler {
  /**
   * Categorizes validation errors by type and severity
   */
  categorizeError(error: ConversionError): ValidationErrorCategory;

  /**
   * Determines if an error is recoverable
   */
  isRecoverableError(error: ConversionError): boolean;

  /**
   * Suggests fixes for common validation errors
   */
  suggestFix(error: ConversionError): string | undefined;

  /**
   * Handles error recovery strategies
   */
  handleError(error: ConversionError, card: GundamCard): ValidationResult;
}

/**
 * Interface for error recovery strategies
 */
export interface ErrorRecoveryStrategy {
  /**
   * Attempts to recover from field-level errors
   */
  recoverFieldError(
    error: ConversionError,
    card: GundamCard,
  ): ConversionResult<GundamCard>;

  /**
   * Attempts to recover from ability-level errors
   */
  recoverAbilityError(
    error: ConversionError,
    card: GundamCard,
  ): ConversionResult<GundamCard>;

  /**
   * Attempts to recover from card-level errors
   */
  recoverCardError(
    error: ConversionError,
    card: GundamCard,
  ): ConversionResult<GundamCard>;

  /**
   * Determines if recovery is possible for the given error
   */
  canRecover(error: ConversionError): boolean;
}

// ============================================================================
// COMPILATION VALIDATION INTERFACES
// ============================================================================

/**
 * Interface for TypeScript compilation validation
 */
export interface TypeScriptValidator {
  /**
   * Validates that generated files compile without errors
   */
  validateCompilation(filePaths: string[]): Promise<ValidationResult>;

  /**
   * Checks for TypeScript syntax errors
   */
  checkSyntaxErrors(filePath: string): Promise<ValidationResult>;

  /**
   * Validates import/export statements
   */
  validateImportsExports(filePath: string): Promise<ValidationResult>;

  /**
   * Runs type checking on generated files
   */
  runTypeCheck(filePaths: string[]): Promise<ValidationResult>;

  /**
   * Validates that all generated types are properly exported
   */
  validateTypeExports(filePaths: string[]): Promise<ValidationResult>;
}

/**
 * Interface for runtime validation
 */
export interface RuntimeValidator {
  /**
   * Validates that cards can be instantiated at runtime
   */
  validateCardInstantiation(cards: GundamCard[]): Promise<ValidationResult>;

  /**
   * Validates that cards integrate with existing game systems
   */
  validateGameIntegration(cards: GundamCard[]): Promise<ValidationResult>;

  /**
   * Validates that card abilities can be executed
   */
  validateAbilityExecution(cards: GundamCard[]): Promise<ValidationResult>;
}

// ============================================================================
// REPORTING INTERFACES
// ============================================================================

/**
 * Interface for validation reporting
 */
export interface ValidationReporter {
  /**
   * Generates comprehensive validation report
   */
  generateReport(results: ValidationResult[]): ValidationReport;

  /**
   * Formats validation errors for display
   */
  formatErrors(errors: ConversionError[]): string[];

  /**
   * Creates summary statistics
   */
  generateSummary(results: ValidationResult[]): ValidationSummary;

  /**
   * Exports validation results to file
   */
  exportResults(
    results: ValidationResult[],
    format: "json" | "html" | "markdown",
  ): Promise<ConversionResult<string>>;
}

// ============================================================================
// CONFIGURATION AND DATA TYPES
// ============================================================================

/**
 * Configuration for validation system
 */
export interface ValidationConfig {
  readonly rules: {
    readonly enabledRules: string[];
    readonly disabledRules: string[];
    readonly customRules: ValidationRule[];
  };
  readonly processing: {
    readonly strictMode: boolean;
    readonly continueOnError: boolean;
    readonly maxErrors: number;
    readonly parallelValidation: boolean;
  };
  readonly reporting: {
    readonly includeWarnings: boolean;
    readonly includeInfo: boolean;
    readonly generateSummary: boolean;
    readonly exportFormat: "json" | "html" | "markdown";
  };
}

/**
 * Comprehensive validation report
 */
export interface ValidationReport {
  readonly summary: ValidationSummary;
  readonly cardResults: Record<string, ValidationResult>;
  readonly setResults: ValidationResult[];
  readonly compilationResults: ValidationResult;
  readonly crossReferenceResults: ValidationResult;
  readonly recommendations: string[];
  readonly generatedAt: Date;
}

/**
 * Validation summary statistics
 */
export interface ValidationSummary {
  readonly totalCards: number;
  readonly validCards: number;
  readonly cardsWithErrors: number;
  readonly cardsWithWarnings: number;
  readonly totalErrors: number;
  readonly totalWarnings: number;
  readonly errorsByCategory: Record<string, number>;
  readonly mostCommonErrors: Array<{ error: string; count: number }>;
  readonly validationDuration: number;
}

/**
 * Validation-specific error category classification
 */
export type ValidationErrorCategory =
  | "required-field"
  | "type-mismatch"
  | "game-rule-violation"
  | "ability-structure"
  | "cross-reference"
  | "compilation"
  | "runtime"
  | "custom";

/**
 * Validation context for rule execution
 */
export interface ValidationContext {
  readonly cardId: string;
  readonly setId: string;
  readonly allCards: GundamCard[];
  readonly validationConfig: ValidationConfig;
  readonly customData?: Record<string, unknown>;
}
