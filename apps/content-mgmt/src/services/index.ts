/**
 * Services Module
 *
 * Re-exports all services for the Content Management Service.
 */

// Extraction Services
export {
  BaseExtractionAdapter,
  type ContentMetadata,
  type ContentSegment,
  createSupadataAdapter,
  type ExtractionConfig,
  type ExtractionResult,
  type ExtractionServiceAdapter,
  ExtractionServiceRegistry,
  extractionServiceRegistry,
  type FetchContentOptions,
  getExtractionService,
  getExtractionServiceForUrl,
  type ParsedUrl,
  type RawContent,
  registerExtractionService,
  type SourceType,
  type SupadataClient,
  SupadataExtractionAdapter,
  type ValidationError,
  type ValidationResult,
  type ValidationRule,
} from "./extraction";

// Pipeline Services
export {
  type AIProvider,
  ContentIngestionService,
  createContentIngestionService,
  createExtractionService,
  createPostprocessingService,
  createPreprocessingService,
  createProcessingService,
  type ExtractionOptions,
  ExtractionService,
  formatTranscriptForPrompt,
  getTranscriptExcerpt,
  type PipelineStageHandlers,
  type PostprocessingOptions,
  PostprocessingService,
  type PreprocessingOptions,
  PreprocessingService,
  type ProcessingOptions,
  ProcessingService,
  SUMMARY_FORMATS,
  SUMMARY_TYPES,
  SUPADATA_PREPROCESSING_PROMPTS,
  SUPADATA_PROCESSING_PROMPTS,
  type SummaryFormat,
  type SummaryType,
} from "./pipeline";
