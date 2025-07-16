/**
 * Interfaces for the File Organization component
 */

import type { GundamCard } from "../../cards/definitions/improved-card-types";
import type {
  BatchProcessingOptions,
  ConversionResult,
  DirectoryStructure,
  FileGenerationOptions,
  GeneratedFile,
  ValidationResult,
} from "../shared/types";

// ============================================================================
// CORE FILE ORGANIZER INTERFACE
// ============================================================================

/**
 * Main interface for file organization functionality
 */
export interface FileOrganizer {
  /**
   * Generates TypeScript card definition file for a single card
   */
  generateCardFile(card: GundamCard): Promise<ConversionResult<GeneratedFile>>;

  /**
   * Creates set-level index file with proper exports
   */
  generateSetIndex(
    setCards: GundamCard[],
  ): Promise<ConversionResult<GeneratedFile>>;

  /**
   * Creates master index file exporting all sets
   */
  generateMasterIndex(
    allSets: string[],
  ): Promise<ConversionResult<GeneratedFile>>;

  /**
   * Validates generated file structure and content
   */
  validateFileStructure(): Promise<ValidationResult>;

  /**
   * Processes batch file generation with organization
   */
  organizeBatch(
    cardsBySet: Record<string, GundamCard[]>,
    options: BatchProcessingOptions,
  ): Promise<ConversionResult<GeneratedFile>>;
}

// ============================================================================
// FILE GENERATION INTERFACES
// ============================================================================

/**
 * Interface for generating individual card files
 */
export interface FileGenerator {
  /**
   * Creates TypeScript card definition files
   */
  generateCardDefinitionFile(card: GundamCard): ConversionResult<GeneratedFile>;

  /**
   * Generates proper import statements
   */
  generateImportStatements(card: GundamCard): string[];

  /**
   * Creates export naming conventions
   */
  generateExportStatement(card: GundamCard): string;

  /**
   * Formats card definition as TypeScript code
   */
  formatCardDefinition(card: GundamCard): string;

  /**
   * Validates generated TypeScript syntax
   */
  validateTypeScriptSyntax(content: string): ValidationResult;
}

/**
 * Interface for generating index files
 */
export interface IndexGenerator {
  /**
   * Creates set-level index files with re-exports
   */
  generateSetIndex(setCards: GundamCard[]): ConversionResult<GeneratedFile>;

  /**
   * Creates master index aggregating all sets
   */
  generateMasterIndex(setIds: string[]): ConversionResult<GeneratedFile>;

  /**
   * Generates proper re-export statements
   */
  generateReExportStatements(cards: GundamCard[]): string[];

  /**
   * Creates type aggregation exports
   */
  generateTypeAggregation(setIds: string[]): string[];

  /**
   * Validates index file completeness
   */
  validateIndexCompleteness(
    indexFile: GeneratedFile,
    expectedCards: GundamCard[],
  ): ValidationResult;
}

/**
 * Interface for code formatting and validation
 */
export interface CodeFormatter {
  /**
   * Formats TypeScript code according to project standards
   */
  formatTypeScript(code: string): ConversionResult<string>;

  /**
   * Validates code syntax and compilation
   */
  validateSyntax(code: string): ValidationResult;

  /**
   * Adds proper code comments and documentation
   */
  addDocumentation(code: string, card: GundamCard): string;

  /**
   * Ensures consistent code style
   */
  enforceCodeStyle(code: string): ConversionResult<string>;
}

// ============================================================================
// DIRECTORY MANAGEMENT INTERFACES
// ============================================================================

/**
 * Interface for managing directory structure
 */
export interface DirectoryManager {
  /**
   * Creates and manages set-based folder structure
   */
  createSetDirectories(
    setIds: string[],
  ): Promise<ConversionResult<DirectoryStructure>>;

  /**
   * Enforces naming convention compliance
   */
  enforceNamingConventions(path: string): ConversionResult<string>;

  /**
   * Resolves naming conflicts
   */
  resolveNamingConflicts(
    existingFiles: string[],
    newFile: string,
  ): ConversionResult<string>;

  /**
   * Validates directory structure integrity
   */
  validateDirectoryStructure(basePath: string): ValidationResult;

  /**
   * Cleans up orphaned or invalid files
   */
  cleanupInvalidFiles(
    directoryPath: string,
  ): Promise<ConversionResult<string[]>>;
}

/**
 * Interface for file path management
 */
export interface PathManager {
  /**
   * Generates file paths following project conventions
   */
  generateCardFilePath(card: GundamCard): string;

  /**
   * Generates index file paths
   */
  generateIndexFilePath(setId: string): string;

  /**
   * Resolves relative import paths
   */
  resolveImportPath(fromFile: string, toFile: string): string;

  /**
   * Validates path format and accessibility
   */
  validatePath(path: string): ValidationResult;

  /**
   * Ensures path uniqueness
   */
  ensureUniqueFilename(basePath: string, filename: string): string;
}

// ============================================================================
// FILE SYSTEM INTERFACES
// ============================================================================

/**
 * Interface for file system operations
 */
export interface FileSystemManager {
  /**
   * Writes generated files to disk
   */
  writeFile(
    file: GeneratedFile,
    options: FileGenerationOptions,
  ): Promise<ConversionResult<string>>;

  /**
   * Reads existing files for comparison
   */
  readExistingFile(path: string): Promise<ConversionResult<string>>;

  /**
   * Creates backup copies of existing files
   */
  createBackup(filePath: string): Promise<ConversionResult<string>>;

  /**
   * Validates file write permissions
   */
  validateWritePermissions(directory: string): Promise<ValidationResult>;

  /**
   * Handles file conflicts and overwrites
   */
  handleFileConflicts(
    existingPath: string,
    newContent: string,
    options: FileGenerationOptions,
  ): Promise<ConversionResult<string>>;
}

/**
 * Interface for incremental file updates
 */
export interface IncrementalUpdater {
  /**
   * Detects changes in card definitions
   */
  detectChanges(oldCard: GundamCard, newCard: GundamCard): boolean;

  /**
   * Updates only modified files
   */
  updateModifiedFiles(
    changes: Record<string, GundamCard>,
    options: FileGenerationOptions,
  ): Promise<ConversionResult<GeneratedFile>>;

  /**
   * Preserves manual modifications when possible
   */
  preserveManualChanges(
    originalContent: string,
    generatedContent: string,
  ): ConversionResult<string>;

  /**
   * Tracks file modification history
   */
  trackModificationHistory(
    filePath: string,
  ): Promise<ConversionResult<FileModificationRecord>>;
}

// ============================================================================
// BATCH PROCESSING INTERFACES
// ============================================================================

/**
 * Interface for coordinating batch file operations
 */
export interface BatchFileProcessor {
  /**
   * Processes multiple card sets for file generation
   */
  processBatch(
    cardsBySet: Record<string, GundamCard[]>,
    options: BatchProcessingOptions,
  ): Promise<ConversionResult<GeneratedFile>>;

  /**
   * Handles parallel file generation
   */
  generateFilesParallel(
    cards: GundamCard[],
    maxConcurrency: number,
  ): Promise<ConversionResult<GeneratedFile>>;

  /**
   * Coordinates index file generation after card files
   */
  generateIndexFiles(
    cardsBySet: Record<string, GundamCard[]>,
  ): Promise<ConversionResult<GeneratedFile>>;

  /**
   * Validates batch processing results
   */
  validateBatchResults(
    results: ConversionResult<GeneratedFile>,
    expectedCards: GundamCard[],
  ): ValidationResult;
}

// ============================================================================
// CONFIGURATION AND OPTIONS
// ============================================================================

/**
 * Configuration for file organization
 */
export interface FileOrganizationConfig {
  readonly paths: {
    readonly baseOutputDirectory: string;
    readonly cardDefinitionsPath: string;
    readonly indexFilePath: string;
    readonly backupDirectory?: string;
  };
  readonly naming: {
    readonly cardFilePattern: string;
    readonly indexFileName: string;
    readonly useKebabCase: boolean;
    readonly includePrefixes: boolean;
  };
  readonly generation: {
    readonly formatCode: boolean;
    readonly addDocumentation: boolean;
    readonly validateSyntax: boolean;
    readonly createBackups: boolean;
  };
  readonly processing: {
    readonly overwriteExisting: boolean;
    readonly preserveManualChanges: boolean;
    readonly continueOnError: boolean;
    readonly maxConcurrency: number;
  };
}

/**
 * Options for code generation
 */
export interface CodeGenerationOptions {
  readonly includeComments: boolean;
  readonly includeTypeAnnotations: boolean;
  readonly useReadonlyModifiers: boolean;
  readonly generateJSDoc: boolean;
  readonly formatStyle: "prettier" | "biome" | "custom";
  readonly indentSize: number;
  readonly maxLineLength: number;
}

/**
 * File modification tracking record
 */
export interface FileModificationRecord {
  readonly filePath: string;
  readonly lastModified: Date;
  readonly generatedAt: Date;
  readonly hasManualChanges: boolean;
  readonly changeHash: string;
  readonly backupPath?: string;
}
