/**
 * Extraction Services Module
 *
 * Provides extraction service adapters for different content sources.
 * Each adapter implements the ExtractionServiceAdapter interface.
 */

// Base adapter
export { BaseExtractionAdapter } from "./base";

// Registry
export {
  ExtractionServiceRegistry,
  extractionServiceRegistry,
  getExtractionService,
  getExtractionServiceForUrl,
  registerExtractionService,
} from "./registry";

// Adapters
export {
  createSupadataAdapter,
  type SupadataClient,
  SupadataExtractionAdapter,
} from "./supadata-adapter";

export {
  createTabstackAdapter,
  type TabstackClient,
  TabstackExtractionAdapter,
} from "./tabstack-adapter";

// Types
export type {
  ContentMetadata,
  ContentSegment,
  ExtractionConfig,
  ExtractionResult,
  ExtractionServiceAdapter,
  FetchContentOptions,
  ParsedUrl,
  RawContent,
  SourceType,
  ValidationError,
  ValidationResult,
  ValidationRule,
} from "./types";
