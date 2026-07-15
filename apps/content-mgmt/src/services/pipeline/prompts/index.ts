/**
 * Pipeline Prompts Module
 *
 * Service-specific prompts for preprocessing and processing stages.
 */

// Supadata (YouTube) processing prompts
export {
  SUMMARY_FORMATS,
  SUMMARY_TYPES,
  SUPADATA_PROCESSING_PROMPTS,
  type SummaryFormat,
  type SummaryType,
} from "./supadata-processing-prompts";
// Supadata (YouTube) preprocessing prompts
export {
  formatTranscriptForPrompt,
  getTranscriptExcerpt,
  SUPADATA_PREPROCESSING_PROMPTS,
} from "./supadata-prompts";

// Tabstack (Article) prompts
export {
  getArticleExcerpt,
  TABSTACK_PREPROCESSING_PROMPTS,
  TABSTACK_PROCESSING_PROMPTS,
} from "./tabstack-prompts";
