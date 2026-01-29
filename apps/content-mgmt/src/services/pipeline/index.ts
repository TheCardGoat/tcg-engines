/**
 * Pipeline Services Module
 *
 * Provides services for the content ingestion pipeline stages:
 * extraction → preprocessing → processing → postprocessing
 */

// Content Ingestion Service (Orchestrator)
export {
  ContentIngestionService,
  createContentIngestionService,
  type PipelineStageHandlers,
} from "./content-ingestion";

// Extraction Service
export {
  createExtractionService,
  type ExtractionOptions,
  ExtractionService,
} from "./extraction-service";
// Postprocessing Service
export {
  createPostprocessingService,
  type PostprocessingOptions,
  PostprocessingService,
} from "./postprocessing-service";
// Preprocessing Service
export {
  type AIProvider,
  createPreprocessingService,
  type PreprocessingOptions,
  PreprocessingService,
} from "./preprocessing-service";
// Processing Service
export {
  createProcessingService,
  type ProcessingOptions,
  ProcessingService,
} from "./processing-service";

// Prompts
export {
  formatTranscriptForPrompt,
  getTranscriptExcerpt,
  SUMMARY_FORMATS,
  SUMMARY_TYPES,
  SUPADATA_PREPROCESSING_PROMPTS,
  SUPADATA_PROCESSING_PROMPTS,
  type SummaryFormat,
  type SummaryType,
} from "./prompts";
